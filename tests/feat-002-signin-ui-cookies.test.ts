/**
 * FEAT-002 — Sign-in UI + HTTP session cookies
 * Skeleton: first test active (expected to fail until implemented);
 * remaining ACs marked todo until their turn in /tdd-cycle.
 */
import { describe, it, expect, vi } from "vitest";

describe("FEAT-002 sign-in UI + cookies", () => {
  it("AC-1: /login exposes Sign In form fields and submit copy keys", async () => {
    // RED until login page module / copy wiring exists
    const { getLoginPageCopy } = await import("../src/auth/login-page");
    const copy = getLoginPageCopy();
    expect(copy.submit).toBe("Sign In");
    expect(copy.usernameLabel).toBe("Username");
    expect(copy.passwordLabel).toBe("Password");
    expect(copy.errorInvalid).toBe("Username or password is wrong.");
  });

  it("AC-2: valid credentials set HTTP-only session cookie and redirect to /", async () => {
    vi.resetModules();
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";
    process.env.SESSION_SECRET = "test-session-secret-at-least-32-chars!!";

    const { loginWithCredentials, getSessionCookieOptions } = await import(
      "../src/auth/cookie-session"
    );

    expect(getSessionCookieOptions().httpOnly).toBe(true);

    const laura = await loginWithCredentials({
      username: "Laura",
      password: "laura-test-secret",
    });
    expect(laura.ok).toBe(true);
    if (!laura.ok) return;
    expect(laura.redirectTo).toBe("/");
    expect(laura.session.username).toBe("Laura");
    expect(laura.cookie.httpOnly).toBe(true);
    expect(laura.cookie.value.length).toBeGreaterThan(0);

    const demo = await loginWithCredentials({
      username: "Demo",
      password: "demo-test-secret",
    });
    expect(demo.ok).toBe(true);
    if (!demo.ok) return;
    expect(demo.redirectTo).toBe("/");
    expect(demo.session.username).toBe("Demo");
    expect(demo.cookie.httpOnly).toBe(true);
  });

  it("AC-3: invalid credentials show error and create no session cookie", async () => {
    vi.resetModules();
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";
    process.env.SESSION_SECRET = "test-session-secret-at-least-32-chars!!";

    const { loginWithCredentials } = await import("../src/auth/cookie-session");

    const wrongPassword = await loginWithCredentials({
      username: "Laura",
      password: "not-the-password",
    });
    expect(wrongPassword.ok).toBe(false);
    if (wrongPassword.ok) return;
    expect(wrongPassword.errorKey).toBe("auth.login.error_invalid");
    expect(wrongPassword.remainOn).toBe("/login");
    expect(wrongPassword).not.toHaveProperty("cookie");
    expect(wrongPassword).not.toHaveProperty("session");

    const unknownUser = await loginWithCredentials({
      username: "Nobody",
      password: "anything",
    });
    expect(unknownUser.ok).toBe(false);
    if (unknownUser.ok) return;
    expect(unknownUser.errorKey).toBe("auth.login.error_invalid");
    expect(unknownUser.remainOn).toBe("/login");
    expect(unknownUser).not.toHaveProperty("cookie");
  });

  it("AC-4: submitting CTA is disabled at 65% opacity while in flight", async () => {
    const { getSignInSubmitButtonState } = await import("../src/auth/login-page");

    const idle = getSignInSubmitButtonState(false);
    expect(idle.disabled).toBe(false);
    expect(idle.backgroundColor).toBe("#f08429");
    expect(idle.opacity).toBe(1);

    const submitting = getSignInSubmitButtonState(true);
    expect(submitting.disabled).toBe(true);
    expect(submitting.backgroundColor).toBe("#f08429");
    expect(submitting.opacity).toBe(0.65);
  });

  it("AC-5: unauthenticated access to shell routes redirects to /login", async () => {
    const { resolveShellAuthGate } = await import("../src/auth/route-gate");
    const protectedPaths = ["/", "/log", "/calendar", "/analytics", "/import"];

    for (const pathname of protectedPaths) {
      const gate = resolveShellAuthGate({
        pathname,
        hasSession: false,
      });
      expect(gate.allow).toBe(false);
      if (gate.allow) return;
      expect(gate.redirectTo).toBe("/login");
    }

    const allowed = resolveShellAuthGate({
      pathname: "/",
      hasSession: true,
    });
    expect(allowed.allow).toBe(true);
  });

  it("AC-6: authenticated /login redirects to /", async () => {
    const { resolveShellAuthGate } = await import("../src/auth/route-gate");

    const bounce = resolveShellAuthGate({
      pathname: "/login",
      hasSession: true,
    });
    expect(bounce.allow).toBe(false);
    if (bounce.allow) return;
    expect(bounce.redirectTo).toBe("/");

    const stay = resolveShellAuthGate({
      pathname: "/login",
      hasSession: false,
    });
    expect(stay.allow).toBe(true);
  });

  it("AC-7: sign out clears session cookie", async () => {
    vi.resetModules();
    process.env.SEED_PASSWORD_LAURA = "laura-test-secret";
    process.env.SEED_PASSWORD_DEMO = "demo-test-secret";
    process.env.SESSION_SECRET = "test-session-secret-at-least-32-chars!!";

    const {
      loginWithCredentials,
      logoutSession,
      SESSION_COOKIE_NAME,
    } = await import("../src/auth/cookie-session");
    const { getProtectedDashboard } = await import("../src/auth/session");
    const { resolveShellAuthGate } = await import("../src/auth/route-gate");

    const login = await loginWithCredentials({
      username: "Laura",
      password: "laura-test-secret",
    });
    expect(login.ok).toBe(true);
    if (!login.ok) return;

    const logout = await logoutSession(login.session);
    expect(logout.cookie.name).toBe(SESSION_COOKIE_NAME);
    expect(logout.cookie.value).toBe("");
    expect(logout.cookie.maxAge).toBe(0);
    expect(logout.cookie.httpOnly).toBe(true);
    expect(logout.redirectTo).toBe("/login");

    const after = await getProtectedDashboard({ session: login.session });
    expect(after.ok).toBe(false);
    expect(after.status).toBe(401);

    const gate = resolveShellAuthGate({ pathname: "/", hasSession: false });
    expect(gate.allow).toBe(false);
    if (gate.allow) return;
    expect(gate.redirectTo).toBe("/login");
  });

  it.todo("AC-8: covered by e2e/feat-002-signin-journey.spec.ts (npm run test:e2e)");
});
