/**
 * Log visual layout — Figma Main 62898:1748 chips + cards.
 */
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";

describe("Log visual layout", () => {
  it("chip strip: orange selected, white unselected, horizontal scroll tokens", async () => {
    const { getLogChipLayout } = await import("../src/log/layout");
    const chip = getLogChipLayout();
    expect(chip.selectedBg).toBe("#f08429");
    expect(chip.unselectedBg).toBe("#ffffff");
    expect(chip.unselectedColor).toBe("#49454f");
    expect(chip.gapPx).toBe(8);
    expect(chip.padLeftPx).toBe(16);
    expect(chip.fontSizePx).toBe(14);
    expect(chip.radiusPx).toBe(100);
    expect(chip.visualMinHeightPx).toBe(26);
  });

  it("chip strip is opaque brand3 so scrolled entries are clipped behind it", async () => {
    const { getLogChipLayout, getLogBodyBackground } = await import(
      "../src/log/layout"
    );
    expect(getLogChipLayout().stripBg).toBe(getLogBodyBackground());
  });

  it("form/today cards: py 18; fields use outlined filled-state type tokens", async () => {
    const {
      getLogCardLayout,
      getLogEntryCardLayout,
      getLogBodyBackground,
      getLogBodyPadBottom,
      getLogFieldLayout,
      getLogCtaLayout,
    } = await import("../src/log/layout");
    const card = getLogCardLayout();
    expect(card.radiusPx).toBe(12);
    expect(card.padXPx).toBe(16);
    expect(card.padYPx).toBe(18);
    expect(card.titleSizePx).toBe(20);
    expect(card.countColor).toBe("#71717b");
    expect(getLogBodyBackground()).toBe("#b7cc87");
    expect(getLogBodyPadBottom()).toBe(8);

    const field = getLogFieldLayout();
    expect(field.labelSizePx).toBe(12);
    expect(field.labelLineHeightPx).toBe(18);
    expect(field.inputSizePx).toBe(16);
    expect(field.inputLineHeightPx).toBe(24);
    expect(field.labelAlwaysShrunk).toBe(true);
    expect(field.topOffsetPx).toBe(8);

    const cta = getLogCtaLayout();
    expect(cta.padXPx).toBe(10);
    expect(cta.padYPx).toBe(4);
    expect(cta.radiusPx).toBe(6);
    expect(cta.visualMinHeightPx).toBe(28);

    const entry = getLogEntryCardLayout();
    expect(entry.radiusPx).toBe(8);
    expect(entry.border).toBe("#d1d5dc");
    expect(entry.eyebrowTrackingPx).toBe(-0.75);
    expect(entry.confirmDeleteColor).toBe("#d95c1c");
  });

  it("stat pill: Water total + Electrolytes Taken share the Figma #efefef pill", async () => {
    const { getLogStatPillLayout } = await import("../src/log/layout");
    const pill = getLogStatPillLayout();
    expect(pill.bg).toBe("#efefef");
    expect(pill.radiusPx).toBe(4);
    expect(pill.padXPx).toBe(10);
    expect(pill.padYPx).toBe(6);
    expect(pill.labelColor).toBe("#5c5c60");
    expect(pill.labelSizePx).toBe(14);
    // Water value is the large semibold figure, not the orange accent.
    expect(pill.valueColor).toBe("#1d1b20");
    expect(pill.valueSizePx).toBe(24);
    expect(pill.valueLineHeightPx).toBe(26);
    expect(pill.valueWeight).toBe(600);
    expect(pill.waterWidthPx).toBe(132);
    expect(pill.takenWidthPx).toBe(65);
  });

  it("electrolytes-taken state: disabled field tokens + black notice copy", async () => {
    const { getLogFieldLayout, getLogBlockedMessageLayout } = await import(
      "../src/log/layout"
    );
    const field = getLogFieldLayout();
    expect(field.disabledBg).toBe("#fafafa");
    expect(field.disabledText).toBe("#79747e");

    const notice = getLogBlockedMessageLayout();
    expect(notice.sizePx).toBe(12);
    expect(notice.lineHeightPx).toBe(18);
    expect(notice.color).toBe("#000000");
  });

  it("Taken pill reuses the exported Figma X / check assets", () => {
    for (const icon of ["x-square.svg", "check-square.svg"]) {
      expect(
        existsSync(path.join(process.cwd(), "public", "icons", icon)),
      ).toBe(true);
    }
  });

  it("favicon asset exists under public/", () => {
    expect(
      existsSync(path.join(process.cwd(), "public", "favicon.png")),
    ).toBe(true);
  });
});
