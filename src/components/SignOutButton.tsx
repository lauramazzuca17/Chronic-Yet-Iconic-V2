import { logoutAction } from "@/auth/actions";
import { SHELL_SIGN_OUT_COLOR } from "@/shell/chrome";

/**
 * Figma header puts the glyph on the eyebrow row (~20px tall).
 * Keep a ≥44px hit target without stretching the row (that opened a huge
 * gap before "Dashboard").
 */
export function SignOutButton() {
  return (
    <form
      action={logoutAction}
      style={{
        margin: 0,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        height: 20,
      }}
    >
      <button
        type="submit"
        aria-label="Sign out"
        data-testid="sign-out"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: SHELL_SIGN_OUT_COLOR,
          position: "relative",
          width: 16,
          height: 14,
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Sign out"
      >
        {/* Expanded hit target — does not affect header flex layout height */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: "-15px -14px",
          }}
        />
        <img
          src="/icons/sign-out.svg"
          alt=""
          width={16}
          height={14}
          aria-hidden
          style={{ display: "block", width: 16, height: 14, position: "relative" }}
        />
      </button>
    </form>
  );
}
