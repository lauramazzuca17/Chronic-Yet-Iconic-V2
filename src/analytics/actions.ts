"use server";

import { requireSession } from "@/auth/current-session";
import {
  formatMedicationImpactDate,
  getMedicationImpactCard,
  getMedicationImpactMedOptions,
  shiftMedicationImpactDay,
  type MedicationImpactMetricId,
} from "@/analytics/medication-impact";
import {
  buildMedicationImpactSeries,
  type MedicationImpactSeries,
} from "@/analytics/medication-series";
import { getAnalyticsTabs, type AnalyticsTabId } from "@/analytics/tabs";
import { calendarDateInNewYork } from "@/log/timezone";

export type MedicationImpactView = {
  card: ReturnType<typeof getMedicationImpactCard>;
  tabs: ReturnType<typeof getAnalyticsTabs>;
  calendarDate: string;
  dateDisplay: string;
  options: ReturnType<typeof getMedicationImpactMedOptions>;
  selectedMed: string | null;
  metric: MedicationImpactMetricId;
  series: MedicationImpactSeries | null;
};

export async function loadMedicationImpactView(input?: {
  calendarDate?: string;
  medicationName?: string | null;
  metric?: MedicationImpactMetricId;
}): Promise<MedicationImpactView> {
  const session = await requireSession();
  const card = getMedicationImpactCard();
  const calendarDate =
    input?.calendarDate ?? calendarDateInNewYork();
  const options = getMedicationImpactMedOptions(
    session.accountId,
    calendarDate
  );
  const selectable = options.filter((o) => o.selectable);
  const selectedMed =
    input?.medicationName &&
    selectable.some((o) => o.name === input.medicationName)
      ? input.medicationName
      : (selectable[0]?.name ?? null);
  const metric = input?.metric ?? "heart_rate";
  const series =
    selectedMed == null
      ? null
      : buildMedicationImpactSeries({
          accountId: session.accountId,
          calendarDate,
          medicationName: selectedMed,
          metric,
        });

  return {
    card,
    tabs: getAnalyticsTabs(),
    calendarDate,
    dateDisplay: formatMedicationImpactDate(calendarDate),
    options,
    selectedMed,
    metric,
    series,
  };
}

export async function shiftMedicationImpactDateAction(
  calendarDate: string,
  direction: "prev" | "next",
  medicationName: string | null,
  metric: MedicationImpactMetricId
): Promise<MedicationImpactView> {
  const next = shiftMedicationImpactDay(calendarDate, direction);
  return loadMedicationImpactView({
    calendarDate: next,
    medicationName,
    metric,
  });
}
