import type { Session } from "../auth/session";

export type HealthStubRow = {
  id: string;
  accountId: string;
  kind: string;
  label: string;
};

const rows: HealthStubRow[] = [];

/** Test/FEAT-001 isolation stub — replace with Turso queries in later FEATs. */
export function resetHealthStub(): void {
  rows.length = 0;
}

export function insertHealthStub(row: HealthStubRow): void {
  rows.push({ ...row });
}

/**
 * Always filter by the session account — never return cross-account health rows.
 */
export function listHealthRowsForSession(session: Session): HealthStubRow[] {
  return rows.filter((row) => row.accountId === session.accountId);
}
