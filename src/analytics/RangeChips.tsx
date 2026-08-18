"use client";

import { Box } from "@mui/material";
import { ANALYTICS_RANGE_SWITCH } from "@/analytics/layout";

type RangeOption = { id: string; label: string };

type RangeChipsProps = {
  options: RangeOption[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  testIdPrefix: string;
};

export function RangeChips({
  options,
  value,
  onChange,
  disabled,
  testIdPrefix,
}: RangeChipsProps) {
  return (
    <Box
      role="group"
      aria-label="Date range"
      sx={{
        display: "flex",
        alignItems: "stretch",
        width: "100%",
        boxSizing: "border-box",
        p: `${ANALYTICS_RANGE_SWITCH.padPx}px`,
        border: `1px solid ${ANALYTICS_RANGE_SWITCH.border}`,
        borderRadius: `${ANALYTICS_RANGE_SWITCH.radiusPx}px`,
        bgcolor: ANALYTICS_RANGE_SWITCH.idleBg,
      }}
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <Box
            key={o.id}
            component="button"
            type="button"
            disabled={disabled}
            data-testid={`${testIdPrefix}-${o.id}`}
            aria-pressed={active}
            onClick={() => onChange(o.id)}
            sx={{
              position: "relative",
              flex: "1 1 0",
              minWidth: 0,
              m: 0,
              appearance: "none",
              border: "none",
              cursor: disabled ? "default" : "pointer",
              px: `${ANALYTICS_RANGE_SWITCH.segmentPadXPx}px`,
              py: `${ANALYTICS_RANGE_SWITCH.segmentPadYPx}px`,
              borderRadius: `${ANALYTICS_RANGE_SWITCH.radiusPx}px`,
              bgcolor: active
                ? ANALYTICS_RANGE_SWITCH.selectedBg
                : ANALYTICS_RANGE_SWITCH.idleBg,
              color: active
                ? ANALYTICS_RANGE_SWITCH.selectedColor
                : ANALYTICS_RANGE_SWITCH.idleColor,
              fontFamily: "inherit",
              fontSize: ANALYTICS_RANGE_SWITCH.fontSizePx,
              fontWeight: ANALYTICS_RANGE_SWITCH.fontWeight,
              lineHeight: `${ANALYTICS_RANGE_SWITCH.lineHeightPx}px`,
              textAlign: "center",
              whiteSpace: "nowrap",
              "&::after": {
                content: '""',
                position: "absolute",
                inset: "-6px 0",
              },
            }}
          >
            {o.label}
          </Box>
        );
      })}
    </Box>
  );
}
