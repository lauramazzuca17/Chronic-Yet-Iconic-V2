"use client";

import { Box, Typography } from "@mui/material";
import { LOG_COPY } from "@/log/copy";
import { LOG_ENTRY_CARD } from "@/log/layout";

const cardSx = {
  boxSizing: "border-box" as const,
  width: "100%",
  bgcolor: "#ffffff",
  border: `1px solid ${LOG_ENTRY_CARD.border}`,
  borderRadius: `${LOG_ENTRY_CARD.radiusPx}px`,
  px: `${LOG_ENTRY_CARD.padXPx}px`,
  py: `${LOG_ENTRY_CARD.padYPx}px`,
  display: "flex",
  flexDirection: "column" as const,
  gap: `${LOG_ENTRY_CARD.gapPx}px`,
  overflow: "hidden",
};

const eyebrowSx = {
  m: 0,
  width: "100%",
  color: LOG_ENTRY_CARD.eyebrowColor,
  fontSize: LOG_ENTRY_CARD.eyebrowSizePx,
  fontWeight: LOG_ENTRY_CARD.eyebrowWeight,
  lineHeight: `${LOG_ENTRY_CARD.eyebrowLineHeightPx}px`,
  letterSpacing: `${LOG_ENTRY_CARD.eyebrowTrackingPx}px`,
  textTransform: "uppercase" as const,
  fontFamily: "inherit",
  whiteSpace: "pre-wrap" as const,
};

const valueSx = {
  m: 0,
  flex: "1 1 auto",
  minWidth: 0,
  color: LOG_ENTRY_CARD.valueColor,
  fontSize: LOG_ENTRY_CARD.valueSizePx,
  fontWeight: LOG_ENTRY_CARD.valueWeight,
  lineHeight: `${LOG_ENTRY_CARD.valueLineHeightPx}px`,
  fontFamily: "inherit",
  whiteSpace: "nowrap" as const,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const deleteButtonSx = (armed: boolean) => ({
  position: "relative" as const,
  flexShrink: 0,
  m: 0,
  p: 0,
  border: "none",
  background: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: LOG_ENTRY_CARD.deleteSizePx,
  fontWeight: LOG_ENTRY_CARD.deleteWeight,
  lineHeight: `${LOG_ENTRY_CARD.deleteLineHeightPx}px`,
  letterSpacing: 0,
  color: armed
    ? LOG_ENTRY_CARD.confirmDeleteColor
    : LOG_ENTRY_CARD.deleteColor,
  whiteSpace: "nowrap" as const,
  textTransform: "none" as const,
  // Expanded hit target without changing Figma visual size.
  "&::after": {
    content: '""',
    position: "absolute",
    inset: "-12px -8px",
  },
});

export type LogEntryCardProps = {
  summary: string;
  eyebrow: string;
  armed: boolean;
  onDelete: () => void;
  /** Calendar's day list reuses this card under its own hook. */
  testId?: string;
};

/** Figma entry card `62811:25282` (default) / `62910:6297` (confirm delete). */
export function LogEntryCard({
  eyebrow,
  summary,
  armed,
  onDelete,
  testId = "log-entry",
}: LogEntryCardProps) {
  return (
    <Box
      data-testid={testId}
      onClick={(e) => e.stopPropagation()}
      sx={cardSx}
    >
      <Typography component="p" sx={eyebrowSx}>
        {eyebrow}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          width: "100%",
          fontSize: LOG_ENTRY_CARD.valueSizePx,
          lineHeight: `${LOG_ENTRY_CARD.valueLineHeightPx}px`,
          whiteSpace: "nowrap",
        }}
      >
        <Typography component="p" sx={valueSx}>
          {summary}
        </Typography>
        <Box
          component="button"
          type="button"
          onClick={onDelete}
          aria-label={
            armed
              ? LOG_COPY["log.entry.confirm_delete"]
              : LOG_COPY["log.entry.delete"]
          }
          sx={deleteButtonSx(armed)}
        >
          {armed
            ? LOG_COPY["log.entry.confirm_delete"]
            : LOG_COPY["log.entry.delete"]}
        </Box>
      </Box>
    </Box>
  );
}
