/**
 * Calendar layout tokens — FEAT-006 month card + day list (Figma).
 * Kept free of MUI imports so tests can assert the values directly.
 */

export const CALENDAR_LAYOUT = {
  /** Same 16px side gutters as Home and Log. */
  gutterPx: 16,
  cardRadiusPx: 20,
  cardBg: "#FFFFFF",
  cardShadow: "0 4px 4px rgba(12,12,13,0.05), 0 4px 4px rgba(12,12,13,0.1)",
  cardPadPx: 16,
  /**
   * Extra top padding on the month card. Figma's 16px assumes selects with no
   * floating label; our MUI Month/Year labels overhang their boxes and sat only
   * 9px off the card edge, which read as cramped.
   */
  monthCardPadTopPx: 24,
} as const;

/**
 * Month/Year row. 44px visual chevrons + two equal fullWidth selects leave
 * ~72px each at a 320px viewport, so Year ellipsizes to `2…`. Compact
 * chevrons (44px hit via ::after) and a non-shrinking Year field keep
 * `2026` readable; Month takes the leftover.
 */
export const CALENDAR_PICKER = {
  rowGapPx: 8,
  fieldGapPx: 8,
  chevronVisualPx: 24,
  chevronHitPx: 44,
  yearMinWidthPx: 92,
  monthMinWidthPx: 80,
} as const;

/**
 * Shared white card shell. Global `box-sizing: border-box` lives in
 * `tokens.css`; this sx keeps the Calendar overflow regression pinned even
 * if that rule is ever removed.
 */
export const CALENDAR_CARD_SX = {
  bgcolor: CALENDAR_LAYOUT.cardBg,
  borderRadius: `${CALENDAR_LAYOUT.cardRadiusPx}px`,
  boxShadow: CALENDAR_LAYOUT.cardShadow,
  width: "100%",
  boxSizing: "border-box",
} as const;

/**
 * Figma day cell — `62888:11530` (selected day is not today) and
 * `62888:11531` (selected day is today). Selected paints a brand6 rounded
 * square; today is marked by underlining the number, so a cell that is both
 * shows an underlined light number on orange.
 */
export const CALENDAR_DAY = {
  /** Figma cell is 40×40; the button expands invisibly to the 44px a11y floor. */
  visualSizePx: 40,
  hitTargetPx: 44,
  radiusPx: 8,
  gapPx: 1,
  fontSizePx: 16,
  selectedBg: "#f08429",
  selectedColor: "#f5f5f5",
  inMonthColor: "#1e1e1e",
  outOfMonthColor: "#b3b3b3",
  todayDecoration: "underline",
  todayUnderlineOffsetPx: 3,
  weekdayColor: "#757575",
  weekdayFontSizePx: 12,
  weekdayLineHeightPx: 20,
} as const;

/**
 * Figma day grid width: 7 cells + 6 gaps (286px). Applied as a max-width on a
 * fluid grid so narrow phones shrink the cells instead of overflowing.
 */
export const CALENDAR_DAY_GRID_MAX_WIDTH_PX =
  CALENDAR_DAY.visualSizePx * 7 + CALENDAR_DAY.gapPx * 6;

export function getCalendarLayout() {
  return CALENDAR_LAYOUT;
}

export function getCalendarDayLayout() {
  return CALENDAR_DAY;
}

export function getCalendarCardSx() {
  return CALENDAR_CARD_SX;
}

export function getCalendarPickerLayout() {
  return CALENDAR_PICKER;
}
