import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  // Drizzle migrator reads drizzle/meta/_journal.json at runtime (getDb on login).
  outputFileTracingIncludes: {
    "/*": ["./drizzle/**/*"],
    "/login": ["./drizzle/**/*"],
  },
  allowedDevOrigins: ["127.0.0.1"],
  // Default bottom-left covers Home/Log on phone-width; keep taps free.
  devIndicators: {
    position: "top-right",
  },
  async rewrites() {
    // Browsers still request /favicon.ico; serve the PNG asset.
    return [{ source: "/favicon.ico", destination: "/favicon.png" }];
  },
};

export default nextConfig;
