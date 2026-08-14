"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import {
  deleteImportBatchAction,
  importCsvPairAction,
} from "@/import/actions";
import {
  formatBatchMeta,
  formatDatabaseSummaryCount,
  formatDuplicateSkipped,
  formatImportSuccess,
  IMPORT_COPY,
} from "@/import/copy";
import type { ImportBatch, ImportBatchStatus } from "@/import/store";

const ACCENT = "#f08429";
const CONFIRM_DELETE = "#d95c1c";
const SUMMARY_BG = "#f2f5ed";
const SUMMARY_TITLE = "#367057";
const COMPLETED_BADGE = "#b7cc87";
const PROCESSING_BADGE = "#ffdb9c";
const FAILED_BADGE = "#ff8c5a";
const CARD_RADIUS = "12px";

const cardSx = {
  bgcolor: "#FFFFFF",
  borderRadius: CARD_RADIUS,
  boxShadow:
    "0 4px 4px rgba(12,12,13,0.05), 0 4px 4px rgba(12,12,13,0.1)",
  width: "100%",
};

const STATUS_LABEL: Record<ImportBatchStatus, string> = {
  completed: IMPORT_COPY["import.status.completed"],
  processing: IMPORT_COPY["import.status.processing"],
  failed: IMPORT_COPY["import.status.failed"],
};

const STATUS_BG: Record<ImportBatchStatus, string> = {
  completed: COMPLETED_BADGE,
  processing: PROCESSING_BADGE,
  failed: FAILED_BADGE,
};

export type ImportHistoryRow = ImportBatch & { sampleCount: number };

export type ImportScreenProps = {
  recordCount: number;
  batches: ImportHistoryRow[];
};

/** Import upload + history — Figma FEAT-007 `62939:4277`. */
export function ImportScreen({ recordCount, batches }: ImportScreenProps) {
  const router = useRouter();
  const summaryInputRef = useRef<HTMLInputElement>(null);
  const detailedInputRef = useRef<HTMLInputElement>(null);
  const [summaryName, setSummaryName] = useState<string | null>(null);
  const [detailedName, setDetailedName] = useState<string | null>(null);
  const [pairError, setPairError] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [armedDeleteId, setArmedDeleteId] = useState<string | null>(null);

  function onSummaryChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setSummaryName(file?.name ?? null);
    setPairError(false);
  }

  function onDetailedChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setDetailedName(file?.name ?? null);
    setPairError(false);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFeedback(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    const summary = data.get("summaryCsv");
    const detailed = data.get("detailedCsv");
    if (
      !(summary instanceof File && summary.size > 0) ||
      !(detailed instanceof File && detailed.size > 0)
    ) {
      setPairError(true);
      return;
    }

    setProcessing(true);
    setPairError(false);
    const result = await importCsvPairAction(data);
    setProcessing(false);

    if (!result.ok) {
      setPairError(result.errorKey === "import.error_missing_pair");
      return;
    }

    let message = formatImportSuccess(result.inserted);
    if (result.skipped > 0) {
      message = `${message} ${formatDuplicateSkipped(result.skipped)}`;
    }
    setFeedback(message);
    setSummaryName(null);
    setDetailedName(null);
    form.reset();
    router.refresh();
  }

  async function onDelete(batchId: string) {
    if (armedDeleteId !== batchId) {
      setArmedDeleteId(batchId);
      return;
    }
    setArmedDeleteId(null);
    await deleteImportBatchAction(batchId);
    router.refresh();
  }

  return (
    <Box
      component="main"
      sx={{ px: 2, pb: 3, display: "flex", flexDirection: "column", gap: 1.5 }}
    >
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{ ...cardSx, p: 2 }}
        data-testid="import-upload-card"
      >
        <Typography
          component="h2"
          sx={{ fontWeight: 700, fontSize: 20, m: 0 }}
        >
          {IMPORT_COPY["import.upload.title"]}
        </Typography>
        <Typography
          sx={{ color: "text.secondary", fontSize: 12, mt: 0.5, mb: 2 }}
        >
          {IMPORT_COPY["import.upload.instructions"]}
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 140 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 12, mb: 1 }}>
              {IMPORT_COPY["import.field.summary"]}
            </Typography>
            <input
              ref={summaryInputRef}
              type="file"
              name="summaryCsv"
              accept=".csv,text/csv"
              hidden
              data-testid="import-summary-input"
              onChange={onSummaryChange}
            />
            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={() => summaryInputRef.current?.click()}
              sx={{ minHeight: 44, borderRadius: "8px", textTransform: "none" }}
            >
              {IMPORT_COPY["import.choose_file"]}
            </Button>
            <Typography
              data-testid="import-summary-filename"
              sx={{ color: "text.secondary", fontSize: 12, mt: 1 }}
            >
              {summaryName ?? IMPORT_COPY["import.no_file_selected"]}
            </Typography>
          </Box>
          <Box sx={{ flex: 1, minWidth: 140 }}>
            <Typography sx={{ fontWeight: 500, fontSize: 12, mb: 1 }}>
              {IMPORT_COPY["import.field.detailed"]}
            </Typography>
            <input
              ref={detailedInputRef}
              type="file"
              name="detailedCsv"
              accept=".csv,text/csv"
              hidden
              data-testid="import-detailed-input"
              onChange={onDetailedChange}
            />
            <Button
              type="button"
              fullWidth
              variant="outlined"
              onClick={() => detailedInputRef.current?.click()}
              sx={{ minHeight: 44, borderRadius: "8px", textTransform: "none" }}
            >
              {IMPORT_COPY["import.choose_file"]}
            </Button>
            <Typography
              data-testid="import-detailed-filename"
              sx={{ color: "text.secondary", fontSize: 12, mt: 1 }}
            >
              {detailedName ?? IMPORT_COPY["import.no_file_selected"]}
            </Typography>
          </Box>
        </Box>

        <Button
          type="submit"
          fullWidth
          disabled={processing}
          data-testid="import-start"
          sx={{
            bgcolor: ACCENT,
            color: "#fff",
            minHeight: 44,
            borderRadius: "8px",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { bgcolor: ACCENT },
          }}
        >
          {processing
            ? IMPORT_COPY["import.status.processing"]
            : IMPORT_COPY["import.start"]}
        </Button>
        {pairError ? (
          <Typography
            data-testid="import-pair-error"
            sx={{
              color: CONFIRM_DELETE,
              fontSize: 12,
              fontWeight: 500,
              textAlign: "center",
              mt: 1,
            }}
          >
            {IMPORT_COPY["import.error_missing_pair"]}
          </Typography>
        ) : null}
        {feedback ? (
          <Typography
            data-testid="import-feedback"
            sx={{ color: "text.secondary", fontSize: 12, mt: 1 }}
          >
            {feedback}
          </Typography>
        ) : null}
      </Box>

      <Box sx={{ ...cardSx, px: 2, pt: 1.5, pb: 2 }} data-testid="import-history-card">
        <Typography
          component="h2"
          sx={{ fontWeight: 700, fontSize: 20, m: 0, mb: 1 }}
        >
          {IMPORT_COPY["import.history.title"]}
        </Typography>

        <Box
          data-testid="import-database-summary"
          sx={{
            bgcolor: SUMMARY_BG,
            borderRadius: "8px",
            px: 2,
            py: 1.5,
            mb: 1.5,
          }}
        >
          <Typography
            sx={{ color: SUMMARY_TITLE, fontWeight: 500, fontSize: 18 }}
          >
            {IMPORT_COPY["import.database_summary.title"]}
          </Typography>
          <Typography sx={{ fontSize: 14 }} data-testid="import-record-count">
            {formatDatabaseSummaryCount(recordCount)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {batches.map((batch) => {
            const armed = armedDeleteId === batch.id;
            const status = batch.status;
            return (
              <Box
                key={batch.id}
                data-testid="import-batch"
                data-status={status}
                sx={{ position: "relative", pt: 1.25 }}
              >
                <Box
                  component="span"
                  data-testid="import-batch-status"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 8,
                    bgcolor: STATUS_BG[status],
                    borderRadius: "4px",
                    px: 0.75,
                    fontSize: 12,
                    lineHeight: "18px",
                    zIndex: 1,
                  }}
                >
                  {STATUS_LABEL[status]}
                </Box>
                <Box
                  sx={{
                    border: "1px solid #d1d5dc",
                    borderRadius: "8px",
                    px: 1.5,
                    py: 1.25,
                  }}
                >
                  <Typography
                    sx={{ color: "text.secondary", fontSize: 12, mb: 0.5 }}
                  >
                    {formatBatchMeta(batch.sampleCount, batch.importedAt)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      data-testid="import-batch-filename"
                      sx={{ fontSize: 12 }}
                    >
                      {batch.detailedFilename ?? "—"}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => onDelete(batch.id)}
                      sx={{
                        minHeight: 44,
                        color: armed ? CONFIRM_DELETE : "text.secondary",
                        fontWeight: armed ? 700 : 500,
                        textTransform: "none",
                      }}
                    >
                      {armed
                        ? IMPORT_COPY["import.entry.confirm_delete"]
                        : IMPORT_COPY["import.entry.delete"]}
                    </Button>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
