"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/auth/current-session";
import {
  deleteImportBatch,
  importHealthCsvPair,
} from "@/import/store";

export type ImportActionResult =
  | { ok: true; inserted: number; skipped: number; batchId: string }
  | { ok: false; errorKey: "import.error_missing_pair" | "import.failed" };

export async function importCsvPairAction(
  formData: FormData
): Promise<ImportActionResult> {
  const session = await requireSession();
  const summaryFile = formData.get("summaryCsv");
  const detailedFile = formData.get("detailedCsv");

  const summaryOk = summaryFile instanceof File && summaryFile.size > 0;
  const detailedOk = detailedFile instanceof File && detailedFile.size > 0;

  if (!summaryOk || !detailedOk) {
    return { ok: false, errorKey: "import.error_missing_pair" };
  }

  const summaryCsv = await summaryFile.text();
  const detailedCsv = await detailedFile.text();
  const result = await importHealthCsvPair({
    accountId: session.accountId,
    summaryCsv,
    detailedCsv,
    summaryFilename: summaryFile.name,
    detailedFilename: detailedFile.name,
  });

  if (!result.ok) {
    return { ok: false, errorKey: result.errorKey };
  }

  revalidatePath("/import");
  return {
    ok: true,
    inserted: result.inserted,
    skipped: result.skipped,
    batchId: result.batchId,
  };
}

export async function deleteImportBatchAction(
  batchId: string
): Promise<{ ok: boolean }> {
  const session = await requireSession();
  const deleted = await deleteImportBatch(session.accountId, batchId);
  if (deleted) revalidatePath("/import");
  return { ok: deleted };
}
