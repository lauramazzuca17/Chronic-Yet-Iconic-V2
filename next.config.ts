import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB; real Health Export CSV pairs exceed that. Vercel
      // serverless request bodies cap around 4.5MB — stay under that.
      bodySizeLimit: "4mb",
    },
  },
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
