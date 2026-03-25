const SESSION_KEYS = {
    conversationId: "blackcipher-selected-conversation-id-v4"
};

const AUTO_DELETE_OPTIONS = new Set([0, 30000, 300000, 3600000]);
const TYPING_TTL_MS = 4000;
const TYPING_THROTTLE_MS = 900;
const MESSAGE_IMAGE_MAX_SIZE = 1280;
const AVATAR_IMAGE_MAX_SIZE = 520;
const THEME_STORAGE_KEY = "blackcipher-theme-v2";
const READ_STATE_STORAGE_KEY = "blackcipher-read-state-v1";
const MOBILE_BREAKPOINT = 1180;
const LAB_SAVE_DEBOUNCE_MS = 420;
const LAB_MAX_HISTORY = 160;
const LAB_MAX_FILES = 120;
const LAB_MAX_FILE_SIZE = 12000;

const authScreen = document.getElementById("authScreen");
const chatApp = document.getElementById("chatApp");
const loginTabButton = document.getElementById("loginTabButton");
const registerTabButton = document.getElementById("registerTabButton");
const authStatus = document.getElementById("authStatus");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const registerUsername = document.getElementById("registerUsername");
const registerPassword = document.getElementById("registerPassword");
const registerConfirmPassword = document.getElementById("registerConfirmPassword");
const registeredCountLabel = document.getElementById("registeredCountLabel");

const profileAvatarButton = document.getElementById("profileAvatarButton");
const profileName = document.getElementById("profileName");
const profileHandle = document.getElementById("profileHandle");
const profileStatus = document.getElementById("profileStatus");
const editProfileButton = document.getElementById("editProfileButton");
const switchAccountButton = document.getElementById("switchAccountButton");
const newAccountButton = document.getElementById("newAccountButton");
const newChannelButton = document.getElementById("newChannelButton");
const newDmButton = document.getElementById("newDmButton");
const newGroupButton = document.getElementById("newGroupButton");
const channelsList = document.getElementById("channelsList");
const dmsList = document.getElementById("dmsList");
const groupsList = document.getElementById("groupsList");
const channelsCount = document.getElementById("channelsCount");
const directCount = document.getElementById("directCount");
const groupsCount = document.getElementById("groupsCount");
const authThemeToggleButton = document.getElementById("authThemeToggleButton");
const themeToggleButton = document.getElementById("themeToggleButton");
const themeToggleButtons = [authThemeToggleButton, themeToggleButton].filter(Boolean);
const conversationSearchInput = document.getElementById("conversationSearchInput");
const directoryTabButtons = Array.from(document.querySelectorAll("[data-directory-tab]"));
const directoryPanels = Array.from(document.querySelectorAll("[data-directory-panel]"));

const conversationModeLabel = document.getElementById("conversationModeLabel");
const conversationTitle = document.getElementById("conversationTitle");
const conversationSubtitle = document.getElementById("conversationSubtitle");
const editConversationButton = document.getElementById("editConversationButton");
const inviteMembersButton = document.getElementById("inviteMembersButton");
const autoDeleteSelect = document.getElementById("autoDeleteSelect");
const clearChatButton = document.getElementById("clearChatButton");
const messageCounter = document.getElementById("messageCounter");
const activeUserLabel = document.getElementById("activeUserLabel");
const localUsersLabel = document.getElementById("localUsersLabel");
const memberCountValue = document.getElementById("memberCountValue");
const typingCountValue = document.getElementById("typingCountValue");
const composerHint = document.getElementById("composerHint");
const infoConversationTitle = document.getElementById("infoConversationTitle");
const infoConversationText = document.getElementById("infoConversationText");
const memberCountBadge = document.getElementById("memberCountBadge");
const membersList = document.getElementById("membersList");
const auditCountBadge = document.getElementById("auditCountBadge");
const runtimeStamp = document.getElementById("runtimeStamp");
const auditLogList = document.getElementById("auditLogList");
const infoTabButtons = Array.from(document.querySelectorAll("[data-info-tab]"));
const infoPanels = Array.from(document.querySelectorAll("[data-info-panel]"));
const messagesWrap = document.getElementById("messagesWrap");
const messagesList = document.getElementById("messagesList");
const typingIndicator = document.getElementById("typingIndicator");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const imageInput = document.getElementById("imageInput");
const clearMessageButton = document.getElementById("clearMessageButton");
const attachmentPreview = document.getElementById("attachmentPreview");
const attachmentPreviewImage = document.getElementById("attachmentPreviewImage");
const attachmentFileName = document.getElementById("attachmentFileName");
const removeAttachmentButton = document.getElementById("removeAttachmentButton");

const modalOverlay = document.getElementById("modalOverlay");
const profileModal = document.getElementById("profileModal");
const profileForm = document.getElementById("profileForm");
const profileModalAvatar = document.getElementById("profileModalAvatar");
const profileDisplayNameInput = document.getElementById("profileDisplayNameInput");
const profileStatusInput = document.getElementById("profileStatusInput");
const profileBioInput = document.getElementById("profileBioInput");
const profileAvatarInput = document.getElementById("profileAvatarInput");
const removeProfilePhotoButton = document.getElementById("removeProfilePhotoButton");

const conversationModal = document.getElementById("conversationModal");
const conversationForm = document.getElementById("conversationForm");
const conversationModalTitle = document.getElementById("conversationModalTitle");
const conversationModalCopy = document.getElementById("conversationModalCopy");
const conversationModeInput = document.getElementById("conversationModeInput");
const conversationTypeInput = document.getElementById("conversationTypeInput");
const conversationNameInput = document.getElementById("conversationNameInput");
const conversationDescriptionInput = document.getElementById("conversationDescriptionInput");
const conversationFormHint = document.getElementById("conversationFormHint");
const conversationSubmitButton = document.getElementById("conversationSubmitButton");
const deleteConversationButton = document.getElementById("deleteConversationButton");

const peopleModal = document.getElementById("peopleModal");
const peopleForm = document.getElementById("peopleForm");
const peopleModalTitle = document.getElementById("peopleModalTitle");
const peopleModalCopy = document.getElementById("peopleModalCopy");
const peopleModeInput = document.getElementById("peopleModeInput");
const peopleNameField = document.getElementById("peopleNameField");
const peopleNameInput = document.getElementById("peopleNameInput");
const peopleDescriptionField = document.getElementById("peopleDescriptionField");
const peopleDescriptionInput = document.getElementById("peopleDescriptionInput");
const peopleList = document.getElementById("peopleList");
const peopleFormHint = document.getElementById("peopleFormHint");
const peopleSubmitButton = document.getElementById("peopleSubmitButton");
const labButton = document.getElementById("labButton");
const labModal = document.getElementById("labModal");
const labSaveState = document.getElementById("labSaveState");
const labResetButton = document.getElementById("labResetButton");
const labPromptHandle = document.getElementById("labPromptHandle");
const labCwdChip = document.getElementById("labCwdChip");
const labTree = document.getElementById("labTree");
const labScreen = document.getElementById("labScreen");
const labForm = document.getElementById("labForm");
const labPromptLabel = document.getElementById("labPromptLabel");
const labInput = document.getElementById("labInput");
const labQuickButtons = Array.from(document.querySelectorAll("[data-lab-command]"));
const passwordLengthRange = document.getElementById("passwordLengthRange");
const passwordLengthValue = document.getElementById("passwordLengthValue");
const passwordLowerToggle = document.getElementById("passwordLowerToggle");
const passwordUpperToggle = document.getElementById("passwordUpperToggle");
const passwordNumberToggle = document.getElementById("passwordNumberToggle");
const passwordSymbolToggle = document.getElementById("passwordSymbolToggle");
const passwordSecretOutput = document.getElementById("passwordSecretOutput");
const generatePasswordButton = document.getElementById("generatePasswordButton");
const copyPasswordButton = document.getElementById("copyPasswordButton");
const usePasswordButton = document.getElementById("usePasswordButton");
const passphraseOutput = document.getElementById("passphraseOutput");
const generatePassphraseButton = document.getElementById("generatePassphraseButton");
const copyPassphraseButton = document.getElementById("copyPassphraseButton");
const usePassphraseButton = document.getElementById("usePassphraseButton");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const mobileDock = document.getElementById("mobileDock");
const mobileViewButtons = Array.from(document.querySelectorAll("[data-mobile-view]"));

let users = [];
let conversations = [];
let messages = [];
let typingState = {};
let auditLog = [];
let currentUser = null;
let selectedConversationId = "";
let selectedMessageImage = null;
let pendingProfileAvatarDataUrl = "";
let peopleModalContext = { mode: "", conversationId: "" };
let lastTypingPingAt = 0;
let activeTypingConversationId = "";
let eventSource = null;
let activeDirectoryTab = "all";
let activeInfoTab = "details";
let conversationSearchTerm = "";
let currentTheme = "";
let activeMobileView = "chat";
let readState = loadReadState();
let labState = createDefaultLabState();
let labSaveTimeoutId = 0;
let isSavingLab = false;
let generatedPassword = "";
let generatedPassphrase = "";

function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function truncateText(value, limit = 54) {
    const text = String(value || "").trim();
    if (!text) {
        return "";
    }

    return text.length > limit ? `${text.slice(0, limit - 1)}...` : text;
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

function normalizeLabPath(value, basePath = "/home") {
    const raw = String(value || "").replaceAll("\\", "/").trim();
    const seed = raw.startsWith("/") ? raw : `${basePath || "/home"}/${raw}`;
    const segments = [];

    seed.split("/").forEach((segment) => {
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

function getLabBasename(labPath) {
    const normalized = normalizeLabPath(labPath);
    if (normalized === "/") {
        return "/";
    }

    const segments = normalized.split("/").filter(Boolean);
    return segments[segments.length - 1] || "/";
}

function tokenizeCommand(value) {
    const tokens = [];
    const pattern = /"([^"]*)"|'([^']*)'|`([^`]*)`|(\S+)/g;
    const text = String(value || "");
    let match;

    while ((match = pattern.exec(text))) {
        tokens.push(match[1] ?? match[2] ?? match[3] ?? match[4] ?? "");
    }

    return tokens;
}

function createDefaultLabState(user = currentUser) {
    const loginKey = normalizeUsername(user?.loginKey || user?.username || "operator") || "operator";
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
    const text = String(entry?.text || "").replace(/\r\n/g, "\n").slice(0, 2000);

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

function normalizeLabStateClient(state, user = currentUser) {
    if (!state || typeof state !== "object" || Array.isArray(state)) {
        return createDefaultLabState(user);
    }

    const fileMap = new Map();
    const rawFiles = state.files && typeof state.files === "object" && !Array.isArray(state.files)
        ? Object.entries(state.files)
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

    Array.from(fileMap.keys()).forEach((pathKey) => {
        let parentPath = getLabParentPath(pathKey);

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

    const history = Array.isArray(state.history)
        ? state.history
            .slice(-LAB_MAX_HISTORY)
            .map(normalizeLabHistoryEntry)
            .filter(Boolean)
        : [];

    const cwd = normalizeLabPath(state.cwd || "/home");
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
        updatedAt: Number(state.updatedAt || Date.now())
    };
}

function randomIndex(max) {
    if (!max || max <= 0) {
        return 0;
    }

    if (window.crypto && typeof window.crypto.getRandomValues === "function") {
        const buffer = new Uint32Array(1);
        window.crypto.getRandomValues(buffer);
        return buffer[0] % max;
    }

    return Math.floor(Math.random() * max);
}

function randomChoice(list) {
    return list[randomIndex(list.length)] || "";
}

function shuffleString(value) {
    const characters = value.split("");
    for (let index = characters.length - 1; index > 0; index -= 1) {
        const swapIndex = randomIndex(index + 1);
        [characters[index], characters[swapIndex]] = [characters[swapIndex], characters[index]];
    }

    return characters.join("");
}

function generatePasswordValue() {
    const length = Number(passwordLengthRange?.value || 18);
    const groups = [];

    if (passwordLowerToggle?.checked) {
        groups.push("abcdefghijkmnopqrstuvwxyz");
    }

    if (passwordUpperToggle?.checked) {
        groups.push("ABCDEFGHJKLMNPQRSTUVWXYZ");
    }

    if (passwordNumberToggle?.checked) {
        groups.push("23456789");
    }

    if (passwordSymbolToggle?.checked) {
        groups.push("!@#$%&*+-_=?:");
    }

    const safeGroups = groups.length ? groups : ["abcdefghijkmnopqrstuvwxyz"];
    const pool = safeGroups.join("");
    let password = safeGroups.map((group) => randomChoice(group)).join("");

    while (password.length < length) {
        password += randomChoice(pool);
    }

    return shuffleString(password.slice(0, length));
}

function generatePassphraseValue() {
    const words = [
        "cipher", "raven", "signal", "ghost", "matrix", "ember", "vector", "shadow",
        "node", "pulse", "trace", "onyx", "nova", "orbit", "frost", "delta",
        "kernel", "zero", "echo", "cloak", "vault", "hex", "storm", "relay"
    ];

    return [randomChoice(words), randomChoice(words), randomChoice(words)].join("-");
}

function updatePasswordLengthLabel() {
    if (passwordLengthValue && passwordLengthRange) {
        passwordLengthValue.textContent = passwordLengthRange.value;
    }
}

function renderToolOutputs() {
    updatePasswordLengthLabel();
    if (passwordSecretOutput) {
        passwordSecretOutput.textContent = generatedPassword || "Gerar para usar aqui.";
    }

    if (passphraseOutput) {
        passphraseOutput.textContent = generatedPassphrase || "cipher-raven-signal";
    }
}

function refreshToolSecrets() {
    generatedPassword = generatePasswordValue();
    generatedPassphrase = generatePassphraseValue();
    renderToolOutputs();
}

async function copyTextToClipboard(text) {
    if (!text) {
        return false;
    }

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        return false;
    }
}

function insertTextAtCursor(targetInput, text) {
    if (!targetInput || !text) {
        return;
    }

    const start = targetInput.selectionStart ?? targetInput.value.length;
    const end = targetInput.selectionEnd ?? targetInput.value.length;
    const nextValue = `${targetInput.value.slice(0, start)}${text}${targetInput.value.slice(end)}`;

    targetInput.value = nextValue;
    targetInput.focus();
    targetInput.setSelectionRange(start + text.length, start + text.length);
    autoGrowMessageInput();
}

function flashButtonText(button, text, timeout = 1200) {
    if (!button) {
        return;
    }

    const previousText = button.textContent;
    button.textContent = text;
    window.setTimeout(() => {
        button.textContent = previousText;
    }, timeout);
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

function formatTime(timestamp) {
    return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    }).format(new Date(timestamp));
}

function formatDay(timestamp) {
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(new Date(timestamp));
}

function formatSidebarTime(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();

    if (date.toDateString() === today.toDateString()) {
        return formatTime(timestamp);
    }

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit"
    }).format(date);
}

function formatAutoDelete(ms) {
    if (!ms) {
        return "Mensagens permanentes";
    }

    if (ms === 30000) {
        return "Mensagens somem em 30 segundos";
    }

    if (ms === 300000) {
        return "Mensagens somem em 5 minutos";
    }

    if (ms === 3600000) {
        return "Mensagens somem em 1 hora";
    }

    return "Autoexclusao personalizada";
}

function getRemainingText(expiresAt) {
    const remainingMs = expiresAt - Date.now();

    if (remainingMs <= 0) {
        return "Expirando...";
    }

    if (remainingMs < 60000) {
        return `${Math.ceil(remainingMs / 1000)}s restantes`;
    }

    return `${Math.ceil(remainingMs / 60000)} min restantes`;
}

function getInitials(value) {
    const name = cleanDisplayName(value) || "BC";
    const parts = name.split(" ").filter(Boolean).slice(0, 2);
    if (!parts.length) {
        return name.slice(0, 2).toUpperCase();
    }

    return parts.map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

function getAutoDeleteLabel() {
    return formatAutoDelete(normalizeAutoDeleteMs(autoDeleteSelect.value));
}

function normalizeUserRecord(user) {
    const username = sanitizeUsername(user.username || user.loginKey || "user");
    const loginKey = normalizeUsername(user.loginKey || username || user.id || "user");

    return {
        id: user.id || createId(),
        username: username || "user",
        loginKey: loginKey || `user-${Math.random().toString(36).slice(2, 6)}`,
        displayName: cleanDisplayName(user.displayName || username || loginKey) || username || loginKey,
        statusText: cleanDisplayName(user.statusText || user.status || "online na rede") || "online na rede",
        bio: String(user.bio || "").trim().slice(0, 260),
        avatarDataUrl: typeof user.avatarDataUrl === "string" ? user.avatarDataUrl : "",
        autoDeleteMs: normalizeAutoDeleteMs(user.autoDeleteMs),
        createdAt: Number(user.createdAt || Date.now()),
        lastLoginAt: Number(user.lastLoginAt || user.createdAt || Date.now())
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
        conversationId: String(message.conversationId || ""),
        authorId: String(message.authorId || ""),
        text: String(message.text || "").replace(/\r\n/g, "\n"),
        imageDataUrl: typeof message.imageDataUrl === "string" ? message.imageDataUrl : "",
        imageName: String(message.imageName || ""),
        createdAt: Number(message.createdAt || Date.now()),
        editedAt: message.editedAt ? Number(message.editedAt) : null,
        expiresAt: message.expiresAt ? Number(message.expiresAt) : null
    };
}

function normalizeTypingState(rawTypingState) {
    if (!rawTypingState || typeof rawTypingState !== "object" || Array.isArray(rawTypingState)) {
        return {};
    }

    const normalized = {};

    Object.entries(rawTypingState).forEach(([key, value]) => {
        if (!value || typeof value !== "object" || !value.conversationId || !value.userId) {
            return;
        }

        normalized[key] = {
            conversationId: value.conversationId,
            userId: value.userId,
            at: Number(value.at || Date.now())
        };
    });

    return normalized;
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

function applySnapshot(snapshot) {
    users = Array.isArray(snapshot?.users) ? snapshot.users.map(normalizeUserRecord) : [];
    conversations = Array.isArray(snapshot?.conversations) ? snapshot.conversations.map(normalizeConversationRecord) : [];
    messages = Array.isArray(snapshot?.messages) ? snapshot.messages.map(normalizeMessageRecord) : [];
    typingState = normalizeTypingState(snapshot?.typing);
    auditLog = Array.isArray(snapshot?.auditLog) ? snapshot.auditLog.map(normalizeAuditEntry) : [];
    currentUser = snapshot?.currentUser ? normalizeUserRecord(snapshot.currentUser) : null;
    labState = normalizeLabStateClient(snapshot?.labState, snapshot?.currentUser || currentUser);

    if (currentUser) {
        const currentUserFromList = users.find((user) => user.id === currentUser.id);
        if (currentUserFromList) {
            Object.assign(currentUserFromList, currentUser);
            currentUser = currentUserFromList;
        } else {
            users = [...users, currentUser];
        }
    }
}

function resetAppState() {
    users = [];
    conversations = [];
    messages = [];
    typingState = {};
    auditLog = [];
    currentUser = null;
    selectedConversationId = "";
    selectedMessageImage = null;
    pendingProfileAvatarDataUrl = "";
    peopleModalContext = { mode: "", conversationId: "" };
    lastTypingPingAt = 0;
    activeTypingConversationId = "";
    activeDirectoryTab = "all";
    activeInfoTab = "details";
    conversationSearchTerm = "";
    activeMobileView = "chat";
    labState = createDefaultLabState();
    clearTimeout(labSaveTimeoutId);
    labSaveTimeoutId = 0;
    isSavingLab = false;
}

function loadReadState() {
    try {
        const raw = JSON.parse(readFromStorage(READ_STATE_STORAGE_KEY) || "{}");
        return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    } catch (error) {
        return {};
    }
}

function saveReadState() {
    writeToStorage(READ_STATE_STORAGE_KEY, JSON.stringify(readState));
}

function readFromStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function writeToStorage(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        return false;
    }
}

function getReadMapForCurrentUser() {
    if (!currentUser?.id) {
        return {};
    }

    if (!readState[currentUser.id] || typeof readState[currentUser.id] !== "object") {
        readState[currentUser.id] = {};
    }

    return readState[currentUser.id];
}

function getConversationReadAt(conversationId) {
    if (!currentUser?.id || !conversationId) {
        return 0;
    }

    return Number(getReadMapForCurrentUser()[conversationId] || 0);
}

function markConversationAsRead(conversationId, readAt = Date.now()) {
    if (!currentUser?.id || !conversationId) {
        return false;
    }

    const conversationMessages = getConversationMessages(conversationId);
    const latestVisibleAt = conversationMessages[conversationMessages.length - 1]?.createdAt || readAt;
    const nextReadAt = Math.max(Number(readAt || 0), Number(latestVisibleAt || 0));
    const readMap = getReadMapForCurrentUser();

    if (Number(readMap[conversationId] || 0) >= nextReadAt) {
        return false;
    }

    readMap[conversationId] = nextReadAt;
    saveReadState();
    return true;
}

function syncReadStateForActiveConversation() {
    if (!currentUser || !selectedConversationId || document.hidden) {
        return;
    }

    markConversationAsRead(selectedConversationId);
}

function getUnreadCount(conversation) {
    if (!currentUser || !conversation) {
        return 0;
    }

    const readAt = getConversationReadAt(conversation.id);

    return getConversationMessages(conversation.id)
        .filter((message) => message.authorId !== currentUser.id)
        .filter((message) => message.createdAt > readAt)
        .length;
}

function getStoredConversationId() {
    return sessionStorage.getItem(SESSION_KEYS.conversationId) || "";
}

function setStoredConversationId(conversationId) {
    sessionStorage.setItem(SESSION_KEYS.conversationId, conversationId);
}

function clearStoredConversationId() {
    sessionStorage.removeItem(SESSION_KEYS.conversationId);
}

function getUserById(userId) {
    return users.find((user) => user.id === userId) || null;
}

function isConversationVisible(conversation) {
    if (!currentUser) {
        return false;
    }

    if (conversation.type === "channel") {
        return true;
    }

    return conversation.memberIds.includes(currentUser.id);
}

function getVisibleConversations() {
    return conversations
        .filter(isConversationVisible)
        .sort((left, right) => getConversationActivityAt(right) - getConversationActivityAt(left));
}

function getConversationById(conversationId) {
    return conversations.find((conversation) => conversation.id === conversationId) || null;
}

function getSelectedConversation() {
    return getConversationById(selectedConversationId);
}

function getConversationMessages(conversationId) {
    return messages
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

function getUserStatus(user) {
    return cleanDisplayName(user?.statusText || "online na rede") || "online na rede";
}

function getConversationMembers(conversation) {
    if (!conversation) {
        return [];
    }

    if (conversation.type === "channel") {
        return [...users].sort((left, right) => getUserDisplayName(left).localeCompare(getUserDisplayName(right), "pt-BR"));
    }

    return conversation.memberIds
        .map((memberId) => getUserById(memberId))
        .filter(Boolean)
        .sort((left, right) => getUserDisplayName(left).localeCompare(getUserDisplayName(right), "pt-BR"));
}

function getOtherDmMember(conversation) {
    if (!conversation || conversation.type !== "dm" || !currentUser) {
        return null;
    }

    return getConversationMembers(conversation).find((member) => member.id !== currentUser.id) || null;
}

function getConversationDisplayName(conversation) {
    if (!conversation) {
        return "Sem conversa";
    }

    if (conversation.type === "channel") {
        return `# ${conversation.name}`;
    }

    if (conversation.type === "dm") {
        const otherMember = getOtherDmMember(conversation);
        return otherMember ? getUserDisplayName(otherMember) : "PV privado";
    }

    if (conversation.name) {
        return conversation.name;
    }

    const members = getConversationMembers(conversation)
        .filter((member) => member.id !== currentUser?.id)
        .map((member) => getUserDisplayName(member));

    return members.join(", ") || "Grupo privado";
}

function getConversationSubtitle(conversation) {
    if (!conversation) {
        return "Selecione um canal, PV ou grupo para iniciar a troca.";
    }

    if (conversation.type === "channel") {
        return conversation.description || "Canal aberto para todas as contas sincronizadas.";
    }

    if (conversation.type === "dm") {
        const otherMember = getOtherDmMember(conversation);
        return otherMember
            ? `Chat privado direto com @${otherMember.loginKey}.`
            : "Conversa privada entre membros.";
    }

    return conversation.description || `${getConversationMembers(conversation).length} membros conectados neste grupo.`;
}

function getConversationDetailText(conversation) {
    if (!conversation) {
        return "Escolha uma conversa para abrir o painel lateral de contexto.";
    }

    const members = getConversationMembers(conversation);
    const createdBy = getUserById(conversation.createdBy);
    const creatorLabel = createdBy ? `Criado por @${createdBy.loginKey}.` : "Criado no workspace sincronizado.";

    if (conversation.type === "channel") {
        return `${conversation.description || "Canal publico do workspace."} ${creatorLabel}`;
    }

    if (conversation.type === "dm") {
        return `PV entre ${members.map((member) => getUserDisplayName(member)).join(" e ")}.`;
    }

    return `${conversation.description || "Grupo privado com multiplos membros."} ${creatorLabel}`;
}

function getConversationModeLabel(conversation) {
    if (!conversation) {
        return "Sem contexto";
    }

    if (conversation.type === "channel") {
        return "Canal";
    }

    if (conversation.type === "dm") {
        return "Chat privado";
    }

    return "Grupo";
}

function getConversationSymbol(conversation) {
    if (conversation.type === "channel") {
        return "#";
    }

    if (conversation.type === "dm") {
        return "PV";
    }

    return "GR";
}

function getConversationPreviewText(conversation) {
    const lastMessage = getLastMessage(conversation.id);

    if (!lastMessage) {
        if (conversation.type === "channel") {
            return conversation.description || "Canal aguardando trafego.";
        }

        if (conversation.type === "dm") {
            return "Abra o PV e envie o primeiro sinal.";
        }

        return conversation.description || "Grupo pronto para atividade.";
    }

    if (lastMessage.imageDataUrl && !lastMessage.text) {
        return "imagem enviada";
    }

    if (lastMessage.imageDataUrl && lastMessage.text) {
        return `${truncateText(lastMessage.text, 34)} + imagem`;
    }

    return truncateText(lastMessage.text || "mensagem");
}

function getMessageAuthor(message) {
    const user = getUserById(message.authorId);

    if (user) {
        return {
            displayName: getUserDisplayName(user),
            handle: user.loginKey,
            avatarDataUrl: user.avatarDataUrl || "",
            initials: getInitials(getUserDisplayName(user))
        };
    }

    return {
        displayName: "Operador",
        handle: "operador",
        avatarDataUrl: "",
        initials: "OP"
    };
}

function getAvatarMarkup({ avatarDataUrl, label, initials }) {
    if (avatarDataUrl) {
        return `<img class="avatar-image" src="${escapeHtml(avatarDataUrl)}" alt="${escapeHtml(label)}" loading="lazy" decoding="async">`;
    }

    return `<span class="avatar-fallback">${escapeHtml(initials)}</span>`;
}

function setAvatarContainer(element, avatarDataUrl, label, initials) {
    element.innerHTML = getAvatarMarkup({
        avatarDataUrl,
        label,
        initials
    });
}

function setAuthStatus(message = "", type = "") {
    authStatus.textContent = message;
    authStatus.className = "auth-status";

    if (!message) {
        authStatus.classList.add("hidden");
        return;
    }

    authStatus.classList.remove("hidden");

    if (type === "success") {
        authStatus.classList.add("auth-status-success");
    }

    if (type === "error") {
        authStatus.classList.add("auth-status-error");
    }
}

function setAuthMode(mode) {
    const isLogin = mode === "login";

    loginTabButton.classList.toggle("tab-button-active", isLogin);
    registerTabButton.classList.toggle("tab-button-active", !isLogin);
    loginTabButton.setAttribute("aria-selected", String(isLogin));
    registerTabButton.setAttribute("aria-selected", String(!isLogin));
    loginForm.classList.toggle("hidden", !isLogin);
    registerForm.classList.toggle("hidden", isLogin);

    if (isLogin) {
        loginUsername.focus();
    } else {
        registerUsername.focus();
    }
}

function updateRegisteredCounters() {
    const label = `${users.length} ${users.length === 1 ? "conta" : "contas"}`;
    registeredCountLabel.textContent = label;
    localUsersLabel.textContent = label;
}

function showAuth(mode = "login", message = "", type = "") {
    closeEventStream();
    closeModal();
    authScreen.classList.remove("hidden");
    chatApp.classList.add("hidden");
    setAuthMode(mode);
    setAuthStatus(message, type);
    updateRegisteredCounters();
}

function showChat() {
    authScreen.classList.add("hidden");
    chatApp.classList.remove("hidden");
}

function ensureSelectedConversation(preferredConversationId = "") {
    const visibleConversations = getVisibleConversations();

    if (!visibleConversations.length) {
        selectedConversationId = "";
        clearStoredConversationId();
        return;
    }

    const rememberedConversationId = preferredConversationId || getStoredConversationId() || selectedConversationId;
    const rememberedConversation = visibleConversations.find((conversation) => conversation.id === rememberedConversationId);

    if (rememberedConversation) {
        selectedConversationId = rememberedConversation.id;
        setStoredConversationId(selectedConversationId);
        return;
    }

    selectedConversationId = visibleConversations[0].id;
    setStoredConversationId(selectedConversationId);
}

function renderCurrentUser() {
    if (!currentUser) {
        setAvatarContainer(profileAvatarButton, "", "avatar", "BC");
        profileName.textContent = "Conta";
        profileHandle.textContent = "@blackcipher";
        profileStatus.textContent = "Status aguardando edicao.";
        activeUserLabel.textContent = "@blackcipher";
        autoDeleteSelect.value = "0";
        return;
    }

    setAvatarContainer(
        profileAvatarButton,
        currentUser.avatarDataUrl,
        getUserDisplayName(currentUser),
        getInitials(getUserDisplayName(currentUser))
    );
    profileName.textContent = getUserDisplayName(currentUser);
    profileHandle.textContent = `@${currentUser.loginKey}`;
    profileStatus.textContent = getUserStatus(currentUser);
    activeUserLabel.textContent = `@${currentUser.loginKey}`;
    autoDeleteSelect.value = String(currentUser.autoDeleteMs || 0);
}

function buildConversationItemMarkup(conversation) {
    const isActive = conversation.id === selectedConversationId;
    const lastMessage = getLastMessage(conversation.id);
    const previewText = getConversationPreviewText(conversation);
    const activityText = formatSidebarTime(getConversationActivityAt(conversation));
    const unreadCount = getUnreadCount(conversation);

    return `
        <button class="conversation-item ${isActive ? "conversation-item-active" : ""} ${unreadCount ? "conversation-item-unread" : ""}" type="button" data-conversation-id="${escapeHtml(conversation.id)}">
            <span class="conversation-symbol">${escapeHtml(getConversationSymbol(conversation))}</span>
            <span class="conversation-copy">
                <strong>${escapeHtml(getConversationDisplayName(conversation))}</strong>
                <small>${escapeHtml(previewText)}</small>
            </span>
            <span class="conversation-tail">
                <span class="conversation-meta">${escapeHtml(lastMessage ? activityText : "idle")}</span>
                ${unreadCount ? `<span class="conversation-unread-badge">${escapeHtml(unreadCount > 99 ? "99+" : String(unreadCount))}</span>` : ""}
            </span>
        </button>
    `;
}

function renderConversationList(container, items, emptyText) {
    if (!items.length) {
        container.innerHTML = `<p class="conversation-empty">${escapeHtml(emptyText)}</p>`;
        return;
    }

    container.innerHTML = items.map(buildConversationItemMarkup).join("");
}

function renderConversationLists() {
    const visibleConversations = getVisibleConversations().filter(conversationMatchesSearch);
    const visibleChannels = visibleConversations.filter((conversation) => conversation.type === "channel");
    const visibleDms = visibleConversations.filter((conversation) => conversation.type === "dm");
    const visibleGroups = visibleConversations.filter((conversation) => conversation.type === "group");

    channelsCount.textContent = String(visibleChannels.length);
    directCount.textContent = String(visibleDms.length);
    groupsCount.textContent = String(visibleGroups.length);

    renderConversationList(channelsList, visibleChannels, "Nenhum canal criado ainda.");
    renderConversationList(dmsList, visibleDms, "Nenhum PV ativo no momento.");
    renderConversationList(groupsList, visibleGroups, "Nenhum grupo privado criado.");
    updateDirectoryTabs();
}

function renderHeader() {
    const conversation = getSelectedConversation();

    if (!conversation) {
        conversationModeLabel.textContent = "Sem contexto";
        conversationTitle.textContent = "Nenhuma conversa";
        conversationSubtitle.textContent = "Crie um canal, um PV ou um grupo para comecar a troca.";
        infoConversationTitle.textContent = "Nenhuma conversa";
        infoConversationText.textContent = "Selecione ou crie uma sala para ver os detalhes aqui.";
        editConversationButton.disabled = true;
        inviteMembersButton.disabled = true;
        clearChatButton.disabled = true;
        messageInput.disabled = true;
        imageInput.disabled = true;
        return;
    }

    conversationModeLabel.textContent = getConversationModeLabel(conversation);
    conversationTitle.textContent = getConversationDisplayName(conversation);
    conversationSubtitle.textContent = getConversationSubtitle(conversation);
    infoConversationTitle.textContent = getConversationDisplayName(conversation);
    infoConversationText.textContent = getConversationDetailText(conversation);
    editConversationButton.disabled = conversation.type === "dm";
    inviteMembersButton.disabled = conversation.type === "channel";
    clearChatButton.disabled = getConversationMessages(conversation.id).length === 0;
    messageInput.disabled = false;
    imageInput.disabled = false;
}

function buildMemberRowMarkup(user) {
    return `
        <div class="member-row">
            <div class="member-avatar">
                ${getAvatarMarkup({
                    avatarDataUrl: user.avatarDataUrl,
                    label: getUserDisplayName(user),
                    initials: getInitials(getUserDisplayName(user))
                })}
            </div>
            <div class="member-copy">
                <strong>${escapeHtml(getUserDisplayName(user))}${user.id === currentUser?.id ? " (voce)" : ""}</strong>
                <small>@${escapeHtml(user.loginKey)} · ${escapeHtml(getUserStatus(user))}</small>
            </div>
        </div>
    `;
}

function renderMembers() {
    const conversation = getSelectedConversation();
    const members = getConversationMembers(conversation);
    const countText = `${members.length} ${members.length === 1 ? "membro" : "membros"}`;

    memberCountBadge.textContent = String(members.length);
    memberCountValue.textContent = countText;

    if (activeInfoTab !== "members") {
        return;
    }

    if (!members.length) {
        membersList.innerHTML = `<p class="conversation-empty">Sem membros visiveis nesta conversa.</p>`;
        return;
    }

    membersList.innerHTML = members.map(buildMemberRowMarkup).join("");
}

function renderAuditLog() {
    runtimeStamp.textContent = formatTime(Date.now());
    auditCountBadge.textContent = String(auditLog.length);

    if (activeInfoTab !== "audit") {
        return;
    }

    if (!auditLog.length) {
        auditLogList.innerHTML = `<p class="conversation-empty">Nenhum evento auditado ainda.</p>`;
        return;
    }

    auditLogList.innerHTML = auditLog.slice(0, 28).map((entry) => `
        <article class="audit-log-entry">
            <div class="audit-log-meta">
                <span class="audit-log-action">${escapeHtml(entry.action)}</span>
                <span>${escapeHtml(entry.actorName)}</span>
                <span>@${escapeHtml(entry.actorHandle || "system")}</span>
                <span>${escapeHtml(formatTime(entry.createdAt))}</span>
            </div>
            <p class="audit-log-detail">${escapeHtml(entry.detail || "Sem detalhe adicional.")}</p>
            ${entry.payloadCipher ? `<pre class="audit-log-payload">${escapeHtml(entry.payloadCipher)}</pre>` : ""}
        </article>
    `).join("");
}

function getSelectedConversationMessages() {
    if (!selectedConversationId) {
        return [];
    }

    return getConversationMessages(selectedConversationId);
}

function buildMessageCardMarkup(message) {
    const author = getMessageAuthor(message);
    const isOwn = currentUser && message.authorId === currentUser.id;
    const expireBadge = message.expiresAt
        ? `<span class="message-expire" data-message-id="${escapeHtml(message.id)}">${escapeHtml(getRemainingText(message.expiresAt))}</span>`
        : "";
    const editedBadge = message.editedAt ? `<span class="message-edited">editada</span>` : "";
    const imageHtml = message.imageDataUrl
        ? `
            <figure class="message-media">
                <img src="${escapeHtml(message.imageDataUrl)}" alt="${escapeHtml(message.imageName || "Imagem enviada")}" loading="lazy" decoding="async">
            </figure>
        `
        : "";
    const textHtml = message.text
        ? `<p class="message-text">${escapeHtml(message.text)}</p>`
        : "";

    return `
        <article class="message-card ${isOwn ? "message-card-self" : ""}">
            <div class="message-avatar">
                ${getAvatarMarkup({
                    avatarDataUrl: author.avatarDataUrl,
                    label: author.displayName,
                    initials: author.initials
                })}
            </div>
            <div class="message-body">
                <div class="message-meta">
                    <span class="message-author">${escapeHtml(author.displayName)}</span>
                    <span>@${escapeHtml(author.handle)}</span>
                    <span>${escapeHtml(formatTime(message.createdAt))}</span>
                    ${editedBadge}
                    ${expireBadge}
                </div>
                ${textHtml}
                ${imageHtml}
            </div>
        </article>
    `;
}

function renderMessages() {
    const selectedMessages = getSelectedConversationMessages();

    if (!selectedConversationId) {
        messagesList.innerHTML = `
            <section class="empty-state">
                <p class="eyebrow">Workspace</p>
                <h3>Sem conversa ativa.</h3>
                <p>Crie um canal, um PV ou um grupo e use este painel para texto livre, imagens e digitacao em tempo real.</p>
            </section>
        `;
        messageCounter.textContent = "0 mensagens";
        return;
    }

    if (!selectedMessages.length) {
        const selectedConversation = getSelectedConversation();
        const scopeLabel = selectedConversation?.type === "channel"
            ? "canal"
            : selectedConversation?.type === "dm"
                ? "PV"
                : "grupo";

        messagesList.innerHTML = `
            <section class="empty-state">
                <p class="eyebrow">${escapeHtml(getConversationModeLabel(selectedConversation))}</p>
                <h3>Sem trafego nesta conversa.</h3>
                <p>Envie texto livre, uma imagem ou ambos para ativar este ${escapeHtml(scopeLabel)}.</p>
            </section>
        `;
        messageCounter.textContent = "0 mensagens";
        return;
    }

    let previousDay = "";
    const html = selectedMessages.map((message) => {
        const currentDay = formatDay(message.createdAt);
        const divider = currentDay !== previousDay
            ? `<div class="day-divider"><span>${escapeHtml(currentDay)}</span></div>`
            : "";

        previousDay = currentDay;
        return `${divider}${buildMessageCardMarkup(message)}`;
    }).join("");

    messagesList.innerHTML = html;
    messageCounter.textContent = `${selectedMessages.length} ${selectedMessages.length === 1 ? "mensagem" : "mensagens"}`;
}

function getActiveTypers() {
    const now = Date.now();
    return Object.values(typingState)
        .filter((entry) => entry.conversationId === selectedConversationId)
        .filter((entry) => entry.userId !== currentUser?.id)
        .filter((entry) => now - entry.at <= TYPING_TTL_MS)
        .map((entry) => getUserById(entry.userId))
        .filter(Boolean);
}

function renderTypingIndicator() {
    const typers = getActiveTypers();

    typingCountValue.textContent = `${typers.length} ${typers.length === 1 ? "sinal" : "sinais"}`;

    if (!typers.length) {
        typingIndicator.textContent = "";
        return;
    }

    const names = typers.map((user) => getUserDisplayName(user));
    if (names.length === 1) {
        typingIndicator.textContent = `${names[0]} esta digitando...`;
        return;
    }

    if (names.length === 2) {
        typingIndicator.textContent = `${names[0]} e ${names[1]} estao digitando...`;
        return;
    }

    typingIndicator.textContent = `${names[0]}, ${names[1]} e mais ${names.length - 2} pessoas estao digitando...`;
}

function renderOverview() {
    const selectedConversation = getSelectedConversation();
    const members = getConversationMembers(selectedConversation);

    updateRegisteredCounters();
    memberCountValue.textContent = `${members.length} ${members.length === 1 ? "membro" : "membros"}`;
    memberCountBadge.textContent = String(members.length);
    composerHint.textContent = getAutoDeleteLabel();
}

function renderAttachmentPreview() {
    if (!selectedMessageImage) {
        attachmentPreview.classList.add("hidden");
        attachmentPreviewImage.removeAttribute("src");
        attachmentFileName.textContent = "";
        return;
    }

    attachmentPreview.classList.remove("hidden");
    attachmentPreviewImage.src = selectedMessageImage.dataUrl;
    attachmentPreviewImage.alt = selectedMessageImage.name || "Imagem anexada";
    attachmentFileName.textContent = selectedMessageImage.name;
}

function autoGrowMessageInput() {
    messageInput.style.height = "0px";
    messageInput.style.height = `${Math.min(messageInput.scrollHeight, 340)}px`;
}

function renderApp() {
    renderCurrentUser();
    ensureSelectedConversation();
    syncReadStateForActiveConversation();
    renderConversationLists();
    renderHeader();
    renderOverview();
    renderMessages();
    renderMembers();
    renderAuditLog();
    renderTypingIndicator();
    renderAttachmentPreview();
    refreshModalViews();
    updateThemeToggleLabel();
    updateInfoTabs();
    updateMobileView();
    renderToolOutputs();
}

function getLabNode(targetPath) {
    const pathKey = normalizeLabPath(targetPath, labState.cwd);
    return labState.files[pathKey] || null;
}

function getLabChildren(targetPath = labState.cwd) {
    const parentPath = normalizeLabPath(targetPath, labState.cwd);
    const parentDepth = parentPath === "/" ? 0 : parentPath.split("/").filter(Boolean).length;

    return Object.entries(labState.files)
        .filter(([pathKey]) => pathKey !== parentPath && getLabParentPath(pathKey) === parentPath)
        .sort((left, right) => {
            if (left[1].type !== right[1].type) {
                return left[1].type === "dir" ? -1 : 1;
            }

            return left[0].localeCompare(right[0], "en");
        })
        .map(([pathKey, node]) => ({
            path: pathKey,
            depth: Math.max(parentDepth, 0),
            ...node
        }));
}

function ensureLabDir(pathKey) {
    const targetPath = normalizeLabPath(pathKey, labState.cwd);
    if (targetPath === "/") {
        labState.files["/"] = { type: "dir" };
        return;
    }

    const parentPath = getLabParentPath(targetPath);
    if (parentPath) {
        ensureLabDir(parentPath);
    }

    const existingNode = labState.files[targetPath];
    if (existingNode && existingNode.type === "file") {
        throw new Error(`Ja existe um arquivo em ${targetPath}.`);
    }

    labState.files[targetPath] = { type: "dir" };
}

function writeLabFile(pathKey, content) {
    const targetPath = normalizeLabPath(pathKey, labState.cwd);
    const parentPath = getLabParentPath(targetPath);

    if (!parentPath) {
        throw new Error("Arquivo invalido.");
    }

    if (labState.files[targetPath]?.type === "dir") {
        throw new Error(`Ja existe uma pasta em ${targetPath}.`);
    }

    ensureLabDir(parentPath);
    labState.files[targetPath] = {
        type: "file",
        content: String(content || "").replace(/\r\n/g, "\n").slice(0, LAB_MAX_FILE_SIZE)
    };
}

function removeLabPath(pathKey) {
    const targetPath = normalizeLabPath(pathKey, labState.cwd);

    if (targetPath === "/" || targetPath === "/home") {
        throw new Error("Esse caminho e protegido.");
    }

    Object.keys(labState.files).forEach((entryPath) => {
        if (entryPath === targetPath || entryPath.startsWith(`${targetPath}/`)) {
            delete labState.files[entryPath];
        }
    });

    if (!getLabNode(labState.cwd)) {
        labState.cwd = "/home";
    }
}

function appendLabHistory(type, text) {
    const entry = normalizeLabHistoryEntry({
        type,
        text,
        at: Date.now()
    });

    if (!entry) {
        return;
    }

    labState.history = [...(labState.history || []), entry].slice(-LAB_MAX_HISTORY);
}

function getLabPromptText() {
    const handle = currentUser?.loginKey || "operator";
    return `${handle}:${labState.cwd}$`;
}

function setLabSaveBadge(text, state = "") {
    if (!labSaveState) {
        return;
    }

    labSaveState.textContent = text;
    labSaveState.dataset.state = state;
}

function finalizeLabMutation(save = true) {
    labState = normalizeLabStateClient({
        ...labState,
        updatedAt: Date.now()
    }, currentUser);

    renderLab();

    if (save) {
        queueLabSave();
    }
}

function buildLabTreeMarkup() {
    const rows = Object.keys(labState.files)
        .sort((left, right) => left.localeCompare(right, "en"))
        .filter((pathKey) => pathKey !== "/")
        .map((pathKey) => {
            const node = labState.files[pathKey];
            const depth = Math.max(pathKey.split("/").filter(Boolean).length - 1, 0);
            const label = getLabBasename(pathKey);
            const isActive = pathKey === labState.cwd;
            return `
                <button
                    class="lab-tree-row ${isActive ? "lab-tree-row-active" : ""}"
                    type="button"
                    data-lab-path="${escapeHtml(pathKey)}"
                    style="--lab-depth:${depth};"
                >
                    <span class="mono">${escapeHtml(node.type === "dir" ? "[]" : "--")}</span>
                    <span>${escapeHtml(label)}</span>
                </button>
            `;
        });

    return rows.join("") || `<p class="conversation-empty">Lab vazio.</p>`;
}

function renderLab() {
    if (!labModal) {
        return;
    }

    const handle = currentUser?.loginKey || "operator";
    const lines = (labState.history || []).map((entry) => `
        <article class="lab-line lab-line-${escapeHtml(entry.type)}">
            <div class="lab-line-meta mono">${escapeHtml(formatTime(entry.at))}</div>
            <pre>${escapeHtml(entry.text)}</pre>
        </article>
    `).join("");

    labPromptHandle.textContent = `@${handle}`;
    labCwdChip.textContent = labState.cwd;
    labPromptLabel.textContent = getLabPromptText();
    labTree.innerHTML = buildLabTreeMarkup();
    labScreen.innerHTML = lines || `<p class="conversation-empty">Sem saida ainda.</p>`;
    labScreen.scrollTop = labScreen.scrollHeight;
}

function openLabModal() {
    setLabSaveBadge("pronto", "idle");
    renderLab();
    openModal(labModal);
    setTimeout(() => {
        labInput?.focus();
    }, 0);
}

function queueLabSave() {
    if (!currentUser) {
        return;
    }

    clearTimeout(labSaveTimeoutId);
    setLabSaveBadge("salvando", "saving");
    labSaveTimeoutId = window.setTimeout(() => {
        void saveLabState();
    }, LAB_SAVE_DEBOUNCE_MS);
}

async function saveLabState() {
    if (!currentUser || isSavingLab) {
        return;
    }

    labSaveTimeoutId = 0;
    isSavingLab = true;
    setLabSaveBadge("salvando", "saving");

    try {
        const data = await apiRequest("/api/lab", {
            method: "PATCH",
            body: {
                labState
            }
        });

        labState = normalizeLabStateClient(data.labState, currentUser);
        setLabSaveBadge("salvo", "saved");
        renderLab();
    } catch (error) {
        if (error?.status === 401) {
            handleSessionEnded();
            return;
        }

        setLabSaveBadge("erro", "error");
        console.error("Falha ao salvar Labs.", error);
    } finally {
        isSavingLab = false;
    }
}

function buildLabTreeText(targetPath = labState.cwd, prefix = "") {
    const node = getLabNode(targetPath);
    if (!node) {
        throw new Error("Caminho nao encontrado.");
    }

    const currentLabel = targetPath === "/" ? "/" : getLabBasename(targetPath);
    const lines = [`${prefix}${node.type === "dir" ? "[]" : "--"} ${currentLabel}`];
    const children = getLabChildren(targetPath);

    children.forEach((child, index) => {
        const isLast = index === children.length - 1;
        const branch = `${prefix}${isLast ? "\\-" : "|-"}`;
        const nextPrefix = `${prefix}${isLast ? "  " : "| "}`;

        if (child.type === "dir") {
            const nestedLines = buildLabTreeText(child.path, nextPrefix).split("\n");
            nestedLines[0] = `${branch} ${nestedLines[0].slice(nextPrefix.length)}`;
            lines.push(...nestedLines);
            return;
        }

        lines.push(`${branch} -- ${getLabBasename(child.path)}`);
    });

    return lines.join("\n");
}

async function runLabSiteCommand(targetPath) {
    const route = String(targetPath || "/").trim() || "/";

    if (!route.startsWith("/")) {
        throw new Error("Use rotas locais como / ou /api/health.");
    }

    const response = await fetch(route, {
        method: "GET",
        credentials: "same-origin",
        headers: {
            Accept: "text/plain, application/json, text/html"
        }
    });

    const body = (await response.text()).slice(0, 1200) || "(vazio)";
    appendLabHistory(response.ok ? "output" : "error", `[${response.status}] ${route}\n${body}`);
}

async function executeLabCommand(rawCommand) {
    const commandText = String(rawCommand || "").trim();
    if (!commandText) {
        return;
    }

    appendLabHistory("input", `${getLabPromptText()} ${commandText}`);
    const tokens = tokenizeCommand(commandText);
    const command = (tokens[0] || "").toLowerCase();
    const args = tokens.slice(1);

    try {
        switch (command) {
            case "help":
                appendLabHistory(
                    "output",
                    "help\npwd\nls [path]\ntree [path]\ncd <path>\nmkdir <dir>\ntouch <file>\nwrite <file> <text>\ncat <file>\nrm <path>\nsite <route>\nopen <route>\nwhoami\ndate\nclear\nresetlab"
                );
                break;
            case "pwd":
                appendLabHistory("output", labState.cwd);
                break;
            case "ls": {
                const targetPath = normalizeLabPath(args[0] || labState.cwd, labState.cwd);
                const node = getLabNode(targetPath);
                if (!node) {
                    throw new Error("Caminho nao encontrado.");
                }

                if (node.type === "file") {
                    appendLabHistory("output", getLabBasename(targetPath));
                    break;
                }

                const list = getLabChildren(targetPath)
                    .map((entry) => `${entry.type === "dir" ? "[]" : "--"} ${getLabBasename(entry.path)}`)
                    .join("\n");
                appendLabHistory("output", list || "(vazio)");
                break;
            }
            case "tree": {
                const targetPath = normalizeLabPath(args[0] || labState.cwd, labState.cwd);
                appendLabHistory("output", buildLabTreeText(targetPath));
                break;
            }
            case "cd": {
                const targetPath = normalizeLabPath(args[0] || "/home", labState.cwd);
                const node = getLabNode(targetPath);
                if (!node || node.type !== "dir") {
                    throw new Error("Diretorio nao encontrado.");
                }

                labState.cwd = targetPath;
                break;
            }
            case "mkdir":
                if (!args.length) {
                    throw new Error("Informe o nome da pasta.");
                }

                args.forEach((pathKey) => ensureLabDir(pathKey));
                break;
            case "touch":
                if (!args.length) {
                    throw new Error("Informe o nome do arquivo.");
                }

                args.forEach((pathKey) => writeLabFile(pathKey, getLabNode(pathKey)?.content || ""));
                break;
            case "write":
                if (args.length < 2) {
                    throw new Error("Use: write <arquivo> <texto>");
                }

                writeLabFile(args[0], args.slice(1).join(" "));
                break;
            case "cat": {
                const targetPath = normalizeLabPath(args[0], labState.cwd);
                const node = getLabNode(targetPath);
                if (!node || node.type !== "file") {
                    throw new Error("Arquivo nao encontrado.");
                }

                appendLabHistory("output", node.content || "(vazio)");
                break;
            }
            case "rm":
                if (!args.length) {
                    throw new Error("Informe o caminho.");
                }

                removeLabPath(args[0]);
                break;
            case "echo":
                appendLabHistory("output", args.join(" "));
                break;
            case "whoami":
                appendLabHistory("output", `@${currentUser?.loginKey || "operator"}`);
                break;
            case "date":
                appendLabHistory("output", new Date().toLocaleString("pt-BR"));
                break;
            case "site":
                await runLabSiteCommand(args[0] || "/");
                break;
            case "open": {
                const route = String(args[0] || "/").trim() || "/";
                if (!route.startsWith("/")) {
                    throw new Error("Use rotas locais como / ou /api/health.");
                }

                window.open(route, "_blank", "noopener");
                appendLabHistory("output", `aberto: ${route}`);
                break;
            }
            case "clear":
                labState.history = [
                    {
                        id: createId(),
                        type: "system",
                        text: "Tela limpa.",
                        at: Date.now()
                    }
                ];
                break;
            case "resetlab":
                labState = createDefaultLabState(currentUser);
                break;
            default:
                throw new Error("Comando invalido. Digite help.");
        }
    } catch (error) {
        appendLabHistory("error", error?.message || "Falha no comando.");
    }

    finalizeLabMutation();
}

function handleLabTreeClick(event) {
    const button = event.target.closest("[data-lab-path]");
    if (!button) {
        return;
    }

    const pathKey = button.dataset.labPath || "/home";
    const node = getLabNode(pathKey);
    if (!node) {
        return;
    }

    if (node.type === "dir") {
        labState.cwd = pathKey;
        finalizeLabMutation();
        labInput?.focus();
        return;
    }

    appendLabHistory("output", node.content || "(vazio)");
    finalizeLabMutation();
}

function openModal(modal) {
    modalOverlay.classList.remove("hidden");
    [profileModal, conversationModal, peopleModal, labModal].forEach((item) => {
        item.classList.add("hidden");
    });
    modal.classList.remove("hidden");
}

function closeModal() {
    modalOverlay.classList.add("hidden");
    [profileModal, conversationModal, peopleModal, labModal].forEach((item) => {
        item.classList.add("hidden");
    });
}

function refreshModalViews() {
    if (!currentUser) {
        return;
    }

    if (!profileModal.classList.contains("hidden")) {
        setAvatarContainer(
            profileModalAvatar,
            pendingProfileAvatarDataUrl,
            getUserDisplayName(currentUser),
            getInitials(profileDisplayNameInput.value || getUserDisplayName(currentUser))
        );
    }

    if (!peopleModal.classList.contains("hidden")) {
        renderPeoplePicker();
    }

    if (!labModal.classList.contains("hidden")) {
        renderLab();
    }
}

function setSelectedConversation(conversationId) {
    const targetConversation = getConversationById(conversationId);

    if (!targetConversation || !isConversationVisible(targetConversation)) {
        return;
    }

    clearOwnTyping();
    selectedConversationId = conversationId;
    setStoredConversationId(conversationId);
    setActiveMobileView("chat");
    renderApp();
    messageInput.focus();
}

function updateMessageExpireBadges() {
    const selectedMessages = getSelectedConversationMessages();
    const messageMap = new Map(selectedMessages.map((message) => [message.id, message]));

    messagesList.querySelectorAll(".message-expire").forEach((badge) => {
        const message = messageMap.get(badge.dataset.messageId);
        if (message) {
            badge.textContent = getRemainingText(message.expiresAt);
        }
    });
}

async function apiRequest(url, options = {}) {
    const requestOptions = {
        method: options.method || "GET",
        headers: {
            Accept: "application/json"
        },
        credentials: "same-origin"
    };

    if (options.body !== undefined) {
        requestOptions.headers["Content-Type"] = "application/json";
        requestOptions.body = JSON.stringify(options.body);
    }

    if (options.keepalive) {
        requestOptions.keepalive = true;
    }

    let response;

    try {
        response = await fetch(url, requestOptions);
    } catch (error) {
        const networkError = new Error("Falha de conexao com o servidor.");
        networkError.cause = error;
        throw networkError;
    }

    const text = await response.text();
    let payload = {};

    if (text) {
        try {
            payload = JSON.parse(text);
        } catch (error) {
            payload = {};
        }
    }

    if (!response.ok) {
        const requestError = new Error(payload.error || "Falha no servidor.");
        requestError.status = response.status;
        requestError.payload = payload;
        throw requestError;
    }

    return payload;
}

function handleSessionEnded(message = "Sessao encerrada. Entre novamente para continuar.", type = "error") {
    closeEventStream();
    closeModal();
    resetAppState();
    clearStoredConversationId();
    if (conversationSearchInput) {
        conversationSearchInput.value = "";
    }
    renderCurrentUser();
    updateRegisteredCounters();
    updateDirectoryTabs();
    updateInfoTabs();
    updateMobileView();
    showAuth("login", message, type);
}

function handleSnapshot(snapshot, preferredConversationId = "") {
    applySnapshot(snapshot);
    ensureSelectedConversation(preferredConversationId);
    renderApp();
    showChat();
    openEventStream();
}

function showRequestError(error, fallbackMessage = "Nao foi possivel concluir a operacao.") {
    if (error?.status === 401) {
        handleSessionEnded();
        return;
    }

    window.alert(error?.message || fallbackMessage);
}

async function refreshSession(reason = "") {
    try {
        const data = await apiRequest("/api/session");

        if (!data.authenticated || !data.snapshot) {
            handleSessionEnded(reason ? `${reason}` : "", reason ? "error" : "");
            return false;
        }

        handleSnapshot(data.snapshot);
        return true;
    } catch (error) {
        showRequestError(error, "Nao foi possivel restaurar a sessao.");
        return false;
    }
}

function closeEventStream() {
    if (!eventSource) {
        return;
    }

    eventSource.close();
    eventSource = null;
}

function loadThemePreference() {
    const storedTheme = readFromStorage(THEME_STORAGE_KEY);

    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    if (typeof window.matchMedia === "function") {
        return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }

    return "dark";
}

function updateThemeToggleLabel() {
    if (!themeToggleButtons.length) {
        return;
    }

    const label = currentTheme === "light" ? "Dark" : "Light";
    const ariaLabel = currentTheme === "light" ? "Ativar modo noturno" : "Ativar modo claro";

    themeToggleButtons.forEach((button) => {
        button.textContent = label;
        button.setAttribute("aria-label", ariaLabel);
    });
}

function applyTheme(theme) {
    currentTheme = theme === "light" ? "light" : "dark";
    document.body.dataset.theme = currentTheme;
    document.documentElement.style.colorScheme = currentTheme;
    writeToStorage(THEME_STORAGE_KEY, currentTheme);

    if (themeColorMeta) {
        themeColorMeta.setAttribute("content", currentTheme === "light" ? "#edf2f7" : "#07090d");
    }

    updateThemeToggleLabel();
}

function toggleTheme() {
    applyTheme(currentTheme === "light" ? "dark" : "light");
}

function updateMobileView() {
    document.body.dataset.mobileView = activeMobileView;

    if (!mobileDock) {
        return;
    }

    const isCompact = window.innerWidth <= MOBILE_BREAKPOINT;
    mobileDock.classList.toggle("hidden", !isCompact);

    mobileViewButtons.forEach((button) => {
        const isActive = button.dataset.mobileView === activeMobileView;
        button.classList.toggle("mobile-dock-button-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
    });
}

function setActiveMobileView(view) {
    activeMobileView = ["nav", "chat", "info"].includes(view) ? view : "chat";
    updateMobileView();
}

function conversationMatchesSearch(conversation) {
    const term = conversationSearchTerm.trim().toLowerCase();

    if (!term) {
        return true;
    }

    const pieces = [
        getConversationDisplayName(conversation),
        getConversationPreviewText(conversation),
        getConversationSubtitle(conversation),
        conversation.description || ""
    ];

    return pieces.some((piece) => String(piece || "").toLowerCase().includes(term));
}

function updateDirectoryTabs() {
    directoryTabButtons.forEach((button) => {
        const isActive = button.dataset.directoryTab === activeDirectoryTab;
        button.classList.toggle("directory-tab-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
    });

    directoryPanels.forEach((panel) => {
        const panelName = panel.dataset.directoryPanel;
        const shouldShow = activeDirectoryTab === "all" || panelName === activeDirectoryTab;
        panel.classList.toggle("hidden", !shouldShow);
    });
}

function setActiveDirectoryTab(tab) {
    activeDirectoryTab = ["all", "channels", "dms", "groups"].includes(tab) ? tab : "all";
    updateDirectoryTabs();
}

function updateInfoTabs() {
    infoTabButtons.forEach((button) => {
        const isActive = button.dataset.infoTab === activeInfoTab;
        button.classList.toggle("info-tab-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
    });

    infoPanels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.infoPanel !== activeInfoTab);
    });
}

function setActiveInfoTab(tab) {
    activeInfoTab = ["details", "members", "audit", "intel"].includes(tab) ? tab : "details";
    updateInfoTabs();

    if (activeInfoTab === "members") {
        renderMembers();
    }

    if (activeInfoTab === "audit") {
        renderAuditLog();
    }
}

function openEventStream() {
    if (!currentUser || eventSource) {
        return;
    }

    eventSource = new EventSource("/api/stream");

    eventSource.addEventListener("snapshot", (event) => {
        try {
            const payload = JSON.parse(event.data || "{}");
            if (payload.snapshot) {
                applySnapshot(payload.snapshot);
                ensureSelectedConversation();
                renderApp();
                showChat();
            }
        } catch (error) {
            console.error("Falha ao ler snapshot SSE.", error);
        }
    });

    eventSource.addEventListener("typing", (event) => {
        try {
            const payload = JSON.parse(event.data || "{}");
            typingState = normalizeTypingState(payload.typing);
            renderTypingIndicator();
        } catch (error) {
            console.error("Falha ao ler typing SSE.", error);
        }
    });

    eventSource.addEventListener("session-ended", () => {
        handleSessionEnded();
    });

    eventSource.onerror = () => {
        if (!currentUser) {
            return;
        }

        if (eventSource && eventSource.readyState === EventSource.CLOSED) {
            closeEventStream();
        }
    };
}

function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error || new Error("Falha ao ler o arquivo."));
        reader.readAsDataURL(file);
    });
}

function loadImageElement(dataUrl) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Nao foi possivel processar a imagem."));
        image.src = dataUrl;
    });
}

function canvasToOptimizedDataUrl(canvas) {
    const webpDataUrl = canvas.toDataURL("image/webp", 0.82);

    if (webpDataUrl.startsWith("data:image/webp")) {
        return webpDataUrl;
    }

    return canvas.toDataURL("image/jpeg", 0.84);
}

async function compressImageFile(file, maxDimension) {
    if (!file.type.startsWith("image/")) {
        throw new Error("Selecione um arquivo de imagem valido.");
    }

    const dataUrl = await readFileAsDataUrl(file);
    const image = await loadImageElement(dataUrl);
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.width * scale));
    canvas.height = Math.max(1, Math.round(image.height * scale));

    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return {
        name: file.name,
        dataUrl: canvasToOptimizedDataUrl(canvas)
    };
}

function getDefaultGroupName() {
    return `squad-${Date.now().toString(36).slice(-4)}`;
}

function openProfileModal() {
    if (!currentUser) {
        return;
    }

    pendingProfileAvatarDataUrl = currentUser.avatarDataUrl || "";
    profileForm.reset();
    profileDisplayNameInput.value = getUserDisplayName(currentUser);
    profileStatusInput.value = getUserStatus(currentUser);
    profileBioInput.value = currentUser.bio || "";
    profileAvatarInput.value = "";
    setAvatarContainer(
        profileModalAvatar,
        pendingProfileAvatarDataUrl,
        getUserDisplayName(currentUser),
        getInitials(getUserDisplayName(currentUser))
    );
    openModal(profileModal);
}

function openConversationModal(mode, conversationType, conversation = null) {
    conversationForm.reset();
    conversationModeInput.value = mode;
    conversationTypeInput.value = conversationType;

    if (mode === "create") {
        conversationModalTitle.textContent = conversationType === "channel" ? "Criar canal" : "Criar grupo";
        conversationModalCopy.textContent = conversationType === "channel"
            ? "Canais sao publicos para todas as contas sincronizadas e todos podem editar."
            : "Configure o nome e a descricao deste grupo privado.";
        conversationFormHint.textContent = conversationType === "channel"
            ? "Use nomes curtos e claros. O canal aparece para todos os usuarios."
            : "Grupos aceitam nome livre e descricao opcional.";
        conversationSubmitButton.textContent = "Criar";
        deleteConversationButton.classList.add("hidden");
    } else {
        conversationModalTitle.textContent = conversationType === "channel" ? "Editar canal" : "Editar grupo";
        conversationModalCopy.textContent = "Ajuste os metadados desta conversa.";
        conversationFormHint.textContent = "As alteracoes ficam visiveis para todos os membros.";
        conversationSubmitButton.textContent = "Salvar";
        deleteConversationButton.classList.remove("hidden");
    }

    if (conversation) {
        conversationNameInput.value = conversation.name || "";
        conversationDescriptionInput.value = conversation.description || "";
        deleteConversationButton.dataset.conversationId = conversation.id;
    } else {
        deleteConversationButton.dataset.conversationId = "";
    }

    openModal(conversationModal);
    conversationNameInput.focus();
}

function getSelectableUsersForPeopleModal() {
    if (!currentUser) {
        return [];
    }

    const conversation = getConversationById(peopleModalContext.conversationId);

    if (peopleModalContext.mode === "new-dm" || peopleModalContext.mode === "new-group") {
        return users.filter((user) => user.id !== currentUser.id);
    }

    if (peopleModalContext.mode === "invite" && conversation) {
        const memberSet = new Set(conversation.memberIds);
        return users.filter((user) => !memberSet.has(user.id));
    }

    return [];
}

function renderPeoplePicker() {
    const selectableUsers = getSelectableUsersForPeopleModal();

    if (!selectableUsers.length) {
        peopleList.innerHTML = `<p class="conversation-empty">Nenhuma conta disponivel para esta acao.</p>`;
        peopleSubmitButton.disabled = true;
        return;
    }

    peopleSubmitButton.disabled = false;
    peopleList.innerHTML = selectableUsers.map((user) => `
        <label class="picker-option">
            <input type="${peopleModalContext.mode === "new-dm" ? "radio" : "checkbox"}" name="peopleSelection" value="${escapeHtml(user.id)}">
            <div class="picker-option-avatar">
                ${getAvatarMarkup({
                    avatarDataUrl: user.avatarDataUrl,
                    label: getUserDisplayName(user),
                    initials: getInitials(getUserDisplayName(user))
                })}
            </div>
            <div class="picker-copy">
                <strong>${escapeHtml(getUserDisplayName(user))}</strong>
                <small>@${escapeHtml(user.loginKey)} · ${escapeHtml(getUserStatus(user))}</small>
            </div>
        </label>
    `).join("");
}

function openPeopleModal(mode, conversation = null) {
    peopleForm.reset();
    peopleModeInput.value = mode;
    peopleModalContext = {
        mode,
        conversationId: conversation?.id || ""
    };

    peopleNameField.classList.add("hidden");
    peopleDescriptionField.classList.add("hidden");

    if (mode === "new-dm") {
        peopleModalTitle.textContent = "Novo PV";
        peopleModalCopy.textContent = "Escolha uma conta para abrir um chat privado direto.";
        peopleFormHint.textContent = "Selecione exatamente um usuario.";
        peopleSubmitButton.textContent = "Abrir PV";
    }

    if (mode === "new-group") {
        peopleModalTitle.textContent = "Novo grupo";
        peopleModalCopy.textContent = "Selecione membros e nomeie o grupo antes de criar.";
        peopleFormHint.textContent = "Escolha pelo menos um membro alem de voce.";
        peopleSubmitButton.textContent = "Criar grupo";
        peopleNameField.classList.remove("hidden");
        peopleDescriptionField.classList.remove("hidden");
    }

    if (mode === "invite") {
        const selectedConversation = conversation || getSelectedConversation();
        if (!selectedConversation) {
            return;
        }

        if (selectedConversation.type === "dm") {
            peopleModalTitle.textContent = "Expandir PV";
            peopleModalCopy.textContent = "Adicione novos membros e este PV vira um grupo privado.";
            peopleFormHint.textContent = "Escolha quem entra no grupo.";
            peopleSubmitButton.textContent = "Converter em grupo";
            peopleNameField.classList.remove("hidden");
            peopleDescriptionField.classList.remove("hidden");
            peopleNameInput.value = getDefaultGroupName();
            peopleDescriptionInput.value = "Grupo criado a partir de um PV.";
        } else {
            peopleModalTitle.textContent = "Convidar membros";
            peopleModalCopy.textContent = "Adicione novas contas a esta conversa privada.";
            peopleFormHint.textContent = "Selecione pelo menos uma conta.";
            peopleSubmitButton.textContent = "Convidar";
        }
    }

    renderPeoplePicker();
    openModal(peopleModal);
}

function readSelectedPeopleIds() {
    return Array.from(peopleList.querySelectorAll("input[name='peopleSelection']:checked")).map((input) => input.value);
}

async function handleRegister(event) {
    event.preventDefault();
    setAuthStatus();

    const username = sanitizeUsername(registerUsername.value);
    const password = registerPassword.value;
    const confirmPassword = registerConfirmPassword.value;
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError) {
        setAuthStatus(usernameError, "error");
        registerUsername.focus();
        return;
    }

    if (passwordError) {
        setAuthStatus(passwordError, "error");
        registerPassword.focus();
        return;
    }

    if (password !== confirmPassword) {
        setAuthStatus("A confirmacao da senha precisa ser igual a senha criada.", "error");
        registerConfirmPassword.focus();
        return;
    }

    try {
        const data = await apiRequest("/api/auth/register", {
            method: "POST",
            body: {
                username,
                password
            }
        });

        registerForm.reset();
        setAuthStatus();
        handleSnapshot(data.snapshot);
    } catch (error) {
        setAuthStatus(error.message || "Nao foi possivel criar a conta.", "error");
    }
}

async function handleLogin(event) {
    event.preventDefault();
    setAuthStatus();

    const username = normalizeUsername(loginUsername.value);
    const password = loginPassword.value;

    if (!username) {
        setAuthStatus("Digite o usuario da conta.", "error");
        loginUsername.focus();
        return;
    }

    try {
        const data = await apiRequest("/api/auth/login", {
            method: "POST",
            body: {
                username,
                password
            }
        });

        loginForm.reset();
        setAuthStatus();
        handleSnapshot(data.snapshot);
    } catch (error) {
        setAuthStatus(error.message || "Nao foi possivel entrar na conta.", "error");
    }
}

async function clearSessionAndReturn(mode, message) {
    try {
        await apiRequest("/api/auth/logout", {
            method: "POST"
        });
    } catch (error) {
        console.error("Falha ao encerrar sessao.", error);
    }

    handleSessionEnded(message, "success");
    setAuthMode(mode);
}

async function handleAutoDeleteChange() {
    if (!currentUser) {
        return;
    }

    try {
        const data = await apiRequest("/api/preferences", {
            method: "PATCH",
            body: {
                autoDeleteMs: normalizeAutoDeleteMs(autoDeleteSelect.value)
            }
        });

        handleSnapshot(data.snapshot, selectedConversationId);
    } catch (error) {
        showRequestError(error, "Nao foi possivel atualizar a autoexclusao.");
    }
}

async function handleProfileAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
        return;
    }

    try {
        const compressed = await compressImageFile(file, AVATAR_IMAGE_MAX_SIZE);
        pendingProfileAvatarDataUrl = compressed.dataUrl;
        refreshModalViews();
    } catch (error) {
        window.alert(error.message || "Nao foi possivel processar a imagem do perfil.");
    }
}

async function handleProfileSave(event) {
    event.preventDefault();

    if (!currentUser) {
        return;
    }

    const displayName = cleanDisplayName(profileDisplayNameInput.value);
    if (!displayName) {
        profileDisplayNameInput.focus();
        return;
    }

    try {
        const data = await apiRequest("/api/profile", {
            method: "PATCH",
            body: {
                displayName,
                statusText: cleanDisplayName(profileStatusInput.value) || "online na rede",
                bio: String(profileBioInput.value || "").trim().slice(0, 260),
                avatarDataUrl: pendingProfileAvatarDataUrl || ""
            }
        });

        handleSnapshot(data.snapshot, selectedConversationId);
        closeModal();
    } catch (error) {
        showRequestError(error, "Nao foi possivel salvar o perfil.");
    }
}

async function handleConversationSubmit(event) {
    event.preventDefault();

    const mode = conversationModeInput.value;
    const type = conversationTypeInput.value;
    const sanitizedName = sanitizeConversationName(conversationNameInput.value, type);
    const sanitizedDescription = sanitizeDescription(conversationDescriptionInput.value);

    if (!sanitizedName) {
        conversationNameInput.focus();
        return;
    }

    try {
        if (mode === "create") {
            const data = await apiRequest("/api/conversations", {
                method: "POST",
                body: {
                    type,
                    name: sanitizedName,
                    description: sanitizedDescription
                }
            });

            handleSnapshot(data.snapshot, data.conversationId);
            closeModal();
            return;
        }

        const conversationId = deleteConversationButton.dataset.conversationId;
        const data = await apiRequest(`/api/conversations/${encodeURIComponent(conversationId)}`, {
            method: "PATCH",
            body: {
                name: sanitizedName,
                description: sanitizedDescription
            }
        });

        handleSnapshot(data.snapshot, selectedConversationId);
        closeModal();
    } catch (error) {
        showRequestError(error, "Nao foi possivel salvar a sala.");
    }
}

async function handlePeopleSubmit(event) {
    event.preventDefault();

    const selectedIds = readSelectedPeopleIds();
    const mode = peopleModeInput.value;

    try {
        if (mode === "new-dm") {
            if (selectedIds.length !== 1) {
                return;
            }

            const data = await apiRequest("/api/direct-messages", {
                method: "POST",
                body: {
                    otherUserId: selectedIds[0]
                }
            });

            handleSnapshot(data.snapshot, data.conversationId);
            closeModal();
            return;
        }

        if (mode === "new-group") {
            const groupName = sanitizeConversationName(peopleNameInput.value, "group");
            if (!groupName || !selectedIds.length) {
                if (!groupName) {
                    peopleNameInput.focus();
                }
                return;
            }

            const data = await apiRequest("/api/conversations", {
                method: "POST",
                body: {
                    type: "group",
                    name: groupName,
                    description: sanitizeDescription(peopleDescriptionInput.value),
                    memberIds: selectedIds
                }
            });

            handleSnapshot(data.snapshot, data.conversationId);
            closeModal();
            return;
        }

        if (mode === "invite") {
            if (!selectedIds.length) {
                return;
            }

            const data = await apiRequest(`/api/conversations/${encodeURIComponent(peopleModalContext.conversationId)}/invite`, {
                method: "POST",
                body: {
                    memberIds: selectedIds,
                    name: sanitizeConversationName(peopleNameInput.value, "group") || getDefaultGroupName(),
                    description: sanitizeDescription(peopleDescriptionInput.value)
                }
            });

            handleSnapshot(data.snapshot, selectedConversationId);
            closeModal();
        }
    } catch (error) {
        showRequestError(error, "Nao foi possivel concluir esta acao.");
    }
}

async function sendMessage(event) {
    event.preventDefault();

    if (!currentUser || !selectedConversationId) {
        return;
    }

    const text = messageInput.value.replace(/\r\n/g, "\n");
    const normalizedText = text.trim();

    if (!normalizedText && !selectedMessageImage) {
        messageInput.focus();
        return;
    }

    try {
        const data = await apiRequest("/api/messages", {
            method: "POST",
            body: {
                conversationId: selectedConversationId,
                text,
                imageDataUrl: selectedMessageImage?.dataUrl || "",
                imageName: selectedMessageImage?.name || ""
            }
        });

        handleSnapshot(data.snapshot, selectedConversationId);
        activeTypingConversationId = "";
        messageForm.reset();
        selectedMessageImage = null;
        renderAttachmentPreview();
        messageInput.value = "";
        autoGrowMessageInput();
        messagesWrap.scrollTop = messagesWrap.scrollHeight;
    } catch (error) {
        showRequestError(error, "Nao foi possivel enviar a mensagem.");
    }
}

async function handleComposerImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
        return;
    }

    try {
        await setSelectedImageFromFile(file);
    } catch (error) {
        window.alert(error.message || "Nao foi possivel processar a imagem.");
    }
}

function extractImageFileFromList(fileList) {
    return Array.from(fileList || []).find((file) => file.type && file.type.startsWith("image/")) || null;
}

function getClipboardImageFile(event) {
    const clipboardItems = Array.from(event.clipboardData?.items || []);

    for (const item of clipboardItems) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
            return item.getAsFile();
        }
    }

    return null;
}

async function setSelectedImageFromFile(file) {
    if (!file) {
        return;
    }

    selectedMessageImage = await compressImageFile(file, MESSAGE_IMAGE_MAX_SIZE);
    renderAttachmentPreview();
    focusComposer();
}

async function handleComposerPaste(event) {
    const imageFile = getClipboardImageFile(event);

    if (!imageFile) {
        return;
    }

    event.preventDefault();

    try {
        await setSelectedImageFromFile(imageFile);
    } catch (error) {
        window.alert(error.message || "Nao foi possivel colar a imagem.");
    }
}

function setComposerDropActive(isActive) {
    messageForm.classList.toggle("composer-drop-active", isActive);
}

function handleComposerDragOver(event) {
    const imageFile = extractImageFileFromList(event.dataTransfer?.files || []);

    if (!imageFile) {
        return;
    }

    event.preventDefault();
    setComposerDropActive(true);
}

function handleComposerDragLeave(event) {
    if (!messageForm.contains(event.relatedTarget)) {
        setComposerDropActive(false);
    }
}

async function handleComposerDrop(event) {
    const imageFile = extractImageFileFromList(event.dataTransfer?.files || []);

    setComposerDropActive(false);

    if (!imageFile) {
        return;
    }

    event.preventDefault();

    try {
        await setSelectedImageFromFile(imageFile);
    } catch (error) {
        window.alert(error.message || "Nao foi possivel anexar a imagem.");
    }
}

function clearSelectedAttachment() {
    selectedMessageImage = null;
    imageInput.value = "";
    renderAttachmentPreview();
}

async function clearCurrentConversationHistory() {
    if (!selectedConversationId) {
        return;
    }

    const selectedMessages = getSelectedConversationMessages();
    if (!selectedMessages.length) {
        return;
    }

    const confirmed = window.confirm("Deseja apagar o historico desta conversa para todos?");
    if (!confirmed) {
        return;
    }

    try {
        const data = await apiRequest(`/api/conversations/${encodeURIComponent(selectedConversationId)}/messages`, {
            method: "DELETE"
        });

        handleSnapshot(data.snapshot, selectedConversationId);
    } catch (error) {
        showRequestError(error, "Nao foi possivel limpar o historico.");
    }
}

async function deleteConversation(conversationId) {
    const conversation = getConversationById(conversationId);
    if (!conversation) {
        return;
    }

    const conversationLabel = getConversationDisplayName(conversation);
    const confirmed = window.confirm(`Deseja excluir ${conversationLabel} e apagar todo o historico ligado a ela?`);
    if (!confirmed) {
        return;
    }

    try {
        const data = await apiRequest(`/api/conversations/${encodeURIComponent(conversationId)}`, {
            method: "DELETE"
        });

        handleSnapshot(data.snapshot);
        closeModal();
    } catch (error) {
        showRequestError(error, "Nao foi possivel excluir a sala.");
    }
}

async function sendTypingSignal(conversationId, active, keepalive = false) {
    if (!conversationId || !currentUser) {
        return;
    }

    try {
        await apiRequest("/api/typing", {
            method: "POST",
            body: {
                conversationId,
                active
            },
            keepalive
        });
    } catch (error) {
        if (error?.status === 401) {
            handleSessionEnded();
        }
    }
}

function setOwnTyping() {
    if (!currentUser || !selectedConversationId) {
        return;
    }

    if (!messageInput.value.trim()) {
        clearOwnTyping();
        return;
    }

    if (activeTypingConversationId && activeTypingConversationId !== selectedConversationId) {
        void sendTypingSignal(activeTypingConversationId, false);
    }

    const now = Date.now();
    if (now - lastTypingPingAt < TYPING_THROTTLE_MS) {
        return;
    }

    lastTypingPingAt = now;
    activeTypingConversationId = selectedConversationId;
    void sendTypingSignal(selectedConversationId, true);
}

function clearOwnTyping(keepalive = false) {
    if (!currentUser) {
        return;
    }

    const conversationId = activeTypingConversationId || selectedConversationId;
    if (!conversationId) {
        return;
    }

    activeTypingConversationId = "";
    void sendTypingSignal(conversationId, false, keepalive);
}

function handleConversationListClick(event) {
    const button = event.target.closest("[data-conversation-id]");
    if (!button) {
        return;
    }

    setSelectedConversation(button.dataset.conversationId);
}

function focusConversationSearch() {
    if (!conversationSearchInput) {
        return;
    }

    setActiveDirectoryTab("all");
    setActiveMobileView("nav");
    conversationSearchInput.focus();
    conversationSearchInput.select();
}

function focusComposer() {
    setActiveMobileView("chat");
    messageInput.focus();
}

function openProfileQuick() {
    if (!currentUser) {
        return;
    }

    openProfileModal();
}

function openLabQuick() {
    if (!currentUser) {
        return;
    }

    openLabModal();
}

function openToolsQuick() {
    setActiveInfoTab("intel");
    setActiveMobileView("info");
}

function handleGlobalShortcut(event) {
    const isModifierPressed = event.ctrlKey || event.metaKey;
    const activeTag = document.activeElement?.tagName || "";

    if (isModifierPressed && event.key.toLowerCase() === "k") {
        event.preventDefault();
        focusConversationSearch();
        return;
    }

    if (isModifierPressed && event.shiftKey && event.key.toLowerCase() === "m") {
        event.preventDefault();
        focusComposer();
        return;
    }

    if (isModifierPressed && event.shiftKey && event.key.toLowerCase() === "p") {
        event.preventDefault();
        openProfileQuick();
        return;
    }

    if (isModifierPressed && event.shiftKey && event.key.toLowerCase() === "l") {
        event.preventDefault();
        openLabQuick();
        return;
    }

    if (isModifierPressed && event.shiftKey && event.key.toLowerCase() === "t") {
        event.preventDefault();
        openToolsQuick();
        return;
    }

    if (event.key === "Escape" && modalOverlay.classList.contains("hidden")) {
        if (selectedMessageImage) {
            clearSelectedAttachment();
            return;
        }

        if (conversationSearchInput && conversationSearchInput.value.trim()) {
            conversationSearchInput.value = "";
            conversationSearchTerm = "";
            renderConversationLists();

            if (activeTag === "INPUT") {
                focusComposer();
            }
        }
    }
}

function initializeEventListeners() {
    loginTabButton.addEventListener("click", () => {
        setAuthStatus();
        setAuthMode("login");
    });

    registerTabButton.addEventListener("click", () => {
        setAuthStatus();
        setAuthMode("register");
    });

    loginForm.addEventListener("submit", handleLogin);
    registerForm.addEventListener("submit", handleRegister);

    themeToggleButtons.forEach((button) => {
        button.addEventListener("click", toggleTheme);
    });

    if (conversationSearchInput) {
        conversationSearchInput.addEventListener("input", (event) => {
            conversationSearchTerm = String(event.target.value || "");
            renderConversationLists();
        });
    }

    directoryTabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setActiveDirectoryTab(button.dataset.directoryTab || "all");
        });
    });

    infoTabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setActiveInfoTab(button.dataset.infoTab || "details");
        });
    });

    mobileViewButtons.forEach((button) => {
        button.addEventListener("click", () => {
            setActiveMobileView(button.dataset.mobileView || "chat");
        });
    });

    profileAvatarButton.addEventListener("click", openProfileModal);
    editProfileButton.addEventListener("click", openProfileModal);
    switchAccountButton.addEventListener("click", () => {
        void clearSessionAndReturn("login", "Sessao encerrada. Entre com outra conta.");
    });
    newAccountButton.addEventListener("click", () => {
        void clearSessionAndReturn("register", "Pronto para cadastrar uma nova conta.");
    });

    newChannelButton.addEventListener("click", () => openConversationModal("create", "channel"));
    newDmButton.addEventListener("click", () => openPeopleModal("new-dm"));
    newGroupButton.addEventListener("click", () => openPeopleModal("new-group"));
    labButton.addEventListener("click", openLabModal);

    channelsList.addEventListener("click", handleConversationListClick);
    dmsList.addEventListener("click", handleConversationListClick);
    groupsList.addEventListener("click", handleConversationListClick);

    editConversationButton.addEventListener("click", () => {
        const conversation = getSelectedConversation();
        if (!conversation || conversation.type === "dm") {
            return;
        }

        openConversationModal("edit", conversation.type, conversation);
    });

    inviteMembersButton.addEventListener("click", () => {
        const conversation = getSelectedConversation();
        if (!conversation || conversation.type === "channel") {
            return;
        }

        openPeopleModal("invite", conversation);
    });

    autoDeleteSelect.addEventListener("change", () => {
        void handleAutoDeleteChange();
    });
    clearChatButton.addEventListener("click", () => {
        void clearCurrentConversationHistory();
    });

    messageForm.addEventListener("submit", sendMessage);
    messageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            messageForm.requestSubmit();
        }
    });
    messageInput.addEventListener("input", () => {
        autoGrowMessageInput();
        setOwnTyping();
    });
    messageInput.addEventListener("paste", handleComposerPaste);
    messageInput.addEventListener("blur", () => clearOwnTyping());
    imageInput.addEventListener("change", handleComposerImageChange);
    clearMessageButton.addEventListener("click", () => {
        messageInput.value = "";
        autoGrowMessageInput();
        clearSelectedAttachment();
        clearOwnTyping();
        messageInput.focus();
    });
    removeAttachmentButton.addEventListener("click", clearSelectedAttachment);
    messageForm.addEventListener("dragover", handleComposerDragOver);
    messageForm.addEventListener("dragleave", handleComposerDragLeave);
    messageForm.addEventListener("drop", handleComposerDrop);

    profileForm.addEventListener("submit", handleProfileSave);
    profileAvatarInput.addEventListener("change", handleProfileAvatarChange);
    removeProfilePhotoButton.addEventListener("click", () => {
        pendingProfileAvatarDataUrl = "";
        refreshModalViews();
    });

    conversationForm.addEventListener("submit", handleConversationSubmit);
    deleteConversationButton.addEventListener("click", () => {
        if (deleteConversationButton.dataset.conversationId) {
            void deleteConversation(deleteConversationButton.dataset.conversationId);
        }
    });

    peopleForm.addEventListener("submit", handlePeopleSubmit);
    labForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const command = labInput.value;
        labInput.value = "";
        void executeLabCommand(command).finally(() => {
            labInput.focus();
        });
    });
    labResetButton.addEventListener("click", () => {
        labState = createDefaultLabState(currentUser);
        finalizeLabMutation();
        labInput.focus();
    });
    labQuickButtons.forEach((button) => {
        button.addEventListener("click", () => {
            void executeLabCommand(button.dataset.labCommand || "").finally(() => {
                labInput.focus();
            });
        });
    });
    labTree.addEventListener("click", handleLabTreeClick);
    passwordLengthRange.addEventListener("input", () => {
        generatedPassword = generatePasswordValue();
        renderToolOutputs();
    });
    [passwordLowerToggle, passwordUpperToggle, passwordNumberToggle, passwordSymbolToggle].forEach((toggle) => {
        toggle.addEventListener("change", refreshToolSecrets);
    });
    generatePasswordButton.addEventListener("click", () => {
        generatedPassword = generatePasswordValue();
        renderToolOutputs();
    });
    copyPasswordButton.addEventListener("click", async () => {
        const copied = await copyTextToClipboard(generatedPassword);
        flashButtonText(copyPasswordButton, copied ? "Copiado" : "Falhou");
    });
    usePasswordButton.addEventListener("click", () => {
        insertTextAtCursor(messageInput, generatedPassword);
        flashButtonText(usePasswordButton, "Ok");
    });
    generatePassphraseButton.addEventListener("click", () => {
        generatedPassphrase = generatePassphraseValue();
        renderToolOutputs();
    });
    copyPassphraseButton.addEventListener("click", async () => {
        const copied = await copyTextToClipboard(generatedPassphrase);
        flashButtonText(copyPassphraseButton, copied ? "Copiado" : "Falhou");
    });
    usePassphraseButton.addEventListener("click", () => {
        insertTextAtCursor(messageInput, generatedPassphrase);
        flashButtonText(usePassphraseButton, "Ok");
    });

    modalOverlay.addEventListener("click", (event) => {
        if (event.target === modalOverlay || event.target.hasAttribute("data-close-modal")) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modalOverlay.classList.contains("hidden")) {
            closeModal();
        }
    });
    document.addEventListener("keydown", handleGlobalShortcut);

    window.addEventListener("beforeunload", () => {
        clearOwnTyping(true);
    });

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden && currentUser) {
            void refreshSession();
        }
    });

    window.addEventListener("resize", updateMobileView);
}

async function initialize() {
    applyTheme(loadThemePreference());
    initializeEventListeners();
    refreshToolSecrets();
    autoGrowMessageInput();
    updateDirectoryTabs();
    updateInfoTabs();
    updateMobileView();

    const restored = await refreshSession();

    if (!restored) {
        renderCurrentUser();
        updateRegisteredCounters();
        if (conversationSearchInput) {
            conversationSearchInput.value = "";
        }
        messagesList.innerHTML = `
            <section class="empty-state">
                <p class="eyebrow">Workspace</p>
                <h3>Sem conversa ativa.</h3>
                <p>Crie um canal, um PV ou um grupo e use este painel para texto livre, imagens e digitacao em tempo real.</p>
            </section>
        `;
        showAuth("login");
    }
}

function showStartupError(error) {
    console.error("Falha ao iniciar a interface.", error);

    resetAppState();
    clearStoredConversationId();
    authScreen.classList.remove("hidden");
    chatApp.classList.add("hidden");
    setAuthMode("login");
    setAuthStatus("Falha ao carregar a interface. Recarregue a pagina para sincronizar tudo de novo.", "error");
}

void initialize().catch(showStartupError);

setInterval(() => {
    updateMessageExpireBadges();
    renderTypingIndicator();
}, 1000);
