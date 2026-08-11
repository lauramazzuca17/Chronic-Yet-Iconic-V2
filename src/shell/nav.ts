/** Copy keys from docs/40-brand/42-copy-deck.md — keep labels in sync with the deck. */
const COPY = {
  "nav.home": "Home",
  "nav.log": "Log",
  "nav.calendar": "Calendar",
  "nav.analytics": "Analytics",
  "nav.import": "Import",
  "shell.title.dashboard": "Dashboard",
  "shell.title.log": "Log",
  "shell.title.calendar": "Calendar",
  "shell.title.analytics": "Analytics",
  "shell.title.import": "Import",
} as const;

export type ShellNavId = "home" | "log" | "calendar" | "analytics" | "import";

export type ShellNavItem = {
  id: ShellNavId;
  href: string;
  labelKey: keyof typeof COPY;
  label: string;
  titleKey: keyof typeof COPY;
};

const NAV: ShellNavItem[] = [
  {
    id: "home",
    href: "/",
    labelKey: "nav.home",
    label: COPY["nav.home"],
    titleKey: "shell.title.dashboard",
  },
  {
    id: "log",
    href: "/log",
    labelKey: "nav.log",
    label: COPY["nav.log"],
    titleKey: "shell.title.log",
  },
  {
    id: "calendar",
    href: "/calendar",
    labelKey: "nav.calendar",
    label: COPY["nav.calendar"],
    titleKey: "shell.title.calendar",
  },
  {
    id: "analytics",
    href: "/analytics",
    labelKey: "nav.analytics",
    label: COPY["nav.analytics"],
    titleKey: "shell.title.analytics",
  },
  {
    id: "import",
    href: "/import",
    labelKey: "nav.import",
    label: COPY["nav.import"],
    titleKey: "shell.title.import",
  },
];

export function getAppShellNav(): ShellNavItem[] {
  return NAV.map((item) => ({ ...item }));
}

export function getShellPageTitle(navId: ShellNavId): string {
  const item = NAV.find((entry) => entry.id === navId);
  if (!item) {
    throw new Error(`Unknown shell nav id: ${navId}`);
  }
  return COPY[item.titleKey];
}
