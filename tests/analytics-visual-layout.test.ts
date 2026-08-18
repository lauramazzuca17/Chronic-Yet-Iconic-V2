/**
 * Analytics visual layout — Figma chips `62923:4123` + Medication `62819:29845`.
 */
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

describe("Analytics visual layout", () => {
  it("chip strip: brand8 selected, brand2 idle, brand5 strip (62923:4123)", async () => {
    const { getAnalyticsChipLayout, getAnalyticsBodyBackground } = await import(
      "../src/analytics/layout"
    );
    const chip = getAnalyticsChipLayout();
    expect(chip.selectedBg).toBe("#839755");
    expect(chip.unselectedBg).toBe("#0b4041");
    expect(chip.selectedColor).toBe("#ffffff");
    expect(chip.unselectedColor).toBe("#ffffff");
    expect(chip.gapPx).toBe(8);
    expect(chip.padLeftPx).toBe(16);
    expect(chip.padYPx).toBe(10);
    expect(chip.fontSizePx).toBe(14);
    expect(chip.lineHeightPx).toBe(18);
    expect(chip.radiusPx).toBe(100);
    expect(chip.stripBg).toBe(getAnalyticsBodyBackground());
    expect(chip.stripBg).toBe("#082e33");
  });

  it("main element fill is Figma brand5 #082e33", async () => {
    const { getAnalyticsBodyBackground } = await import(
      "../src/analytics/layout"
    );
    expect(getAnalyticsBodyBackground()).toBe("#082e33");
    const shell = await readFile(
      new URL("../src/shell/ShellChrome.tsx", import.meta.url),
      "utf8"
    );
    expect(shell).toContain("ANALYTICS_BODY_BG");
  });

  it("medication card + date control + pill selects match Figma 62819:29845", async () => {
    const {
      getAnalyticsCardLayout,
      getAnalyticsDateControlLayout,
      getAnalyticsPillSelectLayout,
      getAnalyticsChartFrameLayout,
    } = await import("../src/analytics/layout");
    const card = getAnalyticsCardLayout();
    expect(card.radiusPx).toBe(10);
    expect(card.padPx).toBe(16);
    expect(card.gapPx).toBe(26);
    expect(card.titleSizePx).toBe(16);
    expect(card.helperSizePx).toBe(12);
    expect(card.helperColor).toBe("#5c5c60");

    const date = getAnalyticsDateControlLayout();
    expect(date.heightPx).toBe(32);
    expect(date.endCapWidthPx).toBe(31.5);
    expect(date.endCapBg).toBe("#ffffff");
    expect(date.border).toBe("#c7c7cc");
    expect(date.dateSizePx).toBe(12);
    // Figma glyphs sit in a 24px clip; do not stretch the SVG to 24x24.
    expect(date.chevronDrawWidthPx).toBe(7.4);
    expect(date.chevronDrawHeightPx).toBe(12);
    expect(date.calendarDrawWidthPx).toBe(14);
    expect(date.calendarDrawHeightPx).toBe(16);

    const pill = getAnalyticsPillSelectLayout();
    expect(pill.widthPx).toBe(122);
    expect(pill.maxWidthPx).toBe(122);
    expect(pill.heightPx).toBe(32);
    expect(pill.radiusPx).toBe(100);
    expect(pill.fontSizePx).toBe(12);
    expect(pill.chevronDrawWidthPx).toBe(10);
    expect(pill.chevronDrawHeightPx).toBe(5);

    const chart = getAnalyticsChartFrameLayout();
    expect(chart.heightPx).toBe(180);
    expect(chart.bg).toBe("#f2f2f7");
    expect(chart.border).toBe("#d1d1d6");
    expect(chart.borderStyle).toBe("dashed");
  });

  it("Figma date-control and select chevron assets exist", () => {
    for (const icon of [
      "chevron-backward.svg",
      "chevron-forward.svg",
      "calendar.svg",
      "select-chevron.svg",
    ]) {
      expect(
        existsSync(path.join(process.cwd(), "public", "icons", icon)),
        icon
      ).toBe(true);
    }
  });

  it("AnalyticsScreen uses the shared chip and card tokens", async () => {
    const source = await readFile(
      new URL("../src/analytics/AnalyticsScreen.tsx", import.meta.url),
      "utf8"
    );
    expect(source).toContain("ANALYTICS_CHIP");
    expect(source).toContain("ANALYTICS_CARD");
    expect(source).toContain("ANALYTICS_DATE_CONTROL");
    expect(source).toContain("ANALYTICS_PILL_SELECT");
    expect(source).toContain("ANALYTICS_CARDIO");
    expect(source).toContain("ANALYTICS_DISCLAIMER");
    expect(source).toContain("ANALYTICS_ELECTROLYTES");
    expect(source).not.toContain("#8B7E66");
    expect(source).not.toContain("disabled={pending || !med.selectedMed}");
    expect(source).toContain("displayEmpty");
    expect(source).toContain("selectEmptyLabel");
  });

  it("cardiovascular range switch matches Figma 62953:4603", async () => {
    const { getAnalyticsRangeSwitchLayout, getAnalyticsCardioLayout } =
      await import("../src/analytics/layout");
    const sw = getAnalyticsRangeSwitchLayout();
    expect(sw.padPx).toBe(4);
    expect(sw.border).toBe("#d1d1d6");
    expect(sw.radiusPx).toBe(100);
    expect(sw.selectedBg).toBe("#0b4041");
    expect(sw.selectedColor).toBe("#ffffff");
    expect(sw.idleBg).toBe("#ffffff");
    expect(sw.idleColor).toBe("#1d1b20");
    expect(sw.fontSizePx).toBe(12);
    expect(sw.lineHeightPx).toBe(18);
    expect(sw.fontWeight).toBe(500);
    expect(sw.segmentPadXPx).toBe(13);
    expect(sw.segmentPadYPx).toBe(4);

    const cardio = getAnalyticsCardioLayout();
    expect(cardio.cardGapPx).toBe(16);
    expect(cardio.introToControlsGapPx).toBe(16);

    const chips = await readFile(
      new URL("../src/analytics/RangeChips.tsx", import.meta.url),
      "utf8"
    );
    expect(chips).toContain("ANALYTICS_RANGE_SWITCH");
    expect(chips).not.toContain("#8B7E66");
  });

  it("recovery HRV/walking cards reuse 16px rhythm + sage callout (62957:4735 / 62959:4803)", async () => {
    const source = await readFile(
      new URL("../src/analytics/AnalyticsScreen.tsx", import.meta.url),
      "utf8"
    );
    expect(source).toContain("analytics-recovery-panel");
    expect(source).toContain("analytics-hrv-info");
    expect(source).toContain("SageCallout");
    expect(source).toContain("IntroWithRange");
    expect(source).toContain("CARDIO_CARD_SX");
  });

  it("tachycardia disclaimer matches Figma 62953:4604", async () => {
    const { getAnalyticsDisclaimerLayout } = await import(
      "../src/analytics/layout"
    );
    const d = getAnalyticsDisclaimerLayout();
    expect(d.bg).toBe("#f2f5ed");
    expect(d.radiusPx).toBe(8);
    expect(d.padXPx).toBe(18);
    expect(d.padYPx).toBe(16);
    expect(d.gapPx).toBe(12);
    expect(d.iconSizePx).toBe(16);
    expect(d.titleSizePx).toBe(18);
    expect(d.titleLineHeightPx).toBe(22);
    expect(d.titleColor).toBe("#367057");
    expect(d.bodySizePx).toBe(14);
    expect(d.bodyLineHeightPx).toBe(18);
    expect(d.bodyColor).toBe("#1d1b20");
    expect(d.iconSrc).toBe("/icons/circle-exclamation.svg");
    expect(
      existsSync(path.join(process.cwd(), "public", "icons", "circle-exclamation.svg"))
    ).toBe(true);
  });

  it("electrolytes tab matches Figma 62967:5994", async () => {
    const { getAnalyticsElectrolytesLayout } = await import(
      "../src/analytics/layout"
    );
    const e = getAnalyticsElectrolytesLayout();
    expect(e.titleSizePx).toBe(28);
    expect(e.titleLineHeightPx).toBe(36);
    expect(e.titleWeight).toBe(900);
    expect(e.titleColor).toBe("#ffffff");
    expect(e.helperSizePx).toBe(12);
    expect(e.helperMaxWidthPx).toBe(229);
    expect(e.heroDrawWidthPx).toBe(56);
    expect(e.heroDrawHeightPx).toBe(54);
    expect(e.heroPadTopPx).toBe(12);
    expect(e.headerIconSizePx).toBe(60);
    expect(e.withDrawPx).toBe(44);
    expect(e.withoutDrawPx).toBe(50);
    expect(e.withoutPadPx).toBe(5);
    expect(e.metricIconSizePx).toBe(45);
    expect(e.metricDrawPx).toBe(29);
    expect(e.cardGapPx).toBe(22);
    expect(e.statsRowGapPx).toBe(24);
    expect(e.headerIconBg).toBe("rgba(131,151,85,0.17)");
    expect(e.hrBg).toBe("rgba(141,28,217,0.17)");
    expect(e.restingBg).toBe("rgba(28,135,217,0.17)");
    expect(e.walkingBg).toBe("rgba(240,132,41,0.17)");
    expect(e.bpBg).toBe("rgba(217,28,28,0.17)");
    expect(e.headerHelperColor).toBe("#49454f");
    expect(e.unitColor).toBe("#79747e");

    for (const icon of [
      "electrolytes-drink.svg",
      "electrolytes-with.svg",
      "electrolytes-without.svg",
      "electrolytes-hr.svg",
      "electrolytes-resting.svg",
      "electrolytes-walking.svg",
      "electrolytes-bp.svg",
    ]) {
      expect(
        existsSync(path.join(process.cwd(), "public", "icons", icon)),
        icon
      ).toBe(true);
    }

    const source = await readFile(
      new URL("../src/analytics/AnalyticsScreen.tsx", import.meta.url),
      "utf8"
    );
    expect(source).toContain("ANALYTICS_ELECTROLYTES");
    expect(source).toContain("analytics-electrolytes-${block.key}");
    expect(source).toContain("analytics-electrolytes-empty");
    expect(source).not.toContain("function MetricRow");
  });
});
