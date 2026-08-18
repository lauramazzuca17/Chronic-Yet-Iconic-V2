/**
 * FEAT-008 — Analytics (shell + Medication impact)
 * Skeleton: first test active (will fail until /tdd-cycle); remaining ACs todo.
 */
import { describe, it, expect } from "vitest";

describe("FEAT-008 analytics", () => {
  it("AC-1: /analytics shell + four tabs; default Medication", async () => {
    const { getShellHeaderChrome } = await import("../src/shell/chrome");
    const chrome = getShellHeaderChrome("/analytics");
    expect(chrome.title).toBe("Analytics");
    expect(chrome.subtitle).toBe(
      "Compare how different factors impact your health over time."
    );

    const { getAnalyticsTabs, getDefaultAnalyticsTab } = await import(
      "../src/analytics/tabs"
    );
    expect(getAnalyticsTabs().map((t) => t.id)).toEqual([
      "medication",
      "cardiovascular",
      "recovery",
      "electrolytes",
    ]);
    expect(getDefaultAnalyticsTab()).toBe("medication");
  });

  it("AC-2: Medication Impact card + Compare/with controls (Figma)", async () => {
    const {
      getMedicationImpactCard,
      formatMedicationImpactDate,
      shiftMedicationImpactDay,
    } = await import("../src/analytics/medication-impact");

    const card = getMedicationImpactCard();
    expect(card.title).toBe("Medication Impact");
    expect(card.helper).toBe(
      "See how your vitals change before and after taking a medication."
    );
    expect(card.compareLabel).toBe("Compare");
    expect(card.withLabel).toBe("with");
    expect(card.selectEmptyLabel).toBe("Medication");
    expect(card.prevDayLabel).toBe("Previous day");
    expect(card.nextDayLabel).toBe("Next day");
    expect(card.pickDateLabel).toBe("Choose date");
    expect(card.metrics.map((m) => m.id)).toEqual(["heart_rate", "bp"]);
    expect(card.metrics.find((m) => m.id === "heart_rate")?.label).toBe(
      "Heart Rate"
    );
    expect(card.metrics.find((m) => m.id === "bp")?.label).toBe("BP");
    expect(card.chartLibrary).toBe("recharts");
    expect(card.hasChartArea).toBe(true);

    expect(formatMedicationImpactDate("2026-08-01")).toBe("08/01/2026");
    expect(shiftMedicationImpactDay("2026-08-01", "prev")).toBe("2026-07-31");
    expect(shiftMedicationImpactDay("2026-08-01", "next")).toBe("2026-08-02");
  });
  it("AC-3: Medication impact series slots -2h…+2h", async () => {
    const { resetManualLogs, createMedicationLog } = await import(
      "../src/log/store"
    );
    const { buildMedicationImpactSeries, MEDICATION_IMPACT_SLOT_KEYS } =
      await import("../src/analytics/medication-series");

    await resetManualLogs();
    await createMedicationLog({
      accountId: "acct-laura",
      medicationName: "Propranolol",
      dose: "10mg",
      recordedAt: "2026-08-01T10:00:00",
    });

    const series = await buildMedicationImpactSeries({
      accountId: "acct-laura",
      calendarDate: "2026-08-01",
      medicationName: "Propranolol",
      metric: "bp",
    });

    expect(MEDICATION_IMPACT_SLOT_KEYS).toEqual([
      "-2h",
      "-1h",
      "Dose",
      "+1h",
      "+2h",
    ]);
    expect(series).not.toBeNull();
    expect(series?.takeTime).toBe("2026-08-01T10:00:00");
    expect(series?.metric).toBe("bp");
    expect(series?.slots.map((s) => s.key)).toEqual([
      "-2h",
      "-1h",
      "Dose",
      "+1h",
      "+2h",
    ]);
    expect(series?.slots.map((s) => s.targetAt)).toEqual([
      "2026-08-01T08:00:00",
      "2026-08-01T09:00:00",
      "2026-08-01T10:00:00",
      "2026-08-01T11:00:00",
      "2026-08-01T12:00:00",
    ]);
  });
  it("AC-4: ±15 min closest slot rule; no interpolation", async () => {
    const {
      resetManualLogs,
      createMedicationLog,
      createBloodPressureLog,
    } = await import("../src/log/store");
    const { buildMedicationImpactSeries } = await import(
      "../src/analytics/medication-series"
    );

    await resetManualLogs();
    await createMedicationLog({
      accountId: "acct-laura",
      medicationName: "Propranolol",
      dose: "10mg",
      recordedAt: "2026-08-01T10:00:00",
    });
    // -1h target 09:00 → within ±15m
    await createBloodPressureLog({
      accountId: "acct-laura",
      systolic: 118,
      diastolic: 70,
      heartRate: 90,
      recordedAt: "2026-08-01T09:05:00",
    });
    // Dose target 10:00 — two candidates; closest wins (no average)
    await createBloodPressureLog({
      accountId: "acct-laura",
      systolic: 120,
      diastolic: 80,
      heartRate: 95,
      recordedAt: "2026-08-01T10:03:00",
    });
    await createBloodPressureLog({
      accountId: "acct-laura",
      systolic: 125,
      diastolic: 85,
      heartRate: 100,
      recordedAt: "2026-08-01T10:10:00",
    });
    // +1h target 11:00 — 20 min away → blank (no interpolation)
    await createBloodPressureLog({
      accountId: "acct-laura",
      systolic: 130,
      diastolic: 90,
      heartRate: 105,
      recordedAt: "2026-08-01T11:20:00",
    });

    const series = await buildMedicationImpactSeries({
      accountId: "acct-laura",
      calendarDate: "2026-08-01",
      medicationName: "Propranolol",
      metric: "bp",
    });

    expect(series).not.toBeNull();
    const byKey = Object.fromEntries(
      (series?.slots ?? []).map((s) => [s.key, s.value])
    );
    expect(byKey["-2h"]).toBeNull();
    expect(byKey["-1h"]).toBe(118);
    expect(byKey.Dose).toBe(120);
    expect(byKey["+1h"]).toBeNull();
    expect(byKey["+2h"]).toBeNull();
  });
  it("AC-5: BP = manual systolic; HR = manual BP-log HR + detailed heart_rate", async () => {
    const {
      resetManualLogs,
      createMedicationLog,
      createBloodPressureLog,
    } = await import("../src/log/store");
    const { resetImports, importHealthCsvPair } = await import(
      "../src/import/store"
    );
    const { buildMedicationImpactSeries } = await import(
      "../src/analytics/medication-series"
    );

    await resetManualLogs();
    await resetImports();

    await createMedicationLog({
      accountId: "acct-laura",
      medicationName: "Propranolol",
      dose: "10mg",
      recordedAt: "2026-08-01T10:00:00",
    });
    // Near Dose: systolic 140 vs HR 200 — metric picks the right field
    await createBloodPressureLog({
      accountId: "acct-laura",
      systolic: 140,
      diastolic: 80,
      heartRate: 200,
      recordedAt: "2026-08-01T10:05:00",
    });

    const detailedCsv = [
      "Timestamp,Date,Time,Metric,Value,Unit",
      "2026-08-01T09:02:00.000-04:00,2026-08-01,09:02:00,heart_rate,111,bpm",
      "2026-08-01T11:02:00.000-04:00,2026-08-01,11:02:00,resting_heart_rate,70,bpm",
    ].join("\n");
    const summaryCsv = [
      "Date,Steps (sum),Heart Rate (average)",
      "2026-08-01,100,999",
    ].join("\n");

    const imported = await importHealthCsvPair({
      accountId: "acct-laura",
      summaryCsv,
      detailedCsv,
      summaryFilename: "summary.csv",
      detailedFilename: "detailed.csv",
    });
    expect(imported.ok).toBe(true);

    const bpSeries = await buildMedicationImpactSeries({
      accountId: "acct-laura",
      calendarDate: "2026-08-01",
      medicationName: "Propranolol",
      metric: "bp",
    });
    expect(bpSeries?.slots.find((s) => s.key === "Dose")?.value).toBe(140);

    const hrSeries = await buildMedicationImpactSeries({
      accountId: "acct-laura",
      calendarDate: "2026-08-01",
      medicationName: "Propranolol",
      metric: "heart_rate",
    });
    const hrByKey = Object.fromEntries(
      (hrSeries?.slots ?? []).map((s) => [s.key, s.value])
    );
    expect(hrByKey["-1h"]).toBe(111);
    expect(hrByKey.Dose).toBe(200);
    // resting_heart_rate and summary HR averages must not fill slots
    expect(hrByKey["+1h"]).toBeNull();
    expect(hrByKey["+2h"]).toBeNull();
  });
  it("AC-6: disabled gray untaken meds; multi-dose uses most recent take", async () => {
    const { resetManualLogs, createMedicationLog } = await import(
      "../src/log/store"
    );
    const { MEDICATION_CATALOG_NAMES } = await import("../src/log/catalogs");
    const { getMedicationImpactMedOptions, MEDICATION_UNAVAILABLE_COLOR } =
      await import("../src/analytics/medication-impact");
    const { buildMedicationImpactSeries } = await import(
      "../src/analytics/medication-series"
    );

    await resetManualLogs();
    await createMedicationLog({
      accountId: "acct-laura",
      medicationName: "Propranolol",
      dose: "10mg",
      recordedAt: "2026-08-01T08:00:00",
    });
    await createMedicationLog({
      accountId: "acct-laura",
      medicationName: "Propranolol",
      dose: "10mg",
      recordedAt: "2026-08-01T14:30:00",
    });
    await createMedicationLog({
      accountId: "acct-laura",
      medicationName: "Midodrine",
      dose: "2.5mg",
      recordedAt: "2026-08-01T09:00:00",
    });

    expect(MEDICATION_UNAVAILABLE_COLOR).toBe("#8E8E93");

    const options = await getMedicationImpactMedOptions(
      "acct-laura",
      "2026-08-01"
    );
    expect(options.map((o) => o.name)).toEqual([...MEDICATION_CATALOG_NAMES]);

    const propranolol = options.find((o) => o.name === "Propranolol");
    const midodrine = options.find((o) => o.name === "Midodrine");
    const claritin = options.find((o) => o.name === "Claritin");
    expect(propranolol).toMatchObject({
      selectable: true,
      color: null,
    });
    expect(midodrine).toMatchObject({ selectable: true, color: null });
    expect(claritin).toMatchObject({
      selectable: false,
      color: "#8E8E93",
    });

    const series = await buildMedicationImpactSeries({
      accountId: "acct-laura",
      calendarDate: "2026-08-01",
      medicationName: "Propranolol",
      metric: "bp",
    });
    expect(series?.takeTime).toBe("2026-08-01T14:30:00");
    expect(series?.slots.find((s) => s.key === "Dose")?.targetAt).toBe(
      "2026-08-01T14:30:00"
    );
  });
  it("AC-7: tooltips BP / HR", async () => {
    const {
      resetManualLogs,
      createMedicationLog,
      createBloodPressureLog,
    } = await import("../src/log/store");
    const {
      buildMedicationImpactSeries,
      formatMedicationImpactTooltip,
    } = await import("../src/analytics/medication-series");

    expect(
      formatMedicationImpactTooltip({
        metric: "bp",
        systolic: 120,
        diastolic: 80,
        recordedAt: "2026-08-01T08:07:00",
      })
    ).toBe("120/80 · 8:07 AM");

    expect(
      formatMedicationImpactTooltip({
        metric: "heart_rate",
        value: 105,
        recordedAt: "2026-08-01T08:07:00",
      })
    ).toBe("105 bpm · 8:07 AM");

    await resetManualLogs();
    await createMedicationLog({
      accountId: "acct-laura",
      medicationName: "Propranolol",
      dose: "10mg",
      recordedAt: "2026-08-01T10:00:00",
    });
    await createBloodPressureLog({
      accountId: "acct-laura",
      systolic: 118,
      diastolic: 76,
      heartRate: 92,
      recordedAt: "2026-08-01T10:07:00",
    });

    const bpSeries = await buildMedicationImpactSeries({
      accountId: "acct-laura",
      calendarDate: "2026-08-01",
      medicationName: "Propranolol",
      metric: "bp",
    });
    expect(bpSeries?.slots.find((s) => s.key === "Dose")?.tooltip).toBe(
      "118/76 · 10:07 AM"
    );

    const hrSeries = await buildMedicationImpactSeries({
      accountId: "acct-laura",
      calendarDate: "2026-08-01",
      medicationName: "Propranolol",
      metric: "heart_rate",
    });
    expect(hrSeries?.slots.find((s) => s.key === "Dose")?.tooltip).toBe(
      "92 bpm · 10:07 AM"
    );
  });

  it("empty window copy uses HR or BP; no chart when med taken but no vitals in ±2h", async () => {
    const { formatMedicationImpactEmptyWindow } = await import(
      "../src/analytics/medication-chart"
    );
    expect(formatMedicationImpactEmptyWindow("heart_rate")).toBe(
      "No HR logged during this timeframe"
    );
    expect(formatMedicationImpactEmptyWindow("bp")).toBe(
      "No BP logged during this timeframe"
    );

    const { resetManualLogs, createMedicationLog } = await import(
      "../src/log/store"
    );
    const { buildMedicationImpactSeries } = await import(
      "../src/analytics/medication-series"
    );
    const { medicationImpactPlottedValues } = await import(
      "../src/analytics/medication-chart"
    );
    await resetManualLogs();
    await createMedicationLog({
      accountId: "acct-laura",
      medicationName: "Propranolol",
      dose: "10mg",
      recordedAt: "2026-08-01T10:00:00",
    });
    const series = await buildMedicationImpactSeries({
      accountId: "acct-laura",
      calendarDate: "2026-08-01",
      medicationName: "Propranolol",
      metric: "bp",
    });
    expect(series).not.toBeNull();
    expect(medicationImpactPlottedValues(series!)).toEqual([]);
  });

  it("y-axis domain is 30 below the lowest plotted point and 30 above the highest", async () => {
    const { medicationImpactYDomain } = await import(
      "../src/analytics/medication-chart"
    );
    expect(medicationImpactYDomain([97, 107])).toEqual([67, 137]);
    expect(medicationImpactYDomain([97, 69, 107, 77])).toEqual([39, 137]);
  });

  it("Medication Impact tooltip content is the slot string with no name colon", async () => {
    const source = await import("node:fs/promises").then((fs) =>
      fs.readFile(new URL("../src/analytics/charts.tsx", import.meta.url), "utf8")
    );
    expect(source).not.toContain('return [tip ?? "—", ""]');
    expect(source).toContain("MedicationImpactTooltip");
    expect(source).toContain("medicationImpactYDomain");
    expect(source).toContain("formatMedicationImpactEmptyWindow");
  });

  it("Medication Impact chart helpers stay off server stores (no node:fs in the client chunk)", async () => {
    const { readFile } = await import("node:fs/promises");
    const charts = await readFile(
      new URL("../src/analytics/charts.tsx", import.meta.url),
      "utf8"
    );
    expect(charts).toContain('from "@/analytics/medication-chart"');
    expect(charts).not.toMatch(
      /from ["']@\/analytics\/medication-impact["']/
    );
    expect(charts).not.toMatch(
      /import \{[^}]*\} from ["']@\/analytics\/medication-series["']/
    );
    expect(charts).toContain(
      'import type { MedicationImpactSeries } from "@/analytics/medication-series"'
    );

    const helpers = await readFile(
      new URL("../src/analytics/medication-chart.ts", import.meta.url),
      "utf8"
    );
    expect(helpers).not.toContain("log/store");
    expect(helpers).not.toContain("import/store");
    expect(helpers).not.toMatch(/from ["']node:(fs|crypto)["']/);
  });
  it("AC-8: Demo cannot read Laura analytics", async () => {
    const {
      resetManualLogs,
      createMedicationLog,
      createBloodPressureLog,
    } = await import("../src/log/store");
    const { resetImports, importHealthCsvPair } = await import(
      "../src/import/store"
    );
    const { getMedicationImpactMedOptions } = await import(
      "../src/analytics/medication-impact"
    );
    const { buildMedicationImpactSeries } = await import(
      "../src/analytics/medication-series"
    );

    await resetManualLogs();
    await resetImports();

    const laura = "acct-laura";
    const demo = "acct-demo";

    await createMedicationLog({
      accountId: laura,
      medicationName: "Propranolol",
      dose: "10mg",
      recordedAt: "2026-08-01T10:00:00",
    });
    await createBloodPressureLog({
      accountId: laura,
      systolic: 140,
      diastolic: 90,
      heartRate: 110,
      recordedAt: "2026-08-01T10:05:00",
    });

    const detailedCsv = [
      "Timestamp,Date,Time,Metric,Value,Unit",
      "2026-08-01T09:02:00.000-04:00,2026-08-01,09:02:00,heart_rate,111,bpm",
    ].join("\n");
    const summaryCsv = ["Date,Steps (sum)", "2026-08-01,100"].join("\n");
    expect(
      (await importHealthCsvPair({
        accountId: laura,
        summaryCsv,
        detailedCsv,
        summaryFilename: "summary.csv",
        detailedFilename: "detailed.csv",
      })).ok
    ).toBe(true);

    const lauraSeries = await buildMedicationImpactSeries({
      accountId: laura,
      calendarDate: "2026-08-01",
      medicationName: "Propranolol",
      metric: "bp",
    });
    expect(lauraSeries?.slots.find((s) => s.key === "Dose")?.value).toBe(140);

    const lauraHr = await buildMedicationImpactSeries({
      accountId: laura,
      calendarDate: "2026-08-01",
      medicationName: "Propranolol",
      metric: "heart_rate",
    });
    expect(lauraHr?.slots.find((s) => s.key === "-1h")?.value).toBe(111);

    // Demo: no take → no series; dropdown does not unlock Laura's meds
    expect(
      await buildMedicationImpactSeries({
        accountId: demo,
        calendarDate: "2026-08-01",
        medicationName: "Propranolol",
        metric: "bp",
      })
    ).toBeNull();

    expect(
      await buildMedicationImpactSeries({
        accountId: demo,
        calendarDate: "2026-08-01",
        medicationName: "Propranolol",
        metric: "heart_rate",
      })
    ).toBeNull();

    const demoOptions = await getMedicationImpactMedOptions(demo, "2026-08-01");
    expect(demoOptions.find((o) => o.name === "Propranolol")).toMatchObject({
      selectable: false,
      color: "#8E8E93",
    });

    const lauraOptions = await getMedicationImpactMedOptions(laura, "2026-08-01");
    expect(lauraOptions.find((o) => o.name === "Propranolol")).toMatchObject({
      selectable: true,
      color: null,
    });
  });
  it("AC-9: Cardiovascular Chart 2 + Chart 3 (REQ-17)", async () => {
    const {
      resetManualLogs,
      createBloodPressureLog,
    } = await import("../src/log/store");
    const { resetImports, importHealthCsvPair } = await import(
      "../src/import/store"
    );
    const {
      getChart2Card,
      getChart3Card,
      CARDIO_RANGE_IDS,
      buildBpHrOverlaySeries,
      buildTachycardiaBurdenSeries,
      TACHYCARDIA_THRESHOLD_BPM,
    } = await import("../src/analytics/cardiovascular");

    expect(CARDIO_RANGE_IDS).toEqual(["today", "last_7", "last_30"]);
    expect(TACHYCARDIA_THRESHOLD_BPM).toBe(100);

    const chart2 = getChart2Card();
    expect(chart2.title).toBe("Blood Pressure and Heart Rate");
    expect(chart2.helper).toBe(
      "See how changes in one may relate to changes in the other."
    );
    expect(chart2.yMin).toBe(50);
    expect(chart2.yMax).toBe(190);
    expect(chart2.ranges.map((r) => r.id)).toEqual([
      "today",
      "last_7",
      "last_30",
    ]);

    const chart3 = getChart3Card();
    expect(chart3.title).toBe("Tachycardia Burden");
    expect(chart3.helper).toBe(
      "Percent of heart rate readings ≥ 100 bpm"
    );
    expect(chart3.disclaimerTitle).toBe("Data Disclaimer");
    expect(chart3.disclaimerBody).toContain(
      "at or above the 100 bpm threshold"
    );

    await resetManualLogs();
    await resetImports();
    const accountId = "acct-laura";
    const today = "2026-08-01";

    await createBloodPressureLog({
      accountId,
      systolic: 120,
      diastolic: 80,
      heartRate: 95,
      recordedAt: "2026-08-01T10:00:00",
    });
    await createBloodPressureLog({
      accountId,
      systolic: 130,
      diastolic: 85,
      heartRate: 105,
      recordedAt: "2026-07-30T12:00:00",
    });
    // Outside last_7 window when today=2026-08-01 (before Jul 26)
    await createBloodPressureLog({
      accountId,
      systolic: 150,
      diastolic: 90,
      heartRate: 140,
      recordedAt: "2026-07-20T12:00:00",
    });

    const detailedCsv = [
      "Timestamp,Date,Time,Metric,Value,Unit",
      "2026-08-01T11:00:00.000-04:00,2026-08-01,11:00:00,heart_rate,112,bpm",
      "2026-08-01T11:30:00.000-04:00,2026-08-01,11:30:00,resting_heart_rate,70,bpm",
    ].join("\n");
    expect(
      (await importHealthCsvPair({
        accountId,
        summaryCsv: "Date,Steps (sum)\n2026-08-01,10",
        detailedCsv,
        summaryFilename: "s.csv",
        detailedFilename: "d.csv",
      })).ok
    ).toBe(true);

    const overlay = await buildBpHrOverlaySeries({
      accountId,
      range: "last_7",
      today,
    });
    expect(overlay.bp.map((p) => p.value)).toEqual([130, 120]);
    expect(overlay.hr.map((p) => p.value).sort((a, b) => a - b)).toEqual([
      95, 105, 112,
    ]);
    // resting excluded; Jul 20 outside window
    expect(overlay.bp.every((p) => p.value !== 150)).toBe(true);

    const todayOnly = await buildBpHrOverlaySeries({
      accountId,
      range: "today",
      today,
    });
    expect(todayOnly.bp.map((p) => p.value)).toEqual([120]);
    expect(todayOnly.hr.map((p) => p.value).sort((a, b) => a - b)).toEqual([
      95, 112,
    ]);

    // Chart 3: Aug 1 has HR 95 (manual), 112 (import) → 1/2 = 50%
    // Jul 30 has 105 → 1/1 = 100%
    // other days in window with no readings → null
    const burden = await buildTachycardiaBurdenSeries({ accountId, today });
    expect(burden.days).toHaveLength(7);
    expect(burden.days[0]?.calendarDate).toBe("2026-07-26");
    expect(burden.days[6]?.calendarDate).toBe("2026-08-01");
    expect(burden.days[6]?.percent).toBe(50);
    expect(burden.days.find((d) => d.calendarDate === "2026-07-30")?.percent).toBe(
      100
    );
    expect(burden.days.find((d) => d.calendarDate === "2026-07-26")?.percent).toBeNull();
  });
  it("AC-10: Recovery Chart 4 + Chart 5 (REQ-17)", async () => {
    const { resetImports, importHealthCsvPair } = await import(
      "../src/import/store"
    );
    const {
      getHrvCard,
      getWalkingHrCard,
      HRV_RANGE_IDS,
      WALKING_HR_RANGE_IDS,
      buildHrvSeries,
      buildWalkingHrSeries,
    } = await import("../src/analytics/recovery");

    expect(HRV_RANGE_IDS).toEqual(["today", "last_7", "last_30"]);
    expect(WALKING_HR_RANGE_IDS).toEqual(["last_7", "last_30"]);

    const hrvCard = getHrvCard();
    expect(hrvCard.title).toBe("Heart Rate Variability");
    expect(hrvCard.helper).toBe(
      "HRV measures the changes in time between your heartbeats."
    );
    expect(hrvCard.infoTitle).toBe("What your HRV shows");
    expect(hrvCard.infoFooter).toContain("POTs");

    const walkCard = getWalkingHrCard();
    expect(walkCard.title).toBe("Average Walking Heart Rate");
    expect(walkCard.helper).toContain("Walks outside can be very challenging");
    expect(walkCard.ranges.map((r) => r.id)).toEqual(["last_7", "last_30"]);

    await resetImports();
    const accountId = "acct-laura";
    const today = "2026-08-01";
    const detailedCsv = [
      "Timestamp,Date,Time,Metric,Value,Unit",
      "2026-08-01T10:00:00.000-04:00,2026-08-01,10:00:00,hrv_sdnn,42.5,ms",
      "2026-07-30T12:00:00.000-04:00,2026-07-30,12:00:00,hrv_sdnn,38.0,ms",
      "2026-07-20T12:00:00.000-04:00,2026-07-20,12:00:00,hrv_sdnn,99.0,ms",
      "2026-08-01T11:00:00.000-04:00,2026-08-01,11:00:00,walking_heart_rate_avg,128,bpm",
      "2026-07-28T09:00:00.000-04:00,2026-07-28,09:00:00,walking_heart_rate_avg,120,bpm",
      "2026-07-20T09:00:00.000-04:00,2026-07-20,09:00:00,walking_heart_rate_avg,999,bpm",
      "2026-08-01T12:00:00.000-04:00,2026-08-01,12:00:00,heart_rate,90,bpm",
    ].join("\n");
    expect(
      (await importHealthCsvPair({
        accountId,
        summaryCsv: "Date,Steps (sum)\n2026-08-01,10",
        detailedCsv,
        summaryFilename: "s.csv",
        detailedFilename: "d.csv",
      })).ok
    ).toBe(true);

    const hrv = await buildHrvSeries({ accountId, range: "last_7", today });
    expect(hrv.points.map((p) => p.value)).toEqual([38, 42.5]);

    const hrvToday = await buildHrvSeries({ accountId, range: "today", today });
    expect(hrvToday.points.map((p) => p.value)).toEqual([42.5]);

    const walking = await buildWalkingHrSeries({
      accountId,
      range: "last_7",
      today,
    });
    expect(walking.points.map((p) => p.value)).toEqual([120, 128]);

    const walking30 = await buildWalkingHrSeries({
      accountId,
      range: "last_30",
      today,
    });
    expect(walking30.points.map((p) => p.value)).toEqual([999, 120, 128]);
  });
  it("AC-11: Electrolytes Lifestyle cards (REQ-20)", async () => {
    const {
      resetManualLogs,
      createElectrolyteLog,
      createBloodPressureLog,
    } = await import("../src/log/store");
    const { resetImports, importHealthCsvPair } = await import(
      "../src/import/store"
    );
    const {
      getElectrolytesSection,
      buildElectrolytesComparison,
    } = await import("../src/analytics/electrolytes");

    const section = getElectrolytesSection();
    expect(section.title).toBe("Electrolytes");
    expect(section.helper).toBe(
      "See how days with electrolytes compare to days without."
    );
    expect(section.withTitle).toBe("With Electrolytes");
    expect(section.withoutTitle).toBe("Without Electrolytes");

    await resetManualLogs();
    await resetImports();
    const accountId = "acct-laura";
    const asOf = "2026-08-05";

    await createElectrolyteLog({
      accountId,
      recordedAt: "2026-08-01T08:00:00",
    });
    await createElectrolyteLog({
      accountId,
      recordedAt: "2026-08-03T08:00:00",
    });
    await createBloodPressureLog({
      accountId,
      systolic: 120,
      diastolic: 80,
      heartRate: 100,
      recordedAt: "2026-08-01T10:00:00",
    });
    await createBloodPressureLog({
      accountId,
      systolic: 130,
      diastolic: 90,
      heartRate: 90,
      recordedAt: "2026-08-02T10:00:00",
    });
    await createBloodPressureLog({
      accountId,
      systolic: 110,
      diastolic: 70,
      heartRate: 120,
      recordedAt: "2026-08-03T10:00:00",
    });

    expect(
      (await importHealthCsvPair({
        accountId,
        summaryCsv: "Date,Steps (sum)\n2026-08-01,1",
        detailedCsv: [
          "Timestamp,Date,Time,Metric,Value,Unit",
          "2026-08-01T12:00:00.000-04:00,2026-08-01,12:00:00,resting_heart_rate,70,bpm",
          "2026-08-01T13:00:00.000-04:00,2026-08-01,13:00:00,walking_heart_rate_avg,110,bpm",
          "2026-08-03T14:00:00.000-04:00,2026-08-03,14:00:00,heart_rate,140,bpm",
        ].join("\n"),
        summaryFilename: "s.csv",
        detailedFilename: "d.csv",
      })).ok
    ).toBe(true);

    const comparison = await buildElectrolytesComparison({ accountId, asOf });
    expect(comparison).not.toBeNull();
    expect(comparison?.windowStart).toBe("2026-08-01");
    expect(comparison?.windowEnd).toBe("2026-08-05");
    expect(comparison?.withDays).toEqual(["2026-08-01", "2026-08-03"]);
    expect(comparison?.withoutDays).toEqual([
      "2026-08-02",
      "2026-08-04",
      "2026-08-05",
    ]);

    expect(comparison?.withCard.avgHr).toBe(120);
    expect(comparison?.withCard.avgResting).toBe(70);
    expect(comparison?.withCard.avgWalking).toBe(110);
    expect(comparison?.withCard.avgBp).toBe("115/75");

    expect(comparison?.withoutCard.avgHr).toBe(90);
    expect(comparison?.withoutCard.avgResting).toBeNull();
    expect(comparison?.withoutCard.avgWalking).toBeNull();
    expect(comparison?.withoutCard.avgBp).toBe("130/90");

    // No electrolytes → no comparison window
    await resetManualLogs();
    expect(await buildElectrolytesComparison({ accountId, asOf })).toBeNull();
  });
  // AC-12: e2e/feat-008-analytics-journey.spec.ts
});
