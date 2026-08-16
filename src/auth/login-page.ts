/**
 * Login page copy — values from docs/40-brand/42-copy-deck.md.
 * UI components must read through this helper (no ad-hoc strings).
 */
export type LoginPageCopy = {
  submit: string;
  usernameLabel: string;
  passwordLabel: string;
  errorInvalid: string;
};

const LOGIN_COPY: LoginPageCopy = {
  submit: "Sign In",
  usernameLabel: "Username",
  passwordLabel: "Password",
  errorInvalid: "Username or password is wrong.",
};

export function getLoginPageCopy(): LoginPageCopy {
  return { ...LOGIN_COPY };
}

/** Sign In CTA styles — Figma submitting: #f08429 @ 65% opacity + disabled. */
export function getSignInSubmitButtonState(submitting: boolean): {
  disabled: boolean;
  backgroundColor: "#f08429";
  opacity: number;
} {
  return {
    disabled: submitting,
    backgroundColor: "#f08429",
    opacity: submitting ? 0.65 : 1,
  };
}

/**
 * Login visual layout — Figma `62827:29846` + login-page-brief
 * (owner lock: fluid card width with 38px side margins).
 */
export type LoginPageLayout = {
  sideMarginPx: 38;
  cardWidth: "fluid";
  fixedCardWidthPx: null;
  pondBackgroundSrc: "/images/login-pond.png";
  cardBorderRadiusPx: 22;
  cardPaddingTopPx: 19;
  cardPaddingBottomPx: 23;
  cardPaddingXPx: 28;
  stackGapPx: 10;
  fieldGapPx: 16;
  /** Viewport-locked login: no Figma artboard top pad (that caused scroll on phones). */
  mainPaddingTopPx: 0;
  locksToViewport: true;
  /** Nudge card+koi down without growing document height (transform). */
  stackOffsetYPx: 20;
  /** Always reserve this box so async Lottie does not shift the form. */
  reserveKoiSlot: true;
  koiSizePx: 177;
  koiGapFromCardPx: 10;
  ctaFullWidth: false;
  ctaBorderRadiusPx: 100;
  ctaBackground: "#f08429";
  /** Figma MD3 small filled: state-layer px 16 / py 4; label medium 14/20. */
  ctaPaddingXPx: 16;
  ctaPaddingYPx: 4;
  ctaFontWeight: 500;
  ctaFontSizePx: 14;
  ctaLineHeightPx: 20;
  ctaLetterSpacingPx: 0.1;
  fieldHeightPx: 56;
  fieldBorderRadiusPx: 4;
  fieldPaddingXPx: 12;
  fieldLabelSizePx: 12;
  fieldInputSizePx: 16;
  /** Labels sit on the outline notch even when empty (Figma). */
  fieldLabelAlwaysShrunk: true;
  errorColor: "#d95c1c";
  errorFontSizePx: 12;
  wordmark: {
    fontFamily: "DM Sans";
    chronicIconicWeight: 200;
    yetWeight: 500;
    yetItalic: true;
    yetColor: "#367057";
    chronicIconicColor: "#1d1b20";
    sizePx: 28;
    lineHeightPx: 36;
  };
  fieldBorderColor: "#d1d1d6";
  fieldLabelColor: "#484649";
  fieldInputColor: "#1c1b1f";
  cardShadow: "0 4px 4px rgba(0, 0, 0, 0.15), 0 1px 1.5px rgba(0, 0, 0, 0.3)";
};

export function getLoginPageLayout(): LoginPageLayout {
  return {
    sideMarginPx: 38,
    cardWidth: "fluid",
    fixedCardWidthPx: null,
    pondBackgroundSrc: "/images/login-pond.png",
    cardBorderRadiusPx: 22,
    cardPaddingTopPx: 19,
    cardPaddingBottomPx: 23,
    cardPaddingXPx: 28,
    stackGapPx: 10,
    fieldGapPx: 16,
    mainPaddingTopPx: 0,
    locksToViewport: true,
    stackOffsetYPx: 20,
    reserveKoiSlot: true,
    koiSizePx: 177,
    koiGapFromCardPx: 10,
    ctaFullWidth: false,
    ctaBorderRadiusPx: 100,
    ctaBackground: "#f08429",
    ctaPaddingXPx: 16,
    ctaPaddingYPx: 4,
    ctaFontWeight: 500,
    ctaFontSizePx: 14,
    ctaLineHeightPx: 20,
    ctaLetterSpacingPx: 0.1,
    fieldHeightPx: 56,
    fieldBorderRadiusPx: 4,
    fieldPaddingXPx: 12,
    fieldLabelSizePx: 12,
    fieldInputSizePx: 16,
    fieldLabelAlwaysShrunk: true,
    errorColor: "#d95c1c",
    errorFontSizePx: 12,
    wordmark: {
      fontFamily: "DM Sans",
      chronicIconicWeight: 200,
      yetWeight: 500,
      yetItalic: true,
      yetColor: "#367057",
      chronicIconicColor: "#1d1b20",
      sizePx: 28,
      lineHeightPx: 36,
    },
    fieldBorderColor: "#d1d1d6",
    fieldLabelColor: "#484649",
    fieldInputColor: "#1c1b1f",
    cardShadow: "0 4px 4px rgba(0, 0, 0, 0.15), 0 1px 1.5px rgba(0, 0, 0, 0.3)",
  };
}
