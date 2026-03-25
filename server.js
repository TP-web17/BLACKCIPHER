"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const HOST = "0.0.0.0";
const PORT = Number(process.env.PORT || 3000);
const SESSION_COOKIE = "blackcipher_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const TYPING_TTL_MS = 4000;
const MAX_BODY_BYTES = 18 * 1024 * 1024;
const STATE_FILE_NAME = "blackcipher-state.json";
const STATIC_ROOT = __dirname;
const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || process.env.DATA_DIR || path.join(__dirname, "data");
const STATE_FILE = path.join(DATA_DIR, STATE_FILE_NAME);
const MIME_TYPES = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8",
    ".webp": "image/webp"
};

const DEFAULT_CHANNELS = [
    {
        id: "channel-war-room",
        name: "war-room",
        description: "Operacoes gerais, combinacoes rapidas e coordenacao do workspace."
    },
    {
        id: "channel-ops-feed",
        name: "ops-feed",
        description: "Atualizacoes curtas, sinalizacao e avisos importantes."
    },
    {
        id: "channel-ghost-lab",
        name: "ghost-lab",
        description: "Testes, ideias novas, rascunhos e exploracao de taticas."
    }
];

const AUTO_DELETE_OPTIONS = new Set([0, 30000, 300000, 3600000]);
const LAB_MAX_HISTORY = 160;
const LAB_MAX_FILES = 120;
const LAB_MAX_FILE_SIZE = 12000;
const LAB_MAX_ENTRY_TEXT = 2000;
const auditCipherKey = crypto.createHash("sha256").update("blackcipher-open-audit-log").digest();
const typingState = new Map();
const streamClients = new Set();

let state = loadState();

class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

function createId() {
    if (typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `id-${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
}

function cleanDisplayName(value) {
    return String(value || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 48);
}

function sanitizeUsername(value) {
    return String(value || "")
        .trim()
        .replace(/\s+/g, "")
        .slice(0, 24);
}

function normalizeUsername(value) {
    return sanitizeUsername(value).toLowerCase();
}

function sanitizeConversationName(value, type = "channel") {
    const collapsed = String(value || "")
        .trim()
        .replace(/\s+/g, type === "channel" ? "-" : " ")
        .slice(0, 60);

    return type === "channel" ? collapsed.toLowerCase() : collapsed;
}

function sanitizeDescription(value) {
    return String(value || "")
        .trim()
        .replace(/\s+/g, " ")
        .slice(0, 220);
}

function normalizeAutoDeleteMs(value) {
    const parsed = Number(value || 0);
    return AUTO_DELETE_OPTIONS.has(parsed) ? parsed : 0;
}

function validateUsername(username) {
    if (!/^[a-zA-Z0-9._-]{3,24}$/.test(username)) {
        return "Use de 3 a 24 caracteres com letras, numeros, ponto, underline ou hifen.";
    }

    return "";
}

function validatePassword(password) {
    if (String(password || "").length < 6) {
        return "A senha precisa ter pelo menos 6 caracteres.";
    }

    return "";
}

function normalizeLabPath(value) {
    const raw = String(value || "/").replace(/\\/g, "/").trim();
    const segments = [];

    raw.split("/").forEach((segment) => {
        const piece = segment.trim();
        if (!piece || piece === ".") {
            return;
        }

        if (piece === "..") {
            segments.pop();
            return;
        }

        segments.push(piece.slice(0, 48));
    });

    return `/${segments.join("/")}`.replace(/\/{2,}/g, "/") || "/";
}

function getLabParentPath(labPath) {
    const normalized = normalizeLabPath(labPath);

    if (normalized === "/") {
        return "";
    }

    const segments = normalized.split("/").filter(Boolean);
    segments.pop();
    return segments.length ? `/${segments.join("/")}` : "/";
}

function createDefaultLabState(user = {}) {
    const loginKey = normalizeUsername(user.loginKey || user.username || "operator") || "operator";
    const now = Date.now();

    return {
        version: 1,
        cwd: "/home",
        files: {
            "/": { type: "dir" },
            "/home": { type: "dir" },
            "/home/readme.txt": {
                type: "file",
                content: `BlackCipher Labs\nuser: @${loginKey}\ncommands: help, ls, cd, mkdir, touch, write, cat, rm, tree, site, open, clear, resetlab.\n`
            },
            "/home/site.txt": {
                type: "file",
                content: "Try: site / or site /api/health"
            }
        },
        history: [
            {
                id: createId(),
                type: "system",
                text: "Lab seguro pronto. Digite help.",
                at: now
            }
        ],
        updatedAt: now
    };
}

function normalizeLabHistoryEntry(entry) {
    const type = ["input", "output", "error", "system"].includes(entry?.type) ? entry.type : "system";
    const text = String(entry?.text || "").replace(/\r\n/g, "\n").slice(0, LAB_MAX_ENTRY_TEXT);

    if (!text) {
        return null;
    }

    return {
        id: entry?.id || createId(),
        type,
        text,
        at: Number(entry?.at || Date.now())
    };
}

function normalizeLabState(labState, user = {}) {
    if (!labState || typeof labState !== "object" || Array.isArray(labState)) {
        return createDefaultLabState(user);
    }

    const fileMap = new Map();
    const rawFiles = labState.files && typeof labState.files === "object" && !Array.isArray(labState.files)
        ? Object.entries(labState.files)
        : [];

    rawFiles.slice(0, LAB_MAX_FILES).forEach(([rawPath, rawEntry]) => {
        const pathKey = normalizeLabPath(rawPath);
        if (!pathKey) {
            return;
        }

        const type = rawEntry?.type === "file" ? "file" : "dir";
        if (pathKey === "/" || pathKey === "/home") {
            fileMap.set(pathKey, { type: "dir" });
            return;
        }

        if (type === "file") {
            fileMap.set(pathKey, {
                type,
                content: String(rawEntry?.content || "").replace(/\r\n/g, "\n").slice(0, LAB_MAX_FILE_SIZE)
            });
            return;
        }

        fileMap.set(pathKey, { type: "dir" });
    });

    fileMap.set("/", { type: "dir" });
    fileMap.set("/home", { type: "dir" });

    Array.from(fileMap.keys()).forEach((filePath) => {
        let parentPath = getLabParentPath(filePath);

        while (parentPath) {
            if (!fileMap.has(parentPath)) {
                fileMap.set(parentPath, { type: "dir" });
            }

            if (parentPath === "/") {
                break;
            }

            parentPath = getLabParentPath(parentPath);
        }
    });

    const history = Array.isArray(labState.history)
        ? labState.history
            .slice(-LAB_MAX_HISTORY)
            .map(normalizeLabHistoryEntry)
            .filter(Boolean)
        : [];

    const cwd = normalizeLabPath(labState.cwd || "/home");
    const safeCwd = fileMap.has(cwd) && fileMap.get(cwd)?.type === "dir" ? cwd : "/home";

    return {
        version: 1,
        cwd: safeCwd,
        files: Object.fromEntries(
            Array.from(fileMap.entries())
                .sort((left, right) => left[0].localeCompare(right[0], "en"))
                .slice(0, LAB_MAX_FILES)
        ),
        history: history.length ? history : createDefaultLabState(user).history,
        updatedAt: Number(labState.updatedAt || Date.now())
    };
}

function normalizeUserRecord(user) {
    const username = sanitizeUsername(user.username || user.loginKey || "user");
    const loginKey = normalizeUsername(user.loginKey || username || user.id || "user");
    const displayName = cleanDisplayName(user.displayName || username || loginKey) || username || loginKey;

    return {
        id: user.id || createId(),
        username: username || "user",
        loginKey: loginKey || `user-${Math.random().toString(36).slice(2, 6)}`,
        displayName,
        statusText: cleanDisplayName(user.statusText || user.status || "online na rede") || "online na rede",
        bio: String(user.bio || "").trim().slice(0, 260),
        avatarDataUrl: typeof user.avatarDataUrl === "string" ? user.avatarDataUrl : "",
        passwordHash: typeof user.passwordHash === "string" ? user.passwordHash : "",
        autoDeleteMs: normalizeAutoDeleteMs(user.autoDeleteMs),
        createdAt: Number(user.createdAt || Date.now()),
        lastLoginAt: Number(user.lastLoginAt || user.createdAt || Date.now()),
        labState: normalizeLabState(user.labState, {
            username,
            loginKey,
            displayName
        })
    };
}

function normalizeConversationRecord(conversation) {
    const type = ["channel", "dm", "group"].includes(conversation.type) ? conversation.type : "channel";
    const memberIds = Array.isArray(conversation.memberIds)
        ? Array.from(new Set(conversation.memberIds.filter(Boolean)))
        : [];

    return {
        id: conversation.id || createId(),
        type,
        name: sanitizeConversationName(conversation.name || "", type),
        description: sanitizeDescription(conversation.description || ""),
        memberIds: type === "channel" ? [] : memberIds,
        createdBy: conversation.createdBy || "system",
        createdAt: Number(conversation.createdAt || Date.now()),
        updatedAt: Number(conversation.updatedAt || conversation.createdAt || Date.now())
    };
}

function normalizeMessageRecord(message) {
    return {
        id: message.id || createId(),
        conversationId: String(message.conversationId || DEFAULT_CHANNELS[0].id),
        authorId: String(message.authorId || ""),
        text: String(message.text || "").replace(/\r\n/g, "\n"),
        imageDataUrl: typeof message.imageDataUrl === "string" ? message.imageDataUrl : "",
        imageName: String(message.imageName || ""),
        createdAt: Number(message.createdAt || Date.now()),
        editedAt: message.editedAt ? Number(message.editedAt) : null,
        expiresAt: message.expiresAt ? Number(message.expiresAt) : null
    };
}

function normalizeAuditEntry(entry) {
    return {
        id: entry.id || createId(),
        actorId: entry.actorId || "",
        actorName: cleanDisplayName(entry.actorName || "Sistema") || "Sistema",
        actorHandle: normalizeUsername(entry.actorHandle || "system") || "system",
        action: cleanDisplayName(entry.action || "evento") || "evento",
        detail: String(entry.detail || "").trim().slice(0, 240),
        payloadCipher: String(entry.payloadCipher || ""),
        createdAt: Number(entry.createdAt || Date.now())
    };
}

function normalizeSessionRecord(session) {
    return {
        id: session.id || createId(),
        tokenHash: String(session.tokenHash || ""),
        userId: String(session.userId || ""),
        createdAt: Number(session.createdAt || Date.now()),
        lastSeenAt: Number(session.lastSeenAt || session.createdAt || Date.now()),
        expiresAt: Number(session.expiresAt || Date.now() + SESSION_TTL_MS)
    };
}

function createDefaultChannel(channel) {
    const now = Date.now();
    return normalizeConversationRecord({
        id: channel.id,
        type: "channel",
        name: channel.name,
        description: channel.description,
        createdBy: "system",
        createdAt: now,
        updatedAt: now
    });
}

function ensureDefaultChannels(conversations) {
    const conversationMap = new Map(conversations.map((conversation) => [conversation.id, conversation]));

    DEFAULT_CHANNELS.forEach((channel) => {
        if (!conversationMap.has(channel.id)) {
            conversationMap.set(channel.id, createDefaultChannel(channel));
        }
    });

    return Array.from(conversationMap.values());
}

function ensureDataDir() {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadState() {
    ensureDataDir();

    if (!fs.existsSync(STATE_FILE)) {
        return {
            schemaVersion: 1,
            users: [],
            conversations: ensureDefaultChannels([]),
            messages: [],
            auditLog: [],
            sessions: []
        };
    }

    try {
        const raw = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));

        return {
            schemaVersion: 1,
            users: Array.isArray(raw.users) ? raw.users.map(normalizeUserRecord) : [],
            conversations: ensureDefaultChannels(
                Array.isArray(raw.conversations) ? raw.conversations.map(normalizeConversationRecord) : []
            ),
            messages: Array.isArray(raw.messages) ? raw.messages.map(normalizeMessageRecord) : [],
            auditLog: Array.isArray(raw.auditLog) ? raw.auditLog.map(normalizeAuditEntry).slice(0, 180) : [],
            sessions: Array.isArray(raw.sessions) ? raw.sessions.map(normalizeSessionRecord) : []
        };
    } catch (error) {
        console.error("Nao foi possivel carregar o estado persistido.", error);
        return {
            schemaVersion: 1,
            users: [],
            conversations: ensureDefaultChannels([]),
            messages: [],
            auditLog: [],
            sessions: []
        };
    }
}

function persistState() {
    ensureDataDir();
    const tempFile = `${STATE_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(state, null, 2), "utf8");
    fs.renameSync(tempFile, STATE_FILE);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
    const derived = crypto.scryptSync(String(password || ""), salt, 64);
    return `scrypt:${salt}:${derived.toString("hex")}`;
}

function verifyPassword(password, passwordHash) {
    const [algorithm, salt, expectedHash] = String(passwordHash || "").split(":");

    if (algorithm !== "scrypt" || !salt || !expectedHash) {
        return false;
    }

    const derived = crypto.scryptSync(String(password || ""), salt, 64).toString("hex");
    const expected = Buffer.from(expectedHash, "hex");
    const actual = Buffer.from(derived, "hex");

    if (expected.length !== actual.length) {
        return false;
    }

    return crypto.timingSafeEqual(expected, actual);
}

function hashToken(token) {
    return crypto.createHash("sha256").update(String(token || "")).digest("hex");
}

function createSession(userId) {
    const token = crypto.randomBytes(32).toString("base64url");
    const now = Date.now();

    state.sessions.push(normalizeSessionRecord({
        id: createId(),
        tokenHash: hashToken(token),
        userId,
        createdAt: now,
        lastSeenAt: now,
        expiresAt: now + SESSION_TTL_MS
    }));

    return token;
}

function parseCookies(cookieHeader = "") {
    return cookieHeader
        .split(";")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .reduce((accumulator, entry) => {
            const separatorIndex = entry.indexOf("=");
            if (separatorIndex === -1) {
                return accumulator;
            }

            const key = entry.slice(0, separatorIndex).trim();
            const value = entry.slice(separatorIndex + 1).trim();
            accumulator[key] = decodeURIComponent(value);
            return accumulator;
        }, {});
}

function shouldUseSecureCookie(request) {
    const forwardedProtocol = String(request.headers["x-forwarded-proto"] || "");
    return forwardedProtocol.includes("https") || process.env.NODE_ENV === "production";
}

function setSessionCookie(response, request, token) {
    const cookieParts = [
        `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
        "Path=/",
        "HttpOnly",
        "SameSite=Lax",
        `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
    ];

    if (shouldUseSecureCookie(request)) {
        cookieParts.push("Secure");
    }

    response.setHeader("Set-Cookie", cookieParts.join("; "));
}

function clearSessionCookie(response, request) {
    const cookieParts = [
        `${SESSION_COOKIE}=`,
        "Path=/",
        "HttpOnly",
        "SameSite=Lax",
        "Max-Age=0"
    ];

    if (shouldUseSecureCookie(request)) {
        cookieParts.push("Secure");
    }

    response.setHeader("Set-Cookie", cookieParts.join("; "));
}

function getUserById(userId) {
    return state.users.find((user) => user.id === userId) || null;
}

function getConversationById(conversationId) {
    return state.conversations.find((conversation) => conversation.id === conversationId) || null;
}

function getConversationMessages(conversationId) {
    return state.messages
        .filter((message) => message.conversationId === conversationId)
        .sort((left, right) => left.createdAt - right.createdAt);
}

function getLastMessage(conversationId) {
    const conversationMessages = getConversationMessages(conversationId);
    return conversationMessages[conversationMessages.length - 1] || null;
}

function getConversationActivityAt(conversation) {
    return getLastMessage(conversation.id)?.createdAt || conversation.updatedAt || conversation.createdAt;
}

function getUserDisplayName(user) {
    return cleanDisplayName(user?.displayName || user?.username || user?.loginKey || "Conta") || "Conta";
}

function isConversationVisibleToUser(conversation, userId) {
    if (conversation.type === "channel") {
        return true;
    }

    return conversation.memberIds.includes(userId);
}

function getVisibleConversationIds(userId) {
    return new Set(
        state.conversations
            .filter((conversation) => isConversationVisibleToUser(conversation, userId))
            .map((conversation) => conversation.id)
    );
}

function getConversationMembers(conversation) {
    if (!conversation) {
        return [];
    }

    if (conversation.type === "channel") {
        return [...state.users].sort((left, right) => getUserDisplayName(left).localeCompare(getUserDisplayName(right), "pt-BR"));
    }

    return conversation.memberIds
        .map((memberId) => getUserById(memberId))
        .filter(Boolean)
        .sort((left, right) => getUserDisplayName(left).localeCompare(getUserDisplayName(right), "pt-BR"));
}

function getOtherDmMember(conversation, userId) {
    if (!conversation || conversation.type !== "dm") {
        return null;
    }

    return getConversationMembers(conversation).find((member) => member.id !== userId) || null;
}

function getConversationDisplayName(conversation, userId) {
    if (!conversation) {
        return "Sem conversa";
    }

    if (conversation.type === "channel") {
        return `# ${conversation.name}`;
    }

    if (conversation.type === "dm") {
        const otherMember = getOtherDmMember(conversation, userId);
        return otherMember ? getUserDisplayName(otherMember) : "PV privado";
    }

    if (conversation.name) {
        return conversation.name;
    }

    const memberNames = getConversationMembers(conversation)
        .filter((member) => member.id !== userId)
        .map((member) => getUserDisplayName(member));

    return memberNames.join(", ") || "Grupo privado";
}

function sanitizeUserForClient(user) {
    return {
        id: user.id,
        username: user.username,
        loginKey: user.loginKey,
        displayName: user.displayName,
        statusText: user.statusText,
        bio: user.bio,
        avatarDataUrl: user.avatarDataUrl,
        autoDeleteMs: user.autoDeleteMs,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt
    };
}

function sanitizeLabStateForClient(labState, user) {
    return normalizeLabState(labState, user);
}

function sanitizeConversationForClient(conversation) {
    return {
        id: conversation.id,
        type: conversation.type,
        name: conversation.name,
        description: conversation.description,
        memberIds: [...conversation.memberIds],
        createdBy: conversation.createdBy,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
    };
}

function sanitizeMessageForClient(message) {
    return {
        id: message.id,
        conversationId: message.conversationId,
        authorId: message.authorId,
        text: message.text,
        imageDataUrl: message.imageDataUrl,
        imageName: message.imageName,
        createdAt: message.createdAt,
        editedAt: message.editedAt,
        expiresAt: message.expiresAt
    };
}

function sanitizeAuditForClient(entry) {
    return {
        id: entry.id,
        actorId: entry.actorId,
        actorName: entry.actorName,
        actorHandle: entry.actorHandle,
        action: entry.action,
        detail: entry.detail,
        payloadCipher: entry.payloadCipher,
        createdAt: entry.createdAt
    };
}

function getAuthContext(request) {
    cleanExpiredSessions();
    const cookies = parseCookies(request.headers.cookie || "");
    const token = cookies[SESSION_COOKIE];

    if (!token) {
        return null;
    }

    const tokenHash = hashToken(token);
    const session = state.sessions.find((entry) => entry.tokenHash === tokenHash);

    if (!session || session.expiresAt <= Date.now()) {
        return null;
    }

    const user = getUserById(session.userId);
    if (!user) {
        return null;
    }

    return {
        user,
        session,
        tokenHash
    };
}

function requireAuth(request) {
    const auth = getAuthContext(request);

    if (!auth) {
        throw new HttpError(401, "Sessao invalida. Faca login novamente.");
    }

    return auth;
}

function cleanExpiredSessions() {
    const now = Date.now();
    const before = state.sessions.length;
    state.sessions = state.sessions.filter((session) => session.expiresAt > now && getUserById(session.userId));
    return before !== state.sessions.length;
}

function pruneTypingEntries() {
    const now = Date.now();
    let changed = false;

    Array.from(typingState.entries()).forEach(([key, value]) => {
        if (now - value.at > TYPING_TTL_MS || !getUserById(value.userId) || !getConversationById(value.conversationId)) {
            typingState.delete(key);
            changed = true;
        }
    });

    return changed;
}

function pruneExpiredMessages() {
    const now = Date.now();
    const before = state.messages.length;
    state.messages = state.messages.filter((message) => !message.expiresAt || message.expiresAt > now);
    return before !== state.messages.length;
}

function clearTypingForConversation(conversationId) {
    let changed = false;

    Array.from(typingState.entries()).forEach(([key, value]) => {
        if (value.conversationId === conversationId) {
            typingState.delete(key);
            changed = true;
        }
    });

    return changed;
}

function clearTypingForUser(userId, conversationId = "") {
    let changed = false;

    Array.from(typingState.entries()).forEach(([key, value]) => {
        const isSameUser = value.userId === userId;
        const isSameConversation = !conversationId || value.conversationId === conversationId;

        if (isSameUser && isSameConversation) {
            typingState.delete(key);
            changed = true;
        }
    });

    return changed;
}

function ensureConversationAccess(userId, conversationId) {
    const conversation = getConversationById(conversationId);

    if (!conversation) {
        throw new HttpError(404, "Conversa nao encontrada.");
    }

    if (!isConversationVisibleToUser(conversation, userId)) {
        throw new HttpError(403, "Voce nao faz parte desta conversa.");
    }

    return conversation;
}

function ensureEditableConversation(userId, conversationId) {
    const conversation = ensureConversationAccess(userId, conversationId);

    if (conversation.type === "dm") {
        throw new HttpError(400, "PV direto nao pode ser editado por este endpoint.");
    }

    return conversation;
}

function buildTypingPayloadForUser(userId) {
    pruneTypingEntries();
    const visibleConversationIds = getVisibleConversationIds(userId);
    const payload = {};

    Array.from(typingState.entries()).forEach(([key, value]) => {
        if (!visibleConversationIds.has(value.conversationId)) {
            return;
        }

        payload[key] = {
            conversationId: value.conversationId,
            userId: value.userId,
            at: value.at
        };
    });

    return payload;
}

function buildSnapshot(userId) {
    pruneExpiredMessages();
    pruneTypingEntries();

    const user = getUserById(userId);
    if (!user) {
        throw new HttpError(401, "Sessao invalida.");
    }

    const visibleConversationIds = getVisibleConversationIds(userId);

    return {
        currentUser: sanitizeUserForClient(user),
        labState: sanitizeLabStateForClient(user.labState, user),
        users: state.users
            .map(sanitizeUserForClient)
            .sort((left, right) => left.displayName.localeCompare(right.displayName, "pt-BR")),
        conversations: state.conversations
            .filter((conversation) => visibleConversationIds.has(conversation.id))
            .sort((left, right) => getConversationActivityAt(right) - getConversationActivityAt(left))
            .map(sanitizeConversationForClient),
        messages: state.messages
            .filter((message) => visibleConversationIds.has(message.conversationId))
            .sort((left, right) => left.createdAt - right.createdAt)
            .map(sanitizeMessageForClient),
        typing: buildTypingPayloadForUser(userId),
        auditLog: [...state.auditLog]
            .sort((left, right) => right.createdAt - left.createdAt)
            .slice(0, 120)
            .map(sanitizeAuditForClient),
        serverTime: Date.now()
    };
}

function sendJson(response, statusCode, payload) {
    const body = JSON.stringify(payload);
    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Length": Buffer.byteLength(body)
    });
    response.end(body);
}

function sendSseEvent(response, eventName, payload) {
    response.write(`event: ${eventName}\n`);
    response.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function closeStreamClient(client) {
    if (!streamClients.has(client)) {
        return;
    }

    streamClients.delete(client);

    try {
        client.response.end();
    } catch (error) {
        console.error("Falha ao encerrar stream SSE.", error);
    }
}

function broadcastSnapshots(reason = "sync") {
    if (!streamClients.size) {
        return;
    }

    const cache = new Map();

    Array.from(streamClients).forEach((client) => {
        if (!getUserById(client.userId)) {
            closeStreamClient(client);
            return;
        }

        let payload = cache.get(client.userId);

        if (!payload) {
            payload = {
                reason,
                snapshot: buildSnapshot(client.userId)
            };
            cache.set(client.userId, payload);
        }

        sendSseEvent(client.response, "snapshot", payload);
    });
}

function broadcastTyping(reason = "typing") {
    if (!streamClients.size) {
        return;
    }

    const cache = new Map();

    Array.from(streamClients).forEach((client) => {
        if (!getUserById(client.userId)) {
            closeStreamClient(client);
            return;
        }

        let payload = cache.get(client.userId);

        if (!payload) {
            payload = {
                reason,
                typing: buildTypingPayloadForUser(client.userId)
            };
            cache.set(client.userId, payload);
        }

        sendSseEvent(client.response, "typing", payload);
    });
}

function endSessionStreams(tokenHash) {
    Array.from(streamClients).forEach((client) => {
        if (client.tokenHash !== tokenHash) {
            return;
        }

        sendSseEvent(client.response, "session-ended", {
            reason: "logout"
        });
        closeStreamClient(client);
    });
}

function commitState(reason = "sync") {
    cleanExpiredSessions();
    persistState();
    broadcastSnapshots(reason);
}

function encryptAuditPayload(payload) {
    if (!payload) {
        return "";
    }

    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", auditCipherKey, iv);
    const encrypted = Buffer.concat([cipher.update(String(payload), "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, encrypted, authTag]).toString("hex");
}

function appendAuditLog({ actorId = "", action = "", detail = "", payload = "" }) {
    const actor = getUserById(actorId);

    state.auditLog = [
        normalizeAuditEntry({
            id: createId(),
            actorId: actor?.id || "",
            actorName: getUserDisplayName(actor),
            actorHandle: actor?.loginKey || "system",
            action,
            detail,
            payloadCipher: payload ? encryptAuditPayload(payload) : "",
            createdAt: Date.now()
        }),
        ...state.auditLog
    ].slice(0, 180);
}

function updateConversation(conversationId, patch) {
    state.conversations = state.conversations.map((conversation) => {
        if (conversation.id !== conversationId) {
            return conversation;
        }

        return normalizeConversationRecord({
            ...conversation,
            ...patch,
            updatedAt: Date.now()
        });
    });
}

function readJsonBody(request) {
    return new Promise((resolve, reject) => {
        let size = 0;
        const chunks = [];
        let settled = false;

        request.on("data", (chunk) => {
            if (settled) {
                return;
            }

            size += chunk.length;

            if (size > MAX_BODY_BYTES) {
                settled = true;
                reject(new HttpError(413, "Payload muito grande para este servidor."));
                request.destroy();
                return;
            }

            chunks.push(chunk);
        });

        request.on("end", () => {
            if (settled) {
                return;
            }

            if (!chunks.length) {
                resolve({});
                return;
            }

            try {
                const raw = Buffer.concat(chunks).toString("utf8");
                resolve(raw ? JSON.parse(raw) : {});
            } catch (error) {
                reject(new HttpError(400, "JSON invalido."));
            }
        });

        request.on("error", (error) => {
            if (!settled) {
                reject(error);
            }
        });
    });
}

function handleApiError(response, request, error) {
    if (error instanceof HttpError) {
        if (error.status === 401) {
            clearSessionCookie(response, request);
        }

        sendJson(response, error.status, {
            ok: false,
            error: error.message
        });
        return;
    }

    console.error("Erro interno no servidor.", error);
    sendJson(response, 500, {
        ok: false,
        error: "Erro interno no servidor."
    });
}

function serveFile(response, filePath) {
    const extension = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[extension] || "application/octet-stream";
    const fileBuffer = fs.readFileSync(filePath);
    const disableCache = [".html", ".css", ".js", ".ico", ".png", ".jpg", ".jpeg", ".svg", ".webp"].includes(extension);
    const headers = {
        "Content-Type": mimeType,
        "Cache-Control": disableCache ? "no-store, no-cache, must-revalidate" : "public, max-age=3600",
        "Content-Length": fileBuffer.length
    };

    if (disableCache) {
        headers.Pragma = "no-cache";
        headers.Expires = "0";
    }

    response.writeHead(200, headers);
    response.end(fileBuffer);
}

function resolveStaticFile(pathname) {
    const requestedPath = pathname === "/" ? "/index.html" : pathname;
    const relativePath = requestedPath.replace(/^\/+/, "");
    const normalizedPath = path.normalize(relativePath);

    if (normalizedPath.startsWith("..")) {
        return "";
    }

    const absolutePath = path.join(STATIC_ROOT, normalizedPath);

    if (!absolutePath.startsWith(STATIC_ROOT)) {
        return "";
    }

    if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).isDirectory()) {
        return "";
    }

    return absolutePath;
}

function parseRoute(request) {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    return {
        method: request.method || "GET",
        pathname: url.pathname,
        searchParams: url.searchParams
    };
}

async function handleSession(request, response) {
    const auth = getAuthContext(request);

    if (!auth) {
        sendJson(response, 200, {
            authenticated: false
        });
        return;
    }

    sendJson(response, 200, {
        authenticated: true,
        snapshot: buildSnapshot(auth.user.id)
    });
}

async function handleRegister(request, response) {
    const body = await readJsonBody(request);
    const username = sanitizeUsername(body.username);
    const loginKey = normalizeUsername(body.username);
    const password = String(body.password || "");

    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError) {
        throw new HttpError(400, usernameError);
    }

    if (passwordError) {
        throw new HttpError(400, passwordError);
    }

    if (state.users.some((user) => user.loginKey === loginKey)) {
        throw new HttpError(409, "Esse usuario ja existe. Faca login ou escolha outro nome.");
    }

    const now = Date.now();
    const newUser = normalizeUserRecord({
        id: createId(),
        username,
        loginKey,
        displayName: username,
        statusText: "online na rede",
        bio: "",
        avatarDataUrl: "",
        passwordHash: hashPassword(password),
        autoDeleteMs: 0,
        labState: createDefaultLabState({
            username,
            loginKey,
            displayName: username
        }),
        createdAt: now,
        lastLoginAt: now
    });

    state.users.push(newUser);
    const token = createSession(newUser.id);

    appendAuditLog({
        actorId: newUser.id,
        action: "criou conta",
        detail: `Nova conta sincronizada @${newUser.loginKey} registrada e autenticada.`
    });

    commitState("register");
    setSessionCookie(response, request, token);
    sendJson(response, 201, {
        ok: true,
        snapshot: buildSnapshot(newUser.id)
    });
}

async function handleLogin(request, response) {
    const body = await readJsonBody(request);
    const loginKey = normalizeUsername(body.username);
    const password = String(body.password || "");

    if (!loginKey) {
        throw new HttpError(400, "Digite o usuario da conta.");
    }

    const user = state.users.find((entry) => entry.loginKey === loginKey);
    if (!user) {
        throw new HttpError(404, "Usuario nao encontrado.");
    }

    if (!verifyPassword(password, user.passwordHash)) {
        throw new HttpError(401, "Senha incorreta.");
    }

    user.lastLoginAt = Date.now();
    const token = createSession(user.id);

    appendAuditLog({
        actorId: user.id,
        action: "entrou",
        detail: `Login sincronizado confirmado para @${user.loginKey}.`
    });

    commitState("login");
    setSessionCookie(response, request, token);
    sendJson(response, 200, {
        ok: true,
        snapshot: buildSnapshot(user.id)
    });
}

async function handleLogout(request, response) {
    const auth = getAuthContext(request);

    if (auth) {
        state.sessions = state.sessions.filter((session) => session.tokenHash !== auth.tokenHash);

        appendAuditLog({
            actorId: auth.user.id,
            action: "saiu",
            detail: `Sessao encerrada por @${auth.user.loginKey}.`
        });

        commitState("logout");
        endSessionStreams(auth.tokenHash);
    }

    clearSessionCookie(response, request);
    sendJson(response, 200, {
        ok: true
    });
}

async function handleProfileUpdate(request, response) {
    const auth = requireAuth(request);
    const body = await readJsonBody(request);
    const displayName = cleanDisplayName(body.displayName);

    if (!displayName) {
        throw new HttpError(400, "Informe um nome visivel para o perfil.");
    }

    auth.user.displayName = displayName;
    auth.user.statusText = cleanDisplayName(body.statusText || "online na rede") || "online na rede";
    auth.user.bio = String(body.bio || "").trim().slice(0, 260);
    auth.user.avatarDataUrl = typeof body.avatarDataUrl === "string" ? body.avatarDataUrl : "";

    appendAuditLog({
        actorId: auth.user.id,
        action: "editou perfil",
        detail: `Perfil atualizado para ${displayName}.`
    });

    commitState("profile");
    sendJson(response, 200, {
        ok: true,
        snapshot: buildSnapshot(auth.user.id)
    });
}

async function handlePreferencesUpdate(request, response) {
    const auth = requireAuth(request);
    const body = await readJsonBody(request);
    auth.user.autoDeleteMs = normalizeAutoDeleteMs(body.autoDeleteMs);

    appendAuditLog({
        actorId: auth.user.id,
        action: "ajustou autoexclusao",
        detail: `Modo atual definido como ${auth.user.autoDeleteMs ? `${auth.user.autoDeleteMs} ms` : "desativado"}.`
    });

    commitState("preferences");
    sendJson(response, 200, {
        ok: true,
        snapshot: buildSnapshot(auth.user.id)
    });
}

async function handleLabUpdate(request, response) {
    const auth = requireAuth(request);
    const body = await readJsonBody(request);

    auth.user.labState = normalizeLabState(body.labState, auth.user);
    auth.user.labState.updatedAt = Date.now();

    commitState("lab");
    sendJson(response, 200, {
        ok: true,
        labState: sanitizeLabStateForClient(auth.user.labState, auth.user)
    });
}

async function handleConversationCreate(request, response) {
    const auth = requireAuth(request);
    const body = await readJsonBody(request);
    const type = body.type === "group" ? "group" : "channel";
    const name = sanitizeConversationName(body.name, type);
    const description = sanitizeDescription(body.description);

    if (!name) {
        throw new HttpError(400, "Defina um nome para a conversa.");
    }

    const now = Date.now();
    let memberIds = [];

    if (type === "group") {
        const requestedMembers = Array.isArray(body.memberIds) ? body.memberIds.filter(Boolean) : [];
        const validMemberIds = requestedMembers.filter((memberId) => getUserById(memberId));
        memberIds = Array.from(new Set([auth.user.id, ...validMemberIds]));

        if (memberIds.length < 2) {
            throw new HttpError(400, "Grupos precisam ter pelo menos dois membros.");
        }
    }

    const conversation = normalizeConversationRecord({
        id: createId(),
        type,
        name,
        description,
        memberIds,
        createdBy: auth.user.id,
        createdAt: now,
        updatedAt: now
    });

    state.conversations.unshift(conversation);

    appendAuditLog({
        actorId: auth.user.id,
        action: type === "channel" ? "criou canal" : "criou grupo",
        detail: type === "channel"
            ? `Canal #${conversation.name} criado no workspace.`
            : `Grupo ${conversation.name} criado com ${conversation.memberIds.length} membros.`
    });

    commitState("conversation-create");
    sendJson(response, 201, {
        ok: true,
        conversationId: conversation.id,
        snapshot: buildSnapshot(auth.user.id)
    });
}

async function handleDirectMessageCreate(request, response) {
    const auth = requireAuth(request);
    const body = await readJsonBody(request);
    const otherUserId = String(body.otherUserId || "");

    if (!otherUserId || otherUserId === auth.user.id) {
        throw new HttpError(400, "Escolha outro usuario para abrir o PV.");
    }

    const otherUser = getUserById(otherUserId);
    if (!otherUser) {
        throw new HttpError(404, "Usuario nao encontrado.");
    }

    const targetMembers = [auth.user.id, otherUserId].sort();
    const existingConversation = state.conversations.find((conversation) => {
        if (conversation.type !== "dm" || conversation.memberIds.length !== 2) {
            return false;
        }

        return [...conversation.memberIds].sort().join("|") === targetMembers.join("|");
    });

    if (existingConversation) {
        sendJson(response, 200, {
            ok: true,
            conversationId: existingConversation.id,
            snapshot: buildSnapshot(auth.user.id)
        });
        return;
    }

    const now = Date.now();
    const conversation = normalizeConversationRecord({
        id: createId(),
        type: "dm",
        name: "",
        description: "",
        memberIds: targetMembers,
        createdBy: auth.user.id,
        createdAt: now,
        updatedAt: now
    });

    state.conversations.unshift(conversation);

    appendAuditLog({
        actorId: auth.user.id,
        action: "abriu pv",
        detail: `Chat privado iniciado com @${otherUser.loginKey}.`
    });

    commitState("direct-message");
    sendJson(response, 201, {
        ok: true,
        conversationId: conversation.id,
        snapshot: buildSnapshot(auth.user.id)
    });
}

async function handleConversationUpdate(request, response, conversationId) {
    const auth = requireAuth(request);
    const conversation = ensureEditableConversation(auth.user.id, conversationId);
    const body = await readJsonBody(request);
    const name = sanitizeConversationName(body.name, conversation.type);
    const description = sanitizeDescription(body.description);

    if (!name) {
        throw new HttpError(400, "Defina um nome para a conversa.");
    }

    updateConversation(conversation.id, {
        name,
        description
    });

    appendAuditLog({
        actorId: auth.user.id,
        action: "editou sala",
        detail: `${getConversationDisplayName(conversation, auth.user.id)} atualizada para ${name}.`
    });

    commitState("conversation-update");
    sendJson(response, 200, {
        ok: true,
        snapshot: buildSnapshot(auth.user.id)
    });
}

async function handleConversationDelete(request, response, conversationId) {
    const auth = requireAuth(request);
    const conversation = ensureEditableConversation(auth.user.id, conversationId);
    const conversationLabel = getConversationDisplayName(conversation, auth.user.id);

    state.conversations = state.conversations.filter((entry) => entry.id !== conversationId);
    state.messages = state.messages.filter((message) => message.conversationId !== conversationId);
    clearTypingForConversation(conversationId);

    appendAuditLog({
        actorId: auth.user.id,
        action: "excluiu sala",
        detail: `${conversationLabel} e todo o historico ligado a ela foram removidos.`
    });

    commitState("conversation-delete");
    broadcastTyping("conversation-delete");
    sendJson(response, 200, {
        ok: true,
        snapshot: buildSnapshot(auth.user.id)
    });
}

async function handleConversationInvite(request, response, conversationId) {
    const auth = requireAuth(request);
    const conversation = ensureConversationAccess(auth.user.id, conversationId);
    const body = await readJsonBody(request);
    const invitedIds = Array.isArray(body.memberIds)
        ? Array.from(new Set(body.memberIds.filter((memberId) => getUserById(memberId))))
        : [];

    if (!invitedIds.length) {
        throw new HttpError(400, "Selecione pelo menos um membro.");
    }

    if (conversation.type === "channel") {
        throw new HttpError(400, "Canais publicos nao precisam de convite.");
    }

    const invitedLabels = invitedIds
        .map((userId) => getUserById(userId)?.loginKey || "usuario")
        .map((handle) => `@${handle}`)
        .join(", ");

    if (conversation.type === "dm") {
        updateConversation(conversation.id, {
            type: "group",
            name: sanitizeConversationName(body.name || `squad-${Date.now().toString(36).slice(-4)}`, "group"),
            description: sanitizeDescription(body.description || "Grupo criado a partir de um PV."),
            memberIds: Array.from(new Set([...conversation.memberIds, ...invitedIds]))
        });

        appendAuditLog({
            actorId: auth.user.id,
            action: "expandiu pv",
            detail: `PV convertido em grupo com convite para ${invitedLabels}.`
        });
    } else {
        updateConversation(conversation.id, {
            memberIds: Array.from(new Set([...conversation.memberIds, ...invitedIds]))
        });

        appendAuditLog({
            actorId: auth.user.id,
            action: "convidou membros",
            detail: `${invitedLabels} entraram em ${getConversationDisplayName(conversation, auth.user.id)}.`
        });
    }

    commitState("conversation-invite");
    sendJson(response, 200, {
        ok: true,
        snapshot: buildSnapshot(auth.user.id)
    });
}

async function handleMessagesClear(request, response, conversationId) {
    const auth = requireAuth(request);
    const conversation = ensureConversationAccess(auth.user.id, conversationId);

    state.messages = state.messages.filter((message) => message.conversationId !== conversationId);
    clearTypingForConversation(conversationId);

    appendAuditLog({
        actorId: auth.user.id,
        action: "limpou historico",
        detail: `Historico apagado em ${getConversationDisplayName(conversation, auth.user.id)}.`
    });

    commitState("messages-clear");
    broadcastTyping("messages-clear");
    sendJson(response, 200, {
        ok: true,
        snapshot: buildSnapshot(auth.user.id)
    });
}

async function handleMessageCreate(request, response) {
    const auth = requireAuth(request);
    const body = await readJsonBody(request);
    const conversationId = String(body.conversationId || "");
    const conversation = ensureConversationAccess(auth.user.id, conversationId);
    const text = String(body.text || "").replace(/\r\n/g, "\n");
    const normalizedText = text.trim();
    const imageDataUrl = typeof body.imageDataUrl === "string" ? body.imageDataUrl : "";
    const imageName = String(body.imageName || "");

    if (!normalizedText && !imageDataUrl) {
        throw new HttpError(400, "Envie texto, imagem ou ambos.");
    }

    const now = Date.now();
    const message = normalizeMessageRecord({
        id: createId(),
        conversationId,
        authorId: auth.user.id,
        text,
        imageDataUrl,
        imageName,
        createdAt: now,
        expiresAt: auth.user.autoDeleteMs ? now + auth.user.autoDeleteMs : null
    });

    state.messages.push(message);
    updateConversation(conversation.id, {});
    clearTypingForUser(auth.user.id, conversationId);

    appendAuditLog({
        actorId: auth.user.id,
        action: "enviou mensagem",
        detail: `${getConversationDisplayName(conversation, auth.user.id)} recebeu ${imageDataUrl ? "texto/imagem" : "texto"} do usuario.`,
        payload: JSON.stringify({
            conversationId,
            text,
            hasImage: Boolean(imageDataUrl),
            imageName
        })
    });

    commitState("message-create");
    broadcastTyping("message-create");
    sendJson(response, 201, {
        ok: true,
        snapshot: buildSnapshot(auth.user.id)
    });
}

async function handleTypingUpdate(request, response) {
    const auth = requireAuth(request);
    const body = await readJsonBody(request);
    const conversationId = String(body.conversationId || "");
    const active = Boolean(body.active);

    ensureConversationAccess(auth.user.id, conversationId);

    const key = `${conversationId}:${auth.user.id}`;

    if (active) {
        typingState.set(key, {
            conversationId,
            userId: auth.user.id,
            at: Date.now()
        });
    } else {
        typingState.delete(key);
    }

    broadcastTyping("typing");
    sendJson(response, 200, {
        ok: true
    });
}

async function handleStream(request, response) {
    const auth = requireAuth(request);

    response.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no"
    });

    const client = {
        id: createId(),
        userId: auth.user.id,
        tokenHash: auth.tokenHash,
        response
    };

    streamClients.add(client);
    sendSseEvent(response, "snapshot", {
        reason: "initial",
        snapshot: buildSnapshot(auth.user.id)
    });
    sendSseEvent(response, "typing", {
        reason: "initial",
        typing: buildTypingPayloadForUser(auth.user.id)
    });

    request.on("close", () => {
        streamClients.delete(client);
    });
}

async function handleHealth(request, response) {
    const volumeDetected = Boolean(process.env.RAILWAY_VOLUME_MOUNT_PATH);

    sendJson(response, 200, {
        ok: true,
        status: "online",
        time: new Date().toISOString(),
        users: state.users.length,
        conversations: state.conversations.length,
        dataPath: DATA_DIR,
        stateFile: STATE_FILE,
        railwayVolumeMounted: volumeDetected
    });
}

async function routeApi(request, response, route) {
    const { method, pathname } = route;

    if (method === "GET" && pathname === "/api/health") {
        await handleHealth(request, response);
        return true;
    }

    if (method === "GET" && pathname === "/api/session") {
        await handleSession(request, response);
        return true;
    }

    if (method === "POST" && pathname === "/api/auth/register") {
        await handleRegister(request, response);
        return true;
    }

    if (method === "POST" && pathname === "/api/auth/login") {
        await handleLogin(request, response);
        return true;
    }

    if (method === "POST" && pathname === "/api/auth/logout") {
        await handleLogout(request, response);
        return true;
    }

    if (method === "GET" && pathname === "/api/stream") {
        await handleStream(request, response);
        return true;
    }

    if (method === "PATCH" && pathname === "/api/profile") {
        await handleProfileUpdate(request, response);
        return true;
    }

    if (method === "PATCH" && pathname === "/api/preferences") {
        await handlePreferencesUpdate(request, response);
        return true;
    }

    if (method === "PATCH" && pathname === "/api/lab") {
        await handleLabUpdate(request, response);
        return true;
    }

    if (method === "POST" && pathname === "/api/conversations") {
        await handleConversationCreate(request, response);
        return true;
    }

    if (method === "POST" && pathname === "/api/direct-messages") {
        await handleDirectMessageCreate(request, response);
        return true;
    }

    if (method === "POST" && pathname === "/api/messages") {
        await handleMessageCreate(request, response);
        return true;
    }

    if (method === "POST" && pathname === "/api/typing") {
        await handleTypingUpdate(request, response);
        return true;
    }

    const inviteMatch = pathname.match(/^\/api\/conversations\/([^/]+)\/invite$/);
    if (inviteMatch && method === "POST") {
        await handleConversationInvite(request, response, decodeURIComponent(inviteMatch[1]));
        return true;
    }

    const messagesMatch = pathname.match(/^\/api\/conversations\/([^/]+)\/messages$/);
    if (messagesMatch && method === "DELETE") {
        await handleMessagesClear(request, response, decodeURIComponent(messagesMatch[1]));
        return true;
    }

    const conversationMatch = pathname.match(/^\/api\/conversations\/([^/]+)$/);
    if (conversationMatch && method === "PATCH") {
        await handleConversationUpdate(request, response, decodeURIComponent(conversationMatch[1]));
        return true;
    }

    if (conversationMatch && method === "DELETE") {
        await handleConversationDelete(request, response, decodeURIComponent(conversationMatch[1]));
        return true;
    }

    return false;
}

const server = http.createServer(async (request, response) => {
    const route = parseRoute(request);

    try {
        if (route.pathname.startsWith("/api/")) {
            const handled = await routeApi(request, response, route);

            if (!handled) {
                throw new HttpError(404, "Endpoint nao encontrado.");
            }

            return;
        }

        const filePath = resolveStaticFile(route.pathname);

        if (!filePath) {
            response.writeHead(404, {
                "Content-Type": "text/plain; charset=utf-8"
            });
            response.end("Arquivo nao encontrado.");
            return;
        }

        serveFile(response, filePath);
    } catch (error) {
        handleApiError(response, request, error);
    }
});

setInterval(() => {
    let persisted = false;

    if (pruneExpiredMessages()) {
        persisted = true;
    }

    if (cleanExpiredSessions()) {
        persisted = true;
    }

    if (persisted) {
        persistState();
        broadcastSnapshots("maintenance");
    }

    if (pruneTypingEntries()) {
        broadcastTyping("typing-prune");
    }

    Array.from(streamClients).forEach((client) => {
        sendSseEvent(client.response, "ping", {
            at: Date.now()
        });
    });
}, 1000);

server.listen(PORT, HOST, () => {
    console.log(`BlackCipher chat online em http://${HOST}:${PORT}`);
    console.log(`Persistencia ativa em ${STATE_FILE}`);
});
