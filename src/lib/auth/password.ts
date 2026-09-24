import 'server-only';
import { hashPasswordCore, verifyPasswordCore } from './password-core';

export async function hashPassword(password: string): Promise<string> {
  if (password.length < 12) throw new Error('Password does not meet minimum length.');
  return hashPasswordCore(password);
}

export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
  return verifyPasswordCore(password, passwordHash);
}
