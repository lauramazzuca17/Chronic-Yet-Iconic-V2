import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { getIronSessionOptions, type IronSessionData } from "@/auth/iron";
import { resolveShellAuthGate } from "@/auth/route-gate";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<IronSessionData>(
    request,
    response,
    getIronSessionOptions(),
  );
  const hasSession = Boolean(session.sessionId);
  const gate = resolveShellAuthGate({
    pathname: request.nextUrl.pathname,
    hasSession,
  });

  if (!gate.allow) {
    return NextResponse.redirect(new URL(gate.redirectTo, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|lottie/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
