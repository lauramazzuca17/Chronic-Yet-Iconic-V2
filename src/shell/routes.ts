import type { Session } from "../auth/session";
import { isActiveSession } from "../auth/session";
import { getAppShellNav, getShellPageTitle, type ShellNavId } from "./nav";

const PLACEHOLDER_BODY_KEY = "shell.placeholder.body" as const;

export type ShellRouteResult =
  | {
      ok: true;
      status: 200;
      title: string;
      bodyKey: typeof PLACEHOLDER_BODY_KEY;
      body: string;
    }
  | { ok: false; status: 401 };

/**
 * Resolve a shell nav target for a signed-in session.
 * Placeholder body until feature FEATs land.
 */
export async function openShellRoute(input: {
  session: Session | null;
  href: string;
}): Promise<ShellRouteResult> {
  if (!isActiveSession(input.session)) {
    return { ok: false, status: 401 };
  }

  const item = getAppShellNav().find((entry) => entry.href === input.href);
  if (!item) {
    return { ok: false, status: 401 };
  }

  return {
    ok: true,
    status: 200,
    title: getShellPageTitle(item.id as ShellNavId),
    bodyKey: PLACEHOLDER_BODY_KEY,
    body: "This section is next.",
  };
}
