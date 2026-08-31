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

  it("Chart 2 Last 7 Days x-axis is the seven calendar days, not per-reading clock times", async () => {
    const { buildBpHrOverlayChartView, BP_HR_OVERLAY_SHOW_DOTS } = await import(
      "../src/analytics/cardio-chart"
    );
    expect(BP_HR_OVERLAY_SHOW_DOTS).toBe(false);

    const view = buildBpHrOverlayChartView({
      range: "last_7",
      startDate: "2026-07-26",
      endDate: "2026-08-01",
      bp: [{ recordedAt: "2026-07-28T10:00:00", value: 110 }],
      hr: [
        { recordedAt: "2026-07-26T08:00:00", value: 80 },
        { recordedAt: "2026-08-01T22:00:00", value: 90 },
      ],
    });

    expect(view.ticks.map((t) => t.label)).toEqual([
      "7/26",
      "7/27",
      "7/28",
      "7/29",
      "7/30",
      "7/31",
      "8/1",
    ]);
    expect(view.ticks.every((t) => !/^\d{1,2}:\d{2}$/.test(t.label))).toBe(true);
    expect(view.xMin).toBe(view.ticks[0]!.x);
    expect(view.xMax).toBeGreaterThan(view.ticks[6]!.x);
    expect(view.rows.some((r) => r.bp === 110)).toBe(true);
    expect(view.rows.some((r) => r.hr === 80)).toBe(true);
  });

  it("Chart 2 Today x-axis uses clock hours across that day", async () => {
    const { buildBpHrOverlayChartView } = await import(
      "../src/analytics/cardio-chart"
    );
    const view = buildBpHrOverlayChartView({
      range: "today",
      startDate: "2026-08-01",
      endDate: "2026-08-01",
      bp: [{ recordedAt: "2026-08-01T10:00:00", value: 118 }],
      hr: [{ recordedAt: "2026-08-01T10:00:00", value: 92 }],
    });
    expect(view.ticks.map((t) => t.label)).toEqual([
      "12 AM",
      "6 AM",
      "12 PM",
      "6 PM",
    ]);
  });

  it("Chart 2 overlay lines omit point dots (line readable with dense HR)", async () => {
    const { readFile } = await import("node:fs/promises");
    const charts = await readFile(
      new URL("../src/analytics/charts.tsx", import.meta.url),
      "utf8"
    );
    expect(charts).toContain('from "@/analytics/cardio-chart"');
    const overlayFn = charts.slice(
      charts.indexOf("export function BpHrOverlayChart"),
      charts.indexOf("export function TachycardiaBurdenChart")
    );
    expect(overlayFn).toContain("BP_HR_OVERLAY_SHOW_DOTS");
    expect(overlayFn).not.toMatch(/dot=\{\{\s*r:\s*3/);

    const helpers = await readFile(
      new URL("../src/analytics/cardio-chart.ts", import.meta.url),
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
    } = await import("../src/analytics/cardiovascular");

    expect(CARDIO_RANGE_IDS).toEqual(["today", "last_7", "last_30"]);

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
      "Share of heart rate readings in each bpm range"
    );
    expect(chart3.disclaimerTitle).toBe("Data Disclaimer");
    expect(chart3.disclaimerBody).toContain("0–69, 70–84, 85–95, and 96+");
    expect(chart3.disclaimerBody).not.toContain("100 bpm threshold");
    expect(chart3.bands.map((b) => b.id)).toEqual([
      "low",
      "mid",
      "high",
      "tachy",
    ]);
    expect(chart3.bands.map((b) => b.label)).toEqual([
      "0–69",
      "70–84",
      "85–95",
      "96+",
    ]);

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
    // Outside last_7 window when today=2026-08-01 (before Jul 25; window is Jul 25–31)
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
    expect(overlay.startDate).toBe("2026-07-25");
    expect(overlay.endDate).toBe("2026-07-31");
    expect(overlay.bp.map((p) => p.value)).toEqual([130]);
    expect(overlay.hr.map((p) => p.value)).toEqual([105]);
    // resting excluded; Aug 1 is today (not in last_7); Jul 20 outside window
    expect(overlay.bp.every((p) => p.value !== 150)).toBe(true);
    expect(overlay.bp.every((p) => p.value !== 120)).toBe(true);

    const todayOnly = await buildBpHrOverlaySeries({
      accountId,
      range: "today",
      today,
    });
    expect(todayOnly.bp.map((p) => p.value)).toEqual([120]);
    expect(todayOnly.hr.map((p) => p.value).sort((a, b) => a - b)).toEqual([
      95, 112,
    ]);

    // Chart 3: 7 complete days ending yesterday (Jul 25–31). Jul 30 has 105 → 100% tachy.
    // Aug 1 (today) is excluded.
    const burden = await buildTachycardiaBurdenSeries({ accountId, today });
    expect(burden.days).toHaveLength(7);
    expect(burden.days[0]?.calendarDate).toBe("2026-07-25");
    expect(burden.days[6]?.calendarDate).toBe("2026-07-31");
    expect(
      burden.days.find((d) => d.calendarDate === "2026-08-01")
    ).toBeUndefined();
    expect(
      burden.days.find((d) => d.calendarDate === "2026-07-30")?.bands
    ).toEqual({
      low: 0,
      mid: 0,
      high: 0,
      tachy: 100,
    });
    expect(
      burden.days.find((d) => d.calendarDate === "2026-07-26")?.bands
    ).toBeNull();
  });

  it("Chart 3 HR bands are 0–69 / 70–84 / 85–95 / 96+", async () => {
    const { hrBurdenBandId, HR_BURDEN_BANDS } = await import(
      "../src/analytics/cardio-chart"
    );
    expect(HR_BURDEN_BANDS.map((b) => b.id)).toEqual([
      "low",
      "mid",
      "high",
      "tachy",
    ]);
    expect(hrBurdenBandId(0)).toBe("low");
    expect(hrBurdenBandId(69)).toBe("low");
    expect(hrBurdenBandId(70)).toBe("mid");
    expect(hrBurdenBandId(84)).toBe("mid");
    expect(hrBurdenBandId(85)).toBe("high");
    expect(hrBurdenBandId(95)).toBe("high");
    expect(hrBurdenBandId(96)).toBe("tachy");
    expect(hrBurdenBandId(165)).toBe("tachy");
  });

  it("Last 7 Days and Last 30 Days windows exclude today (end yesterday)", async () => {
    const { rangeWindow } = await import("../src/analytics/cardiovascular");
    expect(rangeWindow("today", "2026-08-01")).toEqual({
      startDate: "2026-08-01",
      endDate: "2026-08-01",
    });
    expect(rangeWindow("last_7", "2026-08-01")).toEqual({
      startDate: "2026-07-25",
      endDate: "2026-07-31",
    });
    expect(rangeWindow("last_30", "2026-08-01")).toEqual({
      startDate: "2026-07-02",
      endDate: "2026-07-31",
    });
  });

  it("Chart 3 Y-axis formats 100% (not unit suffix) and labels stack segments", async () => {
    const { formatHrBurdenAxisTick, formatHrBurdenBarLabel } = await import(
      "../src/analytics/cardio-chart"
    );
    expect(formatHrBurdenAxisTick(0)).toBe("0%");
    expect(formatHrBurdenAxisTick(100)).toBe("100%");
    expect(formatHrBurdenBarLabel(0)).toBe("");
    expect(formatHrBurdenBarLabel(7)).toBe("");
    expect(formatHrBurdenBarLabel(8)).toBe("8%");
    expect(formatHrBurdenBarLabel(50)).toBe("50%");
    expect(formatHrBurdenBarLabel(100)).toBe("100%");

    const { readFile } = await import("node:fs/promises");
    const charts = await readFile(
      new URL("../src/analytics/charts.tsx", import.meta.url),
      "utf8"
    );
    const chart3 = charts.slice(
      charts.indexOf("export function TachycardiaBurdenChart"),
      charts.indexOf("export function RecoveryLineChart")
    );
    expect(chart3).toContain("formatHrBurdenAxisTick");
    expect(chart3).not.toMatch(/unit=["']%["']/);
    expect(chart3).toContain("LabelList");
    expect(chart3).toContain("formatHrBurdenBarLabel");
  });

  it("Cardiovascular tab renders Tachycardia Burden above BP & HR", async () => {
    const { readFile } = await import("node:fs/promises");
    const source = await readFile(
      new URL("../src/analytics/AnalyticsScreen.tsx", import.meta.url),
      "utf8"
    );
    const panel = source.slice(
      source.indexOf("analytics-cardiovascular-panel"),
      source.indexOf("analytics-recovery-panel")
    );
    expect(panel.indexOf("TachycardiaBurdenChart")).toBeGreaterThan(-1);
    expect(panel.indexOf("TachycardiaBurdenChart")).toBeLessThan(
      panel.indexOf("BpHrOverlayChart")
    );
  });

  it("AC-13: daily Tachycardia Burden pie uses the same bands for one picked day", async () => {
    const {
      resetManualLogs,
      createBloodPressureLog,
    } = await import("../src/log/store");
    const { resetImports, importHealthCsvPair } = await import(
      "../src/import/store"
    );
    const {
      getChart3DayCard,
      defaultTachycardiaPieDate,
      buildTachycardiaDayPieSeries,
    } = await import("../src/analytics/cardiovascular");
    const { hrBurdenPieSlices } = await import("../src/analytics/cardio-chart");

    const card = getChart3DayCard();
    expect(card.title).toBe("Tachycardia Burden");
    expect(card.helper).toBe(
      "Share of that day's heart rate readings in each bpm range"
    );
    expect(card.empty).toBe("No heart rate readings for this day.");
    expect(card.prevDayLabel).toBe("Previous day");
    expect(card.nextDayLabel).toBe("Next day");
    expect(card.pickDateLabel).toBe("Choose date");
    expect(card.bands.map((b) => b.id)).toEqual([
      "low",
      "mid",
      "high",
      "tachy",
    ]);
    expect(defaultTachycardiaPieDate("2026-08-01")).toBe("2026-07-31");

    await resetManualLogs();
    await resetImports();
    const accountId = "acct-laura";

    await createBloodPressureLog({
      accountId,
      systolic: 110,
      diastolic: 70,
      heartRate: 65,
      recordedAt: "2026-07-30T08:00:00",
    });
    await createBloodPressureLog({
      accountId,
      systolic: 112,
      diastolic: 72,
      heartRate: 72,
      recordedAt: "2026-07-30T09:00:00",
    });
    await createBloodPressureLog({
      accountId,
      systolic: 114,
      diastolic: 74,
      heartRate: 90,
      recordedAt: "2026-07-30T10:00:00",
    });
    await createBloodPressureLog({
      accountId,
      systolic: 118,
      diastolic: 76,
      heartRate: 100,
      recordedAt: "2026-07-30T11:00:00",
    });
    await createBloodPressureLog({
      accountId,
      systolic: 120,
      diastolic: 80,
      heartRate: 110,
      recordedAt: "2026-07-30T12:00:00",
    });
    await createBloodPressureLog({
      accountId,
      systolic: 122,
      diastolic: 80,
      heartRate: 50,
      recordedAt: "2026-07-29T12:00:00",
    });

    const detailedCsv = [
      "Timestamp,Date,Time,Metric,Value,Unit",
      "2026-07-30T13:00:00.000-04:00,2026-07-30,13:00:00,heart_rate,80,bpm",
      "2026-07-30T13:30:00.000-04:00,2026-07-30,13:30:00,resting_heart_rate,62,bpm",
    ].join("\n");
    expect(
      (
        await importHealthCsvPair({
          accountId,
          summaryCsv: "Date,Steps (sum)\n2026-07-30,10",
          detailedCsv,
          summaryFilename: "s-pie.csv",
          detailedFilename: "d-pie.csv",
        })
      ).ok
    ).toBe(true);

    const pie = await buildTachycardiaDayPieSeries({
      accountId,
      calendarDate: "2026-07-30",
    });
    expect(pie.calendarDate).toBe("2026-07-30");
    expect(pie.dateDisplay).toBe("07/30/2026");
    expect(pie.denominator).toBe(6);
    expect(pie.bands).toEqual({
      low: (1 / 6) * 100,
      mid: (2 / 6) * 100,
      high: (1 / 6) * 100,
      tachy: (2 / 6) * 100,
    });
    expect(hrBurdenPieSlices(pie.bands).map((s) => s.id)).toEqual([
      "low",
      "mid",
      "high",
      "tachy",
    ]);

    const empty = await buildTachycardiaDayPieSeries({
      accountId,
      calendarDate: "2026-07-31",
    });
    expect(empty.bands).toBeNull();
    expect(empty.denominator).toBe(0);
    expect(hrBurdenPieSlices(empty.bands)).toEqual([]);

    const otherDay = await buildTachycardiaDayPieSeries({
      accountId,
      calendarDate: "2026-07-29",
    });
    expect(otherDay.bands).toEqual({
      low: 100,
      mid: 0,
      high: 0,
      tachy: 0,
    });
    expect(hrBurdenPieSlices(otherDay.bands).map((s) => s.id)).toEqual(["low"]);
  });

  it("AC-13: pie sits below Data Disclaimer with a date picker", async () => {
    const { readFile } = await import("node:fs/promises");
    const screen = await readFile(
      new URL("../src/analytics/AnalyticsScreen.tsx", import.meta.url),
      "utf8"
    );
    const panel = screen.slice(
      screen.indexOf("analytics-cardiovascular-panel"),
      screen.indexOf("analytics-recovery-panel")
    );
    expect(panel.indexOf("analytics-cardio-disclaimer")).toBeLessThan(
      panel.indexOf("TachycardiaDayPieChart")
    );
    expect(panel.indexOf("TachycardiaDayPieChart")).toBeLessThan(
      panel.indexOf("BpHrOverlayChart")
    );
    expect(panel).toContain('testIdPrefix="analytics-cardio-pie"');
    expect(panel).toContain("AnalyticsDateControl");

    const charts = await readFile(
      new URL("../src/analytics/charts.tsx", import.meta.url),
      "utf8"
    );
    const pie = charts.slice(
      charts.indexOf("export function TachycardiaDayPieChart"),
      charts.indexOf("export function RecoveryLineChart")
    );
    expect(pie).toContain("PieChart");
    expect(pie).toContain("analytics-cardio-chart3-pie");
    expect(pie).toContain("hrBurdenPieSlices");
    expect(charts).not.toMatch(
      /import \{[^}]*\} from ["']@\/analytics\/cardiovascular["']/
    );

    const actions = await readFile(
      new URL("../src/analytics/actions.ts", import.meta.url),
      "utf8"
    );
    expect(actions).toContain("defaultTachycardiaPieDate");
    expect(actions).toContain("burdenDay");
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
    expect(hrv.points.map((p) => p.value)).toEqual([38]);

    const hrvToday = await buildHrvSeries({ accountId, range: "today", today });
    expect(hrvToday.points.map((p) => p.value)).toEqual([42.5]);

    const walking = await buildWalkingHrSeries({
      accountId,
      range: "last_7",
      today,
    });
    expect(walking.points.map((p) => p.value)).toEqual([120]);

    const walking30 = await buildWalkingHrSeries({
      accountId,
      range: "last_30",
      today,
    });
    expect(walking30.points.map((p) => p.value)).toEqual([999, 120]);
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
