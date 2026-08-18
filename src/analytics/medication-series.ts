/**
 * Medication Impact chart series: X slots relative to take-time (REQ-16).
 * Slot values: closest candidate within ±15 minutes; else blank (AC-4).
 * Tooltips: BP sys/dia + time; HR `{n} bpm` + time (AC-7).
 */

import { listImportedSamples } from "../import/store";
import {
  calendarDateFromRecordedAt,
  listTodayEntries,
  type BloodPressureLogEntry,
  type MedicationLogEntry,
} from "../log/store";
import type { MedicationImpactMetricId } from "./medication-impact";

export const MEDICATION_IMPACT_SLOT_KEYS = [
  "-2h",
  "-1h",
  "Dose",
  "+1h",
  "+2h",
] as const;

export type MedicationImpactSlotKey =
  (typeof MEDICATION_IMPACT_SLOT_KEYS)[number];

const SLOT_HOUR_OFFSETS: Record<MedicationImpactSlotKey, number> = {
  "-2h": -2,
  "-1h": -1,
  Dose: 0,
  "+1h": 1,
  "+2h": 2,
};

/** Binding: ±15 minutes window around each slot target. */
export const MEDICATION_IMPACT_SLOT_WINDOW_MS = 15 * 60 * 1000;

export type MedicationImpactSlot = {
  key: MedicationImpactSlotKey;
  /** Absolute America/New_York wall-clock target for this slot. */
  targetAt: string;
  /** Closest in-window candidate value; null if none (no interpolation). */
  value: number | null;
  /** Tooltip for filled slots; null when blank. */
  tooltip: string | null;
};

export type MedicationImpactSeries = {
  accountId: string;
  calendarDate: string;
  medicationName: string;
  metric: MedicationImpactMetricId;
  takeTime: string;
  slots: MedicationImpactSlot[];
};

export type BuildMedicationImpactSeriesInput = {
  accountId: string;
  calendarDate: string;
  medicationName: string;
  metric: MedicationImpactMetricId;
};

type SlotCandidate = {
  recordedAt: string;
  value: number;
  metric: MedicationImpactMetricId;
  systolic?: number;
  diastolic?: number;
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Parse wall-clock `YYYY-MM-DDTHH:mm:ss` as UTC components (NY wall). */
export function wallClockToUtcMs(recordedAt: string): number {
  const [datePart, timePart = "00:00:00"] = recordedAt.split("T");
  const [ys, ms, ds] = datePart.split("-");
  const [hs, mins, secs] = timePart.split(":");
  return Date.UTC(
    Number(ys),
    Number(ms) - 1,
    Number(ds),
    Number(hs),
    Number(mins ?? 0),
    Number(secs ?? 0)
  );
}

/** Add whole hours to a wall-clock `YYYY-MM-DDTHH:mm:ss` (UTC components as NY wall). */
export function addHoursToWallClock(recordedAt: string, hours: number): string {
  const dt = new Date(wallClockToUtcMs(recordedAt));
  dt.setUTCHours(dt.getUTCHours() + hours);
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}T${pad2(dt.getUTCHours())}:${pad2(dt.getUTCMinutes())}:${pad2(dt.getUTCSeconds())}`;
}

/** Wall-clock time for tooltips, e.g. `8:07 AM`. */
export function formatMedicationImpactClock(recordedAt: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(new Date(wallClockToUtcMs(recordedAt)));
}

export type MedicationImpactTooltipInput =
  | {
      metric: "bp";
      systolic: number;
      diastolic: number;
      recordedAt: string;
    }
  | {
      metric: "heart_rate";
      value: number;
      recordedAt: string;
    };

/** Binding tooltip: BP `sys/dia` + time; HR `{n} bpm` + time. */
export function formatMedicationImpactTooltip(
  input: MedicationImpactTooltipInput
): string {
  const time = formatMedicationImpactClock(input.recordedAt);
  if (input.metric === "bp") {
    return `${input.systolic}/${input.diastolic} · ${time}`;
  }
  return `${input.value} bpm · ${time}`;
}

async function mostRecentTake(
  accountId: string,
  calendarDate: string,
  medicationName: string
): Promise<MedicationLogEntry | null> {
  const takes = (await listTodayEntries(accountId, calendarDate)).filter(
    (e): e is MedicationLogEntry =>
      e.type === "medication" &&
      e.medicationName === medicationName &&
      calendarDateFromRecordedAt(e.recordedAt) === calendarDate
  );
  if (takes.length === 0) return null;
  return takes.reduce((latest, entry) =>
    entry.recordedAt > latest.recordedAt ? entry : latest
  );
}

async function bpCandidates(
  accountId: string,
  calendarDate: string
): Promise<SlotCandidate[]> {
  return (await listTodayEntries(accountId, calendarDate))
    .filter(
      (e): e is BloodPressureLogEntry =>
        e.type === "blood_pressure" && e.accountId === accountId
    )
    .map((e) => ({
      recordedAt: e.recordedAt,
      value: e.systolic,
      metric: "bp" as const,
      systolic: e.systolic,
      diastolic: e.diastolic,
    }));
}

/** Manual BP-log HR + detailed import `heart_rate` only (never resting / summary). */
async function hrCandidates(
  accountId: string,
  calendarDate: string
): Promise<SlotCandidate[]> {
  const fromManual = (await listTodayEntries(accountId, calendarDate))
    .filter(
      (e): e is BloodPressureLogEntry =>
        e.type === "blood_pressure" && e.accountId === accountId
    )
    .map((e) => ({
      recordedAt: e.recordedAt,
      value: e.heartRate,
      metric: "heart_rate" as const,
    }));

  const fromImport = (await listImportedSamples(accountId))
    .filter(
      (s) =>
        s.metricKey === "heart_rate" &&
        calendarDateFromRecordedAt(s.recordedAt) === calendarDate
    )
    .map((s) => ({
      recordedAt: s.recordedAt,
      value: s.value,
      metric: "heart_rate" as const,
    }));

  return [...fromManual, ...fromImport];
}

/** Closest candidate within ±15 min of target; else null. No interpolation. */
export function pickClosestInWindow(
  targetAt: string,
  candidates: SlotCandidate[],
  windowMs: number = MEDICATION_IMPACT_SLOT_WINDOW_MS
): SlotCandidate | null {
  const targetMs = wallClockToUtcMs(targetAt);
  let best: { candidate: SlotCandidate; distance: number } | null = null;
  for (const c of candidates) {
    const distance = Math.abs(wallClockToUtcMs(c.recordedAt) - targetMs);
    if (distance > windowMs) continue;
    if (!best || distance < best.distance) {
      best = { candidate: c, distance };
    }
  }
  return best?.candidate ?? null;
}

function tooltipForCandidate(candidate: SlotCandidate): string {
  if (candidate.metric === "bp") {
    return formatMedicationImpactTooltip({
      metric: "bp",
      systolic: candidate.systolic ?? candidate.value,
      diastolic: candidate.diastolic ?? 0,
      recordedAt: candidate.recordedAt,
    });
  }
  return formatMedicationImpactTooltip({
    metric: "heart_rate",
    value: candidate.value,
    recordedAt: candidate.recordedAt,
  });
}

async function candidatesForMetric(
  accountId: string,
  calendarDate: string,
  metric: MedicationImpactMetricId
): Promise<SlotCandidate[]> {
  if (metric === "bp") {
    return bpCandidates(accountId, calendarDate);
  }
  return hrCandidates(accountId, calendarDate);
}

/** Build five relative slots around Dose (take-time). Null if no take that day. */
export async function buildMedicationImpactSeries(
  input: BuildMedicationImpactSeriesInput
): Promise<MedicationImpactSeries | null> {
  const take = await mostRecentTake(
    input.accountId,
    input.calendarDate,
    input.medicationName
  );
  if (!take) return null;

  const candidates = await candidatesForMetric(
    input.accountId,
    input.calendarDate,
    input.metric
  );

  const slots: MedicationImpactSlot[] = MEDICATION_IMPACT_SLOT_KEYS.map(
    (key) => {
      const targetAt = addHoursToWallClock(
        take.recordedAt,
        SLOT_HOUR_OFFSETS[key]
      );
      const picked = pickClosestInWindow(targetAt, candidates);
      return {
        key,
        targetAt,
        value: picked?.value ?? null,
        tooltip: picked ? tooltipForCandidate(picked) : null,
      };
    }
  );

  return {
    accountId: input.accountId,
    calendarDate: input.calendarDate,
    medicationName: input.medicationName,
    metric: input.metric,
    takeTime: take.recordedAt,
    slots,
  };
}
