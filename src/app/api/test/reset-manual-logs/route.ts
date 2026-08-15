import { NextResponse } from "next/server";
import { resetManualLogs } from "@/log/store";

/** E2E-only store reset — gated by ALLOW_TEST_RESET. */
export async function POST() {
  if (process.env.ALLOW_TEST_RESET !== "1") {
    return new NextResponse("Forbidden", { status: 403 });
  }
  await resetManualLogs();
  return NextResponse.json({ ok: true });
}
