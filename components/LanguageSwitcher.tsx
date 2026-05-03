"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

interface Props {
  variant?: "nav" | "footer";
}

export function LanguageSwitcher({ variant = "nav" }: Props) {
  const t = useTranslations("LanguageSwitcher");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // params can include dynamic segments; pass them so the path is reconstructed correctly.
    router.replace(
      // @ts-expect-error -- pathname is type-narrowed against the router's known routes
      { pathname, params },
      { locale: next }
    );
  }

  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "var(--font-mono)",
    fontSize: 12,
    textTransform: "lowercase",
    letterSpacing: "0.04em",
    color:
      variant === "footer"
        ? "var(--color-muted)"
        : "var(--color-muted-foreground)",
  };

  return (
    <div
      role="group"
      aria-label={t("label")}
      style={baseStyle}
      className="lang-switcher"
    >
      {routing.locales.map((l, i) => {
        const isActive = l === locale;
        return (
          <span key={l} style={{ display: "inline-flex", alignItems: "center" }}>
            {i > 0 && (
              <span
                aria-hidden="true"
                style={{ margin: "0 6px", opacity: 0.4 }}
              >
                /
              </span>
            )}
            <button
              type="button"
              onClick={() => switchTo(l)}
              aria-current={isActive ? "true" : undefined}
              aria-label={t(l)}
              style={{
                background: "transparent",
                border: "none",
                padding: "4px 8px",
                cursor: isActive ? "default" : "pointer",
                fontFamily: "inherit",
                fontSize: "inherit",
                letterSpacing: "inherit",
                textTransform: "inherit",
                color: isActive
                  ? "var(--color-accent)"
                  : "inherit",
                fontWeight: isActive ? 500 : 400,
                borderRadius: 6,
                transition: "color 200ms",
              }}
              className="lang-switcher-btn"
            >
              {t(l)}
            </button>
          </span>
        );
      })}
    </div>
  );
}
