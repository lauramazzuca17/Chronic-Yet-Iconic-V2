import { getShellPageTitle } from "@/shell/nav";

export default function ImportPage() {
  return (
    <main style={{ padding: "0 16px 24px" }}>
      <h1>{getShellPageTitle("import")}</h1>
      <p>This section is next.</p>
    </main>
  );
}
