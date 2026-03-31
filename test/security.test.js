const test = require('node:test');
const assert = require('node:assert/strict');

const { createRateLimiter, hashPassword, verifyPassword } = require('../server/security');

test('hashPassword and verifyPassword validate the same password and reject another one', () => {
  const password = 'senha-super-segura-123';
  const hash = hashPassword(password);

  assert.equal(typeof hash, 'string');
  assert.equal(hash.startsWith('scrypt:'), true);
  assert.equal(verifyPassword(password, hash), true);
  assert.equal(verifyPassword('outra-senha', hash), false);
});

test('createRateLimiter blocks after repeated failures and resets on success', () => {
  const limiter = createRateLimiter({
    limit: 2,
    windowMs: 1000,
    blockMs: 4000
  });

  assert.deepEqual(limiter.check('ip:1'), { blocked: false, remainingMs: 0 });
  assert.equal(limiter.failure('ip:1').blocked, false);
  const blocked = limiter.failure('ip:1');
  assert.equal(blocked.blocked, true);
  assert.equal(blocked.remainingMs, 4000);

  limiter.success('ip:1');
  assert.deepEqual(limiter.check('ip:1'), { blocked: false, remainingMs: 0 });
});
