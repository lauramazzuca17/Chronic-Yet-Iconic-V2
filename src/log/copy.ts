/** Copy deck strings for Log UI (FEAT-004) — keys from 42-copy-deck.md. */
export const LOG_COPY = {
  "log.save_success": "Saved.",
  "log.electrolytes.blocked": "Electrolytes already logged for today.",
  "log.action.log_symptom": "Log Symptom",
  "log.action.log_blood_pressure": "Log Blood Pressure",
  "log.action.log_medication": "Log Medication",
  "log.action.log_water": "Log Water",
  "log.action.log_mood": "Log Mood",
  "log.action.log_event": "Log Event",
  "log.action.log_electrolyte": "Log Electrolytes",
  "log.entry.delete": "Delete",
  "log.entry.confirm_delete": "Confirm Delete",
  "log.today_heading": "Today",
  "log.entries_count": "{count} logged entries",
  "log.water_total_label": "Today’s Total",
  "log.water_total_value": "{oz} oz",
  "log.field.date_time": "Date & Time",
  "log.field.systolic": "Systolic",
  "log.field.diastolic": "Diastolic",
  "log.field.heart_rate": "HR (bpm)",
  "log.field.notes": "Notes (optional)",
  "log.field.notes_placeholder": "Anything else to note...",
  "log.field.dose": "Dose",
  "log.field.amount_oz": "Add Ounces",
  "log.field.amount_oz_placeholder": "e.g. 32",
  "log.field.taken": "Taken",
  "log.field.note": "Note",
  "log.field.note_placeholder": "e.g. Walked 10 miles",
  "log.field.symptom_name": "Symptom",
  "log.field.medication_name": "Medication",
  "log.field.severity": "Severity",
  "log.field.mood": "Mood",
  "log.type.symptom": "Symptom",
  "log.type.blood_pressure": "Blood Pressure",
  "log.type.medication": "Medication",
  "log.type.water": "Water",
  "log.type.electrolyte": "Electrolytes",
  "log.type.mood": "Mood",
  "log.type.event": "Event",
  "log.severity.usual": "Normal amount",
  "log.severity.worse_than_usual": "Worse than usual",
  "log.severity.better_than_usual": "Better than usual",
  "log.mood.awful": "Awful",
  "log.mood.not_great": "Not great",
  "log.mood.okay": "Okay",
  "log.mood.good": "Good",
  "log.mood.great": "Great",
} as const;

export function formatEntriesCount(count: number): string {
  return LOG_COPY["log.entries_count"].replace("{count}", String(count));
}

export function formatWaterTotal(oz: number): string {
  return LOG_COPY["log.water_total_value"].replace("{oz}", String(oz));
}
