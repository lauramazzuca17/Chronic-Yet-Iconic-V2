"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/auth/current-session";
import { LOG_COPY } from "@/log/copy";
import {
  createBloodPressureLog,
  createElectrolyteLog,
  createEventLog,
  createMedicationLog,
  createMoodLog,
  createSymptomLog,
  createWaterLog,
  deleteManualLog,
  type MoodValue,
  type SymptomSeverity,
} from "@/log/store";
import { recordedAtFromDatetimeLocal } from "@/log/timezone";

export type LogActionResult =
  | { ok: true }
  | { ok: false; error: string };

function requireRecordedAt(formData: FormData): string | LogActionResult {
  const rawWhen = String(formData.get("recordedAt") ?? "");
  if (!rawWhen) {
    return { ok: false, error: "Date & Time is required." };
  }
  return recordedAtFromDatetimeLocal(rawWhen);
}

async function withAccount(
  run: (accountId: string) => LogActionResult | Promise<LogActionResult>
): Promise<LogActionResult> {
  const session = await requireSession();
  const result = await run(session.accountId);
  if (result.ok) revalidatePath("/log");
  return result;
}

export async function createWaterAction(
  formData: FormData
): Promise<LogActionResult> {
  return withAccount((accountId) => {
    const amountOz = Number(formData.get("amountOz"));
    const when = requireRecordedAt(formData);
    if (typeof when !== "string") return when;
    if (!(amountOz > 0) || Number.isNaN(amountOz)) {
      return { ok: false, error: "Enter ounces greater than 0." };
    }
    createWaterLog({ accountId, amountOz, recordedAt: when });
    return { ok: true };
  });
}

export async function createSymptomAction(
  formData: FormData
): Promise<LogActionResult> {
  return withAccount((accountId) => {
    const when = requireRecordedAt(formData);
    if (typeof when !== "string") return when;
    const symptomName = String(formData.get("symptomName") ?? "");
    const severity = String(formData.get("severity") ?? "") as SymptomSeverity;
    const notesRaw = String(formData.get("notes") ?? "").trim();
    try {
      createSymptomLog({
        accountId,
        symptomName,
        severity,
        notes: notesRaw || null,
        recordedAt: when,
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
    }
  });
}

export async function createBloodPressureAction(
  formData: FormData
): Promise<LogActionResult> {
  return withAccount((accountId) => {
    const when = requireRecordedAt(formData);
    if (typeof when !== "string") return when;
    const systolic = Number(formData.get("systolic"));
    const diastolic = Number(formData.get("diastolic"));
    const heartRate = Number(formData.get("heartRate"));
    if (
      ![systolic, diastolic, heartRate].every(
        (n) => Number.isFinite(n) && n > 0
      )
    ) {
      return { ok: false, error: "Enter systolic, diastolic, and HR." };
    }
    createBloodPressureLog({
      accountId,
      systolic,
      diastolic,
      heartRate,
      recordedAt: when,
    });
    return { ok: true };
  });
}

export async function createMedicationAction(
  formData: FormData
): Promise<LogActionResult> {
  return withAccount((accountId) => {
    const when = requireRecordedAt(formData);
    if (typeof when !== "string") return when;
    const medicationName = String(formData.get("medicationName") ?? "");
    const dose = String(formData.get("dose") ?? "").trim();
    if (!dose) return { ok: false, error: "Dose is required." };
    try {
      createMedicationLog({
        accountId,
        medicationName,
        dose,
        recordedAt: when,
      });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
    }
  });
}

export async function createElectrolyteAction(
  formData: FormData
): Promise<LogActionResult> {
  return withAccount((accountId) => {
    const when = requireRecordedAt(formData);
    if (typeof when !== "string") return when;
    try {
      createElectrolyteLog({ accountId, recordedAt: when });
      return { ok: true };
    } catch (e) {
      if (e instanceof Error && e.message === "log.electrolytes.blocked") {
        return { ok: false, error: LOG_COPY["log.electrolytes.blocked"] };
      }
      return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
    }
  });
}

export async function createMoodAction(
  formData: FormData
): Promise<LogActionResult> {
  return withAccount((accountId) => {
    const when = requireRecordedAt(formData);
    if (typeof when !== "string") return when;
    const mood = String(formData.get("mood") ?? "") as MoodValue;
    try {
      createMoodLog({ accountId, mood, recordedAt: when });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
    }
  });
}

export async function createEventAction(
  formData: FormData
): Promise<LogActionResult> {
  return withAccount((accountId) => {
    const when = requireRecordedAt(formData);
    if (typeof when !== "string") return when;
    const note = String(formData.get("note") ?? "");
    try {
      createEventLog({ accountId, note, recordedAt: when });
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "Save failed." };
    }
  });
}

export async function deleteManualLogAction(
  id: string
): Promise<LogActionResult> {
  const session = await requireSession();
  const deleted = deleteManualLog(session.accountId, id);
  if (!deleted) {
    return { ok: false, error: "Could not delete that entry." };
  }
  revalidatePath("/log");
  revalidatePath("/calendar");
  return { ok: true };
}
