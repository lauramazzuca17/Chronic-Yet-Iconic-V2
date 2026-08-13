import type { ManualLogType } from "./types";
import { LOG_COPY } from "./copy";

const CREATE_CTA: Record<ManualLogType, keyof typeof LOG_COPY> = {
  symptom: "log.action.log_symptom",
  blood_pressure: "log.action.log_blood_pressure",
  medication: "log.action.log_medication",
  water: "log.action.log_water",
  electrolyte: "log.action.log_electrolyte",
  mood: "log.action.log_mood",
  event: "log.action.log_event",
};

/** Type-specific create button label from the copy deck. */
export function getCreateActionLabel(type: ManualLogType): string {
  return LOG_COPY[CREATE_CTA[type]];
}
