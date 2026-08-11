import { getShellPageTitle } from "@/shell/nav";

export default function CalendarPage() {
  return (
    <main style={{ padding: "0 16px 24px" }}>
      <h1>{getShellPageTitle("calendar")}</h1>
      <p>This section is next.</p>
    </main>
  );
}
