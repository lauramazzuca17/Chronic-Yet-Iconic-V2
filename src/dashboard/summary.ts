import {
  listTodayEntries,
  waterTotalOzForDate,
  type BloodPressureLogEntry,
} from "../log/store";

export type LatestBpSummary = {
  systolic: number;
  diastolic: number;
};

export type TodayDashboardSummary = {
  bpCount: number;
  latestBp: LatestBpSummary | null;
  medsCount: number;
  waterTotalOz: number;
  symptomsCount: number;
  electrolytesTaken: boolean;
};

/** Today’s Home metrics for an account on an America/New_York calendar date. */
export async function getTodayDashboardSummary(
  accountId: string,
  calendarDate: string
): Promise<TodayDashboardSummary> {
  const today = await listTodayEntries(accountId, calendarDate);
  const bpEntries = today.filter(
    (e): e is BloodPressureLogEntry => e.type === "blood_pressure"
  );
  const latest = [...bpEntries].sort((a, b) =>
    a.recordedAt < b.recordedAt ? 1 : a.recordedAt > b.recordedAt ? -1 : 0
  )[0];

  return {
    bpCount: bpEntries.length,
    latestBp: latest
      ? { systolic: latest.systolic, diastolic: latest.diastolic }
      : null,
    medsCount: today.filter((e) => e.type === "medication").length,
    waterTotalOz: await waterTotalOzForDate(accountId, calendarDate),
    symptomsCount: today.filter((e) => e.type === "symptom").length,
    electrolytesTaken: today.some((e) => e.type === "electrolyte"),
  };
}
