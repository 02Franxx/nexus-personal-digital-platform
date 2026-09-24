import assert from 'node:assert/strict';
import test from 'node:test';
import {
  hashPasswordCore as hashPassword,
  verifyPasswordCore as verifyPassword,
} from '../src/lib/auth/password-core.ts';

test('passwords are hashed and verified without storing the plaintext', async () => {
  const password = 'a-very-strong-password';
  const hash = await hashPassword(password);
  assert.notEqual(hash, password);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword('wrong-password-value', hash), false);
});
