"use server";

import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginWithCredentials, logoutSession } from "./cookie-session";
import { getIronSessionOptions, type IronSessionData } from "./iron";
import type { Session } from "./session";

export type LoginActionResult =
  | { ok: true }
  | { ok: false; errorKey: "auth.login.error_invalid" };

export async function loginAction(formData: FormData): Promise<LoginActionResult> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  const result = await loginWithCredentials({ username, password });
  if (!result.ok) {
    return { ok: false, errorKey: result.errorKey };
  }

  const cookieStore = await cookies();
  const ironSession = await getIronSession<IronSessionData>(
    cookieStore,
    getIronSessionOptions(),
  );
  ironSession.sessionId = result.session.sessionId;
  ironSession.accountId = result.session.accountId;
  ironSession.username = result.session.username;
  await ironSession.save();

  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const ironSession = await getIronSession<IronSessionData>(
    cookieStore,
    getIronSessionOptions(),
  );

  if (ironSession.sessionId && ironSession.accountId && ironSession.username) {
    const session: Session = {
      sessionId: ironSession.sessionId,
      accountId: ironSession.accountId,
      username: ironSession.username,
    };
    await logoutSession(session);
  }

  ironSession.destroy();
  redirect("/login");
}
