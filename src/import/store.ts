/** In-memory import batches + samples (FEAT-007). Turso later. */

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

export type ImportBatch = {
  id: string;
  accountId: string;
  detailedFilename: string | null;
  summaryFilename: string | null;
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

type ImportGlobal = typeof globalThis & {
  __cyiImportBatches?: ImportBatch[];
  __cyiImportedSamples?: ImportedSample[];
  __cyiImportIdSeq?: number;
};

function getGlobal(): ImportGlobal {
  return globalThis as ImportGlobal;
}

function getBatches(): ImportBatch[] {
  const g = getGlobal();
  if (!g.__cyiImportBatches) g.__cyiImportBatches = [];
  return g.__cyiImportBatches;
}

function getSamples(): ImportedSample[] {
  const g = getGlobal();
  if (!g.__cyiImportedSamples) g.__cyiImportedSamples = [];
  return g.__cyiImportedSamples;
}

function nextId(prefix: string): string {
  const g = getGlobal();
  g.__cyiImportIdSeq = (g.__cyiImportIdSeq ?? 0) + 1;
  return `${prefix}-${g.__cyiImportIdSeq}`;
}

export function resetImports(): void {
  const g = getGlobal();
  g.__cyiImportBatches = [];
  g.__cyiImportedSamples = [];
  g.__cyiImportIdSeq = 0;
}

export function listImportedSamples(accountId: string): ImportedSample[] {
  return getSamples().filter((s) => s.accountId === accountId);
}

export function listImportBatches(accountId: string): ImportBatch[] {
  return getBatches().filter((b) => b.accountId === accountId);
}

export function countImportedRecords(accountId: string): number {
  return getSamples().filter((s) => s.accountId === accountId).length;
}

export function countSamplesInBatch(batchId: string): number {
  return getSamples().filter((s) => s.importBatchId === batchId).length;
}

/**
 * Delete one import batch and its samples. Returns false if missing or wrong account.
 */
export function deleteImportBatch(accountId: string, batchId: string): boolean {
  const batches = getBatches();
  const batch = batches.find((b) => b.id === batchId);
  if (!batch || batch.accountId !== accountId) return false;
  const g = getGlobal();
  g.__cyiImportBatches = batches.filter((b) => b.id !== batchId);
  g.__cyiImportedSamples = getSamples().filter(
    (s) => s.importBatchId !== batchId
  );
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

function parseDetailedSamples(
  detailedCsv: string,
  accountId: string,
  batchId: string,
  createdAt: string
): ImportedSample[] {
  const rows = parseCsvLines(detailedCsv);
  if (rows.length < 2) return [];

  const header = rows[0];
  const headerOk = DETAILED_HEADERS.every((h, i) => header[i] === h);
  if (!headerOk) return [];

  const out: ImportedSample[] = [];
  for (let i = 1; i < rows.length; i += 1) {
    const [timestamp, , , metric, valueRaw, unitRaw] = rows[i];
    const mapped = DETAILED_METRIC_MAP[metric];
    if (!mapped) continue;
    const value = Number(valueRaw);
    if (!Number.isFinite(value)) continue;
    const unit = unitRaw?.trim() ? unitRaw.trim() : mapped.unit;
    out.push({
      id: nextId("sample"),
      accountId,
      importBatchId: batchId,
      metricKey: mapped.metricKey,
      value,
      unit,
      recordedAt: recordedAtFromImportTimestamp(timestamp),
      createdAt,
    });
  }
  return out;
}

function parseSummarySamples(
  summaryCsv: string,
  accountId: string,
  batchId: string,
  createdAt: string
): ImportedSample[] {
  const rows = parseCsvLines(summaryCsv);
  if (rows.length < 2) return [];

  const header = rows[0];
  if (header[0] !== "Date") return [];

  const out: ImportedSample[] = [];
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
        id: nextId("sample"),
        accountId,
        importBatchId: batchId,
        metricKey: mapped.metricKey,
        value,
        unit: mapped.unit,
        recordedAt,
        createdAt,
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

function existingKeysForAccount(accountId: string): Set<string> {
  const keys = new Set<string>();
  for (const s of getSamples()) {
    if (s.accountId !== accountId) continue;
    keys.add(dedupeKey(s.accountId, s.metricKey, s.recordedAt, s.value));
  }
  return keys;
}

/**
 * Ingest summary + detailed CSV pair.
 * AC-1: both required. AC-2: detailed Metric → metric_key + NY recorded_at.
 * AC-3: summary day aggregates (all non-BP columns); BP never imported.
 * AC-4: skip duplicates by (account_id, metric_key, recorded_at, value).
 */
export function importHealthCsvPair(input: ImportPairInput): ImportPairResult {
  const summaryOk =
    typeof input.summaryCsv === "string" && input.summaryCsv.trim().length > 0;
  const detailedOk =
    typeof input.detailedCsv === "string" && input.detailedCsv.trim().length > 0;

  if (!summaryOk || !detailedOk) {
    return { ok: false, errorKey: "import.error_missing_pair" };
  }

  const now = wallClockNowInNewYork();
  const batchId = nextId("batch");
  const batch: ImportBatch = {
    id: batchId,
    accountId: input.accountId,
    detailedFilename: input.detailedFilename,
    summaryFilename: input.summaryFilename,
    status: "completed",
    importedAt: now,
    createdAt: now,
  };

  const candidates = [
    ...parseDetailedSamples(
      input.detailedCsv as string,
      input.accountId,
      batchId,
      now
    ),
    ...parseSummarySamples(
      input.summaryCsv as string,
      input.accountId,
      batchId,
      now
    ),
  ];

  const seen = existingKeysForAccount(input.accountId);
  const insertedSamples: ImportedSample[] = [];
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
    insertedSamples.push(sample);
  }

  getBatches().push(batch);
  getSamples().push(...insertedSamples);

  return {
    ok: true,
    batchId,
    inserted: insertedSamples.length,
    skipped,
  };
}
