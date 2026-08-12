import { test, expect } from "@playwright/test";

test.describe("FEAT-003 AC-7 shell nav journey", () => {
  test("signed-in user sees bottom nav, opens Log, sees Log title, signs out", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Username").fill("Laura");
    await page.getByLabel("Password").fill("laura-test-secret");
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page).toHaveURL("/");

    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Home" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Log" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Calendar" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Analytics" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Import" })).toBeVisible();

    await nav.getByRole("link", { name: "Log" }).click();
    await expect(page).toHaveURL("/log");
    await expect(page.getByRole("heading", { name: "Log" })).toBeVisible();

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL("/login");
  });
});
