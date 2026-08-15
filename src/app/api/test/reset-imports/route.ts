import { NextResponse } from "next/server";
import { resetImports } from "@/import/store";

/** E2E-only import store reset — gated by ALLOW_TEST_RESET. */
export async function POST() {
  if (process.env.ALLOW_TEST_RESET !== "1") {
    return new NextResponse("Forbidden", { status: 403 });
  }
  await resetImports();
  return NextResponse.json({ ok: true });
}
