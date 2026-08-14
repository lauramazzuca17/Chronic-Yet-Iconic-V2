import { test, expect, type Page } from "@playwright/test";

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** America/New_York calendar date `YYYY-MM-DD` for `date`. */
function calendarDateInNewYork(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function shiftCalendarDate(ymd: string, deltaDays: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + deltaDays, 12));
  return `${dt.getUTCFullYear()}-${pad2(dt.getUTCMonth() + 1)}-${pad2(dt.getUTCDate())}`;
}

async function resetLogs(page: Page) {
  const res = await page.request.post("/api/test/reset-manual-logs");
  expect(res.ok()).toBeTruthy();
}

test.describe("FEAT-006 AC-8 Calendar past-day journey", () => {
  test("Laura logs a past day, reviews it on Calendar, deletes it", async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await resetLogs(page);

    const today = calendarDateInNewYork();
    const pastDate = shiftCalendarDate(today, -1);
    const pastLocal = `${pastDate}T10:00`;

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

    await page.getByRole("button", { name: "Water", exact: true }).click();
    await page.getByLabel("Date & Time").fill(pastLocal);
    await page.getByLabel("Add Ounces").fill("8");
    await page.getByRole("button", { name: "Log Water" }).click();
    await expect(page.getByText("Saved.")).toBeVisible();

    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Calendar" })
      .click();
    await expect(page).toHaveURL(/\/calendar/);
    await expect(page.getByRole("heading", { name: "Calendar" })).toBeVisible();
    await expect(
      page.getByText("Select a day to review everything you logged.")
    ).toBeVisible();

    await page.getByTestId(`calendar-day-${pastDate}`).click();
    await expect(page).toHaveURL(new RegExp(`date=${pastDate}`));
    await expect(page.getByTestId("calendar-day-heading")).not.toHaveText(
      "Today"
    );
    await expect(page.getByTestId("calendar-entries-count")).toHaveText(
      "1 logged entries"
    );
    const entry = page.getByTestId("calendar-entry").filter({ hasText: "8 oz" });
    await expect(entry).toBeVisible();

    await entry.getByRole("button", { name: "Delete" }).click();
    await entry.getByRole("button", { name: "Confirm Delete" }).click();

    await expect(page.getByTestId("calendar-entry")).toHaveCount(0);
    await expect(page.getByTestId("calendar-entries-count")).toHaveText(
      "0 logged entries"
    );
  });
});
