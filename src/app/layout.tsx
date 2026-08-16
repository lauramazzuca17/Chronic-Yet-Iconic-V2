import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { DM_Sans } from "next/font/google";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable} style={{ height: "100%" }}>
      <body style={{ margin: 0, minHeight: "100%", overflowX: "hidden" }}>
        <AppRouterCacheProvider>{children}</AppRouterCacheProvider>
      </body>
    </html>
  );
}
