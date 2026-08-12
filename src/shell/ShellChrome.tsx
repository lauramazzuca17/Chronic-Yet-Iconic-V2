"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { SignOutButton } from "@/components/SignOutButton";
import {
  getActiveNavItemChrome,
  getBottomNavChrome,
  getPhoneFirstShellLayout,
  getScrolledHeaderChrome,
  getShellHeaderChrome,
} from "@/shell/chrome";

export function ShellChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const phone = getPhoneFirstShellLayout();
  const nav = getBottomNavChrome();
  const header = getShellHeaderChrome(pathname);
  const scrolled = getScrolledHeaderChrome(isScrolled);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(ellipse at 30% 20%, #4a8f7a 0%, transparent 50%), linear-gradient(160deg, #1a4a42 0%, #0b4041 50%, #163a36 100%)",
        color: "#f5f7f6",
      }}
    >
      <div
        style={{
          maxWidth: phone.maxContentWidthPx,
          marginInline: "auto",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header
          style={{
            position: scrolled.sticky ? "sticky" : "relative",
            top: 0,
            zIndex: 10,
            background: scrolled.background,
            padding: "12px 16px 8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.7rem",
                letterSpacing: "0.12em",
                textTransform: header.eyebrowUppercase ? "uppercase" : "none",
              }}
            >
              {header.eyebrow}
            </p>
            <SignOutButton />
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: "1.75rem", fontWeight: 600 }}>
            {header.title}
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: "0.95rem" }}>
            {header.subtitle}
          </p>
        </header>

        <div style={{ flex: 1, paddingBottom: 88 }}>{children}</div>

        <nav
          aria-label="Primary"
          style={{
            position: "sticky",
            bottom: 0,
            zIndex: 10,
            display: "flex",
            justifyContent: "space-around",
            alignItems: "flex-end",
            gap: 4,
            padding: "8px 8px calc(8px + env(safe-area-inset-bottom))",
            background: nav.barBackground,
          }}
        >
          {nav.items.map((item) => {
            const active = pathname === item.href;
            const chrome = getActiveNavItemChrome(active);
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  textDecoration: "none",
                  color: "#f5f7f6",
                  fontSize: "0.7rem",
                  minWidth: 44,
                  minHeight: 44,
                  padding: "4px 6px",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 36,
                    height: 36,
                    borderRadius: chrome.showPill
                      ? chrome.pillBorderRadiusPx
                      : 0,
                    background: chrome.showPill
                      ? chrome.pillBackground ?? undefined
                      : "transparent",
                    fontSize: "1.1rem",
                  }}
                >
                  {navIcon(item.id)}
                </span>
                {chrome.labelBelowPill ? <span>{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

function navIcon(id: string): string {
  switch (id) {
    case "home":
      return "⌂";
    case "log":
      return "✎";
    case "calendar":
      return "▦";
    case "analytics":
      return "◔";
    case "import":
      return "⇩";
    default:
      return "•";
  }
}
