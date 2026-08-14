import { getAppShellNav, getShellPageTitle, type ShellNavItem } from "./nav";

/** Design brief: bottom nav bar `#0B4041` @ 80%. */
export const SHELL_BAR_FILL = "rgba(11, 64, 65, 0.8)";

/** Design brief: active nav icon pill `#082E33` @ 80%, ~16px radius. */
export const SHELL_ACTIVE_PILL_FILL = "rgba(8, 46, 51, 0.8)";
export const SHELL_ACTIVE_PILL_RADIUS_PX = 16;

/** Sign out icon color from design brief / login CTA orange. */
export const SHELL_SIGN_OUT_COLOR = "#f08429";

const HEADER_COPY = {
  eyebrow: "Chronic Yet Iconic",
  signOutAccessibleName: "Sign out",
  subtitles: {
    "/": "Take a look around!",
    "/log": "Track symptoms, vitals, medications, water, mood and other daily events.",
    "/calendar": "Select a day to review everything you logged.",
    "/analytics": "See trends and relationships.",
    "/import": "Upload Apple Health export files to populate your health database.",
  },
} as const;

export type BottomNavChrome = {
  barBackground: typeof SHELL_BAR_FILL;
  items: ShellNavItem[];
};

export type ActiveNavItemChrome = {
  showPill: boolean;
  pillBackground: typeof SHELL_ACTIVE_PILL_FILL | null;
  pillBorderRadiusPx: number;
  labelBelowPill: true;
};

export type ShellHeaderChrome = {
  eyebrow: string;
  eyebrowUppercase: true;
  title: string;
  subtitle: string;
  signOutAccessibleName: string;
  signOutColor: typeof SHELL_SIGN_OUT_COLOR;
};

export function getBottomNavChrome(): BottomNavChrome {
  return {
    barBackground: SHELL_BAR_FILL,
    items: getAppShellNav(),
  };
}

export function getActiveNavItemChrome(isActive: boolean): ActiveNavItemChrome {
  if (isActive) {
    return {
      showPill: true,
      pillBackground: SHELL_ACTIVE_PILL_FILL,
      pillBorderRadiusPx: SHELL_ACTIVE_PILL_RADIUS_PX,
      labelBelowPill: true,
    };
  }
  return {
    showPill: false,
    pillBackground: null,
    pillBorderRadiusPx: SHELL_ACTIVE_PILL_RADIUS_PX,
    labelBelowPill: true,
  };
}

export function getShellHeaderChrome(pathname: string): ShellHeaderChrome {
  const item = getAppShellNav().find((entry) => entry.href === pathname);
  if (!item) {
    throw new Error(`Unknown shell path: ${pathname}`);
  }
  const subtitle =
    HEADER_COPY.subtitles[pathname as keyof typeof HEADER_COPY.subtitles];
  if (!subtitle) {
    throw new Error(`Missing subtitle for shell path: ${pathname}`);
  }
  return {
    eyebrow: HEADER_COPY.eyebrow,
    eyebrowUppercase: true,
    title: getShellPageTitle(item.id),
    subtitle,
    signOutAccessibleName: HEADER_COPY.signOutAccessibleName,
    signOutColor: SHELL_SIGN_OUT_COLOR,
  };
}

export type ScrolledHeaderChrome = {
  sticky: true;
  background: "transparent" | typeof SHELL_BAR_FILL;
};

/** Default transparent; when content scrolls under, `#0B4041` @ 80%. */
export function getScrolledHeaderChrome(isScrolled: boolean): ScrolledHeaderChrome {
  return {
    sticky: true,
    background: isScrolled ? SHELL_BAR_FILL : "transparent",
  };
}

export type ShellNavRoute = {
  label: string;
  href: string;
  title: string;
};

/** Bottom-nav destinations: Home → `/` with title Dashboard, plus siblings. */
export function getShellNavRoutes(): ShellNavRoute[] {
  return getAppShellNav().map((item) => ({
    label: item.label,
    href: item.href,
    title: getShellPageTitle(item.id),
  }));
}

/** Phone column width (brief: phone viewport only; no desktop shell). */
export const SHELL_PHONE_MAX_CONTENT_WIDTH_PX = 430;

export type PhoneFirstShellLayout = {
  mode: "phone-first";
  hasDesktopShellLayout: false;
  hasWideShellLayout: false;
  desktopBreakpointLayouts: [];
  maxContentWidthPx: typeof SHELL_PHONE_MAX_CONTENT_WIDTH_PX;
};

/** MVP shell is a single phone column — no dedicated desktop/wide layouts. */
export function getPhoneFirstShellLayout(): PhoneFirstShellLayout {
  return {
    mode: "phone-first",
    hasDesktopShellLayout: false,
    hasWideShellLayout: false,
    desktopBreakpointLayouts: [],
    maxContentWidthPx: SHELL_PHONE_MAX_CONTENT_WIDTH_PX,
  };
}
