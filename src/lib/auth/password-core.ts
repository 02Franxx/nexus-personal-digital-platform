import bcrypt from 'bcryptjs';

const COST_FACTOR = 12;

export async function hashPasswordCore(password: string): Promise<string> {
  return bcrypt.hash(password, COST_FACTOR);
}

export async function verifyPasswordCore(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return bcrypt.compare(password, passwordHash);
}
