import type { SessionOptions } from "iron-session";

export const SESSION_COOKIE_NAME = "cyi_session";

export type IronSessionData = {
  sessionId?: string;
  accountId?: string;
  username?: string;
};

export function getIronSessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters");
  }
  return {
    cookieName: SESSION_COOKIE_NAME,
    password,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  };
}
