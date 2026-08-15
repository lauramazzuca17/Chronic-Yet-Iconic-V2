"use client";

import { Box, Button } from "@mui/material";

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
      sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
    >
      {options.map((o) => {
        const active = o.id === value;
        return (
          <Button
            key={o.id}
            type="button"
            size="small"
            disabled={disabled}
            data-testid={`${testIdPrefix}-${o.id}`}
            aria-pressed={active}
            onClick={() => onChange(o.id)}
            sx={{
              borderRadius: "100px",
              textTransform: "none",
              px: "12px",
              minHeight: 36,
              bgcolor: active ? "#8B7E66" : "rgba(11,64,65,0.12)",
              color: active ? "#fff" : "#0B4041",
              "&:hover": {
                bgcolor: active ? "#7a6e59" : "rgba(11,64,65,0.2)",
              },
            }}
          >
            {o.label}
          </Button>
        );
      })}
    </Box>
  );
}
