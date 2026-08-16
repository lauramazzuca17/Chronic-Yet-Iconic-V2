/**
 * Login visual fidelity — layout tokens from Figma + design brief
 * (fluid card: 38px side margins; pond image; wordmark/CTA/error chrome).
 */
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import path from "node:path";

describe("Login visual fidelity", () => {
  it("layout: fluid card uses 38px side margins (not fixed 314px width)", async () => {
    const { getLoginPageLayout } = await import("../src/auth/login-page");
    const layout = getLoginPageLayout();

    expect(layout.sideMarginPx).toBe(38);
    expect(layout.cardWidth).toBe("fluid");
    expect(layout.fixedCardWidthPx).toBeNull();
  });

  it("layout: pond background asset path exists under public/", async () => {
    const { getLoginPageLayout } = await import("../src/auth/login-page");
    const layout = getLoginPageLayout();

    expect(layout.pondBackgroundSrc).toMatch(/^\/images\/login-pond\.(png|jpg|webp)$/);
    const filePath = path.join(process.cwd(), "public", layout.pondBackgroundSrc.replace(/^\//, ""));
    expect(existsSync(filePath)).toBe(true);
  });

  it("layout: card radius, padding, stack, koi, and CTA match brief", async () => {
    const { getLoginPageLayout } = await import("../src/auth/login-page");
    const layout = getLoginPageLayout();

    expect(layout.cardBorderRadiusPx).toBe(22);
    expect(layout.cardPaddingTopPx).toBe(19);
    expect(layout.cardPaddingBottomPx).toBe(23);
    expect(layout.cardPaddingXPx).toBe(28);
    expect(layout.stackGapPx).toBe(10);
    expect(layout.fieldGapPx).toBe(16);
    expect(layout.mainPaddingTopPx).toBe(0);
    expect(layout.locksToViewport).toBe(true);
    expect(layout.stackOffsetYPx).toBe(20);
    expect(layout.reserveKoiSlot).toBe(true);
    expect(layout.koiSizePx).toBe(177);
    expect(layout.koiGapFromCardPx).toBe(10);
    expect(layout.ctaFullWidth).toBe(false);
    expect(layout.ctaBorderRadiusPx).toBe(100);
    expect(layout.ctaBackground).toBe("#f08429");
    expect(layout.ctaPaddingXPx).toBe(16);
    expect(layout.ctaPaddingYPx).toBe(4);
    expect(layout.ctaFontWeight).toBe(500);
    expect(layout.ctaFontSizePx).toBe(14);
    expect(layout.fieldHeightPx).toBe(56);
    expect(layout.fieldBorderRadiusPx).toBe(4);
    expect(layout.fieldPaddingXPx).toBe(12);
    expect(layout.fieldLabelSizePx).toBe(12);
    expect(layout.fieldInputSizePx).toBe(16);
    expect(layout.fieldLabelAlwaysShrunk).toBe(true);
    expect(layout.errorColor).toBe("#d95c1c");
    expect(layout.errorFontSizePx).toBe(12);
    expect(layout.wordmark.fontFamily).toBe("DM Sans");
    expect(layout.wordmark.chronicIconicWeight).toBe(200);
    expect(layout.wordmark.yetWeight).toBe(500);
    expect(layout.wordmark.yetItalic).toBe(true);
    expect(layout.wordmark.yetColor).toBe("#367057");
    expect(layout.wordmark.sizePx).toBe(28);
    expect(layout.wordmark.lineHeightPx).toBe(36);
  });
});
