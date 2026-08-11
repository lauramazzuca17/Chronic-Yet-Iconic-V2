import { getAppShellNav } from "../shell/nav";

export type ShellAuthGate =
  | { allow: true }
  | { allow: false; redirectTo: "/login" | "/" };

const PROTECTED_PATHS = new Set(getAppShellNav().map((item) => item.href));

/**
 * Auth redirects for shell + login:
 * - Unauthenticated shell → /login
 * - Authenticated /login → /
 */
export function resolveShellAuthGate(input: {
  pathname: string;
  hasSession: boolean;
}): ShellAuthGate {
  if (input.pathname === "/login") {
    if (input.hasSession) {
      return { allow: false, redirectTo: "/" };
    }
    return { allow: true };
  }

  if (!PROTECTED_PATHS.has(input.pathname)) {
    return { allow: true };
  }
  if (input.hasSession) {
    return { allow: true };
  }
  return { allow: false, redirectTo: "/login" };
}
