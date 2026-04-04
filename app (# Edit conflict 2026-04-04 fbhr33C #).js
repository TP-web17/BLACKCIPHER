const DB_KEY = "conquest-db-v2";
const PREFS_KEY = "conquest-prefs-v1";
const LEGACY_KEYS = ["conquest-social-v1"];
const CATEGORIES = ["Todos", "Ilustracao", "Fotografia", "Sketch", "Poster", "Moda", "3D", "Editorial"];
const PROFILE_TONES = ["#f4f6fb", "#d8e4ff", "#f5d8ff", "#d7f4ef", "#ffe0cd", "#ffe99f", "#c9d4e6", "#f0d1d1"];
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
        following: "latest",
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
const themeToggle = document.getElementById("themeToggle");
const siteFavicon = document.getElementById("siteFavicon");
const globalSearch = document.getElementById("globalSearch");
const sidebarUser = document.getElementById("sidebarUser");
const topUserPill = document.getElementById("topUserPill");
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
        replyingToCommentId: null,
        composerOpen: false,
        composerDraft: createEmptyDraft(),
        uploadingImage: false,
        profileEditorOpen: false,
        profileDraft: createEmptyProfileDraft(),
        uploadingProfileCover: false
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
        sessionUserId: null,
        recentAccountIds: []
    };
}

function createEmptyDraft() {
    return {
        title: "",
        caption: "",
        tags: "",
        category: "Ilustracao",
        imageData: "",
        fileName: ""
    };
}

function createEmptyProfileDraft(user = null) {
    return {
        name: user?.name || "",
        bio: user?.bio || "",
        location: user?.location || "",
        website: user?.website || "",
        avatarTone: user?.avatarTone || PROFILE_TONES[0],
        coverImage: user?.coverImage || "",
        coverFileName: ""
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
            return { theme: "dark" };
        }

        return {
            theme: parsed.theme === "light" ? "light" : "dark"
        };
    } catch (error) {
        return { theme: "dark" };
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
            avatarTone: normalizeAvatarTone(user.avatarTone),
            coverImage: sanitizeImageSource(user.coverImage || ""),
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

        if (!validUserIds.has(post.authorId) || typeof post.imageData !== "string" || !post.imageData) {
            return;
        }

        validPosts.push({
            id: post.id,
            authorId: post.authorId,
            caption: sanitizeText(post.caption || "", 240),
            category: CATEGORIES.includes(post.category) ? post.category : "Ilustracao",
            tags: Array.isArray(post.tags) ? uniqueList(post.tags.map((tag) => normalizeTag(tag)).filter(Boolean)).slice(0, 6) : [],
            imageData: post.imageData,
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
    state.db.likesByUser = cleanInteractionMap(state.db.likesByUser, validUserIds, validPostIds);
    state.db.savesByUser = cleanInteractionMap(state.db.savesByUser, validUserIds, validPostIds);
    state.db.followsByUser = cleanFollowMap(state.db.followsByUser, validUserIds);
    state.db.commentsByPost = cleanCommentMap(state.db.commentsByPost, validPostIds, validUserIds);
    state.db.activitiesByUser = cleanActivityMap(state.db.activitiesByUser, validUserIds, validPostIds);
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

    themeToggle.addEventListener("click", () => {
        state.prefs.theme = state.prefs.theme === "dark" ? "light" : "dark";
        applyTheme(state.prefs.theme);
        persistPrefs();
        renderFrame();
    });

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

            if (state.ui.view === "profile") {
                state.ui.profileUserId = getCurrentUser()?.id || null;
            }

            renderFrame();
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
                await api.logout();
                state.ui.viewTabs = createDefaultViewTabs();
                state.ui.profileUserId = null;
                state.ui.postModalId = null;
                state.ui.replyingToCommentId = null;
                state.ui.composerOpen = false;
                state.ui.composerDraft = createEmptyDraft();
                state.ui.profileEditorOpen = false;
                state.ui.profileDraft = createEmptyProfileDraft();
                renderAll();
                showToast("Voce saiu.");
                return;
            }

            if (action === "open-composer") {
                state.ui.composerDraft = createEmptyDraft();
                state.ui.composerOpen = true;
                renderComposerModal();
                return;
            }

            if (action === "close-composer") {
                closeComposer();
                return;
            }

            if (action === "open-post") {
                state.ui.postModalId = actionButton.dataset.postId || null;
                state.ui.replyingToCommentId = null;
                renderPostModal();
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
                state.ui.postModalId = null;
                state.ui.replyingToCommentId = null;
                renderAll();
                return;
            }

            if (action === "close-post-modal") {
                state.ui.replyingToCommentId = null;
                closePostModal();
                return;
            }

            if (action === "open-profile-editor") {
                const user = requireCurrentUser();
                state.ui.profileDraft = createEmptyProfileDraft(user);
                state.ui.profileEditorOpen = true;
                renderProfileEditorModal();
                return;
            }

            if (action === "close-profile-editor") {
                closeProfileEditor();
                return;
            }

            if (action === "toggle-like") {
                await api.toggleLike(actionButton.dataset.postId || "");
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
                state.ui.replyingToCommentId = actionButton.dataset.commentId || null;
                renderPostModal();
                focusCommentComposer();
                return;
            }

            if (action === "cancel-comment-reply") {
                state.ui.replyingToCommentId = null;
                renderPostModal();
                focusCommentComposer();
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
                renderProfileEditorModal();
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

                state.ui.view = "home";
                state.ui.postModalId = createdPost.id;
                state.ui.composerOpen = false;
                state.ui.composerDraft = createEmptyDraft();
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
        }

        if (profileForm) {
            syncProfileDraftFromForm(profileForm);
        }
    });

    document.addEventListener("change", async (event) => {
        const fileInput = event.target.closest("#composerFile");
        const composerForm = event.target.closest("#composerForm");
        const profileCoverInput = event.target.closest("#profileCoverFile");
        const profileForm = event.target.closest("#profileForm");
        const profileToneInput = event.target.closest('input[name="avatarTone"]');

        if (composerForm) {
            syncComposerDraftFromForm(composerForm);
        }

        if (profileForm) {
            syncProfileDraftFromForm(profileForm);
        }

        if (profileToneInput && profileForm) {
            renderProfileEditorModal();
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

        if (profileCoverInput && profileCoverInput.files && profileCoverInput.files[0]) {
            try {
                state.ui.uploadingProfileCover = true;
                syncProfileDraftFromLiveForm();
                renderProfileEditorModal();

                const imageData = await compressImage(profileCoverInput.files[0]);
                state.ui.profileDraft.coverImage = imageData;
                state.ui.profileDraft.coverFileName = profileCoverInput.files[0].name;
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
            avatarTone: PROFILE_TONES[state.db.users.length % PROFILE_TONES.length],
            coverImage: "",
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
        const avatarTone = normalizeAvatarTone(payload.avatarTone);
        const coverImage = sanitizeImageSource(payload.coverImage || "");

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
        user.avatarTone = avatarTone;
        user.coverImage = coverImage;
        persistDb();

        return user;
    },

    async createPost(payload) {
        await fakeDelay(160);

        const user = requireCurrentUser();
        const caption = sanitizeText(payload.caption || "", 240);
        const category = CATEGORIES.includes(payload.category) && payload.category !== "Todos" ? payload.category : "Ilustracao";
        const title = derivePostTitle(payload.title || "", caption, category);
        const tags = normalizeTags(payload.tags || "");
        const imageData = sanitizeImageSource(payload.imageData || "");

        if (!imageData) {
            throw new Error("Escolha uma imagem para publicar.");
        }

        const post = {
            id: createId("post"),
            authorId: user.id,
            title,
            caption,
            category,
            tags,
            imageData,
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
        viewRoot.innerHTML = "";
        syncNavigation();
        document.body.classList.toggle("modal-open", false);
        return;
    }

    if (!state.ui.profileUserId) {
        state.ui.profileUserId = user.id;
    }

    renderSidebarUser(user);
    renderTopUserPill(user);
    syncNavigation();
    renderView();
}

function updateThemeToggleControl() {
    const nextModeLabel = state.prefs.theme === "dark" ? "Claro" : "Escuro";
    const nextModeAria = state.prefs.theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
    const textNode = themeToggle.querySelector(".button-text");

    if (textNode) {
        textNode.textContent = nextModeLabel;
    } else {
        themeToggle.textContent = nextModeLabel;
    }

    themeToggle.setAttribute("aria-label", nextModeAria);
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

function renderTopUserPill(user) {
    topUserPill.innerHTML = `
        ${renderProfileIdentity(user, {
            avatarClass: "mini-avatar",
            copyClass: "user-pill-copy",
            meta: `@${user.handle}`,
            className: "profile-link profile-link--pill"
        })}
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
        state.ui.view === "following"
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
    const rankedPosts = getHomePosts(user.id);
    const featured = query ? rankedPosts.slice(0, 3) : rankedPosts.slice(1, 4);
    const gridPosts = query ? rankedPosts.slice(3) : rankedPosts.slice(4);
    const discoverUsers = query ? [] : getDiscoverUsers(user.id, 4);
    const matchingUsers = query ? getMatchingUsers(query, user.id).slice(0, 6) : [];

    return `
        <div class="view-stack view-stack--home">
            ${
                query
                    ? renderHero({
                          kicker: "Busca",
                          title: `Resultados para "${query}"`,
                          text: "Perfis, tags e posts que combinam com a sua busca aparecem aqui.",
                          stats: [
                              { value: formatCompact.format(matchingUsers.length), label: "perfis" },
                              { value: formatCompact.format(rankedPosts.length), label: "posts encontrados" },
                              { value: formatCompact.format(getFollowingCount(user.id)), label: "seguindo" }
                          ]
                      })
                    : renderHomeSpotlight(user, rankedPosts)
            }
            <section class="tag-strip tag-strip--modes">
                <div class="strip-copy">
                    <span class="section-kicker">${escapeHtml(query ? "Busca viva" : "Ritmo da rede")}</span>
                    <p>${escapeHtml(query ? "Refine por pessoas, tags e categorias para chegar em resultados mais precisos." : "Uma vitrine com pulso editorial para alternar entre o que esta quente, o que acabou de entrar e o que merece descoberta.")}</p>
                </div>
                ${
                    query
                        ? `
                            <div class="trend-pill-row">
                                <span class="trend-pill is-active">${escapeHtml(formatMetricLabel(matchingUsers.length, "perfil", "perfis"))}</span>
                                <span class="trend-pill">${escapeHtml(formatMetricLabel(rankedPosts.length, "post", "posts"))}</span>
                                <span class="trend-pill">${escapeHtml(state.ui.category === "Todos" ? "Todas as categorias" : state.ui.category)}</span>
                            </div>
                        `
                        : `
                            <div class="trend-pill-row">
                                <span class="trend-pill is-active">Em alta agora</span>
                                <span class="trend-pill">Recem publicadas</span>
                                <span class="trend-pill">Descobertas da semana</span>
                            </div>
                        `
                }
            </section>
            <section class="filter-strip">
                ${CATEGORIES.map((category) => renderFilterButton(category)).join("")}
            </section>
            ${query ? renderPeopleSection({
                viewerId: user.id,
                users: matchingUsers,
                kicker: "Pessoas",
                title: "Perfis que combinam com a busca",
                text: "Abra o perfil ou siga direto daqui para continuar montando o seu feed."
            }) : renderPeopleSection({
                viewerId: user.id,
                users: discoverUsers,
                kicker: "Descobrir",
                title: "Contas que valem um follow",
                text: "Perfis ativos que podem aparecer bem no seu inicio conforme voce acompanha."
            })}
            ${
                rankedPosts.length
                    ? `
                        <section class="featured-grid">
                            ${featured
                                .map((post, index) =>
                                    renderArtCard(post, {
                                        featured: true,
                                        main: index === 0
                                    })
                                )
                                .join("")}
                        </section>
                        ${
                            gridPosts.length
                                ? `
                                    <section class="art-grid">
                                        ${gridPosts.map((post) => renderArtCard(post)).join("")}
                                    </section>
                                `
                                : ""
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

    return `
        <section class="view-hero view-hero--editorial">
            <div class="hero-main">
                <div class="hero-copy-shell">
                    <span class="section-kicker">Inicio</span>
                    <div>
                        <h1>Hoje no CONQUEST</h1>
                        <p>As obras mais salvas, comentadas e descobertas agora, com uma primeira dobra mais viva, editorial e luminosa.</p>
                    </div>
                    <div class="hero-stats">
                        <div class="hero-stat">
                            <strong>${escapeHtml(formatCompact.format(state.db.users.length))}</strong>
                            <span>artistas ativos</span>
                        </div>
                        <div class="hero-stat">
                            <strong>${escapeHtml(formatCompact.format(posts.length))}</strong>
                            <span>obras no radar</span>
                        </div>
                        <div class="hero-stat">
                            <strong>${escapeHtml(formatCompact.format(getFollowingCount(user.id)))}</strong>
                            <span>seguindo agora</span>
                        </div>
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
                        <img src="${escapeAttribute(spotlight.imageData)}" alt="${escapeAttribute(spotlight.title)}">
                    </button>
                    <div class="hero-feature-copy">
                        <div class="hero-feature-top">
                            <span class="meta-pill">${escapeHtml(spotlight.category)}</span>
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
                                                    <img src="${escapeAttribute(post.imageData)}" alt="${escapeAttribute(post.title)}">
                                                </span>
                                                <span class="hero-rail-copy">
                                                    <strong>${escapeHtml(post.title)}</strong>
                                                    <span>@${escapeHtml(post.author.handle)} - ${escapeHtml(timeAgo(post.createdAt))}</span>
                                                </span>
                                                <span class="hero-rail-metric">${escapeHtml(formatCompact.format(post.savesCount))} salvos</span>
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
    const posts = getFollowingPosts(user.id);
    const followingCount = getFollowingCount(user.id);
    const people = query ? getMatchingUsers(query, user.id).slice(0, 4) : getDiscoverUsers(user.id, 4);

    return `
        <div class="view-stack">
            ${renderHero({
                kicker: "Seguindo",
                title: query ? "No seu feed e em volta dele" : "Somente de quem voce segue.",
                text: query
                    ? "Posts do seu feed e perfis relacionados ao que voce buscou."
                    : "Um feed direto com os posts mais recentes das contas que voce escolheu acompanhar.",
                stats: [
                    { value: formatCompact.format(followingCount), label: "contas" },
                    { value: formatCompact.format(posts.length), label: "posts no feed" },
                    { value: formatCompact.format(getFollowersCount(user.id)), label: "seguidores" }
                ]
            })}
            ${renderPeopleSection({
                viewerId: user.id,
                users: people,
                kicker: query ? "Perfis" : "Expandir feed",
                title: query ? "Perfis relacionados a essa busca" : followingCount ? "Talvez voce curta acompanhar tambem" : "Comece seguindo algumas contas",
                text: query
                    ? "Mesmo fora do seu feed atual, estes perfis combinam com o que voce esta procurando."
                    : followingCount
                      ? "Mais contas ativas para deixar seu feed mais vivo."
                      : "Siga algumas pessoas e esse feed fica muito melhor para testar."
            })}
            ${
                posts.length
                    ? `
                        <section class="feed-list">
                            ${posts.map((post) => renderFeedCard(post)).join("")}
                        </section>
                    `
                    : renderEmptyState({
                          kicker: "Seguindo",
                          title: query ? "Nenhum post do seu feed bateu com essa busca." : "Nada novo por aqui ainda.",
                          subtitle: query
                              ? "Tente outro termo ou limpe a busca para ver o feed completo."
                              : "As contas que voce segue ainda nao publicaram nada novo.",
                          text: query
                              ? "Os perfis acima podem ajudar a encontrar gente nova para acompanhar."
                              : "Quando alguem postar, este feed atualiza e traz o que chegou por ultimo.",
                          action: "",
                          actionLabel: null
                      })
            }
        </div>
    `;
}

function renderSavedView(user) {
    const posts = getSavedPosts(user.id);

    return `
        <div class="view-stack">
            ${renderHero({
                kicker: "Salvos",
                title: "O que voce guardou para voltar depois.",
                text: "Uma selecao pessoal de imagens, referencias e posts que valem outra olhada.",
                stats: [
                    { value: formatCompact.format(posts.length), label: "posts salvos" },
                    { value: formatCompact.format(getUserPosts(user.id).length), label: "posts seus" },
                    { value: formatCompact.format(getUserCommentsCount(user.id)), label: "comentarios" }
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
    const activities = getActivitiesForUser(user.id);

    return `
        <div class="view-stack">
            ${renderHero({
                kicker: "Atividade",
                title: "Tudo o que rolou com sua conta.",
                text: "Curtidas, comentarios, novos seguidores e atualizacoes recentes em um so lugar.",
                stats: [
                    { value: formatCompact.format(activities.length), label: "itens recentes" },
                    { value: formatCompact.format(getFollowersCount(user.id)), label: "seguidores" },
                    { value: formatCompact.format(getUserPosts(user.id).length), label: "posts ativos" }
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
    const highlightPost = posts[0] || null;
    const websiteLabel = getWebsiteLabel(profileUser.website);
    const coverImage = getProfileCover(profileUser);

    return `
        <div class="view-stack">
            <section class="profile-hero">
                <div class="profile-cover">
                    <img src="${escapeAttribute(coverImage)}" alt="${escapeAttribute(profileUser.name)}">
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
                    <div class="profile-meta-row">
                        <span class="meta-pill">${escapeHtml(`${formatCompact.format(getUserPosts(profileUser.id).length)} posts`)}</span>
                        <span class="meta-pill">${escapeHtml(`${formatCompact.format(getFollowersCount(profileUser.id))} seguidores`)}</span>
                        <span class="meta-pill">${escapeHtml(`${formatCompact.format(getFollowingCount(profileUser.id))} seguindo`)}</span>
                        ${profileUser.location ? `<span class="meta-pill">${escapeHtml(profileUser.location)}</span>` : ""}
                        ${websiteLabel ? `<a class="meta-pill meta-link" href="${escapeAttribute(profileUser.website)}" target="_blank" rel="noreferrer">${escapeHtml(websiteLabel)}</a>` : ""}
                    </div>
                </div>
            </section>
            ${
                highlightPost
                    ? `
                        <section class="profile-featured">
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
                                    <img src="${escapeAttribute(highlightPost.imageData)}" alt="${escapeAttribute(highlightPost.title)}">
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
            <section class="section-shell">
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
                <path d="M12 20s-6.7-4.3-8.7-8A5.3 5.3 0 0 1 12 5a5.3 5.3 0 0 1 8.7 7c-2 3.7-8.7 8-8.7 8Z"></path>
            </svg>
        `,
        save: `
            <svg viewBox="0 0 24 24">
                <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-3-6 3V5a1 1 0 0 1 1-1Z"></path>
            </svg>
        `,
        delete: `
            <svg viewBox="0 0 24 24">
                <path d="M4 7h16"></path>
                <path d="M9 4h6"></path>
                <path d="M7 7l1 12h8l1-12"></path>
                <path d="M10 11v5"></path>
                <path d="M14 11v5"></path>
            </svg>
        `,
        follow: `
            <svg viewBox="0 0 24 24">
                <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
                <path d="M4.5 20a7.5 7.5 0 0 1 10.8-6.7"></path>
                <path d="M18 11v6"></path>
                <path d="M15 14h6"></path>
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
                <path d="M4 20h4l10-10-4-4L4 16v4Z"></path>
                <path d="m13 5 4 4"></path>
            </svg>
        `,
        open: `
            <svg viewBox="0 0 24 24">
                <path d="M7 17 17 7"></path>
                <path d="M9 7h8v8"></path>
            </svg>
        `,
        close: `
            <svg viewBox="0 0 24 24">
                <path d="m6 6 12 12"></path>
                <path d="M18 6 6 18"></path>
            </svg>
        `,
        logout: `
            <svg viewBox="0 0 24 24">
                <path d="M10 6H7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"></path>
                <path d="M13 16l5-4-5-4"></path>
                <path d="M18 12H9"></path>
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

    return `
        <article class="user-card">
            <button class="user-card-cover" type="button" data-action="open-profile" data-user-id="${escapeHtml(user.id)}">
                <img src="${escapeAttribute(getProfileCover(user))}" alt="${escapeAttribute(user.name)}">
            </button>
            <div class="user-card-body">
                <div class="user-card-head">
                    ${renderProfileIdentity(user, {
                        avatarClass: "mini-avatar",
                        copyClass: "profile-link-copy",
                        meta: `@${user.handle}`,
                        className: "profile-link"
                    })}
                </div>
                <p class="user-card-bio">${escapeHtml(user.bio)}</p>
                <div class="user-card-stats">
                    <span class="meta-pill">${escapeHtml(formatMetricLabel(posts.length, "post", "posts"))}</span>
                    <span class="meta-pill">${escapeHtml(formatMetricLabel(getFollowersCount(user.id), "seguidor", "seguidores"))}</span>
                    <span class="meta-pill">${escapeHtml(latestPost ? `ativo ${timeAgo(latestPost.createdAt)}` : "perfil novo")}</span>
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

function renderFeedCommentPreview(post) {
    const previewComments = post.comments.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 2);

    if (!previewComments.length) {
        return `
            <div class="feed-comments-empty">
                <span>Os comentarios aparecem aqui assim que a conversa comecar.</span>
            </div>
        `;
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
                    </div>
                </div>
            `;
        })
        .join("");
}

function renderArtCard(post, options = {}) {
    const classes = ["art-card"];

    if (options.featured) {
        classes.push("art-card--featured");
    }

    if (options.main) {
        classes.push("is-main");
    }

    return `
        <article class="${classes.join(" ")}">
            <button class="art-cover" type="button" data-action="open-post" data-post-id="${escapeHtml(post.id)}">
                <img src="${escapeAttribute(post.imageData)}" alt="${escapeAttribute(post.title)}">
                <div class="art-cover-top">
                    <span class="meta-pill">${escapeHtml(post.category)}</span>
                    <span class="art-like">${escapeHtml(formatCompact.format(post.likesCount))}</span>
                </div>
                <div class="art-cover-bottom">
                    <div class="art-cover-copy">
                        <strong>${escapeHtml(post.title)}</strong>
                        <span>@${escapeHtml(post.author.handle)}</span>
                    </div>
                    <div class="art-cover-stats">
                        <span>${escapeHtml(formatCompact.format(post.savesCount))} salvos</span>
                        <span>${escapeHtml(formatCompact.format(post.commentsCount))} comentarios</span>
                    </div>
                </div>
            </button>
            <div class="art-meta">
                ${renderProfileIdentity(post.author, {
                    avatarClass: "mini-avatar",
                    copyClass: "profile-link-copy",
                    meta: `@${post.author.handle}`,
                    className: "profile-link profile-link--card"
                })}
                <p class="art-caption">${escapeHtml(truncateText(post.caption || "Sem legenda por enquanto.", options.main ? 148 : 104))}</p>
                <div class="art-stats">
                    ${renderMetricText("like", formatMetricLabel(post.likesCount, "curtida", "curtidas"))}
                    ${renderMetricText("open", formatMetricLabel(post.commentsCount, "comentario", "comentarios"))}
                    ${renderMetricText("save", formatMetricLabel(post.savesCount, "salvo", "salvos"))}
                </div>
                <div class="meta-line">
                    <span class="meta-pill">${escapeHtml(timeAgo(post.createdAt))}</span>
                    ${(post.tags || [])
                        .slice(0, 3)
                        .map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`)
                        .join("")}
                </div>
                <div class="card-actions">
                    <button class="ghost-button" type="button" data-action="open-post" data-post-id="${escapeHtml(post.id)}">
                        ${renderButtonContent("open", "Abrir")}
                    </button>
                    <button
                        class="action-button ${post.isSaved ? "is-active" : ""}"
                        type="button"
                        data-action="toggle-save"
                        data-post-id="${escapeHtml(post.id)}"
                    >
                        ${renderButtonContent("save", "Coletar")}
                    </button>
                    <button
                        class="action-button ${post.isLiked ? "is-active" : ""}"
                        type="button"
                        data-action="toggle-like"
                        data-post-id="${escapeHtml(post.id)}"
                    >
                        ${renderButtonContent("like", "Admirar")}
                    </button>
                </div>
            </div>
        </article>
    `;
}

function renderFeedCard(post) {
    return `
        <article class="feed-card">
            <div class="feed-card-head">
                <div class="feed-meta">
                    ${renderProfileIdentity(post.author, {
                        avatarClass: "mini-avatar",
                        copyClass: "profile-link-copy",
                        meta: `@${post.author.handle} - ${timeAgo(post.createdAt)}`,
                        className: "profile-link profile-link--feed"
                    })}
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
                        : ""
                }
            </div>
            <div class="feed-layout">
                <button class="feed-image" type="button" data-action="open-post" data-post-id="${escapeHtml(post.id)}">
                    <img src="${escapeAttribute(post.imageData)}" alt="${escapeAttribute(post.title)}">
                    <div class="feed-image-dock">
                        ${renderMetricText("like", formatCompact.format(post.likesCount))}
                        ${renderMetricText("open", formatCompact.format(post.commentsCount))}
                    </div>
                </button>
                <div class="feed-side">
                    <div class="feed-summary">
                        <div class="feed-panel-head">
                            <strong>Pulso</strong>
                            <span>${escapeHtml(timeAgo(post.createdAt))}</span>
                        </div>
                        <div class="feed-summary-line">
                            <strong>${escapeHtml(formatMetricLabel(post.likesCount, "curtida", "curtidas"))}</strong>
                            <span>${escapeHtml(formatMetricLabel(post.commentsCount, "comentario", "comentarios"))}</span>
                        </div>
                        <div class="feed-summary-line">
                            <span>${escapeHtml(post.category)}</span>
                            <span>${escapeHtml(formatMetricLabel(post.savesCount, "salvo", "salvos"))}</span>
                        </div>
                    </div>
                    <div class="card-copy feed-copy">
                        <strong>${escapeHtml(post.title)}</strong>
                        <span>por @${escapeHtml(post.author.handle)}</span>
                    </div>
                    <p class="feed-caption">${escapeHtml(post.caption || "Sem legenda.")}</p>
                    <div class="meta-line">
                        <span class="meta-pill">${escapeHtml(post.category)}</span>
                        ${(post.tags || [])
                            .slice(0, 3)
                            .map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`)
                            .join("")}
                    </div>
                    <div class="feed-comments-preview">
                        <div class="feed-panel-head">
                            <strong>Conversa</strong>
                            <span>${escapeHtml(formatMetricLabel(post.commentsCount, "mensagem", "mensagens"))}</span>
                        </div>
                        ${renderFeedCommentPreview(post)}
                    </div>
                </div>
            </div>
            <div class="feed-actions">
                <div class="feed-actions-left">
                    <button
                        class="action-button ${post.isLiked ? "is-active" : ""}"
                        type="button"
                        data-action="toggle-like"
                        data-post-id="${escapeHtml(post.id)}"
                    >
                        ${renderButtonContent("like", `Curtir ${formatCompact.format(post.likesCount)}`)}
                    </button>
                    <button
                        class="action-button ${post.isSaved ? "is-active" : ""}"
                        type="button"
                        data-action="toggle-save"
                        data-post-id="${escapeHtml(post.id)}"
                    >
                        ${renderButtonContent("save", `Salvar ${formatCompact.format(post.savesCount)}`)}
                    </button>
                    ${
                        post.isOwner
                            ? `
                                <button
                                    class="action-button action-button--danger"
                                    type="button"
                                    data-action="delete-post"
                                    data-post-id="${escapeHtml(post.id)}"
                                >
                                    ${renderButtonContent("delete", "Remover")}
                                </button>
                            `
                            : ""
                    }
                </div>
                <span class="activity-meta">Publicado ${escapeHtml(timeAgo(post.createdAt))}</span>
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
        currentUser && state.ui.postModalId ? toPostView(getPostById(state.ui.postModalId), currentUser.id) : null;
    const isOpen = Boolean(post);

    postModal.classList.toggle("is-open", isOpen);

    if (!post) {
        postModalContent.innerHTML = "";
        syncBodyModalState();
        return;
    }

    postModalContent.innerHTML = `
        <div class="post-modal-layout">
            <div class="modal-media">
                <img src="${escapeAttribute(post.imageData)}" alt="${escapeAttribute(post.title)}">
            </div>
            <div class="modal-side">
                <button class="ghost-button modal-close" type="button" data-action="close-post-modal">
                    ${renderButtonContent("close", "Fechar")}
                </button>
                <div class="modal-author">
                    ${renderProfileIdentity(post.author, {
                        avatarClass: "mini-avatar",
                        copyClass: "profile-link-copy",
                        meta: `@${post.author.handle} - ${timeAgo(post.createdAt)}`,
                        className: "profile-link profile-link--modal"
                    })}
                </div>
                <div class="modal-copy">
                    <span class="section-kicker">${escapeHtml(post.category)}</span>
                    <h2>${escapeHtml(post.title)}</h2>
                    <p>${escapeHtml(post.caption || "Sem legenda.")}</p>
                </div>
                <div class="meta-line">
                    ${(post.tags.length ? post.tags : ["#conquest"])
                        .map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`)
                        .join("")}
                </div>
                <div class="modal-actions">
                    <button
                        class="action-button ${post.isLiked ? "is-active" : ""}"
                        type="button"
                        data-action="toggle-like"
                        data-post-id="${escapeHtml(post.id)}"
                    >
                        ${renderButtonContent("like", "Curtir")}
                    </button>
                    <button
                        class="action-button ${post.isSaved ? "is-active" : ""}"
                        type="button"
                        data-action="toggle-save"
                        data-post-id="${escapeHtml(post.id)}"
                    >
                        ${renderButtonContent("save", "Salvar")}
                    </button>
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
                                    class="action-button action-button--danger"
                                    type="button"
                                    data-action="delete-post"
                                    data-post-id="${escapeHtml(post.id)}"
                                >
                                    ${renderButtonContent("delete", "Remover")}
                                </button>
                            `
                    }
                </div>
                <div class="hero-stats">
                    <div class="hero-stat">
                        <strong>${escapeHtml(formatCompact.format(post.likesCount))}</strong>
                        <span>${escapeHtml(post.likesCount === 1 ? "curtida" : "curtidas")}</span>
                    </div>
                    <div class="hero-stat">
                        <strong>${escapeHtml(formatCompact.format(post.commentsCount))}</strong>
                        <span>${escapeHtml(post.commentsCount === 1 ? "comentario" : "comentarios")}</span>
                    </div>
                    <div class="hero-stat">
                        <strong>${escapeHtml(formatCompact.format(post.savesCount))}</strong>
                        <span>${escapeHtml(post.savesCount === 1 ? "salvo" : "salvos")}</span>
                    </div>
                </div>
                <div class="comment-list">
                    ${
                        post.comments.length
                            ? post.comments
                                  .slice()
                                  .sort((a, b) => b.createdAt - a.createdAt)
                                  .map((comment) => renderComment(comment, post))
                                  .join("")
                            : `
                                <div class="comment-body">
                                    <div class="card-copy">
                                        <strong>Nenhum comentario ainda.</strong>
                                        <span>Seja a primeira pessoa a comentar.</span>
                                    </div>
                                    <p>As respostas entram aqui e tambem aparecem na previa do feed.</p>
                                </div>
                            `
                    }
                </div>
                <form class="comment-form" data-post-id="${escapeHtml(post.id)}">
                    <input name="comment" type="text" maxlength="220" placeholder="Escreva um comentario" required>
                    <button class="primary-button" type="submit">Comentar</button>
                </form>
            </div>
        </div>
    `;

    syncBodyModalState();
}

function renderComment(comment, post) {
    const author = getUserById(comment.authorId);
    const currentUser = getCurrentUser();

    if (!author || !currentUser) {
        return "";
    }

    const canDelete = currentUser.id === comment.authorId || currentUser.id === post.author.id;

    return `
        <div class="comment-row">
            ${renderProfileIdentity(author, {
                avatarClass: "mini-avatar",
                copyClass: "comment-copy",
                meta: `@${author.handle} - ${timeAgo(comment.createdAt)}`,
                className: "profile-link profile-link--comment"
            })}
            <div class="comment-body">
                <p>${escapeHtml(comment.text)}</p>
            </div>
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
    `;
}

function renderComposerModal() {
    const isOpen = state.ui.composerOpen && Boolean(getCurrentUser());
    composerModal.classList.toggle("is-open", isOpen);

    if (!isOpen) {
        composerModalContent.innerHTML = "";
        syncBodyModalState();
        return;
    }

    const draft = state.ui.composerDraft;
    const previewImage = draft.imageData || getAuthGallerySlides()[0];
    const previewTitle = derivePostTitle(draft.title, draft.caption, draft.category || "Ilustracao");
    const library = getMediaLibrary();
    const canPublish = Boolean(draft.imageData) && !state.ui.uploadingImage;

    composerModalContent.innerHTML = `
        <div class="composer-layout">
            <aside class="composer-preview">
                <div class="composer-preview-card">
                    <img src="${escapeAttribute(previewImage)}" alt="${escapeAttribute(previewTitle || "Preview do post")}">
                    <div class="card-copy">
                        <strong>${escapeHtml(previewTitle)}</strong>
                        <span>${escapeHtml(draft.caption || "Sua legenda aparece aqui assim que voce escrever.")}</span>
                    </div>
                    <div class="meta-line">
                        <span class="meta-pill">${escapeHtml(draft.category || "Ilustracao")}</span>
                        ${
                            normalizeTags(draft.tags)
                                .slice(0, 2)
                                .map((tag) => `<span class="meta-pill">${escapeHtml(tag)}</span>`)
                                .join("") || `<span class="meta-pill">#conquest</span>`
                        }
                    </div>
                </div>
            </aside>
            <div class="composer-form-wrap">
                <button class="ghost-button modal-close" type="button" data-action="close-composer">
                    ${renderButtonContent("close", "Fechar")}
                </button>
                <form class="composer-form" id="composerForm">
                    <label class="field">
                        <span>Titulo opcional</span>
                        <input name="title" type="text" maxlength="60" placeholder="Se preferir, o app usa a legenda como titulo" value="${escapeAttribute(draft.title)}">
                    </label>
                    <label class="field">
                        <span>Legenda</span>
                        <textarea name="caption" rows="4" maxlength="240" placeholder="Escreva como se fosse um post de verdade">${escapeHtml(draft.caption)}</textarea>
                    </label>
                    <label class="field">
                        <span>Categoria</span>
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
                        <span>Tags</span>
                        <input name="tags" type="text" maxlength="90" placeholder="#luz #editorial #processo" value="${escapeAttribute(draft.tags)}">
                    </label>
                    <div class="file-drop">
                        <div class="card-copy">
                            <strong>Escolha a imagem do post</strong>
                            <span>Adicione a arte, foto ou capa que vai aparecer no seu perfil e no feed.</span>
                        </div>
                        <input id="composerFile" type="file" accept="image/*">
                        <p>${state.ui.uploadingImage ? "Preparando imagem..." : draft.fileName ? `Arquivo atual: ${escapeHtml(draft.fileName)}` : "Nenhum arquivo selecionado ainda."}</p>
                    </div>
                    ${
                        library.length
                            ? `
                                <div class="field">
                                    <span>Imagens recentes</span>
                                    <div class="picker-grid">
                                        ${library
                                            .map(
                                                (item, index) => `
                                                    <button
                                                        class="picker-thumb ${draft.imageData === item.src ? "is-active" : ""}"
                                                        type="button"
                                                        data-action="pick-library-image"
                                                        data-library-index="${index}"
                                                    >
                                                        <img src="${escapeAttribute(item.src)}" alt="${escapeAttribute(item.label)}">
                                                        <span>${escapeHtml(item.label)}</span>
                                                    </button>
                                                `
                                            )
                                            .join("")}
                                    </div>
                                </div>
                            `
                            : ""
                    }
                    <div class="composer-actions">
                        <button class="primary-button" type="submit" ${canPublish ? "" : "disabled"}>
                            ${renderButtonContent("compose", state.ui.uploadingImage ? "Preparando..." : "Publicar")}
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
    const library = getProfileMediaLibrary(currentUser.id);
    const previewCover = draft.coverImage || getProfileCover(currentUser);

    profileModalContent.innerHTML = `
        <div class="profile-editor-layout">
            <aside class="profile-editor-preview">
                <div class="profile-editor-cover">
                    <img src="${escapeAttribute(previewCover)}" alt="${escapeAttribute(draft.name || currentUser.name)}">
                </div>
                <div class="profile-editor-identity">
                    ${renderAvatar(
                        {
                            ...currentUser,
                            name: draft.name || currentUser.name,
                            avatarTone: draft.avatarTone
                        },
                        "avatar avatar--profile"
                    )}
                    <div class="profile-copy">
                        <h2>${escapeHtml(draft.name || currentUser.name)}</h2>
                        <p>@${escapeHtml(currentUser.handle)}</p>
                    </div>
                </div>
                <p class="profile-bio">${escapeHtml(draft.bio || currentUser.bio)}</p>
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
                    <div class="field">
                        <span>Tom do avatar</span>
                        <div class="tone-grid">
                            ${PROFILE_TONES.map(
                                (tone) => `
                                    <label class="tone-chip ${draft.avatarTone === tone ? "is-active" : ""}" style="--tone:${escapeAttribute(tone)}">
                                        <input type="radio" name="avatarTone" value="${escapeAttribute(tone)}" ${draft.avatarTone === tone ? "checked" : ""}>
                                        <span></span>
                                    </label>
                                `
                            ).join("")}
                        </div>
                    </div>
                    <div class="file-drop">
                        <div class="card-copy">
                            <strong>Capa do perfil</strong>
                            <span>Ela aparece no topo do seu perfil. Pode ser uma imagem nova ou um dos seus posts.</span>
                        </div>
                        <input id="profileCoverFile" type="file" accept="image/*">
                        <p>${state.ui.uploadingProfileCover ? "Preparando capa..." : draft.coverFileName ? `Arquivo atual: ${escapeHtml(draft.coverFileName)}` : draft.coverImage ? "Capa pronta para salvar." : "Voce tambem pode escolher uma imagem dos seus posts abaixo."}</p>
                        <div class="composer-actions">
                            <button class="ghost-button" type="button" data-action="clear-profile-cover">${renderButtonContent("close", "Remover capa")}</button>
                        </div>
                    </div>
                    ${
                        library.length
                            ? `
                                <div class="field">
                                    <span>Usar imagem dos seus posts</span>
                                    <div class="picker-grid">
                                        ${library
                                            .map(
                                                (item, index) => `
                                                    <button
                                                        class="picker-thumb ${draft.coverImage === item.src ? "is-active" : ""}"
                                                        type="button"
                                                        data-action="pick-profile-cover"
                                                        data-library-index="${index}"
                                                    >
                                                        <img src="${escapeAttribute(item.src)}" alt="${escapeAttribute(item.label)}">
                                                        <span>${escapeHtml(item.label)}</span>
                                                    </button>
                                                `
                                            )
                                            .join("")}
                                    </div>
                                </div>
                            `
                            : ""
                    }
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
    state.ui.composerDraft = createEmptyDraft();
    renderComposerModal();
}

function closeProfileEditor() {
    state.ui.profileEditorOpen = false;
    state.ui.uploadingProfileCover = false;
    state.ui.profileDraft = createEmptyProfileDraft(getCurrentUser());
    renderProfileEditorModal();
}

function closePostModal() {
    state.ui.postModalId = null;
    renderPostModal();
}

function syncBodyModalState() {
    document.body.classList.toggle(
        "modal-open",
        Boolean(state.ui.postModalId) || state.ui.composerOpen || state.ui.profileEditorOpen
    );
}

function getHomePosts(userId) {
    return applyPostFilters(
        state.db.posts
            .map((post) => toPostView(post, userId))
            .filter(Boolean)
            .map((post) => ({
                ...post,
                score: calculateHomeScore(post, userId)
            }))
            .sort((a, b) => b.score - a.score || b.createdAt - a.createdAt)
    );
}

function getFollowingPosts(userId) {
    const following = new Set(getFollowingIds(userId));

    return applyPostFilters(
        state.db.posts
            .map((post) => toPostView(post, userId))
            .filter((post) => post && following.has(post.author.id))
            .sort((a, b) => b.createdAt - a.createdAt)
    );
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

    return applyPostFilters(
        state.db.posts
            .map((post) => toPostView(post, userId))
            .filter((post) => post && savedIds.has(post.id))
            .sort((a, b) => b.createdAt - a.createdAt)
    );
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
    const ageInHours = Math.max(0.35, (Date.now() - post.createdAt) / 3600000);
    const freshness = 165 / Math.pow(ageInHours + 1.2, 0.82);
    const engagement = post.likesCount * 2.6 + post.commentsCount * 3.5 + post.savesCount * 2.8;
    const followingBoost = getFollowingIds(userId).includes(post.author.id) ? 22 : 0;
    const selfBoost = post.author.id === userId ? 9 : 0;
    const earlyBoost = ageInHours <= 12 ? 16 : 0;

    return freshness + engagement + followingBoost + selfBoost + earlyBoost;
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

function getLikedIds(userId) {
    return state.db.likesByUser[userId] || [];
}

function getSavedIds(userId) {
    return state.db.savesByUser[userId] || [];
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
}

function pushActivity(targetUserId, payload) {
    ensureUserCollections(targetUserId);
    state.db.activitiesByUser[targetUserId].unshift({
        id: createId("activity"),
        type: payload.type,
        actorUserId: payload.actorUserId,
        postId: payload.postId || null,
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

    state.ui.composerDraft.title = sanitizeText(String(formData.get("title") || ""), 60);
    state.ui.composerDraft.caption = sanitizeText(String(formData.get("caption") || ""), 240);
    state.ui.composerDraft.tags = sanitizeText(String(formData.get("tags") || ""), 90);
    state.ui.composerDraft.category = CATEGORIES.includes(String(formData.get("category") || ""))
        ? String(formData.get("category"))
        : "Ilustracao";
}

function syncProfileDraftFromLiveForm() {
    const profileForm = document.getElementById("profileForm");

    if (profileForm) {
        syncProfileDraftFromForm(profileForm);
    }
}

function syncProfileDraftFromForm(form) {
    const formData = new FormData(form);

    state.ui.profileDraft.name = sanitizeText(String(formData.get("name") || ""), 36);
    state.ui.profileDraft.bio = sanitizeText(String(formData.get("bio") || ""), 90);
    state.ui.profileDraft.location = sanitizeText(String(formData.get("location") || ""), 48);
    state.ui.profileDraft.website = sanitizeText(String(formData.get("website") || ""), 80);
    state.ui.profileDraft.avatarTone = normalizeAvatarTone(String(formData.get("avatarTone") || ""));
}

function applyTheme(theme) {
    document.body.dataset.theme = theme === "light" ? "light" : "dark";
    refreshBrandAssets();
}

function initBrandAssets() {
    refreshBrandAssets();

    if (logoAssets.promise) {
        return;
    }

    logoAssets.promise = loadImageAsset(LOGO_SOURCE)
        .then((image) => {
            logoAssets.light = createLogoVariant(image, "light");
            logoAssets.dark = createLogoVariant(image, "dark");
            refreshBrandAssets();
        })
        .catch(() => {
            refreshBrandAssets();
        });
}

function refreshBrandAssets() {
    const nextSource = state.prefs.theme === "dark" ? logoAssets.dark : logoAssets.light;

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

function loadImageAsset(source) {
    return new Promise((resolve, reject) => {
        const image = new Image();

        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = source;
    });
}

function createLogoVariant(image, mode) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });

    if (!context) {
        return LOGO_SOURCE;
    }

    canvas.width = image.naturalWidth || image.width;
    canvas.height = image.naturalHeight || image.height;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = frame.data;

    for (let index = 0; index < pixels.length; index += 4) {
        const alpha = pixels[index + 3];

        if (!alpha) {
            continue;
        }

        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        const brightness = max / 255;
        const saturation = max === 0 ? 0 : (max - min) / max;

        if (brightness > 0.97 || (brightness > 0.85 && saturation < 0.14)) {
            pixels[index + 3] = 0;
            continue;
        }

        if (brightness > 0.89 && saturation < 0.22) {
            const keep = Math.max(0, Math.min(1, (saturation - 0.1) / 0.12));

            if (!keep) {
                pixels[index + 3] = 0;
                continue;
            }

            pixels[index + 3] = Math.round(alpha * keep);
        }

        if (mode === "dark") {
            pixels[index] = 12;
            pixels[index + 1] = 14;
            pixels[index + 2] = 18;
        }
    }

    context.putImageData(frame, 0, 0);
    return canvas.toDataURL("image/png");
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
        <div class="toast-icon" aria-hidden="true">
            <img class="brand-logo" data-site-logo="toast" src="${escapeAttribute(state.prefs.theme === "dark" ? logoAssets.dark : logoAssets.light)}" alt="">
        </div>
        <div class="toast-copy">
            <strong>Atualizacao</strong>
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

function renderAvatar(user, className) {
    const tone = normalizeAvatarTone(user?.avatarTone);
    const textColor = getContrastColor(tone);

    return `<span class="${className}" style="--avatar-tone:${escapeAttribute(tone)};--avatar-ink:${escapeAttribute(textColor)}">${escapeHtml(getInitials(user))}</span>`;
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

    return canvas.toDataURL("image/jpeg", 0.86);
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
