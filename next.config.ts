import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // Force inclusion of templates/ in serverless function bundles.
  // Without this, Next.js's tracing only includes JS/TS imports — but the
  // /api/generate route reads templates/ at runtime via fs.readFile, which
  // tracing can't detect statically. So we tell it explicitly.
  outputFileTracingIncludes: {
    "/api/generate": ["./templates/**/*"],
  },
};

export default withNextIntl(nextConfig);
