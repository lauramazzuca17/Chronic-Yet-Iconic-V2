import { test, expect } from "@playwright/test";

test.describe("FEAT-004 AC-12 water journey", () => {
  test("Laura opens Log, creates water, sees total, deletes it", async ({
    page,
  }) => {
    const reset = await page.request.post("/api/test/reset-manual-logs");
    expect(reset.ok()).toBeTruthy();

    await page.goto("/login");
    await page.getByLabel("Username").fill("Laura");
    await page.getByLabel("Password").fill("laura-test-secret");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/");

    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Log" }).click();
    await expect(page).toHaveURL("/log");
    await expect(page.getByRole("heading", { name: "Log" })).toBeVisible();

    await page.getByRole("button", { name: "Water", exact: true }).click();
    await page.getByLabel("Add Ounces").fill("8");
    await page.getByRole("button", { name: "Log Water" }).click();

    await expect(page.getByText("Saved.")).toBeVisible();
    await expect(page.getByTestId("water-total")).toHaveText("8 oz");
    const waterEntry = page.getByTestId("log-entry").filter({ hasText: "8 oz" });
    await expect(waterEntry).toBeVisible();

    await waterEntry.getByRole("button", { name: "Delete" }).click();
    await waterEntry.getByRole("button", { name: "Confirm Delete" }).click();

    await expect(page.getByTestId("log-entry")).toHaveCount(0);
    await expect(page.getByTestId("water-total")).toHaveText("0 oz");
  });
});
