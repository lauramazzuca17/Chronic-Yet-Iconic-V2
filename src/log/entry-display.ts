import { LOG_COPY } from "@/log/copy";
import type { ManualLogEntry, MoodValue, SymptomSeverity } from "@/log/store";
import type { ManualLogType } from "@/log/types";

/** Copy-deck type labels, shared by the Log and Calendar entry lists. */
export const MANUAL_TYPE_LABEL: Record<ManualLogType, string> = {
  symptom: LOG_COPY["log.type.symptom"],
  blood_pressure: LOG_COPY["log.type.blood_pressure"],
  medication: LOG_COPY["log.type.medication"],
  water: LOG_COPY["log.type.water"],
  electrolyte: LOG_COPY["log.type.electrolyte"],
  mood: LOG_COPY["log.type.mood"],
  event: LOG_COPY["log.type.event"],
};

const SEVERITY_LABEL: Record<SymptomSeverity, string> = {
  usual: LOG_COPY["log.severity.usual"],
  worse_than_usual: LOG_COPY["log.severity.worse_than_usual"],
  better_than_usual: LOG_COPY["log.severity.better_than_usual"],
};

const MOOD_LABEL: Record<MoodValue, string> = {
  awful: LOG_COPY["log.mood.awful"],
  not_great: LOG_COPY["log.mood.not_great"],
  okay: LOG_COPY["log.mood.okay"],
  good: LOG_COPY["log.mood.good"],
  great: LOG_COPY["log.mood.great"],
};

/** Figma entry eyebrow time: `8:12 AM` (America/New_York wall clock). */
export function formatEntryTimeLabel(recordedAt: string): string {
  const timePart = recordedAt.includes("T")
    ? recordedAt.split("T")[1] ?? ""
    : recordedAt;
  const [hs, ms] = timePart.split(":");
  const h = Number(hs);
  const m = Number(ms ?? "0");
  if (!Number.isFinite(h) || !Number.isFinite(m)) return recordedAt.slice(11, 16);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

/** Figma eyebrow: `SYMPTOM  8:12 AM` (double space before time). */
export function formatEntryEyebrow(
  typeLabel: string,
  recordedAt: string
): string {
  return `${typeLabel.toUpperCase()}  ${formatEntryTimeLabel(recordedAt)}`;
}

export function formatEntrySummary(entry: ManualLogEntry): string {
  switch (entry.type) {
    case "water":
      return `${entry.amountOz} oz`;
    case "blood_pressure":
      return `${entry.systolic}/${entry.diastolic} - ${entry.heartRate} bpm`;
    case "symptom": {
      const sev =
        SEVERITY_LABEL[entry.severity] ?? entry.severity;
      return `${entry.symptomName} - ${sev}`;
    }
    case "medication":
      return `${entry.medicationName} · ${entry.dose}`;
    case "electrolyte":
      return LOG_COPY["log.field.taken"];
    case "mood":
      return MOOD_LABEL[entry.mood] ?? entry.mood;
    case "event":
      return entry.note;
  }
}
