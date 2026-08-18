/** Copy deck keys for FEAT-007 Import (42-copy-deck). */

export const IMPORT_COPY = {
  "import.upload.title": "Upload Files",
  "import.upload.instructions":
    "On your iphone goto My Health Export App → Select your date range → fetch data and export both summary and detailed.",
  "import.field.summary": "Summary CSV",
  "import.field.detailed": "Detailed CSV",
  "import.choose_file": "Choose File",
  "import.no_file_selected": "No file selected",
  "import.start": "Start import",
  "import.error_missing_pair": "Need both summary and detailed CSV files.",
  "import.history.title": "Import History",
  "import.database_summary.title": "Database Summary",
  "import.database_summary.count": "{count} health records stored.",
  "import.status.completed": "Completed",
  "import.status.processing": "Processing",
  "import.status.failed": "Failed",
  "import.batch.meta": "{count} Records · {datetime}",
  "import.entry.delete": "Delete",
  "import.entry.confirm_delete": "Delete this import?",
  "import.success": "Import finished — {count} new samples.",
  "import.duplicate_skipped": "Skipped {count} duplicates.",
  "import.failed":
    "Import did not finish. Try a shorter date range, then try again.",
} as const;

export function formatDatabaseSummaryCount(count: number): string {
  return IMPORT_COPY["import.database_summary.count"].replace(
    "{count}",
    String(count)
  );
}

export function formatImportSuccess(count: number): string {
  return IMPORT_COPY["import.success"].replace("{count}", String(count));
}

export function formatDuplicateSkipped(count: number): string {
  return IMPORT_COPY["import.duplicate_skipped"].replace(
    "{count}",
    String(count)
  );
}

/** `{count} Records · Aug 5, 11:35 PM` from NY wall-clock `importedAt`. */
export function formatBatchMeta(count: number, importedAt: string): string {
  const [datePart, timePart = "00:00:00"] = importedAt.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  const wall = new Date(Date.UTC(y, m - 1, d, hh, mm));
  const month = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC",
  }).format(wall);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(wall);
  return `${count} Records · ${month} ${d}, ${time}`;
}
