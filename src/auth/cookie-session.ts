import { sealData } from "iron-session";
import { signIn, signOut, type Session } from "./session";
import { SESSION_COOKIE_NAME } from "./iron";

export { SESSION_COOKIE_NAME };
export type SessionCookieOptions = {
  httpOnly: boolean;
  path: string;
  sameSite: "lax";
  secure: boolean;
};

export type LoginSuccess = {
  ok: true;
  redirectTo: "/";
  session: Session;
  cookie: {
    name: string;
    value: string;
    httpOnly: true;
  };
};

export type LoginFailure = {
  ok: false;
  errorKey: "auth.login.error_invalid";
  remainOn: "/login";
};

export type LogoutResult = {
  redirectTo: "/login";
  cookie: {
    name: string;
    value: "";
    httpOnly: true;
    maxAge: 0;
  };
};

function requireSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be set and at least 32 characters");
  }
  return secret;
}

export function getSessionCookieOptions(): SessionCookieOptions {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  };
}

/**
 * Validate credentials, seal an iron-session cookie payload, redirect to Home.
 */
export async function loginWithCredentials(input: {
  username: string;
  password: string;
}): Promise<LoginSuccess | LoginFailure> {
  const auth = await signIn(input);
  if (!auth.ok) {
    return { ok: false, errorKey: auth.errorKey, remainOn: "/login" };
  }

  const value = await sealData(
    {
      sessionId: auth.session.sessionId,
      accountId: auth.session.accountId,
      username: auth.session.username,
    },
    { password: requireSessionSecret() },
  );

  return {
    ok: true,
    redirectTo: "/",
    session: auth.session,
    cookie: {
      name: SESSION_COOKIE_NAME,
      value,
      httpOnly: true,
    },
  };
}

/** Clear session cookie and invalidate in-process session; send user to /login. */
export async function logoutSession(session: Session): Promise<LogoutResult> {
  await signOut(session);
  return {
    redirectTo: "/login",
    cookie: {
      name: SESSION_COOKIE_NAME,
      value: "",
      httpOnly: true,
      maxAge: 0,
    },
  };
}
