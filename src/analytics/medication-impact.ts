/**
 * Medication Impact card chrome + date helpers (Figma 62816:27152).
 * Chart series computation lands in later ACs; this module owns controls/copy.
 */

import { MEDICATION_CATALOG_NAMES } from "../log/catalogs";
import { listTodayEntries } from "../log/store";

export type MedicationImpactMetricId = "heart_rate" | "bp";

export type MedicationImpactMetric = {
  id: MedicationImpactMetricId;
  label: string;
  labelKey: string;
};

export type MedicationImpactCard = {
  title: string;
  titleKey: "analytics.med.title";
  helper: string;
  helperKey: "analytics.med.helper";
  compareLabel: string;
  compareKey: "analytics.med.compare";
  withLabel: string;
  withKey: "analytics.med.with";
  selectEmptyLabel: string;
  selectEmptyKey: "analytics.med.select_empty";
  prevDayLabel: string;
  prevDayKey: "analytics.med.prev_day";
  nextDayLabel: string;
  nextDayKey: "analytics.med.next_day";
  pickDateLabel: string;
  pickDateKey: "analytics.med.pick_date";
  dateFormat: "MM/DD/YYYY";
  metrics: MedicationImpactMetric[];
  chartLibrary: "recharts";
  hasChartArea: true;
};

const COPY = {
  "analytics.med.title": "Medication Impact",
  "analytics.med.helper":
    "See how your vitals change before and after taking a medication.",
  "analytics.med.compare": "Compare",
  "analytics.med.with": "with",
  "analytics.med.select_empty": "Medication",
  "analytics.med.prev_day": "Previous day",
  "analytics.med.next_day": "Next day",
  "analytics.med.metric.hr": "Heart Rate",
  "analytics.med.metric.bp": "BP",
  "analytics.med.pick_date": "Choose date",
} as const;

const METRICS: readonly MedicationImpactMetric[] = [
  {
    id: "heart_rate",
    label: COPY["analytics.med.metric.hr"],
    labelKey: "analytics.med.metric.hr",
  },
  {
    id: "bp",
    label: COPY["analytics.med.metric.bp"],
    labelKey: "analytics.med.metric.bp",
  },
];

export function getMedicationImpactCard(): MedicationImpactCard {
  return {
    title: COPY["analytics.med.title"],
    titleKey: "analytics.med.title",
    helper: COPY["analytics.med.helper"],
    helperKey: "analytics.med.helper",
    compareLabel: COPY["analytics.med.compare"],
    compareKey: "analytics.med.compare",
    withLabel: COPY["analytics.med.with"],
    withKey: "analytics.med.with",
    selectEmptyLabel: COPY["analytics.med.select_empty"],
    selectEmptyKey: "analytics.med.select_empty",
    prevDayLabel: COPY["analytics.med.prev_day"],
    prevDayKey: "analytics.med.prev_day",
    nextDayLabel: COPY["analytics.med.next_day"],
    nextDayKey: "analytics.med.next_day",
    pickDateLabel: COPY["analytics.med.pick_date"],
    pickDateKey: "analytics.med.pick_date",
    dateFormat: "MM/DD/YYYY",
    metrics: [...METRICS],
    chartLibrary: "recharts",
    hasChartArea: true,
  };
}

/** Display `YYYY-MM-DD` as `MM/DD/YYYY` (Figma date field). */
export function formatMedicationImpactDate(calendarDate: string): string {
  const [y, m, d] = calendarDate.split("-");
  if (!y || !m || !d) {
    throw new Error(`Invalid calendar date: ${calendarDate}`);
  }
  return `${m}/${d}/${y}`;
}

function parseCalendarDate(calendarDate: string): {
  y: number;
  m: number;
  d: number;
} {
  const [ys, ms, ds] = calendarDate.split("-");
  const y = Number(ys);
  const m = Number(ms);
  const d = Number(ds);
  if (!y || !m || !d) {
    throw new Error(`Invalid calendar date: ${calendarDate}`);
  }
  return { y, m, d };
}

function toCalendarDate(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Shift America/New_York calendar day by ±1 (UTC noon anchor avoids DST edge). */
export function shiftMedicationImpactDay(
  calendarDate: string,
  direction: "prev" | "next"
): string {
  const { y, m, d } = parseCalendarDate(calendarDate);
  const noon = new Date(Date.UTC(y, m - 1, d, 12));
  noon.setUTCDate(noon.getUTCDate() + (direction === "next" ? 1 : -1));
  return toCalendarDate(
    noon.getUTCFullYear(),
    noon.getUTCMonth() + 1,
    noon.getUTCDate()
  );
}

/** Figma / owner lock: untaken catalog meds that day. */
export const MEDICATION_UNAVAILABLE_COLOR = "#8E8E93";

export type MedicationImpactMedOption = {
  name: string;
  selectable: boolean;
  /** `#8E8E93` when not selectable; null when available. */
  color: typeof MEDICATION_UNAVAILABLE_COLOR | null;
};

/** Catalog dropdown options for a day — logged names selectable; others gray/disabled. */
export async function getMedicationImpactMedOptions(
  accountId: string,
  calendarDate: string
): Promise<MedicationImpactMedOption[]> {
  const logged = new Set(
    (await listTodayEntries(accountId, calendarDate))
      .filter((e) => e.type === "medication")
      .map((e) => e.medicationName)
  );

  return MEDICATION_CATALOG_NAMES.map((name) => {
    const selectable = logged.has(name);
    return {
      name,
      selectable,
      color: selectable ? null : MEDICATION_UNAVAILABLE_COLOR,
    };
  });
}
