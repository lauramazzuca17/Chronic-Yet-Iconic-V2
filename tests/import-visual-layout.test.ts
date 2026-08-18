/**
 * Import visual layout — Figma Main `62946:4425` / page `62939:4277`.
 */
import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

describe("Import visual layout", () => {
  it("upload + history cards match Figma 62946:4425", async () => {
    const { getImportLayout } = await import("../src/import/layout");
    const i = getImportLayout();
    expect(i.panelGapPx).toBe(10);
    expect(i.padXPx).toBe(16);
    expect(i.upload.radiusPx).toBe(8);
    expect(i.upload.padXPx).toBe(18);
    expect(i.upload.padYPx).toBe(16);
    expect(i.upload.gapPx).toBe(16);
    expect(i.titleSizePx).toBe(20);
    expect(i.titleLineHeightPx).toBe(28);
    expect(i.titleWeight).toBe(600);
    expect(i.helperColor).toBe("#71717b");
    expect(i.pickerGapPx).toBe(28);
    expect(i.choose.visualHeightPx).toBe(28);
    expect(i.choose.border).toBe("#d1d1d6");
    expect(i.start.visualHeightPx).toBe(34);
    expect(i.start.bg).toBe("#f08429");
    expect(i.history.radiusPx).toBe(12);
    expect(i.history.padTopPx).toBe(10);
    expect(i.history.padBottomPx).toBe(18);
    expect(i.summary.bg).toBe("#f2f5ed");
    expect(i.summary.titleColor).toBe("#367057");
    expect(i.summary.iconDrawWidthPx).toBe(18);
    expect(i.summary.iconDrawHeightPx).toBe(24);
    expect(i.summary.iconSrc).toBe("/icons/file-waveform.svg");
    expect(i.batch.badgeCompleted).toBe("#b7cc87");
    expect(i.batch.badgeProcessing).toBe("#ffdb9c");
    expect(i.batch.badgeFailed).toBe("#ff8c5a");
    expect(i.batch.confirmDeleteColor).toBe("#d95c1c");
    expect(i.filename.textOverflow).toBe("ellipsis");
    expect(i.filename.overflow).toBe("hidden");
    expect(i.filename.whiteSpace).toBe("nowrap");
    expect(
      existsSync(path.join(process.cwd(), "public", "icons", "file-waveform.svg"))
    ).toBe(true);
  });

  it("ImportScreen uses IMPORT layout tokens", async () => {
    const source = await readFile(
      new URL("../src/import/ImportScreen.tsx", import.meta.url),
      "utf8"
    );
    expect(source).toContain("IMPORT");
    expect(source).toContain("IMPORT.summary.iconSrc");
    expect(source).toContain("IMPORT.filename");
    expect(source).toContain("import-upload-card");
    expect(source).toContain("import-database-summary");
    expect(source).not.toContain("minHeight: 44");
  });
});
