const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const port = Number(process.env.PORT || 3000);
const root = __dirname;
const defaultDataDir = path.join(root, "data");
const railwayVolumeDir = sanitizeStoragePath(process.env.RAILWAY_VOLUME_MOUNT_PATH || "");
const configuredDataDir = sanitizeStoragePath(process.env.DATA_DIR || "");
const configuredDbFile = sanitizeStoragePath(process.env.DB_FILE || "");
const dataDir = configuredDataDir || railwayVolumeDir || defaultDataDir;
const dbFile = configuredDbFile || path.join(dataDir, "db.json");
const storageSource = configuredDbFile
    ? "DB_FILE"
    : configuredDataDir
      ? "DATA_DIR"
      : railwayVolumeDir
        ? "RAILWAY_VOLUME_MOUNT_PATH"
        : "data local do projeto";
const isRailwayRuntime = Boolean(process.env.RAILWAY_PROJECT_ID || process.env.RAILWAY_ENVIRONMENT_ID || process.env.RAILWAY_SERVICE_ID);
const isProductionRuntime = process.env.NODE_ENV === "production" || isRailwayRuntime;
const isUsingProjectDataDir = !configuredDbFile && !configuredDataDir && !railwayVolumeDir;
const bodyLimit = 12 * 1024 * 1024;
const sessionCookieName = "cq_session";
const ownerCookieName = "cq_owner";
const sessionSecret = process.env.SESSION_SECRET || "change-me-before-production";
const sessionTtlDays = Math.max(1, Number(process.env.SESSION_TTL_DAYS || 30));
const sessionTtlMs = sessionTtlDays * 24 * 60 * 60 * 1000;
const onlineThresholdMs = 2 * 60 * 1000;
const defaultAdmin = {
    name: process.env.ADMIN_NAME || "CONQUEST Mod",
    handle: normalizeHandle(process.env.ADMIN_HANDLE || "conquestmod"),
    password: process.env.ADMIN_PASSWORD || "Conquest!2026"
};
const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".html": "text/html; charset=utf-8",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp"
};

let db = loadDatabase();
let scheduledSaveTimer = null;

ensureSeedAdmin(db);
purgeLaunchTestData(db);
cleanupDatabase(db);
saveDatabase(db);

const server = http.createServer(async (request, response) => {
    try {
        const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
        const context = getRequestContext(request, response);

        if (requestUrl.pathname.startsWith("/api/")) {
            await handleApi(request, response, requestUrl, context);
            return;
        }

        serveStatic(requestUrl.pathname, response);
    } catch (error) {
        console.error(error);
        sendJson(response, error.statusCode || 500, {
            error: error.message || "Erro interno do servidor."
        });
    }
});

server.listen(port, () => {
    console.log(`CONQUEST rodando em http://localhost:${port}`);
    console.log(`Banco persistido em ${dbFile} (${storageSource})`);

    if (isProductionRuntime && isUsingProjectDataDir) {
        console.warn(
            [
                "AVISO: o banco esta sendo salvo dentro da pasta do projeto.",
                "Em deploys como Railway, essa pasta pode ser recriada a cada commit/redeploy.",
                "Crie um Volume e monte em /app/data, ou configure DATA_DIR/DB_FILE para um caminho persistente."
            ].join("\n")
        );
    }
});

function createDb() {
    return {
        version: 4,
        users: [],
        posts: [],
        likesByUser: {},
        boostsByUser: {},
        savesByUser: {},
        followsByUser: {},
        commentsByPost: {},
        activitiesByUser: {},
        alertsSeenAtByUser: {},
        viewHistoryByUser: {},
        directThreads: [],
        sessions: [],
        recentAccountIds: []
    };
}

function loadDatabase() {
    try {
        if (!fs.existsSync(dbFile)) {
            return createDb();
        }

        const parsed = JSON.parse(fs.readFileSync(dbFile, "utf8"));
        return { ...createDb(), ...parsed };
    } catch (error) {
        console.error("Falha ao carregar banco, criando um novo.", error);
        return createDb();
    }
}

function saveDatabase(nextDb) {
    if (scheduledSaveTimer) {
        clearTimeout(scheduledSaveTimer);
        scheduledSaveTimer = null;
    }
    fs.mkdirSync(path.dirname(dbFile), { recursive: true });
    const tempFile = `${dbFile}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(nextDb, null, 2), "utf8");
    fs.renameSync(tempFile, dbFile);
}

function scheduleDatabaseSave(delayMs = 120) {
    if (scheduledSaveTimer) {
        return;
    }

    scheduledSaveTimer = setTimeout(() => {
        scheduledSaveTimer = null;

        try {
            saveDatabase(db);
        } catch (error) {
            console.error("Falha ao persistir banco agendado.", error);
        }
    }, Math.max(40, Number(delayMs) || 120));
}

function serveStatic(urlPath, response) {
    const safePath = path.normalize(decodeURIComponent(urlPath || "/")).replace(/^(\.\.[/\\])+/, "").replace(/^[/\\]+/, "");
    let filePath = path.join(root, safePath || "index.html");

    try {
        const stats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;

        if (stats && stats.isDirectory()) {
            filePath = path.join(filePath, "index.html");
        }

        if (fs.existsSync(filePath)) {
            sendFile(response, filePath);
            return;
        }
    } catch (error) {
        console.error(error);
    }

    sendFile(response, path.join(root, "index.html"));
}

function sendFile(response, filePath) {
    const extension = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[extension] || "application/octet-stream";

    fs.readFile(filePath, (error, content) => {
        if (error) {
            response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            response.end("Erro interno ao carregar arquivo.");
            return;
        }

        response.writeHead(200, { "Content-Type": contentType });
        response.end(content);
    });
}

function sanitizeStoragePath(value) {
    const candidate = String(value || "").trim();
    if (!candidate) {
        return "";
    }

    return path.resolve(candidate);
}

function cleanupDatabase(nextDb) {
    const seenUserIds = new Set();
    const seenHandles = new Set();
    nextDb.users = (Array.isArray(nextDb.users) ? nextDb.users : [])
        .filter((user) => user && typeof user === "object" && typeof user.id === "string")
        .map((user) => ({
            id: user.id.trim(),
            name: sanitizeText(user.name || "Pessoa", 36) || "Pessoa",
            handle: normalizeHandle(user.handle || ""),
            bio:
                sanitizeText(user.bio || "Compartilhando imagens, processos e referencias.", 90) ||
                "Compartilhando imagens, processos e referencias.",
            statusNote: sanitizeText(user.statusNote || "", 90),
            location: sanitizeText(user.location || "", 48),
            website: normalizeWebsite(user.website || ""),
            profileVisibility: normalizeProfileVisibility(user.profileVisibility),
            presenceVisibility: normalizePresenceVisibility(user.presenceVisibility),
            avatarImage: sanitizeImageSource(user.avatarImage || ""),
            avatarFocusX: normalizePercentValue(user.avatarFocusX, 50),
            avatarFocusY: normalizePercentValue(user.avatarFocusY, 50),
            avatarScale: normalizeScaleValue(user.avatarScale, 1),
            avatarTone: sanitizeHexColor(user.avatarTone || "#f4f6fb") || "#f4f6fb",
            profileTheme: sanitizeText(user.profileTheme || "obsidian-blue", 32) || "obsidian-blue",
            highlightPostId: typeof user.highlightPostId === "string" ? user.highlightPostId : "",
            coverImage: sanitizeImageSource(user.coverImage || ""),
            coverFocusX: normalizePercentValue(user.coverFocusX, 50),
            coverFocusY: normalizePercentValue(user.coverFocusY, 50),
            coverScale: normalizeScaleValue(user.coverScale, 1),
            role: normalizeUserRole(user.role),
            isBanned: Boolean(user.isBanned),
            ownerKey: sanitizeText(user.ownerKey || "", 120),
            passwordHash: typeof user.passwordHash === "string" ? user.passwordHash : "",
            createdAt: Number(user.createdAt) || Date.now(),
            lastLoginAt: Number(user.lastLoginAt) || Number(user.createdAt) || Date.now(),
            lastSeenAt: Number(user.lastSeenAt) || Number(user.lastLoginAt) || Number(user.createdAt) || Date.now()
        }))
        .filter((user) => user.id && user.handle && user.passwordHash && !seenUserIds.has(user.id) && !seenHandles.has(user.handle))
        .map((user) => {
            seenUserIds.add(user.id);
            seenHandles.add(user.handle);
            return user;
        });

    const validUserIds = new Set(nextDb.users.map((user) => user.id));

    nextDb.posts = (Array.isArray(nextDb.posts) ? nextDb.posts : [])
        .filter((post) => post && validUserIds.has(post.authorId))
        .map((post) => ({
            id: typeof post.id === "string" ? post.id : createId("post"),
            authorId: post.authorId,
            title: derivePostTitle(post.title, post.caption, post.category),
            caption: sanitizeText(post.caption || "", 240),
            category: sanitizeCategory(post.category),
            tags: normalizeTags(post.tags || []),
            imageData: sanitizeImageSource(post.imageData || ""),
            postKind: normalizePostKind(post.postKind || (post.distribution === "discussion" ? "discussion" : "art")),
            contentMode: normalizeContentMode(post.contentMode || (post.imageData ? "media" : "text")),
            distribution: normalizeDistribution(post.distribution || (post.postKind === "discussion" ? "discussion" : "both")),
            presentation: normalizePresentation(post.presentation || {}),
            createdAt: Number(post.createdAt) || Date.now()
        }))
        .filter((post) => post.title || post.caption || post.imageData);

    const validPostIds = new Set(nextDb.posts.map((post) => post.id));
    nextDb.likesByUser = cleanInteractionMap(nextDb.likesByUser, validUserIds, validPostIds);
    nextDb.boostsByUser = cleanInteractionMap(nextDb.boostsByUser, validUserIds, validPostIds);
    nextDb.savesByUser = cleanInteractionMap(nextDb.savesByUser, validUserIds, validPostIds);
    nextDb.followsByUser = cleanFollowMap(nextDb.followsByUser, validUserIds);
    nextDb.commentsByPost = cleanCommentMap(nextDb.commentsByPost, validPostIds, validUserIds);
    nextDb.activitiesByUser = cleanActivityMap(nextDb.activitiesByUser, validUserIds, validPostIds);
    nextDb.alertsSeenAtByUser = cleanTimestampMap(nextDb.alertsSeenAtByUser, validUserIds);
    nextDb.viewHistoryByUser = cleanViewHistoryMap(nextDb.viewHistoryByUser, validUserIds, validPostIds);
    nextDb.directThreads = cleanDirectThreads(nextDb.directThreads, validUserIds);
    nextDb.recentAccountIds = Array.isArray(nextDb.recentAccountIds)
        ? uniqueList(nextDb.recentAccountIds.filter((userId) => validUserIds.has(userId))).slice(0, 10)
        : [];
    nextDb.sessions = cleanSessions(nextDb.sessions, validUserIds);
}

function cleanInteractionMap(map, validUserIds, validPostIds) {
    const result = {};
    Object.entries(map || {}).forEach(([userId, postIds]) => {
        if (!validUserIds.has(userId) || !Array.isArray(postIds)) {
            return;
        }

        result[userId] = uniqueList(postIds.filter((postId) => validPostIds.has(postId)));
    });
    return result;
}

function cleanFollowMap(map, validUserIds) {
    const result = {};
    Object.entries(map || {}).forEach(([userId, followedIds]) => {
        if (!validUserIds.has(userId) || !Array.isArray(followedIds)) {
            return;
        }

        result[userId] = uniqueList(
            followedIds.filter((followedId) => validUserIds.has(followedId) && followedId !== userId)
        );
    });
    return result;
}

function cleanCommentMap(map, validPostIds, validUserIds) {
    const result = {};

    Object.entries(map || {}).forEach(([postId, comments]) => {
        if (!validPostIds.has(postId) || !Array.isArray(comments)) {
            return;
        }

        const normalized = comments
            .filter((comment) => comment && validUserIds.has(comment.authorId))
            .map((comment) => ({
                id: typeof comment.id === "string" ? comment.id : createId("comment"),
                authorId: comment.authorId,
                text: sanitizeText(comment.text || "", 220),
                parentId: typeof comment.parentId === "string" ? comment.parentId : null,
                createdAt: Number(comment.createdAt) || Date.now()
            }))
            .filter((comment) => comment.text);

        const validCommentIds = new Set(normalized.map((comment) => comment.id));
        result[postId] = normalized.map((comment) => ({
            ...comment,
            parentId: comment.parentId && validCommentIds.has(comment.parentId) ? comment.parentId : null
        }));
    });

    return result;
}

function cleanActivityMap(map, validUserIds, validPostIds) {
    const result = {};
    Object.entries(map || {}).forEach(([userId, activities]) => {
        if (!validUserIds.has(userId) || !Array.isArray(activities)) {
            return;
        }

        result[userId] = activities
            .filter((entry) => entry && validUserIds.has(entry.actorUserId) && (!entry.postId || validPostIds.has(entry.postId)))
            .map((entry) => ({
                id: typeof entry.id === "string" ? entry.id : createId("activity"),
                type: sanitizeText(entry.type || "published", 32) || "published",
                actorUserId: entry.actorUserId,
                postId: typeof entry.postId === "string" ? entry.postId : null,
                commentId: typeof entry.commentId === "string" ? entry.commentId : null,
                createdAt: Number(entry.createdAt) || Date.now(),
                text: sanitizeText(entry.text || "", 160)
            }))
            .slice(0, 120);
    });
    return result;
}

function cleanTimestampMap(map, validUserIds) {
    const result = {};
    Object.entries(map || {}).forEach(([userId, value]) => {
        if (!validUserIds.has(userId)) {
            return;
        }

        result[userId] = Math.max(0, Number(value) || 0);
    });
    return result;
}

function cleanViewHistoryMap(map, validUserIds, validPostIds) {
    const result = {};
    Object.entries(map || {}).forEach(([userId, entries]) => {
        if (!validUserIds.has(userId) || !Array.isArray(entries)) {
            return;
        }

        result[userId] = entries
            .filter((entry) => entry && validPostIds.has(entry.postId))
            .map((entry) => ({
                postId: entry.postId,
                createdAt: Number(entry.createdAt) || Date.now(),
                durationMs: clampNumber(entry.durationMs, 0, 120000, 0),
                source: entry.source === "inline" ? "inline" : "modal"
            }))
            .slice(0, 180);
    });
    return result;
}

function cleanDirectThreads(threads, validUserIds) {
    return (Array.isArray(threads) ? threads : [])
        .filter((thread) => thread && Array.isArray(thread.participantIds))
        .map((thread) => ({
            id: typeof thread.id === "string" ? thread.id : createId("thread"),
            participantIds: uniqueList(thread.participantIds.filter((userId) => validUserIds.has(userId))).slice(0, 2),
            createdAt: Number(thread.createdAt) || Date.now(),
            updatedAt: Number(thread.updatedAt) || Number(thread.createdAt) || Date.now(),
            messages: (Array.isArray(thread.messages) ? thread.messages : [])
                .filter((message) => message && validUserIds.has(message.senderId))
                .map((message) => ({
                    id: typeof message.id === "string" ? message.id : createId("message"),
                    senderId: message.senderId,
                    text: sanitizeText(message.text || "", 1200),
                    createdAt: Number(message.createdAt) || Date.now(),
                    readBy: uniqueList(
                        Array.isArray(message.readBy) ? message.readBy.filter((userId) => validUserIds.has(userId)) : []
                    )
                }))
                .filter((message) => message.text)
                .slice(-400)
        }))
        .filter((thread) => thread.participantIds.length === 2);
}

function cleanSessions(sessions, validUserIds) {
    const now = Date.now();
    return (Array.isArray(sessions) ? sessions : [])
        .filter((session) => session && validUserIds.has(session.userId))
        .map((session) => ({
            id: typeof session.id === "string" ? session.id : createId("session"),
            userId: session.userId,
            tokenHash: sanitizeText(session.tokenHash || "", 160),
            createdAt: Number(session.createdAt) || now,
            expiresAt: Number(session.expiresAt) || now + sessionTtlMs,
            lastSeenAt: Number(session.lastSeenAt) || Number(session.createdAt) || now,
            userAgentHash: sanitizeText(session.userAgentHash || "", 120),
            ipHash: sanitizeText(session.ipHash || "", 120)
        }))
        .filter((session) => session.tokenHash && session.expiresAt > now - sessionTtlMs);
}

function ensureSeedAdmin(nextDb) {
    const existingAdmin = nextDb.users.find((user) => normalizeUserRole(user.role) === "admin");

    if (existingAdmin) {
        if (!existingAdmin.passwordHash) {
            existingAdmin.passwordHash = hashPassword(defaultAdmin.password);
        }
        return;
    }

    const now = Date.now();
    nextDb.users.push({
        id: createId("user"),
        name: defaultAdmin.name,
        handle: defaultAdmin.handle,
        bio: "Conta de moderacao inicial do CONQUEST.",
        statusNote: "Moderando a rede.",
        location: "",
        website: "",
        profileVisibility: "public",
        presenceVisibility: "everyone",
        avatarImage: "",
        avatarFocusX: 50,
        avatarFocusY: 50,
        avatarScale: 1,
        avatarTone: "#d8e4ff",
        profileTheme: "moon-silver",
        highlightPostId: "",
        coverImage: "",
        coverFocusX: 50,
        coverFocusY: 50,
        coverScale: 1,
        role: "admin",
        isBanned: false,
        ownerKey: "seed-admin",
        passwordHash: hashPassword(defaultAdmin.password),
        createdAt: now,
        lastLoginAt: now,
        lastSeenAt: now
    });
}

function purgeLaunchTestData(nextDb) {
    const blockedUserIds = new Set(
        (Array.isArray(nextDb.users) ? nextDb.users : [])
            .filter((user) => isGeneratedTestUser(user))
            .map((user) => user.id)
    );

    if (!blockedUserIds.size) {
        return;
    }

    nextDb.users = (nextDb.users || []).filter((user) => !blockedUserIds.has(user.id));
    nextDb.posts = (nextDb.posts || []).filter((post) => {
        return !blockedUserIds.has(post.authorId) && !isGeneratedTestPost(post);
    });
}

function isGeneratedTestUser(user) {
    if (!user || typeof user !== "object") {
        return false;
    }

    if (sanitizeText(user.ownerKey || "", 120) === "seed-admin") {
        return false;
    }

    const name = String(user.name || "").toLowerCase();
    const handle = normalizeHandle(user.handle || "");
    const bio = String(user.bio || "").toLowerCase();
    const status = String(user.statusNote || "").toLowerCase();
    const combined = `${name} ${handle} ${bio} ${status}`;

    if (/teste velocidade|conta de teste|qa final|talker|veloz/i.test(combined)) {
        return true;
    }

    if (/^qa[a-z0-9]+$/i.test(handle) || /^q[a-z]\d{4,}$/i.test(handle)) {
        return true;
    }

    return /\b(teste|test|qa|demo|bot|speed)\b/i.test(combined);
}

function isGeneratedTestPost(post) {
    if (!post || typeof post !== "object") {
        return false;
    }

    const combined = [
        String(post.title || ""),
        String(post.caption || ""),
        ...(Array.isArray(post.tags) ? post.tags : [])
    ]
        .join(" ")
        .toLowerCase();

    return /#teste|\bteste\b|\bqa\b|\bveloz\b|\bdemo\b|\bspeed\b/.test(combined);
}

function createHttpError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
    });
    response.end(JSON.stringify(payload));
}

async function handleApi(request, response, requestUrl, context) {
    const pathname = requestUrl.pathname;

    if (request.method === "GET" && pathname === "/api/session") {
        touchViewerPresence(context.user, context.session);
        scheduleDatabaseSave();
        sendAuthCookies(response, context);
        sendJson(response, 200, {
            db: sanitizeDatabaseForClient(db, context.user)
        });
        return;
    }

    if (request.method === "POST" && pathname === "/api/auth/register") {
        const body = await readJsonBody(request);
        const ownerKey = ensureOwnerKey(context);
        const user = registerUser(body, ownerKey);
        const sessionToken = createSessionForUser(user.id, request);
        context.user = user;
        context.sessionToken = sessionToken;
        context.session = getSessionByToken(sessionToken);
        sendAuthCookies(response, context);
        saveDatabase(db);
        sendJson(response, 201, {
            db: sanitizeDatabaseForClient(db, user)
        });
        return;
    }

    if (request.method === "POST" && pathname === "/api/auth/login") {
        const body = await readJsonBody(request);
        const user = loginUser(body, request);
        const sessionToken = createSessionForUser(user.id, request);
        context.user = user;
        context.sessionToken = sessionToken;
        context.session = getSessionByToken(sessionToken);
        sendAuthCookies(response, context);
        saveDatabase(db);
        sendJson(response, 200, {
            db: sanitizeDatabaseForClient(db, user)
        });
        return;
    }

    if (request.method === "POST" && pathname === "/api/auth/logout") {
        if (context.sessionToken) {
            removeSessionByToken(context.sessionToken);
            saveDatabase(db);
        }

        clearCookie(response, sessionCookieName);
        sendJson(response, 200, {
            db: sanitizeDatabaseForClient(db, null)
        });
        return;
    }

    if (request.method === "POST" && pathname === "/api/profile") {
        const user = requireUser(context);
        const body = await readJsonBody(request);
        updateProfile(user, body);
        touchViewerPresence(user, context.session);
        saveDatabase(db);
        sendJson(response, 200, {
            db: sanitizeDatabaseForClient(db, user)
        });
        return;
    }

    if (request.method === "POST" && pathname === "/api/auth/password") {
        const user = requireUser(context);
        const body = await readJsonBody(request);
        changePassword(user, body, context.sessionToken);
        touchViewerPresence(user, context.session);
        saveDatabase(db);
        sendJson(response, 200, {
            ok: true
        });
        return;
    }

    if (request.method === "POST" && pathname === "/api/posts") {
        const user = requireUser(context);
        const body = await readJsonBody(request);
        const post = createPost(user, body);
        touchViewerPresence(user, context.session);
        saveDatabase(db);
        sendJson(response, 201, {
            postId: post.id,
            db: sanitizeDatabaseForClient(db, user)
        });
        return;
    }

    if (request.method === "POST" && /^\/api\/posts\/[^/]+\/like$/.test(pathname)) {
        const user = requireUser(context);
        const liked = toggleLike(user, getLastPathSegment(pathname, 1));
        touchViewerPresence(user, context.session);
        scheduleDatabaseSave();
        sendJson(response, 200, {
            liked
        });
        return;
    }

    if (request.method === "POST" && /^\/api\/posts\/[^/]+\/boost$/.test(pathname)) {
        const user = requireUser(context);
        const boosted = toggleBoost(user, getLastPathSegment(pathname, 1));
        touchViewerPresence(user, context.session);
        scheduleDatabaseSave();
        sendJson(response, 200, {
            boosted
        });
        return;
    }

    if (request.method === "POST" && /^\/api\/posts\/[^/]+\/save$/.test(pathname)) {
        const user = requireUser(context);
        const saved = toggleSave(user, getLastPathSegment(pathname, 1));
        touchViewerPresence(user, context.session);
        scheduleDatabaseSave();
        sendJson(response, 200, {
            saved
        });
        return;
    }

    if (request.method === "POST" && /^\/api\/posts\/[^/]+\/view$/.test(pathname)) {
        const user = requireUser(context);
        const body = await readJsonBody(request);
        recordPostView(user, getLastPathSegment(pathname, 1), body);
        touchViewerPresence(user, context.session);
        scheduleDatabaseSave();
        sendJson(response, 200, { ok: true });
        return;
    }

    if (request.method === "DELETE" && /^\/api\/posts\/[^/]+$/.test(pathname)) {
        const user = requireUser(context);
        deletePost(user, getLastPathSegment(pathname, 0));
        touchViewerPresence(user, context.session);
        saveDatabase(db);
        sendJson(response, 200, {
            db: sanitizeDatabaseForClient(db, user)
        });
        return;
    }

    if (request.method === "POST" && /^\/api\/posts\/[^/]+\/comments$/.test(pathname)) {
        const user = requireUser(context);
        const body = await readJsonBody(request);
        const comment = addComment(user, getLastPathSegment(pathname, 1), body);
        touchViewerPresence(user, context.session);
        saveDatabase(db);
        sendJson(response, 201, {
            comment
        });
        return;
    }

    if (request.method === "DELETE" && /^\/api\/posts\/[^/]+\/comments\/[^/]+$/.test(pathname)) {
        const user = requireUser(context);
        const segments = pathname.split("/").filter(Boolean);
        const deletedCommentIds = deleteComment(user, segments[2], segments[4]);
        touchViewerPresence(user, context.session);
        saveDatabase(db);
        sendJson(response, 200, {
            deletedCommentIds
        });
        return;
    }

    if (request.method === "POST" && /^\/api\/follows\/[^/]+$/.test(pathname)) {
        const user = requireUser(context);
        const following = toggleFollow(user, getLastPathSegment(pathname, 0));
        touchViewerPresence(user, context.session);
        scheduleDatabaseSave();
        sendJson(response, 200, {
            following
        });
        return;
    }

    if (request.method === "POST" && pathname === "/api/alerts/seen") {
        const user = requireUser(context);
        const seenAt = markAlertsAsSeen(user.id);
        touchViewerPresence(user, context.session);
        scheduleDatabaseSave();
        sendJson(response, 200, {
            seenAt
        });
        return;
    }

    if (request.method === "POST" && pathname === "/api/directs/start") {
        const user = requireUser(context);
        const body = await readJsonBody(request);
        const threadId = startDirectThread(user, String(body.targetUserId || ""));
        touchViewerPresence(user, context.session);
        saveDatabase(db);
        sendJson(response, 200, {
            threadId,
            db: sanitizeDatabaseForClient(db, user)
        });
        return;
    }

    if (request.method === "POST" && /^\/api\/directs\/[^/]+\/messages$/.test(pathname)) {
        const user = requireUser(context);
        const body = await readJsonBody(request);
        const message = sendDirectMessage(user, getLastPathSegment(pathname, 1), body);
        touchViewerPresence(user, context.session);
        saveDatabase(db);
        sendJson(response, 201, {
            message
        });
        return;
    }

    if (request.method === "POST" && /^\/api\/directs\/[^/]+\/read$/.test(pathname)) {
        const user = requireUser(context);
        markThreadAsRead(user.id, getLastPathSegment(pathname, 1));
        touchViewerPresence(user, context.session);
        scheduleDatabaseSave();
        sendJson(response, 200, {
            ok: true
        });
        return;
    }

    if (request.method === "POST" && /^\/api\/admin\/users\/[^/]+\/ban$/.test(pathname)) {
        const user = requireAdmin(context);
        const body = await readJsonBody(request);
        setUserBanState(user, getLastPathSegment(pathname, 1), Boolean(body.isBanned));
        saveDatabase(db);
        sendJson(response, 200, {
            db: sanitizeDatabaseForClient(db, user)
        });
        return;
    }

    if (request.method === "DELETE" && /^\/api\/admin\/users\/[^/]+$/.test(pathname)) {
        const user = requireAdmin(context);
        deleteUserAccount(user, getLastPathSegment(pathname, 0));
        saveDatabase(db);
        sendJson(response, 200, {
            db: sanitizeDatabaseForClient(db, user)
        });
        return;
    }

    sendJson(response, 404, { error: "Rota nao encontrada." });
}

function getRequestContext(request, response) {
    pruneExpiredSessions();
    const cookies = parseCookies(request.headers.cookie || "");
    const ownerKey = cookies[ownerCookieName] ? sanitizeText(cookies[ownerCookieName], 120) : "";
    const sessionToken = cookies[sessionCookieName] ? sanitizeText(cookies[sessionCookieName], 240) : "";
    const session = getSessionByToken(sessionToken);
    let user = session ? getUserById(session.userId) : null;

    if (user?.isBanned) {
        user = null;
    }

    if (!user && sessionToken) {
        removeSessionByToken(sessionToken);
        clearCookie(response, sessionCookieName);
    }

    return {
        cookies,
        ownerKey,
        sessionToken,
        session: user ? session : null,
        user
    };
}

function requireUser(context) {
    if (!context.user) {
        throw createHttpError(401, "Voce precisa entrar para continuar.");
    }

    if (context.user.isBanned) {
        throw createHttpError(403, "Essa conta foi bloqueada.");
    }

    return context.user;
}

function requireAdmin(context) {
    const user = requireUser(context);

    if (!isModerator(user)) {
        throw createHttpError(403, "Essa area e restrita para moderacao.");
    }

    return user;
}

function isModerator(user) {
    return normalizeUserRole(user?.role) === "admin" || normalizeUserRole(user?.role) === "moderator";
}

function touchViewerPresence(user, session) {
    if (!user) {
        return;
    }

    const now = Date.now();
    user.lastSeenAt = now;

    if (session) {
        session.lastSeenAt = now;
    }
}

function registerUser(body, ownerKey) {
    const name = sanitizeText(body.name || "", 36);
    const handle = normalizeHandle(body.handle || "");
    const password = String(body.password || "");
    const bio = sanitizeText(body.bio || "", 90) || "Novo por aqui no CONQUEST.";

    if (name.length < 2) {
        throw createHttpError(400, "Use um nome um pouco maior.");
    }

    if (handle.length < 3) {
        throw createHttpError(400, "Escolha um @usuario com pelo menos 3 caracteres.");
    }

    if (!isValidPassword(password)) {
        throw createHttpError(400, "Use uma senha com pelo menos 8 caracteres.");
    }

    if (getUserByHandle(handle)) {
        throw createHttpError(409, "Esse @usuario ja esta em uso.");
    }

    const linkedAccounts = db.users.filter((user) => user.ownerKey && user.ownerKey === ownerKey).length;
    if (linkedAccounts >= 2) {
        throw createHttpError(403, "Esse aparelho ja atingiu o limite inicial de 2 contas.");
    }

    const now = Date.now();
    const user = {
        id: createId("user"),
        name,
        handle,
        bio,
        statusNote: "",
        location: "",
        website: "",
        profileVisibility: "public",
        presenceVisibility: "everyone",
        avatarImage: "",
        avatarFocusX: 50,
        avatarFocusY: 50,
        avatarScale: 1,
        avatarTone: "#f4f6fb",
        profileTheme: "obsidian-blue",
        highlightPostId: "",
        coverImage: "",
        coverFocusX: 50,
        coverFocusY: 50,
        coverScale: 1,
        role: "user",
        isBanned: false,
        ownerKey,
        passwordHash: hashPassword(password),
        createdAt: now,
        lastLoginAt: now,
        lastSeenAt: now
    };

    db.users.push(user);
    ensureUserCollections(user.id);
    db.recentAccountIds = [user.id, ...db.recentAccountIds.filter((id) => id !== user.id)].slice(0, 10);
    return user;
}

function loginUser(body, request) {
    const handle = normalizeHandle(body.handle || "");
    const password = String(body.password || "");
    const user = getUserByHandle(handle);

    if (!user) {
        throw createHttpError(401, "Nao encontramos essa conta.");
    }

    if (user.isBanned) {
        throw createHttpError(403, "Essa conta foi bloqueada pela moderacao.");
    }

    if (!verifyPassword(password, user.passwordHash)) {
        throw createHttpError(401, "Senha incorreta.");
    }

    user.lastLoginAt = Date.now();
    user.lastSeenAt = Date.now();
    db.recentAccountIds = [user.id, ...db.recentAccountIds.filter((id) => id !== user.id)].slice(0, 10);
    ensureUserCollections(user.id);
    pruneExpiredSessions();
    removeExistingSessionsForUser(user.id, request);
    return user;
}

function changePassword(user, body, currentSessionToken) {
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");

    if (!verifyPassword(currentPassword, user.passwordHash)) {
        throw createHttpError(401, "A senha atual nao confere.");
    }

    if (!isValidPassword(newPassword)) {
        throw createHttpError(400, "Use uma nova senha com pelo menos 8 caracteres.");
    }

    if (verifyPassword(newPassword, user.passwordHash)) {
        throw createHttpError(400, "Escolha uma senha diferente da atual.");
    }

    user.passwordHash = hashPassword(newPassword);
    user.lastSeenAt = Date.now();

    if (currentSessionToken) {
        const currentHash = hashSessionToken(currentSessionToken);
        db.sessions = db.sessions.filter((session) => session.userId !== user.id || session.tokenHash === currentHash);
    }
}

function updateProfile(user, body) {
    user.name = sanitizeText(body.name || "", 36) || user.name;
    user.bio = sanitizeText(body.bio || "", 90) || user.bio;
    user.statusNote = sanitizeText(body.statusNote || "", 90);
    user.location = sanitizeText(body.location || "", 48);
    user.website = normalizeWebsite(body.website || "");
    user.profileVisibility = normalizeProfileVisibility(body.profileVisibility || user.profileVisibility);
    user.presenceVisibility = normalizePresenceVisibility(body.presenceVisibility || user.presenceVisibility);
    user.avatarImage = sanitizeImageSource(body.avatarImage || "");
    user.avatarFocusX = normalizePercentValue(body.avatarFocusX, user.avatarFocusX);
    user.avatarFocusY = normalizePercentValue(body.avatarFocusY, user.avatarFocusY);
    user.avatarScale = normalizeScaleValue(body.avatarScale, user.avatarScale);
    user.avatarTone = sanitizeHexColor(body.avatarTone || user.avatarTone) || user.avatarTone;
    user.profileTheme = sanitizeText(body.profileTheme || user.profileTheme, 32) || user.profileTheme;
    user.highlightPostId =
        typeof body.highlightPostId === "string" && getUserPosts(user.id).some((post) => post.id === body.highlightPostId)
            ? body.highlightPostId
            : "";
    user.coverImage = sanitizeImageSource(body.coverImage || "");
    user.coverFocusX = normalizePercentValue(body.coverFocusX, user.coverFocusX);
    user.coverFocusY = normalizePercentValue(body.coverFocusY, user.coverFocusY);
    user.coverScale = normalizeScaleValue(body.coverScale, user.coverScale);
}

function createPost(user, body) {
    const rawTitle = sanitizeText(body.title || "", 60);
    const caption = sanitizeText(body.caption || "", 240);
    const requestedDistribution = normalizeDistribution(body.distribution);
    const postKind = normalizePostKind(body.postKind || (requestedDistribution === "discussion" ? "discussion" : "art"));
    const isDiscussion = postKind === "discussion";
    const category = isDiscussion ? "Editorial" : sanitizeCategory(body.category);
    const title = derivePostTitle(rawTitle, caption, category);
    const tags = normalizeTags(body.tags || "");
    const rawImageData = sanitizeImageSource(body.imageData || "");
    const contentMode = isDiscussion ? "text" : rawImageData ? normalizeContentMode(body.contentMode) : "text";
    const imageData = isDiscussion || contentMode === "text" ? "" : rawImageData;
    const distribution = isDiscussion ? "discussion" : requestedDistribution;
    const presentation = isDiscussion ? createDefaultPresentation() : normalizePresentation(body.presentation || body);

    if (!title && !caption && !imageData) {
        throw createHttpError(400, "Escreva algo ou escolha uma imagem para publicar.");
    }

    const post = {
        id: createId("post"),
        authorId: user.id,
        title,
        caption,
        category,
        tags,
        imageData,
        postKind,
        contentMode,
        distribution,
        presentation,
        createdAt: Date.now()
    };

    db.posts.push(post);
    pushActivity(user.id, {
        type: "published",
        actorUserId: user.id,
        postId: post.id
    });

    getFollowersOfUser(user.id).forEach((followerId) => {
        pushActivity(followerId, {
            type: "new-post",
            actorUserId: user.id,
            postId: post.id
        });
    });

    return post;
}

function deletePost(user, postId) {
    const post = getPostById(postId);

    if (!post) {
        throw createHttpError(404, "Esse post nao existe mais.");
    }

    if (post.authorId !== user.id && !isModerator(user)) {
        throw createHttpError(403, "Voce nao pode remover esse post.");
    }

    db.posts = db.posts.filter((item) => item.id !== postId);
    delete db.commentsByPost[postId];
    db.users.forEach((profileUser) => {
        if (profileUser.highlightPostId === postId) {
            profileUser.highlightPostId = "";
        }
    });

    Object.keys(db.likesByUser).forEach((userId) => {
        db.likesByUser[userId] = (db.likesByUser[userId] || []).filter((id) => id !== postId);
    });

    Object.keys(db.boostsByUser).forEach((userId) => {
        db.boostsByUser[userId] = (db.boostsByUser[userId] || []).filter((id) => id !== postId);
    });

    Object.keys(db.savesByUser).forEach((userId) => {
        db.savesByUser[userId] = (db.savesByUser[userId] || []).filter((id) => id !== postId);
    });

    Object.keys(db.activitiesByUser).forEach((userId) => {
        db.activitiesByUser[userId] = (db.activitiesByUser[userId] || []).filter((entry) => entry.postId !== postId);
    });
}

function toggleLike(user, postId) {
    const post = requireVisiblePost(postId, user.id);
    ensureUserCollections(user.id);
    const likedPosts = db.likesByUser[user.id];
    const hasLiked = likedPosts.includes(postId);
    db.likesByUser[user.id] = hasLiked ? likedPosts.filter((id) => id !== postId) : [...likedPosts, postId];

    if (!hasLiked && post.authorId !== user.id) {
        pushActivity(post.authorId, {
            type: "like",
            actorUserId: user.id,
            postId
        });
    }

    return !hasLiked;
}

function toggleBoost(user, postId) {
    const post = requireVisiblePost(postId, user.id);
    ensureUserCollections(user.id);
    const boostedPosts = db.boostsByUser[user.id];
    const hasBoosted = boostedPosts.includes(postId);
    db.boostsByUser[user.id] = hasBoosted ? boostedPosts.filter((id) => id !== postId) : [postId, ...boostedPosts.filter((id) => id !== postId)];

    if (!hasBoosted && post.authorId !== user.id) {
        pushActivity(post.authorId, {
            type: "boost",
            actorUserId: user.id,
            postId
        });
    }

    return !hasBoosted;
}

function toggleSave(user, postId) {
    requireVisiblePost(postId, user.id);
    ensureUserCollections(user.id);
    const savedPosts = db.savesByUser[user.id];
    const hasSaved = savedPosts.includes(postId);
    db.savesByUser[user.id] = hasSaved ? savedPosts.filter((id) => id !== postId) : [...savedPosts, postId];
    return !hasSaved;
}

function toggleFollow(user, targetUserId) {
    const targetUser = getUserById(targetUserId);

    if (!targetUser || targetUser.id === user.id || targetUser.isBanned) {
        throw createHttpError(400, "Nao foi possivel seguir essa conta.");
    }

    ensureUserCollections(user.id);
    const following = db.followsByUser[user.id];
    const isFollowing = following.includes(targetUserId);
    db.followsByUser[user.id] = isFollowing ? following.filter((id) => id !== targetUserId) : [...following, targetUserId];

    if (!isFollowing) {
        pushActivity(targetUserId, {
            type: "follow",
            actorUserId: user.id
        });
    }

    return !isFollowing;
}

function addComment(user, postId, body) {
    const post = requireVisiblePost(postId, user.id);
    const text = sanitizeText(body.text || body.comment || "", 220);

    if (!text) {
        throw createHttpError(400, "Escreva algo antes de comentar.");
    }

    if (!db.commentsByPost[postId]) {
        db.commentsByPost[postId] = [];
    }

    const replyToCommentId = typeof body.replyToCommentId === "string" ? body.replyToCommentId : "";
    const parentComment = replyToCommentId
        ? (db.commentsByPost[postId] || []).find((comment) => comment.id === replyToCommentId) || null
        : null;

    if (replyToCommentId && !parentComment) {
        throw createHttpError(400, "Nao deu para responder esse comentario.");
    }

    const comment = {
        id: createId("comment"),
        authorId: user.id,
        text,
        parentId: parentComment ? parentComment.id : null,
        createdAt: Date.now()
    };

    db.commentsByPost[postId].push(comment);

    const activityTargets = new Set();
    if (post.authorId !== user.id) {
        activityTargets.add(post.authorId);
    }

    if (parentComment && parentComment.authorId !== user.id) {
        activityTargets.add(parentComment.authorId);
    }

    activityTargets.forEach((targetUserId) => {
        pushActivity(targetUserId, {
            type: parentComment && targetUserId === parentComment.authorId ? "reply" : "comment",
            actorUserId: user.id,
            postId,
            commentId: comment.id,
            text
        });
    });

    return comment;
}

function deleteComment(user, postId, commentId) {
    const post = getPostById(postId);
    if (!post) {
        throw createHttpError(404, "Esse post nao existe mais.");
    }

    const comments = db.commentsByPost[postId] || [];
    const comment = comments.find((item) => item.id === commentId);

    if (!comment) {
        throw createHttpError(404, "Esse comentario nao existe mais.");
    }

    if (comment.authorId !== user.id && post.authorId !== user.id && !isModerator(user)) {
        throw createHttpError(403, "Voce nao pode remover esse comentario.");
    }

    const deletedIds = new Set([commentId]);
    let changed = true;

    while (changed) {
        changed = false;
        comments.forEach((item) => {
            if (item.parentId && deletedIds.has(item.parentId) && !deletedIds.has(item.id)) {
                deletedIds.add(item.id);
                changed = true;
            }
        });
    }

    db.commentsByPost[postId] = comments.filter((item) => !deletedIds.has(item.id));

    if (!db.commentsByPost[postId].length) {
        delete db.commentsByPost[postId];
    }

    Object.keys(db.activitiesByUser).forEach((userId) => {
        db.activitiesByUser[userId] = (db.activitiesByUser[userId] || []).filter((entry) => {
            return !(
                (entry.type === "comment" || entry.type === "reply") &&
                entry.postId === postId &&
                deletedIds.has(entry.commentId)
            );
        });
    });

    return Array.from(deletedIds);
}

function recordPostView(user, postId, body) {
    requireVisiblePost(postId, user.id);
    ensureUserCollections(user.id);
    db.viewHistoryByUser[user.id].unshift({
        postId,
        createdAt: Date.now(),
        durationMs: clampNumber(body.durationMs, 0, 120000, 0),
        source: body.source === "inline" ? "inline" : "modal"
    });
    db.viewHistoryByUser[user.id] = db.viewHistoryByUser[user.id].slice(0, 180);
}

function startDirectThread(user, targetUserId) {
    const targetUser = getUserById(targetUserId);
    if (!targetUser || targetUser.id === user.id || targetUser.isBanned) {
        throw createHttpError(400, "Nao foi possivel abrir essa conversa.");
    }

    const existing = findDirectThread(user.id, targetUser.id);
    if (existing) {
        markThreadAsRead(user.id, existing.id);
        return existing.id;
    }

    const now = Date.now();
    const thread = {
        id: createId("thread"),
        participantIds: [user.id, targetUser.id],
        createdAt: now,
        updatedAt: now,
        messages: []
    };

    db.directThreads.unshift(thread);
    return thread.id;
}

function sendDirectMessage(user, threadId, body) {
    const thread = requireThread(threadId, user.id);
    const text = sanitizeText(body.text || "", 1200);

    if (!text) {
        throw createHttpError(400, "Escreva algo antes de enviar.");
    }

    const message = {
        id: createId("message"),
        senderId: user.id,
        text,
        createdAt: Date.now(),
        readBy: [user.id]
    };

    thread.messages.push(message);
    thread.updatedAt = message.createdAt;
    thread.messages = thread.messages.slice(-400);

    const targetUserId = thread.participantIds.find((userId) => userId !== user.id);
    if (targetUserId) {
        pushActivity(targetUserId, {
            type: "message",
            actorUserId: user.id,
            text
        });
    }

    return {
        ...message
    };
}

function markThreadAsRead(userId, threadId) {
    const thread = requireThread(threadId, userId);
    thread.messages.forEach((message) => {
        if (!message.readBy.includes(userId)) {
            message.readBy.push(userId);
        }
    });
}

function setUserBanState(adminUser, targetUserId, isBanned) {
    const targetUser = getUserById(targetUserId);
    if (!targetUser) {
        throw createHttpError(404, "Conta nao encontrada.");
    }

    if (targetUser.id === adminUser.id) {
        throw createHttpError(400, "Nao da para alterar a propria conta por aqui.");
    }

    targetUser.isBanned = Boolean(isBanned);
    targetUser.lastSeenAt = Date.now();

    if (targetUser.isBanned) {
        db.sessions = db.sessions.filter((session) => session.userId !== targetUser.id);
    }
}

function deleteUserAccount(adminUser, targetUserId) {
    const targetUser = getUserById(targetUserId);

    if (!targetUser) {
        throw createHttpError(404, "Conta nao encontrada.");
    }

    if (targetUser.id === adminUser.id) {
        throw createHttpError(400, "Nao da para excluir a propria conta por aqui.");
    }

    db.users = db.users.filter((user) => user.id !== targetUser.id);
    db.sessions = db.sessions.filter((session) => session.userId !== targetUser.id);
    db.recentAccountIds = (db.recentAccountIds || []).filter((userId) => userId !== targetUser.id);
    cleanupDatabase(db);
}

function markAlertsAsSeen(userId) {
    ensureUserCollections(userId);
    const latestActivityAt = (db.activitiesByUser[userId] || [])[0]?.createdAt || 0;
    db.alertsSeenAtByUser[userId] = Math.max(Date.now(), latestActivityAt);
    return db.alertsSeenAtByUser[userId];
}

function sanitizeDatabaseForClient(sourceDb, viewer) {
    const viewerId = viewer?.id || null;
    const isAdminViewer = isModerator(viewer);
    const publicUsers = sourceDb.users.filter((user) => isAdminViewer || !user.isBanned || user.id === viewerId);
    const publicUserIds = new Set(publicUsers.map((user) => user.id));
    const visiblePosts = sourceDb.posts.filter((post) => {
        const author = getUserById(post.authorId);

        if (!author || !publicUserIds.has(author.id)) {
            return false;
        }

        return isAdminViewer || canViewerAccessUserContent(author, viewerId);
    });
    const visiblePostIds = new Set(visiblePosts.map((post) => post.id));

    return {
        version: sourceDb.version,
        sessionUserId: viewerId,
        users: publicUsers.map((user) => ({
            id: user.id,
            name: user.name,
            handle: user.handle,
            bio: user.bio,
            statusNote: user.statusNote || "",
            location: user.location,
            website: user.website,
            profileVisibility: user.profileVisibility,
            presenceVisibility: user.presenceVisibility,
            avatarImage: user.avatarImage,
            avatarFocusX: user.avatarFocusX,
            avatarFocusY: user.avatarFocusY,
            avatarScale: user.avatarScale,
            avatarTone: user.avatarTone,
            profileTheme: user.profileTheme,
            highlightPostId: visiblePostIds.has(user.highlightPostId) ? user.highlightPostId : "",
            coverImage: user.coverImage,
            coverFocusX: user.coverFocusX,
            coverFocusY: user.coverFocusY,
            coverScale: user.coverScale,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt,
            lastSeenAt: user.lastSeenAt,
            isOnline: hasActiveSession(user.id),
            role: user.role,
            isBanned: user.isBanned
        })),
        posts: visiblePosts.map((post) => ({
            ...post
        })),
        likesByUser: filterMapByVisiblePosts(sourceDb.likesByUser, publicUserIds, visiblePostIds),
        boostsByUser: filterMapByVisiblePosts(sourceDb.boostsByUser, publicUserIds, visiblePostIds),
        savesByUser: filterMapByVisiblePosts(sourceDb.savesByUser, publicUserIds, visiblePostIds),
        followsByUser: filterFollowMapForClient(sourceDb.followsByUser, publicUserIds),
        commentsByPost: filterCommentsForClient(sourceDb.commentsByPost, visiblePostIds, publicUserIds),
        activitiesByUser: filterActivitiesForClient(sourceDb.activitiesByUser, publicUserIds, visiblePostIds),
        alertsSeenAtByUser: viewerId ? { [viewerId]: Math.max(0, Number(sourceDb.alertsSeenAtByUser?.[viewerId]) || 0) } : {},
        viewHistoryByUser: viewerId ? { [viewerId]: (sourceDb.viewHistoryByUser?.[viewerId] || []).filter((entry) => visiblePostIds.has(entry.postId)) } : {},
        directThreads: viewerId ? getDirectThreadsForViewer(viewerId, publicUserIds) : [],
        recentAccountIds: [],
        sessions: []
    };
}

function filterMapByVisiblePosts(map, publicUserIds, visiblePostIds) {
    const result = {};

    Object.entries(map || {}).forEach(([userId, postIds]) => {
        if (!publicUserIds.has(userId) || !Array.isArray(postIds)) {
            return;
        }

        result[userId] = uniqueList(postIds.filter((postId) => visiblePostIds.has(postId)));
    });

    return result;
}

function filterFollowMapForClient(map, publicUserIds) {
    const result = {};

    Object.entries(map || {}).forEach(([userId, followedIds]) => {
        if (!publicUserIds.has(userId) || !Array.isArray(followedIds)) {
            return;
        }

        result[userId] = uniqueList(followedIds.filter((followedId) => publicUserIds.has(followedId)));
    });

    return result;
}

function filterCommentsForClient(map, visiblePostIds, publicUserIds) {
    const result = {};

    Object.entries(map || {}).forEach(([postId, comments]) => {
        if (!visiblePostIds.has(postId) || !Array.isArray(comments)) {
            return;
        }

        result[postId] = comments.filter((comment) => publicUserIds.has(comment.authorId));
    });

    return result;
}

function filterActivitiesForClient(map, publicUserIds, visiblePostIds) {
    const result = {};

    Object.entries(map || {}).forEach(([userId, activities]) => {
        if (!publicUserIds.has(userId) || !Array.isArray(activities)) {
            return;
        }

        result[userId] = activities
            .filter((entry) => publicUserIds.has(entry.actorUserId) && (!entry.postId || visiblePostIds.has(entry.postId)))
            .slice(0, 120);
    });

    return result;
}

function getDirectThreadsForViewer(viewerId, publicUserIds) {
    return db.directThreads
        .filter((thread) => thread.participantIds.includes(viewerId))
        .filter((thread) => thread.participantIds.every((userId) => publicUserIds.has(userId)))
        .sort((a, b) => b.updatedAt - a.updatedAt)
        .map((thread) => ({
            ...thread,
            messages: thread.messages.map((message) => ({
                ...message,
                readBy: uniqueList(message.readBy || [])
            }))
        }));
}

function readJsonBody(request) {
    return new Promise((resolve, reject) => {
        let received = 0;
        const chunks = [];

        request.on("data", (chunk) => {
            received += chunk.length;

            if (received > bodyLimit) {
                reject(createHttpError(413, "A requisicao ficou grande demais."));
                request.destroy();
                return;
            }

            chunks.push(chunk);
        });

        request.on("end", () => {
            if (!chunks.length) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
            } catch (error) {
                reject(createHttpError(400, "Nao deu para ler os dados enviados."));
            }
        });

        request.on("error", () => {
            reject(createHttpError(400, "Nao deu para receber a requisicao."));
        });
    });
}

function parseCookies(cookieHeader) {
    return String(cookieHeader || "")
        .split(";")
        .map((entry) => entry.trim())
        .filter(Boolean)
        .reduce((accumulator, entry) => {
            const separator = entry.indexOf("=");

            if (separator === -1) {
                return accumulator;
            }

            const key = entry.slice(0, separator).trim();
            const value = entry.slice(separator + 1).trim();
            accumulator[key] = decodeURIComponent(value);
            return accumulator;
        }, {});
}

function sendAuthCookies(response, context) {
    const cookies = [];
    const ownerKey = ensureOwnerKey(context);
    cookies.push(createCookie(ownerCookieName, ownerKey, { maxAge: 365 * 24 * 60 * 60, httpOnly: true }));

    if (context.sessionToken) {
        cookies.push(createCookie(sessionCookieName, context.sessionToken, { maxAge: sessionTtlDays * 24 * 60 * 60, httpOnly: true }));
    }

    if (cookies.length) {
        response.setHeader("Set-Cookie", cookies);
    }
}

function ensureOwnerKey(context) {
    if (context.ownerKey) {
        return context.ownerKey;
    }

    context.ownerKey = randomToken(18);
    return context.ownerKey;
}

function createCookie(name, value, options = {}) {
    const parts = [`${name}=${encodeURIComponent(value)}`, "Path=/", "SameSite=Lax"];

    if (options.maxAge) {
        parts.push(`Max-Age=${Math.max(0, Number(options.maxAge) || 0)}`);
    }

    if (options.httpOnly !== false) {
        parts.push("HttpOnly");
    }

    if (shouldUseSecureCookies()) {
        parts.push("Secure");
    }

    return parts.join("; ");
}

function clearCookie(response, name) {
    response.setHeader("Set-Cookie", createCookie(name, "", { maxAge: 0, httpOnly: true }));
}

function shouldUseSecureCookies() {
    return process.env.NODE_ENV === "production";
}

function getSessionByToken(token) {
    if (!token) {
        return null;
    }

    const tokenHash = hashSessionToken(token);
    return db.sessions.find((session) => session.tokenHash === tokenHash && session.expiresAt > Date.now()) || null;
}

function createSessionForUser(userId, request) {
    pruneExpiredSessions();
    const rawToken = randomToken();
    const now = Date.now();

    db.sessions.push({
        id: createId("session"),
        userId,
        tokenHash: hashSessionToken(rawToken),
        createdAt: now,
        expiresAt: now + sessionTtlMs,
        lastSeenAt: now,
        userAgentHash: hashValue(String(request.headers["user-agent"] || "")),
        ipHash: hashValue(getClientIp(request))
    });

    return rawToken;
}

function removeSessionByToken(token) {
    if (!token) {
        return;
    }

    const tokenHash = hashSessionToken(token);
    db.sessions = db.sessions.filter((session) => session.tokenHash !== tokenHash);
}

function removeExistingSessionsForUser(userId, request) {
    const requestHash = hashValue(String(request.headers["user-agent"] || ""));
    db.sessions = db.sessions.filter((session) => !(session.userId === userId && session.userAgentHash === requestHash));
}

function pruneExpiredSessions() {
    const now = Date.now();
    db.sessions = db.sessions.filter((session) => session.expiresAt > now);
}

function getUserById(userId) {
    return db.users.find((user) => user.id === userId) || null;
}

function getUserByHandle(handle) {
    return db.users.find((user) => user.handle === handle) || null;
}

function getPostById(postId) {
    return db.posts.find((post) => post.id === postId) || null;
}

function getUserPosts(userId) {
    return db.posts.filter((post) => post.authorId === userId).sort((a, b) => b.createdAt - a.createdAt);
}

function getFollowingIds(userId) {
    return db.followsByUser[userId] || [];
}

function getFollowersOfUser(userId) {
    return db.users.filter((user) => getFollowingIds(user.id).includes(userId)).map((user) => user.id);
}

function ensureUserCollections(userId) {
    if (!db.likesByUser[userId]) {
        db.likesByUser[userId] = [];
    }

    if (!db.boostsByUser[userId]) {
        db.boostsByUser[userId] = [];
    }

    if (!db.savesByUser[userId]) {
        db.savesByUser[userId] = [];
    }

    if (!db.followsByUser[userId]) {
        db.followsByUser[userId] = [];
    }

    if (!db.activitiesByUser[userId]) {
        db.activitiesByUser[userId] = [];
    }

    if (!db.alertsSeenAtByUser[userId]) {
        db.alertsSeenAtByUser[userId] = 0;
    }

    if (!db.viewHistoryByUser[userId]) {
        db.viewHistoryByUser[userId] = [];
    }
}

function pushActivity(targetUserId, payload) {
    ensureUserCollections(targetUserId);
    db.activitiesByUser[targetUserId].unshift({
        id: createId("activity"),
        type: sanitizeText(payload.type || "published", 32) || "published",
        actorUserId: payload.actorUserId,
        postId: payload.postId || null,
        commentId: payload.commentId || null,
        createdAt: Date.now(),
        text: sanitizeText(payload.text || "", 160)
    });
    db.activitiesByUser[targetUserId] = db.activitiesByUser[targetUserId].slice(0, 120);
}

function requireVisiblePost(postId, viewerId) {
    const post = getPostById(postId);

    if (!post) {
        throw createHttpError(404, "Esse post nao existe mais.");
    }

    const author = getUserById(post.authorId);
    if (!author || author.isBanned || !canViewerAccessUserContent(author, viewerId)) {
        throw createHttpError(403, "Esse post nao esta disponivel para voce.");
    }

    return post;
}

function requireThread(threadId, viewerId) {
    const thread = db.directThreads.find((item) => item.id === threadId) || null;

    if (!thread || !thread.participantIds.includes(viewerId)) {
        throw createHttpError(404, "Essa conversa nao existe.");
    }

    return thread;
}

function findDirectThread(userAId, userBId) {
    return (
        db.directThreads.find((thread) => {
            const participants = new Set(thread.participantIds);
            return participants.size === 2 && participants.has(userAId) && participants.has(userBId);
        }) || null
    );
}

function canViewerAccessUserContent(user, viewerId) {
    if (!user || user.isBanned) {
        return false;
    }

    if (user.id === viewerId) {
        return true;
    }

    if (user.profileVisibility !== "private") {
        return true;
    }

    return Boolean(viewerId && getFollowingIds(viewerId).includes(user.id));
}

function hasActiveSession(userId) {
    const now = Date.now();
    return db.sessions.some((session) => session.userId === userId && session.expiresAt > now && now - session.lastSeenAt <= onlineThresholdMs);
}

function getLastPathSegment(pathname, offsetFromEnd) {
    const segments = pathname.split("/").filter(Boolean);
    return segments[segments.length - 1 - offsetFromEnd] || "";
}

process.on("uncaughtException", (error) => {
    console.error("Erro nao tratado", error);
});

process.on("unhandledRejection", (error) => {
    console.error("Rejeicao nao tratada", error);
});

function randomToken(size = 32) {
    return crypto.randomBytes(size).toString("base64url");
}

function hashSessionToken(token) {
    return crypto.createHmac("sha256", sessionSecret).update(token).digest("hex");
}

function hashValue(value) {
    return crypto.createHash("sha256").update(String(value || "")).digest("hex");
}

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${hash}`;
}

function verifyPassword(password, storedValue) {
    const parts = String(storedValue || "").split(":");

    if (parts.length !== 2) {
        return false;
    }

    const [salt, originalHash] = parts;
    const calculatedHash = crypto.scryptSync(password, salt, 64).toString("hex");

    try {
        return crypto.timingSafeEqual(Buffer.from(originalHash, "hex"), Buffer.from(calculatedHash, "hex"));
    } catch (error) {
        return false;
    }
}

function isValidPassword(password) {
    return typeof password === "string" && password.length >= 8 && password.length <= 120;
}

function getClientIp(request) {
    const forwarded = String(request.headers["x-forwarded-for"] || "").split(",")[0].trim();
    return forwarded || String(request.socket?.remoteAddress || "");
}

function createId(prefix) {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeText(value, maxLength) {
    return String(value || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
}

function sanitizeHexColor(value) {
    const normalized = String(value || "")
        .trim()
        .toLowerCase();
    return /^#[0-9a-f]{6}$/i.test(normalized) ? normalized : "";
}

function sanitizeImageSource(value) {
    const source = String(value || "").trim();

    if (!source) {
        return "";
    }

    if (source.startsWith("data:image/")) {
        return source;
    }

    if (/^https?:\/\//i.test(source)) {
        return source;
    }

    return "";
}

function normalizeHandle(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/^@+/, "")
        .replace(/[^a-z0-9._]/g, "")
        .slice(0, 24);
}

function normalizeWebsite(value) {
    const raw = sanitizeText(value || "", 80).replace(/\s+/g, "");

    if (!raw) {
        return "";
    }

    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

    try {
        return new URL(withProtocol).toString();
    } catch (error) {
        return "";
    }
}

function normalizeTag(tag) {
    const cleaned = String(tag || "")
        .toLowerCase()
        .trim()
        .replace(/^#+/, "")
        .replace(/[^a-z0-9_-]/g, "");
    return cleaned ? `#${cleaned}` : "";
}

function normalizeTags(value) {
    const tags = Array.isArray(value) ? value : String(value || "").split(/[,\s]+/);
    return uniqueList(tags.map((tag) => normalizeTag(tag)).filter(Boolean)).slice(0, 6);
}

function normalizeProfileVisibility(value) {
    return value === "private" ? "private" : "public";
}

function normalizePresenceVisibility(value) {
    return ["everyone", "followers", "nobody"].includes(value) ? value : "everyone";
}

function normalizeDistribution(value) {
    return ["both", "feed", "home", "discussion"].includes(value) ? value : "both";
}

function normalizePostKind(value) {
    return value === "discussion" ? "discussion" : "art";
}

function normalizeContentMode(value) {
    return value === "text" ? "text" : "media";
}

function normalizeUserRole(value) {
    return ["user", "moderator", "admin"].includes(value) ? value : "user";
}

function sanitizeCategory(value) {
    const allowed = ["Ilustracao", "Fotografia", "Sketch", "Poster", "Moda", "3D", "Editorial"];
    return allowed.includes(value) ? value : "Ilustracao";
}

function createDefaultPresentation() {
    return {
        surfaceTone: "",
        titleColor: "",
        captionColor: "",
        fontPreset: "clean",
        sticker: {
            src: "",
            fileName: "",
            x: 50,
            y: 50,
            size: 28,
            rotate: 0,
            opacity: 100
        }
    };
}

function normalizePresentation(rawValue) {
    const raw = rawValue && typeof rawValue === "object" ? rawValue : {};
    const rawSticker = raw.sticker && typeof raw.sticker === "object" ? raw.sticker : {};
    const base = createDefaultPresentation();

    return {
        surfaceTone: sanitizeHexColor(raw.surfaceTone || ""),
        titleColor: sanitizeHexColor(raw.titleColor || ""),
        captionColor: sanitizeHexColor(raw.captionColor || ""),
        fontPreset: sanitizeText(raw.fontPreset || base.fontPreset, 24) || base.fontPreset,
        sticker: {
            src: sanitizeImageSource(rawSticker.src || raw.stickerData || ""),
            fileName: sanitizeText(rawSticker.fileName || raw.stickerFileName || "", 80),
            x: clampNumber(rawSticker.x ?? raw.stickerX, 0, 100, 50),
            y: clampNumber(rawSticker.y ?? raw.stickerY, 0, 100, 50),
            size: clampNumber(rawSticker.size ?? raw.stickerSize, 12, 72, 28),
            rotate: clampNumber(rawSticker.rotate ?? raw.stickerRotate, -40, 40, 0),
            opacity: clampNumber(rawSticker.opacity ?? raw.stickerOpacity, 35, 100, 100)
        }
    };
}

function derivePostTitle(rawTitle, rawCaption, rawCategory) {
    const explicitTitle = sanitizeText(rawTitle || "", 60);

    if (explicitTitle) {
        return explicitTitle;
    }

    const caption = sanitizeText(rawCaption || "", 240).replace(/\s+/g, " ").trim();

    if (caption) {
        const firstSentence = caption.split(/[.!?]/)[0].trim();
        return truncateText(capitalizeFirst(firstSentence), 60);
    }

    const fallbacks = {
        Ilustracao: "Nova ilustracao",
        Fotografia: "Novo clique",
        Sketch: "Novo estudo",
        Poster: "Novo poster",
        Moda: "Novo look",
        "3D": "Nova cena 3D",
        Editorial: "Novo editorial"
    };

    return fallbacks[sanitizeCategory(rawCategory)] || "Novo post";
}

function truncateText(value, maxLength) {
    const text = String(value || "").trim();
    if (text.length <= maxLength) {
        return text;
    }
    return `${text.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

function capitalizeFirst(value) {
    const text = String(value || "");
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function uniqueList(items) {
    return [...new Set(items)];
}

function clampNumber(value, min, max, fallback) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return fallback;
    }
    return Math.min(max, Math.max(min, numericValue));
}

function normalizePercentValue(value, fallback) {
    return clampNumber(value, 0, 100, fallback);
}

function normalizeScaleValue(value, fallback) {
    return clampNumber(value, 1, 2.4, fallback);
}
