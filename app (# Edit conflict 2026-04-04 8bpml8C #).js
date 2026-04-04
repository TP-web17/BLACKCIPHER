const DB_KEY = "conquest-db-v2";
const PREFS_KEY = "conquest-prefs-v1";
const LEGACY_KEYS = ["conquest-social-v1"];
const CATEGORIES = ["Todos", "Ilustracao", "Fotografia", "Sketch", "Poster", "Moda", "3D", "Editorial"];
const PROFILE_TONES = ["#f4f6fb", "#d8e4ff", "#f5d8ff", "#d7f4ef", "#ffe0cd", "#ffe99f", "#c9d4e6", "#f0d1d1"];
const PROFILE_THEMES = [
    { id: "obsidian-blue", label: "Obsidian blue" },
    { id: "chrome-violet", label: "Chrome violet" },
    { id: "moon-silver", label: "Moon silver" },
    { id: "noir-rose", label: "Noir rose" },
    { id: "graphite-cyan", label: "Graphite cyan" }
];
const POST_FONT_PRESETS = [
    { id: "clean", label: "Moderna clean" },
    { id: "editorial", label: "Editorial" },
    { id: "poster", label: "Poster" }
];
const DEFAULT_SITE_ACCENT = "#8ea9ff";
const SITE_ACCENT_SWATCHES = ["#8ea9ff", "#7cd7c5", "#ff8fbd", "#ffd36f", "#b59dff", "#8fd0ff", "#a9e36b", "#ffb27d"];
const DEFAULT_POST_SURFACE_TONE = "#1d2a3d";
const DEFAULT_POST_TITLE_COLOR = "#f8fbff";
const DEFAULT_POST_CAPTION_COLOR = "#d7deea";
const DEFAULT_MEDIA_FOCUS = 50;
const DEFAULT_MEDIA_SCALE = 1;
const LOGO_SOURCE = "logo.jpeg";
const formatCompact = new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1
});

function formatMetricLabel(count, singular, plural) {
    return `${formatCompact.format(count)} ${count === 1 ? singular : plural}`;
}

function createDefaultViewTabs() {
    return {
        home: "trending",
        homeMode: "social",
        discussions: "for-you",
        following: "all",
        saved: "recent",
        activity: "all"
    };
}

const authScreen = document.getElementById("authScreen");
const appShell = document.getElementById("appShell");
const authTrackA = document.getElementById("authTrackA");
const authTrackB = document.getElementById("authTrackB");
const savedAccounts = document.getElementById("savedAccounts");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const appTopbar = document.getElementById("appTopbar");
const themeToggle = document.getElementById("themeToggle");
const siteFavicon = document.getElementById("siteFavicon");
const globalSearch = document.getElementById("globalSearch");
const sidebarUser = document.getElementById("sidebarUser");
const topbarAlertsShell = document.getElementById("topbarAlertsShell");
const topbarAlertsPreview = document.getElementById("topbarAlertsPreview");
const topUserPill = document.getElementById("topUserPill");
const topbarAlertsBadge = document.getElementById("topbarAlertsBadge");
const viewRoot = document.getElementById("viewRoot");
const postModal = document.getElementById("postModal");
const postModalContent = document.getElementById("postModalContent");
const composerModal = document.getElementById("composerModal");
const composerModalContent = document.getElementById("composerModalContent");
const profileModal = document.getElementById("profileModal");
const profileModalContent = document.getElementById("profileModalContent");
const toastStack = document.getElementById("toastStack");
const logoAssets = {
    light: LOGO_SOURCE,
    dark: LOGO_SOURCE,
    promise: null
};
const likeBurstTimers = new Map();

const state = {
    db: loadDb(),
    prefs: loadPrefs(),
    ui: {
        authView: "login",
        view: "home",
        query: "",
        category: "Todos",
        viewTabs: createDefaultViewTabs(),
        profileUserId: null,
        postModalId: null,
        inlineCommentPostId: null,
        replyingToCommentId: null,
        composerOpen: false,
        composerDraft: createEmptyDraft(),
        uploadingImage: false,
        uploadingSticker: false,
        profileEditorOpen: false,
        profileDraft: createEmptyProfileDraft(),
        uploadingProfileAvatar: false,
        uploadingProfileCover: false,
        activePostViewSession: null,
        likeBurstPostIds: {},
        profileMenuOpen: false,
        profileConnectionsView: "",
        alertsPreviewOpen: false,
        orderSnapshots: {}
    }
};

window.__conquestDebugState = state;

cleanupLegacyStorage();
cleanupDatabase();
initBrandAssets();
applyTheme(state.prefs.theme);
bindEvents();
renderAll();

function createDb() {
    return {
        version: 2,
        users: [],
        posts: [],
        likesByUser: {},
        savesByUser: {},
        followsByUser: {},
        commentsByPost: {},
        activitiesByUser: {},
        viewHistoryByUser: {},
        sessionUserId: null,
        recentAccountIds: []
    };
}

function createEmptyDraft(postKind = "art") {
    const normalizedPostKind = normalizePostKind(postKind);

    return {
        postKind: normalizedPostKind,
        title: "",
        caption: "",
        tags: "",
        category: normalizedPostKind === "discussion" ? "Editorial" : "Ilustracao",
        contentMode: normalizedPostKind === "discussion" ? "text" : "media",
        distribution: normalizedPostKind === "discussion" ? "discussion" : "both",
        imageData: "",
        fileName: "",
        presentation: createDefaultPostPresentation()
    };
}

function createEmptyProfileDraft(user = null) {
    return {
        name: user?.name || "",
        bio: user?.bio || "",
        location: user?.location || "",
        website: user?.website || "",
        avatarImage: user?.avatarImage || "",
        avatarFileName: "",
        avatarFocusX: normalizePercentValue(user?.avatarFocusX, DEFAULT_MEDIA_FOCUS),
        avatarFocusY: normalizePercentValue(user?.avatarFocusY, DEFAULT_MEDIA_FOCUS),
        avatarScale: normalizeScaleValue(user?.avatarScale, DEFAULT_MEDIA_SCALE),
        avatarTone: user?.avatarTone || PROFILE_TONES[0],
        profileTheme: normalizeProfileTheme(user?.profileTheme),
        highlightPostId: user?.highlightPostId || "",
        coverImage: user?.coverImage || "",
        coverFileName: "",
        coverFocusX: normalizePercentValue(user?.coverFocusX, DEFAULT_MEDIA_FOCUS),
        coverFocusY: normalizePercentValue(user?.coverFocusY, DEFAULT_MEDIA_FOCUS),
        coverScale: normalizeScaleValue(user?.coverScale, DEFAULT_MEDIA_SCALE)
    };
}

function loadDb() {
    try {
        const parsed = JSON.parse(localStorage.getItem(DB_KEY));

        if (!parsed || typeof parsed !== "object") {
            return createDb();
        }

        return {
            ...createDb(),
            ...parsed,
            users: Array.isArray(parsed.users) ? parsed.users : [],
            posts: Array.isArray(parsed.posts) ? parsed.posts : [],
            likesByUser: isPlainObject(parsed.likesByUser) ? parsed.likesByUser : {},
            savesByUser: isPlainObject(parsed.savesByUser) ? parsed.savesByUser : {},
            followsByUser: isPlainObject(parsed.followsByUser) ? parsed.followsByUser : {},
            commentsByPost: isPlainObject(parsed.commentsByPost) ? parsed.commentsByPost : {},
            activitiesByUser: isPlainObject(parsed.activitiesByUser) ? parsed.activitiesByUser : {},
            viewHistoryByUser: isPlainObject(parsed.viewHistoryByUser) ? parsed.viewHistoryByUser : {},
            recentAccountIds: Array.isArray(parsed.recentAccountIds) ? parsed.recentAccountIds : []
        };
    } catch (error) {
        return createDb();
    }
}

function loadPrefs() {
    try {
        const parsed = JSON.parse(localStorage.getItem(PREFS_KEY));

        if (!parsed || typeof parsed !== "object") {
            return { theme: "light", accentColor: DEFAULT_SITE_ACCENT };
        }

        return {
            theme: "light",
            accentColor: normalizeSiteAccent(parsed.accentColor || DEFAULT_SITE_ACCENT)
        };
    } catch (error) {
        return { theme: "light", accentColor: DEFAULT_SITE_ACCENT };
    }
}

function cleanupLegacyStorage() {
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
}

function cleanupDatabase() {
    const validUsers = [];
    const seenUsers = new Set();

    state.db.users.forEach((user) => {
        if (!user || typeof user !== "object" || typeof user.id !== "string") {
            return;
        }

        const id = user.id.trim();
        const handle = normalizeHandle(user.handle || "");

        if (!id || !handle || seenUsers.has(id)) {
            return;
        }

        seenUsers.add(id);
        validUsers.push({
            id,
            name: sanitizeText(user.name || "Pessoa", 36) || "Pessoa",
            handle,
            bio: sanitizeText(user.bio || "Compartilhando imagens, processos e referencias.", 90) || "Compartilhando imagens, processos e referencias.",
            location: sanitizeText(user.location || "", 48),
            website: normalizeWebsite(user.website || ""),
            avatarImage: sanitizeImageSource(user.avatarImage || ""),
            avatarFocusX: normalizePercentValue(user.avatarFocusX, DEFAULT_MEDIA_FOCUS),
            avatarFocusY: normalizePercentValue(user.avatarFocusY, DEFAULT_MEDIA_FOCUS),
            avatarScale: normalizeScaleValue(user.avatarScale, DEFAULT_MEDIA_SCALE),
            avatarTone: normalizeAvatarTone(user.avatarTone),
            profileTheme: normalizeProfileTheme(user.profileTheme),
            highlightPostId: typeof user.highlightPostId === "string" ? user.highlightPostId : "",
            coverImage: sanitizeImageSource(user.coverImage || ""),
            coverFocusX: normalizePercentValue(user.coverFocusX, DEFAULT_MEDIA_FOCUS),
            coverFocusY: normalizePercentValue(user.coverFocusY, DEFAULT_MEDIA_FOCUS),
            coverScale: normalizeScaleValue(user.coverScale, DEFAULT_MEDIA_SCALE),
            createdAt: Number(user.createdAt) || Date.now(),
            lastLoginAt: Number(user.lastLoginAt) || Number(user.createdAt) || Date.now()
        });
    });

    const validUserIds = new Set(validUsers.map((user) => user.id));
    const validPosts = [];

    state.db.posts.forEach((post) => {
        if (!post || typeof post !== "object" || typeof post.id !== "string") {
            return;
        }

        const sanitizedCaption = sanitizeText(post.caption || "", 240);
        const sanitizedTitle = sanitizeText(post.title || "", 60);
        const sanitizedImage = sanitizeImageSource(post.imageData || "");

        if (!validUserIds.has(post.authorId) || (!sanitizedImage && !sanitizedCaption && !sanitizedTitle)) {
            return;
        }

        validPosts.push({
            id: post.id,
            authorId: post.authorId,
            caption: sanitizedCaption,
            category: CATEGORIES.includes(post.category) ? post.category : "Ilustracao",
            tags: Array.isArray(post.tags) ? uniqueList(post.tags.map((tag) => normalizeTag(tag)).filter(Boolean)).slice(0, 6) : [],
            imageData: sanitizedImage,
            presentation: normalizePostPresentation(post.presentation || post.design || post.style || post),
            createdAt: Number(post.createdAt) || Date.now()
        });

        validPosts[validPosts.length - 1].title = derivePostTitle(
            post.title,
            validPosts[validPosts.length - 1].caption,
            validPosts[validPosts.length - 1].category
        );
    });

    const validPostIds = new Set(validPosts.map((post) => post.id));

    state.db.users = validUsers;
    state.db.posts = validPosts;
    state.db.users = state.db.users.map((user) => ({
        ...user,
        highlightPostId:
            typeof user.highlightPostId === "string" &&
            validPosts.some((post) => post.id === user.highlightPostId && post.authorId === user.id)
                ? user.highlightPostId
                : ""
    }));
    state.db.likesByUser = cleanInteractionMap(state.db.likesByUser, validUserIds, validPostIds);
    state.db.savesByUser = cleanInteractionMap(state.db.savesByUser, validUserIds, validPostIds);
    state.db.followsByUser = cleanFollowMap(state.db.followsByUser, validUserIds);
    state.db.commentsByPost = cleanCommentMap(state.db.commentsByPost, validPostIds, validUserIds);
    state.db.activitiesByUser = cleanActivityMap(state.db.activitiesByUser, validUserIds, validPostIds);
    state.db.viewHistoryByUser = cleanViewHistoryMap(state.db.viewHistoryByUser, validUserIds, validPostIds);
    state.db.recentAccountIds = uniqueList(state.db.recentAccountIds.filter((userId) => validUserIds.has(userId))).slice(0, 10);

    if (!validUserIds.has(state.db.sessionUserId)) {
        state.db.sessionUserId = null;
    }

    persistDb();
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

        const normalizedComments = comments
            .filter((comment) => comment && validUserIds.has(comment.authorId))
            .map((comment) => ({
                id: typeof comment.id === "string" ? comment.id : createId("comment"),
                authorId: comment.authorId,
                text: sanitizeText(comment.text || "", 220),
                parentId: typeof comment.parentId === "string" ? comment.parentId : null,
                createdAt: Number(comment.createdAt) || Date.now()
            }))
            .filter((comment) => comment.text);

        const validCommentIds = new Set(normalizedComments.map((comment) => comment.id));

        result[postId] = normalizedComments.map((comment) => ({
            ...comment,
            parentId:
                comment.parentId && comment.parentId !== comment.id && validCommentIds.has(comment.parentId)
                    ? comment.parentId
                    : null
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
            .filter((entry) => entry && (!entry.postId || validPostIds.has(entry.postId)))
            .map((entry) => ({
                id: typeof entry.id === "string" ? entry.id : createId("activity"),
                type: typeof entry.type === "string" ? entry.type : "published",
                actorUserId: typeof entry.actorUserId === "string" ? entry.actorUserId : userId,
                postId: typeof entry.postId === "string" ? entry.postId : null,
                commentId: typeof entry.commentId === "string" ? entry.commentId : null,
                createdAt: Number(entry.createdAt) || Date.now(),
                text: sanitizeText(entry.text || "", 160)
            }))
            .filter((entry) => validUserIds.has(entry.actorUserId))
            .slice(0, 80);
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
            .filter((entry) => entry && typeof entry.postId === "string" && validPostIds.has(entry.postId))
            .map((entry) => ({
                postId: entry.postId,
                createdAt: Number(entry.createdAt) || Date.now(),
                durationMs: Math.max(0, Math.min(120000, Number(entry.durationMs) || 0)),
                source: entry.source === "inline" ? "inline" : "modal"
            }))
            .slice(0, 180);
    });

    return result;
}

function persistDb() {
    localStorage.setItem(DB_KEY, JSON.stringify(state.db));
}

function persistPrefs() {
    localStorage.setItem(PREFS_KEY, JSON.stringify(state.prefs));
}

function bindEvents() {
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener("pointermove", handlePointerGlow, { passive: true });
    }

    window.addEventListener("scroll", syncTopbarState, { passive: true });

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const user = getCurrentUser();

            if (!user) {
                return;
            }

            state.ui.profileMenuOpen = true;
            renderTopUserPill(user);
        });
    }

    globalSearch.addEventListener("input", (event) => {
        state.ui.query = event.target.value.trim();
        renderView();
    });

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const handle = String(formData.get("handle") || "");

        try {
            await api.loginWithHandle(handle);
            loginForm.reset();
            state.ui.query = "";
            renderAll();
            showToast("Voce entrou.");
        } catch (error) {
            showToast(error.message || "Nao deu para entrar agora.");
        }
    });

    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(registerForm);

        try {
            await api.registerUser({
                name: String(formData.get("name") || ""),
                handle: String(formData.get("handle") || ""),
                bio: String(formData.get("bio") || "")
            });
            registerForm.reset();
            state.ui.query = "";
            renderAll();
            showToast("Conta criada.");
        } catch (error) {
            showToast(error.message || "Nao deu para criar essa conta.");
        }
    });

    document.addEventListener("click", async (event) => {
        const authViewButton = event.target.closest("[data-auth-view]");
        const tabButton = event.target.closest("[data-tab-group]");
        const filterButton = event.target.closest("[data-filter]");
        const viewButton = event.target.closest("[data-view]");
        const actionButton = event.target.closest("[data-action]");
        const currentUser = getCurrentUser();

        if (!event.target.closest("#topUserPill") && state.ui.profileMenuOpen) {
            state.ui.profileMenuOpen = false;

            if (currentUser && !authViewButton && !tabButton && !filterButton && !viewButton && !actionButton) {
                renderTopUserPill(currentUser);
            }
        }

        if (!event.target.closest("#topbarAlertsShell") && state.ui.alertsPreviewOpen) {
            state.ui.alertsPreviewOpen = false;

            if (currentUser && !authViewButton && !tabButton && !filterButton && !viewButton && !actionButton) {
                renderTopbarAlertsPreview(currentUser);
            }
        }

        if (authViewButton) {
            state.ui.authView = authViewButton.dataset.authView === "register" ? "register" : "login";
            renderAuthScreen();
            return;
        }

        if (filterButton) {
            state.ui.category = filterButton.dataset.filter || "Todos";
            renderView();
            return;
        }

        if (tabButton) {
            const group = tabButton.dataset.tabGroup || "";
            const value = tabButton.dataset.tabValue || "";

            if (state.ui.viewTabs[group] !== undefined && value) {
                state.ui.viewTabs[group] = value;
                renderFrame();
            }

            return;
        }

        if (viewButton) {
            state.ui.view = viewButton.dataset.view || "home";
            state.ui.inlineCommentPostId = null;
            state.ui.replyingToCommentId = null;
            state.ui.profileConnectionsView = "";
            state.ui.profileMenuOpen = false;
            state.ui.alertsPreviewOpen = false;

            if (state.ui.view === "profile") {
                state.ui.profileUserId = getCurrentUser()?.id || null;
            }

            renderFrame();
            return;
        }

        const cardOpen = event.target.closest('[data-card-open="true"]');
        const interactiveAncestor = event.target.closest(
            "button, input, textarea, label, form, a, select, option, .feed-comments-preview, .feed-inline-comment, .comment-form, [data-action], [data-view], [data-tab-group], [data-filter]"
        );

        if (!actionButton && cardOpen && !interactiveAncestor) {
            openPost(cardOpen.dataset.postId || "");
            return;
        }

        if (!actionButton) {
            return;
        }

        const action = actionButton.dataset.action;

        try {
            if (action === "login-saved") {
                await api.loginWithUserId(actionButton.dataset.userId || "");
                state.ui.query = "";
                renderAll();
                showToast("Conta aberta.");
                return;
            }

            if (action === "logout") {
                finalizeActivePostView();
                await api.logout();
                state.ui.viewTabs = createDefaultViewTabs();
                state.ui.profileUserId = null;
                state.ui.postModalId = null;
                state.ui.inlineCommentPostId = null;
                state.ui.replyingToCommentId = null;
                state.ui.composerOpen = false;
                state.ui.composerDraft = createEmptyDraft();
                state.ui.uploadingImage = false;
                state.ui.uploadingSticker = false;
                state.ui.profileEditorOpen = false;
                state.ui.profileDraft = createEmptyProfileDraft();
                state.ui.activePostViewSession = null;
                state.ui.profileMenuOpen = false;
                state.ui.profileConnectionsView = "";
                state.ui.alertsPreviewOpen = false;
                state.ui.orderSnapshots = {};
                renderAll();
                showToast("Voce saiu.");
                return;
            }

            if (action === "open-composer") {
                state.ui.composerDraft = createEmptyDraft(state.ui.view === "discussions" ? "discussion" : "art");
                state.ui.uploadingImage = false;
                state.ui.uploadingSticker = false;
                state.ui.composerOpen = true;
                state.ui.profileMenuOpen = false;
                state.ui.alertsPreviewOpen = false;
                renderComposerModal();
                return;
            }

            if (action === "open-discussion-composer") {
                state.ui.composerDraft = createEmptyDraft("discussion");
                state.ui.uploadingImage = false;
                state.ui.uploadingSticker = false;
                state.ui.composerOpen = true;
                state.ui.profileMenuOpen = false;
                state.ui.alertsPreviewOpen = false;
                renderComposerModal();
                return;
            }

            if (action === "close-composer") {
                closeComposer();
                return;
            }

            if (action === "open-post") {
                state.ui.profileMenuOpen = false;
                state.ui.alertsPreviewOpen = false;
                openPost(actionButton.dataset.postId || "");
                return;
            }

            if (action === "focus-post-comments") {
                openPost(actionButton.dataset.postId || "", {
                    focusComposer: true
                });
                return;
            }

            if (action === "open-profile") {
                const targetUserId = actionButton.dataset.userId || "";

                if (!getUserById(targetUserId)) {
                    showToast("Esse perfil nao esta mais disponivel.");
                    return;
                }

                state.ui.view = "profile";
                state.ui.profileUserId = targetUserId;
                finalizeActivePostView();
                state.ui.postModalId = null;
                state.ui.inlineCommentPostId = null;
                state.ui.replyingToCommentId = null;
                state.ui.profileConnectionsView = "";
                state.ui.profileMenuOpen = false;
                state.ui.alertsPreviewOpen = false;
                renderAll();
                return;
            }

            if (action === "toggle-alerts-preview") {
                const user = requireCurrentUser();
                state.ui.alertsPreviewOpen = !state.ui.alertsPreviewOpen;
                state.ui.profileMenuOpen = false;
                renderTopUserPill(user);
                renderTopbarAlertsPreview(user);
                return;
            }

            if (action === "open-activity-view") {
                state.ui.view = "activity";
                state.ui.profileMenuOpen = false;
                state.ui.alertsPreviewOpen = false;
                renderFrame();
                return;
            }

            if (action === "apply-topic-filter") {
                const topic = actionButton.dataset.topic || "";
                state.ui.view = "discussions";
                state.ui.query = topic;
                if (globalSearch) {
                    globalSearch.value = topic;
                }
                renderFrame();
                return;
            }

            if (action === "toggle-profile-menu") {
                const user = requireCurrentUser();
                state.ui.profileMenuOpen = !state.ui.profileMenuOpen;
                state.ui.alertsPreviewOpen = false;
                renderTopbarAlertsPreview(user);
                renderTopUserPill(user);
                return;
            }

            if (action === "open-own-profile") {
                const user = requireCurrentUser();
                state.ui.view = "profile";
                state.ui.profileUserId = user.id;
                state.ui.profileMenuOpen = false;
                state.ui.profileConnectionsView = "";
                state.ui.alertsPreviewOpen = false;
                finalizeActivePostView();
                state.ui.postModalId = null;
                state.ui.inlineCommentPostId = null;
                state.ui.replyingToCommentId = null;
                renderAll();
                return;
            }

            if (action === "open-own-posts") {
                const user = requireCurrentUser();
                state.ui.view = "profile";
                state.ui.profileUserId = user.id;
                state.ui.profileMenuOpen = false;
                state.ui.profileConnectionsView = "";
                state.ui.alertsPreviewOpen = false;
                renderAll();
                requestAnimationFrame(() => {
                    document.getElementById("profilePostsSection")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                });
                return;
            }

            if (action === "jump-profile-posts") {
                requestAnimationFrame(() => {
                    document.getElementById("profilePostsSection")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                });
                return;
            }

            if (action === "toggle-profile-connections") {
                const nextView = actionButton.dataset.connectionView || "";
                const user = requireCurrentUser();

                if (state.ui.view !== "profile" || state.ui.profileUserId !== user.id) {
                    state.ui.view = "profile";
                    state.ui.profileUserId = user.id;
                    state.ui.profileMenuOpen = false;
                    state.ui.alertsPreviewOpen = false;
                }

                state.ui.profileConnectionsView = state.ui.profileConnectionsView === nextView ? "" : nextView;
                renderFrame();
                return;
            }

            if (action === "set-site-accent") {
                const accentColor = actionButton.dataset.accentColor || DEFAULT_SITE_ACCENT;
                state.prefs.accentColor = normalizeSiteAccent(accentColor);
                applyTheme(state.prefs.theme);
                persistPrefs();
                renderFrame();
                return;
            }

            if (action === "close-post-modal") {
                state.ui.replyingToCommentId = null;
                closePostModal();
                return;
            }

            if (action === "toggle-inline-comments") {
                const postId = actionButton.dataset.postId || "";
                const shouldFocus = actionButton.dataset.focusComposer !== "false";
                toggleInlineComments(postId, { focusComposer: shouldFocus });
                return;
            }

            if (action === "close-inline-comments") {
                state.ui.inlineCommentPostId = null;
                state.ui.replyingToCommentId = null;
                renderFrame();
                return;
            }

            if (action === "open-profile-editor") {
                const user = requireCurrentUser();
                state.ui.profileDraft = createEmptyProfileDraft(user);
                state.ui.profileEditorOpen = true;
                state.ui.profileMenuOpen = false;
                state.ui.alertsPreviewOpen = false;
                renderProfileEditorModal();
                return;
            }

            if (action === "close-profile-editor") {
                closeProfileEditor();
                return;
            }

            if (action === "toggle-like") {
                const postId = actionButton.dataset.postId || "";
                const isLiked = await api.toggleLike(postId);

                if (isLiked) {
                    triggerLikeBurst(postId);
                } else {
                    clearLikeBurst(postId);
                }

                renderFrame();
                renderPostModal();
                return;
            }

            if (action === "toggle-save") {
                await api.toggleSave(actionButton.dataset.postId || "");
                renderFrame();
                renderPostModal();
                return;
            }

            if (action === "toggle-follow") {
                await api.toggleFollow(actionButton.dataset.userId || "");
                renderFrame();
                renderPostModal();
                return;
            }

            if (action === "delete-post") {
                const postId = actionButton.dataset.postId || "";

                if (!postId) {
                    return;
                }

                const confirmed = window.confirm("Remover este post do seu perfil?");

                if (!confirmed) {
                    return;
                }

                await api.deletePost(postId);

                if (state.ui.postModalId === postId) {
                    state.ui.postModalId = null;
                }

                renderAll();
                showToast("Post removido.");
                return;
            }

            if (action === "delete-comment") {
                const postId = actionButton.dataset.postId || "";
                const commentId = actionButton.dataset.commentId || "";

                if (!postId || !commentId) {
                    return;
                }

                const confirmed = window.confirm("Remover este comentario?");

                if (!confirmed) {
                    return;
                }

                const deletedIds = await api.deleteComment(postId, commentId);

                if (deletedIds.includes(state.ui.replyingToCommentId)) {
                    state.ui.replyingToCommentId = null;
                }

                renderFrame();
                renderPostModal();
                showToast("Comentario removido.");
                return;
            }

            if (action === "reply-comment") {
                const postId = actionButton.dataset.postId || "";
                state.ui.replyingToCommentId = actionButton.dataset.commentId || null;

                if (state.ui.postModalId === postId) {
                    renderPostModal();
                    focusCommentComposer();
                    return;
                }

                state.ui.inlineCommentPostId = postId;
                renderFrame();
                focusInlineCommentComposer(postId);
                return;
            }

            if (action === "cancel-comment-reply") {
                state.ui.replyingToCommentId = null;

                if (state.ui.postModalId) {
                    renderPostModal();
                    focusCommentComposer();
                    return;
                }

                renderFrame();

                if (state.ui.inlineCommentPostId) {
                    focusInlineCommentComposer(state.ui.inlineCommentPostId);
                }
                return;
            }

            if (action === "pick-library-image") {
                syncComposerDraftFromLiveForm();
                const library = getMediaLibrary();
                const index = Number(actionButton.dataset.libraryIndex);
                const item = library[index];

                if (item) {
                    state.ui.composerDraft.imageData = item.src;
                    state.ui.composerDraft.fileName = item.label;
                    renderComposerModal();
                }

                return;
            }

            if (action === "pick-profile-cover") {
                syncProfileDraftFromLiveForm();
                const user = requireCurrentUser();
                const library = getProfileMediaLibrary(user.id);
                const index = Number(actionButton.dataset.libraryIndex);
                const item = library[index];

                if (item) {
                    state.ui.profileDraft.coverImage = item.src;
                    state.ui.profileDraft.coverFileName = item.label;
                    renderProfileEditorModal();
                }

                return;
            }

            if (action === "clear-profile-cover") {
                syncProfileDraftFromLiveForm();
                state.ui.profileDraft.coverImage = "";
                state.ui.profileDraft.coverFileName = "";
                state.ui.profileDraft.coverFocusX = DEFAULT_MEDIA_FOCUS;
                state.ui.profileDraft.coverFocusY = DEFAULT_MEDIA_FOCUS;
                state.ui.profileDraft.coverScale = DEFAULT_MEDIA_SCALE;
                renderProfileEditorModal();
                return;
            }

            if (action === "clear-profile-avatar") {
                syncProfileDraftFromLiveForm();
                state.ui.profileDraft.avatarImage = "";
                state.ui.profileDraft.avatarFileName = "";
                state.ui.profileDraft.avatarFocusX = DEFAULT_MEDIA_FOCUS;
                state.ui.profileDraft.avatarFocusY = DEFAULT_MEDIA_FOCUS;
                state.ui.profileDraft.avatarScale = DEFAULT_MEDIA_SCALE;
                renderProfileEditorModal();
                return;
            }

            if (action === "clear-post-sticker") {
                syncComposerDraftFromLiveForm();
                state.ui.composerDraft.presentation.sticker = createDefaultSticker();
                state.ui.uploadingSticker = false;
                renderComposerModal();
                return;
            }

            if (action === "clear-post-image") {
                syncComposerDraftFromLiveForm();
                state.ui.composerDraft.imageData = "";
                state.ui.composerDraft.fileName = "";
                state.ui.uploadingImage = false;
                renderComposerModal();
                return;
            }

            if (action === "reset-avatar-crop") {
                syncProfileDraftFromLiveForm();
                state.ui.profileDraft.avatarFocusX = DEFAULT_MEDIA_FOCUS;
                state.ui.profileDraft.avatarFocusY = DEFAULT_MEDIA_FOCUS;
                state.ui.profileDraft.avatarScale = DEFAULT_MEDIA_SCALE;
                renderProfileEditorModal();
                return;
            }

            if (action === "reset-cover-crop") {
                syncProfileDraftFromLiveForm();
                state.ui.profileDraft.coverFocusX = DEFAULT_MEDIA_FOCUS;
                state.ui.profileDraft.coverFocusY = DEFAULT_MEDIA_FOCUS;
                state.ui.profileDraft.coverScale = DEFAULT_MEDIA_SCALE;
                renderProfileEditorModal();
                return;
            }
        } catch (error) {
            showToast(error.message || "Nao foi possivel concluir essa acao.");
        }
    });

    document.addEventListener("submit", async (event) => {
        const commentForm = event.target.closest(".comment-form");
        const composerForm = event.target.closest("#composerForm");
        const profileForm = event.target.closest("#profileForm");

        if (commentForm) {
            event.preventDefault();
            const formData = new FormData(commentForm);
            const text = String(formData.get("comment") || "");
            const postId = commentForm.dataset.postId || "";
            const replyToCommentId = commentForm.dataset.replyToCommentId || "";

            try {
                await api.addComment(postId, text, replyToCommentId);
                commentForm.reset();
                state.ui.replyingToCommentId = null;
                renderFrame();
                renderPostModal();
                showToast(replyToCommentId ? "Resposta enviada." : "Comentario enviado.");

                if (state.ui.postModalId === postId) {
                    focusCommentComposer();
                } else if (state.ui.inlineCommentPostId === postId) {
                    focusInlineCommentComposer(postId);
                }
            } catch (error) {
                showToast(error.message || "Nao foi possivel comentar.");
            }

            return;
        }

        if (composerForm) {
            event.preventDefault();
            syncComposerDraftFromLiveForm();

            try {
                const createdPost = await api.createPost({
                    ...state.ui.composerDraft
                });

                state.ui.view =
                    createdPost.distribution === "discussion"
                        ? "discussions"
                        : createdPost.distribution === "feed"
                          ? "following"
                          : "home";
                state.ui.postModalId = createdPost.id;
                state.ui.composerOpen = false;
                state.ui.composerDraft = createEmptyDraft();
                state.ui.orderSnapshots = {};
                renderAll();
                showToast("Post no ar.");
            } catch (error) {
                showToast(error.message || "Nao foi possivel publicar agora.");
            }

            return;
        }

        if (profileForm) {
            event.preventDefault();
            syncProfileDraftFromLiveForm();

            try {
                await api.updateProfile({
                    ...state.ui.profileDraft
                });
                state.ui.profileEditorOpen = false;
                renderAll();
                showToast("Perfil atualizado.");
            } catch (error) {
                showToast(error.message || "Nao foi possivel salvar o perfil.");
            }
        }
    });

    document.addEventListener("input", (event) => {
        const composerForm = event.target.closest("#composerForm");
        const profileForm = event.target.closest("#profileForm");

        if (composerForm) {
            syncComposerDraftFromForm(composerForm);
            refreshComposerPreview();
        }

        if (profileForm) {
            syncProfileDraftFromForm(profileForm);
            refreshProfileEditorPreview();
        }
    });

    document.addEventListener("change", async (event) => {
        const fileInput = event.target.closest("#composerFile");
        const stickerInput = event.target.closest("#composerStickerFile");
        const profileAvatarInput = event.target.closest("#profileAvatarFile");
        const composerForm = event.target.closest("#composerForm");
        const profileCoverInput = event.target.closest("#profileCoverFile");
        const profileForm = event.target.closest("#profileForm");
        const profileToneInput = event.target.closest('input[name="avatarTone"]');
        const siteAccentInput = event.target.closest("#siteAccentPicker");

        if (composerForm) {
            syncComposerDraftFromForm(composerForm);
            refreshComposerPreview();

            if (
                event.target.matches('select[name="postKind"], select[name="contentMode"], select[name="distribution"]')
            ) {
                renderComposerModal();
                return;
            }
        }

        if (profileForm) {
            syncProfileDraftFromForm(profileForm);
            refreshProfileEditorPreview();
        }

        if (profileToneInput && profileForm) {
            renderProfileEditorModal();
            return;
        }

        if (siteAccentInput) {
            state.prefs.accentColor = normalizeSiteAccent(siteAccentInput.value);
            applyTheme(state.prefs.theme);
            persistPrefs();
            renderTopUserPill(getCurrentUser());
            return;
        }

        if (fileInput && fileInput.files && fileInput.files[0]) {
            try {
                state.ui.uploadingImage = true;
                syncComposerDraftFromLiveForm();
                renderComposerModal();

                const imageData = await compressImage(fileInput.files[0]);
                state.ui.composerDraft.imageData = imageData;
                state.ui.composerDraft.fileName = fileInput.files[0].name;
                state.ui.uploadingImage = false;
                renderComposerModal();
                showToast("Imagem pronta.");
            } catch (error) {
                state.ui.uploadingImage = false;
                renderComposerModal();
                showToast(error.message || "Nao foi possivel ler essa imagem.");
            }
        }

        if (stickerInput && stickerInput.files && stickerInput.files[0]) {
            try {
                state.ui.uploadingSticker = true;
                syncComposerDraftFromLiveForm();
                renderComposerModal();

                const stickerData = await readOverlayAsset(stickerInput.files[0]);
                state.ui.composerDraft.presentation.sticker.src = stickerData;
                state.ui.composerDraft.presentation.sticker.fileName = stickerInput.files[0].name;
                state.ui.uploadingSticker = false;
                renderComposerModal();
                showToast("Sticker pronto.");
            } catch (error) {
                state.ui.uploadingSticker = false;
                renderComposerModal();
                showToast(error.message || "Nao foi possivel ler esse sticker.");
            }
        }

        if (profileAvatarInput && profileAvatarInput.files && profileAvatarInput.files[0]) {
            try {
                state.ui.uploadingProfileAvatar = true;
                syncProfileDraftFromLiveForm();
                renderProfileEditorModal();

                const imageData = await compressImage(profileAvatarInput.files[0]);
                state.ui.profileDraft.avatarImage = imageData;
                state.ui.profileDraft.avatarFileName = profileAvatarInput.files[0].name;
                state.ui.profileDraft.avatarFocusX = DEFAULT_MEDIA_FOCUS;
                state.ui.profileDraft.avatarFocusY = DEFAULT_MEDIA_FOCUS;
                state.ui.profileDraft.avatarScale = DEFAULT_MEDIA_SCALE;
                state.ui.uploadingProfileAvatar = false;
                renderProfileEditorModal();
                showToast("Foto de perfil pronta.");
            } catch (error) {
                state.ui.uploadingProfileAvatar = false;
                renderProfileEditorModal();
                showToast(error.message || "Nao foi possivel ler essa foto.");
            }
        }

        if (profileCoverInput && profileCoverInput.files && profileCoverInput.files[0]) {
            try {
                state.ui.uploadingProfileCover = true;
                syncProfileDraftFromLiveForm();
                renderProfileEditorModal();

                const imageData = await compressImage(profileCoverInput.files[0]);
                state.ui.profileDraft.coverImage = imageData;
                state.ui.profileDraft.coverFileName = profileCoverInput.files[0].name;
                state.ui.profileDraft.coverFocusX = DEFAULT_MEDIA_FOCUS;
                state.ui.profileDraft.coverFocusY = DEFAULT_MEDIA_FOCUS;
                state.ui.profileDraft.coverScale = DEFAULT_MEDIA_SCALE;
                state.ui.uploadingProfileCover = false;
                renderProfileEditorModal();
                showToast("Capa pronta.");
            } catch (error) {
                state.ui.uploadingProfileCover = false;
                renderProfileEditorModal();
                showToast(error.message || "Nao foi possivel ler essa capa.");
            }
        }
    });

    window.addEventListener("keydown", (event) => {
        const cardOpen = event.target.closest?.('[data-card-open="true"]');

        if (cardOpen && event.target === cardOpen && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            openPost(cardOpen.dataset.postId || "");
            return;
        }

        if (event.key !== "Escape") {
            return;
        }

        if (state.ui.composerOpen) {
            closeComposer();
            return;
        }

        if (state.ui.profileEditorOpen) {
            closeProfileEditor();
            return;
        }

        if (state.ui.postModalId) {
            closePostModal();
        }
    });

    window.addEventListener("beforeunload", () => {
        finalizeActivePostView();
    });
}

const api = {
    async registerUser(payload) {
        await fakeDelay();

        const name = sanitizeText(payload.name || "", 36);
        const handle = normalizeHandle(payload.handle || "");
        const bio = sanitizeText(payload.bio || "", 90);

        if (name.length < 2) {
            throw new Error("Use um nome um pouco maior.");
        }

        if (handle.length < 3) {
            throw new Error("Escolha um usuario com pelo menos 3 caracteres.");
        }

        if (!bio) {
            throw new Error("Escreva uma bio curta para a conta.");
        }

        if (getUserByHandle(handle)) {
            throw new Error("Esse @usuario ja esta em uso.");
        }

        const now = Date.now();
        const user = {
            id: createId("user"),
            name,
            handle,
            bio,
            location: "",
            website: "",
            avatarImage: "",
            avatarFocusX: DEFAULT_MEDIA_FOCUS,
            avatarFocusY: DEFAULT_MEDIA_FOCUS,
            avatarScale: DEFAULT_MEDIA_SCALE,
            avatarTone: PROFILE_TONES[state.db.users.length % PROFILE_TONES.length],
            profileTheme: PROFILE_THEMES[state.db.users.length % PROFILE_THEMES.length].id,
            highlightPostId: "",
            coverImage: "",
            coverFocusX: DEFAULT_MEDIA_FOCUS,
            coverFocusY: DEFAULT_MEDIA_FOCUS,
            coverScale: DEFAULT_MEDIA_SCALE,
            createdAt: now,
            lastLoginAt: now
        };

        state.db.users.push(user);
        ensureUserCollections(user.id);
        loginUser(user.id);
        persistDb();

        return user;
    },

    async loginWithHandle(rawHandle) {
        await fakeDelay();

        const handle = normalizeHandle(rawHandle);
        const user = getUserByHandle(handle);

        if (!user) {
            throw new Error("Nao encontramos essa conta.");
        }

        loginUser(user.id);
        persistDb();
        return user;
    },

    async loginWithUserId(userId) {
        await fakeDelay(90);

        const user = getUserById(userId);

        if (!user) {
            throw new Error("Essa conta nao esta mais disponivel.");
        }

        loginUser(user.id);
        persistDb();
        return user;
    },

    async logout() {
        await fakeDelay(70);
        state.db.sessionUserId = null;
        persistDb();
    },

    async updateProfile(payload) {
        await fakeDelay(140);

        const user = requireCurrentUser();
        const name = sanitizeText(payload.name || "", 36);
        const bio = sanitizeText(payload.bio || "", 90);
        const location = sanitizeText(payload.location || "", 48);
        const website = normalizeWebsite(payload.website || "");
        const avatarImage = sanitizeImageSource(payload.avatarImage || "");
        const avatarFocusX = normalizePercentValue(payload.avatarFocusX, user.avatarFocusX);
        const avatarFocusY = normalizePercentValue(payload.avatarFocusY, user.avatarFocusY);
        const avatarScale = normalizeScaleValue(payload.avatarScale, user.avatarScale);
        const avatarTone = payload.avatarTone ? normalizeAvatarTone(payload.avatarTone) : user.avatarTone;
        const profileTheme = payload.profileTheme ? normalizeProfileTheme(payload.profileTheme) : user.profileTheme;
        const highlightPostId =
            typeof payload.highlightPostId === "string" &&
            getUserPosts(user.id).some((post) => post.id === payload.highlightPostId)
                ? payload.highlightPostId
                : user.highlightPostId || "";
        const coverImage = sanitizeImageSource(payload.coverImage || "");
        const coverFocusX = normalizePercentValue(payload.coverFocusX, user.coverFocusX);
        const coverFocusY = normalizePercentValue(payload.coverFocusY, user.coverFocusY);
        const coverScale = normalizeScaleValue(payload.coverScale, user.coverScale);

        if (name.length < 2) {
            throw new Error("Use um nome um pouco maior.");
        }

        if (!bio) {
            throw new Error("Escreva uma bio curta para o perfil.");
        }

        user.name = name;
        user.bio = bio;
        user.location = location;
        user.website = website;
        user.avatarImage = avatarImage;
        user.avatarFocusX = avatarFocusX;
        user.avatarFocusY = avatarFocusY;
        user.avatarScale = avatarScale;
        user.avatarTone = avatarTone;
        user.profileTheme = profileTheme;
        user.highlightPostId = highlightPostId;
        user.coverImage = coverImage;
        user.coverFocusX = coverFocusX;
        user.coverFocusY = coverFocusY;
        user.coverScale = coverScale;
        persistDb();

        return user;
    },

    async createPost(payload) {
        await fakeDelay(160);

        const user = requireCurrentUser();
        const rawTitle = sanitizeText(payload.title || "", 60);
        const caption = sanitizeText(payload.caption || "", 240);
        const category = CATEGORIES.includes(payload.category) && payload.category !== "Todos" ? payload.category : "Ilustracao";
        const title = derivePostTitle(rawTitle, caption, category);
        const tags = normalizeTags(payload.tags || "");
        const contentMode = normalizeComposerContentMode(payload.contentMode);
        const distribution = normalizePostDistribution(payload.distribution);
        const postKind = normalizePostKind(payload.postKind || (distribution === "discussion" ? "discussion" : "art"));
        const imageData = contentMode === "text" ? "" : sanitizeImageSource(payload.imageData || "");
        const presentation = normalizePostPresentation(payload.presentation || payload);

        if (!imageData && !caption && !rawTitle) {
            throw new Error("Escreva algo ou escolha uma imagem para publicar.");
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

        state.db.posts.push(post);
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

        persistDb();
        return post;
    },

    async deletePost(postId) {
        await fakeDelay(120);

        const user = requireCurrentUser();
        const post = getPostById(postId);

        if (!post) {
            throw new Error("Esse post nao existe mais.");
        }

        if (post.authorId !== user.id) {
            throw new Error("Voce so pode remover posts da sua conta.");
        }

        state.db.posts = state.db.posts.filter((item) => item.id !== postId);
        delete state.db.commentsByPost[postId];
        state.db.users = state.db.users.map((profileUser) => ({
            ...profileUser,
            highlightPostId: profileUser.highlightPostId === postId ? "" : profileUser.highlightPostId || ""
        }));

        Object.keys(state.db.likesByUser).forEach((userId) => {
            state.db.likesByUser[userId] = (state.db.likesByUser[userId] || []).filter((id) => id !== postId);
        });

        Object.keys(state.db.savesByUser).forEach((userId) => {
            state.db.savesByUser[userId] = (state.db.savesByUser[userId] || []).filter((id) => id !== postId);
        });

        Object.keys(state.db.activitiesByUser).forEach((userId) => {
            state.db.activitiesByUser[userId] = (state.db.activitiesByUser[userId] || []).filter((entry) => entry.postId !== postId);
        });

        persistDb();
        return true;
    },

    async toggleLike(postId) {
        await fakeDelay(100);

        const user = requireCurrentUser();
        const post = getPostById(postId);

        if (!post) {
            throw new Error("Esse post nao existe mais.");
        }

        ensureUserCollections(user.id);
        const likedPosts = state.db.likesByUser[user.id];
        const hasLiked = likedPosts.includes(postId);

        state.db.likesByUser[user.id] = hasLiked
            ? likedPosts.filter((id) => id !== postId)
            : [...likedPosts, postId];

        if (!hasLiked && post.authorId !== user.id) {
            pushActivity(post.authorId, {
                type: "like",
                actorUserId: user.id,
                postId
            });
        }

        persistDb();
        return !hasLiked;
    },

    async toggleSave(postId) {
        await fakeDelay(100);

        const user = requireCurrentUser();
        const post = getPostById(postId);

        if (!post) {
            throw new Error("Esse post nao existe mais.");
        }

        ensureUserCollections(user.id);
        const savedPosts = state.db.savesByUser[user.id];
        const hasSaved = savedPosts.includes(postId);
        state.db.savesByUser[user.id] = hasSaved
            ? savedPosts.filter((id) => id !== postId)
            : [...savedPosts, postId];

        persistDb();
        return !hasSaved;
    },

    async toggleFollow(targetUserId) {
        await fakeDelay(100);

        const user = requireCurrentUser();
        const targetUser = getUserById(targetUserId);

        if (!targetUser || targetUser.id === user.id) {
            throw new Error("Nao foi possivel seguir essa conta.");
        }

        ensureUserCollections(user.id);
        const following = state.db.followsByUser[user.id];
        const isFollowing = following.includes(targetUserId);
        state.db.followsByUser[user.id] = isFollowing
            ? following.filter((id) => id !== targetUserId)
            : [...following, targetUserId];

        if (!isFollowing) {
            pushActivity(targetUserId, {
                type: "follow",
                actorUserId: user.id
            });
        }

        persistDb();
        return !isFollowing;
    },

    async addComment(postId, rawText, replyToCommentId = "") {
        await fakeDelay(130);

        const user = requireCurrentUser();
        const post = getPostById(postId);
        const text = sanitizeText(rawText || "", 220);

        if (!post) {
            throw new Error("Esse post nao existe mais.");
        }

        if (!text) {
            throw new Error("Escreva algo antes de comentar.");
        }

        if (!state.db.commentsByPost[postId]) {
            state.db.commentsByPost[postId] = [];
        }

        const parentComment = replyToCommentId
            ? state.db.commentsByPost[postId].find((comment) => comment.id === replyToCommentId) || null
            : null;

        if (replyToCommentId && !parentComment) {
            throw new Error("Nao deu para responder esse comentario.");
        }

        const comment = {
            id: createId("comment"),
            authorId: user.id,
            text,
            parentId: parentComment ? parentComment.id : null,
            createdAt: Date.now()
        };

        state.db.commentsByPost[postId].push(comment);

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

        persistDb();
        return comment;
    },

    async deleteComment(postId, commentId) {
        await fakeDelay(110);

        const user = requireCurrentUser();
        const post = getPostById(postId);

        if (!post) {
            throw new Error("Esse post nao existe mais.");
        }

        const comments = state.db.commentsByPost[postId] || [];
        const comment = comments.find((item) => item.id === commentId);

        if (!comment) {
            throw new Error("Esse comentario nao existe mais.");
        }

        if (comment.authorId !== user.id && post.authorId !== user.id) {
            throw new Error("Voce nao pode remover esse comentario.");
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

        state.db.commentsByPost[postId] = comments.filter((item) => !deletedIds.has(item.id));

        if (!state.db.commentsByPost[postId].length) {
            delete state.db.commentsByPost[postId];
        }

        Object.keys(state.db.activitiesByUser).forEach((userId) => {
            state.db.activitiesByUser[userId] = (state.db.activitiesByUser[userId] || []).filter((entry) => {
                return !(
                    (entry.type === "comment" || entry.type === "reply") &&
                    entry.postId === postId &&
                    deletedIds.has(entry.commentId)
                );
            });
        });

        persistDb();
        return [...deletedIds];
    }
};

function renderAll() {
    renderAuthScreen();
    renderFrame();
    renderComposerModal();
    renderPostModal();
    renderProfileEditorModal();
    refreshBrandAssets();
}

function renderAuthScreen() {
    renderAuthGallery();
    renderSavedAccounts();
    updateAuthForms();
}

function renderFrame() {
    const user = getCurrentUser();
    const isLoggedIn = Boolean(user);

    authScreen.classList.toggle("is-hidden", isLoggedIn);
    appShell.classList.toggle("is-hidden", !isLoggedIn);
    updateThemeToggleControl();

    if (!isLoggedIn) {
        sidebarUser.innerHTML = "";
        topUserPill.innerHTML = "";
        if (topbarAlertsPreview) {
            topbarAlertsPreview.innerHTML = "";
        }
        topbarAlertsShell?.classList.remove("is-open");
        viewRoot.innerHTML = "";
        syncTopbarAlertsBadge(null);
        syncTopbarState();
        syncNavigation();
        document.body.classList.toggle("modal-open", false);
        return;
    }

    if (!state.ui.profileUserId) {
        state.ui.profileUserId = user.id;
    }

    sidebarUser.innerHTML = "";
    renderTopUserPill(user);
    syncTopbarAlertsBadge(user);
    renderTopbarAlertsPreview(user);
    syncTopbarState();
    syncNavigation();
    renderView();
}

function updateThemeToggleControl() {
    if (!themeToggle) {
        return;
    }

    const textNode = themeToggle.querySelector(".button-text");

    if (textNode) {
        textNode.textContent = "Cor";
    }

    themeToggle.setAttribute("aria-label", "Abrir personalizacao de cor");
}

function renderSavedAccounts() {
    const users = getSavedAccounts();
    savedAccounts.classList.toggle("is-empty", users.length === 0);

    if (!users.length) {
        savedAccounts.innerHTML = "";
        return;
    }

    savedAccounts.innerHTML = `
        <div>
            <span class="section-kicker">Perfis recentes</span>
        </div>
        <div class="saved-accounts-list">
            ${users
                .map((user) => {
                    const postCount = getUserPosts(user.id).length;
                    return `
                        <button class="saved-account-card" type="button" data-action="login-saved" data-user-id="${escapeHtml(user.id)}">
                            <div class="card-row">
                                ${renderAvatar(user, "mini-avatar")}
                                <div class="saved-account-copy">
                                    <strong>${escapeHtml(user.name)}</strong>
                                    <span>@${escapeHtml(user.handle)} - ${postCount} ${postCount === 1 ? "post" : "posts"}</span>
                                </div>
                            </div>
                            <span class="meta-pill">${escapeHtml(timeAgo(user.lastLoginAt))}</span>
                        </button>
                    `;
                })
                .join("")}
        </div>
    `;
}

function updateAuthForms() {
    const isLogin = state.ui.authView === "login";
    loginForm.classList.toggle("is-hidden", !isLogin);
    registerForm.classList.toggle("is-hidden", isLogin);

    document.querySelectorAll("[data-auth-view]").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.authView === state.ui.authView);
    });
}

function renderAuthGallery() {
    const slides = getAuthGallerySlides();
    const trackA = slides.slice(0, 6);
    const trackB = slides.slice(2, 8);

    authTrackA.innerHTML = renderAuthTrack(trackA);
    authTrackB.innerHTML = renderAuthTrack(trackB);
}

function renderAuthTrack(slides) {
    const repeated = [...slides, ...slides];

    return repeated
        .map(
            (src, index) => `
                <div class="auth-marquee-item">
                    <img src="${escapeAttribute(src)}" alt="Post em destaque ${index + 1}">
                </div>
            `
        )
        .join("");
}

function renderSidebarUser(user) {
    const posts = getUserPosts(user.id);
    const followers = getFollowersCount(user.id);
    const following = getFollowingCount(user.id);

    sidebarUser.innerHTML = `
        <div class="sidebar-user-row">
            ${renderProfileIdentity(user, {
                avatarClass: "avatar",
                copyClass: "sidebar-user-copy",
                meta: `@${user.handle}`,
                className: "profile-link profile-link--sidebar"
            })}
        </div>
        <div class="card-copy">
            <strong>${escapeHtml(user.bio)}</strong>
            <span>Seu perfil, seus salvos e as contas que voce acompanha.</span>
        </div>
        <div class="profile-stats">
            <div class="profile-stat">
                <strong>${formatCompact.format(posts.length)}</strong>
                <span>posts</span>
            </div>
            <div class="profile-stat">
                <strong>${formatCompact.format(followers)}</strong>
                <span>seguidores</span>
            </div>
            <div class="profile-stat">
                <strong>${formatCompact.format(following)}</strong>
                <span>seguindo</span>
            </div>
        </div>
        <div class="sidebar-user-actions">
            <button class="ghost-button" type="button" data-action="open-profile-editor">${renderButtonContent("edit", "Editar")}</button>
            <button class="ghost-button" type="button" data-action="open-composer">${renderButtonContent("compose", "Novo post")}</button>
            <button class="ghost-button" type="button" data-action="logout">${renderButtonContent("logout", "Sair")}</button>
        </div>
    `;
}

function renderTopbarAlertsPreview(user) {
    if (!topbarAlertsPreview) {
        return;
    }

    if (!user || !state.ui.alertsPreviewOpen) {
        topbarAlertsPreview.innerHTML = "";
        topbarAlertsShell?.classList.remove("is-open");
        return;
    }

    const activities = getActivitiesForUser(user.id).slice(0, 4);

    topbarAlertsShell?.classList.add("is-open");
    topbarAlertsPreview.innerHTML = `
        <div class="top-alerts-menu">
            <div class="top-alerts-head">
                <div class="card-copy">
                    <strong>Alertas</strong>
                    <span>Uma leitura rapida do que aconteceu agora.</span>
                </div>
                <button class="ghost-button ghost-button--compact" type="button" data-action="open-activity-view">
                    Ver tudo
                </button>
            </div>
            <div class="top-alerts-list">
                ${
                    activities.length
                        ? activities.map((entry) => renderTopbarAlertsPreviewItem(entry)).join("")
                        : `
                            <div class="top-alert-empty">
                                <strong>Sem novidades por enquanto.</strong>
                                <span>Quando alguem curtir, comentar ou seguir, aparece aqui.</span>
                            </div>
                        `
                }
            </div>
        </div>
    `;
}

function renderTopbarAlertsPreviewItem(entry) {
    const actor = getUserById(entry.actorUserId) || getCurrentUser();
    const post = entry.postId ? getPostById(entry.postId) : null;
    const descriptor = describeActivity(entry, actor, post);
    const action = post ? "open-post" : "open-profile";
    const actionData = post
        ? `data-post-id="${escapeHtml(post.id)}"`
        : actor
          ? `data-user-id="${escapeHtml(actor.id)}"`
          : "";

    return `
        <button class="top-alert-item" type="button" data-action="${escapeHtml(action)}" ${actionData}>
            ${actor ? renderAvatar(actor, "mini-avatar") : `<span class="mini-avatar">C</span>`}
            <div class="top-alert-copy">
                <strong>${escapeHtml(descriptor.title)}</strong>
                <span>${escapeHtml(descriptor.subtitle)}</span>
                <p>${escapeHtml(descriptor.body)}</p>
            </div>
            <span class="top-alert-time">${escapeHtml(timeAgo(entry.createdAt))}</span>
        </button>
    `;
}

function renderTopUserPill(user) {
    const accentColor = normalizeSiteAccent(state.prefs.accentColor);
    const postsCount = getUserPosts(user.id).length;
    const followersCount = getFollowersCount(user.id);
    const followingCount = getFollowingCount(user.id);
    const latestPosts = getUserPosts(user.id).slice(0, 2);

    topUserPill.innerHTML = `
        <div class="top-profile-shell ${state.ui.profileMenuOpen ? "is-open" : ""}">
            <button class="top-profile-bubble" type="button" data-action="toggle-profile-menu" aria-label="Abrir menu do perfil">
                ${renderAvatar(user, "mini-avatar")}
            </button>
            ${
                state.ui.profileMenuOpen
                    ? `
                        <div class="top-profile-menu">
                            <button class="top-profile-summary" type="button" data-action="open-own-profile">
                                ${renderAvatar(user, "avatar avatar--menu")}
                                <div class="top-profile-summary-copy">
                                    <strong>${escapeHtml(user.name)}</strong>
                                    <span>@${escapeHtml(user.handle)}</span>
                                </div>
                            </button>
                            <div class="top-profile-peek">
                                <div class="top-profile-stats">
                                    <button class="top-profile-stat" type="button" data-action="open-own-posts">
                                        <strong>${escapeHtml(formatCompact.format(postsCount))}</strong>
                                        <span>posts</span>
                                    </button>
                                    <button class="top-profile-stat" type="button" data-action="toggle-profile-connections" data-connection-view="followers">
                                        <strong>${escapeHtml(formatCompact.format(followersCount))}</strong>
                                        <span>seguidores</span>
                                    </button>
                                    <button class="top-profile-stat" type="button" data-action="toggle-profile-connections" data-connection-view="following">
                                        <strong>${escapeHtml(formatCompact.format(followingCount))}</strong>
                                        <span>seguindo</span>
                                    </button>
                                </div>
                                ${
                                    latestPosts.length
                                        ? `
                                            <div class="top-profile-latest">
                                                ${latestPosts
                                                    .map(
                                                        (post) => `
                                                            <button class="top-profile-post-peek" type="button" data-action="open-post" data-post-id="${escapeHtml(post.id)}">
                                                                <strong>${escapeHtml(truncateText(post.title, 28))}</strong>
                                                                <span>${escapeHtml(timeAgo(post.createdAt))}</span>
                                                            </button>
                                                        `
                                                    )
                                                    .join("")}
                                            </div>
                                        `
                                        : ""
                                }
                            </div>
                            <div class="top-profile-menu-actions">
                                <button class="profile-menu-button" type="button" data-action="open-own-profile">
                                    <span class="button-symbol" aria-hidden="true">${renderIcon("profile")}</span>
                                    <span>Ver perfil</span>
                                </button>
                                <button class="profile-menu-button" type="button" data-action="open-own-posts">
                                    <span class="button-symbol" aria-hidden="true">${renderIcon("posts")}</span>
                                    <span>Ver posts</span>
                                </button>
                                <button class="profile-menu-button" type="button" data-action="open-profile-editor">
                                    <span class="button-symbol" aria-hidden="true">${renderIcon("edit")}</span>
                                    <span>Editar</span>
                                </button>
                                <button class="profile-menu-button" type="button" data-action="open-composer">
                                    <span class="button-symbol" aria-hidden="true">${renderIcon("compose")}</span>
                                    <span>Novo post</span>
                                </button>
                                <button class="profile-menu-button profile-menu-button--danger" type="button" data-action="logout">
                                    <span class="button-symbol" aria-hidden="true">${renderIcon("logout")}</span>
                                    <span>Sair</span>
                                </button>
                            </div>
                            <div class="top-profile-color-studio">
                                <div class="card-copy">
                                    <strong>Cor do site</strong>
                                    <span>Escolha um acento leve para deixar o app com a sua cara.</span>
                                </div>
                                <div class="top-profile-color-row">
                                    ${SITE_ACCENT_SWATCHES.map(
                                        (swatch) => `
                                            <button
                                                class="top-profile-color-chip ${accentColor === swatch ? "is-active" : ""}"
                                                type="button"
                                                data-action="set-site-accent"
                                                data-accent-color="${escapeHtml(swatch)}"
                                                aria-label="Usar a cor ${escapeAttribute(swatch)}"
                                                style="--swatch-color:${escapeAttribute(swatch)}"
                                            ></button>
                                        `
                                    ).join("")}
                                </div>
                                <label class="top-profile-color-picker">
                                    <span>Cor personalizada</span>
                                    <input id="siteAccentPicker" type="color" value="${escapeAttribute(accentColor)}">
                                </label>
                            </div>
                        </div>
                    `
                    : ""
            }
        </div>
    `;
}

function syncNavigation() {
    document.querySelectorAll(".nav-link, .mobile-link").forEach((button) => {
        button.classList.toggle("is-active", button.dataset.view === state.ui.view);
    });

    globalSearch.value = state.ui.query;
}

function renderView() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        viewRoot.innerHTML = "";
        return;
    }

    const activeProfileUser = getActiveProfileUser(currentUser);

    const markup =
        state.ui.view === "discussions"
            ? renderDiscussionView(currentUser)
            : state.ui.view === "following"
            ? renderFollowingView(currentUser)
            : state.ui.view === "saved"
              ? renderSavedView(currentUser)
              : state.ui.view === "activity"
                ? renderActivityView(currentUser)
                : state.ui.view === "profile"
                  ? renderProfileView(activeProfileUser, currentUser)
                  : renderHomeView(currentUser);

    viewRoot.innerHTML = markup;
}

function renderHomeView(user) {
    const query = state.ui.query.trim();
    const homeMode = state.ui.viewTabs.homeMode === "photos" ? "photos" : "social";
    const trendingPosts = getHomePosts(user.id);
    const recentPosts = getRecentPosts(user.id);
    const discoveryPosts = getDiscoveryPosts(user.id);
    const photoModePosts = getPhotoModePosts(user.id);
    const rankedPostsRaw =
        state.ui.viewTabs.home === "recent"
            ? recentPosts
            : state.ui.viewTabs.home === "discover"
              ? discoveryPosts
              : trendingPosts;
    const rankedPosts = stabilizePostsOrder(
        homeMode === "photos" ? photoModePosts : rankedPostsRaw,
        "home",
        `home:${user.id}:${state.ui.viewTabs.home}:${homeMode}:${state.ui.category}:${query.toLowerCase()}`
    );
    const spotlightPosts = query ? [] : rankedPosts.slice(0, 4);
    const timelinePosts = rankedPosts.slice(query ? 0 : 4, query ? 4 : 7);
    const highlightedPostIds = new Set([...spotlightPosts, ...timelinePosts].map((post) => post.id));
    const homeGridPosts = rankedPosts.filter((post) => !highlightedPostIds.has(post.id));

    return `
        <div class="view-stack view-stack--home">
            ${
                query
                    ? `
                        ${renderHero({
                            kicker: "Busca",
                            title: `Resultados para "${query}"`,
                            text: "Uma leitura limpa da busca, sem desviar o foco da arte e das postagens.",
                            stats: [
                                { value: formatCompact.format(rankedPosts.length), label: "posts encontrados" },
                                { value: formatCompact.format(recentPosts.length), label: "recentes" },
                                { value: formatCompact.format(getFollowingCount(user.id)), label: "seguindo" }
                            ]
                        })}
                        ${renderHomeModeSwitch(homeMode)}
                    `
                    : homeMode === "photos"
                      ? renderHomePhotoIntro(homeMode, rankedPosts)
                      : `
                          ${renderHomeSpotlight(user, rankedPosts)}
                          ${renderHomeModeSwitch(homeMode)}
                      `
            }
            ${
                homeMode === "photos"
                    ? ""
                    : renderViewTabsStrip({
                          group: "home",
                          kicker: query ? "Busca viva" : "Ritmo da rede",
                          title: query ? "Organize os resultados sem perder contexto." : "Troque o ritmo da home sem baguncar a leitura.",
                          text: query
                              ? "As abas agora mudam a ordem real dos resultados, nao so a aparencia."
                              : "Em alta, recentes e descobertas agora funcionam de verdade e mantem a pagina clara.",
                          tabs: [
                              { value: "trending", label: "Em alta", count: trendingPosts.length },
                              { value: "recent", label: "Recentes", count: recentPosts.length },
                              { value: "discover", label: "Descobertas", count: discoveryPosts.length }
                          ]
                      })
            }
            ${
                homeMode === "photos"
                    ? ""
                    : `
                        <section class="filter-strip">
                            ${CATEGORIES.map((category) => renderFilterButton(category)).join("")}
                        </section>
                    `
            }
            ${
                rankedPosts.length
                    ? `
                        ${
                            homeMode === "photos"
                                ? renderPhotoGallerySection(rankedPosts)
                                : `
                                    ${timelinePosts.length ? renderHomeTimelineSection(timelinePosts) : ""}
                                    ${
                                        homeGridPosts.length
                                            ? `
                                                <section class="art-grid art-grid--home-flow">
                                                    ${homeGridPosts
                                                        .map((post, index) =>
                                                            renderArtCard(post, {
                                                                home: true,
                                                                featured: index < 2,
                                                                main: index === 0
                                                            })
                                                        )
                                                        .join("")}
                                                </section>
                                            `
                                            : ""
                                    }
                                `
                        }
                    `
                    : renderEmptyState({
                          kicker: query ? "Busca" : "Inicio",
                          title: query ? "Nenhum post bateu com essa busca." : "Seu inicio ainda nao tem posts.",
                          subtitle: query
                              ? "Tente buscar por outro nome, tag ou categoria."
                              : "Assim que a rede ganhar movimento, os novos posts aparecem aqui.",
                          text: query
                              ? "Se nao encontrou agora, experimente mudar o termo ou limpar o filtro para ver mais gente e mais posts."
                              : "Publique algo ou siga algumas contas para montar o seu inicio.",
                          action: "open-composer",
                          actionLabel: query ? "Publicar um post" : "Fazer o primeiro post"
                      })
            }
        </div>
    `;
}

function renderHomeModeSwitch(homeMode) {
    return `
        <div class="hero-mode-switch">
            ${[
                { value: "social", label: "Social" },
                { value: "photos", label: "Fotos" }
            ]
                .map(
                    (mode) => `
                        <button
                            class="hero-mode-pill ${homeMode === mode.value ? "is-active" : ""}"
                            type="button"
                            data-tab-group="homeMode"
                            data-tab-value="${escapeHtml(mode.value)}"
                        >
                            ${escapeHtml(mode.label)}
                        </button>
                    `
                )
                .join("")}
        </div>
    `;
}

function renderHomePhotoIntro(homeMode, posts) {
    const photoCount = posts.filter((post) => sanitizeImageSource(post.imageData || "")).length;

    return `
        <section class="photo-mode-head">
            <div class="photo-mode-copy">
                <span class="section-kicker">Fotos</span>
                <div>
                    <h1>Colagem da rede</h1>
                    <p>Todas as imagens publicadas do app em uma leitura limpa, continua e focada so na arte.</p>
                </div>
            </div>
            <div class="photo-mode-actions">
                ${renderHomeModeSwitch(homeMode)}
                <div class="photo-mode-meta">
                    <span class="meta-pill">${escapeHtml(formatMetricLabel(photoCount, "imagem", "imagens"))}</span>
                    <button class="ghost-button" type="button" data-action="open-composer">
                        ${renderButtonContent("compose", "Novo post")}
                    </button>
                </div>
            </div>
        </section>
    `;
}

function renderHomeSpotlight(user, posts) {
    const spotlight = posts[0] || null;
    const railPosts = posts.slice(1, 4);

    if (!spotlight) {
        return renderHero({
            kicker: "Inicio",
            title: "Hoje no CONQUEST",
            text: "Posts que estao chamando atencao agora, misturados com novidades de quem voce acompanha.",
            stats: [
                { value: formatCompact.format(state.db.users.length), label: "na rede" },
                { value: formatCompact.format(posts.length), label: "posts" },
                { value: formatCompact.format(getFollowingCount(user.id)), label: "seguindo" }
            ]
        });
    }

    const spotlightStyle = getPostVisualStyleAttribute(spotlight);

    return `
        <section class="view-hero view-hero--editorial">
            <div class="hero-main">
                <div class="hero-copy-shell">
                    <span class="section-kicker">Inicio</span>
                    <div>
                        <h1>Hoje no CONQUEST</h1>
                        <p>As obras mais salvas, comentadas e descobertas agora, com uma primeira dobra mais viva, editorial e luminosa.</p>
                    </div>
                    <div class="hero-actions">
                        <button class="primary-button" type="button" data-view="following">
                            ${renderButtonContent("open", "Explorar agora")}
                        </button>
                        <button class="ghost-button" type="button" data-action="open-composer">
                            ${renderButtonContent("compose", "Novo post")}
                        </button>
                    </div>
                </div>
                <div class="hero-feature">
                    <button class="hero-feature-media" type="button" data-action="open-post" data-post-id="${escapeHtml(spotlight.id)}">
                        ${renderPostMediaVisual(spotlight, {
                            frameClass: "hero-feature-media-stack",
                            imageClass: "hero-feature-image",
                            stickerClass: "post-sticker--hero"
                        })}
                    </button>
                    <div class="hero-feature-copy ${getPostFontClass(spotlight)}"${spotlightStyle}>
                        <div class="hero-feature-top">
                            <span class="meta-pill">${escapeHtml(spotlight.category)}</span>
                            ${renderPostSignalBadge(spotlight)}
                            <span class="meta-pill">${escapeHtml(timeAgo(spotlight.createdAt))}</span>
                        </div>
                        <div>
                            <h2>${escapeHtml(spotlight.title)}</h2>
                            <p>${escapeHtml(truncateText(spotlight.caption || "Uma obra em destaque para puxar o ritmo do dia.", 148))}</p>
                        </div>
                        ${renderProfileIdentity(spotlight.author, {
                            avatarClass: "mini-avatar",
                            copyClass: "profile-link-copy",
                            meta: `@${spotlight.author.handle}`,
                            className: "profile-link profile-link--hero"
                        })}
                        <div class="art-stats">
                            ${renderMetricText("like", formatMetricLabel(spotlight.likesCount, "curtida", "curtidas"))}
                            ${renderMetricText("open", formatMetricLabel(spotlight.commentsCount, "comentario", "comentarios"))}
                            ${renderMetricText("save", formatMetricLabel(spotlight.savesCount, "salvo", "salvos"))}
                        </div>
                    </div>
                </div>
            </div>
            ${
                railPosts.length
                    ? `
                        <div class="hero-rail">
                            <div class="hero-rail-head">
                                <span class="section-kicker">Curadoria ao vivo</span>
                                <span class="hero-rail-note">Obras que estao puxando a conversa</span>
                            </div>
                            <div class="hero-rail-list">
                                ${railPosts
                                    .map(
                                        (post) => `
                                            <button class="hero-rail-card" type="button" data-action="open-post" data-post-id="${escapeHtml(post.id)}">
                                                <span class="hero-rail-thumb">
                                                    ${renderPostMediaVisual(post, {
                                                        frameClass: "hero-rail-media-stack",
                                                        imageClass: "hero-rail-image",
                                                        stickerClass: "post-sticker--rail"
                                                    })}
                                                </span>
                                                <span class="hero-rail-body ${getPostFontClass(post)}"${getPostVisualStyleAttribute(post)}>
                                                    <span class="hero-rail-top">
                                                        <span class="meta-pill">${escapeHtml(post.category)}</span>
                                                        ${renderPostSignalBadge(post) || `<span class="hero-rail-metric">${escapeHtml(timeAgo(post.createdAt))}</span>`}
                                                    </span>
                                                    <span class="hero-rail-copy">
                                                        <strong>${escapeHtml(post.title)}</strong>
                                                        <span>@${escapeHtml(post.author.handle)} - ${escapeHtml(timeAgo(post.createdAt))}</span>
                                                    </span>
                                                </span>
                                            </button>
                                        `
                                    )
                                    .join("")}
                            </div>
                        </div>
                    `
                    : ""
            }
        </section>
    `;
}

function renderFollowingView(user) {
    const query = state.ui.query.trim();
    const followingTab = state.ui.viewTabs.following === "following" ? "following" : "all";
    const allPosts = getFeedPosts(user.id);
    const followingPosts = getFollowingPosts(user.id);
    const posts = stabilizePostsOrder(
        followingTab === "following" ? followingPosts : allPosts,
        "following",
        `following:${user.id}:${followingTab}:${query.toLowerCase()}`
    );
    const followingCount = getFollowingCount(user.id);
    const compactNote = query
        ? `Busca ativa com ${formatCompact.format(posts.length)} posts.`
        : followingTab === "following"
          ? `${formatCompact.format(followingPosts.length)} posts das ${formatCompact.format(followingCount)} contas que voce segue.`
          : `${formatCompact.format(allPosts.length)} posts na timeline completa do app.`;

    return `
        <div class="view-stack">
            <section class="tag-strip tag-strip--modes tag-strip--feed-compact tag-strip--feed-minimal">
                <div class="strip-copy strip-copy--feed strip-copy--feed-minimal">
                    <span class="section-kicker">Feed</span>
                    <p>
                        <strong class="strip-title">${escapeHtml(query ? `Resultados para "${query}"` : "Timeline")}</strong>
                        <span>${escapeHtml(compactNote)}</span>
                    </p>
                </div>
                <div class="trend-pill-row trend-pill-row--feed trend-pill-row--feed-minimal">
                    ${[
                        { value: "all", label: "Tudo" },
                        { value: "following", label: "Seguindo" }
                    ]
                        .map(
                            (tab) => `
                                <button
                                    class="trend-pill ${followingTab === tab.value ? "is-active" : ""}"
                                    type="button"
                                    data-tab-group="following"
                                    data-tab-value="${escapeHtml(tab.value)}"
                                    aria-pressed="${followingTab === tab.value ? "true" : "false"}"
                                >
                                    <span>${escapeHtml(tab.label)}</span>
                                </button>
                            `
                        )
                        .join("")}
                </div>
            </section>
            ${
                posts.length
                    ? `
                        <section class="feed-list feed-list--social">
                            ${posts
                                .map((post, index) =>
                                    renderFeedCard(post, {
                                        highlight:
                                            followingTab !== "following" &&
                                            index < 2 &&
                                            Boolean(post.recommendationBadge)
                                    })
                                )
                                .join("")}
                        </section>
                    `
                    : renderEmptyState({
                          kicker: "Feed",
                          title:
                              followingTab === "following"
                                  ? query
                                      ? "Nenhum post das contas seguidas bateu com essa busca."
                                      : "As contas que voce segue ainda nao postaram por aqui."
                                  : query
                                    ? "Nenhum post bateu com essa busca."
                                    : "Nada apareceu no feed agora.",
                          subtitle: query
                              ? "Tente outro termo ou limpe a busca para ver o feed completo."
                              : followingTab === "following"
                                ? "Troque para a aba Tudo para ver a timeline completa."
                                : "Tente novamente em instantes.",
                          text: query
                              ? "A busca continua funcionando em toda a timeline, sem esconder o resto do app."
                              : followingTab === "following"
                                ? "Seguindo fica como filtro rapido, enquanto Tudo mostra a timeline completa."
                                : "Quando novos posts entrarem, eles aparecem aqui pela ordem do algoritmo.",
                          action: followingTab === "following" ? "open-composer" : "",
                          actionLabel: followingTab === "following" ? "Postar" : null
                      })
            }
        </div>
    `;
}

function renderDiscussionView(user) {
    const query = state.ui.query.trim();
    const discussionTab = ["for-you", "recent", "following"].includes(state.ui.viewTabs.discussions)
        ? state.ui.viewTabs.discussions
        : "for-you";
    const forYouPosts = getDiscussionPosts(user.id);
    const recentPosts = getRecentDiscussionPosts(user.id);
    const followingPosts = getFollowingDiscussionPosts(user.id);
    const sourcePosts =
        discussionTab === "recent"
            ? recentPosts
            : discussionTab === "following"
              ? followingPosts
              : forYouPosts;
    const posts = stabilizePostsOrder(
        sourcePosts,
        "discussions",
        `discussions:${user.id}:${discussionTab}:${query.toLowerCase()}`
    );
    const topics = getTrendingDiscussionTopics(forYouPosts);
    const leadingTopic = topics[0] || null;
    const note = query
        ? `Resultados sobre ${query}.`
        : discussionTab === "recent"
          ? `${formatCompact.format(recentPosts.length)} discussões em ordem cronológica.`
          : discussionTab === "following"
            ? `${formatCompact.format(followingPosts.length)} posts das contas que voce acompanha.`
            : `${formatCompact.format(forYouPosts.length)} conversas selecionadas por relevancia, recencia e assunto.`;

    return `
        <div class="view-stack view-stack--discussions">
            <section class="discussion-hero">
                <div class="discussion-hero-copy">
                    <span class="section-kicker">Discussões</span>
                    <div>
                        <h1>${escapeHtml(query ? `Conversas sobre ${query}` : "Assuntos do momento")}</h1>
                        <p>Um canto mais rapido para levantar #, comentar o que esta rolando e postar no estilo microblog sem atrapalhar a parte de arte.</p>
                    </div>
                </div>
                <div class="discussion-hero-actions">
                    <button class="primary-button" type="button" data-action="open-discussion-composer">
                        ${renderButtonContent("compose", "Nova discussao")}
                    </button>
                    <button class="ghost-button" type="button" data-view="following">
                        ${renderButtonContent("open", "Ir para o feed")}
                    </button>
                </div>
            </section>
            <section class="discussion-shell">
                <div class="discussion-main">
                    <section class="tag-strip tag-strip--modes tag-strip--discussion">
                        <div class="strip-copy strip-copy--discussion">
                            <span class="section-kicker">Timeline</span>
                            <p>
                                <strong class="strip-title">${escapeHtml(query ? "Busca em discussões" : "Conversa viva")}</strong>
                                <span>${escapeHtml(note)}</span>
                            </p>
                        </div>
                        <div class="trend-pill-row trend-pill-row--discussion">
                            ${[
                                { value: "for-you", label: "Para voce" },
                                { value: "recent", label: "Recentes" },
                                { value: "following", label: "Seguindo" }
                            ]
                                .map(
                                    (tab) => `
                                        <button
                                            class="trend-pill ${discussionTab === tab.value ? "is-active" : ""}"
                                            type="button"
                                            data-tab-group="discussions"
                                            data-tab-value="${escapeHtml(tab.value)}"
                                            aria-pressed="${discussionTab === tab.value ? "true" : "false"}"
                                        >
                                            <span>${escapeHtml(tab.label)}</span>
                                        </button>
                                    `
                                )
                                .join("")}
                        </div>
                    </section>
                    ${
                        posts.length
                            ? `
                                <section class="discussion-list">
                                    ${posts.map((post, index) => renderDiscussionCard(post, { highlight: index === 0 && !query })).join("")}
                                </section>
                            `
                            : renderEmptyState({
                                  kicker: "Discussões",
                                  title: query ? "Nenhuma conversa bateu com essa busca." : "Ainda nao tem discussao por aqui.",
                                  subtitle: query
                                      ? "Tente outra hashtag ou limpe a busca para ver os assuntos quentes."
                                      : "Abra a primeira thread e puxe uma conversa para essa aba nascer viva.",
                                  text: query
                                      ? "A busca tambem olha caption, titulo, hashtags e autor."
                                      : "As publicacoes feitas como Discussao aparecem aqui em formato de timeline textual.",
                                  action: "open-discussion-composer",
                                  actionLabel: "Abrir discussao"
                              })
                    }
                </div>
                <aside class="discussion-aside">
                    <section class="discussion-topic-panel">
                        <div class="discussion-topic-head">
                            <div class="card-copy">
                                <strong>Assuntos do momento</strong>
                                <span>Hashtags que estao puxando conversa agora.</span>
                            </div>
                        </div>
                        ${
                            leadingTopic
                                ? `
                                    <button class="discussion-topic-feature" type="button" data-action="apply-topic-filter" data-topic="${escapeHtml(leadingTopic.tag)}">
                                        <span class="section-kicker">Em alta</span>
                                        <strong>${escapeHtml(leadingTopic.tag)}</strong>
                                        <p>${escapeHtml(formatMetricLabel(leadingTopic.postsCount, "post", "posts"))} e ${escapeHtml(formatMetricLabel(leadingTopic.commentsCount, "comentario", "comentarios"))} nesse assunto.</p>
                                    </button>
                                `
                                : ""
                        }
                        <div class="discussion-topic-list">
                            ${
                                topics.length
                                    ? topics
                                          .map(
                                              (topic, index) => `
                                                <button class="discussion-topic-item" type="button" data-action="apply-topic-filter" data-topic="${escapeHtml(topic.tag)}">
                                                    <span class="discussion-topic-rank">#${index + 1}</span>
                                                    <div class="discussion-topic-copy">
                                                        <strong>${escapeHtml(topic.tag)}</strong>
                                                        <span>${escapeHtml(formatMetricLabel(topic.postsCount, "post", "posts"))} · ${escapeHtml(formatMetricLabel(topic.commentsCount, "comentario", "comentarios"))}</span>
                                                    </div>
                                                </button>
                                            `
                                          )
                                          .join("")
                                    : `
                                        <div class="discussion-topic-empty">
                                            <strong>As hashtags aparecem aqui.</strong>
                                            <span>Use # no post para puxar assunto e alimentar essa vitrine.</span>
                                        </div>
                                    `
                            }
                        </div>
                    </section>
                </aside>
            </section>
        </div>
    `;
}

function renderSavedView(user) {
    const savedTab = state.ui.viewTabs.saved;
    const recentPosts = getSavedPosts(user.id);
    const likedPosts = sortPostsByLikes(recentPosts);
    const discussedPosts = sortPostsByConversation(recentPosts);
    const posts =
        savedTab === "liked"
            ? likedPosts
            : savedTab === "discussed"
              ? discussedPosts
              : recentPosts;
    const savedTitle =
        savedTab === "liked"
            ? "Seus salvos que mais chamaram atencao."
            : savedTab === "discussed"
              ? "O que voce salvou e ainda esta rendendo conversa."
              : "O que voce guardou para voltar depois.";
    const savedText =
        savedTab === "liked"
            ? "Uma selecao puxada pelas obras com mais curtidas, para chegar rapido no que mais brilhou."
            : savedTab === "discussed"
              ? "Boa para revisar referencias vivas, com comentarios e interacoes acontecendo em volta."
              : "Uma selecao pessoal de imagens, referencias e posts que valem outra olhada.";

    return `
        <div class="view-stack">
            ${renderHero({
                kicker: "Salvos",
                title: savedTitle,
                text: savedText,
                stats: [
                    { value: formatCompact.format(posts.length), label: "posts salvos" },
                    { value: formatCompact.format(getUserPosts(user.id).length), label: "posts seus" },
                    { value: formatCompact.format(getUserCommentsCount(user.id)), label: "comentarios" }
                ]
            })}
            ${renderViewTabsStrip({
                group: "saved",
                kicker: "Colecao organizada",
                title: "Volte para suas referencias sem se perder.",
                text: "Veja os salvos por ordem recente, pelo que mais chamou atencao ou pelo que gerou conversa.",
                tabs: [
                    { value: "recent", label: "Recentes", count: recentPosts.length },
                    { value: "liked", label: "Mais curtidos", count: likedPosts.length },
                    { value: "discussed", label: "Mais comentados", count: discussedPosts.length }
                ]
            })}
            <section class="art-grid">
                ${
                    posts.length
                        ? posts.map((post) => renderArtCard(post)).join("")
                        : renderEmptyState({
                              kicker: "Salvos",
                              title: "Nada salvo por enquanto.",
                              subtitle: "Quando voce guardar um post, ele fica aqui.",
                              text: "Use salvar em qualquer publicacao para montar sua propria colecao.",
                              action: "",
                              actionLabel: null
                          })
                }
            </section>
        </div>
    `;
}

function renderActivityView(user) {
    const allActivities = getActivitiesForUser(user.id);
    const interactionActivities = filterActivitiesByTab(allActivities, "interactions");
    const followActivities = filterActivitiesByTab(allActivities, "follows");
    const postActivities = filterActivitiesByTab(allActivities, "posts");
    const activities = filterActivitiesByTab(allActivities, state.ui.viewTabs.activity);
    const activityTitle =
        state.ui.viewTabs.activity === "interactions"
            ? "Curtidas, comentarios e respostas num so lugar."
            : state.ui.viewTabs.activity === "follows"
              ? "Quem chegou para acompanhar voce."
              : state.ui.viewTabs.activity === "posts"
                ? "Movimento das suas publicacoes."
                : "Tudo o que rolou com sua conta.";
    const activityText =
        state.ui.viewTabs.activity === "interactions"
            ? "Uma linha mais limpa para ver onde tem conversa acontecendo e o que merece resposta."
            : state.ui.viewTabs.activity === "follows"
              ? "Quando alguem novo entra na sua rede, essa trilha separa tudo para voce bater o olho."
              : state.ui.viewTabs.activity === "posts"
                ? "Publicacoes novas, avisos do seu proprio perfil e movimento geral das obras."
                : "Curtidas, comentarios, novos seguidores e atualizacoes recentes em um so lugar.";

    return `
        <div class="view-stack">
            ${renderHero({
                kicker: "Atividade",
                title: activityTitle,
                text: activityText,
                stats: [
                    { value: formatCompact.format(activities.length), label: "itens recentes" },
                    { value: formatCompact.format(getFollowersCount(user.id)), label: "seguidores" },
                    { value: formatCompact.format(getUserPosts(user.id).length), label: "posts ativos" }
                ]
            })}
            ${renderViewTabsStrip({
                group: "activity",
                kicker: "Central organizada",
                title: "Separe rapidamente o que precisa da sua atencao.",
                text: "Interacoes, seguidores e atualizacoes de publicacao agora ficam em trilhas mais claras.",
                tabs: [
                    { value: "all", label: "Tudo", count: allActivities.length },
                    { value: "interactions", label: "Interacoes", count: interactionActivities.length },
                    { value: "follows", label: "Seguidores", count: followActivities.length },
                    { value: "posts", label: "Publicacoes", count: postActivities.length }
                ]
            })}
            ${
                activities.length
                    ? `
                        <section class="activity-list">
                            ${activities.map((entry) => renderActivityCard(entry)).join("")}
                        </section>
                    `
                    : renderEmptyState({
                          kicker: "Atividade",
                          title: "Sem novidades por enquanto.",
                          subtitle: "Quando alguem interagir com voce, aparece aqui.",
                          text: "Curtidas, comentarios e novos seguidores chegam nesta central conforme o perfil ganha movimento.",
                          action: "open-composer",
                          actionLabel: "Publicar"
                      })
            }
        </div>
    `;
}

function renderProfileView(profileUser, currentUser) {
    const viewerId = currentUser.id;
    const isOwnProfile = profileUser.id === viewerId;
    const posts = applyPostFilters(getUserPosts(profileUser.id).map((post) => toPostView(post, viewerId)).filter(Boolean));
    const highlightPost = posts.find((post) => post.id === profileUser.highlightPostId) || posts[0] || null;
    const profileTheme = getProfileTheme(profileUser.profileTheme);
    const websiteLabel = getWebsiteLabel(profileUser.website);
    const coverImage = getProfileCover(profileUser);
    const followersCount = getFollowersCount(profileUser.id);
    const followingCount = getFollowingCount(profileUser.id);
    const postsCount = getUserPosts(profileUser.id).length;

    return `
        <div class="view-stack">
            <section class="profile-hero" data-profile-theme="${escapeAttribute(profileTheme.id)}">
                <div class="profile-cover">
                    <img src="${escapeAttribute(coverImage)}" alt="${escapeAttribute(profileUser.name)}"${getCoverImageStyleAttribute(profileUser)}>
                </div>
                <div class="profile-hero-content">
                    <div class="profile-row">
                        <div class="profile-identity">
                            ${renderAvatar(profileUser, "avatar avatar--profile")}
                            <div class="profile-copy">
                                <h1>${escapeHtml(profileUser.name)}</h1>
                                <p>@${escapeHtml(profileUser.handle)} - no CONQUEST desde ${escapeHtml(fullDate(profileUser.createdAt))}</p>
                            </div>
                        </div>
                        <div class="sidebar-user-actions">
                            ${
                                isOwnProfile
                                    ? `
                                        <button class="ghost-button" type="button" data-action="open-profile-editor">${renderButtonContent("edit", "Editar perfil")}</button>
                                        <button class="primary-button" type="button" data-action="open-composer">${renderButtonContent("compose", "Novo post")}</button>
                                    `
                                    : `
                                        <button
                                            class="follow-button ${getFollowingIds(viewerId).includes(profileUser.id) ? "is-active" : ""}"
                                            type="button"
                                            data-action="toggle-follow"
                                            data-user-id="${escapeHtml(profileUser.id)}"
                                        >
                                            ${renderButtonContent("follow", getFollowingIds(viewerId).includes(profileUser.id) ? "Seguindo" : "Seguir")}
                                        </button>
                                    `
                            }
                        </div>
                    </div>
                    <p class="profile-bio">${escapeHtml(profileUser.bio)}</p>
                    <div class="profile-meta-row profile-meta-row--rich">
                        <button class="profile-meta-chip" type="button" data-action="jump-profile-posts">
                            <span class="button-symbol" aria-hidden="true">${renderIcon("posts")}</span>
                            <span>${escapeHtml(`${formatCompact.format(postsCount)} posts`)}</span>
                        </button>
                        <button class="profile-meta-chip ${state.ui.profileConnectionsView === "followers" ? "is-active" : ""}" type="button" data-action="toggle-profile-connections" data-connection-view="followers">
                            <span class="button-symbol" aria-hidden="true">${renderIcon("users")}</span>
                            <span>${escapeHtml(`${formatCompact.format(followersCount)} seguidores`)}</span>
                        </button>
                        <button class="profile-meta-chip ${state.ui.profileConnectionsView === "following" ? "is-active" : ""}" type="button" data-action="toggle-profile-connections" data-connection-view="following">
                            <span class="button-symbol" aria-hidden="true">${renderIcon("follow")}</span>
                            <span>${escapeHtml(`${formatCompact.format(followingCount)} seguindo`)}</span>
                        </button>
                        <span class="profile-meta-chip profile-meta-chip--static">
                            <span class="button-symbol" aria-hidden="true">${renderIcon("sparkles")}</span>
                            <span>${escapeHtml(profileTheme.label)}</span>
                        </span>
                        ${
                            profileUser.location
                                ? `
                                    <span class="profile-meta-chip profile-meta-chip--static">
                                        <span class="button-symbol" aria-hidden="true">${renderIcon("pin")}</span>
                                        <span>${escapeHtml(profileUser.location)}</span>
                                    </span>
                                `
                                : ""
                        }
                        ${
                            websiteLabel
                                ? `
                                    <a class="profile-meta-chip profile-meta-chip--static meta-link" href="${escapeAttribute(profileUser.website)}" target="_blank" rel="noreferrer">
                                        <span class="button-symbol" aria-hidden="true">${renderIcon("link")}</span>
                                        <span>${escapeHtml(websiteLabel)}</span>
                                    </a>
                                `
                                : ""
                        }
                    </div>
                </div>
            </section>
            ${renderProfileConnectionsSection(profileUser, viewerId)}
            ${renderProfilePresenceSection(profileUser, currentUser, isOwnProfile, profileTheme, highlightPost)}
            ${
                highlightPost
                    ? `
                        <section class="profile-featured ${getPostFontClass(highlightPost)}" data-profile-theme="${escapeAttribute(profileTheme.id)}"${getPostVisualStyleAttribute(highlightPost)}>
                            <div class="section-head">
                                <div>
                                    <span class="section-kicker">${isOwnProfile ? "Seu destaque" : "Destaque"}</span>
                                    <h2>${escapeHtml(highlightPost.title)}</h2>
                                </div>
                                <button class="ghost-button" type="button" data-action="open-post" data-post-id="${escapeHtml(highlightPost.id)}">
                                    ${renderButtonContent("open", "Abrir post")}
                                </button>
                            </div>
                            <div class="profile-featured-layout">
                                <button class="profile-featured-cover" type="button" data-action="open-post" data-post-id="${escapeHtml(highlightPost.id)}">
                                    ${renderPostMediaVisual(highlightPost, {
                                        frameClass: "profile-featured-media",
                                        imageClass: "profile-featured-image",
                                        stickerClass: "post-sticker--featured"
                                    })}
                                </button>
                                <div class="profile-featured-copy">
                                    <p>${escapeHtml(highlightPost.caption || "Sem legenda.")}</p>
                                    <div class="art-stats">
                                        ${renderMetricText("like", formatMetricLabel(highlightPost.likesCount, "curtida", "curtidas"))}
                                        ${renderMetricText("open", formatMetricLabel(highlightPost.commentsCount, "comentario", "comentarios"))}
                                        ${renderMetricText("save", formatMetricLabel(highlightPost.savesCount, "salvo", "salvos"))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    `
                    : ""
            }
            ${
                isOwnProfile
                    ? renderPeopleSection({
                          viewerId,
                          users: getDiscoverUsers(viewerId, 3),
                          kicker: "Para crescer",
                          title: "Perfis para deixar sua rede mais viva",
                          text: "Seguir algumas contas ajuda seu inicio, atividade e descoberta a ficarem mais movimentados."
                      })
                    : ""
            }
            <section class="section-shell" id="profilePostsSection">
                <div class="section-head">
                    <div>
                        <span class="section-kicker">${isOwnProfile ? "Sua grade" : `Posts de @${profileUser.handle}`}</span>
                        <h2>${posts.length ? `${formatCompact.format(posts.length)} publicacoes` : "Sem publicacoes ainda"}</h2>
                    </div>
                </div>
                <div class="art-grid">
                    ${
                        posts.length
                            ? posts.map((post) => renderArtCard(post)).join("")
                            : renderEmptyState({
                                  kicker: "Perfil",
                                  title: isOwnProfile ? "Seu perfil ainda nao tem posts." : "Esse perfil ainda nao publicou.",
                                  subtitle: isOwnProfile ? "A sua grade aparece aqui assim que voce publicar." : "Assim que algo novo entrar, a grade aparece aqui.",
                                  text: isOwnProfile ? "Compartilhe sua primeira imagem para comecar a montar o perfil." : "Volte depois para ver as proximas publicacoes dessa conta.",
                                  action: isOwnProfile ? "open-composer" : "",
                                  actionLabel: isOwnProfile ? "Fazer o primeiro post" : null
                              })
                    }
                </div>
            </section>
        </div>
    `;
}

function renderHero({ kicker, title, text, stats }) {
    return `
        <section class="view-hero">
            <span class="section-kicker">${escapeHtml(kicker)}</span>
            <div>
                <h1>${escapeHtml(title)}</h1>
                <p>${escapeHtml(text)}</p>
            </div>
            <div class="hero-stats">
                ${stats
                    .map(
                        (item) => `
                            <div class="hero-stat">
                                <strong>${escapeHtml(item.value)}</strong>
                                <span>${escapeHtml(item.label)}</span>
                            </div>
                        `
                    )
                    .join("")}
            </div>
        </section>
    `;
}

function renderViewTabsStrip({ group, kicker, title, text, tabs }) {
    return `
        <section class="tag-strip tag-strip--modes">
            <div class="strip-copy">
                <span class="section-kicker">${escapeHtml(kicker)}</span>
                <p>
                    <strong class="strip-title">${escapeHtml(title)}</strong>
                    <span>${escapeHtml(text)}</span>
                </p>
            </div>
            <div class="trend-pill-row">
                ${tabs
                    .map(
                        (tab) => `
                            <button
                                class="trend-pill ${state.ui.viewTabs[group] === tab.value ? "is-active" : ""}"
                                type="button"
                                data-tab-group="${escapeHtml(group)}"
                                data-tab-value="${escapeHtml(tab.value)}"
                                aria-pressed="${state.ui.viewTabs[group] === tab.value ? "true" : "false"}"
                            >
                                <span>${escapeHtml(tab.label)}</span>
                                <strong>${escapeHtml(formatCompact.format(tab.count || 0))}</strong>
                            </button>
                        `
                    )
                    .join("")}
            </div>
        </section>
    `;
}

function renderFilterButton(category) {
    return `
        <button class="chip-button ${state.ui.category === category ? "is-active" : ""}" type="button" data-filter="${escapeHtml(category)}">
            ${escapeHtml(category)}
        </button>
    `;
}

function renderButtonContent(icon, label) {
    return `
        <span class="button-symbol" aria-hidden="true">
            ${renderIcon(icon)}
        </span>
        <span class="button-text">${escapeHtml(label)}</span>
    `;
}

function renderIcon(name) {
    const icons = {
        like: `
            <svg viewBox="0 0 24 24">
                <path d="M12 20.5c-3.8-2.4-7.7-5.5-8.8-8.7A5.2 5.2 0 0 1 8.3 5c1.7 0 2.9.8 3.7 2 0.8-1.2 2-2 3.7-2a5.2 5.2 0 0 1 5.1 6.8c-1.1 3.2-5 6.3-8.8 8.7Z"></path>
            </svg>
        `,
        comment: `
            <svg viewBox="0 0 24 24">
                <path d="M7 18.5 4.5 20V7.8A3.8 3.8 0 0 1 8.3 4h7.4a3.8 3.8 0 0 1 3.8 3.8v5.4a3.8 3.8 0 0 1-3.8 3.8H7Z"></path>
            </svg>
        `,
        save: `
            <svg viewBox="0 0 24 24">
                <path d="M7.5 4.5h9a1.5 1.5 0 0 1 1.5 1.5v13.5L12 16.2 6 19.5V6A1.5 1.5 0 0 1 7.5 4.5Z"></path>
            </svg>
        `,
        delete: `
            <svg viewBox="0 0 24 24">
                <path d="M5 7.5h14"></path>
                <path d="M9.5 4.5h5"></path>
                <path d="m7.5 7.5 1 11h7l1-11"></path>
                <path d="M10 11v5"></path>
                <path d="M14 11v5"></path>
            </svg>
        `,
        follow: `
            <svg viewBox="0 0 24 24">
                <path d="M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path>
                <path d="M4.5 19.5a6.5 6.5 0 0 1 10.7-4.9"></path>
                <path d="M18.5 10.5v7"></path>
                <path d="M15 14h7"></path>
            </svg>
        `,
        compose: `
            <svg viewBox="0 0 24 24">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
            </svg>
        `,
        edit: `
            <svg viewBox="0 0 24 24">
                <path d="M4.5 19.5h3.8l9.7-9.7a1.8 1.8 0 0 0 0-2.6l-1.2-1.2a1.8 1.8 0 0 0-2.6 0L4.5 15.7v3.8Z"></path>
                <path d="m12.8 6.8 4.4 4.4"></path>
            </svg>
        `,
        open: `
            <svg viewBox="0 0 24 24">
                <path d="M8 16 16.5 7.5"></path>
                <path d="M9 7.5h7.5V15"></path>
            </svg>
        `,
        reply: `
            <svg viewBox="0 0 24 24">
                <path d="m9 8-4.5 4L9 16"></path>
                <path d="M19.5 17v-1.5A5.5 5.5 0 0 0 14 10H4.5"></path>
            </svg>
        `,
        send: `
            <svg viewBox="0 0 24 24">
                <path d="m4.5 19.5 15-7.5-15-7.5 2.2 6.2 7.1 1.3-7.1 1.3-2.2 6.2Z"></path>
            </svg>
        `,
        close: `
            <svg viewBox="0 0 24 24">
                <path d="m7 7 10 10"></path>
                <path d="M17 7 7 17"></path>
            </svg>
        `,
        logout: `
            <svg viewBox="0 0 24 24">
                <path d="M10 5.5H7.5A1.5 1.5 0 0 0 6 7v10a1.5 1.5 0 0 0 1.5 1.5H10"></path>
                <path d="m13 15.5 4-3.5-4-3.5"></path>
                <path d="M16.8 12H9"></path>
            </svg>
        `,
        profile: `
            <svg viewBox="0 0 24 24">
                <path d="M12 11a3.8 3.8 0 1 0 0-7.6 3.8 3.8 0 0 0 0 7.6Z"></path>
                <path d="M4.5 19.5a7.5 7.5 0 0 1 15 0"></path>
            </svg>
        `,
        posts: `
            <svg viewBox="0 0 24 24">
                <rect x="4.5" y="4.5" width="15" height="15" rx="3"></rect>
                <path d="M8 9.5h8"></path>
                <path d="M8 13h8"></path>
                <path d="M8 16.5h5"></path>
            </svg>
        `,
        users: `
            <svg viewBox="0 0 24 24">
                <path d="M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11Z"></path>
                <path d="M16 10a2.6 2.6 0 1 0 0-5.2"></path>
                <path d="M3.8 19.5a5.7 5.7 0 0 1 10.4-2"></path>
                <path d="M14.5 18.5a4.7 4.7 0 0 1 5.7-3.6"></path>
            </svg>
        `,
        sparkles: `
            <svg viewBox="0 0 24 24">
                <path d="m12 4 1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7Z"></path>
                <path d="m18.5 4.5.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7Z"></path>
            </svg>
        `,
        pin: `
            <svg viewBox="0 0 24 24">
                <path d="M12 20c3.4-4 5.5-7 5.5-10a5.5 5.5 0 1 0-11 0c0 3 2.1 6 5.5 10Z"></path>
                <circle cx="12" cy="10" r="1.8"></circle>
            </svg>
        `,
        link: `
            <svg viewBox="0 0 24 24">
                <path d="M10 14 14 10"></path>
                <path d="M8.2 15.8 6.7 17.3a3.2 3.2 0 1 1-4.5-4.6l2.9-2.8a3.2 3.2 0 0 1 4.6 0"></path>
                <path d="m15.8 8.2 1.5-1.5a3.2 3.2 0 1 1 4.5 4.6l-2.9 2.8a3.2 3.2 0 0 1-4.6 0"></path>
            </svg>
        `,
        palette: `
            <svg viewBox="0 0 24 24">
                <path d="M12 4.5a7.5 7.5 0 0 0 0 15h1.6a1.9 1.9 0 0 0 0-3.8h-.6a2.6 2.6 0 0 1 0-5.2h1.5a4.5 4.5 0 1 0 0-9Z"></path>
                <circle cx="8.1" cy="9.2" r="1"></circle>
                <circle cx="11" cy="7.2" r="1"></circle>
                <circle cx="15" cy="7.9" r="1"></circle>
            </svg>
        `
    };

    return icons[name] || icons.open;
}

function renderMetricText(icon, text) {
    return `
        <span class="metric-chip">
            <span class="metric-chip-icon" aria-hidden="true">${renderIcon(icon)}</span>
            <span class="metric-chip-text">${escapeHtml(text)}</span>
        </span>
    `;
}

function getLikeActionClass(post) {
    const classes = ["icon-action", "icon-action--like"];

    if (post.isLiked) {
        classes.push("is-active");
    }

    if (state.ui.likeBurstPostIds?.[post.id]) {
        classes.push("is-bursting");
    }

    return classes.join(" ");
}

function renderPostSignalBadge(post) {
    if (!post?.recommendationBadge) {
        return "";
    }

    return `<span class="meta-pill meta-pill--signal meta-pill--${escapeHtml(post.recommendationBadge.tone)}">${escapeHtml(post.recommendationBadge.label)}</span>`;
}

function renderProfileIdentity(user, options = {}) {
    const avatarClass = options.avatarClass || "mini-avatar";
    const copyClass = options.copyClass || "card-copy";
    const className = options.className || "profile-link";
    const meta = options.meta ? `<span>${escapeHtml(options.meta)}</span>` : "";

    return `
        <button class="${className}" type="button" data-action="open-profile" data-user-id="${escapeHtml(user.id)}">
            ${renderAvatar(user, avatarClass)}
            <div class="${copyClass}">
                <strong>${escapeHtml(user.name)}</strong>
                ${meta}
            </div>
        </button>
    `;
}

function renderPeopleSection({ viewerId, users, kicker, title, text }) {
    if (!users.length) {
        return "";
    }

    return `
        <section class="section-shell people-section">
            <div class="section-head">
                <div>
                    <span class="section-kicker">${escapeHtml(kicker)}</span>
                    <h2>${escapeHtml(title)}</h2>
                    ${text ? `<p class="section-note">${escapeHtml(text)}</p>` : ""}
                </div>
            </div>
            <div class="people-grid">
                ${users.map((user) => renderUserCard(user, viewerId)).join("")}
            </div>
        </section>
    `;
}

function renderUserCard(user, viewerId) {
    const posts = getUserPosts(user.id);
    const latestPost = posts[0] || null;
    const isOwnProfile = user.id === viewerId;
    const isFollowed = !isOwnProfile && getFollowingIds(viewerId).includes(user.id);
    const websiteLabel = getWebsiteLabel(user.website);
    const topCategories = getTopUserCategories(user.id, 2);
    const creatorLabel = latestPost
        ? Date.now() - latestPost.createdAt <= 24 * 60 * 60 * 1000
            ? "Postando agora"
            : isFollowed
              ? "No seu radar"
              : "Criador ativo"
        : "Novo criador";

    return `
        <article class="user-card">
            <button class="user-card-cover" type="button" data-action="open-profile" data-user-id="${escapeHtml(user.id)}">
                <img src="${escapeAttribute(getProfileCover(user))}" alt="${escapeAttribute(user.name)}"${getCoverImageStyleAttribute(user)}>
            </button>
            <div class="user-card-body">
                <div class="user-card-head">
                    ${renderProfileIdentity(user, {
                        avatarClass: "mini-avatar",
                        copyClass: "profile-link-copy",
                        meta: `@${user.handle}`,
                        className: "profile-link"
                    })}
                    <span class="meta-pill meta-pill--signal meta-pill--spotlight user-card-label">${escapeHtml(creatorLabel)}</span>
                </div>
                <p class="user-card-bio">${escapeHtml(user.bio)}</p>
                <div class="user-card-stats">
                    <span class="meta-pill">${escapeHtml(formatMetricLabel(posts.length, "post", "posts"))}</span>
                    <span class="meta-pill">${escapeHtml(formatMetricLabel(getFollowersCount(user.id), "seguidor", "seguidores"))}</span>
                    <span class="meta-pill">${escapeHtml(latestPost ? `ativo ${timeAgo(latestPost.createdAt)}` : "perfil novo")}</span>
                    ${topCategories.map((category) => `<span class="meta-pill">${escapeHtml(category)}</span>`).join("")}
                    ${user.location ? `<span class="meta-pill">${escapeHtml(user.location)}</span>` : ""}
                    ${websiteLabel ? `<a class="meta-pill meta-link" href="${escapeAttribute(user.website)}" target="_blank" rel="noreferrer">${escapeHtml(websiteLabel)}</a>` : ""}
                </div>
                <div class="user-card-actions">
                    <button class="ghost-button" type="button" data-action="open-profile" data-user-id="${escapeHtml(user.id)}">
                        ${renderButtonContent("open", "Ver perfil")}
                    </button>
                    ${
                        isOwnProfile
                            ? `
                                <button class="primary-button" type="button" data-action="open-profile-editor">
                                    ${renderButtonContent("edit", "Editar")}
                                </button>
                            `
                            : `
                                <button
                                    class="follow-button ${isFollowed ? "is-active" : ""}"
                                    type="button"
                                    data-action="toggle-follow"
                                    data-user-id="${escapeHtml(user.id)}"
                                >
                                    ${renderButtonContent("follow", isFollowed ? "Seguindo" : "Seguir")}
                                </button>
                            `
                    }
                </div>
            </div>
        </article>
    `;
}

function renderProfilePresenceSection(profileUser, currentUser, isOwnProfile, profileTheme, highlightPost) {
    const topCategories = getTopUserCategories(profileUser.id, 3);
    const savedCount = isOwnProfile ? getSavedPosts(profileUser.id).length : 0;
    const followers = getFollowersCount(profileUser.id);
    const comments = getUserCommentsCount(profileUser.id);
    const latestPost = getUserPosts(profileUser.id)[0] || null;

    return `
        <section class="profile-presence-grid">
            <article class="profile-presence-card">
                <span class="section-kicker">Identidade</span>
                <div class="profile-presence-copy">
                    <strong>${escapeHtml(profileTheme.label)}</strong>
                    <span>${escapeHtml(topCategories.length ? topCategories.join(" / ") : "Perfil autoral em construcao")}</span>
                </div>
                <div class="profile-presence-tags">
                    ${topCategories.length ? topCategories.map((category) => `<span class="meta-pill">${escapeHtml(category)}</span>`).join("") : `<span class="meta-pill">Artista visual</span>`}
                </div>
            </article>
            <article class="profile-presence-card">
                <span class="section-kicker">${isOwnProfile ? "Colecoes" : "Destaque publico"}</span>
                <div class="profile-presence-copy">
                    <strong>${escapeHtml(isOwnProfile ? formatCompact.format(savedCount) : highlightPost ? highlightPost.title : "Sem destaque")}</strong>
                    <span>${escapeHtml(isOwnProfile ? "obras e referencias guardadas para voltar depois." : latestPost ? `ativo ${timeAgo(latestPost.createdAt)}` : "perfil novo na rede.")}</span>
                </div>
                <div class="profile-presence-tags">
                    <span class="meta-pill">${escapeHtml(isOwnProfile ? `${formatCompact.format(savedCount)} colecoes` : `${formatCompact.format(getUserPosts(profileUser.id).length)} posts`)}</span>
                    ${
                        highlightPost
                            ? `<span class="meta-pill">${escapeHtml(highlightPost.category)}</span>`
                            : ""
                    }
                </div>
            </article>
            <article class="profile-presence-card">
                <span class="section-kicker">Movimento</span>
                <div class="profile-presence-copy">
                    <strong>${escapeHtml(formatCompact.format(followers))} seguidores</strong>
                    <span>${escapeHtml(`${formatCompact.format(comments)} comentarios publicados e perfil vivendo em publico.`)}</span>
                </div>
                <div class="profile-presence-tags">
                    <span class="meta-pill">${escapeHtml(`${formatCompact.format(getFollowingCount(profileUser.id))} seguindo`)}</span>
                    ${currentUser.id !== profileUser.id ? `<span class="meta-pill">${escapeHtml(isOwnProfile ? "Seu espaco" : "Descoberta ativa")}</span>` : `<span class="meta-pill">Painel do artista</span>`}
                </div>
            </article>
        </section>
    `;
}

function renderProfileConnectionsSection(profileUser, viewerId) {
    const activeView = state.ui.profileConnectionsView;

    if (!["followers", "following"].includes(activeView)) {
        return "";
    }

    const users =
        activeView === "followers"
            ? getFollowersOfUser(profileUser.id).map((userId) => getUserById(userId)).filter(Boolean)
            : getFollowingIds(profileUser.id).map((userId) => getUserById(userId)).filter(Boolean);
    const title = activeView === "followers" ? "Seguidores" : "Seguindo";
    const subtitle =
        activeView === "followers"
            ? "Quem acompanha esse perfil e ajuda a movimentar o alcance das obras."
            : "As contas que essa pessoa acompanha para descobrir, salvar e conversar sobre arte.";

    return `
        <section class="section-shell profile-connections-panel">
            <div class="section-head">
                <div>
                    <span class="section-kicker">${escapeHtml(title)}</span>
                    <h2>${escapeHtml(`${formatCompact.format(users.length)} ${activeView === "followers" ? "pessoas" : "contas"}`)}</h2>
                    <p class="section-note">${escapeHtml(subtitle)}</p>
                </div>
                <button class="ghost-button" type="button" data-action="toggle-profile-connections" data-connection-view="${escapeHtml(activeView)}">
                    ${renderButtonContent("close", "Fechar")}
                </button>
            </div>
            <div class="profile-connection-list">
                ${
                    users.length
                        ? users.map((user) => renderProfileConnectionCard(user, viewerId)).join("")
                        : `
                            <article class="profile-connection-card profile-connection-card--empty">
                                <div class="card-copy">
                                    <strong>Nada por aqui ainda.</strong>
                                    <span>Assim que a rede desse perfil crescer, as contas aparecem aqui.</span>
                                </div>
                            </article>
                        `
                }
            </div>
        </section>
    `;
}

function renderProfileConnectionCard(user, viewerId) {
    const isOwnProfile = user.id === viewerId;
    const isFollowed = !isOwnProfile && getFollowingIds(viewerId).includes(user.id);
    const latestPost = getUserPosts(user.id)[0] || null;

    return `
        <article class="profile-connection-card">
            ${renderProfileIdentity(user, {
                avatarClass: "mini-avatar",
                copyClass: "profile-link-copy",
                meta: `@${user.handle}`,
                className: "profile-link profile-link--connection"
            })}
            <p>${escapeHtml(user.bio)}</p>
            <div class="profile-connection-meta">
                <span class="meta-pill">${escapeHtml(formatMetricLabel(getUserPosts(user.id).length, "post", "posts"))}</span>
                <span class="meta-pill">${escapeHtml(formatMetricLabel(getFollowersCount(user.id), "seguidor", "seguidores"))}</span>
                ${latestPost ? `<span class="meta-pill">${escapeHtml(`ativo ${timeAgo(latestPost.createdAt)}`)}</span>` : ""}
            </div>
            <div class="profile-connection-actions">
                <button class="ghost-button" type="button" data-action="open-profile" data-user-id="${escapeHtml(user.id)}">
                    ${renderButtonContent("open", "Perfil")}
                </button>
                ${
                    isOwnProfile
                        ? ""
                        : `
                            <button
                                class="follow-button ${isFollowed ? "is-active" : ""}"
                                type="button"
                                data-action="toggle-follow"
                                data-user-id="${escapeHtml(user.id)}"
                            >
                                ${renderButtonContent("follow", isFollowed ? "Seguindo" : "Seguir")}
                            </button>
                        `
                }
            </div>
        </article>
    `;
}

function renderFeedCommentPreview(post) {
    const previewComments = buildCommentThreads(post.comments).slice(0, 2);

    if (!previewComments.length) {
        return "";
    }

    return previewComments
        .map((comment) => {
            const author = getUserById(comment.authorId);

            if (!author) {
                return "";
            }

            return `
                <div class="feed-comment-preview">
                    <button class="profile-link" type="button" data-action="open-profile" data-user-id="${escapeHtml(author.id)}">
                        ${renderAvatar(author, "mini-avatar")}
                    </button>
                    <div class="feed-comment-copy">
                        <strong>${escapeHtml(author.name)}</strong>
                        <p>${escapeHtml(comment.text)}</p>
                        ${
                            comment.replies.length
                                ? `<span class="feed-comment-meta">${escapeHtml(formatMetricLabel(comment.replies.length, "resposta", "respostas"))}</span>`
                                : ""
                        }
                    </div>
                </div>
            `;
        })
        .join("");
}

function getPostActivityEntries(post) {
    if (!post?.author?.id) {
        return [];
    }

    const seen = new Set();

    return (state.db.activitiesByUser[post.author.id] || [])
        .filter((entry) => entry.postId === post.id && ["like", "comment", "reply"].includes(entry.type))
        .sort((a, b) => b.createdAt - a.createdAt)
        .filter((entry) => {
            const key = entry.commentId || `${entry.type}:${entry.actorUserId}:${Math.round(entry.createdAt / 60000)}`;

            if (seen.has(key)) {
                return false;
            }

            seen.add(key);
            return true;
        });
}

function createSocialPulse(post) {
    const liveEntries = getPostActivityEntries(post);
    const recentEntries = liveEntries.filter((entry) => Date.now() - entry.createdAt <= 24 * 60 * 60 * 1000);
    const actorIds = uniqueList(recentEntries.map((entry) => entry.actorUserId).filter((userId) => userId !== post.author.id)).slice(0, 4);
    const actors = actorIds.map((userId) => getUserById(userId)).filter(Boolean);
    const commentCount = recentEntries.filter((entry) => entry.type === "comment" || entry.type === "reply").length;
    const likeCount = recentEntries.filter((entry) => entry.type === "like").length;
    const activityCount = recentEntries.length;
    let title = "Fluxo social";
    let body = `Publicado em ${post.category} · ${timeAgo(post.createdAt)}`;

    if (commentCount >= 2) {
        title = "Conversa puxando o post";
        body = `${formatMetricLabel(commentCount, "comentario recente", "comentarios recentes")} nas ultimas horas.`;
    } else if (activityCount >= 3) {
        title = "Movimento vivo agora";
        body = `${formatMetricLabel(activityCount, "interacao recente", "interacoes recentes")} mantendo a timeline ativa.`;
    } else if (likeCount >= 2) {
        title = "Entrando no radar";
        body = `${formatMetricLabel(likeCount, "curtida nova", "curtidas novas")} ajudando o post a subir.`;
    } else if (post.commentsCount) {
        title = "Comentarios abertos";
        body = `${formatMetricLabel(post.commentsCount, "comentario", "comentarios")} para entrar na conversa.`;
    } else if (post.savesCount) {
        title = "Salvo para voltar depois";
        body = `${formatMetricLabel(post.savesCount, "salvo", "salvos")} em colecoes da comunidade.`;
    }

    return {
        actors,
        activityCount,
        commentCount,
        likeCount,
        title,
        body
    };
}

function renderActorStack(users, extraCount = 0) {
    if (!users.length && !extraCount) {
        return "";
    }

    return `
        <div class="actor-stack">
            ${users
                .slice(0, 3)
                .map(
                    (user, index) => `
                        <button
                            class="actor-stack-avatar"
                            type="button"
                            data-action="open-profile"
                            data-user-id="${escapeHtml(user.id)}"
                            style="--actor-index:${index};"
                            aria-label="Abrir perfil de ${escapeAttribute(user.name)}"
                        >
                            ${renderAvatar(user, "mini-avatar")}
                        </button>
                    `
                )
                .join("")}
            ${
                extraCount > 0
                    ? `<span class="actor-stack-more">+${escapeHtml(String(extraCount))}</span>`
                    : ""
            }
        </div>
    `;
}

function getTopUserCategories(userId, limit = 3) {
    const counts = new Map();

    getUserPosts(userId).forEach((post) => {
        counts.set(post.category, (counts.get(post.category) || 0) + 1);
    });

    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([category]) => category);
}

function renderHomeTimelineSection(posts) {
    if (!posts.length) {
        return "";
    }

    return `
        <section class="section-shell section-shell--timeline">
            <div class="section-head">
                <div>
                    <span class="section-kicker">Timeline</span>
                    <h2>Agora na rede</h2>
                    <p class="section-note">Uma leitura mais social do que esta rendendo conversa, salvamentos e descoberta sem perder a elegancia da curadoria.</p>
                </div>
            </div>
            <div class="art-grid art-grid--home-flow">
                ${posts
                    .map((post, index) =>
                        renderArtCard(post, {
                            home: true,
                            featured: index < 2,
                            main: index === 0
                        })
                    )
                    .join("")}
            </div>
        </section>
    `;
}

function renderPhotoGallerySection(posts) {
    const photoPosts = posts.filter((post) => sanitizeImageSource(post.imageData || ""));

    if (!photoPosts.length) {
        return renderEmptyState({
            kicker: "Fotos",
            title: "Nenhuma imagem entrou nessa selecao.",
            subtitle: "Quando houver obras com imagem nesse recorte, elas aparecem aqui.",
            text: "O modo Fotos mostra uma leitura mais limpa, focada so nas artes visuais.",
            action: "",
            actionLabel: null
        });
    }

    return `
        <section class="section-shell section-shell--gallery">
            <div class="photo-stream">
                ${photoPosts
                    .map((post) => renderPhotoOnlyCard(post))
                    .join("")}
            </div>
        </section>
    `;
}

function renderPhotoOnlyCard(post) {
    return `
        <article
            class="photo-stream-card ${getPostFontClass(post)}"
            data-card-open="true"
            data-post-id="${escapeHtml(post.id)}"
            tabindex="0"
            role="button"
            aria-label="Abrir ${escapeAttribute(post.title)}"
            ${getPostVisualStyleAttribute(post)}
        >
            <div class="photo-stream-media">
                ${renderPostMediaVisual(post, {
                    frameClass: "photo-stream-media-stack",
                    imageClass: "photo-stream-image",
                    stickerClass: "post-sticker--gallery"
                })}
                <div class="photo-stream-actions">
                    <button
                        class="${getLikeActionClass(post)} photo-stream-action"
                        type="button"
                        data-action="toggle-like"
                        data-post-id="${escapeHtml(post.id)}"
                        aria-label="${post.isLiked ? "Descurtir" : "Curtir"} ${escapeAttribute(post.title)}"
                    >
                        <span class="icon-action-symbol" aria-hidden="true">${renderIcon("like")}</span>
                    </button>
                    <button
                        class="icon-action photo-stream-action ${post.isSaved ? "is-active" : ""}"
                        type="button"
                        data-action="toggle-save"
                        data-post-id="${escapeHtml(post.id)}"
                        aria-label="${post.isSaved ? "Remover dos salvos" : "Salvar"} ${escapeAttribute(post.title)}"
                    >
                        <span class="icon-action-symbol" aria-hidden="true">${renderIcon("save")}</span>
                    </button>
                </div>
            </div>
        </article>
    `;
}

function renderArtCard(post, options = {}) {
    const classes = ["art-card"];
    const isHomeCard = Boolean(options.home);
    const visualStyle = getPostVisualStyleAttribute(post);

    if (options.featured) {
        classes.push("art-card--featured");
    }

    if (options.main) {
        classes.push("is-main");
    }

    if (post.recommendationBadge) {
        classes.push("has-signal");
    }

    if (isHomeCard) {
        classes.push("art-card--home");
    }

    classes.push(getPostFontClass(post));

    return `
        <article
            class="${classes.join(" ")}"
            data-card-open="true"
            data-post-id="${escapeHtml(post.id)}"
            tabindex="0"
            role="button"
            aria-label="Abrir ${escapeAttribute(post.title)}"
            ${visualStyle}
        >
            <div class="art-cover">
                ${renderPostMediaVisual(post, {
                    frameClass: "art-cover-media",
                    imageClass: "art-cover-image",
                    stickerClass: "post-sticker--card"
                })}
                <div class="art-cover-top">
                    <div class="art-cover-badges">
                        <span class="meta-pill">${escapeHtml(post.category)}</span>
                        ${renderPostSignalBadge(post)}
                    </div>
                    <span class="art-cover-meta">${escapeHtml(timeAgo(post.createdAt))}</span>
                </div>
                <div class="art-cover-bottom">
                    <div class="art-cover-copy">
                        <strong>${escapeHtml(post.title)}</strong>
                        <span>@${escapeHtml(post.author.handle)}</span>
                    </div>
                </div>
            </div>
            <div class="art-meta">
                ${renderProfileIdentity(post.author, {
                    avatarClass: "mini-avatar",
                    copyClass: "profile-link-copy",
                    meta: `@${post.author.handle}`,
                    className: "profile-link profile-link--card"
                })}
                <p class="art-caption">${escapeHtml(truncateText(post.caption || "Sem legenda por enquanto.", options.main ? 148 : isHomeCard ? 116 : 104))}</p>
                <div class="meta-line">
                    <span class="meta-pill">${escapeHtml(timeAgo(post.createdAt))}</span>
                    ${(post.tags || [])
                        .slice(0, 3)
                        .map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`)
                        .join("")}
                </div>
                <div class="card-actions card-actions--minimal ${isHomeCard ? "card-actions--social" : ""}">
                    <button
                        class="${getLikeActionClass(post)}"
                        type="button"
                        data-action="toggle-like"
                        data-post-id="${escapeHtml(post.id)}"
                        aria-label="${post.isLiked ? "Descurtir" : "Curtir"} ${escapeAttribute(post.title)}"
                    >
                        <span class="icon-action-symbol" aria-hidden="true">${renderIcon("like")}</span>
                        <span class="icon-action-count">${escapeHtml(formatCompact.format(post.likesCount))}</span>
                    </button>
                    <button
                        class="icon-action"
                        type="button"
                        data-action="focus-post-comments"
                        data-post-id="${escapeHtml(post.id)}"
                        aria-label="Comentar em ${escapeAttribute(post.title)}"
                    >
                        <span class="icon-action-symbol" aria-hidden="true">${renderIcon("comment")}</span>
                        <span class="icon-action-count">${escapeHtml(formatCompact.format(post.commentsCount))}</span>
                    </button>
                    <button
                        class="icon-action ${post.isSaved ? "is-active" : ""}"
                        type="button"
                        data-action="toggle-save"
                        data-post-id="${escapeHtml(post.id)}"
                        aria-label="${post.isSaved ? "Remover dos salvos" : "Salvar"} ${escapeAttribute(post.title)}"
                    >
                        <span class="icon-action-symbol" aria-hidden="true">${renderIcon("save")}</span>
                        <span class="icon-action-count">${escapeHtml(formatCompact.format(post.savesCount))}</span>
                    </button>
                </div>
            </div>
        </article>
    `;
}

function renderFeedCard(post, options = {}) {
    const commentThreads = buildCommentThreads(post.comments).slice(0, 3);
    const isInlineOpen = state.ui.inlineCommentPostId === post.id;
    const replyTarget = isInlineOpen && state.ui.replyingToCommentId ? getCommentById(post.id, state.ui.replyingToCommentId) : null;
    const replyTargetAuthor = replyTarget ? getUserById(replyTarget.authorId) : null;
    const socialPulse = post.socialPulse || createSocialPulse(post);
    const socialActors = socialPulse.actors || [];
    const extraActorCount = Math.max(0, socialPulse.activityCount - socialActors.length);
    const socialBody = (socialPulse.body || "").replaceAll("Â·", "-");
    const commentPanelTitle = "Comentarios";
    const visualStyle = getPostVisualStyleAttribute(post);
    const commentPreview = renderFeedCommentPreview(post);

    return `
        <article
            class="feed-card ${getPostFontClass(post)} ${isInlineOpen ? "is-comments-open" : ""} ${post.recommendationBadge ? "has-signal" : ""} ${options.highlight ? "feed-card--highlight" : ""}"
            data-card-open="true"
            data-post-id="${escapeHtml(post.id)}"
            tabindex="0"
            role="button"
            aria-label="Abrir ${escapeAttribute(post.title)}"
            ${visualStyle}
        >
            <div class="feed-card-head">
                <div class="feed-meta">
                    ${renderProfileIdentity(post.author, {
                        avatarClass: "mini-avatar",
                        copyClass: "profile-link-copy",
                        meta: `@${post.author.handle}`,
                        className: "profile-link profile-link--feed"
                    })}
                    <div class="feed-head-badges">
                        ${renderPostSignalBadge(post)}
                        <span class="meta-pill">${escapeHtml(post.category)}</span>
                        <span class="meta-pill">${escapeHtml(timeAgo(post.createdAt))}</span>
                    </div>
                </div>
                <div class="feed-head-side">
                    ${
                        post.author.id !== getCurrentUser().id
                            ? `
                                <button
                                    class="follow-button ${post.isFollowed ? "is-active" : ""}"
                                    type="button"
                                    data-action="toggle-follow"
                                    data-user-id="${escapeHtml(post.author.id)}"
                                >
                                    ${renderButtonContent("follow", post.isFollowed ? "Seguindo" : "Seguir")}
                                </button>
                            `
                            : `<span class="meta-pill">Seu post</span>`
                    }
                </div>
            </div>
            <div class="feed-layout">
                <div class="feed-image">
                    ${renderPostMediaVisual(post, {
                        frameClass: "feed-image-media",
                        imageClass: "feed-image-asset",
                        stickerClass: "post-sticker--feed"
                    })}
                </div>
                <div class="feed-side">
                    <div class="feed-copy feed-copy--headline">
                        <strong>${escapeHtml(post.title)}</strong>
                    </div>
                    ${post.caption ? `<p class="feed-caption">${escapeHtml(post.caption)}</p>` : ""}
                    ${
                        post.tags?.length
                            ? `
                                <div class="meta-line">
                                    ${post.tags
                                        .slice(0, 3)
                                        .map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`)
                                        .join("")}
                                </div>
                            `
                            : ""
                    }
                </div>
            </div>
            <div class="feed-actions">
                <div class="feed-actions-left feed-actions-left--minimal">
                    <button
                        class="${getLikeActionClass(post)}"
                        type="button"
                        data-action="toggle-like"
                        data-post-id="${escapeHtml(post.id)}"
                        aria-label="${post.isLiked ? "Descurtir" : "Curtir"} ${escapeAttribute(post.title)}"
                    >
                        <span class="icon-action-symbol" aria-hidden="true">${renderIcon("like")}</span>
                        <span class="icon-action-count">${escapeHtml(formatCompact.format(post.likesCount))}</span>
                    </button>
                    <button
                        class="icon-action ${isInlineOpen ? "is-active" : ""}"
                        type="button"
                        data-action="toggle-inline-comments"
                        data-post-id="${escapeHtml(post.id)}"
                        aria-label="Abrir comentarios de ${escapeAttribute(post.title)}"
                    >
                        <span class="icon-action-symbol" aria-hidden="true">${renderIcon("comment")}</span>
                        <span class="icon-action-count">${escapeHtml(formatCompact.format(post.commentsCount))}</span>
                    </button>
                    <button
                        class="icon-action ${post.isSaved ? "is-active" : ""}"
                        type="button"
                        data-action="toggle-save"
                        data-post-id="${escapeHtml(post.id)}"
                        aria-label="${post.isSaved ? "Remover dos salvos" : "Salvar"} ${escapeAttribute(post.title)}"
                    >
                        <span class="icon-action-symbol" aria-hidden="true">${renderIcon("save")}</span>
                        <span class="icon-action-count">${escapeHtml(formatCompact.format(post.savesCount))}</span>
                    </button>
                    ${
                        post.isOwner
                            ? `
                                <button
                                    class="icon-action icon-action--danger"
                                    type="button"
                                    data-action="delete-post"
                                    data-post-id="${escapeHtml(post.id)}"
                                    aria-label="Remover ${escapeAttribute(post.title)}"
                                >
                                    <span class="icon-action-symbol" aria-hidden="true">${renderIcon("delete")}</span>
                                </button>
                            `
                            : ""
                    }
                </div>
                <span class="activity-meta">${escapeHtml(post.category)} · ${escapeHtml(timeAgo(post.createdAt))}</span>
            </div>
            <div class="feed-comments-preview ${isInlineOpen ? "is-open" : commentPreview ? "is-peek" : ""}">
                ${
                    isInlineOpen
                        ? `
                            <div class="feed-panel-head">
                                <strong>${escapeHtml(commentPanelTitle)}</strong>
                                <div class="feed-comments-head-actions">
                                    <span>${escapeHtml(formatMetricLabel(post.commentsCount, "mensagem", "mensagens"))}</span>
                                    <button class="comment-inline-action" type="button" data-action="close-inline-comments">
                                        Fechar
                                    </button>
                                </div>
                            </div>
                            <div class="feed-comments-thread">
                                ${
                                    commentThreads.length
                                        ? commentThreads.map((comment) => renderInlineComment(comment, post)).join("")
                                        : `
                                            <div class="feed-comments-empty">
                                                <span>Seja a primeira pessoa a puxar essa conversa.</span>
                                            </div>
                                        `
                                }
                            </div>
                            <form
                                class="comment-form comment-form--inline"
                                data-post-id="${escapeHtml(post.id)}"
                                data-reply-to-comment-id="${escapeHtml(replyTarget?.id || "")}"
                            >
                                ${
                                    replyTarget && replyTargetAuthor
                                        ? `
                                            <div class="comment-form-head">
                                                <div class="card-copy">
                                                    <strong>Respondendo a @${escapeHtml(replyTargetAuthor.handle)}</strong>
                                                    <span>A resposta entra embaixo do comentario para manter a leitura clara.</span>
                                                </div>
                                                <button class="ghost-button" type="button" data-action="cancel-comment-reply">
                                                    ${renderButtonContent("close", "Cancelar")}
                                                </button>
                                            </div>
                                        `
                                        : ""
                                }
                                <div class="comment-form-inline-row">
                                    <input
                                        name="comment"
                                        type="text"
                                        maxlength="220"
                                        placeholder="${escapeAttribute(replyTargetAuthor ? `Responder a @${replyTargetAuthor.handle}` : "Comente sem sair do feed")}"
                                        required
                                    >
                                    <button class="primary-button comment-submit-button" type="submit" aria-label="${replyTargetAuthor ? "Responder" : "Comentar"}">
                                        <span class="button-symbol" aria-hidden="true">${renderIcon(replyTargetAuthor ? "reply" : "send")}</span>
                                    </button>
                                </div>
                            </form>
                        `
                        : commentPreview
                }
            </div>
        </article>
    `;
}

function renderDiscussionCard(post, options = {}) {
    const commentThreads = buildCommentThreads(post.comments).slice(0, 3);
    const isInlineOpen = state.ui.inlineCommentPostId === post.id;
    const replyTarget = isInlineOpen && state.ui.replyingToCommentId ? getCommentById(post.id, state.ui.replyingToCommentId) : null;
    const replyTargetAuthor = replyTarget ? getUserById(replyTarget.authorId) : null;
    const commentPreview = renderFeedCommentPreview(post);
    const leadText = post.caption || post.title || "Sem texto por enquanto.";
    const hasCustomTitle = Boolean(post.title && post.caption && post.title.trim() && post.title.trim() !== post.caption.trim());

    return `
        <article
            class="discussion-card ${getPostFontClass(post)} ${isInlineOpen ? "is-comments-open" : ""} ${options.highlight ? "discussion-card--highlight" : ""}"
            data-card-open="true"
            data-post-id="${escapeHtml(post.id)}"
            tabindex="0"
            role="button"
            aria-label="Abrir ${escapeAttribute(post.title)}"
            ${getPostVisualStyleAttribute(post)}
        >
            <div class="discussion-card-head">
                <div class="discussion-meta">
                    ${renderProfileIdentity(post.author, {
                        avatarClass: "mini-avatar",
                        copyClass: "profile-link-copy",
                        meta: `@${post.author.handle}`,
                        className: "profile-link profile-link--discussion"
                    })}
                    <div class="discussion-meta-line">
                        <span>${escapeHtml(timeAgo(post.createdAt))}</span>
                        <span>·</span>
                        <span>${escapeHtml(post.category)}</span>
                        ${renderPostSignalBadge(post)}
                    </div>
                </div>
                ${
                    post.author.id !== getCurrentUser().id
                        ? `
                            <button
                                class="follow-button ${post.isFollowed ? "is-active" : ""}"
                                type="button"
                                data-action="toggle-follow"
                                data-user-id="${escapeHtml(post.author.id)}"
                            >
                                ${renderButtonContent("follow", post.isFollowed ? "Seguindo" : "Seguir")}
                            </button>
                        `
                        : `<span class="meta-pill">Sua thread</span>`
                }
            </div>
            <div class="discussion-card-body">
                ${hasCustomTitle ? `<span class="discussion-kicker">${escapeHtml(post.title)}</span>` : ""}
                <p class="discussion-text">${escapeHtml(leadText)}</p>
                ${
                    post.imageData
                        ? `
                            <div class="discussion-media">
                                ${renderPostMediaVisual(post, {
                                    frameClass: "discussion-media-stack",
                                    imageClass: "discussion-media-image",
                                    stickerClass: "post-sticker--discussion"
                                })}
                            </div>
                        `
                        : ""
                }
                ${
                    post.tags?.length
                        ? `
                            <div class="discussion-tags">
                                ${post.tags
                                    .slice(0, 5)
                                    .map(
                                        (tag) => `
                                            <button class="discussion-tag" type="button" data-action="apply-topic-filter" data-topic="${escapeHtml(tag)}">
                                                ${escapeHtml(tag)}
                                            </button>
                                        `
                                    )
                                    .join("")}
                            </div>
                        `
                        : ""
                }
            </div>
            <div class="discussion-actions">
                <div class="feed-actions-left feed-actions-left--minimal">
                    <button
                        class="${getLikeActionClass(post)}"
                        type="button"
                        data-action="toggle-like"
                        data-post-id="${escapeHtml(post.id)}"
                        aria-label="${post.isLiked ? "Descurtir" : "Curtir"} ${escapeAttribute(post.title)}"
                    >
                        <span class="icon-action-symbol" aria-hidden="true">${renderIcon("like")}</span>
                        <span class="icon-action-count">${escapeHtml(formatCompact.format(post.likesCount))}</span>
                    </button>
                    <button
                        class="icon-action ${isInlineOpen ? "is-active" : ""}"
                        type="button"
                        data-action="toggle-inline-comments"
                        data-post-id="${escapeHtml(post.id)}"
                        aria-label="Abrir comentarios de ${escapeAttribute(post.title)}"
                    >
                        <span class="icon-action-symbol" aria-hidden="true">${renderIcon("comment")}</span>
                        <span class="icon-action-count">${escapeHtml(formatCompact.format(post.commentsCount))}</span>
                    </button>
                    <button
                        class="icon-action ${post.isSaved ? "is-active" : ""}"
                        type="button"
                        data-action="toggle-save"
                        data-post-id="${escapeHtml(post.id)}"
                        aria-label="${post.isSaved ? "Remover dos salvos" : "Salvar"} ${escapeAttribute(post.title)}"
                    >
                        <span class="icon-action-symbol" aria-hidden="true">${renderIcon("save")}</span>
                        <span class="icon-action-count">${escapeHtml(formatCompact.format(post.savesCount))}</span>
                    </button>
                </div>
                <span class="activity-meta">${escapeHtml(formatMetricLabel(post.commentsCount, "comentario", "comentarios"))}</span>
            </div>
            <div class="feed-comments-preview ${isInlineOpen ? "is-open" : commentPreview ? "is-peek" : ""}">
                ${
                    isInlineOpen
                        ? `
                            <div class="feed-panel-head">
                                <strong>Respostas</strong>
                                <div class="feed-comments-head-actions">
                                    <span>${escapeHtml(formatMetricLabel(post.commentsCount, "mensagem", "mensagens"))}</span>
                                    <button class="comment-inline-action" type="button" data-action="close-inline-comments">
                                        Fechar
                                    </button>
                                </div>
                            </div>
                            <div class="feed-comments-thread">
                                ${
                                    commentThreads.length
                                        ? commentThreads.map((comment) => renderInlineComment(comment, post)).join("")
                                        : `
                                            <div class="feed-comments-empty">
                                                <span>Seja a primeira pessoa a responder essa thread.</span>
                                            </div>
                                        `
                                }
                            </div>
                            <form
                                class="comment-form comment-form--inline"
                                data-post-id="${escapeHtml(post.id)}"
                                data-reply-to-comment-id="${escapeHtml(replyTarget?.id || "")}"
                            >
                                ${
                                    replyTarget && replyTargetAuthor
                                        ? `
                                            <div class="comment-form-head">
                                                <div class="card-copy">
                                                    <strong>Respondendo a @${escapeHtml(replyTargetAuthor.handle)}</strong>
                                                    <span>A resposta entra embaixo do comentario para manter a thread limpa.</span>
                                                </div>
                                                <button class="ghost-button" type="button" data-action="cancel-comment-reply">
                                                    ${renderButtonContent("close", "Cancelar")}
                                                </button>
                                            </div>
                                        `
                                        : ""
                                }
                                <div class="comment-form-inline-row">
                                    <input
                                        name="comment"
                                        type="text"
                                        maxlength="220"
                                        placeholder="${escapeAttribute(replyTargetAuthor ? `Responder a @${replyTargetAuthor.handle}` : "Escreva sua resposta")}">
                                    <button class="primary-button comment-submit-button" type="submit" aria-label="${replyTargetAuthor ? "Responder" : "Comentar"}">
                                        <span class="button-symbol" aria-hidden="true">${renderIcon(replyTargetAuthor ? "reply" : "send")}</span>
                                    </button>
                                </div>
                            </form>
                        `
                        : commentPreview
                }
            </div>
        </article>
    `;
}

function renderActivityCard(entry) {
    const actor = getUserById(entry.actorUserId) || getCurrentUser();
    const post = entry.postId ? getPostById(entry.postId) : null;
    const descriptor = describeActivity(entry, actor, post);

    return `
        <article class="activity-card">
            <div class="activity-row">
                <div class="comment-row">
                    ${renderProfileIdentity(actor, {
                        avatarClass: "mini-avatar",
                        copyClass: "profile-link-copy",
                        meta: `@${actor.handle}`,
                        className: "profile-link profile-link--activity"
                    })}
                    <div class="activity-copy">
                        <strong>${escapeHtml(descriptor.title)}</strong>
                        <span>${escapeHtml(descriptor.subtitle)}</span>
                    </div>
                </div>
                <span class="activity-meta">${escapeHtml(timeAgo(entry.createdAt))}</span>
            </div>
            <p>${escapeHtml(descriptor.body)}</p>
            ${
                post
                    ? `
                        <div class="modal-actions">
                            <button class="ghost-button" type="button" data-action="open-post" data-post-id="${escapeHtml(post.id)}">
                                ${renderButtonContent("open", "Abrir post")}
                            </button>
                        </div>
                    `
                    : ""
            }
        </article>
    `;
}

function renderEmptyState({ kicker, title, subtitle, text, action, actionLabel }) {
    return `
        <section class="saved-empty">
            <span class="section-kicker">${escapeHtml(kicker)}</span>
            <div class="card-copy">
                <strong>${escapeHtml(title)}</strong>
                <span>${escapeHtml(subtitle)}</span>
            </div>
            <p>${escapeHtml(text)}</p>
            ${
                action && actionLabel
                    ? `<button class="primary-button" type="button" data-action="${escapeHtml(action)}">${renderButtonContent("compose", actionLabel)}</button>`
                    : ""
            }
        </section>
    `;
}

function renderPostModal() {
    const currentUser = getCurrentUser();
    const post =
        currentUser && state.ui.postModalId
            ? decoratePostForViewer(
                  toPostView(getPostById(state.ui.postModalId), currentUser.id),
                  createRecommendationContext(currentUser.id)
              )
            : null;
    const isOpen = Boolean(post);

    postModal.classList.toggle("is-open", isOpen);

    if (!post) {
        postModalContent.innerHTML = "";
        syncBodyModalState();
        return;
    }

    const commentThreads = buildCommentThreads(post.comments);
    const replyTarget = state.ui.replyingToCommentId ? getCommentById(post.id, state.ui.replyingToCommentId) : null;
    const replyTargetAuthor = replyTarget ? getUserById(replyTarget.authorId) : null;
    const modalStamp = formatPostStamp(post.createdAt);
    const visualStyle = getPostVisualStyleAttribute(post);

    postModalContent.innerHTML = `
        <div class="post-modal-layout post-modal-layout--editorial">
            <button class="icon-button modal-close modal-close--floating" type="button" data-action="close-post-modal" aria-label="Fechar post">
                <span class="button-symbol" aria-hidden="true">${renderIcon("close")}</span>
            </button>
            <section class="modal-post-card ${getPostFontClass(post)}"${visualStyle}>
                <div class="modal-post-head">
                    <div class="modal-post-profile">
                        ${renderProfileIdentity(post.author, {
                            avatarClass: "mini-avatar",
                            copyClass: "profile-link-copy",
                            meta: `@${post.author.handle} - ${modalStamp}`,
                            className: "profile-link profile-link--modal"
                        })}
                        <div class="modal-post-meta">
                            <span class="meta-pill">${escapeHtml(post.category)}</span>
                            ${renderPostSignalBadge(post)}
                        </div>
                    </div>
                    <div class="modal-post-head-actions">
                        ${
                            post.author.id !== currentUser.id
                                ? `
                                    <button
                                        class="follow-button ${post.isFollowed ? "is-active" : ""}"
                                        type="button"
                                        data-action="toggle-follow"
                                        data-user-id="${escapeHtml(post.author.id)}"
                                    >
                                        ${renderButtonContent("follow", post.isFollowed ? "Seguindo" : "Seguir")}
                                    </button>
                                `
                                : `
                                    <button
                                        class="icon-action icon-action--danger"
                                        type="button"
                                        data-action="delete-post"
                                        data-post-id="${escapeHtml(post.id)}"
                                        aria-label="Remover ${escapeAttribute(post.title)}"
                                    >
                                        <span class="icon-action-symbol" aria-hidden="true">${renderIcon("delete")}</span>
                                    </button>
                                `
                        }
                    </div>
                </div>
                <div class="modal-post-copy-shell">
                    <div class="modal-copy modal-copy--editorial">
                        <h2>${escapeHtml(post.title)}</h2>
                        <p>${escapeHtml(post.caption || "Sem legenda.")}</p>
                    </div>
                    <div class="modal-actions modal-actions--minimal modal-actions--editorial">
                        <button
                            class="${getLikeActionClass(post)}"
                            type="button"
                            data-action="toggle-like"
                            data-post-id="${escapeHtml(post.id)}"
                            aria-label="${post.isLiked ? "Descurtir" : "Curtir"} ${escapeAttribute(post.title)}"
                        >
                            <span class="icon-action-symbol" aria-hidden="true">${renderIcon("like")}</span>
                            <span class="icon-action-count">${escapeHtml(formatCompact.format(post.likesCount))}</span>
                        </button>
                        <button
                            class="icon-action"
                            type="button"
                            data-action="focus-post-comments"
                            data-post-id="${escapeHtml(post.id)}"
                            aria-label="Comentar"
                        >
                            <span class="icon-action-symbol" aria-hidden="true">${renderIcon("comment")}</span>
                            <span class="icon-action-count">${escapeHtml(formatCompact.format(post.commentsCount))}</span>
                        </button>
                        <button
                            class="icon-action ${post.isSaved ? "is-active" : ""}"
                            type="button"
                            data-action="toggle-save"
                            data-post-id="${escapeHtml(post.id)}"
                            aria-label="${post.isSaved ? "Remover dos salvos" : "Salvar"} ${escapeAttribute(post.title)}"
                        >
                            <span class="icon-action-symbol" aria-hidden="true">${renderIcon("save")}</span>
                            <span class="icon-action-count">${escapeHtml(formatCompact.format(post.savesCount))}</span>
                        </button>
                    </div>
                    <div class="meta-line modal-post-tags">
                        ${(post.tags.length ? post.tags : ["#conquest"])
                            .map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`)
                            .join("")}
                    </div>
                </div>
                <div class="modal-post-media">
                    ${renderPostMediaVisual(post, {
                        frameClass: "modal-post-media-stack",
                        imageClass: "modal-post-media-image",
                        stickerClass: "post-sticker--modal"
                    })}
                </div>
            </section>
            <aside class="modal-comments-panel">
                <div class="modal-comments-head">
                    <div class="modal-comments-title">
                        <h3>Comentarios:</h3>
                        <p>${escapeHtml(formatMetricLabel(post.commentsCount, "mensagem", "mensagens"))} para acompanhar a conversa desse post.</p>
                    </div>
                    <span class="meta-pill">${escapeHtml(modalStamp)}</span>
                </div>
                <div class="comment-list comment-list--modal">
                    ${
                        commentThreads.length
                            ? commentThreads.map((comment) => renderComment(comment, post)).join("")
                            : `
                                <div class="comment-card comment-card--empty comment-card--modal-empty">
                                    <div class="card-copy">
                                        <strong>Nenhum comentario ainda.</strong>
                                        <span>Seja a primeira pessoa a comentar.</span>
                                    </div>
                                    <p>Quando a conversa comecar, ela aparece aqui do lado da obra.</p>
                                </div>
                            `
                    }
                </div>
                <form
                    class="comment-form comment-form--modal comment-form--panel"
                    data-post-id="${escapeHtml(post.id)}"
                    data-reply-to-comment-id="${escapeHtml(replyTarget?.id || "")}"
                >
                    ${
                        replyTarget && replyTargetAuthor
                            ? `
                                <div class="comment-form-head">
                                    <div class="card-copy">
                                        <strong>Respondendo a @${escapeHtml(replyTargetAuthor.handle)}</strong>
                                        <span>A resposta entra embaixo do comentario original para manter a conversa organizada.</span>
                                    </div>
                                    <button class="ghost-button" type="button" data-action="cancel-comment-reply">
                                        ${renderButtonContent("close", "Cancelar")}
                                    </button>
                                </div>
                            `
                            : ""
                    }
                    <div class="comment-form-inline-row">
                        <input
                            name="comment"
                            type="text"
                            maxlength="220"
                            placeholder="${escapeAttribute(replyTargetAuthor ? `Responder a @${replyTargetAuthor.handle}` : "Escreva um comentario")}"
                            required
                        >
                        <button class="primary-button comment-submit-button" type="submit" aria-label="${replyTargetAuthor ? "Responder" : "Comentar"}">
                            <span class="button-symbol" aria-hidden="true">${renderIcon(replyTargetAuthor ? "reply" : "send")}</span>
                        </button>
                    </div>
                </form>
            </aside>
        </div>
    `;

    syncBodyModalState();
}

function renderComment(comment, post, depth = 0) {
    const author = getUserById(comment.authorId);
    const currentUser = getCurrentUser();

    if (!author || !currentUser) {
        return "";
    }

    const canDelete = currentUser.id === comment.authorId || currentUser.id === post.author.id;
    const parentComment = comment.parentId ? getCommentById(post.id, comment.parentId) : null;
    const parentAuthor = parentComment ? getUserById(parentComment.authorId) : null;
    const replyCount = comment.replies.length;
    const commentStamp = formatPostStamp(comment.createdAt);

    return `
        <div class="comment-thread ${depth ? "comment-thread--reply" : ""}">
            <div class="comment-card comment-card--modal">
                <div class="comment-entry">
                    <button class="comment-avatar-link" type="button" data-action="open-profile" data-user-id="${escapeHtml(author.id)}" aria-label="Abrir perfil de ${escapeAttribute(author.name)}">
                        ${renderAvatar(author, "mini-avatar")}
                    </button>
                    <div class="comment-entry-main">
                        <div class="comment-entry-head">
                            <div class="comment-copy">
                                <strong>${escapeHtml(author.name)}</strong>
                                <span>@${escapeHtml(author.handle)} - ${escapeHtml(commentStamp)}</span>
                            </div>
                            <div class="comment-actions">
                                <button
                                    class="comment-inline-action"
                                    type="button"
                                    data-action="reply-comment"
                                    data-post-id="${escapeHtml(post.id)}"
                                    data-comment-id="${escapeHtml(comment.id)}"
                                >
                                    <span class="comment-inline-action-icon" aria-hidden="true">${renderIcon("reply")}</span>
                                    <span>Responder</span>
                                </button>
                                ${
                                    canDelete
                                        ? `
                                            <button
                                                class="comment-delete"
                                                type="button"
                                                data-action="delete-comment"
                                                data-post-id="${escapeHtml(post.id)}"
                                                data-comment-id="${escapeHtml(comment.id)}"
                                                aria-label="Remover comentario"
                                                title="Remover comentario"
                                            >
                                                ${renderIcon("delete")}
                                            </button>
                                        `
                                        : ""
                                }
                            </div>
                        </div>
                        ${
                            parentAuthor
                                ? `<span class="comment-context">Respondendo a @${escapeHtml(parentAuthor.handle)}</span>`
                                : ""
                        }
                        <div class="comment-body">
                            <p>${escapeHtml(comment.text)}</p>
                        </div>
                        <div class="comment-meta-row">
                            <span>${escapeHtml(timeAgo(comment.createdAt))}</span>
                            ${
                                replyCount
                                    ? `<span>${escapeHtml(formatMetricLabel(replyCount, "resposta", "respostas"))}</span>`
                                    : ""
                            }
                        </div>
                    </div>
                </div>
            </div>
            ${
                comment.replies.length
                    ? `
                        <div class="comment-replies">
                            ${comment.replies.map((reply) => renderComment(reply, post, depth + 1)).join("")}
                        </div>
                    `
                    : ""
            }
        </div>
    `;
}

function renderInlineComment(comment, post, depth = 0) {
    const author = getUserById(comment.authorId);
    const currentUser = getCurrentUser();

    if (!author || !currentUser) {
        return "";
    }

    const canDelete = currentUser.id === comment.authorId || currentUser.id === post.author.id;
    const replyCount = comment.replies.length;

    return `
        <div class="feed-inline-comment ${depth ? "feed-inline-comment--reply" : ""}">
            <div class="feed-inline-comment-row">
                ${renderProfileIdentity(author, {
                    avatarClass: "mini-avatar",
                    copyClass: "comment-copy",
                    meta: `@${author.handle} · ${timeAgo(comment.createdAt)}`,
                    className: "profile-link profile-link--comment"
                })}
                <div class="comment-actions">
                    <button
                        class="comment-inline-action"
                        type="button"
                        data-action="reply-comment"
                        data-post-id="${escapeHtml(post.id)}"
                        data-comment-id="${escapeHtml(comment.id)}"
                    >
                        <span class="comment-inline-action-icon" aria-hidden="true">${renderIcon("reply")}</span>
                        <span>Responder</span>
                    </button>
                    ${
                        canDelete
                            ? `
                                <button
                                    class="comment-delete"
                                    type="button"
                                    data-action="delete-comment"
                                    data-post-id="${escapeHtml(post.id)}"
                                    data-comment-id="${escapeHtml(comment.id)}"
                                    aria-label="Remover comentario"
                                >
                                    ${renderIcon("delete")}
                                </button>
                            `
                            : ""
                    }
                </div>
            </div>
            <p>${escapeHtml(comment.text)}</p>
            <div class="comment-meta-row">
                <span>${escapeHtml(timeAgo(comment.createdAt))}</span>
                ${replyCount ? `<span>${escapeHtml(formatMetricLabel(replyCount, "resposta", "respostas"))}</span>` : ""}
            </div>
            ${
                comment.replies.length
                    ? `
                        <div class="feed-inline-replies">
                            ${comment.replies.map((reply) => renderInlineComment(reply, post, depth + 1)).join("")}
                        </div>
                    `
                    : ""
            }
        </div>
    `;
}

function renderStaticProfileIdentity(user, meta) {
    return `
        <div class="composer-preview-identity">
            ${renderAvatar(user, "mini-avatar")}
            <div class="profile-link-copy">
                <strong>${escapeHtml(user.name)}</strong>
                <span>${escapeHtml(meta)}</span>
            </div>
        </div>
    `;
}

function renderComposerPreviewCard(draft, currentUser) {
    const previewUser = currentUser || {
        id: "preview",
        name: "Seu perfil",
        handle: "voce",
        avatarImage: "",
        avatarTone: PROFILE_TONES[0]
    };
    const previewTitle = derivePostTitle(draft.title, draft.caption, draft.category || "Ilustracao");
    const previewPost = {
        id: "preview-post",
        title: previewTitle,
        caption:
            draft.caption ||
            (draft.postKind === "discussion"
                ? "Sua discussao aparece aqui no estilo timeline, puxando conversa e hashtags."
                : "Sua legenda aparece aqui com a cor que voce escolher."),
        category: draft.category || "Ilustracao",
        tags: normalizeTags(draft.tags || ""),
        postKind: normalizePostKind(draft.postKind),
        imageData: normalizeComposerContentMode(draft.contentMode) === "text" ? "" : draft.imageData,
        presentation: draft.presentation || createDefaultPostPresentation()
    };
    const tags = previewPost.tags.length ? previewPost.tags : [`#${previewPost.category.toLowerCase()}`];

    if (previewPost.postKind === "discussion") {
        return `
            <div class="composer-live-card composer-live-card--discussion ${getPostFontClass(previewPost)}"${getPostVisualStyleAttribute(previewPost)}>
                <div class="composer-live-discussion-head">
                    ${renderStaticProfileIdentity(previewUser, `@${previewUser.handle} · agora`)}
                    <span class="meta-pill">Discussao</span>
                </div>
                <div class="composer-live-discussion-copy">
                    <strong>${escapeHtml(previewTitle)}</strong>
                    <p class="composer-live-caption">${escapeHtml(previewPost.caption)}</p>
                </div>
                ${
                    previewPost.imageData
                        ? `
                            <div class="composer-live-media composer-live-media--discussion">
                                ${renderPostMediaVisual(previewPost, {
                                    frameClass: "composer-live-media-stack",
                                    imageClass: "composer-live-image",
                                    stickerClass: "post-sticker--composer"
                                })}
                            </div>
                        `
                        : ""
                }
                <div class="meta-line">
                    ${tags.slice(0, 4).map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join("")}
                </div>
            </div>
        `;
    }

    return `
        <div class="composer-live-card ${getPostFontClass(previewPost)}"${getPostVisualStyleAttribute(previewPost)}>
            <div class="composer-live-media ${previewPost.imageData ? "has-media" : "is-text-only"}">
                ${renderPostMediaVisual(previewPost, {
                    frameClass: "composer-live-media-stack",
                    imageClass: "composer-live-image",
                    stickerClass: "post-sticker--composer"
                })}
                <div class="composer-live-title">
                    <strong>${escapeHtml(previewTitle)}</strong>
                    <span>@${escapeHtml(previewUser.handle)} - ${escapeHtml(previewPost.category)}</span>
                </div>
            </div>
            <div class="composer-live-copy">
                ${renderStaticProfileIdentity(previewUser, `@${previewUser.handle}`)}
                <p class="composer-live-caption">${escapeHtml(previewPost.caption)}</p>
                <div class="meta-line">
                    ${tags.slice(0, 4).map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`).join("")}
                </div>
            </div>
        </div>
    `;
}

function refreshComposerPreview() {
    const previewRoot = document.getElementById("composerPreviewPanel");
    const currentUser = getCurrentUser();

    if (!previewRoot || !currentUser) {
        return;
    }

    previewRoot.innerHTML = renderComposerPreviewCard(state.ui.composerDraft, currentUser);
}

function renderMediaCropSection(options) {
    return `
        <section class="customizer-panel customizer-panel--crop">
            <div class="customizer-head">
                <div class="card-copy">
                    <strong>${escapeHtml(options.title)}</strong>
                    <span>${escapeHtml(options.note)}</span>
                </div>
                <button class="ghost-button ghost-button--compact" type="button" data-action="${escapeHtml(options.resetAction)}">
                    Centralizar
                </button>
            </div>
            <div class="slider-grid">
                <label class="field field--compact">
                    <span>Horizontal</span>
                    <input name="${escapeHtml(options.xName)}" type="range" min="0" max="100" step="1" value="${escapeAttribute(String(options.xValue))}">
                </label>
                <label class="field field--compact">
                    <span>Vertical</span>
                    <input name="${escapeHtml(options.yName)}" type="range" min="0" max="100" step="1" value="${escapeAttribute(String(options.yValue))}">
                </label>
                <label class="field field--compact">
                    <span>Zoom</span>
                    <input name="${escapeHtml(options.scaleName)}" type="range" min="1" max="2.4" step="0.01" value="${escapeAttribute(String(options.scaleValue))}">
                </label>
            </div>
        </section>
    `;
}

function renderProfileEditorPreviewContent(currentUser, draft) {
    const previewCover = draft.coverImage || getUserPosts(currentUser.id)[0]?.imageData || getFallbackArt(currentUser.handle.length);
    const previewUser = {
        ...currentUser,
        name: draft.name || currentUser.name,
        avatarImage: draft.avatarImage,
        avatarTone: draft.avatarTone || currentUser.avatarTone,
        avatarFocusX: draft.avatarFocusX,
        avatarFocusY: draft.avatarFocusY,
        avatarScale: draft.avatarScale
    };
    const previewCoverUser = {
        ...currentUser,
        coverFocusX: draft.coverFocusX,
        coverFocusY: draft.coverFocusY,
        coverScale: draft.coverScale
    };

    return `
        <div class="profile-editor-cover">
            <img src="${escapeAttribute(previewCover)}" alt="${escapeAttribute(draft.name || currentUser.name)}"${getCoverImageStyleAttribute(previewCoverUser)}>
        </div>
        <div class="profile-editor-identity">
            ${renderAvatar(previewUser, "avatar avatar--profile")}
            <div class="profile-copy">
                <h2>${escapeHtml(draft.name || currentUser.name)}</h2>
                <p>@${escapeHtml(currentUser.handle)}</p>
            </div>
        </div>
        <p class="profile-bio">${escapeHtml(draft.bio || currentUser.bio)}</p>
    `;
}

function refreshProfileEditorPreview() {
    const currentUser = getCurrentUser();
    const previewRoot = document.getElementById("profileEditorPreview");

    if (!previewRoot || !currentUser) {
        return;
    }

    previewRoot.innerHTML = renderProfileEditorPreviewContent(currentUser, state.ui.profileDraft);
}

function renderComposerModal() {
    const currentUser = getCurrentUser();
    const isOpen = state.ui.composerOpen && Boolean(currentUser);
    composerModal.classList.toggle("is-open", isOpen);

    if (!isOpen) {
        composerModalContent.innerHTML = "";
        syncBodyModalState();
        return;
    }

    const draft = state.ui.composerDraft;
    const presentation = draft.presentation || createDefaultPostPresentation();
    const postKind = normalizePostKind(draft.postKind);
    const contentMode = normalizeComposerContentMode(draft.contentMode);
    const distribution = normalizePostDistribution(draft.distribution);
    const hasTextContent = Boolean(sanitizeText(draft.title || "", 60) || sanitizeText(draft.caption || "", 240));
    const canPublish = Boolean((contentMode === "text" ? false : draft.imageData) || hasTextContent) && !state.ui.uploadingImage && !state.ui.uploadingSticker;

    composerModalContent.innerHTML = `
        <div class="composer-layout composer-layout--simple">
            <div class="composer-form-wrap">
                <button class="ghost-button modal-close" type="button" data-action="close-composer">
                    ${renderButtonContent("close", "Fechar")}
                </button>
                <form class="composer-form" id="composerForm">
                    <section class="composer-preview-shell" id="composerPreviewPanel">
                        ${renderComposerPreviewCard(draft, currentUser)}
                    </section>
                    <section class="customizer-panel customizer-panel--routing">
                        <div class="customizer-grid">
                            <label class="field field--compact">
                                <span>Publicacao</span>
                                <select name="postKind">
                                    <option value="art" ${postKind === "art" ? "selected" : ""}>Arte</option>
                                    <option value="discussion" ${postKind === "discussion" ? "selected" : ""}>Discussao</option>
                                </select>
                            </label>
                            <label class="field field--compact">
                                <span>Formato</span>
                                <select name="contentMode">
                                    <option value="media" ${contentMode === "media" ? "selected" : ""}>Com imagem</option>
                                    <option value="text" ${contentMode === "text" ? "selected" : ""}>So texto</option>
                                </select>
                            </label>
                            <label class="field field--compact">
                                <span>Onde publicar</span>
                                <select name="distribution">
                                    <option value="both" ${distribution === "both" ? "selected" : ""}>Inicio e feed</option>
                                    <option value="feed" ${distribution === "feed" ? "selected" : ""}>So no feed</option>
                                    <option value="home" ${distribution === "home" ? "selected" : ""}>So na pagina inicial</option>
                                    <option value="discussion" ${distribution === "discussion" ? "selected" : ""}>So em discussoes</option>
                                </select>
                            </label>
                        </div>
                    </section>
                    ${
                        contentMode === "text"
                            ? `
                                <div class="file-drop file-drop--simple simple-upload-empty">
                                    <div class="card-copy">
                                        <strong>${postKind === "discussion" ? "Discussao textual" : "Post textual"}</strong>
                                        <span>${postKind === "discussion" ? "Perfeito para soltar um assunto, puxar respostas e levantar hashtags." : "Esse formato entra direto como texto, no estilo microblog, sem precisar de imagem."}</span>
                                    </div>
                                </div>
                            `
                        : `
                                <div class="file-drop file-drop--simple">
                                    <div class="card-copy">
                                        <strong>${postKind === "discussion" ? "Imagem de apoio" : "Imagem opcional"}</strong>
                                        <span>${postKind === "discussion" ? "Se quiser, adicione uma imagem para apoiar a conversa sem tirar o foco do texto." : "Voce pode publicar so texto ou adicionar uma imagem para montar a composicao."}</span>
                                    </div>
                                    <input id="composerFile" type="file" accept="image/*">
                                    <p>${state.ui.uploadingImage ? "Preparando imagem..." : draft.fileName ? `Arquivo atual: ${escapeHtml(draft.fileName)}` : "Nenhuma imagem selecionada por enquanto."}</p>
                                    <div class="composer-actions">
                                        <button class="ghost-button ghost-button--compact" type="button" data-action="clear-post-image">Remover imagem</button>
                                    </div>
                                </div>
                            `
                    }
                    <label class="field">
                        <span>${postKind === "discussion" ? "Assunto opcional" : "Titulo opcional"}</span>
                        <input name="title" type="text" maxlength="60" placeholder="${escapeAttribute(postKind === "discussion" ? "Ex.: O que voces acharam de..." : "Se preferir, o app usa a legenda como titulo")}" value="${escapeAttribute(draft.title)}">
                    </label>
                    <label class="field">
                        <span>${postKind === "discussion" ? "Texto" : "Legenda"}</span>
                        <textarea name="caption" rows="4" maxlength="240" placeholder="${escapeAttribute(postKind === "discussion" ? "Solte a ideia, puxe a conversa e use # para marcar o assunto." : "Escreva como se fosse um post de verdade")}">${escapeHtml(draft.caption)}</textarea>
                    </label>
                    <label class="field">
                        <span>${postKind === "discussion" ? "Clima da discussao" : "Categoria"}</span>
                        <select name="category">
                            ${CATEGORIES.filter((category) => category !== "Todos")
                                .map(
                                    (category) => `
                                        <option value="${escapeHtml(category)}" ${draft.category === category ? "selected" : ""}>
                                            ${escapeHtml(category)}
                                        </option>
                                    `
                                )
                                .join("")}
                        </select>
                    </label>
                    <label class="field">
                        <span>${postKind === "discussion" ? "Hashtags" : "Tags"}</span>
                        <input name="tags" type="text" maxlength="90" placeholder="${escapeAttribute(postKind === "discussion" ? "#cinema #design #opiniao" : "#luz #editorial #processo")}" value="${escapeAttribute(draft.tags)}">
                    </label>
                    <section class="customizer-panel">
                        <div class="customizer-head">
                            <div class="card-copy">
                                <strong>Visual do post</strong>
                                <span>Escolha a cor do vidro, da legenda e a fonte que melhor combina com a arte.</span>
                            </div>
                        </div>
                        <div class="customizer-grid">
                            <label class="field field--compact field--color">
                                <span>Cor do post</span>
                                <input name="surfaceTone" type="color" value="${escapeAttribute(presentation.surfaceTone || DEFAULT_POST_SURFACE_TONE)}">
                            </label>
                            <label class="field field--compact field--color">
                                <span>Cor do titulo</span>
                                <input name="titleColor" type="color" value="${escapeAttribute(presentation.titleColor || DEFAULT_POST_TITLE_COLOR)}">
                            </label>
                            <label class="field field--compact field--color">
                                <span>Cor da legenda</span>
                                <input name="captionColor" type="color" value="${escapeAttribute(presentation.captionColor || DEFAULT_POST_CAPTION_COLOR)}">
                            </label>
                            <label class="field field--compact">
                                <span>Fonte</span>
                                <select name="fontPreset">
                                    ${POST_FONT_PRESETS.map((preset) => `<option value="${escapeHtml(preset.id)}" ${presentation.fontPreset === preset.id ? "selected" : ""}>${escapeHtml(preset.label)}</option>`).join("")}
                                </select>
                            </label>
                        </div>
                    </section>
                    <section class="customizer-panel">
                        <div class="customizer-head">
                            <div class="card-copy">
                                <strong>PNG ou GIF livre</strong>
                                <span>Suba um sticker transparente e mova pela imagem ate a composicao ficar perfeita.</span>
                            </div>
                        </div>
                        <div class="file-drop file-drop--simple file-drop--compact">
                            <input id="composerStickerFile" type="file" accept="image/png,image/gif,image/webp">
                            <p>${state.ui.uploadingSticker ? "Preparando sticker..." : presentation.sticker.fileName ? `Sticker atual: ${escapeHtml(presentation.sticker.fileName)}` : presentation.sticker.src ? "Sticker pronto para publicar." : "Nenhum sticker selecionado ainda."}</p>
                            <div class="composer-actions">
                                <button class="ghost-button ghost-button--compact" type="button" data-action="clear-post-sticker">Remover sticker</button>
                            </div>
                        </div>
                        ${
                            presentation.sticker.src
                                ? `
                                    <div class="slider-grid">
                                        <label class="field field--compact">
                                            <span>Horizontal</span>
                                            <input name="stickerX" type="range" min="0" max="100" step="1" value="${escapeAttribute(String(presentation.sticker.x))}">
                                        </label>
                                        <label class="field field--compact">
                                            <span>Vertical</span>
                                            <input name="stickerY" type="range" min="0" max="100" step="1" value="${escapeAttribute(String(presentation.sticker.y))}">
                                        </label>
                                        <label class="field field--compact">
                                            <span>Tamanho</span>
                                            <input name="stickerSize" type="range" min="12" max="72" step="1" value="${escapeAttribute(String(presentation.sticker.size))}">
                                        </label>
                                        <label class="field field--compact">
                                            <span>Rotacao</span>
                                            <input name="stickerRotate" type="range" min="-40" max="40" step="1" value="${escapeAttribute(String(presentation.sticker.rotate))}">
                                        </label>
                                        <label class="field field--compact">
                                            <span>Opacidade</span>
                                            <input name="stickerOpacity" type="range" min="35" max="100" step="1" value="${escapeAttribute(String(presentation.sticker.opacity))}">
                                        </label>
                                    </div>
                                `
                                : `<div class="simple-upload-empty simple-upload-empty--compact">Quando voce escolher um PNG ou GIF, ele aparece sobre a imagem do post.</div>`
                        }
                    </section>
                    <div class="composer-actions">
                        <button class="primary-button" type="submit" ${canPublish ? "" : "disabled"}>
                            ${renderButtonContent("compose", state.ui.uploadingImage || state.ui.uploadingSticker ? "Preparando..." : "Publicar")}
                        </button>
                        <button class="ghost-button" type="button" data-action="close-composer">
                            ${renderButtonContent("close", "Cancelar")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    syncBodyModalState();
}

function renderProfileEditorModal() {
    const currentUser = getCurrentUser();
    const isOpen = state.ui.profileEditorOpen && Boolean(currentUser);
    profileModal.classList.toggle("is-open", isOpen);

    if (!isOpen || !currentUser) {
        profileModalContent.innerHTML = "";
        syncBodyModalState();
        return;
    }

    const draft = state.ui.profileDraft;

    profileModalContent.innerHTML = `
        <div class="profile-editor-layout profile-editor-layout--simple">
            <aside class="profile-editor-preview" id="profileEditorPreview">
                ${renderProfileEditorPreviewContent(currentUser, draft)}
            </aside>
            <div class="composer-form-wrap">
                <button class="ghost-button modal-close" type="button" data-action="close-profile-editor">
                    ${renderButtonContent("close", "Fechar")}
                </button>
                <form class="composer-form" id="profileForm">
                    <label class="field">
                        <span>Nome</span>
                        <input name="name" type="text" maxlength="36" placeholder="Seu nome" value="${escapeAttribute(draft.name)}" required>
                    </label>
                    <label class="field">
                        <span>Bio</span>
                        <textarea name="bio" rows="3" maxlength="90" placeholder="Fale um pouco do que voce posta" required>${escapeHtml(draft.bio)}</textarea>
                    </label>
                    <div class="profile-editor-grid">
                        <label class="field">
                            <span>Local</span>
                            <input name="location" type="text" maxlength="48" placeholder="Cidade ou pais" value="${escapeAttribute(draft.location)}">
                        </label>
                        <label class="field">
                            <span>Site</span>
                            <input name="website" type="text" maxlength="80" placeholder="seusite.com" value="${escapeAttribute(draft.website)}">
                        </label>
                    </div>
                    <div class="file-drop file-drop--simple">
                        <div class="card-copy">
                            <strong>Foto de perfil</strong>
                            <span>Formato do site: 1:1. Suba a foto e ajuste o recorte ate ficar perfeito.</span>
                        </div>
                        <input id="profileAvatarFile" type="file" accept="image/*">
                        <p>${state.ui.uploadingProfileAvatar ? "Preparando foto..." : draft.avatarFileName ? `Arquivo atual: ${escapeHtml(draft.avatarFileName)}` : draft.avatarImage ? "Foto pronta para salvar." : "Nenhuma foto selecionada ainda."}</p>
                        <div class="composer-actions">
                            <button class="ghost-button" type="button" data-action="clear-profile-avatar">${renderButtonContent("close", "Remover foto")}</button>
                        </div>
                    </div>
                    ${draft.avatarImage ? renderMediaCropSection({
                        title: "Recorte da foto",
                        note: "O CONQUEST usa avatar 1:1 em todo o app.",
                        xName: "avatarFocusX",
                        yName: "avatarFocusY",
                        scaleName: "avatarScale",
                        xValue: draft.avatarFocusX,
                        yValue: draft.avatarFocusY,
                        scaleValue: draft.avatarScale,
                        resetAction: "reset-avatar-crop"
                    }) : ""}
                    <div class="file-drop file-drop--simple">
                        <div class="card-copy">
                            <strong>Capa do perfil</strong>
                            <span>Formato do site: 16:5. Escolha a imagem e ajuste o enquadramento do banner.</span>
                        </div>
                        <input id="profileCoverFile" type="file" accept="image/*">
                        <p>${state.ui.uploadingProfileCover ? "Preparando capa..." : draft.coverFileName ? `Arquivo atual: ${escapeHtml(draft.coverFileName)}` : draft.coverImage ? "Capa pronta para salvar." : "Nenhuma capa selecionada ainda."}</p>
                        <div class="composer-actions">
                            <button class="ghost-button" type="button" data-action="clear-profile-cover">${renderButtonContent("close", "Remover capa")}</button>
                        </div>
                    </div>
                    ${draft.coverImage ? renderMediaCropSection({
                        title: "Recorte do banner",
                        note: "O banner usa um corte amplo para desktop e mobile.",
                        xName: "coverFocusX",
                        yName: "coverFocusY",
                        scaleName: "coverScale",
                        xValue: draft.coverFocusX,
                        yValue: draft.coverFocusY,
                        scaleValue: draft.coverScale,
                        resetAction: "reset-cover-crop"
                    }) : ""}
                    <div class="composer-actions">
                        <button class="primary-button" type="submit">${renderButtonContent("edit", "Salvar perfil")}</button>
                        <button class="ghost-button" type="button" data-action="close-profile-editor">${renderButtonContent("close", "Cancelar")}</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    syncBodyModalState();
}

function closeComposer() {
    state.ui.composerOpen = false;
    state.ui.uploadingImage = false;
    state.ui.uploadingSticker = false;
    state.ui.composerDraft = createEmptyDraft();
    renderComposerModal();
}

function closeProfileEditor() {
    state.ui.profileEditorOpen = false;
    state.ui.uploadingProfileAvatar = false;
    state.ui.uploadingProfileCover = false;
    state.ui.profileDraft = createEmptyProfileDraft(getCurrentUser());
    renderProfileEditorModal();
}

function closePostModal() {
    finalizeActivePostView();
    state.ui.postModalId = null;
    renderPostModal();
}

function openPost(postId, options = {}) {
    if (!postId) {
        return;
    }

    finalizeActivePostView();
    state.ui.postModalId = postId;
    state.ui.replyingToCommentId = null;
    startActivePostView(postId, options.source || "modal");
    renderPostModal();

    if (options.focusComposer) {
        focusCommentComposer();
    }
}

function toggleInlineComments(postId, options = {}) {
    if (!postId) {
        return;
    }

    const nextIsOpen = state.ui.inlineCommentPostId !== postId;
    state.ui.inlineCommentPostId = nextIsOpen ? postId : null;
    state.ui.replyingToCommentId = null;

    if (nextIsOpen) {
        recordPostView(postId, {
            durationMs: 1800,
            source: "inline"
        });
    }

    renderFrame();

    if (nextIsOpen && options.focusComposer !== false) {
        focusInlineCommentComposer(postId);
    }
}

function startActivePostView(postId, source = "modal") {
    state.ui.activePostViewSession = {
        postId,
        source: source === "inline" ? "inline" : "modal",
        startedAt: Date.now()
    };
}

function finalizeActivePostView() {
    const session = state.ui.activePostViewSession;

    if (!session?.postId) {
        state.ui.activePostViewSession = null;
        return;
    }

    const durationMs = Math.max(650, Date.now() - Number(session.startedAt || Date.now()));
    recordPostView(session.postId, {
        durationMs,
        source: session.source
    });
    state.ui.activePostViewSession = null;
}

function recordPostView(postId, options = {}) {
    const user = getCurrentUser();

    if (!user || !postId || !getPostById(postId)) {
        return;
    }

    ensureUserCollections(user.id);
    const source = options.source === "inline" ? "inline" : "modal";
    const durationMs = Math.max(0, Math.min(120000, Number(options.durationMs) || 0));

    state.db.viewHistoryByUser[user.id].unshift({
        postId,
        createdAt: Date.now(),
        durationMs,
        source
    });
    state.db.viewHistoryByUser[user.id] = state.db.viewHistoryByUser[user.id].slice(0, 180);
    persistDb();
}

function focusCommentComposer() {
    window.requestAnimationFrame(() => {
        const input = postModalContent.querySelector('.comment-form input[name="comment"]');

        if (!input) {
            return;
        }

        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    });
}

function focusInlineCommentComposer(postId) {
    window.requestAnimationFrame(() => {
        const input = viewRoot.querySelector(`.comment-form[data-post-id="${postId}"] input[name="comment"]`);

        if (!input) {
            return;
        }

        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
    });
}

function triggerLikeBurst(postId) {
    if (!postId) {
        return;
    }

    clearLikeBurst(postId, { rerender: false });
    state.ui.likeBurstPostIds[postId] = true;

    likeBurstTimers.set(
        postId,
        window.setTimeout(() => {
            clearLikeBurst(postId);
        }, 760)
    );
}

function clearLikeBurst(postId, options = {}) {
    if (!postId) {
        return;
    }

    const timerId = likeBurstTimers.get(postId);

    if (timerId) {
        window.clearTimeout(timerId);
        likeBurstTimers.delete(postId);
    }

    if (state.ui.likeBurstPostIds?.[postId]) {
        delete state.ui.likeBurstPostIds[postId];

        if (options.rerender !== false) {
            renderFrame();
            renderPostModal();
        }
    }
}

function syncBodyModalState() {
    document.body.classList.toggle(
        "modal-open",
        Boolean(state.ui.postModalId) || state.ui.composerOpen || state.ui.profileEditorOpen
    );
}

function syncTopbarState() {
    if (!appTopbar) {
        return;
    }

    appTopbar.classList.toggle("is-condensed", window.scrollY > 28);
}

function syncTopbarAlertsBadge(user) {
    if (!topbarAlertsBadge) {
        return;
    }

    const count = user ? getActivitiesForUser(user.id).length : 0;
    topbarAlertsBadge.textContent = count > 9 ? "9+" : String(count);
    topbarAlertsBadge.classList.toggle("is-hidden", count === 0);
}

function stabilizePostsOrder(posts, scope, key) {
    const normalizedPosts = Array.isArray(posts) ? posts.slice() : [];
    const snapshot = state.ui.orderSnapshots?.[scope];

    if (!snapshot || snapshot.key !== key) {
        state.ui.orderSnapshots[scope] = {
            key,
            ids: normalizedPosts.map((post) => post.id)
        };
        return normalizedPosts;
    }

    const previousOrder = new Map(snapshot.ids.map((id, index) => [id, index]));
    const orderedPosts = normalizedPosts.slice().sort((a, b) => {
        const aIndex = previousOrder.has(a.id) ? previousOrder.get(a.id) : Number.MAX_SAFE_INTEGER;
        const bIndex = previousOrder.has(b.id) ? previousOrder.get(b.id) : Number.MAX_SAFE_INTEGER;

        if (aIndex !== bIndex) {
            return aIndex - bIndex;
        }

        return 0;
    });

    state.ui.orderSnapshots[scope] = {
        key,
        ids: orderedPosts.map((post) => post.id)
    };

    return orderedPosts;
}

function canShowPostInSurface(post, surface) {
    const distribution = normalizePostDistribution(post?.distribution);
    const postKind = normalizePostKind(post?.postKind);

    if (surface === "discussions") {
        return distribution === "discussion" || postKind === "discussion";
    }

    if (distribution === "discussion" || postKind === "discussion") {
        return false;
    }

    if (surface === "home") {
        return distribution !== "feed";
    }

    if (surface === "feed") {
        return distribution !== "home";
    }

    return true;
}

function getHomePosts(userId) {
    const context = createRecommendationContext(userId);
    const rankedPosts = applyPostFilters(
        state.db.posts
            .map((post) => toPostView(post, userId))
            .filter(Boolean)
            .filter((post) => canShowPostInSurface(post, "home"))
            .map((post) => decoratePostForViewer(post, context))
    ).sort((a, b) => b.rankScores.home - a.rankScores.home || b.createdAt - a.createdAt);

    return diversifyRankedPosts(rankedPosts, "home");
}

function getRecentPosts(userId) {
    const context = createRecommendationContext(userId);

    return applyPostFilters(
        state.db.posts
            .map((post) => toPostView(post, userId))
            .filter(Boolean)
            .filter((post) => canShowPostInSurface(post, "home"))
            .map((post) => decoratePostForViewer(post, context))
            .sort((a, b) => b.createdAt - a.createdAt)
    );
}

function getDiscoveryPosts(userId) {
    const context = createRecommendationContext(userId);
    const decoratedPosts = applyPostFilters(
        state.db.posts
            .map((post) => toPostView(post, userId))
            .filter(Boolean)
            .filter((post) => canShowPostInSurface(post, "home"))
            .map((post) => decoratePostForViewer(post, context))
    );
    const preferredPosts = decoratedPosts.filter(
        (post) => post.author.id !== userId && !context.viewerProfile.following.has(post.author.id)
    );
    const fallbackPosts = decoratedPosts.filter((post) => post.author.id !== userId);
    const source = preferredPosts.length ? preferredPosts : fallbackPosts.length ? fallbackPosts : decoratedPosts;
    const rankedPosts = source.sort((a, b) => b.rankScores.discover - a.rankScores.discover || b.createdAt - a.createdAt);

    return diversifyRankedPosts(rankedPosts, "discover");
}

function getFollowingPosts(userId) {
    const context = createRecommendationContext(userId);
    const following = new Set(getFollowingIds(userId));

    return applyPostFilters(
        state.db.posts
            .map((post) => toPostView(post, userId))
            .filter((post) => post && following.has(post.author.id))
            .filter((post) => canShowPostInSurface(post, "feed"))
            .map((post) => decoratePostForViewer(post, context))
            .sort((a, b) => b.createdAt - a.createdAt)
    );
}

function getFeedPosts(userId) {
    const context = createRecommendationContext(userId);
    const rankedPosts = applyPostFilters(
        state.db.posts
            .map((post) => toPostView(post, userId))
            .filter(Boolean)
            .filter((post) => canShowPostInSurface(post, "feed"))
            .map((post) => decoratePostForViewer(post, context))
    ).sort((a, b) => b.rankScores.home - a.rankScores.home || b.createdAt - a.createdAt);

    return diversifyRankedPosts(rankedPosts, "feed");
}

function getDiscussionPosts(userId) {
    const context = createRecommendationContext(userId);
    const rankedPosts = applyPostFilters(
        state.db.posts
            .map((post) => toPostView(post, userId))
            .filter(Boolean)
            .filter((post) => canShowPostInSurface(post, "discussions"))
            .map((post) => decoratePostForViewer(post, context))
    ).sort((a, b) => b.rankScores.discussion - a.rankScores.discussion || b.createdAt - a.createdAt);

    return diversifyRankedPosts(rankedPosts, "discussions");
}

function getRecentDiscussionPosts(userId) {
    const context = createRecommendationContext(userId);

    return applyPostFilters(
        state.db.posts
            .map((post) => toPostView(post, userId))
            .filter(Boolean)
            .filter((post) => canShowPostInSurface(post, "discussions"))
            .map((post) => decoratePostForViewer(post, context))
            .sort((a, b) => b.createdAt - a.createdAt)
    );
}

function getFollowingDiscussionPosts(userId) {
    const context = createRecommendationContext(userId);
    const following = new Set(getFollowingIds(userId));

    return applyPostFilters(
        state.db.posts
            .map((post) => toPostView(post, userId))
            .filter(Boolean)
            .filter((post) => canShowPostInSurface(post, "discussions"))
            .filter((post) => following.has(post.author.id))
            .map((post) => decoratePostForViewer(post, context))
            .sort((a, b) => b.createdAt - a.createdAt)
    );
}

function getPhotoModePosts(userId) {
    const context = createRecommendationContext(userId);
    const query = state.ui.query.trim().toLowerCase();

    const rankedPosts = state.db.posts
        .map((post) => toPostView(post, userId))
        .filter(Boolean)
        .filter((post) => sanitizeImageSource(post.imageData || ""))
        .map((post) => decoratePostForViewer(post, context))
        .filter((post) => {
            if (!query) {
                return true;
            }

            const haystack = [
                post.title,
                post.caption,
                post.category,
                post.author.name,
                post.author.handle,
                ...(post.tags || [])
            ]
                .join(" ")
                .toLowerCase();

            return haystack.includes(query);
        })
        .sort((a, b) => b.rankScores.home - a.rankScores.home || b.createdAt - a.createdAt);

    return rankedPosts;
}

function getTrendingDiscussionTopics(posts) {
    const topicMap = new Map();

    posts.forEach((post) => {
        (post.tags || [])
            .filter((tag) => tag.startsWith("#"))
            .slice(0, 4)
            .forEach((tag) => {
                const current = topicMap.get(tag) || {
                    tag,
                    postsCount: 0,
                    commentsCount: 0,
                    likesCount: 0,
                    heat: 0,
                    latestAt: 0
                };

                current.postsCount += 1;
                current.commentsCount += post.commentsCount;
                current.likesCount += post.likesCount;
                current.heat += (post.rankScores?.discussion || 0) + post.commentsCount * 6 + post.likesCount * 1.8;
                current.latestAt = Math.max(current.latestAt, post.createdAt);
                topicMap.set(tag, current);
            });
    });

    return Array.from(topicMap.values())
        .sort((a, b) => b.heat - a.heat || b.latestAt - a.latestAt)
        .slice(0, 6);
}

function createRecommendationContext(userId) {
    const viewerProfile = buildViewerProfile(userId);
    const authorSnapshots = new Map();

    return {
        userId,
        viewerProfile,
        getAuthorSnapshot(authorId) {
            if (!authorSnapshots.has(authorId)) {
                authorSnapshots.set(authorId, createAuthorSnapshot(authorId));
            }

            return authorSnapshots.get(authorId);
        }
    };
}

function buildViewerProfile(userId) {
    const following = new Set(getFollowingIds(userId));
    const likedIds = new Set(getLikedIds(userId));
    const savedIds = new Set(getSavedIds(userId));
    const artistAffinity = new Map();
    const categoryAffinity = new Map();
    const tagAffinity = new Map();
    const viewedCounts = new Map();
    const viewedDurations = new Map();

    function accumulate(map, key, amount) {
        if (!key || !Number.isFinite(amount) || amount <= 0) {
            return;
        }

        map.set(key, (map.get(key) || 0) + amount);
    }

    function addPostSignal(post, weight) {
        if (!post || !Number.isFinite(weight) || weight <= 0) {
            return;
        }

        accumulate(artistAffinity, post.authorId, weight * 1.18);
        accumulate(categoryAffinity, post.category, weight * 0.92);
        (post.tags || []).forEach((tag, index) => {
            accumulate(tagAffinity, tag, weight * (index === 0 ? 0.46 : 0.3));
        });
    }

    following.forEach((authorId) => {
        accumulate(artistAffinity, authorId, 2.8);
    });

    likedIds.forEach((postId) => {
        addPostSignal(getPostById(postId), 3.4);
    });

    savedIds.forEach((postId) => {
        addPostSignal(getPostById(postId), 4.2);
    });

    Object.entries(state.db.commentsByPost).forEach(([postId, comments]) => {
        if (!Array.isArray(comments) || !comments.some((comment) => comment.authorId === userId)) {
            return;
        }

        const authoredComments = comments.filter((comment) => comment.authorId === userId).length;
        addPostSignal(getPostById(postId), 3 + authoredComments * 0.9);
    });

    getViewHistory(userId)
        .slice(0, 160)
        .forEach((view, index) => {
            const post = getPostById(view.postId);

            if (!post) {
                return;
            }

            const durationWeight = Math.min(4.1, 0.55 + (view.durationMs || 0) / 5200);
            const recencyMultiplier = index < 10 ? 1.15 : index < 30 ? 1.04 : 0.92;
            addPostSignal(post, durationWeight * recencyMultiplier);
            accumulate(viewedCounts, view.postId, 1);
            accumulate(viewedDurations, view.postId, view.durationMs || 0);
        });

    return {
        userId,
        following,
        likedIds,
        savedIds,
        artistAffinity,
        categoryAffinity,
        tagAffinity,
        viewedCounts,
        viewedDurations
    };
}

function createAuthorSnapshot(authorId) {
    const posts = getUserPosts(authorId).slice(0, 8);
    const followers = getFollowersCount(authorId);
    const averageEngagement = posts.length
        ? posts.reduce((total, post) => total + calculateRawEngagement(post.id), 0) / posts.length
        : 0;

    return {
        followers,
        postsCount: posts.length,
        averageEngagement
    };
}

function calculateRawEngagement(postId) {
    return getLikeCount(postId) * 2.2 + getComments(postId).length * 3.8 + getSaveCount(postId) * 3.4;
}

function getRecentPostActivityWeight(post) {
    return (state.db.activitiesByUser[post.author.id] || []).reduce((score, entry) => {
        if (entry.postId !== post.id || !["like", "comment", "reply"].includes(entry.type)) {
            return score;
        }

        const ageInHours = Math.max(0.15, (Date.now() - entry.createdAt) / 3600000);
        const interactionWeight = entry.type === "reply" ? 1.4 : entry.type === "comment" ? 1.8 : 1.15;

        if (ageInHours <= 3) {
            return score + interactionWeight * 1.85;
        }

        if (ageInHours <= 12) {
            return score + interactionWeight;
        }

        if (ageInHours <= 24) {
            return score + interactionWeight * 0.45;
        }

        return score;
    }, 0);
}

function decoratePostForViewer(post, context) {
    if (!post) {
        return null;
    }

    const ageInHours = Math.max(0.2, (Date.now() - post.createdAt) / 3600000);
    const engagement = post.likesCount * 2.2 + post.commentsCount * 3.8 + post.savesCount * 3.4;
    const recentActivity = getRecentPostActivityWeight(post);
    const velocity = (engagement + recentActivity * 4.8) / Math.pow(ageInHours + 1.12, 0.76);
    const freshness = 165 / Math.pow(ageInHours + 1.25, 0.84);
    const authorAffinity = context.viewerProfile.artistAffinity.get(post.author.id) || 0;
    const categoryAffinity = context.viewerProfile.categoryAffinity.get(post.category) || 0;
    const tagAffinity = (post.tags || []).reduce((score, tag) => score + (context.viewerProfile.tagAffinity.get(tag) || 0), 0);
    const affinityScore = authorAffinity * 1.35 + categoryAffinity * 1.08 + tagAffinity * 0.84;
    const authorSnapshot = context.getAuthorSnapshot(post.author.id);
    const relativePerformance = engagement / Math.max(10, authorSnapshot.averageEngagement || 0.0001);
    const emergingBoost =
        (22 / Math.pow(authorSnapshot.followers + 6, 0.38)) + (15 / Math.pow(authorSnapshot.postsCount + 2, 0.42));
    const followBoost = context.viewerProfile.following.has(post.author.id) ? 18 : 0;
    const viewCount = context.viewerProfile.viewedCounts.get(post.id) || 0;
    const viewedDuration = context.viewerProfile.viewedDurations.get(post.id) || 0;
    const noveltyBoost = viewCount === 0 ? 11 : Math.max(0, 6 - viewCount * 1.6);
    const seenPenalty = post.isLiked || post.isSaved ? Math.min(4, viewCount * 1.15) : Math.min(18, viewCount * 4.6 + viewedDuration / 12000);
    const followPenalty = context.viewerProfile.following.has(post.author.id) ? 10 : 0;
    const selfBoost = post.author.id === context.userId ? 6 : 0;

    const rankScores = {
        trending: freshness * 0.74 + engagement * 0.82 + velocity * 6.2 + recentActivity * 4.6 + relativePerformance * 10.5 - seenPenalty * 0.18,
        recent: post.createdAt,
        discussion:
            freshness * 0.88 +
            velocity * 6.1 +
            recentActivity * 5.2 +
            post.commentsCount * 6.8 +
            post.likesCount * 1.8 +
            post.savesCount * 1.4 +
            affinityScore * 0.92 +
            noveltyBoost * 1.2 -
            seenPenalty * 0.34,
        discover:
            freshness * 0.8 +
            velocity * 5.1 +
            affinityScore * 0.88 +
            emergingBoost * 2.55 +
            relativePerformance * 15.4 +
            noveltyBoost -
            followPenalty -
            seenPenalty * 0.55,
        home:
            freshness * 0.96 +
            engagement * 0.62 +
            velocity * 5.4 +
            affinityScore * 1.06 +
            followBoost +
            emergingBoost * 0.72 +
            relativePerformance * 2.4 +
            noveltyBoost -
            seenPenalty +
            selfBoost
    };

    const recommendationBadge = getRecommendationBadge({
        ageInHours,
        recentActivity,
        relativePerformance,
        emergingBoost,
        velocity,
        rankScores,
        isFollowed: context.viewerProfile.following.has(post.author.id),
        followers: authorSnapshot.followers
    });

    return {
        ...post,
        rankScores,
        rankSignals: {
            ageInHours,
            engagement,
            recentActivity,
            velocity,
            affinityScore,
            relativePerformance,
            emergingBoost,
            viewCount,
            viewedDuration
        },
        socialPulse: createSocialPulse(post),
        recommendationBadge
    };
}

function getRecommendationBadge(signals) {
    if (signals.ageInHours <= 18 && signals.velocity >= 18 && signals.recentActivity >= 2.2) {
        return { label: "Popular agora", tone: "hot" };
    }

    if (!signals.isFollowed && signals.followers <= 10 && signals.relativePerformance >= 1.35 && signals.emergingBoost >= 8) {
        return { label: "Novo e promissor", tone: "discovery" };
    }

    if (signals.rankScores.trending >= 92) {
        return { label: "Em alta", tone: "trend" };
    }

    if (signals.rankScores.home >= 82 && signals.relativePerformance >= 1.12) {
        return { label: "Em destaque", tone: "spotlight" };
    }

    return null;
}

function diversifyRankedPosts(posts, scoreKey) {
    const queue = posts.slice().sort((a, b) => {
        return (b.rankScores?.[scoreKey] || 0) - (a.rankScores?.[scoreKey] || 0) || b.createdAt - a.createdAt;
    });
    const result = [];

    while (queue.length) {
        const recentAuthors = result.slice(-2).map((post) => post.author.id);
        let pickIndex = queue.findIndex((post) => !recentAuthors.includes(post.author.id));

        if (pickIndex === -1) {
            const lastAuthor = result[result.length - 1]?.author.id;
            pickIndex = queue.findIndex((post) => post.author.id !== lastAuthor);
        }

        if (pickIndex === -1) {
            pickIndex = 0;
        }

        result.push(queue.splice(pickIndex, 1)[0]);
    }

    return result;
}

function getDiscoverUsers(viewerId, limit = 4) {
    const following = new Set(getFollowingIds(viewerId));

    return state.db.users
        .filter((user) => user.id !== viewerId && !following.has(user.id))
        .map((user) => ({
            user,
            score: calculateUserScore(user, viewerId)
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((item) => item.user);
}

function getMatchingUsers(rawQuery, viewerId) {
    const query = String(rawQuery || "").trim().toLowerCase();

    if (!query) {
        return [];
    }

    return state.db.users
        .filter((user) => {
            const haystack = [user.name, user.handle, user.bio, user.location, user.website].join(" ").toLowerCase();
            return haystack.includes(query);
        })
        .map((user) => ({
            user,
            score: calculateUserScore(user, viewerId, query)
        }))
        .sort((a, b) => b.score - a.score)
        .map((item) => item.user);
}

function getSavedPosts(userId) {
    const savedIds = new Set(getSavedIds(userId));
    const context = createRecommendationContext(userId);

    return applyPostFilters(
        state.db.posts
            .map((post) => toPostView(post, userId))
            .filter((post) => post && savedIds.has(post.id))
            .map((post) => decoratePostForViewer(post, context))
            .sort((a, b) => b.createdAt - a.createdAt)
    );
}

function sortPostsByConversation(posts) {
    return posts
        .slice()
        .sort((a, b) => b.commentsCount - a.commentsCount || b.likesCount - a.likesCount || b.createdAt - a.createdAt);
}

function sortPostsBySaves(posts) {
    return posts
        .slice()
        .sort((a, b) => b.savesCount - a.savesCount || b.likesCount - a.likesCount || b.createdAt - a.createdAt);
}

function sortPostsByLikes(posts) {
    return posts
        .slice()
        .sort((a, b) => b.likesCount - a.likesCount || b.savesCount - a.savesCount || b.createdAt - a.createdAt);
}

function applyPostFilters(posts) {
    const query = state.ui.query.trim().toLowerCase();
    const shouldFilterByCategory = state.ui.view === "home" && state.ui.category !== "Todos";

    return posts.filter((post) => {
        if (!post) {
            return false;
        }

        if (shouldFilterByCategory && post.category !== state.ui.category) {
            return false;
        }

        if (!query) {
            return true;
        }

        const haystack = [
            post.title,
            post.caption,
            post.category,
            post.author.name,
            post.author.handle,
            ...(post.tags || [])
        ]
            .join(" ")
            .toLowerCase();

        return haystack.includes(query);
    });
}

function calculateHomeScore(post, userId) {
    if (post?.rankScores?.home) {
        return post.rankScores.home;
    }

    const context = createRecommendationContext(userId);
    return decoratePostForViewer(post, context)?.rankScores.home || 0;
}

function calculateDiscoveryScore(post, userId = getCurrentUser()?.id || "") {
    if (post?.rankScores?.discover) {
        return post.rankScores.discover;
    }

    if (!userId) {
        return 0;
    }

    const context = createRecommendationContext(userId);
    return decoratePostForViewer(post, context)?.rankScores.discover || 0;
}

function calculateUserScore(user, viewerId, query = "") {
    const posts = getUserPosts(user.id);
    const latestTimestamp = posts[0]?.createdAt || user.lastLoginAt || user.createdAt;
    const ageInHours = Math.max(0.45, (Date.now() - latestTimestamp) / 3600000);
    const freshness = 140 / Math.pow(ageInHours + 1.4, 0.62);
    const followers = getFollowersCount(user.id) * 6;
    const volume = posts.length * 11;
    const engagement = posts.slice(0, 6).reduce((score, post) => {
        return score + getLikeCount(post.id) * 2.4 + getComments(post.id).length * 3.2 + getSaveCount(post.id) * 2.1;
    }, 0);
    const followBoost = viewerId && getFollowingIds(viewerId).includes(user.id) ? 14 : 0;

    if (!query) {
        return freshness + followers + volume + engagement;
    }

    const handle = user.handle.toLowerCase();
    const name = user.name.toLowerCase();
    const bio = user.bio.toLowerCase();
    const location = (user.location || "").toLowerCase();
    const website = (user.website || "").toLowerCase();
    let queryBoost = 0;

    if (handle === query) {
        queryBoost += 320;
    } else if (handle.startsWith(query)) {
        queryBoost += 220;
    } else if (handle.includes(query)) {
        queryBoost += 120;
    }

    if (name === query) {
        queryBoost += 260;
    } else if (name.startsWith(query)) {
        queryBoost += 180;
    } else if (name.includes(query)) {
        queryBoost += 96;
    }

    if (bio.includes(query)) {
        queryBoost += 42;
    }

    if (location.includes(query)) {
        queryBoost += 36;
    }

    if (website.includes(query)) {
        queryBoost += 28;
    }

    return freshness + followers + volume + engagement + followBoost + queryBoost;
}

function toPostView(post, viewerId) {
    if (!post) {
        return null;
    }

    const author = getUserById(post.authorId);

    if (!author) {
        return null;
    }

    const comments = getComments(post.id);

    return {
        ...post,
        postKind: normalizePostKind(post.postKind || (post.distribution === "discussion" ? "discussion" : "art")),
        contentMode: normalizeComposerContentMode(post.contentMode),
        distribution: normalizePostDistribution(post.distribution),
        author,
        comments,
        commentsCount: comments.length,
        likesCount: getLikeCount(post.id),
        savesCount: getSaveCount(post.id),
        isOwner: post.authorId === viewerId,
        isLiked: getLikedIds(viewerId).includes(post.id),
        isSaved: getSavedIds(viewerId).includes(post.id),
        isFollowed: post.authorId !== viewerId && getFollowingIds(viewerId).includes(post.authorId)
    };
}

function describeActivity(entry, actor, post) {
    switch (entry.type) {
        case "new-post":
            return {
                title: "Novo post no feed",
                subtitle: post ? post.title : `@${actor.handle}`,
                body: "O post novo ja pode aparecer para quem acompanha essa conta."
            };
        case "like":
            return {
                title: "Curtiu seu post",
                subtitle: post ? post.title : `@${actor.handle}`,
                body: "Mais uma curtida entrou nesse post."
            };
        case "comment":
            return {
                title: "Comentou no seu post",
                subtitle: post ? post.title : `@${actor.handle}`,
                body: entry.text || "Tem comentario novo esperando no post."
            };
        case "reply":
            return {
                title: "Respondeu um comentario seu",
                subtitle: post ? post.title : `@${actor.handle}`,
                body: entry.text || "A conversa ganhou uma nova resposta."
            };
        case "follow":
            return {
                title: "Comecou a seguir voce",
                subtitle: `@${actor.handle}`,
                body: "Agora essa conta acompanha seus proximos posts."
            };
        case "published":
        default:
            return {
                title: "Seu post entrou no ar",
                subtitle: post ? post.title : "Publicacao nova",
                body: "Agora ele aparece no seu perfil e no inicio da rede."
            };
    }
}

function getActivitiesForUser(userId) {
    return (state.db.activitiesByUser[userId] || []).slice().sort((a, b) => b.createdAt - a.createdAt);
}

function filterActivitiesByTab(activities, tab) {
    switch (tab) {
        case "interactions":
            return activities.filter((entry) => ["like", "comment", "reply"].includes(entry.type));
        case "follows":
            return activities.filter((entry) => entry.type === "follow");
        case "posts":
            return activities.filter((entry) => ["new-post", "published"].includes(entry.type));
        case "all":
        default:
            return activities;
    }
}

function getSavedAccounts() {
    const recentSet = new Set(state.db.recentAccountIds);
    const recent = state.db.recentAccountIds
        .map((userId) => getUserById(userId))
        .filter(Boolean);
    const others = state.db.users
        .filter((user) => !recentSet.has(user.id))
        .sort((a, b) => (b.lastLoginAt || 0) - (a.lastLoginAt || 0));

    return [...recent, ...others];
}

function getActiveProfileUser(currentUser) {
    const targetUser = getUserById(state.ui.profileUserId);
    return targetUser || currentUser;
}

function getAuthGallerySlides() {
    const recentImages = state.db.posts
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((post) => sanitizeImageSource(post.imageData))
        .filter(Boolean);

    const slides = uniqueList(recentImages);

    while (slides.length < 8) {
        slides.push(getFallbackArt(slides.length));
    }

    return slides.slice(0, 8);
}

function getMediaLibrary() {
    return uniqueList(
        state.db.posts
            .slice()
            .sort((a, b) => b.createdAt - a.createdAt)
            .map((post) => sanitizeImageSource(post.imageData))
            .filter(Boolean)
    )
        .slice(0, 8)
        .map((src, index) => ({
            src,
            label: `Recente ${index + 1}`
        }));
}

function getProfileMediaLibrary(userId) {
    const ownImages = uniqueList(
        getUserPosts(userId)
            .map((post) => sanitizeImageSource(post.imageData))
            .filter(Boolean)
    );

    const library = ownImages.length ? ownImages : getMediaLibrary().map((item) => item.src);

    return library.slice(0, 8).map((src, index) => ({
        src,
        label: ownImages.length ? `Post ${index + 1}` : `Recente ${index + 1}`
    }));
}

function getProfileCover(user) {
    const userCover = sanitizeImageSource(user.coverImage || "");

    if (userCover) {
        return userCover;
    }

    const latestPost = getUserPosts(user.id)[0];

    if (latestPost?.imageData) {
        return latestPost.imageData;
    }

    return getFallbackArt(user.handle.length);
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

    const category = CATEGORIES.includes(rawCategory) ? rawCategory : "Ilustracao";
    const fallbacks = {
        Ilustracao: "Nova ilustracao",
        Fotografia: "Novo clique",
        Sketch: "Novo estudo",
        Poster: "Novo poster",
        Moda: "Novo look",
        "3D": "Nova cena 3D",
        Editorial: "Novo editorial"
    };

    return fallbacks[category] || "Novo post";
}

function getUserById(userId) {
    return state.db.users.find((user) => user.id === userId) || null;
}

function getUserByHandle(handle) {
    return state.db.users.find((user) => user.handle === handle) || null;
}

function getCurrentUser() {
    return getUserById(state.db.sessionUserId);
}

function requireCurrentUser() {
    const user = getCurrentUser();

    if (!user) {
        throw new Error("Voce precisa entrar para continuar.");
    }

    return user;
}

function getPostById(postId) {
    return state.db.posts.find((post) => post.id === postId) || null;
}

function getUserPosts(userId) {
    return state.db.posts
        .filter((post) => post.authorId === userId)
        .sort((a, b) => b.createdAt - a.createdAt);
}

function getComments(postId) {
    return (state.db.commentsByPost[postId] || []).slice();
}

function getCommentById(postId, commentId) {
    return getComments(postId).find((comment) => comment.id === commentId) || null;
}

function buildCommentThreads(comments) {
    const commentMap = new Map(
        comments.map((comment) => [
            comment.id,
            {
                ...comment,
                replies: []
            }
        ])
    );
    const roots = [];

    commentMap.forEach((comment) => {
        if (comment.parentId && commentMap.has(comment.parentId)) {
            commentMap.get(comment.parentId).replies.push(comment);
            return;
        }

        roots.push(comment);
    });

    return sortCommentThreads(roots, true);
}

function sortCommentThreads(comments, newestFirst = false) {
    const sorted = comments
        .slice()
        .sort((a, b) => (newestFirst ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));

    return sorted.map((comment) => ({
        ...comment,
        replies: sortCommentThreads(comment.replies || [], false)
    }));
}

function getLikedIds(userId) {
    return state.db.likesByUser[userId] || [];
}

function getSavedIds(userId) {
    return state.db.savesByUser[userId] || [];
}

function getViewHistory(userId) {
    return state.db.viewHistoryByUser[userId] || [];
}

function getFollowingIds(userId) {
    return state.db.followsByUser[userId] || [];
}

function getFollowingCount(userId) {
    return getFollowingIds(userId).length;
}

function getFollowersCount(userId) {
    return state.db.users.reduce((count, user) => {
        return count + (getFollowingIds(user.id).includes(userId) ? 1 : 0);
    }, 0);
}

function getFollowersOfUser(userId) {
    return state.db.users
        .filter((user) => getFollowingIds(user.id).includes(userId))
        .map((user) => user.id);
}

function getUserCommentsCount(userId) {
    return Object.values(state.db.commentsByPost).reduce((count, comments) => {
        return count + comments.filter((comment) => comment.authorId === userId).length;
    }, 0);
}

function getLikeCount(postId) {
    return Object.values(state.db.likesByUser).reduce((count, likedPosts) => {
        return count + (likedPosts.includes(postId) ? 1 : 0);
    }, 0);
}

function getSaveCount(postId) {
    return Object.values(state.db.savesByUser).reduce((count, savedPosts) => {
        return count + (savedPosts.includes(postId) ? 1 : 0);
    }, 0);
}

function loginUser(userId) {
    const user = getUserById(userId);

    if (!user) {
        return;
    }

    ensureUserCollections(userId);
    user.lastLoginAt = Date.now();
    state.db.sessionUserId = userId;
    state.db.recentAccountIds = [userId, ...state.db.recentAccountIds.filter((id) => id !== userId)].slice(0, 10);
}

function ensureUserCollections(userId) {
    if (!state.db.likesByUser[userId]) {
        state.db.likesByUser[userId] = [];
    }

    if (!state.db.savesByUser[userId]) {
        state.db.savesByUser[userId] = [];
    }

    if (!state.db.followsByUser[userId]) {
        state.db.followsByUser[userId] = [];
    }

    if (!state.db.activitiesByUser[userId]) {
        state.db.activitiesByUser[userId] = [];
    }

    if (!state.db.viewHistoryByUser[userId]) {
        state.db.viewHistoryByUser[userId] = [];
    }
}

function pushActivity(targetUserId, payload) {
    ensureUserCollections(targetUserId);
    state.db.activitiesByUser[targetUserId].unshift({
        id: createId("activity"),
        type: payload.type,
        actorUserId: payload.actorUserId,
        postId: payload.postId || null,
        commentId: payload.commentId || null,
        createdAt: Date.now(),
        text: sanitizeText(payload.text || "", 160)
    });
    state.db.activitiesByUser[targetUserId] = state.db.activitiesByUser[targetUserId].slice(0, 80);
}

function syncComposerDraftFromLiveForm() {
    const composerForm = document.getElementById("composerForm");

    if (composerForm) {
        syncComposerDraftFromForm(composerForm);
    }
}

function syncComposerDraftFromForm(form) {
    const formData = new FormData(form);
    const draft = state.ui.composerDraft;
    const presentation = draft.presentation || createDefaultPostPresentation();
    const requestedPostKind = normalizePostKind(String(formData.get("postKind") || draft.postKind));

    draft.postKind = requestedPostKind;
    draft.title = sanitizeText(String(formData.get("title") || ""), 60);
    draft.caption = sanitizeText(String(formData.get("caption") || ""), 240);
    draft.tags = sanitizeText(String(formData.get("tags") || ""), 90);
    draft.category = CATEGORIES.includes(String(formData.get("category") || ""))
        ? String(formData.get("category"))
        : requestedPostKind === "discussion"
          ? "Editorial"
          : "Ilustracao";
    draft.contentMode =
        requestedPostKind === "discussion"
            ? normalizeComposerContentMode(String(formData.get("contentMode") || "text"))
            : normalizeComposerContentMode(String(formData.get("contentMode") || draft.contentMode));
    draft.distribution =
        requestedPostKind === "discussion"
            ? "discussion"
            : normalizePostDistribution(String(formData.get("distribution") || draft.distribution));
    presentation.surfaceTone = normalizeOptionalColor(String(formData.get("surfaceTone") || ""), DEFAULT_POST_SURFACE_TONE);
    presentation.titleColor = normalizeOptionalColor(String(formData.get("titleColor") || ""), DEFAULT_POST_TITLE_COLOR);
    presentation.captionColor = normalizeOptionalColor(String(formData.get("captionColor") || ""), DEFAULT_POST_CAPTION_COLOR);
    presentation.fontPreset = normalizePostFontPreset(String(formData.get("fontPreset") || presentation.fontPreset));
    presentation.sticker.x = normalizeRangeValue(formData.get("stickerX"), presentation.sticker.x, 0, 100);
    presentation.sticker.y = normalizeRangeValue(formData.get("stickerY"), presentation.sticker.y, 0, 100);
    presentation.sticker.size = normalizeRangeValue(formData.get("stickerSize"), presentation.sticker.size, 12, 72);
    presentation.sticker.rotate = normalizeRangeValue(formData.get("stickerRotate"), presentation.sticker.rotate, -40, 40);
    presentation.sticker.opacity = normalizeRangeValue(formData.get("stickerOpacity"), presentation.sticker.opacity, 35, 100);
    draft.presentation = presentation;
}

function syncProfileDraftFromLiveForm() {
    const profileForm = document.getElementById("profileForm");

    if (profileForm) {
        syncProfileDraftFromForm(profileForm);
    }
}

function syncProfileDraftFromForm(form) {
    const formData = new FormData(form);
    const draft = state.ui.profileDraft;

    draft.name = sanitizeText(String(formData.get("name") || ""), 36);
    draft.bio = sanitizeText(String(formData.get("bio") || ""), 90);
    draft.location = sanitizeText(String(formData.get("location") || ""), 48);
    draft.website = sanitizeText(String(formData.get("website") || ""), 80);
    draft.avatarFocusX = normalizeRangeValue(formData.get("avatarFocusX"), draft.avatarFocusX, 0, 100);
    draft.avatarFocusY = normalizeRangeValue(formData.get("avatarFocusY"), draft.avatarFocusY, 0, 100);
    draft.avatarScale = normalizeScaleValue(formData.get("avatarScale"), draft.avatarScale);
    draft.coverFocusX = normalizeRangeValue(formData.get("coverFocusX"), draft.coverFocusX, 0, 100);
    draft.coverFocusY = normalizeRangeValue(formData.get("coverFocusY"), draft.coverFocusY, 0, 100);
    draft.coverScale = normalizeScaleValue(formData.get("coverScale"), draft.coverScale);

    if (formData.has("avatarTone")) {
        draft.avatarTone = normalizeAvatarTone(String(formData.get("avatarTone") || ""));
    }

    if (formData.has("profileTheme")) {
        draft.profileTheme = normalizeProfileTheme(String(formData.get("profileTheme") || ""));
    }

    if (formData.has("highlightPostId")) {
        draft.highlightPostId = sanitizeText(String(formData.get("highlightPostId") || ""), 80);
    }
}

function applyTheme(theme) {
    state.prefs.theme = "light";
    document.body.dataset.theme = "light";
    applySiteAccent(state.prefs.accentColor);
    refreshBrandAssets();
}

function applySiteAccent(accentColor) {
    const accent = normalizeSiteAccent(accentColor);
    const rgb = hexToRgb(accent);
    const root = document.documentElement;

    root.style.setProperty("--site-accent", accent);
    root.style.setProperty("--site-accent-rgb", `${rgb.red}, ${rgb.green}, ${rgb.blue}`);
    root.style.setProperty("--accent", accent);
    root.style.setProperty("--accent-soft", `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, 0.14)`);
    root.style.setProperty("--glow-a", `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, 0.18)`);
    root.style.setProperty("--glow-b", `rgba(${Math.min(255, rgb.red + 48)}, ${Math.min(255, rgb.green + 48)}, ${Math.min(255, rgb.blue + 48)}, 0.12)`);
    root.style.setProperty("--site-accent-soft", `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, 0.12)`);
    root.style.setProperty("--site-accent-strong", `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, 0.24)`);
    root.style.setProperty("--site-accent-contrast", getContrastColor(accent));
}

function initBrandAssets() {
    refreshBrandAssets();
}

function refreshBrandAssets() {
    const nextSource = logoAssets.dark || LOGO_SOURCE;

    document.querySelectorAll("[data-site-logo]").forEach((element) => {
        if (element.getAttribute("src") !== nextSource) {
            element.setAttribute("src", nextSource);
        }
    });

    if (siteFavicon) {
        siteFavicon.href = nextSource;
        siteFavicon.type = nextSource.startsWith("data:image/png") ? "image/png" : "image/jpeg";
    }
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
        <div class="toast-icon" aria-hidden="true">
            ${renderIcon("sparkles")}
        </div>
        <div class="toast-copy">
            <strong>CONQUEST</strong>
            <span>${escapeHtml(message)}</span>
        </div>
        <span class="toast-progress" aria-hidden="true"></span>
    `;
    toastStack.appendChild(toast);

    while (toastStack.children.length > 3) {
        toastStack.removeChild(toastStack.firstElementChild);
    }

    let timeoutId = window.setTimeout(removeToast, 4200);

    toast.addEventListener("mouseenter", () => {
        window.clearTimeout(timeoutId);
    });

    toast.addEventListener("mouseleave", () => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(removeToast, 1500);
    });

    function removeToast() {
        if (!toast.isConnected) {
            return;
        }

        toast.classList.add("is-leaving");
        window.setTimeout(() => {
            toast.remove();
        }, 240);
    }
}

function handlePointerGlow(event) {
    document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
    document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
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

function normalizeTags(value) {
    return uniqueList(
        String(value || "")
            .split(/[,\s]+/)
            .map((tag) => normalizeTag(tag))
            .filter(Boolean)
    ).slice(0, 6);
}

function createDefaultSticker() {
    return {
        src: "",
        fileName: "",
        x: DEFAULT_MEDIA_FOCUS,
        y: DEFAULT_MEDIA_FOCUS,
        size: 28,
        rotate: 0,
        opacity: 100
    };
}

function createDefaultPostPresentation() {
    return {
        surfaceTone: "",
        titleColor: "",
        captionColor: "",
        fontPreset: POST_FONT_PRESETS[0].id,
        sticker: createDefaultSticker()
    };
}

function normalizeTag(tag) {
    const cleaned = String(tag || "")
        .toLowerCase()
        .trim()
        .replace(/^#+/, "")
        .replace(/[^a-z0-9_-]/g, "");

    return cleaned ? `#${cleaned}` : "";
}

function normalizeAvatarTone(value) {
    return PROFILE_TONES.includes(value) ? value : PROFILE_TONES[0];
}

function normalizeProfileTheme(value) {
    return PROFILE_THEMES.some((theme) => theme.id === value) ? value : PROFILE_THEMES[0].id;
}

function normalizePostFontPreset(value) {
    return POST_FONT_PRESETS.some((preset) => preset.id === value) ? value : POST_FONT_PRESETS[0].id;
}

function normalizeComposerContentMode(value) {
    return value === "text" ? "text" : "media";
}

function normalizePostKind(value) {
    return value === "discussion" ? "discussion" : "art";
}

function normalizePostDistribution(value) {
    return ["both", "feed", "home", "discussion"].includes(value) ? value : "both";
}

function normalizeHexColor(value) {
    const normalized = String(value || "")
        .trim()
        .toLowerCase();

    return /^#[0-9a-f]{6}$/i.test(normalized) ? normalized : "";
}

function normalizeSiteAccent(value) {
    return normalizeHexColor(value) || DEFAULT_SITE_ACCENT;
}

function hexToRgb(hexColor) {
    const normalized = normalizeSiteAccent(hexColor).replace("#", "");

    return {
        red: Number.parseInt(normalized.slice(0, 2), 16),
        green: Number.parseInt(normalized.slice(2, 4), 16),
        blue: Number.parseInt(normalized.slice(4, 6), 16)
    };
}

function normalizeOptionalColor(value, defaultColor = "") {
    const normalized = normalizeHexColor(value);
    const fallback = normalizeHexColor(defaultColor);

    if (!normalized || normalized === fallback) {
        return "";
    }

    return normalized;
}

function clampNumber(value, min, max, fallback) {
    const nextValue = Number(value);

    if (!Number.isFinite(nextValue)) {
        return fallback;
    }

    return Math.min(max, Math.max(min, nextValue));
}

function normalizePercentValue(value, fallback = DEFAULT_MEDIA_FOCUS) {
    return clampNumber(value, 0, 100, fallback);
}

function normalizeRangeValue(value, fallback, min, max) {
    return clampNumber(value, min, max, fallback);
}

function normalizeScaleValue(value, fallback = DEFAULT_MEDIA_SCALE) {
    return clampNumber(value, 1, 2.4, fallback);
}

function normalizePostPresentation(rawValue) {
    const raw = isPlainObject(rawValue) ? rawValue : {};
    const rawSticker = isPlainObject(raw.sticker) ? raw.sticker : {};
    const stickerSrc = sanitizeImageSource(rawSticker.src || raw.stickerData || "");

    return {
        surfaceTone: normalizeHexColor(raw.surfaceTone || ""),
        titleColor: normalizeHexColor(raw.titleColor || ""),
        captionColor: normalizeHexColor(raw.captionColor || ""),
        fontPreset: normalizePostFontPreset(raw.fontPreset),
        sticker: {
            src: stickerSrc,
            fileName: sanitizeText(rawSticker.fileName || raw.stickerFileName || "", 80),
            x: normalizeRangeValue(rawSticker.x ?? raw.stickerX, DEFAULT_MEDIA_FOCUS, 0, 100),
            y: normalizeRangeValue(rawSticker.y ?? raw.stickerY, DEFAULT_MEDIA_FOCUS, 0, 100),
            size: normalizeRangeValue(rawSticker.size ?? raw.stickerSize, 28, 12, 72),
            rotate: normalizeRangeValue(rawSticker.rotate ?? raw.stickerRotate, 0, -40, 40),
            opacity: normalizeRangeValue(rawSticker.opacity ?? raw.stickerOpacity, 100, 35, 100)
        }
    };
}

function getProfileTheme(value) {
    return PROFILE_THEMES.find((theme) => theme.id === normalizeProfileTheme(value)) || PROFILE_THEMES[0];
}

function hexToRgb(color) {
    const normalized = normalizeHexColor(color);

    if (!normalized) {
        return null;
    }

    const red = Number.parseInt(normalized.slice(1, 3), 16);
    const green = Number.parseInt(normalized.slice(3, 5), 16);
    const blue = Number.parseInt(normalized.slice(5, 7), 16);

    return {
        red,
        green,
        blue,
        r: red,
        g: green,
        b: blue
    };
}

function rgbaFromHex(color, alpha) {
    const rgb = hexToRgb(color);

    if (!rgb) {
        return "";
    }

    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function buildInlineStyle(styleMap) {
    const css = Object.entries(styleMap)
        .filter(([, value]) => value !== null && value !== undefined && value !== "")
        .map(([property, value]) => `${property}:${value}`)
        .join(";");

    return css ? ` style="${escapeAttribute(css)}"` : "";
}

function getMediaImageStyleAttribute(focusX, focusY, scale) {
    return buildInlineStyle({
        "--media-focus-x": `${normalizePercentValue(focusX, DEFAULT_MEDIA_FOCUS)}%`,
        "--media-focus-y": `${normalizePercentValue(focusY, DEFAULT_MEDIA_FOCUS)}%`,
        "--media-scale": normalizeScaleValue(scale, DEFAULT_MEDIA_SCALE)
    });
}

function getAvatarImageStyleAttribute(user) {
    return getMediaImageStyleAttribute(user?.avatarFocusX, user?.avatarFocusY, user?.avatarScale);
}

function getCoverImageStyleAttribute(user) {
    return getMediaImageStyleAttribute(user?.coverFocusX, user?.coverFocusY, user?.coverScale);
}

function getPostPresentation(post) {
    return normalizePostPresentation(post?.presentation || post?.design || post?.style || post);
}

function getPostFontClass(post) {
    return `post-font--${escapeHtml(getPostPresentation(post).fontPreset)}`;
}

function getPostVisualStyleAttribute(post) {
    const presentation = getPostPresentation(post);
    const styleMap = {};

    if (presentation.surfaceTone) {
        styleMap["--post-card-tint"] = rgbaFromHex(presentation.surfaceTone, 0.14);
        styleMap["--post-card-glow"] = rgbaFromHex(presentation.surfaceTone, 0.24);
        styleMap["--post-accent-line"] = rgbaFromHex(presentation.surfaceTone, 0.22);
    }

    if (presentation.titleColor) {
        styleMap["--post-title-color"] = presentation.titleColor;
    }

    if (presentation.captionColor) {
        styleMap["--post-caption-color"] = presentation.captionColor;
    }

    return buildInlineStyle(styleMap);
}

function renderPostMediaVisual(post, options = {}) {
    const presentation = getPostPresentation(post);
    const frameClass = ["post-media-stack", options.frameClass].filter(Boolean).join(" ");
    const imageClass = ["post-media-image", options.imageClass].filter(Boolean).join(" ");
    const sticker = presentation.sticker;
    const textFallback = !sanitizeImageSource(post.imageData || "");
    const fallbackTitle = truncateText(post.title || "Post textual", 44);
    const fallbackCaption = truncateText(post.caption || "Um post feito so com texto, mantendo o visual do CONQUEST.", 110);
    const stickerStyle = buildInlineStyle({
        "--sticker-x": `${sticker.x}%`,
        "--sticker-y": `${sticker.y}%`,
        "--sticker-size": `${sticker.size}%`,
        "--sticker-rotate": `${sticker.rotate}deg`,
        "--sticker-opacity": Math.max(0.35, Math.min(1, sticker.opacity / 100)).toFixed(2)
    });

    return `
        <div class="${frameClass} ${textFallback ? "post-media-stack--text-only" : ""}">
            ${
                textFallback
                    ? `
                        <div class="post-media-text-fallback">
                            <span class="post-media-text-kicker">${escapeHtml(post.category || "Texto")}</span>
                            <strong>${escapeHtml(fallbackTitle)}</strong>
                            <p>${escapeHtml(fallbackCaption)}</p>
                        </div>
                    `
                    : `<img class="${imageClass}" src="${escapeAttribute(post.imageData)}" alt="${escapeAttribute(options.alt || post.title || "Post")}">`
            }
            ${
                sticker.src
                    ? `<img class="post-sticker ${escapeHtml(options.stickerClass || "")}" src="${escapeAttribute(sticker.src)}" alt="" aria-hidden="true"${stickerStyle}>`
                    : ""
            }
        </div>
    `;
}

function renderAvatar(user, className) {
    const avatarImage = sanitizeImageSource(user?.avatarImage || "");
    const tone = normalizeAvatarTone(user?.avatarTone);
    const textColor = getContrastColor(tone);

    return `
        <span class="${className}" style="--avatar-tone:${escapeAttribute(tone)};--avatar-ink:${escapeAttribute(textColor)}">
            ${
                avatarImage
                    ? `<img src="${escapeAttribute(avatarImage)}" alt="${escapeAttribute(user?.name || user?.handle || "Perfil")}"${getAvatarImageStyleAttribute(user)}>`
                    : escapeHtml(getInitials(user))
            }
        </span>
    `;
}

function getInitials(user) {
    const source = sanitizeText(user.name || user.handle || "C", 40);
    const parts = source.split(" ").filter(Boolean);

    if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return source.slice(0, 2).toUpperCase();
}

function timeAgo(timestamp) {
    const diff = Math.max(0, Date.now() - Number(timestamp || 0));

    if (diff < 60 * 1000) {
        return "agora";
    }

    if (diff < 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 1000))} min`;
    }

    if (diff < 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (60 * 60 * 1000))} h`;
    }

    if (diff < 7 * 24 * 60 * 60 * 1000) {
        return `${Math.floor(diff / (24 * 60 * 60 * 1000))} d`;
    }

    return fullDate(timestamp);
}

function fullDate(timestamp) {
    return new Date(timestamp).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function formatPostStamp(timestamp) {
    return `${new Date(timestamp).toLocaleDateString("pt-BR")} - ${timeAgo(timestamp)}`;
}

function getWebsiteLabel(website) {
    if (!website) {
        return "";
    }

    try {
        return new URL(website).hostname.replace(/^www\./i, "");
    } catch (error) {
        return "";
    }
}

function getContrastColor(hexColor) {
    const value = String(hexColor || "").replace("#", "");

    if (value.length !== 6) {
        return "#081017";
    }

    const red = Number.parseInt(value.slice(0, 2), 16);
    const green = Number.parseInt(value.slice(2, 4), 16);
    const blue = Number.parseInt(value.slice(4, 6), 16);
    const luminance = (red * 299 + green * 587 + blue * 114) / 1000;

    return luminance > 160 ? "#081017" : "#f8fbff";
}

function capitalizeFirst(value) {
    const text = String(value || "").trim();
    return text ? `${text[0].toUpperCase()}${text.slice(1)}` : "";
}

function truncateText(value, maxLength) {
    const text = String(value || "").replace(/\s+/g, " ").trim();

    if (text.length <= maxLength) {
        return text;
    }

    const slice = text.slice(0, Math.max(1, maxLength - 3));
    const safeEdge = slice.includes(" ") ? slice.slice(0, slice.lastIndexOf(" ")) : slice;

    return `${(safeEdge || slice).trim()}...`;
}

function uniqueList(items) {
    return [...new Set(items)];
}

function mergeUniquePosts(...postLists) {
    const seen = new Set();
    const merged = [];

    postLists.flat().forEach((post) => {
        if (!post?.id || seen.has(post.id)) {
            return;
        }

        seen.add(post.id);
        merged.push(post);
    });

    return merged;
}

function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function fakeDelay(ms = 120) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
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

async function compressImage(file) {
    if (!file.type.startsWith("image/")) {
        throw new Error("Escolha um arquivo de imagem.");
    }

    if (file.size > 6 * 1024 * 1024) {
        throw new Error("Use uma imagem mais leve, com ate 6 MB.");
    }

    if (file.type === "image/gif") {
        if (file.size > 2.4 * 1024 * 1024) {
            throw new Error("Use um GIF com ate 2.4 MB para manter o app leve.");
        }

        return fileToDataUrl(file);
    }

    const dataUrl = await fileToDataUrl(file);
    const image = await loadImage(dataUrl);
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Nao foi possivel preparar essa imagem.");
    }

    context.drawImage(image, 0, 0, width, height);
    const outputType = file.type === "image/png" ? "image/png" : file.type === "image/webp" ? "image/webp" : "image/jpeg";

    return outputType === "image/png" ? canvas.toDataURL(outputType) : canvas.toDataURL(outputType, 0.86);
}

async function readOverlayAsset(file) {
    const allowedTypes = new Set(["image/png", "image/gif", "image/webp"]);

    if (!allowedTypes.has(file.type)) {
        throw new Error("Use um PNG, GIF ou WebP para o sticker.");
    }

    if (file.size > 2.4 * 1024 * 1024) {
        throw new Error("Use um sticker mais leve, com ate 2.4 MB.");
    }

    return fileToDataUrl(file);
}

function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Falha ao ler o arquivo."));
        reader.readAsDataURL(file);
    });
}

function loadImage(source) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Nao foi possivel abrir essa imagem."));
        image.src = source;
    });
}

function getFallbackArt(seed) {
    const palettes = [
        ["#070709", "#16161d", "#f5f5f5", "#9898a4"],
        ["#080808", "#1d1f26", "#e8e8e8", "#7d8796"],
        ["#060709", "#11141a", "#ffffff", "#8f949c"],
        ["#0b0b0f", "#171922", "#ececec", "#a8adb8"],
        ["#09090b", "#14151a", "#f7f7f7", "#848895"],
        ["#050608", "#0e1218", "#efefef", "#9196a3"],
        ["#0a0a0c", "#17171b", "#f3f3f3", "#8a8f98"],
        ["#07080a", "#151922", "#ededed", "#7c8491"]
    ];
    const palette = palettes[seed % palettes.length];
    const [bgA, bgB, light, soft] = palette;
    const x1 = 140 + seed * 48;
    const y1 = 180 + seed * 22;
    const x2 = 560 - seed * 26;
    const y2 = 640 - seed * 14;
    const sizeA = 180 + (seed % 3) * 36;
    const sizeB = 220 + (seed % 4) * 24;
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 960">
            <defs>
                <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="${bgA}" />
                    <stop offset="100%" stop-color="${bgB}" />
                </linearGradient>
                <filter id="b">
                    <feGaussianBlur stdDeviation="26" />
                </filter>
            </defs>
            <rect width="720" height="960" fill="url(#g)" />
            <g filter="url(#b)" opacity="0.92">
                <circle cx="${x1}" cy="${y1}" r="${sizeA}" fill="${light}" opacity="0.52" />
                <circle cx="${x2}" cy="${y2}" r="${sizeB}" fill="${soft}" opacity="0.46" />
                <rect x="180" y="280" width="360" height="260" rx="88" fill="${light}" opacity="0.24" transform="rotate(${seed * 7} 360 410)" />
            </g>
            <g opacity="0.24" stroke="${light}" fill="none" stroke-width="2">
                <path d="M-40 ${220 + seed * 22} C 140 120, 280 360, 540 240 S 860 340, 760 520" />
                <path d="M-20 ${620 - seed * 16} C 180 760, 340 500, 560 680 S 860 740, 760 900" />
            </g>
            <text x="54" y="868" fill="${light}" fill-opacity="0.84" font-family="Arial, sans-serif" font-size="54" font-weight="700">CONQUEST</text>
        </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
