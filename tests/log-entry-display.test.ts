/**
 * Log entry card copy/format — Figma entry card `62811:25282`.
 */
import { describe, it, expect } from "vitest";
import {
  formatEntryEyebrow,
  formatEntrySummary,
  formatEntryTimeLabel,
} from "../src/log/entry-display";
import type { ManualLogEntry } from "../src/log/store";

describe("formatEntryTimeLabel", () => {
  it("formats morning wall-clock time with AM", () => {
    expect(formatEntryTimeLabel("2026-08-17T08:12:00")).toBe("8:12 AM");
  });

  it("formats afternoon wall-clock time with PM", () => {
    expect(formatEntryTimeLabel("2026-08-17T16:33:00")).toBe("4:33 PM");
  });

  it("formats noon as 12 PM", () => {
    expect(formatEntryTimeLabel("2026-08-17T12:00:00")).toBe("12:00 PM");
  });
});

describe("formatEntryEyebrow", () => {
  it("uses uppercase type and double space before time (Figma)", () => {
    expect(
      formatEntryEyebrow("Symptom", "2026-08-17T08:12:00")
    ).toBe("SYMPTOM  8:12 AM");
  });
});

describe("formatEntrySummary", () => {
  it("symptom includes severity label", () => {
    const entry: ManualLogEntry = {
      id: "1",
      type: "symptom",
      accountId: "acct-1",
      recordedAt: "2026-08-17T08:12:00",
      symptomName: "Fatigue",
      severity: "usual",
      notes: null,
      createdAt: "2026-08-17T08:12:00",
    };
    expect(formatEntrySummary(entry)).toBe("Fatigue - Normal amount");
  });

  it("blood pressure uses dash + bpm", () => {
    const entry: ManualLogEntry = {
      id: "2",
      type: "blood_pressure",
      accountId: "acct-1",
      recordedAt: "2026-08-17T08:12:00",
      systolic: 100,
      diastolic: 75,
      heartRate: 100,
      createdAt: "2026-08-17T08:12:00",
    };
    expect(formatEntrySummary(entry)).toBe("100/75 - 100 bpm");
  });
});
