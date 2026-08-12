import { ShellChrome } from "@/shell/ShellChrome";

export default function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ShellChrome>{children}</ShellChrome>;
}
