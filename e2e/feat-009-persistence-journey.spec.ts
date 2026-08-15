import { test, expect, type Page } from "@playwright/test";
import { join } from "node:path";

const fixtures = join(process.cwd(), "fixtures", "import");
const summaryPath = join(fixtures, "health_export_summary_20260810.csv");
const detailedPath = join(fixtures, "health_export_detailed_20260810.csv");

async function resetAll(page: Page) {
  const logs = await page.request.post("/api/test/reset-manual-logs");
  expect(logs.ok()).toBeTruthy();
  const imports = await page.request.post("/api/test/reset-imports");
  expect(imports.ok()).toBeTruthy();
}

test.describe("FEAT-009 AC-11 persistence journey", () => {
  test("Laura water survives reload; pair import two cards; delete one file", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await resetAll(page);

    await page.goto("/login");
    await page.getByLabel("Username").fill("Laura");
    await page.getByLabel("Password").fill("laura-test-secret");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/");

    // Water → reload still shows it (file DB persistence)
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Log" })
      .click();
    await expect(page).toHaveURL("/log");

    await page.getByRole("button", { name: "Water", exact: true }).click();
    await page.getByLabel("Add Ounces").fill("8");
    await page.getByRole("button", { name: "Log Water" }).click();
    await expect(page.getByText("Saved.")).toBeVisible();
    await expect(page.getByTestId("water-total")).toHaveText("8 oz");

    await page.reload();
    await expect(
      page.getByTestId("log-entry").filter({ hasText: "8 oz" })
    ).toBeVisible();
    await page.getByRole("button", { name: "Water", exact: true }).click();
    await expect(page.getByTestId("water-total")).toHaveText("8 oz");

    // Pair import → two history cards
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Import" })
      .click();
    await expect(page).toHaveURL("/import");

    await page.getByTestId("import-summary-input").setInputFiles(summaryPath);
    await page.getByTestId("import-detailed-input").setInputFiles(detailedPath);
    await page.getByTestId("import-start").click();
    await expect(page.getByTestId("import-feedback")).toContainText(
      "Import finished —"
    );
    await expect(page.getByTestId("import-batch")).toHaveCount(2);
    const countAfterImport = await page
      .getByTestId("import-record-count")
      .innerText();
    expect(countAfterImport).not.toBe("0 health records stored.");

    // Delete only the detailed file → sibling summary remains
    const detailedCard = page.getByTestId("import-batch").filter({
      has: page.getByTestId("import-batch-filename").filter({
        hasText: "health_export_detailed_20260810.csv",
      }),
    });
    await detailedCard.getByRole("button", { name: "Delete" }).click();
    await detailedCard
      .getByRole("button", { name: "Delete this import?" })
      .click();
    await expect(page.getByTestId("import-batch")).toHaveCount(1);
    await expect(
      page.getByTestId("import-batch-filename").filter({
        hasText: "health_export_summary_20260810.csv",
      })
    ).toBeVisible();
    await expect(
      page.getByTestId("import-batch-filename").filter({
        hasText: "health_export_detailed_20260810.csv",
      })
    ).toHaveCount(0);
    await expect(page.getByTestId("import-record-count")).not.toHaveText(
      countAfterImport
    );
    await expect(page.getByTestId("import-record-count")).not.toHaveText(
      "0 health records stored."
    );

    // Reload — sibling file still present
    await page.reload();
    await expect(page.getByTestId("import-batch")).toHaveCount(1);
    await expect(
      page.getByTestId("import-batch-filename").filter({
        hasText: "health_export_summary_20260810.csv",
      })
    ).toBeVisible();
  });
});
