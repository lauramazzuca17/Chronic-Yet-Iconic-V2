/**
 * FEAT-009 — Turso persistence (+ Import History per-file)
 * Skeleton: first test active (fails until /tdd-cycle); remaining ACs todo.
 */
import { describe, it, expect } from "vitest";

describe("FEAT-009 Turso persistence", () => {
  it("AC-1: Drizzle schema exposes Account and health tables from the data model", async () => {
    const schema = await import("../src/db/schema");
    expect(schema.accounts).toBeDefined();
    expect(schema.symptomCatalog).toBeDefined();
    expect(schema.medicationCatalog).toBeDefined();
    expect(schema.symptomLogs).toBeDefined();
    expect(schema.bloodPressureLogs).toBeDefined();
    expect(schema.medicationLogs).toBeDefined();
    expect(schema.waterLogs).toBeDefined();
    expect(schema.electrolyteLogs).toBeDefined();
    expect(schema.moodLogs).toBeDefined();
    expect(schema.eventLogs).toBeDefined();
    expect(schema.importBatches).toBeDefined();
    expect(schema.importedSamples).toBeDefined();
  });

  it("AC-2: seed upserts Laura + Demo hashes and catalogs; Demo health empty", async () => {
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { createTestDb } = await import("../src/db/client");
    const { seedDatabase } = await import("../src/db/seed");
    const {
      accounts,
      symptomCatalog,
      medicationCatalog,
      waterLogs,
      importBatches,
    } = await import("../src/db/schema");
    const { eq } = await import("drizzle-orm");

    const db = await createTestDb();
    await seedDatabase(db);

    const rows = await db.select().from(accounts);
    expect(rows.map((r) => r.username).sort()).toEqual(["Demo", "Laura"]);
    const laura = rows.find((r) => r.username === "Laura")!;
    const demo = rows.find((r) => r.username === "Demo")!;
    expect(laura.id).toBe("acct-laura");
    expect(demo.id).toBe("acct-demo");
    expect(laura.passwordHash.length).toBeGreaterThan(16);
    expect(demo.passwordHash.length).toBeGreaterThan(16);

    const lauraSymptoms = await db
      .select()
      .from(symptomCatalog)
      .where(eq(symptomCatalog.accountId, "acct-laura"));
    const demoSymptoms = await db
      .select()
      .from(symptomCatalog)
      .where(eq(symptomCatalog.accountId, "acct-demo"));
    expect(lauraSymptoms.length).toBe(7);
    expect(demoSymptoms.length).toBe(7);

    const lauraMeds = await db
      .select()
      .from(medicationCatalog)
      .where(eq(medicationCatalog.accountId, "acct-laura"));
    expect(lauraMeds.length).toBe(10);

    const demoWater = await db
      .select()
      .from(waterLogs)
      .where(eq(waterLogs.accountId, "acct-demo"));
    const demoImports = await db
      .select()
      .from(importBatches)
      .where(eq(importBatches.accountId, "acct-demo"));
    expect(demoWater).toHaveLength(0);
    expect(demoImports).toHaveLength(0);

    // Idempotent re-seed
    await seedDatabase(db);
    const rows2 = await db.select().from(accounts);
    expect(rows2).toHaveLength(2);
  });
  it("AC-3: sign-in verifies against Account.password_hash", async () => {
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { createTestDb, setTestDbOverride } = await import("../src/db/client");
    const { seedDatabase } = await import("../src/db/seed");
    const { signIn, signOut } = await import("../src/auth/session");

    const db = await createTestDb();
    await seedDatabase(db);
    setTestDbOverride(db);

    // Env passwords changed after seed — DB hash must still win
    process.env.SEED_PASSWORD_LAURA = "env-was-changed";
    process.env.SEED_PASSWORD_DEMO = "env-was-changed";

    const ok = await signIn({
      username: "Laura",
      password: "laura-test-secret",
    });
    expect(ok.ok).toBe(true);
    if (!ok.ok) return;
    expect(ok.session.accountId).toBe("acct-laura");
    await signOut(ok.session);

    const envOnly = await signIn({
      username: "Laura",
      password: "env-was-changed",
    });
    expect(envOnly.ok).toBe(false);

    const wrong = await signIn({
      username: "Laura",
      password: "totally-wrong",
    });
    expect(wrong.ok).toBe(false);

    setTestDbOverride(null);
  });

  it("AC-4: manual log + import stores use DB (no durable globalThis)", async () => {
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { createTestDb, setTestDbOverride } = await import("../src/db/client");
    const { seedDatabase } = await import("../src/db/seed");
    const { waterLogs } = await import("../src/db/schema");
    const { importedSamples, importBatches } = await import("../src/db/schema");
    const { createWaterLog, resetManualLogs, listTodayEntries } = await import(
      "../src/log/store"
    );
    const { importHealthCsvPair, resetImports, listImportedSamples } =
      await import("../src/import/store");
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const { eq } = await import("drizzle-orm");

    const db = await createTestDb();
    await seedDatabase(db);
    setTestDbOverride(db);
    await resetManualLogs();
    await resetImports();

    await createWaterLog({
      accountId: "acct-laura",
      amountOz: 8,
      recordedAt: "2026-08-15T10:00:00",
    });

    const waterRows = await db
      .select()
      .from(waterLogs)
      .where(eq(waterLogs.accountId, "acct-laura"));
    expect(waterRows).toHaveLength(1);
    expect(waterRows[0]?.amountOz).toBe(8);

    const listed = await listTodayEntries("acct-laura", "2026-08-15");
    expect(listed.some((e) => e.type === "water")).toBe(true);

    const g = globalThis as typeof globalThis & {
      __cyiManualLogs?: unknown;
      __cyiImportBatches?: unknown;
    };
    expect(g.__cyiManualLogs).toBeUndefined();

    const fixtures = join(process.cwd(), "fixtures", "import");
    const result = await importHealthCsvPair({
      accountId: "acct-laura",
      summaryCsv: readFileSync(
        join(fixtures, "health_export_summary_20260810.csv"),
        "utf8"
      ),
      detailedCsv: readFileSync(
        join(fixtures, "health_export_detailed_20260810.csv"),
        "utf8"
      ),
      summaryFilename: "health_export_summary_20260810.csv",
      detailedFilename: "health_export_detailed_20260810.csv",
    });
    expect(result.ok).toBe(true);

    const sampleRows = await db
      .select()
      .from(importedSamples)
      .where(eq(importedSamples.accountId, "acct-laura"));
    expect(sampleRows.length).toBeGreaterThan(0);
    const batchRows = await db
      .select()
      .from(importBatches)
      .where(eq(importBatches.accountId, "acct-laura"));
    expect(batchRows.length).toBeGreaterThan(0);

    const samples = await listImportedSamples("acct-laura");
    expect(samples.length).toBe(sampleRows.length);

    expect(g.__cyiImportBatches).toBeUndefined();

    setTestDbOverride(null);
  });

  it("AC-5: data survives new DB client reconnect", async () => {
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { mkdtempSync, rmSync } = await import("node:fs");
    const { join } = await import("node:path");
    const { tmpdir } = await import("node:os");
    const { eq } = await import("drizzle-orm");

    const dir = mkdtempSync(join(tmpdir(), "cyi-ac5-"));
    const dbPath = join(dir, "persist.db");

    const { createFileDb, setTestDbOverride, resetDbSingleton } = await import(
      "../src/db/client"
    );
    const { seedDatabase } = await import("../src/db/seed");
    const { waterLogs } = await import("../src/db/schema");
    const {
      createWaterLog,
      listTodayEntries,
      resetManualLogs,
    } = await import("../src/log/store");

    const { db: db1, close: close1 } = await createFileDb(dbPath);
    await seedDatabase(db1);
    setTestDbOverride(db1);
    await resetManualLogs();
    await createWaterLog({
      accountId: "acct-laura",
      amountOz: 16,
      recordedAt: "2026-08-15T12:00:00",
    });

    // Drop in-process handles — reopen same file with a new client
    setTestDbOverride(null);
    resetDbSingleton();
    close1();

    const { db: db2, close: close2 } = await createFileDb(dbPath);
    const rows = await db2
      .select()
      .from(waterLogs)
      .where(eq(waterLogs.accountId, "acct-laura"));
    expect(rows).toHaveLength(1);
    expect(rows[0]?.amountOz).toBe(16);

    setTestDbOverride(db2);
    const listed = await listTodayEntries("acct-laura", "2026-08-15");
    expect(
      listed.some((e) => e.type === "water" && e.amountOz === 16)
    ).toBe(true);

    setTestDbOverride(null);
    close2();
    try {
      rmSync(dir, { recursive: true, force: true });
    } catch {
      // Windows may briefly keep a lock on closed libSQL files — ignore cleanup.
    }
  });

  it("AC-6: pair import creates two ImportBatch rows sharing pair_id", async () => {
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { createTestDb, setTestDbOverride } = await import("../src/db/client");
    const { seedDatabase } = await import("../src/db/seed");
    const { importBatches, importedSamples } = await import("../src/db/schema");
    const { importHealthCsvPair, resetImports } = await import(
      "../src/import/store"
    );
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const { eq } = await import("drizzle-orm");

    const db = await createTestDb();
    await seedDatabase(db);
    setTestDbOverride(db);
    await resetImports();

    const fixtures = join(process.cwd(), "fixtures", "import");
    const result = await importHealthCsvPair({
      accountId: "acct-laura",
      summaryCsv: readFileSync(
        join(fixtures, "health_export_summary_20260810.csv"),
        "utf8"
      ),
      detailedCsv: readFileSync(
        join(fixtures, "health_export_detailed_20260810.csv"),
        "utf8"
      ),
      summaryFilename: "health_export_summary_20260810.csv",
      detailedFilename: "health_export_detailed_20260810.csv",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const batches = await db
      .select()
      .from(importBatches)
      .where(eq(importBatches.accountId, "acct-laura"));
    expect(batches).toHaveLength(2);
    expect(new Set(batches.map((b) => b.pairId)).size).toBe(1);
    expect(batches.map((b) => b.pairId)[0]).toBe(result.batchId);

    const formats = batches.map((b) => b.sourceFormat).sort();
    expect(formats).toEqual(["detailed_csv", "summary_csv"]);

    const detailed = batches.find((b) => b.sourceFormat === "detailed_csv")!;
    const summary = batches.find((b) => b.sourceFormat === "summary_csv")!;
    expect(detailed.originalFilename).toBe(
      "health_export_detailed_20260810.csv"
    );
    expect(summary.originalFilename).toBe("health_export_summary_20260810.csv");

    const detailedSamples = await db
      .select()
      .from(importedSamples)
      .where(eq(importedSamples.importBatchId, detailed.id));
    const summarySamples = await db
      .select()
      .from(importedSamples)
      .where(eq(importedSamples.importBatchId, summary.id));
    expect(detailedSamples.length).toBeGreaterThan(0);
    expect(summarySamples.length).toBeGreaterThan(0);

    setTestDbOverride(null);
  });

  it("AC-7: delete one file batch leaves sibling batch samples", async () => {
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { createTestDb, setTestDbOverride } = await import("../src/db/client");
    const { seedDatabase } = await import("../src/db/seed");
    const { importBatches, importedSamples } = await import("../src/db/schema");
    const { importHealthCsvPair, resetImports, deleteImportBatch } =
      await import("../src/import/store");
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const { eq } = await import("drizzle-orm");

    const db = await createTestDb();
    await seedDatabase(db);
    setTestDbOverride(db);
    await resetImports();

    const fixtures = join(process.cwd(), "fixtures", "import");
    const result = await importHealthCsvPair({
      accountId: "acct-laura",
      summaryCsv: readFileSync(
        join(fixtures, "health_export_summary_20260810.csv"),
        "utf8"
      ),
      detailedCsv: readFileSync(
        join(fixtures, "health_export_detailed_20260810.csv"),
        "utf8"
      ),
      summaryFilename: "summary.csv",
      detailedFilename: "detailed.csv",
    });
    expect(result.ok).toBe(true);

    const batches = await db
      .select()
      .from(importBatches)
      .where(eq(importBatches.accountId, "acct-laura"));
    const detailed = batches.find((b) => b.sourceFormat === "detailed_csv")!;
    const summary = batches.find((b) => b.sourceFormat === "summary_csv")!;
    expect(detailed).toBeDefined();
    expect(summary).toBeDefined();

    const summaryCountBefore = (
      await db
        .select()
        .from(importedSamples)
        .where(eq(importedSamples.importBatchId, summary.id))
    ).length;
    expect(summaryCountBefore).toBeGreaterThan(0);

    // Delete by file batch id (not pair_id) — REQ-15 per-file
    const deleted = await deleteImportBatch("acct-laura", detailed.id);
    expect(deleted).toBe(true);

    const remainingBatches = await db
      .select()
      .from(importBatches)
      .where(eq(importBatches.accountId, "acct-laura"));
    expect(remainingBatches).toHaveLength(1);
    expect(remainingBatches[0]?.id).toBe(summary.id);
    expect(remainingBatches[0]?.sourceFormat).toBe("summary_csv");

    const detailedSamplesLeft = await db
      .select()
      .from(importedSamples)
      .where(eq(importedSamples.importBatchId, detailed.id));
    expect(detailedSamplesLeft).toHaveLength(0);

    const summarySamplesLeft = await db
      .select()
      .from(importedSamples)
      .where(eq(importedSamples.importBatchId, summary.id));
    expect(summarySamplesLeft).toHaveLength(summaryCountBefore);

    // Wrong account cannot delete
    expect(await deleteImportBatch("acct-demo", summary.id)).toBe(false);

    setTestDbOverride(null);
  });

  it("AC-8: Import History lists one card per file", async () => {
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { createTestDb, setTestDbOverride } = await import("../src/db/client");
    const { seedDatabase } = await import("../src/db/seed");
    const {
      importHealthCsvPair,
      resetImports,
      listImportBatches,
      countSamplesInBatch,
    } = await import("../src/import/store");
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");

    const db = await createTestDb();
    await seedDatabase(db);
    setTestDbOverride(db);
    await resetImports();

    const fixtures = join(process.cwd(), "fixtures", "import");
    const result = await importHealthCsvPair({
      accountId: "acct-laura",
      summaryCsv: readFileSync(
        join(fixtures, "health_export_summary_20260810.csv"),
        "utf8"
      ),
      detailedCsv: readFileSync(
        join(fixtures, "health_export_detailed_20260810.csv"),
        "utf8"
      ),
      summaryFilename: "health_export_summary_20260810.csv",
      detailedFilename: "health_export_detailed_20260810.csv",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const batches = await listImportBatches("acct-laura");
    expect(batches).toHaveLength(2);
    expect(batches.map((b) => b.sourceFormat).sort()).toEqual([
      "detailed_csv",
      "summary_csv",
    ]);
    expect(batches.every((b) => b.pairId === result.batchId)).toBe(true);
    expect(new Set(batches.map((b) => b.id)).size).toBe(2);
    const names = batches.map((b) => b.originalFilename).sort();
    expect(names).toEqual([
      "health_export_detailed_20260810.csv",
      "health_export_summary_20260810.csv",
    ]);
    for (const b of batches) {
      expect(await countSamplesInBatch(b.id)).toBeGreaterThan(0);
    }

    setTestDbOverride(null);
  });

  it("AC-9: Demo cannot read or delete Laura DB rows", async () => {
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { createTestDb, setTestDbOverride } = await import("../src/db/client");
    const { seedDatabase } = await import("../src/db/seed");
    const { waterLogs, importBatches, importedSamples } = await import(
      "../src/db/schema"
    );
    const { eq } = await import("drizzle-orm");
    const {
      resetManualLogs,
      createWaterLog,
      listManualLogsForAccount,
      deleteManualLog,
      waterTotalOzForDate,
    } = await import("../src/log/store");
    const {
      importHealthCsvPair,
      resetImports,
      listImportedSamples,
      listImportBatches,
      deleteImportBatch,
    } = await import("../src/import/store");
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");

    const db = await createTestDb();
    await seedDatabase(db);
    setTestDbOverride(db);
    await resetManualLogs();
    await resetImports();

    const laura = "acct-laura";
    const demo = "acct-demo";
    const day = "2026-08-15";

    const lauraWater = await createWaterLog({
      accountId: laura,
      amountOz: 16,
      recordedAt: `${day}T09:00:00`,
    });

    const fixtures = join(process.cwd(), "fixtures", "import");
    const importResult = await importHealthCsvPair({
      accountId: laura,
      summaryCsv: readFileSync(
        join(fixtures, "health_export_summary_20260810.csv"),
        "utf8"
      ),
      detailedCsv: readFileSync(
        join(fixtures, "health_export_detailed_20260810.csv"),
        "utf8"
      ),
      summaryFilename: "health_export_summary_20260810.csv",
      detailedFilename: "health_export_detailed_20260810.csv",
    });
    expect(importResult.ok).toBe(true);
    if (!importResult.ok) return;

    // Shared DB holds Laura rows
    expect(
      (await db.select().from(waterLogs).where(eq(waterLogs.accountId, laura)))
        .length
    ).toBe(1);
    expect(
      (
        await db
          .select()
          .from(importBatches)
          .where(eq(importBatches.accountId, laura))
      ).length
    ).toBe(2);
    expect(
      (
        await db
          .select()
          .from(importedSamples)
          .where(eq(importedSamples.accountId, laura))
      ).length
    ).toBeGreaterThan(0);

    // Demo store APIs see nothing of Laura's
    expect(await listManualLogsForAccount(demo)).toHaveLength(0);
    expect(await waterTotalOzForDate(demo, day)).toBe(0);
    expect(await listImportBatches(demo)).toHaveLength(0);
    expect(await listImportedSamples(demo)).toHaveLength(0);

    // Demo cannot delete Laura rows by id / pair_id
    expect(await deleteManualLog(demo, lauraWater.id)).toBe(false);
    expect(await deleteImportBatch(demo, importResult.batchId)).toBe(false);
    const lauraFiles = await listImportBatches(laura);
    expect(await deleteImportBatch(demo, lauraFiles[0]!.id)).toBe(false);

    // Laura data intact
    expect(await listManualLogsForAccount(laura)).toHaveLength(1);
    expect(await waterTotalOzForDate(laura, day)).toBe(16);
    expect(await listImportBatches(laura)).toHaveLength(2);
    expect((await listImportedSamples(laura)).length).toBeGreaterThan(0);

    // Demo can own rows without leaking Laura's
    await createWaterLog({
      accountId: demo,
      amountOz: 8,
      recordedAt: `${day}T11:00:00`,
    });
    expect(await listManualLogsForAccount(demo)).toHaveLength(1);
    expect(await waterTotalOzForDate(demo, day)).toBe(8);
    expect(await listManualLogsForAccount(laura)).toHaveLength(1);

    setTestDbOverride(null);
  });

  it("AC-10: connection policy — memory / file fallback / Turso required on Vercel", async () => {
    const { resolveDbMode, createTestDb } = await import("../src/db/client");

    // Unit / Vitest path → in-process memory
    expect(resolveDbMode({ VITEST: "true" })).toBe("memory");
    expect(resolveDbMode({ CYI_DB_MODE: "memory" })).toBe("memory");
    expect(resolveDbMode({}, true)).toBe("memory");

    // Local next.dev / Playwright: TURSO unset → file
    expect(
      resolveDbMode({
        /* no VITEST, no TURSO, no VERCEL */
      })
    ).toBe("file");

    // Explicit Turso credentials win when not in Vitest
    expect(
      resolveDbMode({
        TURSO_DATABASE_URL: "libsql://example.turso.io",
        TURSO_AUTH_TOKEN: "tok",
      })
    ).toBe("turso");

    // Vercel without Turso → clear failure
    expect(() =>
      resolveDbMode({
        VERCEL: "1",
      })
    ).toThrow(/TURSO_DATABASE_URL and TURSO_AUTH_TOKEN are required on Vercel/);

    // createTestDb is always in-process (AC-10 unit path)
    const db = await createTestDb();
    expect(db).toBeDefined();
  });

  // AC-11 lives in e2e/feat-009-persistence-journey.spec.ts
});
