/**
 * Recovery tab — Chart 4 (HRV) + Chart 5 (Average Walking Heart Rate).
 * REQ-17 / Figma 62957:4735, 62959:4803.
 */

import { listImportedSamples } from "../import/store";
import { calendarDateFromRecordedAt } from "../log/store";
import {
  rangeWindow,
  type CardioRangeId,
  type CardioRangeOption,
} from "./cardiovascular";
import { wallClockToUtcMs } from "./medication-series";

export const HRV_RANGE_IDS = ["today", "last_7", "last_30"] as const;
export type HrvRangeId = (typeof HRV_RANGE_IDS)[number];

/** Chart 5: no Today (Figma 62959:4803). */
export const WALKING_HR_RANGE_IDS = ["last_7", "last_30"] as const;
export type WalkingHrRangeId = (typeof WALKING_HR_RANGE_IDS)[number];

const COPY = {
  "analytics.recovery.hrv.title": "Heart Rate Variability",
  "analytics.recovery.hrv.helper":
    "HRV measures the changes in time between your heartbeats.",
  "analytics.recovery.hrv.info_title": "What your HRV shows",
  "analytics.recovery.hrv.info_intro":
    "Your autonomic nervous system controls HRV through two competing parts:",
  "analytics.recovery.hrv.info_sympathetic":
    'Sympathetic system: The "fight-or-flight" response that speeds up your heart during stress or action.',
  "analytics.recovery.hrv.info_parasympathetic":
    'Parasympathetic system: The "rest-and-digest" response that slows down your heart and creates variation between beats.',
  "analytics.recovery.hrv.info_footer":
    "What does this mean for someone with POTs? No clue. But when I figure it out I’ll have this chart to reference.",
  "analytics.recovery.walking.title": "Average Walking Heart Rate",
  "analytics.recovery.walking.helper":
    "Walks outside can be very challenging. This chart will show what your average heart rate is during these walks.",
  "analytics.range.today": "Today",
  "analytics.range.last_7": "Last 7 Days",
  "analytics.range.last_30": "Last 30 Days",
} as const;

export type HrvCard = {
  title: string;
  helper: string;
  ranges: CardioRangeOption[];
  infoTitle: string;
  infoIntro: string;
  infoSympathetic: string;
  infoParasympathetic: string;
  infoFooter: string;
  chartLibrary: "recharts";
};

export type WalkingHrCard = {
  title: string;
  helper: string;
  ranges: CardioRangeOption[];
  chartLibrary: "recharts";
};

export type RecoveryPoint = {
  recordedAt: string;
  value: number;
};

export type RecoverySeries = {
  accountId: string;
  range: string;
  today: string;
  startDate: string;
  endDate: string;
  points: RecoveryPoint[];
};

function rangeLabel(id: CardioRangeId): string {
  return COPY[`analytics.range.${id}`];
}

export function getHrvCard(): HrvCard {
  return {
    title: COPY["analytics.recovery.hrv.title"],
    helper: COPY["analytics.recovery.hrv.helper"],
    ranges: HRV_RANGE_IDS.map((id) => ({ id, label: rangeLabel(id) })),
    infoTitle: COPY["analytics.recovery.hrv.info_title"],
    infoIntro: COPY["analytics.recovery.hrv.info_intro"],
    infoSympathetic: COPY["analytics.recovery.hrv.info_sympathetic"],
    infoParasympathetic: COPY["analytics.recovery.hrv.info_parasympathetic"],
    infoFooter: COPY["analytics.recovery.hrv.info_footer"],
    chartLibrary: "recharts",
  };
}

export function getWalkingHrCard(): WalkingHrCard {
  return {
    title: COPY["analytics.recovery.walking.title"],
    helper: COPY["analytics.recovery.walking.helper"],
    ranges: WALKING_HR_RANGE_IDS.map((id) => ({
      id,
      label: rangeLabel(id),
    })),
    chartLibrary: "recharts",
  };
}

function sortPoints(points: RecoveryPoint[]): RecoveryPoint[] {
  return [...points].sort(
    (a, b) => wallClockToUtcMs(a.recordedAt) - wallClockToUtcMs(b.recordedAt)
  );
}

function importPointsInRange(
  accountId: string,
  metricKey: string,
  startDate: string,
  endDate: string
): RecoveryPoint[] {
  return sortPoints(
    listImportedSamples(accountId)
      .filter(
        (s) =>
          s.metricKey === metricKey &&
          calendarDateFromRecordedAt(s.recordedAt) >= startDate &&
          calendarDateFromRecordedAt(s.recordedAt) <= endDate
      )
      .map((s) => ({ recordedAt: s.recordedAt, value: s.value }))
  );
}

/** Chart 4 — imported `heart_rate_variability` only. */
export function buildHrvSeries(input: {
  accountId: string;
  range: HrvRangeId;
  today: string;
}): RecoverySeries {
  const { startDate, endDate } = rangeWindow(input.range, input.today);
  return {
    accountId: input.accountId,
    range: input.range,
    today: input.today,
    startDate,
    endDate,
    points: importPointsInRange(
      input.accountId,
      "heart_rate_variability",
      startDate,
      endDate
    ),
  };
}

/** Chart 5 — imported `walking_heart_rate_average` only. */
export function buildWalkingHrSeries(input: {
  accountId: string;
  range: WalkingHrRangeId;
  today: string;
}): RecoverySeries {
  const { startDate, endDate } = rangeWindow(input.range, input.today);
  return {
    accountId: input.accountId,
    range: input.range,
    today: input.today,
    startDate,
    endDate,
    points: importPointsInRange(
      input.accountId,
      "walking_heart_rate_average",
      startDate,
      endDate
    ),
  };
}
