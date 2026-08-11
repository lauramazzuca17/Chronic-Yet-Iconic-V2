import { SignOutButton } from "@/components/SignOutButton";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 30% 20%, #4a8f7a 0%, transparent 50%), linear-gradient(160deg, #1a4a42 0%, #0b4041 50%, #163a36 100%)",
        color: "#f5f7f6",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Chronic Yet Iconic
        </p>
        <SignOutButton />
      </header>
      {children}
    </div>
  );
}
