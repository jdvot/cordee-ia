import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

// Per-route OG image, served at /opengraph-image when crawled.
// Generated dynamically at request time, cached by Vercel CDN.

export const runtime = "edge";
export const alt = "Cordée.IA — Bootstrap a Claude Code project in 2 minutes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Hero" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background:
            "linear-gradient(135deg, #F8F7F4 0%, #EFEDE7 50%, #F8F7F4 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top: badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            color: "#1A2B3C",
            opacity: 0.7,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "monospace",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 99,
              background: "#D4824A",
            }}
          />
          {t("badge")}
        </div>

        {/* Middle: title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 88,
            color: "#1A2B3C",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          <div style={{ display: "flex" }}>{t("titlePart1")}</div>
          <div style={{ display: "flex", color: "#D4824A", fontStyle: "italic" }}>
            {t("titleEm")}
          </div>
          <div style={{ display: "flex" }}>{t("titlePart2")}</div>
        </div>

        {/* Bottom: brand */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: "#1A2B3C",
            fontFamily: "Georgia, serif",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="48" height="48" viewBox="0 0 32 32">
              <path
                d="M6 24 L16 8 L26 24 Z"
                fill="none"
                stroke="#1A2B3C"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
              <path
                d="M11 24 L16 16 L21 24"
                fill="none"
                stroke="#D4824A"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              Cordée<span style={{ color: "#D4824A" }}>.</span>IA
            </span>
          </div>
          <div
            style={{
              fontSize: 18,
              opacity: 0.55,
              fontFamily: "monospace",
              letterSpacing: "0.08em",
            }}
          >
            cordee-ia.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
