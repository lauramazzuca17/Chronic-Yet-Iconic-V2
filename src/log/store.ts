import { and, eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDb } from "@/db/client";
import {
  bloodPressureLogs,
  electrolyteLogs,
  eventLogs,
  medicationCatalog,
  medicationLogs,
  moodLogs,
  symptomCatalog,
  symptomLogs,
  waterLogs,
} from "@/db/schema";
import { isMedicationCatalogName, isSymptomCatalogName } from "./catalogs";
import { wallClockNowInNewYork } from "./timezone";

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

/** America/New_York calendar date from stored wall-clock `recorded_at`. */
export function calendarDateFromRecordedAt(recordedAt: string): string {
  return recordedAt.slice(0, 10);
}

export async function resetManualLogs(): Promise<void> {
  const db = await getDb();
  await db.delete(bloodPressureLogs);
  await db.delete(symptomLogs);
  await db.delete(medicationLogs);
  await db.delete(waterLogs);
  await db.delete(electrolyteLogs);
  await db.delete(moodLogs);
  await db.delete(eventLogs);
}

export async function createBloodPressureLog(
  input: CreateBloodPressureInput
): Promise<BloodPressureLogEntry> {
  const db = await getDb();
  const now = wallClockNowInNewYork();
  const entry: BloodPressureLogEntry = {
    id: randomUUID(),
    type: "blood_pressure",
    accountId: input.accountId,
    systolic: input.systolic,
    diastolic: input.diastolic,
    heartRate: input.heartRate,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  await db.insert(bloodPressureLogs).values({
    id: entry.id,
    accountId: entry.accountId,
    systolic: entry.systolic,
    diastolic: entry.diastolic,
    heartRate: entry.heartRate,
    recordedAt: entry.recordedAt,
    createdAt: entry.createdAt,
  });
  return { ...entry };
}

export async function createSymptomLog(
  input: CreateSymptomInput
): Promise<SymptomLogEntry> {
  if (!isSymptomCatalogName(input.symptomName)) {
    throw new Error(`Unknown symptom catalog name: ${input.symptomName}`);
  }
  const db = await getDb();
  const [cat] = await db
    .select()
    .from(symptomCatalog)
    .where(
      and(
        eq(symptomCatalog.accountId, input.accountId),
        eq(symptomCatalog.name, input.symptomName)
      )
    )
    .limit(1);
  if (!cat) {
    throw new Error(`Unknown symptom catalog name: ${input.symptomName}`);
  }
  const now = wallClockNowInNewYork();
  const entry: SymptomLogEntry = {
    id: randomUUID(),
    type: "symptom",
    accountId: input.accountId,
    symptomName: input.symptomName,
    severity: input.severity,
    notes: input.notes ?? null,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  await db.insert(symptomLogs).values({
    id: entry.id,
    accountId: entry.accountId,
    symptomCatalogId: cat.id,
    severity: entry.severity,
    notes: entry.notes,
    recordedAt: entry.recordedAt,
    createdAt: entry.createdAt,
  });
  return { ...entry };
}

export async function createMedicationLog(
  input: CreateMedicationInput
): Promise<MedicationLogEntry> {
  if (!isMedicationCatalogName(input.medicationName)) {
    throw new Error(`Unknown medication catalog name: ${input.medicationName}`);
  }
  const db = await getDb();
  const [cat] = await db
    .select()
    .from(medicationCatalog)
    .where(
      and(
        eq(medicationCatalog.accountId, input.accountId),
        eq(medicationCatalog.name, input.medicationName)
      )
    )
    .limit(1);
  if (!cat) {
    throw new Error(`Unknown medication catalog name: ${input.medicationName}`);
  }
  const now = wallClockNowInNewYork();
  const entry: MedicationLogEntry = {
    id: randomUUID(),
    type: "medication",
    accountId: input.accountId,
    medicationName: input.medicationName,
    dose: input.dose,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  await db.insert(medicationLogs).values({
    id: entry.id,
    accountId: entry.accountId,
    medicationCatalogId: cat.id,
    dose: entry.dose,
    recordedAt: entry.recordedAt,
    createdAt: entry.createdAt,
  });
  return { ...entry };
}

export async function createWaterLog(
  input: CreateWaterInput
): Promise<WaterLogEntry> {
  if (!(input.amountOz > 0)) {
    throw new Error("Water amount_oz must be greater than 0");
  }
  const db = await getDb();
  const now = wallClockNowInNewYork();
  const entry: WaterLogEntry = {
    id: randomUUID(),
    type: "water",
    accountId: input.accountId,
    amountOz: input.amountOz,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  await db.insert(waterLogs).values({
    id: entry.id,
    accountId: entry.accountId,
    amountOz: entry.amountOz,
    recordedAt: entry.recordedAt,
    createdAt: entry.createdAt,
  });
  return { ...entry };
}

export async function createElectrolyteLog(
  input: CreateElectrolyteInput
): Promise<ElectrolyteLogEntry> {
  const calendarDate = calendarDateFromRecordedAt(input.recordedAt);
  const db = await getDb();
  const existing = await db
    .select()
    .from(electrolyteLogs)
    .where(
      and(
        eq(electrolyteLogs.accountId, input.accountId),
        eq(electrolyteLogs.calendarDate, calendarDate)
      )
    )
    .limit(1);
  if (existing.length > 0) {
    throw new Error("log.electrolytes.blocked");
  }
  const now = wallClockNowInNewYork();
  const entry: ElectrolyteLogEntry = {
    id: randomUUID(),
    type: "electrolyte",
    accountId: input.accountId,
    taken: true,
    calendarDate,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  await db.insert(electrolyteLogs).values({
    id: entry.id,
    accountId: entry.accountId,
    taken: true,
    recordedAt: entry.recordedAt,
    calendarDate: entry.calendarDate,
    createdAt: entry.createdAt,
  });
  return { ...entry };
}

export async function createMoodLog(
  input: CreateMoodInput
): Promise<MoodLogEntry> {
  if (!(MOOD_VALUES as readonly string[]).includes(input.mood)) {
    throw new Error(`Unknown mood: ${input.mood}`);
  }
  const db = await getDb();
  const now = wallClockNowInNewYork();
  const entry: MoodLogEntry = {
    id: randomUUID(),
    type: "mood",
    accountId: input.accountId,
    mood: input.mood,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  await db.insert(moodLogs).values({
    id: entry.id,
    accountId: entry.accountId,
    mood: entry.mood,
    recordedAt: entry.recordedAt,
    createdAt: entry.createdAt,
  });
  return { ...entry };
}

export async function createEventLog(
  input: CreateEventInput
): Promise<EventLogEntry> {
  const note = input.note.trim();
  if (!note) {
    throw new Error("Event note is required");
  }
  const db = await getDb();
  const now = wallClockNowInNewYork();
  const entry: EventLogEntry = {
    id: randomUUID(),
    type: "event",
    accountId: input.accountId,
    note,
    recordedAt: input.recordedAt,
    createdAt: now,
  };
  await db.insert(eventLogs).values({
    id: entry.id,
    accountId: entry.accountId,
    note: entry.note,
    recordedAt: entry.recordedAt,
    createdAt: entry.createdAt,
  });
  return { ...entry };
}

/** Account-scoped delete (create+delete only in v1). */
export async function deleteManualLog(
  accountId: string,
  id: string
): Promise<boolean> {
  const db = await getDb();
  const tables = [
    bloodPressureLogs,
    symptomLogs,
    medicationLogs,
    waterLogs,
    electrolyteLogs,
    moodLogs,
    eventLogs,
  ] as const;
  for (const table of tables) {
    const deleted = await db
      .delete(table)
      .where(and(eq(table.id, id), eq(table.accountId, accountId)))
      .returning({ id: table.id });
    if (deleted.length > 0) return true;
  }
  return false;
}

/** Sum of water oz for an account on an America/New_York calendar date. */
export async function waterTotalOzForDate(
  accountId: string,
  calendarDate: string
): Promise<number> {
  const entries = await listTodayEntries(accountId, calendarDate);
  return entries
    .filter((e): e is WaterLogEntry => e.type === "water")
    .reduce((sum, e) => sum + e.amountOz, 0);
}

async function loadAllForAccount(accountId: string): Promise<ManualLogEntry[]> {
  const db = await getDb();
  const out: ManualLogEntry[] = [];

  const bps = await db
    .select()
    .from(bloodPressureLogs)
    .where(eq(bloodPressureLogs.accountId, accountId));
  for (const r of bps) {
    out.push({
      id: r.id,
      type: "blood_pressure",
      accountId: r.accountId,
      systolic: r.systolic,
      diastolic: r.diastolic,
      heartRate: r.heartRate,
      recordedAt: r.recordedAt,
      createdAt: r.createdAt,
    });
  }

  const symptoms = await db
    .select({
      id: symptomLogs.id,
      accountId: symptomLogs.accountId,
      severity: symptomLogs.severity,
      notes: symptomLogs.notes,
      recordedAt: symptomLogs.recordedAt,
      createdAt: symptomLogs.createdAt,
      symptomName: symptomCatalog.name,
    })
    .from(symptomLogs)
    .innerJoin(
      symptomCatalog,
      eq(symptomLogs.symptomCatalogId, symptomCatalog.id)
    )
    .where(eq(symptomLogs.accountId, accountId));
  for (const r of symptoms) {
    out.push({
      id: r.id,
      type: "symptom",
      accountId: r.accountId,
      symptomName: r.symptomName,
      severity: r.severity as SymptomSeverity,
      notes: r.notes,
      recordedAt: r.recordedAt,
      createdAt: r.createdAt,
    });
  }

  const meds = await db
    .select({
      id: medicationLogs.id,
      accountId: medicationLogs.accountId,
      dose: medicationLogs.dose,
      recordedAt: medicationLogs.recordedAt,
      createdAt: medicationLogs.createdAt,
      medicationName: medicationCatalog.name,
    })
    .from(medicationLogs)
    .innerJoin(
      medicationCatalog,
      eq(medicationLogs.medicationCatalogId, medicationCatalog.id)
    )
    .where(eq(medicationLogs.accountId, accountId));
  for (const r of meds) {
    out.push({
      id: r.id,
      type: "medication",
      accountId: r.accountId,
      medicationName: r.medicationName,
      dose: r.dose,
      recordedAt: r.recordedAt,
      createdAt: r.createdAt,
    });
  }

  const waters = await db
    .select()
    .from(waterLogs)
    .where(eq(waterLogs.accountId, accountId));
  for (const r of waters) {
    out.push({
      id: r.id,
      type: "water",
      accountId: r.accountId,
      amountOz: r.amountOz,
      recordedAt: r.recordedAt,
      createdAt: r.createdAt,
    });
  }

  const electrolytes = await db
    .select()
    .from(electrolyteLogs)
    .where(eq(electrolyteLogs.accountId, accountId));
  for (const r of electrolytes) {
    out.push({
      id: r.id,
      type: "electrolyte",
      accountId: r.accountId,
      taken: true,
      calendarDate: r.calendarDate,
      recordedAt: r.recordedAt,
      createdAt: r.createdAt,
    });
  }

  const moods = await db
    .select()
    .from(moodLogs)
    .where(eq(moodLogs.accountId, accountId));
  for (const r of moods) {
    out.push({
      id: r.id,
      type: "mood",
      accountId: r.accountId,
      mood: r.mood as MoodValue,
      recordedAt: r.recordedAt,
      createdAt: r.createdAt,
    });
  }

  const events = await db
    .select()
    .from(eventLogs)
    .where(eq(eventLogs.accountId, accountId));
  for (const r of events) {
    out.push({
      id: r.id,
      type: "event",
      accountId: r.accountId,
      note: r.note,
      recordedAt: r.recordedAt,
      createdAt: r.createdAt,
    });
  }

  return out;
}

/** Today's manual entries for an account on a given America/New_York calendar date. */
export async function listTodayEntries(
  accountId: string,
  calendarDate: string
): Promise<ManualLogEntry[]> {
  const all = await loadAllForAccount(accountId);
  return all.filter(
    (e) => calendarDateFromRecordedAt(e.recordedAt) === calendarDate
  );
}

/** All manual logs for an account (account-scoped). */
export async function listManualLogsForAccount(
  accountId: string
): Promise<ManualLogEntry[]> {
  return loadAllForAccount(accountId);
}
