/**
 * FEAT-006 — Calendar (manual day detail)
 * Skeleton: first test active (will fail until /tdd-cycle); remaining ACs todo.
 */
import { describe, it, expect } from "vitest";

describe("FEAT-006 calendar", () => {
  it("AC-1: calendar lists manual entries for a selected America/New_York date", async () => {
    const { listManualLogsForDate } = await import("../src/calendar/day-entries");
    const { resetManualLogs, createWaterLog, createBloodPressureLog } =
      await import("../src/log/store");
    await resetManualLogs();
    const accountId = "acct-laura";
    const day = "2026-08-06";
    await createWaterLog({
      accountId,
      amountOz: 8,
      recordedAt: `${day}T09:00:00`,
    });
    await createBloodPressureLog({
      accountId,
      systolic: 118,
      diastolic: 76,
      heartRate: 70,
      recordedAt: `${day}T10:00:00`,
    });
    await createWaterLog({
      accountId,
      amountOz: 16,
      recordedAt: "2026-08-07T09:00:00",
    });

    const entries = await listManualLogsForDate(accountId, day);
    expect(entries).toHaveLength(2);
    expect(entries.every((e) => e.recordedAt.startsWith(day))).toBe(true);
    expect(entries.map((e) => e.type).sort()).toEqual([
      "blood_pressure",
      "water",
    ]);
  });

  it("AC-2: selecting another date swaps the list — never mixes days", async () => {
    const { listManualLogsForDate } = await import("../src/calendar/day-entries");
    const { resetManualLogs, createWaterLog, createSymptomLog } =
      await import("../src/log/store");
    await resetManualLogs();
    const accountId = "acct-laura";
    const dayA = "2026-08-06";
    const dayB = "2026-08-07";

    await createWaterLog({
      accountId,
      amountOz: 8,
      recordedAt: `${dayA}T09:00:00`,
    });
    await createSymptomLog({
      accountId,
      symptomName: "Fatigue",
      severity: "usual",
      recordedAt: `${dayB}T11:00:00`,
    });

    const listA = await listManualLogsForDate(accountId, dayA);
    const listB = await listManualLogsForDate(accountId, dayB);

    expect(listA).toHaveLength(1);
    expect(listA[0].type).toBe("water");
    expect(listB).toHaveLength(1);
    expect(listB[0].type).toBe("symptom");
    expect(listA.some((e) => e.type === "symptom")).toBe(false);
    expect(listB.some((e) => e.type === "water")).toBe(false);
  });

  it("AC-3: empty selected day returns no entries / empty state data", async () => {
    const { listManualLogsForDate } = await import("../src/calendar/day-entries");
    const { resetManualLogs, createWaterLog } = await import("../src/log/store");
    await resetManualLogs();
    const accountId = "acct-laura";
    const emptyDay = "2026-08-06";
    const otherDay = "2026-08-07";

    expect(await listManualLogsForDate(accountId, emptyDay)).toEqual([]);

    await createWaterLog({
      accountId,
      amountOz: 8,
      recordedAt: `${otherDay}T09:00:00`,
    });

    expect(await listManualLogsForDate(accountId, emptyDay)).toEqual([]);
    expect(await listManualLogsForDate(accountId, otherDay)).toHaveLength(1);
  });

  it("AC-4: calendar listing uses manual-log store only (no imports)", async () => {
    const { listManualLogsForDate } = await import("../src/calendar/day-entries");
    const { getManualLogTypes } = await import("../src/log/types");
    const {
      resetManualLogs,
      createWaterLog,
      createSymptomLog,
      createBloodPressureLog,
    } = await import("../src/log/store");
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");

    const source = readFileSync(
      join(process.cwd(), "src/calendar/day-entries.ts"),
      "utf8"
    );
    expect(source).toMatch(/from ["']\.\.\/log\/store["']/);
    expect(source).not.toMatch(/health|import\/|ImportBatch|imported/i);

    await resetManualLogs();
    const accountId = "acct-laura";
    const day = "2026-08-06";
    await createWaterLog({
      accountId,
      amountOz: 8,
      recordedAt: `${day}T09:00:00`,
    });
    await createSymptomLog({
      accountId,
      symptomName: "Fatigue",
      severity: "usual",
      recordedAt: `${day}T10:00:00`,
    });
    await createBloodPressureLog({
      accountId,
      systolic: 118,
      diastolic: 76,
      heartRate: 70,
      recordedAt: `${day}T11:00:00`,
    });

    const entries = await listManualLogsForDate(accountId, day);
    const allowed = new Set(getManualLogTypes());
    expect(entries).toHaveLength(3);
    expect(entries.every((e) => allowed.has(e.type))).toBe(true);
  });

  it("AC-5: Demo cannot see Laura day entries", async () => {
    const { listManualLogsForDate } = await import("../src/calendar/day-entries");
    const { resetManualLogs, createWaterLog, createSymptomLog } =
      await import("../src/log/store");
    await resetManualLogs();
    const laura = "acct-laura";
    const demo = "acct-demo";
    const day = "2026-08-06";

    await createWaterLog({
      accountId: laura,
      amountOz: 8,
      recordedAt: `${day}T09:00:00`,
    });
    await createSymptomLog({
      accountId: laura,
      symptomName: "Fatigue",
      severity: "usual",
      recordedAt: `${day}T10:00:00`,
    });

    expect(await listManualLogsForDate(laura, day)).toHaveLength(2);
    expect(await listManualLogsForDate(demo, day)).toEqual([]);
  });

  it("AC-6: delete from selected day removes entry from that day list", async () => {
    const { listManualLogsForDate } = await import("../src/calendar/day-entries");
    const {
      resetManualLogs,
      createWaterLog,
      createSymptomLog,
      deleteManualLog,
    } = await import("../src/log/store");
    await resetManualLogs();
    const accountId = "acct-laura";
    const day = "2026-08-06";

    const water = await createWaterLog({
      accountId,
      amountOz: 8,
      recordedAt: `${day}T09:00:00`,
    });
    await createSymptomLog({
      accountId,
      symptomName: "Fatigue",
      severity: "usual",
      recordedAt: `${day}T10:00:00`,
    });

    expect(await listManualLogsForDate(accountId, day)).toHaveLength(2);
    expect(await deleteManualLog(accountId, water.id)).toBe(true);
    const remaining = await listManualLogsForDate(accountId, day);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].type).toBe("symptom");
    expect(remaining.some((e) => e.id === water.id)).toBe(false);
  });

  it("AC-7: /calendar shell + default today + day picker", async () => {
    const { getShellHeaderChrome } = await import("../src/shell/chrome");
    const calendarChrome = getShellHeaderChrome("/calendar");
    expect(calendarChrome.title).toBe("Calendar");
    expect(calendarChrome.subtitle).toBe(
      "Select a day to review everything you logged."
    );

    const {
      getDefaultSelectedCalendarDate,
      formatCalendarDayHeading,
      buildMonthGrid,
      shiftMonth,
    } = await import("../src/calendar/selection");
    const { calendarDateInNewYork } = await import("../src/log/timezone");

    const today = calendarDateInNewYork();
    expect(getDefaultSelectedCalendarDate()).toBe(today);
    expect(formatCalendarDayHeading(today, today)).toBe("Today");
    expect(formatCalendarDayHeading("2026-08-06", today)).toBe(
      "Thursday · August 6, 2026"
    );

    const [y, m] = today.split("-").map(Number);
    const grid = buildMonthGrid(y, m);
    expect(grid.length % 7).toBe(0);
    const todayCell = grid.find((c) => c.calendarDate === today);
    expect(todayCell).toBeDefined();
    expect(todayCell?.inMonth).toBe(true);

    const past = "2026-08-06";
    const pastParts = past.split("-").map(Number);
    const pastGrid = buildMonthGrid(pastParts[0], pastParts[1]);
    expect(pastGrid.some((c) => c.calendarDate === past && c.inMonth)).toBe(
      true
    );

    const shifted = shiftMonth(2026, 8, -1);
    expect(shifted).toEqual({ year: 2026, month: 7 });
  });

});
