import { Box, Typography } from "@mui/material";
import { TAKEN_BADGE } from "@/components/taken-badge";

export type TakenBadgeProps = {
  taken: boolean;
  label: string;
  testId: string;
  /** Home sits in a tall card (center). Log sits beside a 56px field (start + minHeight). */
  alignItems?: "center" | "flex-start";
  minHeightPx?: number;
  ariaLabel?: string;
};

/** Figma `#efefef` 65px Taken + X/check. Presentational — not a control. */
export function TakenBadge({
  taken,
  label,
  testId,
  alignItems = "center",
  minHeightPx,
  ariaLabel,
}: TakenBadgeProps) {
  return (
    <Box
      data-testid={testId}
      data-taken={taken ? "true" : "false"}
      aria-label={ariaLabel}
      sx={{
        boxSizing: "border-box",
        bgcolor: TAKEN_BADGE.bg,
        borderRadius: `${TAKEN_BADGE.radiusPx}px`,
        width: TAKEN_BADGE.widthPx,
        minHeight: minHeightPx,
        px: `${TAKEN_BADGE.padXPx}px`,
        py: `${TAKEN_BADGE.padYPx}px`,
        display: "flex",
        flexDirection: "column",
        alignItems,
        gap: `${TAKEN_BADGE.gapPx}px`,
        flexShrink: 0,
      }}
    >
      <Typography
        component="span"
        sx={{
          m: 0,
          color: TAKEN_BADGE.labelColor,
          fontSize: TAKEN_BADGE.labelSizePx,
          fontWeight: 400,
          lineHeight: `${TAKEN_BADGE.labelLineHeightPx}px`,
          textAlign: alignItems === "center" ? "center" : "left",
        }}
      >
        {label}
      </Typography>
      <Box
        component="img"
        src={taken ? TAKEN_BADGE.checkSrc : TAKEN_BADGE.xSrc}
        alt=""
        aria-hidden
        sx={{
          width: TAKEN_BADGE.iconSizePx,
          height: TAKEN_BADGE.iconSizePx,
          display: "block",
          overflow: "visible",
        }}
      />
    </Box>
  );
}
