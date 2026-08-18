"use client";

import {
  Box,
  TextField,
  type TextFieldProps,
} from "@mui/material";
import { LOG_FIELD } from "@/log/layout";

/**
 * Standard MUI outlined TextField locked in the filled (shrunk-label) state.
 * Matches Figma Outlined Text Field: Geist 12/18 label on notch, 16/24 value.
 */
export const logOutlinedFieldSx = {
  width: "100%",
  "& .MuiOutlinedInput-root": {
    height: LOG_FIELD.heightPx,
    borderRadius: `${LOG_FIELD.radiusPx}px`,
    bgcolor: "#ffffff",
    fontSize: LOG_FIELD.inputSizePx,
    fontWeight: LOG_FIELD.inputWeight,
    lineHeight: `${LOG_FIELD.inputLineHeightPx}px`,
    fontFamily: "inherit",
    "& fieldset": {
      borderColor: LOG_FIELD.border,
      borderWidth: 1,
    },
    "&:hover fieldset": {
      borderColor: LOG_FIELD.border,
    },
    "&.Mui-focused fieldset": {
      borderColor: LOG_FIELD.border,
      borderWidth: 1,
    },
    "&.Mui-disabled": {
      bgcolor: LOG_FIELD.disabledBg,
      "& fieldset": { borderColor: LOG_FIELD.border },
      "& .MuiOutlinedInput-input": {
        color: LOG_FIELD.disabledText,
        // MUI paints disabled text via text-fill-color, not color.
        WebkitTextFillColor: LOG_FIELD.disabledText,
      },
    },
    "& .MuiOutlinedInput-input": {
      height: "100%",
      boxSizing: "border-box",
      py: 0,
      px: `${LOG_FIELD.padXPx}px`,
      fontSize: LOG_FIELD.inputSizePx,
      lineHeight: `${LOG_FIELD.inputLineHeightPx}px`,
      fontWeight: LOG_FIELD.inputWeight,
      color: LOG_FIELD.inputColor,
      fontFamily: "inherit",
      "&::placeholder": {
        color: LOG_FIELD.inputColor,
        opacity: 1,
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: LOG_FIELD.labelSizePx,
    lineHeight: `${LOG_FIELD.labelLineHeightPx}px`,
    fontWeight: 400,
    fontFamily: "inherit",
    color: LOG_FIELD.labelColor,
    transform: "translate(12px, 16px) scale(1)",
    "&.MuiInputLabel-shrink": {
      fontSize: LOG_FIELD.labelSizePx,
      lineHeight: `${LOG_FIELD.labelLineHeightPx}px`,
      // Keep 12px on the notch (no MUI 0.75 scale-down).
      transform: "translate(12px, -8px) scale(1)",
      color: LOG_FIELD.labelColor,
    },
    "&.Mui-focused": {
      color: LOG_FIELD.labelColor,
    },
    "&.Mui-disabled": {
      color: LOG_FIELD.disabledText,
    },
  },
  "& .MuiFormLabel-asterisk": { display: "none" },
  "& .MuiOutlinedInput-notchedOutline legend": {
    fontSize: LOG_FIELD.labelSizePx,
    maxWidth: "100%",
  },
  // Select caret / adornments stay inside the 56px field.
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    height: "100%",
    py: 0,
    boxSizing: "border-box",
  },
} as const;

const multilineSx = {
  ...logOutlinedFieldSx,
  "& .MuiOutlinedInput-root": {
    ...logOutlinedFieldSx["& .MuiOutlinedInput-root"],
    height: "auto",
    minHeight: LOG_FIELD.heightPx,
    alignItems: "flex-start",
    py: 1.5,
  },
} as const;

export type LogOutlinedFieldProps = Omit<TextFieldProps, "variant"> & {
  /** When false, skip the Figma pt-8 wrapper (rare). Default true. */
  withTopOffset?: boolean;
};

export function LogOutlinedField({
  withTopOffset = true,
  multiline,
  slotProps,
  sx,
  ...rest
}: LogOutlinedFieldProps) {
  const field = (
    <TextField
      variant="outlined"
      fullWidth
      multiline={multiline}
      sx={[multiline ? multilineSx : logOutlinedFieldSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      slotProps={{
        ...slotProps,
        inputLabel: {
          shrink: LOG_FIELD.labelAlwaysShrunk,
          required: false,
          ...(typeof slotProps?.inputLabel === "object"
            ? slotProps.inputLabel
            : null),
        },
      }}
      {...rest}
    />
  );

  if (!withTopOffset) return field;

  return (
    <Box
      sx={{
        width: "100%",
        pt: `${LOG_FIELD.topOffsetPx}px`,
        boxSizing: "border-box",
      }}
    >
      {field}
    </Box>
  );
}
