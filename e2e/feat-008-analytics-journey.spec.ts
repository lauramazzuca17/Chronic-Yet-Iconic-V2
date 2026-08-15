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

    // Remaining tabs (UI finish)
    await page.getByTestId("analytics-tab-cardiovascular").click();
    await expect(
      page.getByRole("heading", { name: "Blood Pressure and Heart Rate" })
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: "Tachycardia Burden" })
    ).toBeVisible();
    await expect(page.getByTestId("analytics-cardio-chart2")).toBeVisible();
    await expect(page.getByTestId("analytics-cardio-chart3")).toBeVisible();
    await page.getByTestId("analytics-cardio-range-last_7").click();
    await expect(page.getByTestId("analytics-cardio-range-last_7")).toHaveAttribute(
      "aria-pressed",
      "true"
    );

    await page.getByTestId("analytics-tab-recovery").click();
    await expect(
      page.getByRole("heading", { name: "Heart Rate Variability" })
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByRole("heading", { name: "Average Walking Heart Rate" })
    ).toBeVisible();
    await expect(page.getByTestId("analytics-hrv-chart")).toBeVisible();
    await expect(page.getByTestId("analytics-walking-chart")).toBeVisible();
    await expect(page.getByTestId("analytics-hrv-info")).toBeVisible();

    await page.getByTestId("analytics-tab-electrolytes").click();
    await expect(page.getByTestId("analytics-electrolytes-panel")).toBeVisible({
      timeout: 15_000,
    });
    await expect(
      page.getByRole("heading", { name: "Electrolytes", exact: true })
    ).toBeVisible();
  });
});

test.describe("FEAT-008 Analytics electrolytes UI", () => {
  test("With/Without cards appear after electrolytes log", async ({ page }) => {
    test.setTimeout(90_000);
    const reset = await page.request.post("/api/test/reset-manual-logs");
    expect(reset.ok()).toBeTruthy();

    await page.goto("/login");
    await page.getByLabel("Username").fill("Laura");
    await page.getByLabel("Password").fill("laura-test-secret");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/");

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Log" })
      .click();
    await page.getByRole("button", { name: "Electrolytes", exact: true }).click();
    await page.getByRole("button", { name: "Log Electrolytes" }).click();
    await expect(page.getByText("Saved.")).toBeVisible();

    await page.goto("/analytics");
    await page.getByTestId("analytics-tab-electrolytes").click();
    await expect(page.getByTestId("analytics-electrolytes-with")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId("analytics-electrolytes-without")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "With Electrolytes" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Without Electrolytes" })
    ).toBeVisible();
  });
});
