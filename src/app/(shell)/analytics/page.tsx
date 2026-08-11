import { getShellPageTitle } from "@/shell/nav";

export default function AnalyticsPage() {
  return (
    <main style={{ padding: "0 16px 24px" }}>
      <h1>{getShellPageTitle("analytics")}</h1>
      <p>This section is next.</p>
    </main>
  );
}
