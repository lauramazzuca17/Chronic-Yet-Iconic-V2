import { scryptSync, timingSafeEqual } from "node:crypto";

/** Same salt scheme as FEAT-001 seed auth — used for Account.password_hash. */
export function hashPassword(username: string, password: string): string {
  return scryptSync(password, `cyi-seed:${username}`, 64).toString("hex");
}

export function hashPasswordBuffer(username: string, password: string): Buffer {
  return scryptSync(password, `cyi-seed:${username}`, 64);
}

/** Compare plaintext password to hex-encoded scrypt hash from Account.password_hash. */
export function verifyPassword(
  username: string,
  password: string,
  passwordHashHex: string
): boolean {
  const attempt = hashPasswordBuffer(username, password);
  const stored = Buffer.from(passwordHashHex, "hex");
  if (attempt.length !== stored.length || stored.length === 0) return false;
  return timingSafeEqual(attempt, stored);
}
