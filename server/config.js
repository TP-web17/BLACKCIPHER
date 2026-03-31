const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const DEFAULT_PASSWORD = '1705';

const config = {
  ROOT_DIR,
  PORT: Number(process.env.PORT || 4317),
  WS_PATH: '/ws',
  ONLINE_WINDOW_MS: Number(process.env.PRESENCE_ONLINE_WINDOW_MS || 35000),
  CLEANUP_INTERVAL_MS: Number(process.env.PRESENCE_CLEANUP_INTERVAL_MS || 10000),
  STATE_FILE: process.env.SHARED_STATE_FILE || path.join(ROOT_DIR, 'shared-state.json'),
  DB_FILE: process.env.STATE_DB_FILE || path.join(ROOT_DIR, 'shared-state.sqlite'),
  DEBUG_WS: process.env.WS_DEBUG === '1',
  DEFAULT_PASSWORD,
  MAX_SERVER_LOG_ENTRIES: Number(process.env.MAX_SERVER_LOG_ENTRIES || 2500),
  MAX_SERVER_TICKET_MESSAGES: Number(process.env.MAX_SERVER_TICKET_MESSAGES || 600),
  MAX_PROFILE_NAME_LENGTH: 42,
  MAX_AVATAR_DATA_URL_LENGTH: 380000,
  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || 'tp_session',
  SESSION_TTL_MS: Number(process.env.SESSION_TTL_MS || (7 * 24 * 60 * 60 * 1000)),
  SESSION_TOUCH_MS: Number(process.env.SESSION_TOUCH_MS || (5 * 60 * 1000)),
  LOGIN_LIMIT: Number(process.env.LOGIN_LIMIT || 6),
  LOGIN_WINDOW_MS: Number(process.env.LOGIN_WINDOW_MS || (10 * 60 * 1000)),
  LOGIN_BLOCK_MS: Number(process.env.LOGIN_BLOCK_MS || (15 * 60 * 1000)),
  API_LOGIN_PATH: '/api/auth/login',
  API_SESSION_PATH: '/api/auth/session',
  API_LOGOUT_PATH: '/api/auth/logout',
  API_CHANGE_PASSWORD_PATH: '/api/auth/change-password',
  API_BOOTSTRAP_PATH: '/api/bootstrap-state',
  API_ADMIN_USERS_PATH: '/api/admin/users',
  CONTENT_TYPES: {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp'
  },
  CORE_USERS: [
    { username: 'esther', role: 'superadmin', password: DEFAULT_PASSWORD, lockedRole: true },
    { username: 'belle', role: 'admin', password: DEFAULT_PASSWORD, lockedRole: false },
    { username: 'felps', role: 'member', password: DEFAULT_PASSWORD, lockedRole: false },
    { username: 'lia', role: 'member', password: DEFAULT_PASSWORD, lockedRole: false },
    { username: 'yoon', role: 'member', password: DEFAULT_PASSWORD, lockedRole: false },
    { username: 'murilo', role: 'member', password: DEFAULT_PASSWORD, lockedRole: false },
    { username: 'matheus', role: 'member', password: DEFAULT_PASSWORD, lockedRole: false },
    { username: 'inteligencia tp', role: 'inteligencia', password: DEFAULT_PASSWORD, lockedRole: true }
  ]
};

module.exports = config;
