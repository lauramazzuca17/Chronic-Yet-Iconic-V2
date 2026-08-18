/**
 * Home dashboard visual layout — 16px gutters, fluid cards (no fixed 170).
 */
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";

describe("Home visual layout", () => {
  it("shell content gutter is 16px (Figma Home, not login 38px)", async () => {
    const { SHELL_CONTENT_GUTTER_PX, getShellHeaderLayout } = await import(
      "../src/shell/chrome"
    );
    expect(SHELL_CONTENT_GUTTER_PX).toBe(16);
    expect(getShellHeaderLayout().gutterPx).toBe(16);
  });

  it("nav and sign-out Figma icons exist under public/icons", () => {
    const files = [
      "nav-home.svg",
      "nav-log.svg",
      "nav-calendar.svg",
      "nav-analytics.svg",
      "nav-import.svg",
      "sign-out.svg",
      "x-square.svg",
      "check-square.svg",
    ];
    for (const name of files) {
      expect(
        existsSync(path.join(process.cwd(), "public", "icons", name)),
      ).toBe(true);
    }
  });
});
