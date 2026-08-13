import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getIronSession } from "iron-session";
import {
  getIronSessionOptions,
  type IronSessionData,
} from "@/auth/iron";
import type { Session } from "@/auth/session";

/** Read the signed-in iron session or redirect to /login. */
export async function requireSession(): Promise<Session> {
  const cookieStore = await cookies();
  const ironSession = await getIronSession<IronSessionData>(
    cookieStore,
    getIronSessionOptions()
  );
  if (
    !ironSession.sessionId ||
    !ironSession.accountId ||
    !ironSession.username
  ) {
    redirect("/login");
  }
  return {
    sessionId: ironSession.sessionId,
    accountId: ironSession.accountId,
    username: ironSession.username,
  };
}
