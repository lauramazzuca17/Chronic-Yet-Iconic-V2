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
import {
  HR_BURDEN_BANDS,
  clampTachycardiaBurdenEndDate,
  defaultTachycardiaBurdenEndDate,
  formatTachycardiaBurdenWindow,
  hrBurdenBandPercents,
  shiftCalendarDate,
  tachycardiaBurdenWindow,
} from "./cardio-chart";

export { shiftCalendarDate };

export const CARDIO_RANGE_IDS = ["today", "last_7", "last_30"] as const;
export type CardioRangeId = (typeof CARDIO_RANGE_IDS)[number];

const COPY = {
  "analytics.cardio.chart2.title": "Blood Pressure and Heart Rate",
  "analytics.cardio.chart2.helper":
    "See how changes in one may relate to changes in the other.",
  "analytics.range.today": "Today",
  "analytics.range.last_7": "Last 7 Days",
  "analytics.range.last_30": "Last 30 Days",
  "analytics.cardio.chart3.title": "Tachycardia Burden",
  "analytics.cardio.chart3.helper":
    "Share of heart rate readings in each bpm range",
  "analytics.cardio.chart3.prev_week": "Previous day",
  "analytics.cardio.chart3.next_week": "Next day",
  "analytics.cardio.chart3.disclaimer_title": "Data Disclaimer",
  "analytics.cardio.chart3.disclaimer_body":
    "This chart is not a complete measure of tachycardia burden. Your Apple Watch does not provide continuous heart rate monitoring, and might not be worn at all times. Because of this, total time spent in tachycardia cannot be calculated.\n\nInstead, this chart shows the share of that day's heart rate readings in each bpm range (0–69, 70–84, 85–95, and 96+).",
  "analytics.cardio.chart3_day.title": "Tachycardia Burden",
  "analytics.cardio.chart3_day.helper":
    "Share of that day's heart rate readings in each bpm range",
  "analytics.cardio.chart3_day.empty": "No heart rate readings for this day.",
  "analytics.cardio.chart3_day.prev_day": "Previous day",
  "analytics.cardio.chart3_day.next_day": "Next day",
  "analytics.cardio.chart3_day.pick_date": "Choose date",
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
  prevWeekLabel: string;
  nextWeekLabel: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  bands: typeof HR_BURDEN_BANDS;
  chartLibrary: "recharts";
};

export type Chart3DayCard = {
  title: string;
  helper: string;
  empty: string;
  prevDayLabel: string;
  nextDayLabel: string;
  pickDateLabel: string;
  bands: typeof HR_BURDEN_BANDS;
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
  /** Percent 0–100 per band; null when no eligible HR readings that day. */
  bands: {
    low: number;
    mid: number;
    high: number;
    tachy: number;
  } | null;
  denominator: number;
};

export type TachycardiaBurdenSeries = {
  accountId: string;
  today: string;
  startDate: string;
  endDate: string;
  latestEndDate: string;
  windowDisplay: string;
  days: TachycardiaDay[];
};

export type TachycardiaDayPieSeries = {
  accountId: string;
  calendarDate: string;
  dateDisplay: string;
  bands: {
    low: number;
    mid: number;
    high: number;
    tachy: number;
  } | null;
  denominator: number;
};

function rangeDayCount(range: CardioRangeId): number {
  if (range === "today") return 1;
  if (range === "last_7") return 7;
  return 30;
}

/** Inclusive window on America/New_York calendar dates.
 *  `today` is only that day. `last_7` / `last_30` end yesterday — imports
 *  are not realtime, so the current date is usually empty. */
export function rangeWindow(
  range: CardioRangeId,
  today: string
): { startDate: string; endDate: string } {
  if (range === "today") {
    return { startDate: today, endDate: today };
  }
  const days = rangeDayCount(range);
  const endDate = shiftCalendarDate(today, -1);
  return {
    startDate: shiftCalendarDate(endDate, -(days - 1)),
    endDate,
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
    prevWeekLabel: COPY["analytics.cardio.chart3.prev_week"],
    nextWeekLabel: COPY["analytics.cardio.chart3.next_week"],
    disclaimerTitle: COPY["analytics.cardio.chart3.disclaimer_title"],
    disclaimerBody: COPY["analytics.cardio.chart3.disclaimer_body"],
    bands: HR_BURDEN_BANDS,
    chartLibrary: "recharts",
  };
}

export function getChart3DayCard(): Chart3DayCard {
  return {
    title: COPY["analytics.cardio.chart3_day.title"],
    helper: COPY["analytics.cardio.chart3_day.helper"],
    empty: COPY["analytics.cardio.chart3_day.empty"],
    prevDayLabel: COPY["analytics.cardio.chart3_day.prev_day"],
    nextDayLabel: COPY["analytics.cardio.chart3_day.next_day"],
    pickDateLabel: COPY["analytics.cardio.chart3_day.pick_date"],
    bands: HR_BURDEN_BANDS,
    chartLibrary: "recharts",
  };
}

/** Default daily-pie day is yesterday — imports are not realtime. */
export function defaultTachycardiaPieDate(today: string): string {
  return shiftCalendarDate(today, -1);
}

function formatPieDateDisplay(calendarDate: string): string {
  const [y, m, d] = calendarDate.split("-");
  return `${m}/${d}/${y}`;
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

/** Seven complete days ending `endDate` (default yesterday). 100% stacked HR-band shares. */
export async function buildTachycardiaBurdenSeries(input: {
  accountId: string;
  today: string;
  endDate?: string;
}): Promise<TachycardiaBurdenSeries> {
  const latestEndDate = defaultTachycardiaBurdenEndDate(input.today);
  const endDate = clampTachycardiaBurdenEndDate(
    input.endDate ?? latestEndDate,
    input.today
  );
  const { startDate } = tachycardiaBurdenWindow(endDate);
  const days: TachycardiaDay[] = [];
  let cursor = startDate;
  while (cursor <= endDate) {
    const readings = await hrReadingsForDay(input.accountId, cursor);
    days.push({
      calendarDate: cursor,
      weekday: weekdayShort(cursor),
      bands: hrBurdenBandPercents(readings),
      denominator: readings.length,
    });
    cursor = shiftCalendarDate(cursor, 1);
  }
  return {
    accountId: input.accountId,
    today: input.today,
    startDate,
    endDate,
    latestEndDate,
    windowDisplay: formatTachycardiaBurdenWindow(startDate, endDate),
    days,
  };
}

/** One America/New_York day's HR-band shares for the daily pie. */
export async function buildTachycardiaDayPieSeries(input: {
  accountId: string;
  calendarDate: string;
}): Promise<TachycardiaDayPieSeries> {
  const readings = await hrReadingsForDay(input.accountId, input.calendarDate);
  return {
    accountId: input.accountId,
    calendarDate: input.calendarDate,
    dateDisplay: formatPieDateDisplay(input.calendarDate),
    bands: hrBurdenBandPercents(readings),
    denominator: readings.length,
  };
}
