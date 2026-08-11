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
