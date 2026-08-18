"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { SignOutButton } from "@/components/SignOutButton";
import {
  getActiveNavItemChrome,
  getBottomNavChrome,
  getPhoneFirstShellLayout,
  getScrolledHeaderChrome,
  getShellHeaderChrome,
  getShellHeaderLayout,
  getShellNavLayout,
} from "@/shell/chrome";
import { ANALYTICS_BODY_BG } from "@/analytics/layout";
import { LOG_BODY_BG } from "@/log/layout";

const NAV_ICONS: Record<string, string> = {
  home: "/icons/nav-home.svg",
  log: "/icons/nav-log.svg",
  calendar: "/icons/nav-calendar.svg",
  analytics: "/icons/nav-analytics.svg",
  import: "/icons/nav-import.svg",
};

const TEXT_SHADOW = "0px 1px 3px rgba(0,0,0,0.3), 0px 4px 8px rgba(0,0,0,0.15)";

export function ShellChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const phone = getPhoneFirstShellLayout();
  const nav = getBottomNavChrome();
  const header = getShellHeaderChrome(pathname);
  const scrolled = getScrolledHeaderChrome(isScrolled);
  const headerLayout = getShellHeaderLayout();
  const navLayout = getShellNavLayout();

  useEffect(() => {
    const scrollEl = contentRef.current;
    if (!scrollEl) return;

    const onScroll = () => setIsScrolled(scrollEl.scrollTop > 0);
    onScroll();
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <div
      style={{
        height: "100dvh",
        overflow: "hidden",
        backgroundColor: "#0b4041",
        backgroundImage: 'url("/images/login-pond.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#ffffff",
        fontFamily: 'var(--font-geist-sans), "Geist", system-ui, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: phone.maxContentWidthPx,
          marginInline: "auto",
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            position: "relative",
            flexShrink: 0,
            zIndex: 10,
            background: scrolled.background,
            transition: `background ${scrolled.backgroundTransitionMs}ms ease`,
            boxSizing: "border-box",
            paddingTop: headerLayout.paddingTopPx,
            paddingBottom: headerLayout.paddingBottomPx,
            paddingLeft: headerLayout.gutterPx,
            paddingRight: headerLayout.gutterPx,
            display: "flex",
            flexDirection: "column",
            gap: headerLayout.stackGapPx,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              width: "100%",
              // Match Figma eyebrow row height — don't let controls inflate gap to title.
              minHeight: headerLayout.eyebrowLineHeightPx,
            }}
          >
            <p
              style={{
                margin: 0,
                flex: 1,
                minWidth: 0,
                fontSize: headerLayout.eyebrowFontSizePx,
                fontWeight: headerLayout.eyebrowFontWeight,
                lineHeight: `${headerLayout.eyebrowLineHeightPx}px`,
                letterSpacing: 0,
                textTransform: header.eyebrowUppercase ? "uppercase" : "none",
                color: "#ffffff",
                textShadow: TEXT_SHADOW,
              }}
            >
              {header.eyebrow}
            </p>
            <SignOutButton />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: headerLayout.titleFontSizePx,
              fontWeight: headerLayout.titleFontWeight,
              lineHeight: `${headerLayout.titleLineHeightPx}px`,
              color: "#ffffff",
              textShadow: TEXT_SHADOW,
            }}
          >
            {header.title}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: headerLayout.subtitleFontSizePx,
              fontWeight: headerLayout.subtitleFontWeight,
              lineHeight: `${headerLayout.subtitleLineHeightPx}px`,
              color: "#ffffff",
              textShadow: TEXT_SHADOW,
              maxWidth: 300,
            }}
          >
            {header.subtitle}
          </p>
        </header>

        <div
          ref={contentRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            overflowX: "hidden",
            paddingBottom: navLayout.barHeightPx,
            // Log Main is brand3; Analytics Main is brand5 (pond stays in header).
            backgroundColor:
              pathname === "/log"
                ? LOG_BODY_BG
                : pathname === "/analytics"
                  ? ANALYTICS_BODY_BG
                  : undefined,
          }}
        >
          {children}
        </div>

        <nav
          aria-label="Primary"
          style={{
            position: navLayout.position,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: navLayout.zIndex,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            height: navLayout.barHeightPx,
            paddingBottom: "env(safe-area-inset-bottom)",
            background: nav.barBackground,
            width: "100%",
            maxWidth: phone.maxContentWidthPx,
            marginInline: "auto",
          }}
        >
          {nav.items.map((item) => {
            const active = pathname === item.href;
            const chrome = getActiveNavItemChrome(active);
            const iconSrc = NAV_ICONS[item.id] ?? NAV_ICONS.home;
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: navLayout.itemGapPx,
                  textDecoration: "none",
                  color: "#ffffff",
                  paddingTop: 8,
                  paddingBottom: 8,
                  boxSizing: "border-box",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: navLayout.iconStateWidthPx,
                    height: navLayout.iconStateHeightPx,
                    borderRadius: chrome.showPill
                      ? chrome.pillBorderRadiusPx
                      : 16,
                    background: chrome.showPill
                      ? (chrome.pillBackground ?? undefined)
                      : "transparent",
                  }}
                >
                  <img
                    src={iconSrc}
                    alt=""
                    width={20}
                    height={16}
                    style={{
                      width: 20,
                      height: "auto",
                      maxHeight: 16,
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </span>
                {chrome.labelBelowPill ? (
                  <span
                    style={{
                      fontSize: navLayout.labelFontSizePx,
                      fontWeight: 500,
                      lineHeight: `${navLayout.labelLineHeightPx}px`,
                      letterSpacing: navLayout.labelTrackingPx,
                      textAlign: "center",
                      color: "#ffffff",
                    }}
                  >
                    {item.label}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
