import { createClient, type Client } from "@libsql/client";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import * as schema from "./schema";

export type AppDb = LibSQLDatabase<typeof schema>;

export type DbMode = "memory" | "file" | "turso";

let testOverride: AppDb | null = null;
let singleton: AppDb | null = null;

/** Unit tests inject an isolated DB so sign-in/stores don't hit file/Turso. */
export function setTestDbOverride(db: AppDb | null): void {
  testOverride = db;
}

/**
 * Connection policy (AC-10 / NFR-07):
 * - Vitest / CYI_DB_MODE=memory / test override → in-process memory
 * - TURSO_DATABASE_URL + TURSO_AUTH_TOKEN → Turso
 * - Vercel without Turso → throw
 * - else → local file libSQL (next.dev / Playwright)
 */
export function resolveDbMode(
  env: NodeJS.ProcessEnv = process.env,
  hasTestOverride = false
): DbMode {
  if (hasTestOverride) return "memory";
  if (env.CYI_DB_MODE === "memory" || env.VITEST) {
    return "memory";
  }
  if (env.TURSO_DATABASE_URL && env.TURSO_AUTH_TOKEN) {
    return "turso";
  }
  if (env.VERCEL) {
    throw new Error(
      "TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required on Vercel"
    );
  }
  return "file";
}

function resolveMode(): DbMode {
  return resolveDbMode(process.env, testOverride !== null);
}

function createLibsqlClient(mode: DbMode): Client {
  if (mode === "turso") {
    return createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });
  }
  if (mode === "memory") {
    return createClient({ url: ":memory:" });
  }
  const path =
    process.env.CYI_LOCAL_DB_PATH ?? join(process.cwd(), ".data", "local.db");
  mkdirSync(dirname(path), { recursive: true });
  return createClient({ url: `file:${path}` });
}

export async function migrateDb(db: AppDb): Promise<void> {
  await migrate(db, { migrationsFolder: join(process.cwd(), "drizzle") });
}

/** Fresh in-memory DB with migrations applied (unit tests). */
export async function createTestDb(): Promise<AppDb> {
  const client = createClient({ url: ":memory:" });
  const db = drizzle(client, { schema });
  await migrateDb(db);
  return db;
}

/**
 * File-backed DB for reconnect / durability tests (AC-5).
 * Caller owns the path (usually under os.tmpdir()). Call `close()` when done.
 */
export async function createFileDb(
  absolutePath: string
): Promise<{ db: AppDb; close: () => void }> {
  mkdirSync(dirname(absolutePath), { recursive: true });
  const client = createClient({ url: `file:${absolutePath}` });
  const db = drizzle(client, { schema });
  await migrateDb(db);
  return {
    db,
    close: () => {
      client.close();
    },
  };
}

/**
 * App singleton — Turso, local file when TURSO_* unset, or memory under Vitest.
 * Prefer setTestDbOverride in FEAT-009 tests for isolation.
 */
export async function getDb(): Promise<AppDb> {
  if (testOverride) return testOverride;
  if (singleton) return singleton;

  const mode = resolveMode();
  const client = createLibsqlClient(mode);
  const db = drizzle(client, { schema });
  await migrateDb(db);

  // Upsert Laura/Demo + catalogs whenever seed env is present (idempotent)
  if (process.env.SEED_PASSWORD_LAURA && process.env.SEED_PASSWORD_DEMO) {
    const { seedDatabase } = await import("./seed");
    await seedDatabase(db);
  }

  singleton = db;
  return db;
}

/** Test helper: drop singleton so reconnect tests can open a new client. */
export function resetDbSingleton(): void {
  singleton = null;
}
