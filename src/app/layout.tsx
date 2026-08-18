import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { DM_Sans } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "@/styles/tokens.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["200", "500"],
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chronic Yet Iconic",
  description: "Make sense of your health trends",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${GeistSans.variable}`}
      style={{ height: "100%" }}
    >
      <body
        style={{
          margin: 0,
          minHeight: "100%",
          overflowX: "hidden",
          fontFamily: 'var(--font-geist-sans), "Geist", system-ui, sans-serif',
        }}
      >
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
