import { getShellPageTitle } from "@/shell/nav";

export default function LogPage() {
  return (
    <main style={{ padding: "0 16px 24px" }}>
      <h1>{getShellPageTitle("log")}</h1>
      <p>This section is next.</p>
    </main>
  );
}
