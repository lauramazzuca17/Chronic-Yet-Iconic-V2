import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

export type Session = {
  sessionId: string;
  accountId: string;
  username: string;
};

export type ProtectedResult =
  | { ok: true; status: 200; data: { title: string } }
  | { ok: false; status: 401 };

export type SignInResult =
  | { ok: true; session: Session }
  | { ok: false; errorKey: "auth.login.error_invalid" };

type SeedAccount = {
  id: string;
  username: string;
  passwordHash: Buffer;
};

/** In-process active sessions — replaced by HTTP-only cookies later. */
const activeSessions = new Set<string>();

function hashPassword(username: string, password: string): Buffer {
  return scryptSync(password, `cyi-seed:${username}`, 64);
}

function loadSeedAccounts(): SeedAccount[] {
  const accounts: SeedAccount[] = [];
  const lauraPassword = process.env.SEED_PASSWORD_LAURA;
  const demoPassword = process.env.SEED_PASSWORD_DEMO;

  if (lauraPassword) {
    accounts.push({
      id: "acct-laura",
      username: "Laura",
      passwordHash: hashPassword("Laura", lauraPassword),
    });
  }
  if (demoPassword) {
    accounts.push({
      id: "acct-demo",
      username: "Demo",
      passwordHash: hashPassword("Demo", demoPassword),
    });
  }
  return accounts;
}

function passwordsMatch(password: string, username: string, hash: Buffer): boolean {
  const attempt = hashPassword(username, password);
  if (attempt.length !== hash.length) return false;
  return timingSafeEqual(attempt, hash);
}

/** Fixed v1 seed set — exactly Laura + Demo; no self-registration. */
export function listSeededAccounts(): { id: string; username: string }[] {
  return [
    { id: "acct-laura", username: "Laura" },
    { id: "acct-demo", username: "Demo" },
  ];
}

export function isActiveSession(session: Session | null): boolean {
  if (!session) return false;
  return activeSessions.has(session.sessionId);
}

/**
 * Gate for the Dashboard (Home) protected surface.
 * Unauthenticated / signed-out callers get 401 — no health/shell data.
 */
export async function getProtectedDashboard(input: {
  session: Session | null;
}): Promise<ProtectedResult> {
  if (!isActiveSession(input.session)) {
    return { ok: false, status: 401 };
  }
  return {
    ok: true,
    status: 200,
    data: { title: "Dashboard" },
  };
}

/**
 * Sign in against env-seeded accounts (Laura / Demo).
 * Passwords come from SEED_PASSWORD_* — never committed plaintext.
 */
export async function signIn(input: {
  username: string;
  password: string;
}): Promise<SignInResult> {
  const account = loadSeedAccounts().find((a) => a.username === input.username);
  if (!account || !passwordsMatch(input.password, account.username, account.passwordHash)) {
    return { ok: false, errorKey: "auth.login.error_invalid" };
  }
  const session: Session = {
    sessionId: randomUUID(),
    accountId: account.id,
    username: account.username,
  };
  activeSessions.add(session.sessionId);
  return { ok: true, session };
}

/** Clear the session so protected access requires sign-in again. */
export async function signOut(session: Session): Promise<void> {
  activeSessions.delete(session.sessionId);
}
