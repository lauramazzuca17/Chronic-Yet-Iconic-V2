/**
 * FEAT-004 — Manual logging
 * Skeleton: first test active (will fail until /tdd-cycle); remaining ACs todo.
 */
import { describe, it, expect } from "vitest";

describe("FEAT-004 manual logging", () => {
  it("AC-1: /log is a single surface for all seven manual log types", async () => {
    const { getManualLogTypes } = await import("../src/log/types");
    expect(getManualLogTypes()).toEqual([
      "symptom",
      "blood_pressure",
      "medication",
      "water",
      "electrolyte",
      "mood",
      "event",
    ]);
  });

  it("AC-2: create BP with systolic, diastolic, HR, date/time; no posture", async () => {
    const {
      resetManualLogs,
      createBloodPressureLog,
      listTodayEntries,
    } = await import("../src/log/store");
    await resetManualLogs();

    const accountId = "acct-laura";
    const recordedAt = "2026-08-13T10:30:00";
    const entry = await createBloodPressureLog({
      accountId,
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
      recordedAt,
    });

    expect(entry).toMatchObject({
      type: "blood_pressure",
      accountId,
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
      recordedAt,
    });
    expect(entry).not.toHaveProperty("posture");
    expect(Object.keys(entry)).not.toContain("posture");

    const today = await listTodayEntries(accountId, "2026-08-13");
    expect(today).toHaveLength(1);
    expect(today[0]).toMatchObject({
      id: entry.id,
      type: "blood_pressure",
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
      recordedAt,
    });
  });

  it("AC-3: create symptom from catalog + severity + optional notes", async () => {
    const {
      resetManualLogs,
      createSymptomLog,
      listTodayEntries,
    } = await import("../src/log/store");
    const { SYMPTOM_CATALOG_NAMES } = await import("../src/log/catalogs");
    await resetManualLogs();

    expect(SYMPTOM_CATALOG_NAMES).toContain("Fatigue");

    const accountId = "acct-laura";
    const recordedAt = "2026-08-13T14:00:00";
    const withNotes = await createSymptomLog({
      accountId,
      symptomName: "Fatigue",
      severity: "usual",
      notes: "After walking",
      recordedAt,
    });

    expect(withNotes).toMatchObject({
      type: "symptom",
      accountId,
      symptomName: "Fatigue",
      severity: "usual",
      notes: "After walking",
      recordedAt,
    });

    const withoutNotes = await createSymptomLog({
      accountId,
      symptomName: "Dizzy",
      severity: "worse_than_usual",
      recordedAt: "2026-08-13T15:00:00",
    });
    expect(withoutNotes.notes).toBeNull();
    expect(withoutNotes.severity).toBe("worse_than_usual");

    const today = await listTodayEntries(accountId, "2026-08-13");
    expect(today).toHaveLength(2);
    expect(today.map((e) => e.type)).toEqual(["symptom", "symptom"]);
  });

  it("AC-4: create medication from catalog + dose + date/time", async () => {
    const {
      resetManualLogs,
      createMedicationLog,
      listTodayEntries,
    } = await import("../src/log/store");
    const { MEDICATION_CATALOG_NAMES } = await import("../src/log/catalogs");
    await resetManualLogs();

    expect(MEDICATION_CATALOG_NAMES).toContain("Midodrine");

    const accountId = "acct-laura";
    const recordedAt = "2026-08-13T09:00:00";
    const entry = await createMedicationLog({
      accountId,
      medicationName: "Midodrine",
      dose: "10 mg",
      recordedAt,
    });

    expect(entry).toMatchObject({
      type: "medication",
      accountId,
      medicationName: "Midodrine",
      dose: "10 mg",
      recordedAt,
    });

    const today = await listTodayEntries(accountId, "2026-08-13");
    expect(today).toHaveLength(1);
    expect(today[0]).toMatchObject({
      id: entry.id,
      type: "medication",
      medicationName: "Midodrine",
      dose: "10 mg",
    });
  });

  it("AC-5: water oz sums to daily total for calendar date", async () => {
    const {
      resetManualLogs,
      createWaterLog,
      listTodayEntries,
      waterTotalOzForDate,
    } = await import("../src/log/store");
    await resetManualLogs();

    const accountId = "acct-laura";
    await createWaterLog({
      accountId,
      amountOz: 8,
      recordedAt: "2026-08-13T08:00:00",
    });
    await createWaterLog({
      accountId,
      amountOz: 8,
      recordedAt: "2026-08-13T12:00:00",
    });
    // Different calendar day — must not affect today's total
    await createWaterLog({
      accountId,
      amountOz: 32,
      recordedAt: "2026-08-12T20:00:00",
    });

    expect(await waterTotalOzForDate(accountId, "2026-08-13")).toBe(16);
    expect(await waterTotalOzForDate(accountId, "2026-08-12")).toBe(32);

    const today = await listTodayEntries(accountId, "2026-08-13");
    expect(today).toHaveLength(2);
    expect(today.every((e) => e.type === "water")).toBe(true);
  });

  it("AC-6: electrolytes once per day; second create blocked until delete", async () => {
    const {
      resetManualLogs,
      createElectrolyteLog,
      deleteManualLog,
      listTodayEntries,
    } = await import("../src/log/store");
    await resetManualLogs();

    const accountId = "acct-laura";
    const first = await createElectrolyteLog({
      accountId,
      recordedAt: "2026-08-13T07:00:00",
    });
    expect(first).toMatchObject({
      type: "electrolyte",
      accountId,
      taken: true,
      calendarDate: "2026-08-13",
      recordedAt: "2026-08-13T07:00:00",
    });

    await expect(
      (async () =>
        await createElectrolyteLog({
          accountId,
          recordedAt: "2026-08-13T18:00:00",
        }))()
    ).rejects.toThrowError(/log\.electrolytes\.blocked/);

    // Different day still allowed
    const otherDay = await createElectrolyteLog({
      accountId,
      recordedAt: "2026-08-12T07:00:00",
    });
    expect(otherDay.calendarDate).toBe("2026-08-12");

    await deleteManualLog(accountId, first.id);
    expect(await listTodayEntries(accountId, "2026-08-13")).toHaveLength(0);

    const again = await createElectrolyteLog({
      accountId,
      recordedAt: "2026-08-13T19:00:00",
    });
    expect(again.calendarDate).toBe("2026-08-13");
  });

  it("AC-7: create mood from fixed enum + date/time", async () => {
    const {
      resetManualLogs,
      createMoodLog,
      listTodayEntries,
    } = await import("../src/log/store");
    await resetManualLogs();

    const accountId = "acct-laura";
    const recordedAt = "2026-08-13T16:30:00";
    const entry = await createMoodLog({
      accountId,
      mood: "okay",
      recordedAt,
    });

    expect(entry).toMatchObject({
      type: "mood",
      accountId,
      mood: "okay",
      recordedAt,
    });

    for (const mood of [
      "awful",
      "not_great",
      "okay",
      "good",
      "great",
    ] as const) {
      await resetManualLogs();
      const row = await createMoodLog({
        accountId,
        mood,
        recordedAt: "2026-08-13T10:00:00",
      });
      expect(row.mood).toBe(mood);
    }

    await expect(
      (async () =>
        await createMoodLog({
          accountId,
          mood: "meh" as "okay",
          recordedAt: "2026-08-13T11:00:00",
        }))()
    ).rejects.toThrow(/unknown mood/i);

    await resetManualLogs();
    await createMoodLog({ accountId, mood: "good", recordedAt });
    const today = await listTodayEntries(accountId, "2026-08-13");
    expect(today).toHaveLength(1);
    expect(today[0]).toMatchObject({ type: "mood", mood: "good" });
  });

  it("AC-8: create event note + date/time", async () => {
    const {
      resetManualLogs,
      createEventLog,
      listTodayEntries,
    } = await import("../src/log/store");
    await resetManualLogs();

    const accountId = "acct-laura";
    const recordedAt = "2026-08-13T17:00:00";
    const entry = await createEventLog({
      accountId,
      note: "Walked 10 miles",
      recordedAt,
    });

    expect(entry).toMatchObject({
      type: "event",
      accountId,
      note: "Walked 10 miles",
      recordedAt,
    });

    const today = await listTodayEntries(accountId, "2026-08-13");
    expect(today).toHaveLength(1);
    expect(today[0]).toMatchObject({
      id: entry.id,
      type: "event",
      note: "Walked 10 miles",
    });
  });

  it("AC-9: delete any manual log type; no edit UI", async () => {
    const store = await import("../src/log/store");
    const {
      resetManualLogs,
      createBloodPressureLog,
      createSymptomLog,
      createMedicationLog,
      createWaterLog,
      createElectrolyteLog,
      createMoodLog,
      createEventLog,
      deleteManualLog,
      listTodayEntries,
    } = store;
    await resetManualLogs();

    // No edit/update API in v1
    expect(store).not.toHaveProperty("updateManualLog");
    expect(store).not.toHaveProperty("editManualLog");

    const accountId = "acct-laura";
    const day = "2026-08-13";
    const ids = [
      (await createBloodPressureLog({
        accountId,
        systolic: 118,
        diastolic: 76,
        heartRate: 70,
        recordedAt: `${day}T08:00:00`,
      })).id,
      (await createSymptomLog({
        accountId,
        symptomName: "Fatigue",
        severity: "usual",
        recordedAt: `${day}T09:00:00`,
      })).id,
      (await createMedicationLog({
        accountId,
        medicationName: "Midodrine",
        dose: "5 mg",
        recordedAt: `${day}T10:00:00`,
      })).id,
      (await createWaterLog({
        accountId,
        amountOz: 8,
        recordedAt: `${day}T11:00:00`,
      })).id,
      (await createElectrolyteLog({
        accountId,
        recordedAt: `${day}T12:00:00`,
      })).id,
      (await createMoodLog({
        accountId,
        mood: "good",
        recordedAt: `${day}T13:00:00`,
      })).id,
      (await createEventLog({
        accountId,
        note: "Appointment",
        recordedAt: `${day}T14:00:00`,
      })).id,
    ];

    expect(await listTodayEntries(accountId, day)).toHaveLength(7);

    for (const id of ids) {
      expect(await deleteManualLog(accountId, id)).toBe(true);
    }
    expect(await listTodayEntries(accountId, day)).toHaveLength(0);

    // Wrong account cannot delete (preview of isolation; AC-10 owns full case)
    const orphan = await createEventLog({
      accountId,
      note: "Still here",
      recordedAt: `${day}T15:00:00`,
    });
    expect(await deleteManualLog("acct-demo", orphan.id)).toBe(false);
    expect(await listTodayEntries(accountId, day)).toHaveLength(1);
  });

  it("AC-10: Demo cannot read or delete Laura logs", async () => {
    const {
      resetManualLogs,
      createBloodPressureLog,
      createWaterLog,
      createEventLog,
      listTodayEntries,
      waterTotalOzForDate,
      deleteManualLog,
    } = await import("../src/log/store");
    await resetManualLogs();

    const laura = "acct-laura";
    const demo = "acct-demo";
    const day = "2026-08-13";

    const lauraBp = await createBloodPressureLog({
      accountId: laura,
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
      recordedAt: `${day}T08:00:00`,
    });
    await createWaterLog({
      accountId: laura,
      amountOz: 16,
      recordedAt: `${day}T09:00:00`,
    });
    await createEventLog({
      accountId: laura,
      note: "Laura only",
      recordedAt: `${day}T10:00:00`,
    });

    expect(await listTodayEntries(laura, day)).toHaveLength(3);
    expect(await listTodayEntries(demo, day)).toHaveLength(0);
    expect(await waterTotalOzForDate(laura, day)).toBe(16);
    expect(await waterTotalOzForDate(demo, day)).toBe(0);

    expect(await deleteManualLog(demo, lauraBp.id)).toBe(false);
    expect(await listTodayEntries(laura, day)).toHaveLength(3);

    // Demo can own their own rows without seeing Laura's
    await createWaterLog({
      accountId: demo,
      amountOz: 8,
      recordedAt: `${day}T11:00:00`,
    });
    expect(await listTodayEntries(demo, day)).toHaveLength(1);
    expect(await waterTotalOzForDate(demo, day)).toBe(8);
    expect(await listTodayEntries(laura, day)).toHaveLength(3);
    expect(await waterTotalOzForDate(laura, day)).toBe(16);
  });

  it("AC-11: catalogs match seeded lists; unknown names rejected", async () => {
    const {
      SYMPTOM_CATALOG_NAMES,
      MEDICATION_CATALOG_NAMES,
    } = await import("../src/log/catalogs");
    const {
      resetManualLogs,
      createSymptomLog,
      createMedicationLog,
    } = await import("../src/log/store");
    await resetManualLogs();

    expect([...SYMPTOM_CATALOG_NAMES]).toEqual([
      "Fatigue",
      "Dizzy",
      "Lightheaded",
      "Nauseous",
      "Syncope",
      "Joint Pain",
      "Joint Stiffness",
    ]);
    expect([...MEDICATION_CATALOG_NAMES]).toEqual([
      "Midodrine",
      "Propranolol",
      "Claritin",
      "Adderall XR",
      "Magnesium Glycinate",
      "Gabapentin",
      "Celecoxib",
      "Metoclopramide",
      "Tirzepatide",
      "Vitamin D",
    ]);

    const accountId = "acct-laura";
    const recordedAt = "2026-08-13T12:00:00";

    await expect(
      (async () =>
        await createSymptomLog({
          accountId,
          symptomName: "Headache",
          severity: "usual",
          recordedAt,
        }))()
    ).rejects.toThrow(/unknown symptom/i);

    await expect(
      (async () =>
        await createMedicationLog({
          accountId,
          medicationName: "Ibuprofen",
          dose: "200 mg",
          recordedAt,
        }))()
    ).rejects.toThrow(/unknown medication/i);

    // Valid catalog names still succeed
    await createSymptomLog({
      accountId,
      symptomName: "Syncope",
      severity: "better_than_usual",
      recordedAt,
    });
    await createMedicationLog({
      accountId,
      medicationName: "Vitamin D",
      dose: "2000 IU",
      recordedAt,
    });
  });

  it("UI: Log datetime default is server-provided (avoids nav hydration toast)", async () => {
    // Regression: client `useState(datetimeLocalNowInNewYork)` mismatched SSR
    // and raised Next.js “1 Issue”, which covered the Log footer link.
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(
        new URL("../src/log/LogScreen.tsx", import.meta.url),
        "utf8"
      )
    );
    expect(source).toMatch(/initialRecordedAt/);
    expect(source).not.toMatch(
      /useState\(\s*datetimeLocalNowInNewYork\s*\)/
    );
    const pageSource = await import("node:fs/promises").then((fs) =>
      fs.readFile(
        new URL("../src/app/(shell)/log/page.tsx", import.meta.url),
        "utf8"
      )
    );
    expect(pageSource).toMatch(/initialRecordedAt=\{datetimeLocalNowInNewYork/);
  });

  it("UI: each log type has a create CTA from the copy deck", async () => {
    const { getCreateActionLabel } = await import("../src/log/form-meta");
    const { getManualLogTypes } = await import("../src/log/types");
    expect(
      getManualLogTypes().map((t) => [t, getCreateActionLabel(t)])
    ).toEqual([
      ["symptom", "Log Symptom"],
      ["blood_pressure", "Log Blood Pressure"],
      ["medication", "Log Medication"],
      ["water", "Log Water"],
      ["electrolyte", "Log Electrolytes"],
      ["mood", "Log Mood"],
      ["event", "Log Event"],
    ]);
  });
});
