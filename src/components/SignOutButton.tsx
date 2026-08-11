import { logoutAction } from "@/auth/actions";

export function SignOutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        aria-label="Sign out"
        data-testid="sign-out"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#f08429",
          fontSize: "1.25rem",
          lineHeight: 1,
          padding: "8px",
          minWidth: 44,
          minHeight: 44,
        }}
        title="Sign out"
      >
        ⎋
      </button>
    </form>
  );
}
