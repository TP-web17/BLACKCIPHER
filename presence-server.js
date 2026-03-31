const fs = require('fs');
const http = require('http');
const path = require('path');
const { URL } = require('url');
const { WebSocketServer, WebSocket } = require('ws');

const config = require('./server/config');
const { createRateLimiter, parseCookies, serializeCookie } = require('./server/security');
const { createStateStore } = require('./server/state-store');

const store = createStateStore(config);
const loginLimiter = createRateLimiter({
  limit: config.LOGIN_LIMIT,
  windowMs: config.LOGIN_WINDOW_MS,
  blockMs: config.LOGIN_BLOCK_MS
});

const presenceByUser = new Map();
const userSockets = new Map();
const socketUser = new Map();
const authBySocket = new Map();
const socketRequest = new WeakMap();

function wsLog(...args) {
  if (!config.DEBUG_WS) return;
  console.log('[ws]', ...args);
}

function safeText(value, fallback = '') {
  const text = String(value || '').trim();
  return text || fallback;
}

function safeRole(value) {
  const role = safeText(value, 'member').toLowerCase();
  return /^[a-z0-9_-]{2,24}$/.test(role) ? role : 'member';
}

function safePage(value) {
  return safeText(value, 'dashboard').slice(0, 80);
}

function getRequestIp(req) {
  const forwarded = safeText(req && req.headers && req.headers['x-forwarded-for'], '');
  if (forwarded) {
    return forwarded.split(',')[0].trim().slice(0, 80);
  }
  return safeText(req && req.socket && req.socket.remoteAddress, '').slice(0, 80);
}

function getRequestUserAgent(req) {
  return safeText(req && req.headers && req.headers['user-agent'], '').slice(0, 200);
}

function sendJson(ws, payload) {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  try {
    ws.send(JSON.stringify(payload));
  } catch {
    // ignore transport failures
  }
}

function broadcastJson(payload) {
  wsLog('broadcast', payload && payload.type ? payload.type : 'unknown', 'clients=', wss.clients.size);
  for (const client of wss.clients) {
    sendJson(client, payload);
  }
}

function sendJsonResponse(res, statusCode, payload, headers = {}) {
  const baseHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  };
  res.writeHead(statusCode, { ...baseHeaders, ...headers });
  res.end(JSON.stringify(payload));
}

function sendTextResponse(res, statusCode, message, headers = {}) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8', ...headers });
  res.end(message);
}

function readJsonBody(req, maxBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];

    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Payload muito grande.'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        const raw = Buffer.concat(chunks).toString('utf-8');
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('JSON invalido.'));
      }
    });

    req.on('error', reject);
  });
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req && req.headers ? req.headers.cookie : '');
  const token = safeText(cookies[config.SESSION_COOKIE_NAME], '');
  if (!token) return null;
  return store.getSession(token);
}

function requireSession(req, res) {
  const session = getSessionFromRequest(req);
  if (!session) {
    sendJsonResponse(res, 401, { ok: false, message: 'Sessao invalida ou expirada.' });
    return null;
  }
  return session;
}

function isEncryptedRequest(req) {
  const forwardedProto = safeText(req && req.headers && req.headers['x-forwarded-proto'], '').toLowerCase();
  return forwardedProto === 'https' || Boolean(req && req.socket && req.socket.encrypted);
}

function buildSessionCookie(token, req) {
  return serializeCookie(config.SESSION_COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: isEncryptedRequest(req),
    maxAge: Math.floor(config.SESSION_TTL_MS / 1000)
  });
}

function buildClearedSessionCookie(req) {
  return serializeCookie(config.SESSION_COOKIE_NAME, '', {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: isEncryptedRequest(req),
    maxAge: 0,
    expires: new Date(0)
  });
}

function getAuthRateLimitKeys(ip, username) {
  const safeIp = safeText(ip, 'unknown');
  const safeUsername = safeText(username, 'unknown').toLowerCase();
  return [
    `ip:${safeIp}`,
    `ip-user:${safeIp}:${safeUsername}`
  ];
}

function getAuthorizedUser(ws) {
  const auth = authBySocket.get(ws);
  if (!auth || !auth.username) return null;
  const user = store.getUser(auth.username);
  if (!user || user.status === 'blocked') return null;
  return {
    username: safeText(user.username, '').toLowerCase(),
    role: safeRole(user.role),
    status: user.status
  };
}

function canSendLiveBroadcastAs(user) {
  if (!user) return false;
  return user.role === 'inteligencia' || user.username === 'esther';
}

function getSnapshotPayload() {
  const now = Date.now();
  const snapshot = {};
  for (const [username, entry] of presenceByUser.entries()) {
    if (!entry || !entry.lastSeen || now - entry.lastSeen > config.ONLINE_WINDOW_MS) continue;
    snapshot[username] = {
      username,
      role: safeRole(entry.role),
      page: safePage(entry.page),
      loginAt: Number(entry.loginAt) || now,
      lastSeen: Number(entry.lastSeen) || now
    };
  }
  return { type: 'snapshot', presence: snapshot };
}

function broadcastSnapshot() {
  broadcastJson(getSnapshotPayload());
}

function sendInitialSyncAfterAuth(ws) {
  sendJson(ws, getSnapshotPayload());
  sendJson(ws, { type: 'app_state_sync', state: store.getAppState(), origin: 'server_init' });
  sendJson(ws, { type: 'stealth_sync', bus: store.getStealthBusState() });
  const liveBroadcastState = store.getLiveBroadcastState();
  if (liveBroadcastState) {
    sendJson(ws, { type: 'live_broadcast_sync', payload: liveBroadcastState });
  }
}

function authenticateSocket(ws, payload = {}, reqOverride = null) {
  const existingAuth = authBySocket.get(ws);
  if (existingAuth && existingAuth.username) return true;

  const req = reqOverride || socketRequest.get(ws);
  const cookies = parseCookies(req && req.headers ? req.headers.cookie : '');
  const explicitToken = safeText(payload && payload.sessionToken, '');
  const token = explicitToken || safeText(cookies[config.SESSION_COOKIE_NAME], '');
  const session = token ? store.getSession(token) : null;
  if (!session || !session.user) {
    sendJson(ws, { type: 'auth_error', message: 'Sessao ausente ou expirada no WebSocket.' });
    return false;
  }

  authBySocket.set(ws, {
    username: safeText(session.user.username, '').toLowerCase(),
    authenticatedAt: Date.now()
  });
  sendJson(ws, {
    type: 'auth_ack',
    username: safeText(session.user.username, '').toLowerCase(),
    role: safeRole(session.user.role),
    ts: Date.now()
  });
  sendInitialSyncAfterAuth(ws);
  return true;
}

function attachSocketToUser(ws, username) {
  const prevUsername = socketUser.get(ws);
  if (prevUsername && prevUsername !== username) {
    const prevSet = userSockets.get(prevUsername);
    if (prevSet) {
      prevSet.delete(ws);
      if (prevSet.size === 0) {
        userSockets.delete(prevUsername);
      }
    }
  }

  socketUser.set(ws, username);
  let set = userSockets.get(username);
  if (!set) {
    set = new Set();
    userSockets.set(username, set);
  }
  set.add(ws);
}

function detachSocketFromUser(ws) {
  const username = socketUser.get(ws);
  if (!username) return null;
  socketUser.delete(ws);
  const set = userSockets.get(username);
  if (!set) return username;
  set.delete(ws);
  if (set.size === 0) {
    userSockets.delete(username);
    presenceByUser.delete(username);
  }
  return username;
}

function upsertPresenceFromPayload(ws, payload) {
  const actor = getAuthorizedUser(ws);
  if (!actor) return false;
  const username = actor.username;
  attachSocketToUser(ws, username);
  const now = Date.now();
  presenceByUser.set(username, {
    username,
    role: actor.role,
    page: safePage(payload.page),
    loginAt: Number(payload.loginAt) || now,
    lastSeen: Number(payload.lastSeen) || now
  });
  return true;
}

function applyLeaveFromPayload(ws) {
  const actor = getAuthorizedUser(ws);
  const requestedUsername = actor ? actor.username : '';
  const boundUsername = socketUser.get(ws);
  const username = requestedUsername || boundUsername;
  if (!username) return false;

  const set = userSockets.get(username);
  if (set) {
    set.delete(ws);
    if (set.size === 0) {
      userSockets.delete(username);
      presenceByUser.delete(username);
    }
  } else {
    presenceByUser.delete(username);
  }

  if (boundUsername === username) {
    socketUser.delete(ws);
  }
  return true;
}

function cleanupStalePresence() {
  let changed = false;
  const now = Date.now();

  for (const [username, entry] of presenceByUser.entries()) {
    const lastSeen = Number(entry.lastSeen) || 0;
    if (!lastSeen || now - lastSeen > config.ONLINE_WINDOW_MS) {
      presenceByUser.delete(username);
      changed = true;
    }
  }

  if (changed) {
    broadcastSnapshot();
  }
}

async function handleApiRequest(req, res, reqUrl) {
  if (req.method === 'GET' && reqUrl.pathname === config.API_SESSION_PATH) {
    const session = getSessionFromRequest(req);
    if (!session) {
      sendJsonResponse(res, 401, { ok: false, authenticated: false });
      return true;
    }
    sendJsonResponse(res, 200, {
      ok: true,
      authenticated: true,
      user: {
        username: session.user.username,
        role: session.user.role,
        status: session.user.status
      },
      createdAt: session.createdAt,
      expiresAt: session.expiresAt
    });
    return true;
  }

  if (req.method === 'POST' && reqUrl.pathname === config.API_LOGIN_PATH) {
    let body;
    try {
      body = await readJsonBody(req);
    } catch (error) {
      sendJsonResponse(res, 400, { ok: false, message: error.message || 'Corpo invalido.' });
      return true;
    }

    const username = safeText(body.username, '').toLowerCase();
    const password = String(body.password || '');
    if (!username || !password) {
      sendJsonResponse(res, 400, { ok: false, message: 'Usuario e senha sao obrigatorios.' });
      return true;
    }

    const ip = getRequestIp(req);
    const limitKeys = getAuthRateLimitKeys(ip, username);
    const blockedStatus = limitKeys.map((key) => loginLimiter.check(key)).find((entry) => entry.blocked);
    if (blockedStatus && blockedStatus.blocked) {
      store.appendAudit('login_blocked', username, ip, 'rate_limited');
      sendJsonResponse(res, 429, {
        ok: false,
        message: 'Muitas tentativas de login. Aguarde alguns minutos.',
        retryAfterMs: blockedStatus.remainingMs
      });
      return true;
    }

    const verification = store.verifyUserLogin(username, password);
    if (!verification.ok) {
      limitKeys.forEach((key) => loginLimiter.failure(key));
      store.appendAudit(verification.reason === 'blocked' ? 'login_denied_blocked' : 'login_failed', username, ip, '');
      sendJsonResponse(res, verification.reason === 'blocked' ? 403 : 401, {
        ok: false,
        message: verification.reason === 'blocked' ? 'Este usuario esta bloqueado.' : 'Credenciais invalidas.'
      });
      return true;
    }

    limitKeys.forEach((key) => loginLimiter.success(key));
    const created = store.createSession(username, {
      ip,
      userAgent: getRequestUserAgent(req)
    });
    if (!created) {
      sendJsonResponse(res, 401, { ok: false, message: 'Falha ao criar sessao.' });
      return true;
    }

    sendJsonResponse(res, 200, {
      ok: true,
      user: {
        username: created.user.username,
        role: created.user.role,
        status: created.user.status
      },
      createdAt: created.createdAt,
      expiresAt: created.expiresAt
    }, {
      'Set-Cookie': buildSessionCookie(created.token, req)
    });
    return true;
  }

  if (req.method === 'POST' && reqUrl.pathname === config.API_LOGOUT_PATH) {
    const cookies = parseCookies(req.headers.cookie || '');
    const token = safeText(cookies[config.SESSION_COOKIE_NAME], '');
    const session = token ? store.getSession(token) : null;
    if (token) {
      store.revokeSession(token, {
        username: session && session.user ? session.user.username : '',
        ip: getRequestIp(req)
      });
    }
    sendJsonResponse(res, 200, { ok: true }, {
      'Set-Cookie': buildClearedSessionCookie(req)
    });
    return true;
  }

  if (req.method === 'GET' && reqUrl.pathname === config.API_BOOTSTRAP_PATH) {
    const session = requireSession(req, res);
    if (!session) return true;
    sendJsonResponse(res, 200, {
      ok: true,
      user: {
        username: session.user.username,
        role: session.user.role,
        status: session.user.status
      },
      appState: store.getAppState(),
      generatedAt: Date.now()
    });
    return true;
  }

  if (req.method === 'POST' && reqUrl.pathname === config.API_CHANGE_PASSWORD_PATH) {
    const session = requireSession(req, res);
    if (!session) return true;

    let body;
    try {
      body = await readJsonBody(req);
    } catch (error) {
      sendJsonResponse(res, 400, { ok: false, message: error.message || 'Corpo invalido.' });
      return true;
    }

    try {
      const user = store.changeOwnPassword(
        session.user.username,
        String(body.currentPassword || ''),
        String(body.newPassword || ''),
        {
          actor: session.user.username,
          ip: getRequestIp(req)
        }
      );
      sendJsonResponse(res, 200, {
        ok: true,
        user: {
          username: user.username,
          role: user.role,
          passwordUpdatedAt: user.passwordUpdatedAt
        }
      });
      broadcastJson({ type: 'app_state_sync', state: store.getAppState(), origin: `server:${session.user.username}` });
    } catch (error) {
      sendJsonResponse(res, 400, { ok: false, message: error.message || 'Falha ao alterar senha.' });
    }
    return true;
  }

  if (req.method === 'POST' && reqUrl.pathname === config.API_ADMIN_USERS_PATH) {
    const session = requireSession(req, res);
    if (!session) return true;
    if (session.user.role !== 'superadmin') {
      sendJsonResponse(res, 403, { ok: false, message: 'Apenas superadmin pode criar usuarios.' });
      return true;
    }

    let body;
    try {
      body = await readJsonBody(req);
    } catch (error) {
      sendJsonResponse(res, 400, { ok: false, message: error.message || 'Corpo invalido.' });
      return true;
    }

    try {
      const user = store.createUser({
        username: body.username,
        role: body.role,
        password: body.password,
        actor: session.user.username
      });
      sendJsonResponse(res, 200, { ok: true, user });
      broadcastJson({ type: 'app_state_sync', state: store.getAppState(), origin: `server:${session.user.username}` });
    } catch (error) {
      sendJsonResponse(res, 400, { ok: false, message: error.message || 'Falha ao criar usuario.' });
    }
    return true;
  }

  if (req.method === 'POST' && /^\/api\/admin\/users\/[^/]+\/password$/.test(reqUrl.pathname)) {
    const session = requireSession(req, res);
    if (!session) return true;
    if (session.user.role !== 'superadmin') {
      sendJsonResponse(res, 403, { ok: false, message: 'Apenas superadmin pode alterar senhas de outros usuarios.' });
      return true;
    }

    let body;
    try {
      body = await readJsonBody(req);
    } catch (error) {
      sendJsonResponse(res, 400, { ok: false, message: error.message || 'Corpo invalido.' });
      return true;
    }

    const segments = reqUrl.pathname.split('/');
    const targetUsername = decodeURIComponent(segments[4] || '').toLowerCase();
    try {
      const user = store.updateUserPassword(targetUsername, String(body.newPassword || ''), {
        actor: session.user.username,
        ip: getRequestIp(req)
      });
      sendJsonResponse(res, 200, {
        ok: true,
        user: {
          username: user.username,
          role: user.role,
          passwordUpdatedAt: user.passwordUpdatedAt
        }
      });
      broadcastJson({ type: 'app_state_sync', state: store.getAppState(), origin: `server:${session.user.username}` });
    } catch (error) {
      sendJsonResponse(res, 400, { ok: false, message: error.message || 'Falha ao atualizar senha.' });
    }
    return true;
  }

  return false;
}

async function serveRequest(req, res) {
  let reqUrl;
  try {
    reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch {
    sendTextResponse(res, 400, 'Bad request');
    return;
  }

  if (reqUrl.pathname.startsWith('/api/')) {
    const handled = await handleApiRequest(req, res, reqUrl);
    if (!handled) {
      sendJsonResponse(res, 404, { ok: false, message: 'Rota nao encontrada.' });
    }
    return;
  }

  let pathname = decodeURIComponent(reqUrl.pathname);
  if (pathname === '/') pathname = '/index.html';

  const safePath = path.resolve(config.ROOT_DIR, `.${pathname}`);
  const rootWithSep = config.ROOT_DIR.endsWith(path.sep) ? config.ROOT_DIR : `${config.ROOT_DIR}${path.sep}`;
  if (safePath !== config.ROOT_DIR && !safePath.startsWith(rootWithSep)) {
    sendTextResponse(res, 403, 'Forbidden');
    return;
  }

  fs.stat(safePath, (statErr, stat) => {
    if (statErr || !stat) {
      sendTextResponse(res, 404, 'Not found');
      return;
    }

    const filePath = stat.isDirectory() ? path.join(safePath, 'index.html') : safePath;
    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        sendTextResponse(res, 404, 'Not found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      const contentType = config.CONTENT_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType, 'Cache-Control': 'no-cache' });
      res.end(data);
    });
  });
}

const server = http.createServer((req, res) => {
  Promise.resolve(serveRequest(req, res)).catch((error) => {
    console.error('[portal] erro interno', error);
    if (!res.headersSent) {
      sendJsonResponse(res, 500, { ok: false, message: 'Erro interno do servidor.' });
      return;
    }
    try {
      res.end();
    } catch {
      // ignore
    }
  });
});

const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (req, socket, head) => {
  let reqUrl;
  try {
    reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  } catch {
    socket.destroy();
    return;
  }

  const pathname = reqUrl.pathname || '/';
  const pathOk = pathname === config.WS_PATH || pathname === `${config.WS_PATH}/`;
  if (!pathOk) {
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    socketRequest.set(ws, req);
    wss.emit('connection', ws, req);
  });
});

wss.on('connection', (ws, req) => {
  socketRequest.set(ws, req);
  wsLog('client connected', 'clients=', wss.clients.size);

  if (!authenticateSocket(ws, {}, req)) {
    sendJson(ws, { type: 'auth_required' });
  }

  ws.on('message', (raw) => {
    let payload;
    try {
      payload = JSON.parse(raw.toString());
    } catch {
      return;
    }
    if (!payload || typeof payload !== 'object') return;
    wsLog('recv', payload.type || 'unknown', 'clients=', wss.clients.size);

    if (payload.type === 'ping') {
      sendJson(ws, { type: 'pong', ts: Date.now() });
      return;
    }

    if (payload.type === 'auth') {
      const ok = authenticateSocket(ws, payload, req);
      if (!ok) {
        ws.close();
      }
      return;
    }

    const actor = getAuthorizedUser(ws);
    if (!actor) {
      sendJson(ws, { type: 'auth_required' });
      return;
    }

    if (payload.type === 'presence') {
      const changed = upsertPresenceFromPayload(ws, payload);
      if (changed) broadcastSnapshot();
      return;
    }

    if (payload.type === 'leave') {
      const changed = applyLeaveFromPayload(ws);
      if (changed) broadcastSnapshot();
      return;
    }

    if (payload.type === 'app_state_sync') {
      const nextState = store.normalizeAppState(payload.state);
      const nextSerialized = JSON.stringify(nextState);
      if (nextSerialized === store.getAppStateSerialized()) {
        wsLog('skip app_state_sync unchanged', 'actor=', actor.username, 'origin=', safeText(payload.origin, '') || 'remote');
        return;
      }
      store.replaceAppState(nextState);
      wsLog('apply app_state_sync', {
        users: Array.isArray(store.getAppState().users) ? store.getAppState().users.length : 0,
        tickets: Array.isArray(store.getAppState().tickets) ? store.getAppState().tickets.length : 0,
        logs: Array.isArray(store.getAppState().logs) ? store.getAppState().logs.length : 0
      }, 'actor=', actor.username, 'origin=', safeText(payload.origin, '') || 'remote');
      broadcastJson({
        type: 'app_state_sync',
        state: store.getAppState(),
        origin: safeText(payload.origin, '') || `remote:${actor.username}`
      });
      return;
    }

    if (payload.type === 'state_request') {
      sendJson(ws, { type: 'app_state_sync', state: store.getAppState(), origin: 'server_on_demand' });
      return;
    }

    if (payload.type === 'stealth_sync') {
      const nextBus = store.setStealthBusState(payload.bus);
      wsLog('apply stealth_sync', 'actor=', actor.username, 'sessions=', Array.isArray(nextBus.sessions) ? nextBus.sessions.length : 0);
      broadcastJson({ type: 'stealth_sync', bus: nextBus });
      return;
    }

    if (payload.type === 'live_broadcast_sync') {
      if (!canSendLiveBroadcastAs(actor)) {
        sendJson(ws, { type: 'permission_error', message: 'Sem permissao para broadcast ao vivo.' });
        return;
      }
      const nextBroadcast = store.setLiveBroadcastState(payload.payload);
      if (nextBroadcast) {
        wsLog('apply live_broadcast_sync', 'actor=', actor.username, 'sender=', nextBroadcast.sender, 'audience=', nextBroadcast.audience.type);
        broadcastJson({ type: 'live_broadcast_sync', payload: nextBroadcast });
      }
      return;
    }

    if (payload.type === 'snapshot_request') {
      sendJson(ws, getSnapshotPayload());
    }
  });

  ws.on('close', () => {
    authBySocket.delete(ws);
    const username = detachSocketFromUser(ws);
    socketRequest.delete(ws);
    wsLog('client disconnected', username || '-', 'clients=', wss.clients.size);
    if (username) {
      broadcastSnapshot();
    }
  });
});

setInterval(cleanupStalePresence, config.CLEANUP_INTERVAL_MS);

server.listen(config.PORT, '0.0.0.0', () => {
  console.log(`[portal] HTTP + WS online em http://0.0.0.0:${config.PORT}`);
  console.log(`[portal] WebSocket path: ${config.WS_PATH}`);
  console.log(`[portal] Estado migrado para SQLite em: ${config.DB_FILE}`);
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
