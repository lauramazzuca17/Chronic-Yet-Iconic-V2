import { describe, it, expect, vi } from "vitest";

describe("FEAT-001 auth + app shell", () => {
  it("AC-1: unauthenticated access to protected routes is blocked", async () => {
    const { getProtectedDashboard } = await import("../src/auth/session");
    const result = await getProtectedDashboard({ session: null });
    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
  });

  it("AC-2: Laura can sign in with valid credentials", async () => {
    vi.resetModules();
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { signIn, getProtectedDashboard } = await import("../src/auth/session");
    const auth = await signIn({
      username: "Laura",
      password: "laura-test-secret",
    });

    expect(auth.ok).toBe(true);
    if (!auth.ok) return;
    expect(auth.session.username).toBe("Laura");

    const dash = await getProtectedDashboard({ session: auth.session });
    expect(dash.ok).toBe(true);
    expect(dash.status).toBe(200);
  });

  it("AC-3: Demo can sign in with valid credentials", async () => {
    vi.resetModules();
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { signIn, getProtectedDashboard } = await import("../src/auth/session");
    const auth = await signIn({
      username: "Demo",
      password: "demo-test-secret",
    });

    expect(auth.ok).toBe(true);
    if (!auth.ok) return;
    expect(auth.session.username).toBe("Demo");
    expect(auth.session.accountId).toBe("acct-demo");

    const dash = await getProtectedDashboard({ session: auth.session });
    expect(dash.ok).toBe(true);
    expect(dash.status).toBe(200);
  });

  it("AC-4: invalid credentials show auth.login.error_invalid and create no session", async () => {
    vi.resetModules();
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { signIn } = await import("../src/auth/session");

    const wrongPassword = await signIn({
      username: "Laura",
      password: "not-the-password",
    });
    expect(wrongPassword.ok).toBe(false);
    if (wrongPassword.ok) return;
    expect(wrongPassword.errorKey).toBe("auth.login.error_invalid");
    expect(wrongPassword).not.toHaveProperty("session");

    const unknownUser = await signIn({
      username: "Nobody",
      password: "anything",
    });
    expect(unknownUser.ok).toBe(false);
    if (unknownUser.ok) return;
    expect(unknownUser.errorKey).toBe("auth.login.error_invalid");
    expect(unknownUser).not.toHaveProperty("session");
  });

  it("AC-5: Demo cannot read Laura health data", async () => {
    vi.resetModules();
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { signIn } = await import("../src/auth/session");
    const {
      resetHealthStub,
      insertHealthStub,
      listHealthRowsForSession,
    } = await import("../src/health/stub-store");

    resetHealthStub();
    insertHealthStub({
      id: "row-laura-1",
      accountId: "acct-laura",
      kind: "symptom",
      label: "palpitations",
    });

    const lauraAuth = await signIn({
      username: "Laura",
      password: "laura-test-secret",
    });
    expect(lauraAuth.ok).toBe(true);
    if (!lauraAuth.ok) return;
    const lauraRows = listHealthRowsForSession(lauraAuth.session);
    expect(lauraRows).toHaveLength(1);
    expect(lauraRows[0]?.accountId).toBe("acct-laura");

    const demoAuth = await signIn({
      username: "Demo",
      password: "demo-test-secret",
    });
    expect(demoAuth.ok).toBe(true);
    if (!demoAuth.ok) return;
    const demoRows = listHealthRowsForSession(demoAuth.session);
    expect(demoRows).toEqual([]);
  });

  it("AC-6: app shell nav exposes Home, Log, Calendar, Analytics, Import; Home title is Dashboard", async () => {
    const { getAppShellNav, getShellPageTitle } = await import("../src/shell/nav");

    const nav = getAppShellNav();
    expect(nav.map((item) => item.label)).toEqual([
      "Home",
      "Log",
      "Calendar",
      "Analytics",
      "Import",
    ]);
    expect(nav.map((item) => item.labelKey)).toEqual([
      "nav.home",
      "nav.log",
      "nav.calendar",
      "nav.analytics",
      "nav.import",
    ]);

    const home = nav.find((item) => item.id === "home");
    expect(home).toBeDefined();
    expect(getShellPageTitle("home")).toBe("Dashboard");
    expect(home?.titleKey).toBe("shell.title.dashboard");
  });

  it("AC-7: each nav target is reachable when signed in", async () => {
    vi.resetModules();
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { signIn } = await import("../src/auth/session");
    const { getAppShellNav } = await import("../src/shell/nav");
    const { openShellRoute } = await import("../src/shell/routes");

    const auth = await signIn({
      username: "Laura",
      password: "laura-test-secret",
    });
    expect(auth.ok).toBe(true);
    if (!auth.ok) return;

    for (const item of getAppShellNav()) {
      const page = await openShellRoute({
        session: auth.session,
        href: item.href,
      });
      expect(page.ok).toBe(true);
      if (!page.ok) return;
      expect(page.status).toBe(200);
      expect(page.bodyKey).toBe("shell.placeholder.body");
      expect(page.title).toBeTruthy();
    }

    const blocked = await openShellRoute({ session: null, href: "/" });
    expect(blocked.ok).toBe(false);
    if (blocked.ok) return;
    expect(blocked.status).toBe(401);
  });

  it("AC-8: sign out clears session", async () => {
    vi.resetModules();
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { signIn, signOut, getProtectedDashboard } = await import(
      "../src/auth/session"
    );

    const auth = await signIn({
      username: "Laura",
      password: "laura-test-secret",
    });
    expect(auth.ok).toBe(true);
    if (!auth.ok) return;

    const before = await getProtectedDashboard({ session: auth.session });
    expect(before.ok).toBe(true);

    await signOut(auth.session);

    const after = await getProtectedDashboard({ session: auth.session });
    expect(after.ok).toBe(false);
    expect(after.status).toBe(401);
  });

  it("AC-9: exactly two seeded accounts; no public signup route", async () => {
    vi.resetModules();
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { listSeededAccounts } = await import("../src/auth/session");
    const accounts = listSeededAccounts();
    expect(accounts).toHaveLength(2);
    expect(accounts.map((a) => a.username).sort()).toEqual(["Demo", "Laura"]);

    const { listPublicAuthRoutes } = await import("../src/auth/public-routes");
    const publicAuth = listPublicAuthRoutes();
    expect(publicAuth).not.toContain("/signup");
    expect(publicAuth).not.toContain("/register");
    expect(publicAuth.every((route) => !/sign.?up|register/i.test(route))).toBe(
      true,
    );
  });

  it("AC-10: Demo starts with no health logs/imports", async () => {
    vi.resetModules();
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";

    const { applyV1HealthSeed, seededHealthLogCount } = await import(
      "../src/health/v1-seed"
    );
    const { listHealthRowsForSession } = await import("../src/health/stub-store");
    const { signIn } = await import("../src/auth/session");

    expect(seededHealthLogCount("acct-demo")).toBe(0);

    applyV1HealthSeed();

    const demoAuth = await signIn({
      username: "Demo",
      password: "demo-test-secret",
    });
    expect(demoAuth.ok).toBe(true);
    if (!demoAuth.ok) return;
    expect(listHealthRowsForSession(demoAuth.session)).toEqual([]);
  });
});
