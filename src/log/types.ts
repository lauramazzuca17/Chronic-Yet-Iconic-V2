/** Manual log type keys for the single `/log` create surface (FEAT-004 AC-1). */
export type ManualLogType =
  | "symptom"
  | "blood_pressure"
  | "medication"
  | "water"
  | "electrolyte"
  | "mood"
  | "event";

const MANUAL_LOG_TYPES: readonly ManualLogType[] = [
  "symptom",
  "blood_pressure",
  "medication",
  "water",
  "electrolyte",
  "mood",
  "event",
] as const;

export function getManualLogTypes(): ManualLogType[] {
  return [...MANUAL_LOG_TYPES];
}
