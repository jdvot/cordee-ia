import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cordee-ia.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = ["", "/generator"];
  const out: MetadataRoute.Sitemap = [];

  for (const p of paths) {
    // Default-locale URLs (no /fr prefix when localePrefix: "as-needed")
    out.push({
      url: `${SITE_URL}${p}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: p === "" ? 1.0 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((loc) => [
            loc,
            loc === routing.defaultLocale
              ? `${SITE_URL}${p}`
              : `${SITE_URL}/${loc}${p}`,
          ])
        ),
      },
    });
  }

  return out;
}
