/**
 * FEAT-005 — Home dashboard
 * Skeleton: first test active (will fail until /tdd-cycle); remaining ACs todo.
 */
import { describe, it, expect } from "vitest";

describe("FEAT-005 home dashboard", () => {
  it("AC-1: today BP reading count for account calendar date", async () => {
    const { getTodayDashboardSummary } = await import(
      "../src/dashboard/summary"
    );
    const { resetManualLogs, createBloodPressureLog } = await import(
      "../src/log/store"
    );
    await resetManualLogs();
    const accountId = "acct-laura";
    const day = "2026-08-13";
    await createBloodPressureLog({
      accountId,
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
      recordedAt: `${day}T08:00:00`,
    });
    await createBloodPressureLog({
      accountId,
      systolic: 118,
      diastolic: 76,
      heartRate: 70,
      recordedAt: `${day}T12:00:00`,
    });
    const summary = await getTodayDashboardSummary(accountId, day);
    expect(summary.bpCount).toBe(2);
  });

  it("AC-2: most recent BP today as systolic/diastolic; empty when none", async () => {
    const { getTodayDashboardSummary } = await import(
      "../src/dashboard/summary"
    );
    const { resetManualLogs, createBloodPressureLog } = await import(
      "../src/log/store"
    );
    await resetManualLogs();
    const accountId = "acct-laura";
    const day = "2026-08-13";

    const empty = await getTodayDashboardSummary(accountId, day);
    expect(empty.latestBp).toBeNull();

    await createBloodPressureLog({
      accountId,
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
      recordedAt: `${day}T08:00:00`,
    });
    await createBloodPressureLog({
      accountId,
      systolic: 118,
      diastolic: 76,
      heartRate: 70,
      recordedAt: `${day}T12:00:00`,
    });

    const summary = await getTodayDashboardSummary(accountId, day);
    expect(summary.latestBp).toEqual({ systolic: 118, diastolic: 76 });
    expect(summary.latestBp).not.toHaveProperty("heartRate");
    expect(summary.latestBp).not.toHaveProperty("posture");
  });

  it("AC-3: medication count today", async () => {
    const { getTodayDashboardSummary } = await import(
      "../src/dashboard/summary"
    );
    const { resetManualLogs, createMedicationLog } = await import(
      "../src/log/store"
    );
    await resetManualLogs();
    const accountId = "acct-laura";
    const day = "2026-08-13";

    expect((await getTodayDashboardSummary(accountId, day)).medsCount).toBe(0);

    await createMedicationLog({
      accountId,
      medicationName: "Midodrine",
      dose: "10 mg",
      recordedAt: `${day}T09:00:00`,
    });
    await createMedicationLog({
      accountId,
      medicationName: "Propranolol",
      dose: "20 mg",
      recordedAt: `${day}T13:00:00`,
    });
    await createMedicationLog({
      accountId,
      medicationName: "Vitamin D",
      dose: "2000 IU",
      recordedAt: "2026-08-12T09:00:00",
    });

    expect((await getTodayDashboardSummary(accountId, day)).medsCount).toBe(2);
  });

  it("AC-4: total water oz today", async () => {
    const { getTodayDashboardSummary } = await import(
      "../src/dashboard/summary"
    );
    const { resetManualLogs, createWaterLog } = await import(
      "../src/log/store"
    );
    await resetManualLogs();
    const accountId = "acct-laura";
    const day = "2026-08-13";

    expect((await getTodayDashboardSummary(accountId, day)).waterTotalOz).toBe(0);

    await createWaterLog({
      accountId,
      amountOz: 8,
      recordedAt: `${day}T08:00:00`,
    });
    await createWaterLog({
      accountId,
      amountOz: 8,
      recordedAt: `${day}T12:00:00`,
    });
    await createWaterLog({
      accountId,
      amountOz: 16,
      recordedAt: "2026-08-12T08:00:00",
    });

    expect((await getTodayDashboardSummary(accountId, day)).waterTotalOz).toBe(16);
  });

  it("AC-5: symptom count today", async () => {
    const { getTodayDashboardSummary } = await import(
      "../src/dashboard/summary"
    );
    const { resetManualLogs, createSymptomLog } = await import(
      "../src/log/store"
    );
    await resetManualLogs();
    const accountId = "acct-laura";
    const day = "2026-08-13";

    expect((await getTodayDashboardSummary(accountId, day)).symptomsCount).toBe(0);

    await createSymptomLog({
      accountId,
      symptomName: "Fatigue",
      severity: "usual",
      recordedAt: `${day}T10:00:00`,
    });
    await createSymptomLog({
      accountId,
      symptomName: "Dizzy",
      severity: "worse_than_usual",
      recordedAt: `${day}T14:00:00`,
    });
    await createSymptomLog({
      accountId,
      symptomName: "Nauseous",
      severity: "better_than_usual",
      recordedAt: "2026-08-12T10:00:00",
    });

    expect((await getTodayDashboardSummary(accountId, day)).symptomsCount).toBe(2);
  });

  it("AC-6: electrolytes yes vs not logged", async () => {
    const { getTodayDashboardSummary } = await import(
      "../src/dashboard/summary"
    );
    const { resetManualLogs, createElectrolyteLog } = await import(
      "../src/log/store"
    );
    await resetManualLogs();
    const accountId = "acct-laura";
    const day = "2026-08-13";

    expect((await getTodayDashboardSummary(accountId, day)).electrolytesTaken).toBe(
      false
    );

    await createElectrolyteLog({
      accountId,
      recordedAt: "2026-08-12T09:00:00",
    });
    expect((await getTodayDashboardSummary(accountId, day)).electrolytesTaken).toBe(
      false
    );

    await createElectrolyteLog({
      accountId,
      recordedAt: `${day}T09:00:00`,
    });
    expect((await getTodayDashboardSummary(accountId, day)).electrolytesTaken).toBe(
      true
    );
  });

  it("AC-7: empty day shows zeros / empty / not-logged — not another day", async () => {
    const { getTodayDashboardSummary } = await import(
      "../src/dashboard/summary"
    );
    const store = await import("../src/log/store");
    const {
      resetManualLogs,
      createBloodPressureLog,
      createMedicationLog,
      createWaterLog,
      createSymptomLog,
      createElectrolyteLog,
    } = store;
    await resetManualLogs();
    const accountId = "acct-laura";
    const otherDay = "2026-08-12";
    const today = "2026-08-13";

    await createBloodPressureLog({
      accountId,
      systolic: 130,
      diastolic: 85,
      heartRate: 80,
      recordedAt: `${otherDay}T08:00:00`,
    });
    await createMedicationLog({
      accountId,
      medicationName: "Midodrine",
      dose: "10 mg",
      recordedAt: `${otherDay}T09:00:00`,
    });
    await createWaterLog({
      accountId,
      amountOz: 32,
      recordedAt: `${otherDay}T10:00:00`,
    });
    await createSymptomLog({
      accountId,
      symptomName: "Fatigue",
      severity: "usual",
      recordedAt: `${otherDay}T11:00:00`,
    });
    await createElectrolyteLog({
      accountId,
      recordedAt: `${otherDay}T12:00:00`,
    });

    expect(await getTodayDashboardSummary(accountId, today)).toEqual({
      bpCount: 0,
      latestBp: null,
      medsCount: 0,
      waterTotalOz: 0,
      symptomsCount: 0,
      electrolytesTaken: false,
    });

    expect(await getTodayDashboardSummary(accountId, otherDay)).toEqual({
      bpCount: 1,
      latestBp: { systolic: 130, diastolic: 85 },
      medsCount: 1,
      waterTotalOz: 32,
      symptomsCount: 1,
      electrolytesTaken: true,
    });
  });

  it("AC-8: Demo cannot see Laura today stats", async () => {
    const { getTodayDashboardSummary } = await import(
      "../src/dashboard/summary"
    );
    const store = await import("../src/log/store");
    const {
      resetManualLogs,
      createBloodPressureLog,
      createMedicationLog,
      createWaterLog,
      createSymptomLog,
      createElectrolyteLog,
    } = store;
    await resetManualLogs();
    const laura = "acct-laura";
    const demo = "acct-demo";
    const day = "2026-08-13";

    await createBloodPressureLog({
      accountId: laura,
      systolic: 120,
      diastolic: 80,
      heartRate: 72,
      recordedAt: `${day}T08:00:00`,
    });
    await createMedicationLog({
      accountId: laura,
      medicationName: "Midodrine",
      dose: "10 mg",
      recordedAt: `${day}T09:00:00`,
    });
    await createWaterLog({
      accountId: laura,
      amountOz: 24,
      recordedAt: `${day}T10:00:00`,
    });
    await createSymptomLog({
      accountId: laura,
      symptomName: "Fatigue",
      severity: "usual",
      recordedAt: `${day}T11:00:00`,
    });
    await createElectrolyteLog({
      accountId: laura,
      recordedAt: `${day}T12:00:00`,
    });

    expect(await getTodayDashboardSummary(laura, day)).toEqual({
      bpCount: 1,
      latestBp: { systolic: 120, diastolic: 80 },
      medsCount: 1,
      waterTotalOz: 24,
      symptomsCount: 1,
      electrolytesTaken: true,
    });

    expect(await getTodayDashboardSummary(demo, day)).toEqual({
      bpCount: 0,
      latestBp: null,
      medsCount: 0,
      waterTotalOz: 0,
      symptomsCount: 0,
      electrolytesTaken: false,
    });
  });

  // AC-9: e2e/feat-005-home-journey.spec.ts
});
