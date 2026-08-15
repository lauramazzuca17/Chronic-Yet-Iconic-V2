import { test, expect, type Page } from "@playwright/test";
import { join } from "node:path";

const fixtures = join(process.cwd(), "fixtures", "import");
const summaryPath = join(fixtures, "health_export_summary_20260810.csv");
const detailedPath = join(fixtures, "health_export_detailed_20260810.csv");

async function resetImports(page: Page) {
  const res = await page.request.post("/api/test/reset-imports");
  expect(res.ok()).toBeTruthy();
}

test.describe("FEAT-007 AC-8 Import journey", () => {
  test("Laura uploads fixture pair, then batch-deletes it", async ({ page }) => {
    test.setTimeout(90_000);
    await resetImports(page);

    await page.goto("/login");
    await page.getByLabel("Username").fill("Laura");
    await page.getByLabel("Password").fill("laura-test-secret");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/");

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Import" })
      .click();
    await expect(page).toHaveURL("/import");
    await expect(page.getByRole("heading", { name: "Import", exact: true })).toBeVisible();
    await expect(
      page.getByText(
        "Upload Apple Health export files to populate your health database."
      )
    ).toBeVisible();

    await page.getByTestId("import-summary-input").setInputFiles(summaryPath);
    await page.getByTestId("import-detailed-input").setInputFiles(detailedPath);
    await expect(page.getByTestId("import-summary-filename")).toContainText(
      "health_export_summary_20260810.csv"
    );
    await expect(page.getByTestId("import-detailed-filename")).toContainText(
      "health_export_detailed_20260810.csv"
    );

    await page.getByTestId("import-start").click();
    await expect(page.getByTestId("import-feedback")).toContainText(
      "Import finished —"
    );
    await expect(page.getByTestId("import-record-count")).not.toHaveText(
      "0 health records stored."
    );
    await expect(page.getByTestId("import-batch")).toHaveCount(2);
    await expect(
      page.getByTestId("import-batch-filename").filter({
        hasText: "health_export_detailed_20260810.csv",
      })
    ).toBeVisible();
    await expect(
      page.getByTestId("import-batch-filename").filter({
        hasText: "health_export_summary_20260810.csv",
      })
    ).toBeVisible();

    // Per-file delete: remove both cards (wait for refresh between each)
    for (let remaining = 2; remaining >= 1; remaining -= 1) {
      const batch = page.getByTestId("import-batch").first();
      await batch.getByRole("button", { name: "Delete" }).click();
      await batch.getByRole("button", { name: "Delete this import?" }).click();
      await expect(page.getByTestId("import-batch")).toHaveCount(remaining - 1);
    }
    await expect(page.getByTestId("import-record-count")).toHaveText(
      "0 health records stored."
    );
  });
});
