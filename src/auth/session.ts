import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { verifyPassword } from "@/db/password";
import { accounts } from "@/db/schema";

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

/** In-process active sessions — HTTP-only cookies carry the sealed payload. */
const activeSessions = new Set<string>();

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
 * Sign in against Account.password_hash in the DB (FEAT-009 AC-3).
 * Seed hashes come from SEED_PASSWORD_* via seedDatabase — never plaintext in DB.
 */
export async function signIn(input: {
  username: string;
  password: string;
}): Promise<SignInResult> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(accounts)
    .where(eq(accounts.username, input.username))
    .limit(1);
  const account = rows[0];
  if (
    !account ||
    !verifyPassword(account.username, input.password, account.passwordHash)
  ) {
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
