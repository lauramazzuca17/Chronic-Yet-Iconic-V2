/**
 * Electrolytes tab — With / Without comparison cards (REQ-20 / Figma 62967:5991).
 */

import { listImportedSamples } from "../import/store";
import {
  calendarDateFromRecordedAt,
  listManualLogsForAccount,
  type BloodPressureLogEntry,
  type ElectrolyteLogEntry,
} from "../log/store";
import { shiftCalendarDate } from "./cardiovascular";

const COPY = {
  "analytics.electrolytes.title": "Electrolytes",
  "analytics.electrolytes.helper":
    "See how days with electrolytes compare to days without.",
  "analytics.electrolytes.with_title": "With Electrolytes",
  "analytics.electrolytes.with_helper":
    "Averages based on days you logged electrolytes",
  "analytics.electrolytes.without_title": "Without Electrolytes",
  "analytics.electrolytes.without_helper":
    "Averages based on days you didn’t log electrolytes",
  "analytics.electrolytes.metric.avg_hr": "Avg HR",
  "analytics.electrolytes.metric.avg_resting": "Avg Resting",
  "analytics.electrolytes.metric.avg_walking": "Avg Walking",
  "analytics.electrolytes.metric.avg_bp": "Avg BP",
  "analytics.electrolytes.unit.bpm": "bpm",
} as const;

export type ElectrolytesSection = {
  title: string;
  helper: string;
  withTitle: string;
  withHelper: string;
  withoutTitle: string;
  withoutHelper: string;
  metricAvgHr: string;
  metricAvgResting: string;
  metricAvgWalking: string;
  metricAvgBp: string;
  unitBpm: string;
};

export type ElectrolytesCohortCard = {
  avgHr: number | null;
  avgResting: number | null;
  avgWalking: number | null;
  /** `sys/dia` from mean systolic / mean diastolic; null if no BP samples. */
  avgBp: string | null;
};

export type ElectrolytesComparison = {
  accountId: string;
  windowStart: string;
  windowEnd: string;
  withDays: string[];
  withoutDays: string[];
  withCard: ElectrolytesCohortCard;
  withoutCard: ElectrolytesCohortCard;
};

export function getElectrolytesSection(): ElectrolytesSection {
  return {
    title: COPY["analytics.electrolytes.title"],
    helper: COPY["analytics.electrolytes.helper"],
    withTitle: COPY["analytics.electrolytes.with_title"],
    withHelper: COPY["analytics.electrolytes.with_helper"],
    withoutTitle: COPY["analytics.electrolytes.without_title"],
    withoutHelper: COPY["analytics.electrolytes.without_helper"],
    metricAvgHr: COPY["analytics.electrolytes.metric.avg_hr"],
    metricAvgResting: COPY["analytics.electrolytes.metric.avg_resting"],
    metricAvgWalking: COPY["analytics.electrolytes.metric.avg_walking"],
    metricAvgBp: COPY["analytics.electrolytes.metric.avg_bp"],
    unitBpm: COPY["analytics.electrolytes.unit.bpm"],
  };
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function daysInWindow(start: string, end: string): string[] {
  const days: string[] = [];
  let cursor = start;
  while (cursor <= end) {
    days.push(cursor);
    cursor = shiftCalendarDate(cursor, 1);
  }
  return days;
}

function roundAvg(n: number): number {
  return Math.round(n);
}

function cohortCard(
  accountId: string,
  cohortDays: Set<string>
): ElectrolytesCohortCard {
  const logs = listManualLogsForAccount(accountId);
  const bpLogs = logs.filter(
    (e): e is BloodPressureLogEntry =>
      e.type === "blood_pressure" &&
      cohortDays.has(calendarDateFromRecordedAt(e.recordedAt))
  );

  const hrValues = [
    ...bpLogs.map((e) => e.heartRate),
    ...listImportedSamples(accountId)
      .filter(
        (s) =>
          s.metricKey === "heart_rate" &&
          cohortDays.has(calendarDateFromRecordedAt(s.recordedAt))
      )
      .map((s) => s.value),
  ];

  const resting = listImportedSamples(accountId)
    .filter(
      (s) =>
        s.metricKey === "resting_heart_rate" &&
        cohortDays.has(calendarDateFromRecordedAt(s.recordedAt))
    )
    .map((s) => s.value);

  const walking = listImportedSamples(accountId)
    .filter(
      (s) =>
        s.metricKey === "walking_heart_rate_average" &&
        cohortDays.has(calendarDateFromRecordedAt(s.recordedAt))
    )
    .map((s) => s.value);

  const avgSys = mean(bpLogs.map((e) => e.systolic));
  const avgDia = mean(bpLogs.map((e) => e.diastolic));
  const avgHr = mean(hrValues);
  const avgResting = mean(resting);
  const avgWalking = mean(walking);

  return {
    avgHr: avgHr === null ? null : roundAvg(avgHr),
    avgResting: avgResting === null ? null : roundAvg(avgResting),
    avgWalking: avgWalking === null ? null : roundAvg(avgWalking),
    avgBp:
      avgSys === null || avgDia === null
        ? null
        : `${roundAvg(avgSys)}/${roundAvg(avgDia)}`,
  };
}

/**
 * Comparison from first electrolytes=yes day through `asOf`.
 * Null when the account has never logged electrolytes yes.
 */
export function buildElectrolytesComparison(input: {
  accountId: string;
  asOf: string;
}): ElectrolytesComparison | null {
  const electrolytes = listManualLogsForAccount(input.accountId).filter(
    (e): e is ElectrolyteLogEntry => e.type === "electrolyte"
  );
  if (electrolytes.length === 0) return null;

  const withDaySet = new Set(electrolytes.map((e) => e.calendarDate));
  const windowStart = [...withDaySet].sort()[0];
  const windowEnd = input.asOf;
  if (windowStart > windowEnd) return null;

  const allDays = daysInWindow(windowStart, windowEnd);
  const withDays = allDays.filter((d) => withDaySet.has(d));
  const withoutDays = allDays.filter((d) => !withDaySet.has(d));

  return {
    accountId: input.accountId,
    windowStart,
    windowEnd,
    withDays,
    withoutDays,
    withCard: cohortCard(input.accountId, new Set(withDays)),
    withoutCard: cohortCard(input.accountId, new Set(withoutDays)),
  };
}
