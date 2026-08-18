/**
 * FEAT-003 — App shell polish
 * Skeleton: first test active; remaining ACs todo until /tdd-cycle.
 */
import { describe, it, expect } from "vitest";

describe("FEAT-003 shell polish", () => {
  it("AC-1: bottom nav exposes five labeled destinations with bar token", async () => {
    const { getBottomNavChrome } = await import("../src/shell/chrome");
    const chrome = getBottomNavChrome();
    expect(chrome.items.map((i) => i.label)).toEqual([
      "Home",
      "Log",
      "Calendar",
      "Analytics",
      "Import",
    ]);
    expect(chrome.barBackground).toBe("rgba(11, 64, 65, 0.8)");
  });

  it("AC-2: active nav icon uses pill #082E33 @ 80%", async () => {
    const { getActiveNavItemChrome } = await import("../src/shell/chrome");

    const active = getActiveNavItemChrome(true);
    expect(active.showPill).toBe(true);
    expect(active.pillBackground).toBe("rgba(8, 46, 51, 0.8)");
    expect(active.pillBorderRadiusPx).toBe(16);
    expect(active.labelBelowPill).toBe(true);

    const inactive = getActiveNavItemChrome(false);
    expect(inactive.showPill).toBe(false);
    expect(inactive.labelBelowPill).toBe(true);
  });

  it("AC-3: header exposes eyebrow, title, subtitle, Sign out", async () => {
    const { getShellHeaderChrome } = await import("../src/shell/chrome");

    const home = getShellHeaderChrome("/");
    expect(home.eyebrow).toBe("Chronic Yet Iconic");
    expect(home.eyebrowUppercase).toBe(true);
    expect(home.title).toBe("Dashboard");
    expect(home.subtitle).toBe("Take a look around!");
    expect(home.signOutAccessibleName).toBe("Sign out");
    expect(home.signOutColor).toBe("#f08429");

    const log = getShellHeaderChrome("/log");
    expect(log.title).toBe("Log");
    expect(log.subtitle).toBe(
      "Track symptoms, vitals, medications, water, mood and other daily events.",
    );
  });

  it("AC-4: scrolled header uses #0B4041 @ 80%", async () => {
    const { getScrolledHeaderChrome } = await import("../src/shell/chrome");

    const resting = getScrolledHeaderChrome(false);
    expect(resting.sticky).toBe(true);
    expect(resting.background).toBe("transparent");

    const scrolled = getScrolledHeaderChrome(true);
    expect(scrolled.sticky).toBe(true);
    expect(scrolled.background).toBe("rgba(11, 64, 65, 0.8)");
    expect(scrolled.backgroundTransitionMs).toBe(300);
  });

  it("AC-5: nav hrefs map Home→/ title Dashboard and sibling routes", async () => {
    const { getShellNavRoutes } = await import("../src/shell/chrome");
    expect(getShellNavRoutes()).toEqual([
      { label: "Home", href: "/", title: "Dashboard" },
      { label: "Log", href: "/log", title: "Log" },
      { label: "Calendar", href: "/calendar", title: "Calendar" },
      { label: "Analytics", href: "/analytics", title: "Analytics" },
      { label: "Import", href: "/import", title: "Import" },
    ]);
  });

  it("AC-6: shell is phone-first (no desktop shell layout)", async () => {
    const { getPhoneFirstShellLayout } = await import("../src/shell/chrome");
    const layout = getPhoneFirstShellLayout();
    expect(layout.mode).toBe("phone-first");
    expect(layout.hasDesktopShellLayout).toBe(false);
    expect(layout.hasWideShellLayout).toBe(false);
    expect(layout.desktopBreakpointLayouts).toEqual([]);
    expect(layout.maxContentWidthPx).toBe(430);
  });

  it("header layout: Figma type sizes, 16px gutter, logout icon asset", async () => {
    const { getShellHeaderLayout } = await import("../src/shell/chrome");
    const layout = getShellHeaderLayout();
    expect(layout.gutterPx).toBe(16);
    expect(layout.paddingTopPx).toBe(23);
    expect(layout.paddingBottomPx).toBe(20);
    expect(layout.eyebrowFontSizePx).toBe(16);
    expect(layout.eyebrowFontWeight).toBe(300);
    expect(layout.titleFontSizePx).toBe(32);
    expect(layout.titleFontWeight).toBe(900);
    expect(layout.subtitleFontSizePx).toBe(16);
    expect(layout.subtitleFontWeight).toBe(500);
    expect(layout.signOutIconSrc).toBe("/icons/sign-out.svg");
  });

  it("nav layout: 64px bar and label medium tokens", async () => {
    const { getShellNavLayout } = await import("../src/shell/chrome");
    const layout = getShellNavLayout();
    expect(layout.barHeightPx).toBe(64);
    expect(layout.labelFontSizePx).toBe(12);
    expect(layout.iconStateWidthPx).toBe(46);
  });

  it("nav layout: fixed bar so Log (and siblings) stay tappable", async () => {
    const { getShellNavLayout } = await import("../src/shell/chrome");
    const layout = getShellNavLayout();
    expect(layout.position).toBe("fixed");
    expect(layout.zIndex).toBeGreaterThanOrEqual(50);
  });
});
