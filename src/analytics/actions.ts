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
import {
  buildBpHrOverlaySeries,
  buildTachycardiaBurdenSeries,
  getChart2Card,
  getChart3Card,
  type BpHrOverlaySeries,
  type CardioRangeId,
  type TachycardiaBurdenSeries,
} from "@/analytics/cardiovascular";
import {
  buildHrvSeries,
  buildWalkingHrSeries,
  getHrvCard,
  getWalkingHrCard,
  type HrvRangeId,
  type RecoverySeries,
  type WalkingHrRangeId,
} from "@/analytics/recovery";
import {
  buildElectrolytesComparison,
  getElectrolytesSection,
  type ElectrolytesComparison,
} from "@/analytics/electrolytes";
import { getAnalyticsTabs } from "@/analytics/tabs";
import { calendarDateInNewYork } from "@/log/timezone";

export type MedicationImpactView = {
  card: ReturnType<typeof getMedicationImpactCard>;
  tabs: ReturnType<typeof getAnalyticsTabs>;
  calendarDate: string;
  dateDisplay: string;
  options: Awaited<ReturnType<typeof getMedicationImpactMedOptions>>;
  selectedMed: string | null;
  metric: MedicationImpactMetricId;
  series: MedicationImpactSeries | null;
};

export type CardiovascularView = {
  chart2: ReturnType<typeof getChart2Card>;
  chart3: ReturnType<typeof getChart3Card>;
  range: CardioRangeId;
  overlay: BpHrOverlaySeries;
  burden: TachycardiaBurdenSeries;
};

export type RecoveryView = {
  hrvCard: ReturnType<typeof getHrvCard>;
  walkingCard: ReturnType<typeof getWalkingHrCard>;
  hrvRange: HrvRangeId;
  walkingRange: WalkingHrRangeId;
  hrv: RecoverySeries;
  walking: RecoverySeries;
};

export type ElectrolytesView = {
  section: ReturnType<typeof getElectrolytesSection>;
  comparison: ElectrolytesComparison | null;
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
  const options = await getMedicationImpactMedOptions(
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
      : await buildMedicationImpactSeries({
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

export async function loadCardiovascularView(input?: {
  range?: CardioRangeId;
}): Promise<CardiovascularView> {
  const session = await requireSession();
  const today = calendarDateInNewYork();
  const range = input?.range ?? "today";
  return {
    chart2: getChart2Card(),
    chart3: getChart3Card(),
    range,
    overlay: await buildBpHrOverlaySeries({
      accountId: session.accountId,
      range,
      today,
    }),
    burden: await buildTachycardiaBurdenSeries({
      accountId: session.accountId,
      today,
    }),
  };
}

export async function loadRecoveryView(input?: {
  hrvRange?: HrvRangeId;
  walkingRange?: WalkingHrRangeId;
}): Promise<RecoveryView> {
  const session = await requireSession();
  const today = calendarDateInNewYork();
  const hrvRange = input?.hrvRange ?? "today";
  const walkingRange = input?.walkingRange ?? "last_7";
  return {
    hrvCard: getHrvCard(),
    walkingCard: getWalkingHrCard(),
    hrvRange,
    walkingRange,
    hrv: await buildHrvSeries({
      accountId: session.accountId,
      range: hrvRange,
      today,
    }),
    walking: await buildWalkingHrSeries({
      accountId: session.accountId,
      range: walkingRange,
      today,
    }),
  };
}

export async function loadElectrolytesView(): Promise<ElectrolytesView> {
  const session = await requireSession();
  return {
    section: getElectrolytesSection(),
    comparison: await buildElectrolytesComparison({
      accountId: session.accountId,
      asOf: calendarDateInNewYork(),
    }),
  };
}
