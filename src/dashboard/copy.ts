/** Home dashboard strings — keys from docs/40-brand/42-copy-deck.md */
export const DASHBOARD_COPY = {
  "dashboard.metric.bp_count": "BP Readings",
  "dashboard.metric.bp_count_helper": "Manual BP entries",
  "dashboard.metric.bp_latest": "Latest BP",
  "dashboard.metric.bp_latest_helper": "Most recent BP",
  "dashboard.metric.bp_latest_empty": "—",
  "dashboard.metric.meds_count": "Meds taken today",
  "dashboard.metric.meds_helper": "Logged medication",
  "dashboard.metric.water_total": "Total Water",
  "dashboard.metric.water_helper": "Amount of water drank today",
  "dashboard.metric.electrolytes_taken": "Taken",
  "dashboard.metric.symptoms_count": "Symptom logs",
  "dashboard.metric.symptoms_helper": "Manual symptom entries",
} as const;

export function formatWaterOz(oz: number): string {
  return `${oz}oz`;
}

export function formatLatestBp(
  latest: { systolic: number; diastolic: number } | null
): string {
  if (!latest) return DASHBOARD_COPY["dashboard.metric.bp_latest_empty"];
  return `${latest.systolic}/${latest.diastolic}`;
}
