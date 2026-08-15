import {
  MEDICATION_CATALOG_NAMES,
  SYMPTOM_CATALOG_NAMES,
} from "@/log/catalogs";
import { wallClockNowInNewYork } from "@/log/timezone";
import type { AppDb } from "./client";
import { hashPassword } from "./password";
import {
  accounts,
  medicationCatalog,
  symptomCatalog,
} from "./schema";

const SEED_ACCOUNTS = [
  { id: "acct-laura", username: "Laura", envKey: "SEED_PASSWORD_LAURA" },
  { id: "acct-demo", username: "Demo", envKey: "SEED_PASSWORD_DEMO" },
] as const;

/**
 * Upsert Laura + Demo (password hashes from env) and per-account catalogs.
 * Does not insert any health logs/imports — Demo stays empty.
 */
export async function seedDatabase(db: AppDb): Promise<void> {
  const now = wallClockNowInNewYork();

  for (const acct of SEED_ACCOUNTS) {
    const password = process.env[acct.envKey];
    if (!password) {
      throw new Error(`${acct.envKey} is required to seed ${acct.username}`);
    }
    const passwordHash = hashPassword(acct.username, password);

    await db
      .insert(accounts)
      .values({
        id: acct.id,
        username: acct.username,
        passwordHash,
        createdAt: now,
      })
      .onConflictDoUpdate({
        target: accounts.id,
        set: { passwordHash, username: acct.username },
      });

    for (const name of SYMPTOM_CATALOG_NAMES) {
      await db
        .insert(symptomCatalog)
        .values({
          id: `sym-${acct.id}-${name}`,
          accountId: acct.id,
          name,
          createdAt: now,
        })
        .onConflictDoNothing({
          target: [symptomCatalog.accountId, symptomCatalog.name],
        });
    }

    for (const name of MEDICATION_CATALOG_NAMES) {
      await db
        .insert(medicationCatalog)
        .values({
          id: `med-${acct.id}-${name}`,
          accountId: acct.id,
          name,
          createdAt: now,
        })
        .onConflictDoNothing({
          target: [medicationCatalog.accountId, medicationCatalog.name],
        });
    }
  }
}
