const crypto = require('crypto');

function safeTimingEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ''), 'utf-8');
  const rightBuffer = Buffer.from(String(right || ''), 'utf-8');
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function hashPassword(password) {
  const safePassword = String(password || '');
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(safePassword, salt, 64);
  return `scrypt:${salt.toString('base64url')}:${derived.toString('base64url')}`;
}

function verifyPassword(password, storedHash) {
  const safeStoredHash = String(storedHash || '');
  if (!safeStoredHash.startsWith('scrypt:')) return false;
  const parts = safeStoredHash.split(':');
  if (parts.length !== 3) return false;
  try {
    const salt = Buffer.from(parts[1], 'base64url');
    const expected = Buffer.from(parts[2], 'base64url');
    const derived = crypto.scryptSync(String(password || ''), salt, expected.length);
    return crypto.timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}

function createSessionToken() {
  return crypto.randomBytes(32).toString('base64url');
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value || ''), 'utf-8').digest('hex');
}

function parseCookies(headerValue) {
  const header = String(headerValue || '').trim();
  if (!header) return {};
  return header.split(';').reduce((acc, entry) => {
    const idx = entry.indexOf('=');
    if (idx <= 0) return acc;
    const key = entry.slice(0, idx).trim();
    const value = entry.slice(idx + 1).trim();
    if (!key) return acc;
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(String(value || ''))}`];
  parts.push(`Path=${options.path || '/'}`);
  if (options.httpOnly !== false) parts.push('HttpOnly');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push('Secure');
  if (typeof options.maxAge === 'number') parts.push(`Max-Age=${Math.max(0, Math.floor(options.maxAge))}`);
  if (options.expires instanceof Date) parts.push(`Expires=${options.expires.toUTCString()}`);
  return parts.join('; ');
}

function createRateLimiter({ limit, windowMs, blockMs }) {
  const buckets = new Map();

  function getBucket(key, now = Date.now()) {
    const safeKey = String(key || '').trim().toLowerCase();
    if (!safeKey) return null;
    const current = buckets.get(safeKey);
    if (!current) {
      const next = { count: 0, firstAt: now, blockedUntil: 0 };
      buckets.set(safeKey, next);
      return next;
    }
    if (current.blockedUntil > 0 && current.blockedUntil <= now) {
      current.count = 0;
      current.firstAt = now;
      current.blockedUntil = 0;
    } else if (now - current.firstAt > windowMs) {
      current.count = 0;
      current.firstAt = now;
    }
    return current;
  }

  return {
    check(key, now = Date.now()) {
      const bucket = getBucket(key, now);
      if (!bucket) return { blocked: false, remainingMs: 0 };
      if (bucket.blockedUntil > now) {
        return { blocked: true, remainingMs: bucket.blockedUntil - now };
      }
      return { blocked: false, remainingMs: 0 };
    },
    success(key) {
      const safeKey = String(key || '').trim().toLowerCase();
      if (!safeKey) return;
      buckets.delete(safeKey);
    },
    failure(key, now = Date.now()) {
      const bucket = getBucket(key, now);
      if (!bucket) return { blocked: false, remainingMs: 0 };
      bucket.count += 1;
      if (bucket.count >= limit) {
        bucket.blockedUntil = now + blockMs;
        return { blocked: true, remainingMs: blockMs };
      }
      return { blocked: false, remainingMs: 0 };
    }
  };
}

module.exports = {
  createRateLimiter,
  createSessionToken,
  hashPassword,
  parseCookies,
  safeTimingEqual,
  serializeCookie,
  sha256,
  verifyPassword
};
