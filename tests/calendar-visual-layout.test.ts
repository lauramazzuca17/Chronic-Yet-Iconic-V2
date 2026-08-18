/**
 * Calendar visual layout — FEAT-006 month card + day list shell.
 */
import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";

describe("Calendar visual layout", () => {
  it("full-width cards are border-box so the 16px side gutters survive", async () => {
    const { getCalendarCardSx, getCalendarLayout } = await import(
      "../src/calendar/layout"
    );
    const card = getCalendarCardSx();
    // Regression: width 100% + content-box padding pushed both cards 16px past
    // the right edge of the viewport.
    expect(card.width).toBe("100%");
    expect(card.boxSizing).toBe("border-box");
    expect(getCalendarLayout().gutterPx).toBe(16);
  });

  it("tokens.css sets global box-sizing: border-box", async () => {
    const css = await readFile(
      new URL("../src/styles/tokens.css", import.meta.url),
      "utf8",
    );
    expect(css).toMatch(
      /\*\s*,[\s\S]*\*::before[\s\S]*\*::after[\s\S]*box-sizing:\s*border-box/,
    );
    const root = await readFile(
      new URL("../src/app/layout.tsx", import.meta.url),
      "utf8",
    );
    expect(root).toContain("@/styles/tokens.css");
  });

  it("month card has extra top padding to clear the Month/Year field labels", async () => {
    const { getCalendarLayout } = await import("../src/calendar/layout");
    const layout = getCalendarLayout();
    expect(layout.monthCardPadTopPx).toBeGreaterThan(layout.cardPadPx);
    expect(layout.monthCardPadTopPx).toBe(24);
  });

  it("Month/Year picker fits a 320px viewport without truncating the year", async () => {
    const { getCalendarLayout, getCalendarPickerLayout } = await import(
      "../src/calendar/layout"
    );
    const layout = getCalendarLayout();
    const picker = getCalendarPickerLayout();
    const inner320 =
      320 - layout.gutterPx * 2 - layout.cardPadPx * 2;
    const used =
      picker.chevronVisualPx * 2 +
      picker.rowGapPx * 2 +
      picker.fieldGapPx +
      picker.yearMinWidthPx +
      picker.monthMinWidthPx;
    expect(used).toBeLessThanOrEqual(inner320);
    expect(picker.yearMinWidthPx).toBeGreaterThanOrEqual(88);
    expect(picker.chevronHitPx).toBeGreaterThanOrEqual(44);
    expect(picker.chevronVisualPx).toBeLessThan(picker.chevronHitPx);

    const source = await readFile(
      new URL("../src/calendar/CalendarScreen.tsx", import.meta.url),
      "utf8",
    );
    expect(source).toContain("CALENDAR_PICKER");
    expect(source).toContain("yearMinWidthPx");
    expect(source).not.toContain("minWidth: 44");
  });

  it("day list reuses the Log entry card so both lists cannot drift", async () => {
    const source = await readFile(
      new URL("../src/calendar/CalendarScreen.tsx", import.meta.url),
      "utf8"
    );
    expect(source).toContain('from "@/log/LogEntryCard"');
    expect(source).toContain('testId="calendar-entry"');
    // The bespoke copies of the Log formatting/markup must be gone.
    expect(source).not.toContain("function entrySummary");
    expect(source).not.toContain("function entryTimeLabel");
    expect(source).not.toContain("SEVERITY_LABEL");
  });

  it("day cell: selected is a brand6 rounded square, today is underlined", async () => {
    const { getCalendarDayLayout } = await import("../src/calendar/layout");
    const day = getCalendarDayLayout();
    expect(day.visualSizePx).toBe(40);
    expect(day.radiusPx).toBe(8);
    expect(day.selectedBg).toBe("#f08429");
    expect(day.selectedColor).toBe("#f5f5f5");
    expect(day.inMonthColor).toBe("#1e1e1e");
    expect(day.outOfMonthColor).toBe("#b3b3b3");
    expect(day.fontSizePx).toBe(16);
    // Today is the underlined number (Figma), not a teal cell border.
    expect(day.todayDecoration).toBe("underline");
  });

  it("day cell keeps a 44px hit target around the 40px Figma visual", async () => {
    const { getCalendarDayLayout } = await import("../src/calendar/layout");
    const day = getCalendarDayLayout();
    expect(day.hitTargetPx).toBeGreaterThanOrEqual(44);
    expect(day.hitTargetPx).toBeGreaterThan(day.visualSizePx);
  });

  it("leading and trailing out-of-month cells both show greyed numbers", async () => {
    const { buildMonthGrid } = await import("../src/calendar/selection");
    const { getCalendarDayLayout } = await import("../src/calendar/layout");
    // August 2026 starts on a Saturday, so there are 6 leading cells.
    const grid = buildMonthGrid(2026, 8);

    const firstIndex = grid.findIndex((c) => c.calendarDate === "2026-08-01");
    const leading = grid.slice(0, firstIndex);
    // Owner decision: leading cells carry the previous month's numbers, not blanks.
    expect(leading).toHaveLength(6);
    expect(leading.every((c) => !c.inMonth)).toBe(true);
    expect(leading.map((c) => c.dayOfMonth)).toEqual([26, 27, 28, 29, 30, 31]);

    const lastIndex = grid.findIndex((c) => c.calendarDate === "2026-08-31");
    const trailing = grid.slice(lastIndex + 1);
    expect(trailing.length).toBeGreaterThan(0);
    expect(trailing.every((c) => !c.inMonth)).toBe(true);

    // Both ends share one muted colour.
    expect(getCalendarDayLayout().outOfMonthColor).toBe("#b3b3b3");
  });

  it("weekday header uses the Figma secondary grey at 12px", async () => {
    const { getCalendarDayLayout } = await import("../src/calendar/layout");
    const day = getCalendarDayLayout();
    expect(day.weekdayColor).toBe("#757575");
    expect(day.weekdayFontSizePx).toBe(12);
  });

  it("card shell keeps the Figma radius, fill, and shadow", async () => {
    const { getCalendarCardSx, getCalendarLayout } = await import(
      "../src/calendar/layout"
    );
    const layout = getCalendarLayout();
    const card = getCalendarCardSx();
    expect(layout.cardRadiusPx).toBe(20);
    expect(card.bgcolor).toBe("#FFFFFF");
    expect(card.borderRadius).toBe("20px");
    expect(card.boxShadow).toContain("rgba(12,12,13,0.05)");
  });
});
