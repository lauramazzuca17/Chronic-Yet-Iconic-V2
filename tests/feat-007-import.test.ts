/**
 * FEAT-007 — Import (third-party CSV pair)
 * Skeleton: first test active (will fail until /tdd-cycle); remaining ACs todo.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const fixtures = join(process.cwd(), "fixtures", "import");

describe("FEAT-007 import", () => {
  it("AC-1: import requires both summary and detailed CSVs — no partial commit", async () => {
    const { importHealthCsvPair, listImportedSamples, resetImports } =
      await import("../src/import/store");
    resetImports();
    const accountId = "acct-laura";
    const detailed = readFileSync(
      join(fixtures, "health_export_detailed_20260810.csv"),
      "utf8"
    );

    const result = importHealthCsvPair({
      accountId,
      summaryCsv: null,
      detailedCsv: detailed,
      summaryFilename: null,
      detailedFilename: "health_export_detailed_20260810.csv",
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errorKey).toBe("import.error_missing_pair");
    expect(listImportedSamples(accountId)).toHaveLength(0);
  });

  it("AC-2: valid fixture pair maps detailed Metric → metric_key and NY recorded_at", async () => {
    const { importHealthCsvPair, listImportedSamples, resetImports } =
      await import("../src/import/store");
    resetImports();
    const accountId = "acct-laura";
    const summary = readFileSync(
      join(fixtures, "health_export_summary_20260810.csv"),
      "utf8"
    );
    const detailed = readFileSync(
      join(fixtures, "health_export_detailed_20260810.csv"),
      "utf8"
    );

    const result = importHealthCsvPair({
      accountId,
      summaryCsv: summary,
      detailedCsv: detailed,
      summaryFilename: "health_export_summary_20260810.csv",
      detailedFilename: "health_export_detailed_20260810.csv",
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const samples = listImportedSamples(accountId);
    expect(samples.length).toBeGreaterThan(0);

    const firstHr = samples.find(
      (s) =>
        s.metricKey === "heart_rate" &&
        s.value === 117 &&
        s.recordedAt.startsWith("2026-07-15T17:32:48")
    );
    expect(firstHr).toBeDefined();
    expect(firstHr?.unit).toBe("bpm");

    const walking = samples.find(
      (s) => s.metricKey === "walking_heart_rate_average" && s.value === 127.5
    );
    expect(walking).toBeDefined();

    const hrv = samples.find(
      (s) => s.metricKey === "heart_rate_variability" && s.value === 16.122
    );
    expect(hrv).toBeDefined();
    expect(hrv?.unit).toBe("ms");

    const steps = samples.find(
      (s) => s.metricKey === "step_count" && s.value === 388
    );
    expect(steps).toBeDefined();

    // Timestamp with -04:00 offset → America/New_York wall clock (no Z / offset stored)
    expect(firstHr?.recordedAt).toBe("2026-07-15T17:32:48");
    expect(result.inserted).toBeGreaterThan(0);
  });

  it("AC-3: summary day rows stored; BP columns never imported", async () => {
    const { importHealthCsvPair, listImportedSamples, resetImports } =
      await import("../src/import/store");
    resetImports();
    const accountId = "acct-laura";
    const detailed = readFileSync(
      join(fixtures, "health_export_detailed_20260810.csv"),
      "utf8"
    );
    // Fixture BP cells are empty — inject values so skip is observable.
    const summary = readFileSync(
      join(fixtures, "health_export_summary_20260810.csv"),
      "utf8"
    ).replace(
      "2026-07-15,2486,98.7,,,,,,1.1,1325.9,91.0,23.4,19.6,,127.5,3.0,1240.8,2.0,,,98.40,,,,",
      "2026-07-15,2486,98.7,,,,,,1.1,1325.9,91.0,23.4,19.6,,127.5,3.0,1240.8,2.0,,,98.40,120,80,,"
    );

    const result = importHealthCsvPair({
      accountId,
      summaryCsv: summary,
      detailedCsv: detailed,
      summaryFilename: "health_export_summary_20260810.csv",
      detailedFilename: "health_export_detailed_20260810.csv",
    });
    expect(result.ok).toBe(true);

    const samples = listImportedSamples(accountId);

    const summarySteps = samples.find(
      (s) =>
        s.metricKey === "summary_steps" &&
        s.value === 2486 &&
        s.recordedAt.startsWith("2026-07-15")
    );
    expect(summarySteps).toBeDefined();

    const summaryResting = samples.find(
      (s) =>
        s.metricKey === "summary_resting_heart_rate" &&
        s.value === 91 &&
        s.recordedAt.startsWith("2026-07-15")
    );
    expect(summaryResting).toBeDefined();

    const summarySpo2 = samples.find(
      (s) =>
        s.metricKey === "summary_blood_oxygen" &&
        s.value === 98.4 &&
        s.recordedAt.startsWith("2026-07-15")
    );
    expect(summarySpo2).toBeDefined();

    expect(
      samples.some(
        (s) =>
          s.metricKey.includes("bp_") ||
          s.metricKey.includes("blood_pressure") ||
          s.metricKey === "summary_bp_systolic" ||
          s.metricKey === "summary_bp_diastolic" ||
          (s.value === 120 && s.recordedAt.startsWith("2026-07-15") && s.metricKey.includes("systolic")) ||
          (s.value === 80 && s.recordedAt.startsWith("2026-07-15") && s.metricKey.includes("diastolic"))
      )
    ).toBe(false);
  });

  it("AC-4: re-import skips duplicates; reports new + skipped counts", async () => {
    const { importHealthCsvPair, listImportedSamples, resetImports } =
      await import("../src/import/store");
    resetImports();
    const accountId = "acct-laura";
    const summary = readFileSync(
      join(fixtures, "health_export_summary_20260810.csv"),
      "utf8"
    );
    const detailed = readFileSync(
      join(fixtures, "health_export_detailed_20260810.csv"),
      "utf8"
    );
    const input = {
      accountId,
      summaryCsv: summary,
      detailedCsv: detailed,
      summaryFilename: "health_export_summary_20260810.csv",
      detailedFilename: "health_export_detailed_20260810.csv",
    };

    const first = importHealthCsvPair(input);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(first.inserted).toBeGreaterThan(0);
    // Fixture can contain same metric/value within one NY second after normalize.
    const afterFirst = listImportedSamples(accountId).length;
    expect(afterFirst).toBe(first.inserted);

    const second = importHealthCsvPair(input);
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(second.inserted).toBe(0);
    expect(second.skipped).toBe(first.inserted + first.skipped);
    expect(listImportedSamples(accountId)).toHaveLength(afterFirst);
  });

  it("AC-5: Demo cannot read or delete Laura import batches", async () => {
    const {
      importHealthCsvPair,
      listImportedSamples,
      listImportBatches,
      deleteImportBatch,
      resetImports,
    } = await import("../src/import/store");
    resetImports();
    const laura = "acct-laura";
    const demo = "acct-demo";
    const summary = readFileSync(
      join(fixtures, "health_export_summary_20260810.csv"),
      "utf8"
    );
    const detailed = readFileSync(
      join(fixtures, "health_export_detailed_20260810.csv"),
      "utf8"
    );

    const result = importHealthCsvPair({
      accountId: laura,
      summaryCsv: summary,
      detailedCsv: detailed,
      summaryFilename: "health_export_summary_20260810.csv",
      detailedFilename: "health_export_detailed_20260810.csv",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(listImportedSamples(laura).length).toBeGreaterThan(0);
    expect(listImportBatches(laura)).toHaveLength(1);
    expect(listImportedSamples(demo)).toHaveLength(0);
    expect(listImportBatches(demo)).toHaveLength(0);

    expect(deleteImportBatch(demo, result.batchId)).toBe(false);
    expect(listImportedSamples(laura).length).toBeGreaterThan(0);
    expect(listImportBatches(laura)).toHaveLength(1);
  });

  it("AC-6: batch-delete removes all samples from that ImportBatch", async () => {
    const {
      importHealthCsvPair,
      listImportedSamples,
      listImportBatches,
      deleteImportBatch,
      resetImports,
    } = await import("../src/import/store");
    resetImports();
    const accountId = "acct-laura";
    const summary = readFileSync(
      join(fixtures, "health_export_summary_20260810.csv"),
      "utf8"
    );
    const detailed = readFileSync(
      join(fixtures, "health_export_detailed_20260810.csv"),
      "utf8"
    );

    const result = importHealthCsvPair({
      accountId,
      summaryCsv: summary,
      detailedCsv: detailed,
      summaryFilename: "health_export_summary_20260810.csv",
      detailedFilename: "health_export_detailed_20260810.csv",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(listImportedSamples(accountId).length).toBeGreaterThan(0);
    expect(listImportBatches(accountId)).toHaveLength(1);

    expect(deleteImportBatch(accountId, result.batchId)).toBe(true);
    expect(listImportBatches(accountId)).toHaveLength(0);
    expect(listImportedSamples(accountId)).toHaveLength(0);
  });

  it("AC-7: /import shell title + subtitle + upload + batch list helpers", async () => {
    const { getShellHeaderChrome } = await import("../src/shell/chrome");
    const importChrome = getShellHeaderChrome("/import");
    expect(importChrome.title).toBe("Import");
    expect(importChrome.subtitle).toBe(
      "Upload Apple Health export files to populate your health database."
    );

    const {
      IMPORT_COPY,
      formatDatabaseSummaryCount,
      formatBatchMeta,
    } = await import("../src/import/copy");
    expect(IMPORT_COPY["import.upload.title"]).toBe("Upload Files");
    expect(IMPORT_COPY["import.history.title"]).toBe("Import History");
    expect(IMPORT_COPY["import.start"]).toBe("Start import");
    expect(IMPORT_COPY["import.error_missing_pair"]).toBe(
      "Need both summary and detailed CSV files."
    );
    expect(formatDatabaseSummaryCount(300)).toBe("300 health records stored.");
    expect(formatBatchMeta(100, "2026-08-05T23:35:00")).toBe(
      "100 Records · Aug 5, 11:35 PM"
    );

    const {
      importHealthCsvPair,
      countImportedRecords,
      countSamplesInBatch,
      listImportBatches,
      resetImports,
    } = await import("../src/import/store");
    resetImports();
    const summary = readFileSync(
      join(fixtures, "health_export_summary_20260810.csv"),
      "utf8"
    );
    const detailed = readFileSync(
      join(fixtures, "health_export_detailed_20260810.csv"),
      "utf8"
    );
    const result = importHealthCsvPair({
      accountId: "acct-laura",
      summaryCsv: summary,
      detailedCsv: detailed,
      summaryFilename: "health_export_summary_20260810.csv",
      detailedFilename: "health_export_detailed_20260810.csv",
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const total = countImportedRecords("acct-laura");
    expect(total).toBeGreaterThan(0);
    expect(countSamplesInBatch(result.batchId)).toBe(total);
    const batches = listImportBatches("acct-laura");
    expect(batches).toHaveLength(1);
    expect(batches[0].detailedFilename).toBe(
      "health_export_detailed_20260810.csv"
    );
  });

});
