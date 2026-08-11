import { insertHealthStub, resetHealthStub, type HealthStubRow } from "./stub-store";

/**
 * V1 health log/import seed — Demo must stay empty (AC-10).
 * Catalogs are separate and may be seeded later without health rows.
 */
const V1_HEALTH_LOG_SEED: Record<string, HealthStubRow[]> = {
  "acct-laura": [],
  "acct-demo": [],
};

export function seededHealthLogCount(accountId: string): number {
  return V1_HEALTH_LOG_SEED[accountId]?.length ?? 0;
}

/** Reset stub store and apply the v1 health seed (Demo: zero logs/imports). */
export function applyV1HealthSeed(): void {
  resetHealthStub();
  for (const rows of Object.values(V1_HEALTH_LOG_SEED)) {
    for (const row of rows) {
      insertHealthStub(row);
    }
  }
}
