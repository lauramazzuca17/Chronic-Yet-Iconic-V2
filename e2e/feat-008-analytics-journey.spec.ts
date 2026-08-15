import { test, expect } from "@playwright/test";

test.describe("FEAT-008 AC-12 Analytics Medication journey", () => {
  test("Laura opens Analytics Medication, uses date/metric, sees chart area", async ({
    page,
  }) => {
    test.setTimeout(90_000);
    const reset = await page.request.post("/api/test/reset-manual-logs");
    expect(reset.ok()).toBeTruthy();

    await page.goto("/login");
    await page.getByLabel("Username").fill("Laura");
    await page.getByLabel("Password").fill("laura-test-secret");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/");

    // Log a medication so Compare med is selectable
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Log" })
      .click();
    await expect(page).toHaveURL("/log");
    await page.getByRole("button", { name: "Medication", exact: true }).click();
    await page.getByLabel("Medication").click();
    await page.getByRole("option", { name: "Propranolol" }).click();
    await page.getByLabel("Dose").fill("10mg");
    await page.getByRole("button", { name: "Log Medication" }).click();
    await expect(page.getByText("Saved.")).toBeVisible();
    await expect(
      page.getByTestId("log-entry").filter({ hasText: "Propranolol" })
    ).toBeVisible({ timeout: 15_000 });

    await page.goto("/analytics");
    await expect(page).toHaveURL(/\/analytics$/);
    await expect(
      page.getByRole("heading", { name: "Analytics", exact: true })
    ).toBeVisible();
    await expect(
      page.getByText(
        "Compare how different factors impact your health over time."
      )
    ).toBeVisible();

    await expect(page.getByTestId("analytics-tab-medication")).toHaveAttribute(
      "aria-selected",
      "true"
    );
    await expect(page.getByTestId("analytics-medication-card")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Medication Impact" })
    ).toBeVisible();
    await expect(page.getByTestId("analytics-med-date")).toBeVisible();
    await expect(page.getByTestId("analytics-med-chart")).toBeVisible();

    const dateBefore = await page.getByTestId("analytics-med-date").innerText();
    await page.getByTestId("analytics-med-prev-day").click();
    await expect(page.getByTestId("analytics-med-date")).not.toHaveText(
      dateBefore
    );
    await page.getByTestId("analytics-med-next-day").click();
    await expect(page.getByTestId("analytics-med-date")).toHaveText(dateBefore);

    await page.getByTestId("analytics-metric-select").click();
    await page.getByRole("option", { name: "BP" }).click();
    await expect(page.getByTestId("analytics-med-chart")).toBeVisible();
    await expect(page.getByTestId("analytics-med-slot-Dose")).toBeVisible();
  });
});
