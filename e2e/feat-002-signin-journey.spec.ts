import { test, expect } from "@playwright/test";

test.describe("FEAT-002 AC-8 sign-in journey", () => {
  test("Laura signs in, lands on Dashboard, signs out, then shell requires login", async ({
    page,
  }) => {
    // Warm file DB migrate/seed before first login (cold start otherwise stalls Sign In).
    const warm = await page.request.post("/api/test/reset-manual-logs");
    expect(warm.ok()).toBeTruthy();

    await page.goto("/login");

    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
    await page.getByLabel("Username").fill("Laura");
    await page.getByLabel("Password").fill("laura-test-secret");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page).toHaveURL("/", { timeout: 30_000 });
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL("/login");

    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });
});
