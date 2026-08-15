/**
 * Cardiovascular tab — Chart 2 (BP & HR overlay) + Chart 3 (Tachycardia Burden).
 * REQ-17 / Figma 62953:4603, 62953:4604.
 */

import { listImportedSamples } from "../import/store";
import {
  calendarDateFromRecordedAt,
  listTodayEntries,
  type BloodPressureLogEntry,
  type ManualLogEntry,
} from "../log/store";
import { wallClockToUtcMs } from "./medication-series";

export const CARDIO_RANGE_IDS = ["today", "last_7", "last_30"] as const;
export type CardioRangeId = (typeof CARDIO_RANGE_IDS)[number];

/** Owner lock: tachycardia = HR ≥ 100 bpm. */
export const TACHYCARDIA_THRESHOLD_BPM = 100;

const COPY = {
  "analytics.cardio.chart2.title": "Blood Pressure and Heart Rate",
  "analytics.cardio.chart2.helper":
    "See how changes in one may relate to changes in the other.",
  "analytics.range.today": "Today",
  "analytics.range.last_7": "Last 7 Days",
  "analytics.range.last_30": "Last 30 Days",
  "analytics.cardio.chart3.title": "Tachycardia Burden",
  "analytics.cardio.chart3.helper":
    "Percent of heart rate readings ≥ 100 bpm",
  "analytics.cardio.chart3.disclaimer_title": "Data Disclaimer",
  "analytics.cardio.chart3.disclaimer_body":
    "This chart is not a complete measure of tachycardia burden. Your Apple Watch does not provide continuous heart rate monitoring, and might not be worn at all times. Because of this, total time spent in tachycardia cannot be calculated.\n\nInstead, this chart shows the percentage of heart rate readings that were at or above the 100 bpm threshold.",
} as const;

export type CardioRangeOption = {
  id: CardioRangeId;
  label: string;
};

export type Chart2Card = {
  title: string;
  helper: string;
  ranges: CardioRangeOption[];
  yMin: 50;
  yMax: 190;
  chartLibrary: "recharts";
};

export type Chart3Card = {
  title: string;
  helper: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  chartLibrary: "recharts";
};

export type OverlayPoint = {
  recordedAt: string;
  value: number;
};

export type BpHrOverlaySeries = {
  accountId: string;
  range: CardioRangeId;
  today: string;
  startDate: string;
  endDate: string;
  bp: OverlayPoint[];
  hr: OverlayPoint[];
};

export type TachycardiaDay = {
  calendarDate: string;
  /** Weekday short label (e.g. Sun). */
  weekday: string;
  /** 0–100; null when no eligible HR readings that day. */
  percent: number | null;
  numerator: number;
  denominator: number;
};

export type TachycardiaBurdenSeries = {
  accountId: string;
  today: string;
  days: TachycardiaDay[];
};

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function toCalendarDate(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, "0")}-${pad2(m)}-${pad2(d)}`;
}

export function shiftCalendarDate(
  calendarDate: string,
  deltaDays: number
): string {
  const [ys, ms, ds] = calendarDate.split("-").map(Number);
  const noon = new Date(Date.UTC(ys, ms - 1, ds, 12));
  noon.setUTCDate(noon.getUTCDate() + deltaDays);
  return toCalendarDate(
    noon.getUTCFullYear(),
    noon.getUTCMonth() + 1,
    noon.getUTCDate()
  );
}

function rangeDayCount(range: CardioRangeId): number {
  if (range === "today") return 1;
  if (range === "last_7") return 7;
  return 30;
}

/** Inclusive window ending on `today` (America/New_York calendar dates). */
export function rangeWindow(
  range: CardioRangeId,
  today: string
): { startDate: string; endDate: string } {
  const days = rangeDayCount(range);
  return {
    startDate: shiftCalendarDate(today, -(days - 1)),
    endDate: today,
  };
}

function inRange(
  calendarDate: string,
  startDate: string,
  endDate: string
): boolean {
  return calendarDate >= startDate && calendarDate <= endDate;
}

/** Entries for account across an inclusive calendar window. */
async function listEntriesInWindow(
  accountId: string,
  startDate: string,
  endDate: string
): Promise<ManualLogEntry[]> {
  const out: ManualLogEntry[] = [];
  let cursor = startDate;
  while (cursor <= endDate) {
    out.push(...(await listTodayEntries(accountId, cursor)));
    cursor = shiftCalendarDate(cursor, 1);
  }
  return out;
}

export function getChart2Card(): Chart2Card {
  return {
    title: COPY["analytics.cardio.chart2.title"],
    helper: COPY["analytics.cardio.chart2.helper"],
    ranges: CARDIO_RANGE_IDS.map((id) => ({
      id,
      label: COPY[`analytics.range.${id}`],
    })),
    yMin: 50,
    yMax: 190,
    chartLibrary: "recharts",
  };
}

export function getChart3Card(): Chart3Card {
  return {
    title: COPY["analytics.cardio.chart3.title"],
    helper: COPY["analytics.cardio.chart3.helper"],
    disclaimerTitle: COPY["analytics.cardio.chart3.disclaimer_title"],
    disclaimerBody: COPY["analytics.cardio.chart3.disclaimer_body"],
    chartLibrary: "recharts",
  };
}

function sortByTime(points: OverlayPoint[]): OverlayPoint[] {
  return [...points].sort(
    (a, b) => wallClockToUtcMs(a.recordedAt) - wallClockToUtcMs(b.recordedAt)
  );
}

export async function buildBpHrOverlaySeries(input: {
  accountId: string;
  range: CardioRangeId;
  today: string;
}): Promise<BpHrOverlaySeries> {
  const { startDate, endDate } = rangeWindow(input.range, input.today);
  const entries = await listEntriesInWindow(input.accountId, startDate, endDate);
  const bpLogs = entries.filter(
    (e): e is BloodPressureLogEntry => e.type === "blood_pressure"
  );

  const bp = sortByTime(
    bpLogs.map((e) => ({ recordedAt: e.recordedAt, value: e.systolic }))
  );

  const hrManual = bpLogs.map((e) => ({
    recordedAt: e.recordedAt,
    value: e.heartRate,
  }));
  const hrImport = (await listImportedSamples(input.accountId))
    .filter(
      (s) =>
        s.metricKey === "heart_rate" &&
        inRange(calendarDateFromRecordedAt(s.recordedAt), startDate, endDate)
    )
    .map((s) => ({ recordedAt: s.recordedAt, value: s.value }));

  const hr = sortByTime([...hrManual, ...hrImport]);

  return {
    accountId: input.accountId,
    range: input.range,
    today: input.today,
    startDate,
    endDate,
    bp,
    hr,
  };
}

function weekdayShort(calendarDate: string): string {
  const [y, m, d] = calendarDate.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d, 12)));
}

async function hrReadingsForDay(
  accountId: string,
  calendarDate: string
): Promise<number[]> {
  const manual = (await listTodayEntries(accountId, calendarDate))
    .filter((e): e is BloodPressureLogEntry => e.type === "blood_pressure")
    .map((e) => e.heartRate);
  const imported = (await listImportedSamples(accountId))
    .filter(
      (s) =>
        s.metricKey === "heart_rate" &&
        calendarDateFromRecordedAt(s.recordedAt) === calendarDate
    )
    .map((s) => s.value);
  return [...manual, ...imported];
}

/** Last 6 days + today (7 bars). Percent of HR readings ≥ 100; null if none. */
export async function buildTachycardiaBurdenSeries(input: {
  accountId: string;
  today: string;
}): Promise<TachycardiaBurdenSeries> {
  const days: TachycardiaDay[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const calendarDate = shiftCalendarDate(input.today, -i);
    const readings = await hrReadingsForDay(input.accountId, calendarDate);
    const denominator = readings.length;
    const numerator = readings.filter(
      (v) => v >= TACHYCARDIA_THRESHOLD_BPM
    ).length;
    days.push({
      calendarDate,
      weekday: weekdayShort(calendarDate),
      percent:
        denominator === 0
          ? null
          : Math.round((numerator / denominator) * 100),
      numerator,
      denominator,
    });
  }
  return {
    accountId: input.accountId,
    today: input.today,
    days,
  };
}
