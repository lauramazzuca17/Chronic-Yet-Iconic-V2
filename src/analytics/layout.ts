/**
 * Analytics visual tokens — Figma Main `62816:27152`, chips `62923:4123`,
 * Medication card `62819:29845`.
 * Behavior stays in FEAT-008; this file is layout/chrome only.
 */

/** Figma Main fill (brand5) under the header pond. */
export const ANALYTICS_BODY_BG = "#082e33";

export const ANALYTICS_CHIP = {
  gapPx: 8,
  padLeftPx: 16,
  padYPx: 10,
  padXPx: 12,
  padChipYPx: 4,
  fontSizePx: 14,
  lineHeightPx: 18,
  radiusPx: 100,
  selectedBg: "#839755",
  selectedColor: "#ffffff",
  unselectedBg: "#0b4041",
  unselectedColor: "#ffffff",
  visualMinHeightPx: 26,
  minHeightPx: 44,
  stripBg: ANALYTICS_BODY_BG,
  stripShadow: "0 1px 2px rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15)",
} as const;

export const ANALYTICS_CARD = {
  radiusPx: 10,
  padPx: 16,
  gapPx: 26,
  introGapPx: 14,
  controlsGapPx: 16,
  titleSizePx: 16,
  titleLineHeightPx: 20,
  titleWeight: 500,
  titleColor: "#000000",
  helperSizePx: 12,
  helperLineHeightPx: 18,
  helperColor: "#5c5c60",
  helperGapPx: 4,
} as const;

export const ANALYTICS_DATE_CONTROL = {
  heightPx: 32,
  radiusPx: 50,
  border: "#c7c7cc",
  endCapWidthPx: 31.5,
  endCapBg: "#ffffff",
  fieldBg: "#ffffff",
  fieldPadXPx: 12,
  fieldPadYPx: 4,
  iconClipPx: 24,
  chevronDrawWidthPx: 7.4,
  chevronDrawHeightPx: 12,
  calendarDrawWidthPx: 14,
  calendarDrawHeightPx: 16,
  dateSizePx: 12,
  dateLineHeightPx: 18,
  dateColor: "#1d1b20",
  chevronBackSrc: "/icons/chevron-backward.svg",
  chevronForwardSrc: "/icons/chevron-forward.svg",
  calendarSrc: "/icons/calendar.svg",
} as const;

export const ANALYTICS_PILL_SELECT = {
  widthPx: 122,
  maxWidthPx: 122,
  heightPx: 32,
  radiusPx: 100,
  border: "#c7c7cc",
  padXPx: 8,
  padYPx: 4,
  gapPx: 6,
  fontSizePx: 12,
  lineHeightPx: 18,
  color: "#1d1b20",
  iconSizePx: 24,
  chevronDrawWidthPx: 10,
  chevronDrawHeightPx: 5,
  labelColor: "#5c5c60",
  labelSizePx: 12,
  labelLineHeightPx: 18,
  rowGapPx: 8,
  unavailableColor: "#8E8E93",
  chevronSrc: "/icons/select-chevron.svg",
} as const;

export const ANALYTICS_CHART_FRAME = {
  heightPx: 180,
  radiusPx: 10,
  bg: "#f2f2f7",
  border: "#d1d1d6",
  borderStyle: "dashed",
} as const;

export const ANALYTICS_PANEL_PAD = {
  padXPx: 16,
  padYPx: 8,
} as const;

/** Chart 2 `62953:4603` — intro vs switch vs chart rhythm. */
export const ANALYTICS_CARDIO = {
  cardGapPx: 16,
  introToControlsGapPx: 16,
} as const;

/** Switch Group `62915:2439` — Today / Last 7 / Last 30. */
export const ANALYTICS_RANGE_SWITCH = {
  padPx: 4,
  border: "#d1d1d6",
  radiusPx: 100,
  selectedBg: "#0b4041",
  selectedColor: "#ffffff",
  idleBg: "#ffffff",
  idleColor: "#1d1b20",
  fontSizePx: 12,
  lineHeightPx: 18,
  fontWeight: 500,
  segmentPadXPx: 13,
  segmentPadYPx: 4,
} as const;

/** Chart 3 Data Disclaimer `62953:4575`. Keep ≥100 copy (owner lock). */
export const ANALYTICS_DISCLAIMER = {
  bg: "#f2f5ed",
  radiusPx: 8,
  padXPx: 18,
  padYPx: 16,
  gapPx: 12,
  iconSizePx: 16,
  iconSrc: "/icons/circle-exclamation.svg",
  titleSizePx: 18,
  titleLineHeightPx: 22,
  titleWeight: 500,
  titleColor: "#367057",
  bodySizePx: 14,
  bodyLineHeightPx: 18,
  bodyColor: "#1d1b20",
} as const;

export function getAnalyticsBodyBackground() {
  return ANALYTICS_BODY_BG;
}

export function getAnalyticsChipLayout() {
  return ANALYTICS_CHIP;
}

export function getAnalyticsCardLayout() {
  return ANALYTICS_CARD;
}

export function getAnalyticsDateControlLayout() {
  return ANALYTICS_DATE_CONTROL;
}

export function getAnalyticsPillSelectLayout() {
  return ANALYTICS_PILL_SELECT;
}

export function getAnalyticsChartFrameLayout() {
  return ANALYTICS_CHART_FRAME;
}

export function getAnalyticsCardioLayout() {
  return ANALYTICS_CARDIO;
}

export function getAnalyticsRangeSwitchLayout() {
  return ANALYTICS_RANGE_SWITCH;
}

export function getAnalyticsDisclaimerLayout() {
  return ANALYTICS_DISCLAIMER;
}

/** Electrolytes main `62967:5994`. */
export const ANALYTICS_ELECTROLYTES = {
  panelGapPx: 8,
  introGapPx: 4,
  titleSizePx: 28,
  titleLineHeightPx: 36,
  titleWeight: 900,
  titleColor: "#ffffff",
  textColor: "#1d1b20",
  helperSizePx: 12,
  helperLineHeightPx: 18,
  helperColor: "#ffffff",
  helperMaxWidthPx: 229,
  heroRadiusPx: 8,
  heroBg: "rgba(255,255,255,0.15)",
  heroPadTopPx: 12,
  heroPadLeftPx: 12,
  heroPadRightPx: 8,
  heroPadBottomPx: 10,
  heroDrawWidthPx: 56,
  heroDrawHeightPx: 54,
  heroSrc: "/icons/electrolytes-drink.svg",
  cardsGapPx: 8,
  cardsPadYPx: 8,
  cardGapPx: 22,
  cardPadXPx: 16,
  cardPadTopPx: 14,
  cardPadBottomPx: 16,
  headerGapPx: 16,
  headerIconSizePx: 60,
  headerIconRadiusPx: 8,
  headerIconBg: "rgba(131,151,85,0.17)",
  headerTitleGapPx: 2,
  headerHelperColor: "#49454f",
  headerHelperLinePx: 15,
  withPadPx: 8,
  withDrawPx: 44,
  withoutPadPx: 5,
  withoutDrawPx: 50,
  statsRowGapPx: 24,
  statsColGapPx: 16,
  metricGapPx: 10,
  metricIconSizePx: 45,
  metricIconPadPx: 8,
  metricIconRadiusPx: 8,
  metricDrawPx: 29,
  labelSizePx: 14,
  labelLinePx: 18,
  valueSizePx: 18,
  valueLinePx: 22,
  valueWeight: 600,
  unitSizePx: 12,
  unitColor: "#79747e",
  divider: "#d1d1d6",
  withSrc: "/icons/electrolytes-with.svg",
  withoutSrc: "/icons/electrolytes-without.svg",
  hrBg: "rgba(141,28,217,0.17)",
  hrSrc: "/icons/electrolytes-hr.svg",
  restingBg: "rgba(28,135,217,0.17)",
  restingSrc: "/icons/electrolytes-resting.svg",
  walkingBg: "rgba(240,132,41,0.17)",
  walkingSrc: "/icons/electrolytes-walking.svg",
  bpBg: "rgba(217,28,28,0.17)",
  bpSrc: "/icons/electrolytes-bp.svg",
} as const;

export function getAnalyticsElectrolytesLayout() {
  return ANALYTICS_ELECTROLYTES;
}
