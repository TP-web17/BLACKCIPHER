const fs = require('fs');
const Database = require('better-sqlite3');

const { createSessionToken, hashPassword, sha256, verifyPassword } = require('./security');

function createStateStore(config) {
  const db = new Database(config.DB_FILE);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS state_store (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_credentials (
      username TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token_hash TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      revoked_at INTEGER NOT NULL DEFAULT 0,
      ip TEXT NOT NULL DEFAULT '',
      user_agent TEXT NOT NULL DEFAULT ''
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_username ON sessions(username);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

    CREATE TABLE IF NOT EXISTS auth_audit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL DEFAULT '',
      ip TEXT NOT NULL DEFAULT '',
      action TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      details TEXT NOT NULL DEFAULT ''
    );
  `);

  const statements = {
    selectState: db.prepare('SELECT value FROM state_store WHERE key = ?'),
    upsertState: db.prepare(`
      INSERT INTO state_store (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    `),
    listCredentials: db.prepare('SELECT username, updated_at AS updatedAt FROM user_credentials'),
    getCredential: db.prepare('SELECT username, password_hash AS passwordHash, updated_at AS updatedAt FROM user_credentials WHERE username = ?'),
    upsertCredential: db.prepare(`
      INSERT INTO user_credentials (username, password_hash, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, updated_at = excluded.updated_at
    `),
    deleteCredential: db.prepare('DELETE FROM user_credentials WHERE username = ?'),
    getSession: db.prepare(`
      SELECT token_hash AS tokenHash, username, created_at AS createdAt, last_seen_at AS lastSeenAt,
             expires_at AS expiresAt, revoked_at AS revokedAt, ip, user_agent AS userAgent
      FROM sessions
      WHERE token_hash = ?
    `),
    insertSession: db.prepare(`
      INSERT INTO sessions (token_hash, username, created_at, last_seen_at, expires_at, revoked_at, ip, user_agent)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?)
    `),
    touchSession: db.prepare('UPDATE sessions SET last_seen_at = ? WHERE token_hash = ?'),
    revokeSession: db.prepare('UPDATE sessions SET revoked_at = ? WHERE token_hash = ?'),
    revokeSessionsByUser: db.prepare('UPDATE sessions SET revoked_at = ? WHERE username = ? AND revoked_at = 0'),
    pruneSessions: db.prepare('DELETE FROM sessions WHERE expires_at <= ? OR revoked_at > 0'),
    insertAudit: db.prepare('INSERT INTO auth_audit (username, ip, action, created_at, details) VALUES (?, ?, ?, ?, ?)')
  };

  let appState = normalizeAppState({}, config);
  let stealthBusState = normalizeStealthBus({ sessions: [] });
  let liveBroadcastState = null;
  let appStateSerialized = JSON.stringify(appState);

  const persistPayloadTx = db.transaction((payload) => {
    const now = Date.now();
    statements.upsertState.run('app_state', JSON.stringify(payload.appState), now);
    statements.upsertState.run('stealth_bus', JSON.stringify(payload.stealthBus), now);
    statements.upsertState.run('live_broadcast', JSON.stringify(payload.liveBroadcast), now);
  });

  const syncCredentialsTx = db.transaction((normalizedUsers, rawUsers, now = Date.now()) => {
    const rawByName = new Map();
    if (Array.isArray(rawUsers)) {
      rawUsers.forEach((rawUser) => {
        const key = safeText(rawUser && rawUser.username, '').toLowerCase();
        if (key) rawByName.set(key, rawUser);
      });
    }

    const keep = new Set();
    normalizedUsers.forEach((user) => {
      const username = safeText(user && user.username, '').toLowerCase();
      if (!username) return;
      keep.add(username);
      const existingCredential = statements.getCredential.get(username);
      if (existingCredential) return;

      const rawUser = rawByName.get(username);
      const initialPassword = safeText(rawUser && rawUser.password, config.DEFAULT_PASSWORD);
      const passwordHash = hashPassword(initialPassword || config.DEFAULT_PASSWORD);
      const updatedAt = Math.max(now, Number(user.passwordUpdatedAt) || 0);
      statements.upsertCredential.run(username, passwordHash, updatedAt);
    });

    statements.listCredentials.all().forEach((row) => {
      const username = safeText(row && row.username, '').toLowerCase();
      if (!username || keep.has(username)) return;
      statements.deleteCredential.run(username);
      statements.revokeSessionsByUser.run(now, username);
    });
  });

  function loadPersistedState() {
    const storedAppState = readStateValue('app_state', null);
    const storedStealthBus = readStateValue('stealth_bus', null);
    const storedLiveBroadcast = readStateValue('live_broadcast', null);

    if (storedAppState) {
      const normalized = normalizeAppState(storedAppState, config);
      syncCredentialsTx(normalized.users, Array.isArray(storedAppState.users) ? storedAppState.users : [], Date.now());
      appState = sanitizeAppStateForClient(normalized);
      stealthBusState = normalizeStealthBus(storedStealthBus);
      liveBroadcastState = normalizeLiveBroadcast(storedLiveBroadcast);
      persistPayload();
      return;
    }

    const legacy = readLegacyPayload();
    const rawLegacyAppState = legacy.appState && typeof legacy.appState === 'object' && !Array.isArray(legacy.appState)
      ? legacy.appState
      : {};
    const normalizedLegacyState = normalizeAppState(rawLegacyAppState, config);
    syncCredentialsTx(normalizedLegacyState.users, Array.isArray(rawLegacyAppState.users) ? rawLegacyAppState.users : [], Date.now());
    appState = sanitizeAppStateForClient(normalizedLegacyState);
    stealthBusState = normalizeStealthBus(legacy.stealthBus);
    liveBroadcastState = normalizeLiveBroadcast(legacy.liveBroadcast);
    persistPayload();
  }

  function persistPayload() {
    appState = sanitizeAppStateForClient(normalizeAppState(appState, config));
    stealthBusState = normalizeStealthBus(stealthBusState);
    liveBroadcastState = normalizeLiveBroadcast(liveBroadcastState);
    appStateSerialized = JSON.stringify(appState);
    persistPayloadTx({
      appState,
      stealthBus: stealthBusState,
      liveBroadcast: liveBroadcastState
    });
  }

  function readStateValue(key, fallback) {
    const row = statements.selectState.get(key);
    if (!row || typeof row.value !== 'string') return fallback;
    try {
      return JSON.parse(row.value);
    } catch {
      return fallback;
    }
  }

  function readLegacyPayload() {
    try {
      if (!fs.existsSync(config.STATE_FILE)) {
        return {
          appState: {},
          stealthBus: { sessions: [] },
          liveBroadcast: null
        };
      }
      const raw = fs.readFileSync(config.STATE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        appState: parsed && parsed.appState && typeof parsed.appState === 'object' ? parsed.appState : {},
        stealthBus: parsed && parsed.stealthBus && typeof parsed.stealthBus === 'object' ? parsed.stealthBus : { sessions: [] },
        liveBroadcast: parsed ? parsed.liveBroadcast : null
      };
    } catch {
      return {
        appState: {},
        stealthBus: { sessions: [] },
        liveBroadcast: null
      };
    }
  }

  function appendAudit(action, username = '', ip = '', details = '') {
    statements.insertAudit.run(
      safeText(username, '').toLowerCase(),
      safeText(ip, ''),
      safeText(action, 'unknown').slice(0, 80),
      Date.now(),
      safeText(details, '').slice(0, 400)
    );
  }

  function appendServerLog(actor, action, timestamp = Date.now()) {
    const nextLogs = Array.isArray(appState.logs) ? appState.logs.slice() : [];
    nextLogs.push({
      timestamp,
      user: safeText(actor, 'sistema'),
      action: safeText(action, 'acao nao informada')
    });
    appState.logs = nextLogs.map(normalizeServerLog).slice(-config.MAX_SERVER_LOG_ENTRIES);
  }

  function getUser(username) {
    const key = safeText(username, '').toLowerCase();
    if (!key) return null;
    const list = Array.isArray(appState.users) ? appState.users : [];
    return list.find((user) => safeText(user && user.username, '').toLowerCase() === key) || null;
  }

  function getAppState() {
    return appState;
  }

  function getAppStateSerialized() {
    return appStateSerialized;
  }

  function getStealthBusState() {
    return stealthBusState;
  }

  function setStealthBusState(nextBus) {
    stealthBusState = normalizeStealthBus(nextBus);
    persistPayload();
    return stealthBusState;
  }

  function getLiveBroadcastState() {
    return liveBroadcastState;
  }

  function setLiveBroadcastState(nextBroadcast) {
    liveBroadcastState = normalizeLiveBroadcast(nextBroadcast);
    persistPayload();
    return liveBroadcastState;
  }

  function replaceAppState(nextState) {
    const rawState = nextState && typeof nextState === 'object' && !Array.isArray(nextState) ? nextState : {};
    const normalized = normalizeAppState(rawState, config);
    syncCredentialsTx(normalized.users, Array.isArray(rawState.users) ? rawState.users : [], Date.now());
    appState = sanitizeAppStateForClient(normalized);
    persistPayload();
    return appState;
  }

  function createUser({ username, role, password, actor }) {
    const normalizedUsername = safeText(username, '').toLowerCase();
    if (normalizedUsername.length < 3) {
      throw new Error('Usuario precisa ter ao menos 3 caracteres.');
    }
    if (getUser(normalizedUsername)) {
      throw new Error('Usuario ja existe.');
    }
    const now = Date.now();
    const nextUser = normalizeServerUser({
      username: normalizedUsername,
      role: safeRole(role),
      status: 'active',
      debt: 0,
      statusUpdatedAt: now,
      roleUpdatedAt: now,
      passwordUpdatedAt: now,
      privateChatLimitUpdatedAt: now,
      walletHealthUpdatedAt: now
    });
    appState.users = [...appState.users, nextUser];
    appState = sanitizeAppStateForClient(normalizeAppState(appState, config));
    statements.upsertCredential.run(normalizedUsername, hashPassword(safeText(password, config.DEFAULT_PASSWORD)), now);
    appendServerLog(actor || 'sistema', `Criou usuario ${normalizedUsername} (${nextUser.role})`, now);
    persistPayload();
    return getUser(normalizedUsername);
  }

  function updateUserPassword(username, newPassword, options = {}) {
    const user = getUser(username);
    if (!user) {
      throw new Error('Usuario nao encontrado.');
    }
    const safePassword = String(newPassword || '').trim();
    if (safePassword.length < 4) {
      throw new Error('Nova senha deve ter pelo menos 4 caracteres.');
    }
    const now = Date.now();
    statements.upsertCredential.run(user.username, hashPassword(safePassword), now);
    user.passwordUpdatedAt = now;
    appendServerLog(options.actor || 'sistema', `Atualizou senha de ${user.username}`, now);
    appendAudit('password_change', user.username, options.ip || '', options.actor ? `actor:${options.actor}` : '');
    persistPayload();
    return user;
  }

  function changeOwnPassword(username, currentPassword, newPassword, options = {}) {
    const verification = verifyUserLogin(username, currentPassword);
    if (!verification.ok) {
      throw new Error('Senha atual incorreta.');
    }
    return updateUserPassword(username, newPassword, {
      actor: options.actor || username,
      ip: options.ip || ''
    });
  }

  function verifyUserLogin(username, password) {
    const user = getUser(username);
    if (!user) {
      return { ok: false, reason: 'invalid_credentials' };
    }
    if (user.status === 'blocked') {
      return { ok: false, reason: 'blocked' };
    }
    const credential = statements.getCredential.get(user.username);
    if (!credential || !verifyPassword(password, credential.passwordHash)) {
      return { ok: false, reason: 'invalid_credentials' };
    }
    return { ok: true, user };
  }

  function createSession(username, meta = {}) {
    const user = getUser(username);
    if (!user || user.status === 'blocked') return null;
    const token = createSessionToken();
    const tokenHash = sha256(token);
    const now = Date.now();
    statements.insertSession.run(
      tokenHash,
      user.username,
      now,
      now,
      now + config.SESSION_TTL_MS,
      safeText(meta.ip, ''),
      safeText(meta.userAgent, '').slice(0, 200)
    );
    appendAudit('login_success', user.username, meta.ip || '', safeText(meta.userAgent, '').slice(0, 120));
    return {
      token,
      user,
      createdAt: now,
      expiresAt: now + config.SESSION_TTL_MS
    };
  }

  function getSession(token) {
    const safeToken = safeText(token, '');
    if (!safeToken) return null;
    pruneExpiredSessions();
    const row = statements.getSession.get(sha256(safeToken));
    if (!row || Number(row.revokedAt) > 0 || Number(row.expiresAt) <= Date.now()) {
      return null;
    }
    const user = getUser(row.username);
    if (!user || user.status === 'blocked') {
      statements.revokeSession.run(Date.now(), row.tokenHash);
      return null;
    }
    if (Date.now() - Number(row.lastSeenAt) >= config.SESSION_TOUCH_MS) {
      statements.touchSession.run(Date.now(), row.tokenHash);
      row.lastSeenAt = Date.now();
    }
    return {
      tokenHash: row.tokenHash,
      user,
      createdAt: Number(row.createdAt) || Date.now(),
      lastSeenAt: Number(row.lastSeenAt) || Date.now(),
      expiresAt: Number(row.expiresAt) || (Date.now() + config.SESSION_TTL_MS)
    };
  }

  function revokeSession(token, options = {}) {
    const safeToken = safeText(token, '');
    if (!safeToken) return;
    const now = Date.now();
    statements.revokeSession.run(now, sha256(safeToken));
    appendAudit('logout', safeText(options.username, ''), options.ip || '', '');
    pruneExpiredSessions();
  }

  function revokeSessionsForUser(username) {
    const safeUsername = safeText(username, '').toLowerCase();
    if (!safeUsername) return;
    statements.revokeSessionsByUser.run(Date.now(), safeUsername);
  }

  function pruneExpiredSessions() {
    statements.pruneSessions.run(Date.now());
  }

  loadPersistedState();

  return {
    appendAudit,
    createSession,
    createUser,
    changeOwnPassword,
    getAppState,
    getAppStateSerialized,
    getLiveBroadcastState,
    getSession,
    getStealthBusState,
    getUser,
    normalizeAppState: (rawState) => normalizeAppState(rawState, config),
    normalizeLiveBroadcast,
    normalizeStealthBus,
    replaceAppState,
    revokeSession,
    revokeSessionsForUser,
    setLiveBroadcastState,
    setStealthBusState,
    updateUserPassword,
    verifyUserLogin
  };
}

function safeText(value, fallback = '') {
  const text = String(value || '').trim();
  return text || fallback;
}

function safeRole(value) {
  const role = safeText(value, 'member').toLowerCase();
  return /^[a-z0-9_-]{2,24}$/.test(role) ? role : 'member';
}

function normalizeDisplayName(value, fallbackUsername = '', maxLength = 42) {
  const fallback = safeText(fallbackUsername, '');
  const cleaned = safeText(value, '').replace(/\s+/g, ' ');
  if (!cleaned) return fallback;
  return cleaned.slice(0, maxLength);
}

function sanitizeAvatarDataUrl(value, maxLength = 380000) {
  const raw = safeText(value, '');
  if (!raw) return '';
  if (raw.length > maxLength) return '';
  if (!/^data:image\/(png|jpe?g|webp|gif);base64,[a-z0-9+/=]+$/i.test(raw)) return '';
  return raw;
}

function parseBooleanFlag(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;
    if (['1', 'true', 'yes', 'sim', 'on', 'enabled', 'ativo'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'nao', 'off', 'disabled', 'inativo'].includes(normalized)) return false;
  }
  return fallback;
}

function normalizeFinanceHistory(rawHistory) {
  const source = Array.isArray(rawHistory) ? rawHistory : [];
  return source
    .map((entry) => ({
      id: Number(entry.id) || Date.now(),
      type: ['charge', 'payment', 'loan', 'adjustment'].includes(entry.type) ? entry.type : 'adjustment',
      amount: Math.max(0, Number(entry.amount) || 0),
      note: safeText(entry.note, '').slice(0, 200),
      actor: safeText(entry.actor, 'sistema').slice(0, 80),
      timestamp: Number(entry.timestamp) || Date.now()
    }))
    .filter((entry) => entry.amount > 0)
    .slice(-400);
}

function normalizePrivateChatUsage(rawUsage) {
  const source = rawUsage && typeof rawUsage === 'object' && !Array.isArray(rawUsage) ? rawUsage : {};
  const date = safeText(source.date || source.day, '');
  const used = Math.max(0, Math.floor(Number(source.used) || 0));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { date: '', used: 0 };
  }
  return { date, used };
}

function normalizeWalletHealth(rawHealth) {
  const value = safeText(rawHealth, 'boa').toLowerCase();
  return ['boa', 'ruim', 'critica', 'liquidada'].includes(value) ? value : 'boa';
}

function normalizeServerUser(rawUser, configOverrides = {}) {
  const source = rawUser && typeof rawUser === 'object' && !Array.isArray(rawUser) ? rawUser : {};
  const username = safeText(source.username).toLowerCase();
  if (!username) return null;
  const role = safeRole(source.role);
  const maxProfileNameLength = Number(configOverrides.MAX_PROFILE_NAME_LENGTH) || 42;
  const maxAvatarDataUrlLength = Number(configOverrides.MAX_AVATAR_DATA_URL_LENGTH) || 380000;
  const displayName = normalizeDisplayName(source.displayName, username, maxProfileNameLength);
  const avatarDataUrl = sanitizeAvatarDataUrl(source.avatarDataUrl, maxAvatarDataUrlLength);
  const hasRawAvatarField = Object.prototype.hasOwnProperty.call(source, 'avatarDataUrl');
  const fallbackProfileUpdatedAt = (displayName.toLowerCase() !== username || avatarDataUrl) ? 1 : 0;
  const fallbackAvatarUpdatedAt = hasRawAvatarField
    ? Math.max(0, Number(source.profileUpdatedAt) || 0, avatarDataUrl ? 1 : 0)
    : (avatarDataUrl ? Math.max(1, Number(source.profileUpdatedAt) || 0) : 0);
  const profileUpdatedAt = Math.max(0, Number(source.profileUpdatedAt) || fallbackProfileUpdatedAt);
  const avatarUpdatedAt = Math.max(0, Number(source.avatarUpdatedAt) || fallbackAvatarUpdatedAt);
  const walletAccessEnabled = role === 'member'
    ? true
    : (role === 'admin'
      ? parseBooleanFlag(source.walletAccessEnabled, false)
      : false);
  const financeHistory = normalizeFinanceHistory(source.financeHistory);
  const rawPrivateChatDailyLimit = source.privateChatDailyLimit;
  let privateChatDailyLimit = null;
  if (rawPrivateChatDailyLimit !== null && rawPrivateChatDailyLimit !== undefined && String(rawPrivateChatDailyLimit).trim() !== '') {
    const parsedLimit = Number(rawPrivateChatDailyLimit);
    if (Number.isFinite(parsedLimit) && parsedLimit >= 0) {
      privateChatDailyLimit = Math.min(999, Math.floor(parsedLimit));
    }
  }
  const financeUpdatedAt = Math.max(
    Math.max(0, Number(source.financeUpdatedAt) || 0),
    ...financeHistory.map((entry) => Math.max(0, Number(entry.timestamp) || 0))
  );
  const fallbackStatusUpdatedAt = source.status === 'blocked' ? 1 : 0;
  const fallbackRoleUpdatedAt = role !== 'member' ? 1 : 0;
  const fallbackPrivateLimitUpdatedAt = privateChatDailyLimit !== null ? 1 : 0;
  const fallbackWalletHealthUpdatedAt = normalizeWalletHealth(source.walletHealth) !== 'boa' ? 1 : 0;
  const fallbackWalletAccessUpdatedAt = typeof source.walletAccessEnabled === 'boolean' ? 1 : (role === 'member' ? 1 : 0);
  const fallbackWalletChartUpdatedAt = typeof source.walletChartEnabled === 'boolean' ? 1 : 0;
  return {
    ...source,
    username,
    role,
    status: source.status === 'blocked' ? 'blocked' : 'active',
    displayName,
    avatarDataUrl,
    profileUpdatedAt,
    avatarUpdatedAt,
    walletAccessEnabled,
    debt: Math.max(0, Number(source.debt) || 0),
    totalCharged: Math.max(0, Number(source.totalCharged) || 0),
    totalPaid: Math.max(0, Number(source.totalPaid) || 0),
    walletProfit: Math.max(0, Number(source.walletProfit) || 0),
    emergencyLoanOutstanding: Math.max(0, Number(source.emergencyLoanOutstanding) || 0),
    accessCount: Math.max(0, Number(source.accessCount) || 0),
    lastLoginAt: Math.max(0, Number(source.lastLoginAt) || 0),
    lastLogoutAt: Math.max(0, Number(source.lastLogoutAt) || 0),
    walletChartEnabled: Boolean(source.walletChartEnabled),
    walletAccessUpdatedAt: Math.max(0, Number(source.walletAccessUpdatedAt) || fallbackWalletAccessUpdatedAt),
    walletChartUpdatedAt: Math.max(0, Number(source.walletChartUpdatedAt) || fallbackWalletChartUpdatedAt),
    financeHistory,
    privateChatDailyLimit,
    privateChatUsage: normalizePrivateChatUsage(source.privateChatUsage),
    walletHealth: normalizeWalletHealth(source.walletHealth),
    statusUpdatedAt: Math.max(0, Number(source.statusUpdatedAt) || fallbackStatusUpdatedAt),
    passwordUpdatedAt: Math.max(0, Number(source.passwordUpdatedAt) || 0),
    roleUpdatedAt: Math.max(0, Number(source.roleUpdatedAt) || fallbackRoleUpdatedAt),
    privateChatLimitUpdatedAt: Math.max(0, Number(source.privateChatLimitUpdatedAt) || fallbackPrivateLimitUpdatedAt),
    walletHealthUpdatedAt: Math.max(0, Number(source.walletHealthUpdatedAt) || fallbackWalletHealthUpdatedAt),
    financeUpdatedAt
  };
}

function ensureCoreUsersInState(state, config) {
  if (!state || typeof state !== 'object' || Array.isArray(state)) return state;
  const normalizedUsers = Array.isArray(state.users)
    ? state.users.map((user) => normalizeServerUser(user, config)).filter(Boolean)
    : [];

  const legacyIdx = normalizedUsers.findIndex((user) => user.username === 'inteligenciatp');
  if (legacyIdx >= 0) {
    const currentIdx = normalizedUsers.findIndex((user) => user.username === 'inteligencia tp');
    if (currentIdx >= 0) {
      normalizedUsers.splice(legacyIdx, 1);
    } else {
      normalizedUsers[legacyIdx].username = 'inteligencia tp';
      normalizedUsers[legacyIdx].role = 'inteligencia';
      normalizedUsers[legacyIdx].status = 'active';
    }
  }

  config.CORE_USERS.forEach((seed) => {
    const idx = normalizedUsers.findIndex((user) => user.username === seed.username);
    if (idx < 0) {
      if (!seed.lockedRole) return;
      normalizedUsers.push(normalizeServerUser({
        username: seed.username,
        role: seed.role,
        status: 'active',
        debt: 0
      }, config));
      return;
    }
    if (seed.lockedRole) {
      if (normalizedUsers[idx].role !== seed.role) {
        normalizedUsers[idx].role = seed.role;
        normalizedUsers[idx].roleUpdatedAt = Math.max(Number(normalizedUsers[idx].roleUpdatedAt) || 0, Date.now());
      }
      if (normalizedUsers[idx].status !== 'active') {
        normalizedUsers[idx].status = 'active';
        normalizedUsers[idx].statusUpdatedAt = Math.max(Number(normalizedUsers[idx].statusUpdatedAt) || 0, Date.now());
      }
    }
  });

  state.users = normalizedUsers;
  return state;
}

function normalizeServerTicket(rawTicket) {
  const source = rawTicket && typeof rawTicket === 'object' && !Array.isArray(rawTicket) ? rawTicket : {};
  const createdAt = Number(source.createdAt) || Number(source.id) || Date.now();
  const messages = Array.isArray(source.messages)
    ? source.messages
        .map((message) => ({
          sender: safeText(message.sender, 'sistema').slice(0, 80),
          content: safeText(message.content, '').slice(0, 1600),
          timestamp: Number(message.timestamp) || Date.now()
        }))
        .filter((message) => message.content.length > 0)
        .slice(-600)
    : [];
  const lastMessageTimestamp = messages.length > 0 ? Number(messages[messages.length - 1].timestamp) || 0 : 0;
  const updatedAt = Math.max(Number(source.updatedAt) || 0, createdAt, lastMessageTimestamp);
  return {
    id: Number(source.id) || Date.now(),
    title: safeText(source.title, 'Ticket sem titulo').slice(0, 160),
    description: safeText(source.description, '').slice(0, 5000),
    category: ['geral', 'tecnico', 'financeiro', 'acesso', 'pagamento', 'outros'].includes(source.category) ? source.category : 'geral',
    priority: ['low', 'medium', 'high', 'urgent'].includes(source.priority) ? source.priority : 'medium',
    creator: safeText(source.creator, 'desconhecido').slice(0, 80),
    status: ['pending', 'active', 'closed'].includes(source.status) ? source.status : 'pending',
    assignedAdmin: source.assignedAdmin ? safeText(source.assignedAdmin, '').slice(0, 80) : null,
    createdAt,
    updatedAt,
    messages
  };
}

function normalizeServerLog(rawLog) {
  return {
    timestamp: Number(rawLog && rawLog.timestamp) || Date.now(),
    user: safeText(rawLog && rawLog.user, 'sistema').slice(0, 80),
    action: safeText(rawLog && rawLog.action, 'acao nao informada').slice(0, 300)
  };
}

function normalizeAppState(rawState, config = require('./config')) {
  const source = rawState && typeof rawState === 'object' && !Array.isArray(rawState) ? rawState : {};
  const normalized = {
    users: Array.isArray(source.users) ? source.users.map((user) => normalizeServerUser(user, config)).filter(Boolean) : [],
    tickets: Array.isArray(source.tickets) ? source.tickets.map(normalizeServerTicket) : [],
    logs: Array.isArray(source.logs) ? source.logs.map(normalizeServerLog).slice(-config.MAX_SERVER_LOG_ENTRIES) : [],
    tasks: Array.isArray(source.tasks) ? source.tasks : [],
    notes: Array.isArray(source.notes) ? source.notes : [],
    announcements: Array.isArray(source.announcements) ? source.announcements : [],
    settings: source.settings && typeof source.settings === 'object' && !Array.isArray(source.settings) ? source.settings : {}
  };
  return ensureCoreUsersInState(normalized, config);
}

function normalizeStealthBus(rawBus) {
  const source = rawBus && typeof rawBus === 'object' && !Array.isArray(rawBus) ? rawBus : {};
  const sessions = Array.isArray(source.sessions) ? source.sessions : [];
  return {
    sessions: sessions.slice(0, 50).map((session) => ({
      id: Number(session.id) || Date.now(),
      createdBy: safeText(session.createdBy, ''),
      participants: Array.isArray(session.participants)
        ? session.participants.map((item) => safeText(item, '')).filter(Boolean).slice(0, 2)
        : [],
      createdAt: Number(session.createdAt) || Date.now(),
      updatedAt: Number(session.updatedAt) || Date.now(),
      messages: Array.isArray(session.messages)
        ? session.messages.slice(-500).map((message) => ({
            id: Number(message.id) || Date.now(),
            author: safeText(message.author, 'sistema'),
            content: safeText(message.content, '').slice(0, 1600),
            createdAt: Number(message.createdAt) || Date.now(),
            editedAt: message.editedAt ? Number(message.editedAt) : null
          }))
        : []
    }))
  };
}

function normalizeLiveBroadcast(rawPayload) {
  if (!rawPayload || typeof rawPayload !== 'object' || Array.isArray(rawPayload)) return null;
  const message = safeText(rawPayload.message, '').slice(0, 220);
  if (!message) return null;
  return {
    id: Number(rawPayload.id) || Date.now(),
    sender: safeText(rawPayload.sender, 'sistema'),
    anonymous: Boolean(rawPayload.anonymous),
    level: rawPayload.level === 'critical' ? 'critical' : 'normal',
    audience: rawPayload.audience && typeof rawPayload.audience === 'object' && !Array.isArray(rawPayload.audience)
      ? {
          type: ['all', 'role', 'user'].includes(rawPayload.audience.type) ? rawPayload.audience.type : 'all',
          role: safeRole(rawPayload.audience.role),
          user: safeText(rawPayload.audience.user, '')
        }
      : { type: 'all', role: 'member', user: '' },
    recipients: Array.isArray(rawPayload.recipients)
      ? rawPayload.recipients.map((item) => safeText(item, '')).filter(Boolean).slice(0, 500)
      : [],
    message,
    createdAt: Number(rawPayload.createdAt) || Date.now()
  };
}

function sanitizeClientUser(user) {
  const source = user && typeof user === 'object' && !Array.isArray(user) ? user : {};
  const sanitized = { ...source };
  delete sanitized.password;
  delete sanitized.passwordHash;
  delete sanitized.passwordSalt;
  return sanitized;
}

function sanitizeAppStateForClient(state) {
  const safeState = state && typeof state === 'object' && !Array.isArray(state) ? state : {};
  return {
    ...safeState,
    users: Array.isArray(safeState.users) ? safeState.users.map(sanitizeClientUser) : []
  };
}

module.exports = {
  createStateStore
};
