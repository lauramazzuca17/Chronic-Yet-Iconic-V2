import { requireSession } from "@/auth/current-session";
import { ImportScreen } from "@/import/ImportScreen";
import {
  countImportedRecords,
  countSamplesInBatch,
  listImportBatches,
} from "@/import/store";

export default async function ImportPage() {
  const session = await requireSession();
  const batches = listImportBatches(session.accountId).map((batch) => ({
    ...batch,
    sampleCount: countSamplesInBatch(batch.id),
  }));
  const recordCount = countImportedRecords(session.accountId);

  return <ImportScreen recordCount={recordCount} batches={batches} />;
}
