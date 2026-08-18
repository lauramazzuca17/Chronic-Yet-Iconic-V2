import { defineConfig, devices } from "@playwright/test";
import { join } from "node:path";

const PORT = 3111;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: `npx next dev --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      // E2E resets manual logs and re-seeds account password hashes, so it must
      // never reach the real Turso DB. Blanking these keeps resolveDbMode() on
      // the local-file path (@next/env leaves already-set vars alone), which is
      // what the persistence journey assumes anyway.
      TURSO_DATABASE_URL: "",
      TURSO_AUTH_TOKEN: "",
      CYI_LOCAL_DB_PATH: join(process.cwd(), ".data", "e2e.db"),
      SEED_PASSWORD_LAURA: "laura-test-secret",
      SEED_PASSWORD_DEMO: "demo-test-secret",
      SESSION_SECRET: "test-session-secret-at-least-32-chars!!",
      ALLOW_TEST_RESET: "1",
    },
  },
});
