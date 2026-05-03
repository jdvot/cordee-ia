import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"] as const,
  defaultLocale: "fr",
  localePrefix: "as-needed", // / = FR (default, no prefix) ; /en/... = EN
});

export type Locale = (typeof routing.locales)[number];
