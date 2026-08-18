import { test, expect, type Page } from "@playwright/test";

async function resetLogs(page: Page) {
  const res = await page.request.post("/api/test/reset-manual-logs");
  expect(res.ok()).toBeTruthy();
}

async function pickMuiSelect(
  page: Page,
  label: string,
  optionName: string
) {
  await page.getByRole("combobox", { name: label }).click();
  await page.getByRole("option", { name: optionName }).click();
}

test.describe("FEAT-005 AC-9 Home summary journey", () => {
  test("Laura with today logs sees Home metrics and electrolytes badge", async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await resetLogs(page);

    await page.goto("/login");
    await page.getByLabel("Username").fill("Laura");
    await page.getByLabel("Password").fill("laura-test-secret");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/");

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Log" })
      .click();
    await expect(page).toHaveURL("/log");

    await page
      .getByRole("button", { name: "Blood Pressure", exact: true })
      .click();
    await page.getByLabel("Systolic").fill("118");
    await page.getByLabel("Diastolic").fill("76");
    await page.getByLabel("HR (bpm)").fill("70");
    await page.getByRole("button", { name: "Log Blood Pressure" }).click();
    await expect(
      page.getByTestId("log-entry").filter({ hasText: "118/76" })
    ).toBeVisible();

    await page.getByRole("button", { name: "Medication", exact: true }).click();
    await pickMuiSelect(page, "Medication", "Midodrine");
    await page.getByLabel("Dose").fill("10 mg");
    await page.getByRole("button", { name: "Log Medication" }).click();

    await page.getByRole("button", { name: "Water", exact: true }).click();
    await page.getByLabel("Add Ounces").fill("8");
    await page.getByRole("button", { name: "Log Water" }).click();

    await page
      .getByRole("button", { name: "Electrolytes", exact: true })
      .click();
    await page.getByRole("button", { name: "Log Electrolytes" }).click();

    await page.getByRole("button", { name: "Symptom", exact: true }).click();
    await pickMuiSelect(page, "Symptom", "Fatigue");
    await page.getByRole("button", { name: "Log Symptom" }).click();

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Home" })
      .click();
    await expect(page).toHaveURL("/");

    await expect(page.getByTestId("dashboard-bp-count")).toHaveText("1");
    await expect(page.getByTestId("dashboard-bp-latest")).toHaveText("118/76");
    await expect(page.getByTestId("dashboard-meds-count")).toHaveText("1");
    await expect(page.getByTestId("dashboard-water-total")).toHaveText("8oz");
    await expect(page.getByTestId("dashboard-electrolytes-badge")).toHaveAttribute(
      "data-taken",
      "true"
    );
    await expect(page.getByTestId("dashboard-symptoms-count")).toHaveText("1");
    await expect(page.getByText("Health records")).toHaveCount(0);
  });
});
