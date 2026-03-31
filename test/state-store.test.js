const fs = require('fs');
const os = require('os');
const path = require('path');
const test = require('node:test');
const assert = require('node:assert/strict');

const baseConfig = require('../server/config');
const { createStateStore } = require('../server/state-store');

function createTempConfig() {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tp-store-'));
  const legacyFile = path.join(rootDir, 'shared-state.json');
  const dbFile = path.join(rootDir, 'shared-state.sqlite');

  const legacyPayload = {
    appState: {
      users: [
        { username: 'esther', password: '1705', role: 'superadmin', status: 'active', debt: 0 },
        { username: 'felps', password: '1705', role: 'member', status: 'active', debt: 0 }
      ],
      tickets: [],
      logs: [],
      tasks: [],
      notes: [],
      announcements: [],
      settings: {}
    },
    stealthBus: { sessions: [] },
    liveBroadcast: null
  };

  fs.writeFileSync(legacyFile, JSON.stringify(legacyPayload, null, 2), 'utf-8');

  return {
    ...baseConfig,
    ROOT_DIR: rootDir,
    STATE_FILE: legacyFile,
    DB_FILE: dbFile
  };
}

test('state store migrates legacy JSON, sanitizes users and validates login', () => {
  const config = createTempConfig();
  const store = createStateStore(config);

  assert.equal(store.verifyUserLogin('esther', '1705').ok, true);
  assert.equal(store.verifyUserLogin('esther', 'senha-errada').ok, false);

  const appState = store.getAppState();
  const esther = appState.users.find((user) => user.username === 'esther');
  assert.ok(esther);
  assert.equal(Object.prototype.hasOwnProperty.call(esther, 'password'), false);
});

test('state store creates sessions and allows admin password updates', () => {
  const config = createTempConfig();
  const store = createStateStore(config);

  const created = store.createSession('esther', { ip: '127.0.0.1', userAgent: 'node:test' });
  assert.ok(created);
  assert.ok(created.token);

  const resolved = store.getSession(created.token);
  assert.ok(resolved);
  assert.equal(resolved.user.username, 'esther');

  store.updateUserPassword('felps', 'nova-senha-forte', { actor: 'esther', ip: '127.0.0.1' });
  assert.equal(store.verifyUserLogin('felps', 'nova-senha-forte').ok, true);
});
