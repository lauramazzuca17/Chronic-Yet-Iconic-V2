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

test.describe("FEAT-004 remaining Log create forms", () => {
  test("Laura can create symptom, BP, med, electrolytes, mood, and event", async ({
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

    // Symptom (default chip)
    await page.getByRole("button", { name: "Symptom", exact: true }).click();
    await pickMuiSelect(page, "Symptom", "Fatigue");
    await pickMuiSelect(page, "Severity", "Normal amount");
    await page.getByRole("button", { name: "Log Symptom" }).click();
    await expect(page.getByText("Saved.")).toBeVisible();
    await expect(
      page.getByTestId("log-entry").filter({ hasText: "Fatigue" })
    ).toBeVisible();

    // Blood pressure
    await page
      .getByRole("button", { name: "Blood pressure", exact: true })
      .click();
    await page.getByLabel("Systolic").fill("120");
    await page.getByLabel("Diastolic").fill("80");
    await page.getByLabel("HR (bpm)").fill("72");
    await page.getByRole("button", { name: "Log Blood Pressure" }).click();
    await expect(
      page.getByTestId("log-entry").filter({ hasText: "120/80" })
    ).toBeVisible();

    // Medication
    await page.getByRole("button", { name: "Medication", exact: true }).click();
    await pickMuiSelect(page, "Medication", "Midodrine");
    await page.getByLabel("Dose").fill("10 mg");
    await page.getByRole("button", { name: "Log Medication" }).click();
    await expect(
      page.getByTestId("log-entry").filter({ hasText: "Midodrine" })
    ).toBeVisible();

    // Electrolytes
    await page
      .getByRole("button", { name: "Electrolytes", exact: true })
      .click();
    await expect(page.getByTestId("electrolyte-taken")).toHaveText("Taken");
    await page.getByRole("button", { name: "Log Electrolytes" }).click();
    await expect(
      page.getByTestId("log-entry").filter({ hasText: "Taken" })
    ).toBeVisible();

    // Mood
    await page.getByRole("button", { name: "Mood", exact: true }).click();
    await pickMuiSelect(page, "Mood", "Okay");
    await page.getByRole("button", { name: "Log Mood" }).click();
    await expect(
      page.getByTestId("log-entry").filter({ hasText: "Okay" })
    ).toBeVisible();

    // Event
    await page.getByRole("button", { name: "Event", exact: true }).click();
    await page.getByPlaceholder("e.g. Walked 10 miles").fill("Walked 10 miles");
    await page.getByRole("button", { name: "Log Event" }).click();
    await expect(
      page.getByTestId("log-entry").filter({ hasText: "Walked 10 miles" })
    ).toBeVisible();

    await expect(page.getByTestId("log-entry")).toHaveCount(6);
  });
});
