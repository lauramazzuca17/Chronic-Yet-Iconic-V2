/**
 * Log screen visual tokens — Figma Main `62898:1748` (+ entry card `62910:6163`).
 * Behavior stays in FEAT-004; this file is layout/chrome only.
 */

import { TAKEN_BADGE } from "@/components/taken-badge";

/** Figma Log page body under header (brand3). */
export const LOG_BODY_BG = "#b7cc87";

/** Figma Main body band (`62898:1749`) pb 8 above bottom nav. */
export const LOG_BODY_PAD_BOTTOM_PX = 8;

export const LOG_CHIP = {
  gapPx: 8,
  padLeftPx: 16,
  padYPx: 10,
  padXPx: 12,
  padChipYPx: 4,
  fontSizePx: 14,
  lineHeightPx: 18,
  radiusPx: 100,
  selectedBg: "#f08429",
  selectedColor: "#ffffff",
  unselectedBg: "#ffffff",
  unselectedColor: "#49454f",
  unselectedShadow: "0 1px 2px rgba(0,0,0,0.12)",
  visualMinHeightPx: 26,
  minHeightPx: 44,
  /** Chip strip py when Today list is empty (tighter viewport fit). */
  compactPadYPx: 6,
  /**
   * Figma Chip groups fill (brand3): the sticky strip is opaque so scrolling
   * body content is clipped at its edge rather than visible behind the chips.
   */
  stripBg: LOG_BODY_BG,
} as const;

export const LOG_CARD = {
  radiusPx: 12,
  padXPx: 16,
  /** Figma form + Today cards use py 18 (not form field offset). */
  padYPx: 18,
  stackGapPx: 16,
  listGapPx: 8,
  /** Tighter vertical rhythm when Today is empty (fits viewport without scroll). */
  compactStackGapPx: 8,
  compactPadYPx: 10,
  titleSizePx: 20,
  titleLineHeightPx: 28,
  titleWeight: 600,
  titleColor: "#1d1b20",
  countSizePx: 12,
  countLineHeightPx: 16,
  countColor: "#71717b",
} as const;

/**
 * MUI outlined TextField locked in “filled” (shrunk label) state.
 * Type: cyi/disclaimer/regular (label) + cyi/bodytall/regular (value).
 */
export const LOG_FIELD = {
  heightPx: 56,
  radiusPx: 4,
  border: "#d1d1d6",
  labelColor: "#484649",
  labelSizePx: 12,
  labelLineHeightPx: 18,
  inputColor: "#1c1b1f",
  inputSizePx: 16,
  inputLineHeightPx: 24,
  inputWeight: 400,
  padXPx: 12,
  /** Figma wraps each outlined field with pt-8 for the notch label. */
  topOffsetPx: 8,
  gapPx: 16,
  labelAlwaysShrunk: true,
  /** Figma disabled field — Electrolytes already taken (`62907:2282`). */
  disabledBg: "#fafafa",
  disabledText: "#79747e",
} as const;

/**
 * Figma inline stat pill that sits beside a field on its row:
 * Water "Today's Total" (`62906:2164`) and Electrolytes "Taken"
 * (`62907:5537` not taken / `62907:2282` taken).
 */
export const LOG_STAT_PILL = {
  bg: TAKEN_BADGE.bg,
  radiusPx: TAKEN_BADGE.radiusPx,
  padXPx: TAKEN_BADGE.padXPx,
  padYPx: TAKEN_BADGE.padYPx,
  gapPx: TAKEN_BADGE.gapPx,
  /** Gap between the pill and the field sharing its row. */
  rowGapPx: 8,
  labelColor: TAKEN_BADGE.labelColor,
  labelSizePx: TAKEN_BADGE.labelSizePx,
  labelLineHeightPx: TAKEN_BADGE.labelLineHeightPx,
  valueColor: "#1d1b20",
  valueSizePx: 24,
  valueLineHeightPx: 26,
  valueWeight: 600,
  waterWidthPx: 132,
  takenWidthPx: TAKEN_BADGE.widthPx,
  iconSizePx: TAKEN_BADGE.iconSizePx,
} as const;

/** Figma Electrolytes-taken notice replaces the CTA (`62907:2282`). */
export const LOG_BLOCKED_MESSAGE = {
  sizePx: 12,
  lineHeightPx: 18,
  color: "#000000",
} as const;

/** Figma M3 small filled button — compact, not full-width / not 44px tall. */
export const LOG_CTA = {
  bg: "#f08429",
  color: "#ffffff",
  radiusPx: 6,
  padXPx: 10,
  padYPx: 4,
  fontSizePx: 14,
  lineHeightPx: 20,
  fontWeight: 500,
  letterSpacingPx: 0.1,
  /** Visual height ≈ py + line; expand hit target separately. */
  visualMinHeightPx: 28,
  minHitHeightPx: 44,
} as const;

export const LOG_ENTRY_CARD = {
  radiusPx: 8,
  padXPx: 12,
  padYPx: 8,
  gapPx: 4,
  border: "#d1d5dc",
  eyebrowSizePx: 11,
  eyebrowLineHeightPx: 16,
  eyebrowWeight: 300,
  eyebrowTrackingPx: -0.75,
  eyebrowColor: "#71717b",
  valueSizePx: 12,
  valueLineHeightPx: 16,
  valueWeight: 300,
  valueColor: "#1d1b20",
  deleteSizePx: 12,
  deleteLineHeightPx: 16,
  deleteWeight: 400,
  deleteColor: "#71717b",
  confirmDeleteColor: "#d95c1c",
} as const;

export function getLogChipLayout() {
  return LOG_CHIP;
}

export function getLogCardLayout() {
  return LOG_CARD;
}

export function getLogFieldLayout() {
  return LOG_FIELD;
}

export function getLogCtaLayout() {
  return LOG_CTA;
}

export function getLogEntryCardLayout() {
  return LOG_ENTRY_CARD;
}

export function getLogStatPillLayout() {
  return LOG_STAT_PILL;
}

export function getLogBlockedMessageLayout() {
  return LOG_BLOCKED_MESSAGE;
}

export function getLogBodyPadBottom() {
  return LOG_BODY_PAD_BOTTOM_PX;
}

export function getLogBodyBackground() {
  return LOG_BODY_BG;
}
