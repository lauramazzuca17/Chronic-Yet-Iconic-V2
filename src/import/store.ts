/** Import batches + samples — Drizzle/Turso (FEAT-009). */

import { and, eq, inArray } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDb } from "@/db/client";
import { importBatches, importedSamples } from "@/db/schema";
import { wallClockNowInNewYork } from "../log/timezone";

export type ImportPairInput = {
  accountId: string;
  summaryCsv: string | null;
  detailedCsv: string | null;
  summaryFilename: string | null;
  detailedFilename: string | null;
};

export type ImportPairResult =
  | { ok: true; batchId: string; inserted: number; skipped: number }
  | { ok: false; errorKey: "import.error_missing_pair" };

export type ImportBatchStatus = "completed" | "processing" | "failed";

/** One history card per imported file (REQ-15 / Figma 62946:4447). */
export type ImportBatch = {
  id: string;
  accountId: string;
  pairId: string;
  sourceFormat: "detailed_csv" | "summary_csv";
  originalFilename: string | null;
  status: ImportBatchStatus;
  importedAt: string;
  createdAt: string;
};

export type ImportedSample = {
  id: string;
  accountId: string;
  importBatchId: string;
  metricKey: string;
  value: number;
  unit: string;
  recordedAt: string;
  createdAt: string;
};

/** Detailed CSV `Metric` → binding metric_key + default unit (03-data-model). */
export const DETAILED_METRIC_MAP: Record<
  string,
  { metricKey: string; unit: string }
> = {
  heart_rate: { metricKey: "heart_rate", unit: "bpm" },
  resting_heart_rate: { metricKey: "resting_heart_rate", unit: "bpm" },
  walking_heart_rate_avg: {
    metricKey: "walking_heart_rate_average",
    unit: "bpm",
  },
  hrv_sdnn: { metricKey: "heart_rate_variability", unit: "ms" },
  steps: { metricKey: "step_count", unit: "count" },
  distance_walking_running: {
    metricKey: "walking_running_distance",
    unit: "mi",
  },
  exercise_minutes: { metricKey: "apple_exercise_time", unit: "min" },
  active_energy: { metricKey: "active_energy", unit: "kcal" },
  basal_energy: { metricKey: "basal_energy", unit: "kcal" },
  flights_climbed: { metricKey: "flights_climbed", unit: "count" },
};

/**
 * Summary CSV column header → metric_key + unit.
 * BP columns intentionally omitted (never imported).
 */
export const SUMMARY_COLUMN_MAP: Record<
  string,
  { metricKey: string; unit: string }
> = {
  "Steps (sum)": { metricKey: "summary_steps", unit: "count" },
  "Heart Rate (average)": {
    metricKey: "summary_heart_rate_average",
    unit: "bpm",
  },
  "Sleep (sum)": { metricKey: "summary_sleep", unit: "hr" },
  "Sleep (Asleep) (sum)": { metricKey: "summary_sleep_asleep", unit: "hr" },
  "Sleep (Core) (sum)": { metricKey: "summary_sleep_core", unit: "hr" },
  "Sleep (REM) (sum)": { metricKey: "summary_sleep_rem", unit: "hr" },
  "Sleep (Deep) (sum)": { metricKey: "summary_sleep_deep", unit: "hr" },
  "Walking/Running Distance (sum)": {
    metricKey: "summary_walking_running_distance",
    unit: "mi",
  },
  "Total Energy (sum)": { metricKey: "summary_total_energy", unit: "kcal" },
  "Resting Heart Rate (average)": {
    metricKey: "summary_resting_heart_rate",
    unit: "bpm",
  },
  "Respiratory Rate (average)": {
    metricKey: "summary_respiratory_rate",
    unit: "breaths/min",
  },
  "HRV (SDNN) (average)": {
    metricKey: "summary_heart_rate_variability",
    unit: "ms",
  },
  "VO2 Max (most recent)": { metricKey: "summary_vo2_max", unit: "mL/kg·min" },
  "Walking HR Avg (average)": {
    metricKey: "summary_walking_heart_rate_average",
    unit: "bpm",
  },
  "Exercise Minutes (sum)": {
    metricKey: "summary_exercise_minutes",
    unit: "min",
  },
  "Basal Energy (sum)": { metricKey: "summary_basal_energy", unit: "kcal" },
  "Flights Climbed (sum)": {
    metricKey: "summary_flights_climbed",
    unit: "count",
  },
  "Cycling Distance (sum)": {
    metricKey: "summary_cycling_distance",
    unit: "mi",
  },
  "Swimming Distance (sum)": {
    metricKey: "summary_swimming_distance",
    unit: "mi",
  },
  "Blood Oxygen (average)": {
    metricKey: "summary_blood_oxygen",
    unit: "%",
  },
  "Blood Glucose (Average) (average)": {
    metricKey: "summary_blood_glucose",
    unit: "mg/dL",
  },
  "Body Temperature (Average) (average)": {
    metricKey: "summary_body_temperature",
    unit: "°F",
  },
};

/** Summary headers that must never be ingested (manual BP only). */
export const SUMMARY_BP_COLUMNS = new Set([
  "BP Systolic (Average) (average)",
  "BP Diastolic (Average) (average)",
]);

const DETAILED_HEADERS = [
  "Timestamp",
  "Date",
  "Time",
  "Metric",
  "Value",
  "Unit",
] as const;

export async function resetImports(): Promise<void> {
  const db = await getDb();
  await db.delete(importedSamples);
  await db.delete(importBatches);
}

export async function listImportedSamples(
  accountId: string
): Promise<ImportedSample[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(importedSamples)
    .where(eq(importedSamples.accountId, accountId));
  return rows.map((r) => ({
    id: r.id,
    accountId: r.accountId,
    importBatchId: r.importBatchId,
    metricKey: r.metricKey,
    value: r.value,
    unit: r.unit,
    recordedAt: r.recordedAt,
    createdAt: r.createdAt,
  }));
}

/** One row per file batch (Import History cards). */
export async function listImportBatches(
  accountId: string
): Promise<ImportBatch[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(importBatches)
    .where(eq(importBatches.accountId, accountId));

  return rows
    .map((row) => ({
      id: row.id,
      accountId: row.accountId,
      pairId: row.pairId,
      sourceFormat: row.sourceFormat as "detailed_csv" | "summary_csv",
      originalFilename: row.originalFilename,
      status: row.status as ImportBatchStatus,
      importedAt: row.importedAt,
      createdAt: row.createdAt,
    }))
    .sort((a, b) => {
      const byTime = b.importedAt.localeCompare(a.importedAt);
      if (byTime !== 0) return byTime;
      // detailed before summary when same pair/time
      return a.sourceFormat.localeCompare(b.sourceFormat);
    });
}

export async function countImportedRecords(accountId: string): Promise<number> {
  const samples = await listImportedSamples(accountId);
  return samples.length;
}

export async function countSamplesInBatch(batchId: string): Promise<number> {
  const db = await getDb();
  // batchId may be pair_id (FEAT-007) or a single file batch id
  const files = await db
    .select()
    .from(importBatches)
    .where(eq(importBatches.pairId, batchId));
  const ids =
    files.length > 0
      ? files.map((f) => f.id)
      : (
          await db
            .select()
            .from(importBatches)
            .where(eq(importBatches.id, batchId))
        ).map((f) => f.id);
  if (ids.length === 0) return 0;
  const samples = await db
    .select()
    .from(importedSamples)
    .where(inArray(importedSamples.importBatchId, ids));
  return samples.length;
}

/**
 * Delete one import (pair_id or file batch id) and its samples.
 * FEAT-007: UI passes pair_id → removes both files.
 */
export async function deleteImportBatch(
  accountId: string,
  batchId: string
): Promise<boolean> {
  const db = await getDb();
  let files = await db
    .select()
    .from(importBatches)
    .where(
      and(
        eq(importBatches.accountId, accountId),
        eq(importBatches.pairId, batchId)
      )
    );
  if (files.length === 0) {
    files = await db
      .select()
      .from(importBatches)
      .where(
        and(eq(importBatches.accountId, accountId), eq(importBatches.id, batchId))
      );
  }
  if (files.length === 0) return false;
  const ids = files.map((f) => f.id);
  await db
    .delete(importedSamples)
    .where(inArray(importedSamples.importBatchId, ids));
  await db.delete(importBatches).where(inArray(importBatches.id, ids));
  return true;
}

/** ISO timestamp with offset → America/New_York wall-clock `YYYY-MM-DDTHH:mm:ss`. */
export function recordedAtFromImportTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid import timestamp: ${timestamp}`);
  }
  return wallClockNowInNewYork(date);
}

function parseCsvLines(csv: string): string[][] {
  return csv
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => line.split(","));
}

type ParsedSample = Omit<ImportedSample, "id" | "importBatchId"> & {
  sourceFormat: "detailed_csv" | "summary_csv";
};

function parseDetailedSamples(
  detailedCsv: string,
  accountId: string,
  createdAt: string
): ParsedSample[] {
  const rows = parseCsvLines(detailedCsv);
  if (rows.length < 2) return [];

  const header = rows[0];
  const headerOk = DETAILED_HEADERS.every((h, i) => header[i] === h);
  if (!headerOk) return [];

  const out: ParsedSample[] = [];
  for (let i = 1; i < rows.length; i += 1) {
    const [timestamp, , , metric, valueRaw, unitRaw] = rows[i];
    const mapped = DETAILED_METRIC_MAP[metric];
    if (!mapped) continue;
    const value = Number(valueRaw);
    if (!Number.isFinite(value)) continue;
    const unit = unitRaw?.trim() ? unitRaw.trim() : mapped.unit;
    out.push({
      accountId,
      metricKey: mapped.metricKey,
      value,
      unit,
      recordedAt: recordedAtFromImportTimestamp(timestamp),
      createdAt,
      sourceFormat: "detailed_csv",
    });
  }
  return out;
}

function parseSummarySamples(
  summaryCsv: string,
  accountId: string,
  createdAt: string
): ParsedSample[] {
  const rows = parseCsvLines(summaryCsv);
  if (rows.length < 2) return [];

  const header = rows[0];
  if (header[0] !== "Date") return [];

  const out: ParsedSample[] = [];
  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    const date = row[0]?.trim();
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
    const recordedAt = `${date}T12:00:00`;

    for (let c = 1; c < header.length; c += 1) {
      const col = header[c];
      if (SUMMARY_BP_COLUMNS.has(col)) continue;
      const mapped = SUMMARY_COLUMN_MAP[col];
      if (!mapped) continue;
      const raw = row[c]?.trim();
      if (!raw) continue;
      const value = Number(raw);
      if (!Number.isFinite(value)) continue;
      out.push({
        accountId,
        metricKey: mapped.metricKey,
        value,
        unit: mapped.unit,
        recordedAt,
        createdAt,
        sourceFormat: "summary_csv",
      });
    }
  }
  return out;
}

function dedupeKey(
  accountId: string,
  metricKey: string,
  recordedAt: string,
  value: number
): string {
  return `${accountId}|${metricKey}|${recordedAt}|${value}`;
}

/**
 * Ingest summary + detailed CSV pair into two file batches sharing pair_id.
 */
export async function importHealthCsvPair(
  input: ImportPairInput
): Promise<ImportPairResult> {
  const summaryOk =
    typeof input.summaryCsv === "string" && input.summaryCsv.trim().length > 0;
  const detailedOk =
    typeof input.detailedCsv === "string" && input.detailedCsv.trim().length > 0;

  if (!summaryOk || !detailedOk) {
    return { ok: false, errorKey: "import.error_missing_pair" };
  }

  const db = await getDb();
  const now = wallClockNowInNewYork();
  const pairId = randomUUID();
  const detailedBatchId = randomUUID();
  const summaryBatchId = randomUUID();

  await db.insert(importBatches).values([
    {
      id: detailedBatchId,
      accountId: input.accountId,
      pairId,
      sourceFormat: "detailed_csv",
      originalFilename: input.detailedFilename,
      status: "completed",
      importedAt: now,
      createdAt: now,
    },
    {
      id: summaryBatchId,
      accountId: input.accountId,
      pairId,
      sourceFormat: "summary_csv",
      originalFilename: input.summaryFilename,
      status: "completed",
      importedAt: now,
      createdAt: now,
    },
  ]);

  const candidates = [
    ...parseDetailedSamples(
      input.detailedCsv as string,
      input.accountId,
      now
    ),
    ...parseSummarySamples(input.summaryCsv as string, input.accountId, now),
  ];

  const existing = await db
    .select()
    .from(importedSamples)
    .where(eq(importedSamples.accountId, input.accountId));
  const seen = new Set(
    existing.map((s) =>
      dedupeKey(s.accountId, s.metricKey, s.recordedAt, s.value)
    )
  );

  let inserted = 0;
  let skipped = 0;
  for (const sample of candidates) {
    const key = dedupeKey(
      sample.accountId,
      sample.metricKey,
      sample.recordedAt,
      sample.value
    );
    if (seen.has(key)) {
      skipped += 1;
      continue;
    }
    seen.add(key);
    const batchId =
      sample.sourceFormat === "detailed_csv" ? detailedBatchId : summaryBatchId;
    try {
      await db.insert(importedSamples).values({
        id: randomUUID(),
        accountId: sample.accountId,
        importBatchId: batchId,
        metricKey: sample.metricKey,
        value: sample.value,
        unit: sample.unit,
        recordedAt: sample.recordedAt,
        createdAt: sample.createdAt,
      });
      inserted += 1;
    } catch {
      skipped += 1;
    }
  }

  return {
    ok: true,
    batchId: pairId,
    inserted,
    skipped,
  };
}
