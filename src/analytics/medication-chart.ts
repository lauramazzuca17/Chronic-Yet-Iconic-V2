/**
 * Client-safe Medication Impact chart helpers.
 * Keep this file free of log/import stores — those pull Node builtins into the
 * Analytics client chunk and break `next build` (Turbopack).
 */

export type MedicationImpactChartMetric = "heart_rate" | "bp";

const EMPTY_WINDOW = {
  template: "No {stat} logged during this timeframe",
  hr: "HR",
  bp: "BP",
} as const;

/** Empty chart when a med was taken but no HR/BP landed in the −2h…+2h slots. */
export function formatMedicationImpactEmptyWindow(
  metric: MedicationImpactChartMetric
): string {
  const stat = metric === "bp" ? EMPTY_WINDOW.bp : EMPTY_WINDOW.hr;
  return EMPTY_WINDOW.template.replace("{stat}", stat);
}

export function medicationImpactPlottedValues(series: {
  slots: readonly { value: number | null }[];
}): number[] {
  return series.slots
    .map((s) => s.value)
    .filter((v): v is number => v != null);
}

/** Pad the y-axis 30 below the lowest plotted point and 30 above the highest. */
export const MEDICATION_IMPACT_Y_PAD = 30;

export function medicationImpactYDomain(values: number[]): [number, number] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  return [lo - MEDICATION_IMPACT_Y_PAD, hi + MEDICATION_IMPACT_Y_PAD];
}
