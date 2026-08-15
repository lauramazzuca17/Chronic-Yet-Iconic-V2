import { requireSession } from "@/auth/current-session";
import { ImportScreen } from "@/import/ImportScreen";
import {
  countImportedRecords,
  countSamplesInBatch,
  listImportBatches,
} from "@/import/store";

export default async function ImportPage() {
  const session = await requireSession();
  const batches = await Promise.all(
    (await listImportBatches(session.accountId)).map(async (batch) => ({
      ...batch,
      sampleCount: await countSamplesInBatch(batch.id),
    }))
  );
  const recordCount = await countImportedRecords(session.accountId);

  return <ImportScreen recordCount={recordCount} batches={batches} />;
}
