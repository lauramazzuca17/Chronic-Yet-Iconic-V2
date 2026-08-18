/**
 * Shared TakenBadge — Home water card and Log electrolytes use one pill.
 */
import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";

describe("TakenBadge", () => {
  it("tokens match the Figma #efefef 65px Taken pill", async () => {
    const { TAKEN_BADGE } = await import("../src/components/taken-badge");
    expect(TAKEN_BADGE.bg).toBe("#efefef");
    expect(TAKEN_BADGE.radiusPx).toBe(4);
    expect(TAKEN_BADGE.widthPx).toBe(65);
    expect(TAKEN_BADGE.padXPx).toBe(10);
    expect(TAKEN_BADGE.padYPx).toBe(6);
    expect(TAKEN_BADGE.gapPx).toBe(2);
    expect(TAKEN_BADGE.labelColor).toBe("#5c5c60");
    expect(TAKEN_BADGE.labelSizePx).toBe(14);
    expect(TAKEN_BADGE.labelLineHeightPx).toBe(18);
    expect(TAKEN_BADGE.iconSizePx).toBe(22);
    expect(TAKEN_BADGE.checkSrc).toBe("/icons/check-square.svg");
    expect(TAKEN_BADGE.xSrc).toBe("/icons/x-square.svg");
  });

  it("Home DashboardScreen and Log electrolytes both import TakenBadge", async () => {
    const home = await readFile(
      new URL("../src/dashboard/DashboardScreen.tsx", import.meta.url),
      "utf8",
    );
    const log = await readFile(
      new URL("../src/log/LogScreen.tsx", import.meta.url),
      "utf8",
    );
    expect(home).toContain('from "@/components/TakenBadge"');
    expect(home).not.toContain("function TakenBadge");
    expect(log).toContain('from "@/components/TakenBadge"');
    expect(log).toContain("<TakenBadge");
    expect(log).toContain('testId="electrolyte-taken"');
  });
});
