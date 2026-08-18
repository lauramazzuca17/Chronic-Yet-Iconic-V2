"use client";

import { useRef, useState, type ChangeEvent, type FormEvent, type RefObject } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import {
  deleteImportBatchAction,
  importCsvPairAction,
} from "@/import/actions";
import {
  formatBatchMeta,
  IMPORT_COPY,
  formatDuplicateSkipped,
  formatImportSuccess,
} from "@/import/copy";
import { IMPORT } from "@/import/layout";
import type { ImportBatch, ImportBatchStatus } from "@/import/store";

const STATUS_LABEL: Record<ImportBatchStatus, string> = {
  completed: IMPORT_COPY["import.status.completed"],
  processing: IMPORT_COPY["import.status.processing"],
  failed: IMPORT_COPY["import.status.failed"],
};

const STATUS_BG: Record<ImportBatchStatus, string> = {
  completed: IMPORT.batch.badgeCompleted,
  processing: IMPORT.batch.badgeProcessing,
  failed: IMPORT.batch.badgeFailed,
};

export type ImportHistoryRow = ImportBatch & { sampleCount: number };

export type ImportScreenProps = {
  recordCount: number;
  batches: ImportHistoryRow[];
};

const titleSx = {
  m: 0,
  fontWeight: IMPORT.titleWeight,
  fontSize: IMPORT.titleSizePx,
  lineHeight: `${IMPORT.titleLineHeightPx}px`,
  color: IMPORT.titleColor,
} as const;

function hitExpand(visualPx: number, hitPx: number) {
  return `${(visualPx - hitPx) / 2}px 0`;
}

function FilePicker({
  label,
  inputRef,
  name,
  testId,
  filenameTestId,
  filename,
  onChange,
}: {
  label: string;
  inputRef: RefObject<HTMLInputElement | null>;
  name: string;
  testId: string;
  filenameTestId: string;
  filename: string | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flex: "1 1 0",
        flexDirection: "column",
        gap: `${IMPORT.fieldGapPx}px`,
        minWidth: 0,
      }}
    >
      <Typography
        sx={{
          m: 0,
          fontWeight: 500,
          fontSize: IMPORT.helperSizePx,
          lineHeight: `${IMPORT.helperLineHeightPx}px`,
          color: IMPORT.textColor,
        }}
      >
        {label}
      </Typography>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept=".csv,text/csv"
        hidden
        data-testid={testId}
        onChange={onChange}
      />
      <Box
        component="button"
        type="button"
        onClick={() => inputRef.current?.click()}
        sx={{
          position: "relative",
          width: "100%",
          boxSizing: "border-box",
          m: 0,
          p: `${IMPORT.choose.padPx}px`,
          minHeight: IMPORT.choose.visualHeightPx,
          bgcolor: "#ffffff",
          border: `1px solid ${IMPORT.choose.border}`,
          borderRadius: `${IMPORT.choose.radiusPx}px`,
          fontFamily: "inherit",
          fontSize: IMPORT.choose.fontSizePx,
          lineHeight: `${IMPORT.choose.lineHeightPx}px`,
          color: IMPORT.textColor,
          textAlign: "center",
          cursor: "pointer",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: hitExpand(
              IMPORT.choose.visualHeightPx,
              IMPORT.choose.hitHeightPx
            ),
          },
        }}
      >
        {IMPORT_COPY["import.choose_file"]}
      </Box>
      <Typography
        data-testid={filenameTestId}
        title={filename ?? undefined}
        sx={{
          m: 0,
          display: "block",
          width: "100%",
          minWidth: 0,
          color: IMPORT.helperColor,
          fontSize: IMPORT.helperSizePx,
          lineHeight: `${IMPORT.helperLineHeightPx}px`,
          overflow: IMPORT.filename.overflow,
          textOverflow: IMPORT.filename.textOverflow,
          whiteSpace: IMPORT.filename.whiteSpace,
        }}
      >
        {filename ?? IMPORT_COPY["import.no_file_selected"]}
      </Typography>
    </Box>
  );
}

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
    try {
      const result = await importCsvPairAction(data);
      if (!result.ok) {
        if (result.errorKey === "import.error_missing_pair") {
          setPairError(true);
        } else {
          setFeedback(IMPORT_COPY["import.failed"]);
        }
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
    } catch {
      setFeedback(IMPORT_COPY["import.failed"]);
    } finally {
      setProcessing(false);
    }
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

  const countSuffix =
    IMPORT_COPY["import.database_summary.count"].split("{count}")[1] ?? "";

  return (
    <Box
      component="main"
      sx={{
        px: `${IMPORT.padXPx}px`,
        pb: `${IMPORT.padBottomPx}px`,
        display: "flex",
        flexDirection: "column",
        gap: `${IMPORT.panelGapPx}px`,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Box
        component="form"
        onSubmit={onSubmit}
        data-testid="import-upload-card"
        sx={{
          bgcolor: "#ffffff",
          borderRadius: `${IMPORT.upload.radiusPx}px`,
          px: `${IMPORT.upload.padXPx}px`,
          py: `${IMPORT.upload.padYPx}px`,
          display: "flex",
          flexDirection: "column",
          gap: `${IMPORT.upload.gapPx}px`,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: `${IMPORT.introGapPx}px`,
            width: "100%",
          }}
        >
          <Typography component="h2" sx={titleSx}>
            {IMPORT_COPY["import.upload.title"]}
          </Typography>
          <Typography
            sx={{
              m: 0,
              fontSize: IMPORT.helperSizePx,
              lineHeight: `${IMPORT.helperLineHeightPx}px`,
              color: IMPORT.helperColor,
            }}
          >
            {IMPORT_COPY["import.upload.instructions"]}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: `${IMPORT.pickerGapPx}px`,
            alignItems: "flex-start",
            width: "100%",
            minWidth: 0,
          }}
        >
          <FilePicker
            label={IMPORT_COPY["import.field.summary"]}
            inputRef={summaryInputRef}
            name="summaryCsv"
            testId="import-summary-input"
            filenameTestId="import-summary-filename"
            filename={summaryName}
            onChange={onSummaryChange}
          />
          <FilePicker
            label={IMPORT_COPY["import.field.detailed"]}
            inputRef={detailedInputRef}
            name="detailedCsv"
            testId="import-detailed-input"
            filenameTestId="import-detailed-filename"
            filename={detailedName}
            onChange={onDetailedChange}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: `${IMPORT.fieldGapPx}px`,
            width: "100%",
          }}
        >
          <Box
            component="button"
            type="submit"
            disabled={processing}
            data-testid="import-start"
            sx={{
              position: "relative",
              width: "100%",
              boxSizing: "border-box",
              m: 0,
              px: `${IMPORT.start.padXPx}px`,
              py: `${IMPORT.start.padYPx}px`,
              minHeight: IMPORT.start.visualHeightPx,
              bgcolor: IMPORT.start.bg,
              color: IMPORT.start.color,
              border: "none",
              borderRadius: `${IMPORT.start.radiusPx}px`,
              fontFamily: "inherit",
              fontWeight: IMPORT.start.fontWeight,
              fontSize: IMPORT.start.fontSizePx,
              lineHeight: `${IMPORT.start.lineHeightPx}px`,
              textAlign: "center",
              cursor: processing ? "default" : "pointer",
              opacity: processing ? 0.7 : 1,
              "&::after": {
                content: '""',
                position: "absolute",
                inset: hitExpand(
                  IMPORT.start.visualHeightPx,
                  IMPORT.start.hitHeightPx
                ),
              },
            }}
          >
            {processing
              ? IMPORT_COPY["import.status.processing"]
              : IMPORT_COPY["import.start"]}
          </Box>
          {pairError ? (
            <Typography
              data-testid="import-pair-error"
              sx={{
                m: 0,
                color: IMPORT.batch.confirmDeleteColor,
                fontSize: IMPORT.helperSizePx,
                lineHeight: `${IMPORT.helperLineHeightPx}px`,
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              {IMPORT_COPY["import.error_missing_pair"]}
            </Typography>
          ) : null}
          {feedback ? (
            <Typography
              data-testid="import-feedback"
              sx={{
                m: 0,
                color: IMPORT.helperColor,
                fontSize: IMPORT.helperSizePx,
                lineHeight: `${IMPORT.helperLineHeightPx}px`,
              }}
            >
              {feedback}
            </Typography>
          ) : null}
        </Box>
      </Box>

      <Box
        data-testid="import-history-card"
        sx={{
          bgcolor: "#ffffff",
          borderRadius: `${IMPORT.history.radiusPx}px`,
          pt: `${IMPORT.history.padTopPx}px`,
          px: `${IMPORT.history.padXPx}px`,
          pb: `${IMPORT.history.padBottomPx}px`,
          display: "flex",
          flexDirection: "column",
          gap: `${IMPORT.history.gapPx}px`,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Typography component="h2" sx={titleSx}>
          {IMPORT_COPY["import.history.title"]}
        </Typography>

        <Box
          data-testid="import-database-summary"
          sx={{
            bgcolor: IMPORT.summary.bg,
            borderRadius: `${IMPORT.summary.radiusPx}px`,
            px: `${IMPORT.summary.padXPx}px`,
            py: `${IMPORT.summary.padYPx}px`,
            display: "flex",
            gap: `${IMPORT.summary.gapPx}px`,
            alignItems: "flex-start",
            width: "100%",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: IMPORT.summary.iconOuterWidthPx,
              height: IMPORT.summary.iconOuterHeightPx,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src={IMPORT.summary.iconSrc}
              alt=""
              aria-hidden
              sx={{
                display: "block",
                width: IMPORT.summary.iconDrawWidthPx,
                height: IMPORT.summary.iconDrawHeightPx,
              }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: `${IMPORT.introGapPx}px`,
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              sx={{
                m: 0,
                fontWeight: IMPORT.summary.titleWeight,
                fontSize: IMPORT.summary.titleSizePx,
                lineHeight: `${IMPORT.summary.titleLineHeightPx}px`,
                color: IMPORT.summary.titleColor,
              }}
            >
              {IMPORT_COPY["import.database_summary.title"]}
            </Typography>
            <Typography
              data-testid="import-record-count"
              sx={{
                m: 0,
                fontSize: IMPORT.summary.countSizePx,
                lineHeight: `${IMPORT.summary.countLineHeightPx}px`,
                color: IMPORT.textColor,
              }}
            >
              <Box
                component="span"
                sx={{ fontWeight: IMPORT.summary.countWeight }}
              >
                {recordCount}
              </Box>
              {countSuffix}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: `${IMPORT.batchList.gapPx}px`,
            pt: `${IMPORT.batchList.padTopPx}px`,
            width: "100%",
          }}
        >
          {batches.map((batch) => {
            const armed = armedDeleteId === batch.id;
            const status = batch.status;
            return (
              <Box
                key={batch.id}
                data-testid="import-batch"
                data-status={status}
                sx={{
                  position: "relative",
                  height: IMPORT.batch.heightPx,
                  width: "100%",
                }}
              >
                <Box
                  component="span"
                  data-testid="import-batch-status"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: IMPORT.batch.badgeRightPx,
                    bgcolor: STATUS_BG[status],
                    color: IMPORT.batch.badgeColor,
                    borderRadius: `${IMPORT.batch.badgeRadiusPx}px`,
                    px: `${IMPORT.batch.badgePadXPx}px`,
                    py: `${IMPORT.batch.badgePadYPx}px`,
                    fontSize: IMPORT.helperSizePx,
                    lineHeight: `${IMPORT.helperLineHeightPx}px`,
                    zIndex: 1,
                  }}
                >
                  {STATUS_LABEL[status]}
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    top: IMPORT.batch.cardOffsetTopPx,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "#ffffff",
                    border: `1px solid ${IMPORT.batch.border}`,
                    borderRadius: `${IMPORT.batch.radiusPx}px`,
                    pl: `${IMPORT.batch.padLeftPx}px`,
                    pr: `${IMPORT.batch.padRightPx}px`,
                    py: `${IMPORT.batch.padYPx}px`,
                    display: "flex",
                    flexDirection: "column",
                    gap: `${IMPORT.batch.gapPx}px`,
                    boxSizing: "border-box",
                    overflow: "hidden",
                  }}
                >
                  <Typography
                    sx={{
                      m: 0,
                      color: IMPORT.helperColor,
                      fontSize: IMPORT.helperSizePx,
                      lineHeight: "16px",
                      fontWeight: IMPORT.batch.metaWeight,
                    }}
                  >
                    {formatBatchMeta(batch.sampleCount, batch.importedAt)}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    <Typography
                      data-testid="import-batch-filename"
                      title={batch.originalFilename ?? undefined}
                      sx={{
                        m: 0,
                        fontSize: IMPORT.helperSizePx,
                        lineHeight: "16px",
                        color: IMPORT.textColor,
                        minWidth: 0,
                        overflow: IMPORT.filename.overflow,
                        textOverflow: IMPORT.filename.textOverflow,
                        whiteSpace: IMPORT.filename.whiteSpace,
                      }}
                    >
                      {batch.originalFilename ?? "—"}
                    </Typography>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => onDelete(batch.id)}
                      aria-label={
                        armed
                          ? IMPORT_COPY["import.entry.confirm_delete"]
                          : IMPORT_COPY["import.entry.delete"]
                      }
                      sx={{
                        position: "relative",
                        flexShrink: 0,
                        m: 0,
                        p: 0,
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: IMPORT.helperSizePx,
                        fontWeight: 400,
                        lineHeight: "16px",
                        color: armed
                          ? IMPORT.batch.confirmDeleteColor
                          : IMPORT.batch.deleteColor,
                        whiteSpace: "nowrap",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          inset: "-12px -8px",
                        },
                      }}
                    >
                      {armed
                        ? IMPORT_COPY["import.entry.confirm_delete"]
                        : IMPORT_COPY["import.entry.delete"]}
                    </Box>
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
