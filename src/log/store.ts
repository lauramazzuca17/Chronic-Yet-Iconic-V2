import { isMedicationCatalogName, isSymptomCatalogName } from "./catalogs";

/** Schema-shaped BP row (03-data-model BloodPressureLog). No posture field. */
export type BloodPressureLogEntry = {
  id: string;
  type: "blood_pressure";
  accountId: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  recordedAt: string;
  createdAt: string;
};

export type SymptomSeverity =
  | "usual"
  | "worse_than_usual"
  | "better_than_usual";

/** Schema-shaped symptom row (03-data-model SymptomLog). */
export type SymptomLogEntry = {
  id: string;
  type: "symptom";
  accountId: string;
  symptomName: string;
  severity: SymptomSeverity;
  notes: string | null;
  recordedAt: string;
  createdAt: string;
};

/** Schema-shaped medication row (03-data-model MedicationLog). */
export type MedicationLogEntry = {
  id: string;
  type: "medication";
  accountId: string;
  medicationName: string;
  dose: string;
  recordedAt: string;
  createdAt: string;
};

/** Schema-shaped water row (03-data-model WaterLog). */
export type WaterLogEntry = {
  id: string;
  type: "water";
  accountId: string;
  amountOz: number;
  recordedAt: string;
  createdAt: string;
};

/** Schema-shaped electrolyte row (03-data-model ElectrolyteLog). taken=yes only. */
export type ElectrolyteLogEntry = {
  id: string;
  type: "electrolyte";
  accountId: string;
  taken: true;
  calendarDate: string;
  recordedAt: string;
  createdAt: string;
};

export type MoodValue =
  | "awful"
  | "not_great"
  | "okay"
  | "good"
  | "great";

const MOOD_VALUES: readonly MoodValue[] = [
  "awful",
  "not_great",
  "okay",
  "good",
  "great",
];

/** Schema-shaped mood row (03-data-model MoodLog). */
export type MoodLogEntry = {
  id: string;
  type: "mood";
  accountId: string;
  mood: MoodValue;
  recordedAt: string;
  createdAt: string;
};

/** Schema-shaped event row (03-data-model EventLog). */
export type EventLogEntry = {
  id: string;
  type: "event";
  accountId: string;
  note: string;
  recordedAt: string;
  createdAt: string;
};

export type ManualLogEntry =
  | BloodPressureLogEntry
  | SymptomLogEntry
  | MedicationLogEntry
  | WaterLogEntry
  | ElectrolyteLogEntry
  | MoodLogEntry
  | EventLogEntry;

export type CreateBloodPressureInput = {
  accountId: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  recordedAt: string;
};

export type CreateSymptomInput = {
  accountId: string;
  symptomName: string;
  severity: SymptomSeverity;
  notes?: string | null;
  recordedAt: string;
};

export type CreateMedicationInput = {
  accountId: string;
  medicationName: string;
  dose: string;
  recordedAt: string;
};

export type CreateWaterInput = {
  accountId: string;
  amountOz: number;
  recordedAt: string;
};

export type CreateElectrolyteInput = {
  accountId: string;
  recordedAt: string;
};

export type CreateMoodInput = {
  accountId: string;
  mood: MoodValue;
  recordedAt: string;
};

export type CreateEventInput = {
  accountId: string;
  note: string;
  recordedAt: string;
};

const globalStore = globalThis as typeof globalThis & {
  __cyiManualLogs?: ManualLogEntry[];
};

function getEntries(): ManualLogEntry[] {
  if (!globalStore.__cyiManualLogs) {
    globalStore.__cyiManualLogs = [];
  }
  return globalStore.__cyiManualLogs;
}

function newId(prefix: string): string {
  const entries = getEntries();
  return `${prefix}-${entries.length + 1}-${Date.now()}`;
}

/** America/New_York calendar date from stored wall-clock `recorded_at`. */
export function calendarDateFromRecordedAt(recordedAt: string): string {
  return recordedAt.slice(0, 10);
}

export function resetManualLogs(): void {
  getEntries().length = 0;
}

export function createBloodPressureLog(
  input: CreateBloodPressureInput
): BloodPressureLogEntry {
  const now = new Date().toISOString();
  const entry: BloodPressureLogEntry = {
    id: newId("bp"),
    type: "blood_pressure",
    accountId: input.accountId,
    systolic: input.systolic,
    diastolic: input.diastolic,
    heartRate: input.heartRate,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  getEntries().push(entry);
  return { ...entry };
}

export function createSymptomLog(input: CreateSymptomInput): SymptomLogEntry {
  if (!isSymptomCatalogName(input.symptomName)) {
    throw new Error(`Unknown symptom catalog name: ${input.symptomName}`);
  }
  const now = new Date().toISOString();
  const entry: SymptomLogEntry = {
    id: newId("symptom"),
    type: "symptom",
    accountId: input.accountId,
    symptomName: input.symptomName,
    severity: input.severity,
    notes: input.notes ?? null,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  getEntries().push(entry);
  return { ...entry };
}

export function createMedicationLog(
  input: CreateMedicationInput
): MedicationLogEntry {
  if (!isMedicationCatalogName(input.medicationName)) {
    throw new Error(`Unknown medication catalog name: ${input.medicationName}`);
  }
  const now = new Date().toISOString();
  const entry: MedicationLogEntry = {
    id: newId("med"),
    type: "medication",
    accountId: input.accountId,
    medicationName: input.medicationName,
    dose: input.dose,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  getEntries().push(entry);
  return { ...entry };
}

export function createWaterLog(input: CreateWaterInput): WaterLogEntry {
  if (!(input.amountOz > 0)) {
    throw new Error("Water amount_oz must be greater than 0");
  }
  const now = new Date().toISOString();
  const entry: WaterLogEntry = {
    id: newId("water"),
    type: "water",
    accountId: input.accountId,
    amountOz: input.amountOz,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  getEntries().push(entry);
  return { ...entry };
}

export function createElectrolyteLog(
  input: CreateElectrolyteInput
): ElectrolyteLogEntry {
  const calendarDate = calendarDateFromRecordedAt(input.recordedAt);
  const existing = getEntries().find(
    (e) =>
      e.type === "electrolyte" &&
      e.accountId === input.accountId &&
      e.calendarDate === calendarDate
  );
  if (existing) {
    throw new Error("log.electrolytes.blocked");
  }
  const now = new Date().toISOString();
  const entry: ElectrolyteLogEntry = {
    id: newId("electrolyte"),
    type: "electrolyte",
    accountId: input.accountId,
    taken: true,
    calendarDate,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  getEntries().push(entry);
  return { ...entry };
}

export function createMoodLog(input: CreateMoodInput): MoodLogEntry {
  if (!(MOOD_VALUES as readonly string[]).includes(input.mood)) {
    throw new Error(`Unknown mood: ${input.mood}`);
  }
  const now = new Date().toISOString();
  const entry: MoodLogEntry = {
    id: newId("mood"),
    type: "mood",
    accountId: input.accountId,
    mood: input.mood,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  getEntries().push(entry);
  return { ...entry };
}

export function createEventLog(input: CreateEventInput): EventLogEntry {
  const note = input.note.trim();
  if (!note) {
    throw new Error("Event note is required");
  }
  const now = new Date().toISOString();
  const entry: EventLogEntry = {
    id: newId("event"),
    type: "event",
    accountId: input.accountId,
    note,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  getEntries().push(entry);
  return { ...entry };
}

/** Account-scoped delete (create+delete only in v1). */
export function deleteManualLog(accountId: string, id: string): boolean {
  const entries = getEntries();
  const index = entries.findIndex(
    (e) => e.id === id && e.accountId === accountId
  );
  if (index === -1) return false;
  entries.splice(index, 1);
  return true;
}

/** Sum of water oz for an account on an America/New_York calendar date. */
export function waterTotalOzForDate(
  accountId: string,
  calendarDate: string
): number {
  return getEntries()
    .filter(
      (e): e is WaterLogEntry =>
        e.type === "water" &&
        e.accountId === accountId &&
        calendarDateFromRecordedAt(e.recordedAt) === calendarDate
    )
    .reduce((sum, e) => sum + e.amountOz, 0);
}

/** Today's manual entries for an account on a given America/New_York calendar date. */
export function listTodayEntries(
  accountId: string,
  calendarDate: string
): ManualLogEntry[] {
  return getEntries()
    .filter(
      (e) =>
        e.accountId === accountId &&
        calendarDateFromRecordedAt(e.recordedAt) === calendarDate
    )
    .map((e) => ({ ...e }));
}
