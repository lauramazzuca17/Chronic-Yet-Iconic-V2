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

  it.todo("AC-2: Medication Impact card + Compare/with controls (Figma)");
  it.todo("AC-3: Medication impact series slots -2h…+2h");
  it.todo("AC-4: ±15 min closest slot rule; no interpolation");
  it.todo(
    "AC-5: BP = manual systolic; HR = manual BP-log HR + detailed heart_rate"
  );
  it.todo("AC-6: disabled gray untaken meds; multi-dose uses most recent take");
  it.todo("AC-7: tooltips BP / HR");
  it.todo("AC-8: Demo cannot read Laura analytics");
  it.todo("AC-9: Cardiovascular Chart 2 + Chart 3 (REQ-17)");
  it.todo("AC-10: Recovery Chart 4 + Chart 5 (REQ-17)");
  it.todo("AC-11: Electrolytes Lifestyle cards (REQ-20)");
  it.todo("AC-12: Playwright Analytics Medication journey");
});
