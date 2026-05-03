"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, CordeeMark, Reveal } from "./atoms";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Faq() {
  const t = useTranslations("Faq");
  const FAQ_ITEMS = t.raw("items") as Array<{ q: string; a: string }>;
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="faq">
      <div className="container">
        <div className="section-eyebrow">
          <span className="num">{t("eyebrow")}</span>
          <span className="rule" />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1.6fr)",
            gap: 64,
            alignItems: "start",
          }}
        >
          <Reveal>
            <h2 className="display h2" style={{ margin: 0 }}>
              {t("titlePart1")}
              <br />
              <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
                {t("titleEm")}
              </em>
            </h2>
            <p className="body-lg" style={{ marginTop: 24, maxWidth: "36ch" }}>
              {t("intro")}
            </p>
          </Reveal>

          <div>
            {FAQ_ITEMS.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  style={{
                    borderTop: i === 0 ? "1px solid var(--color-border)" : "none",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "24px 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 24,
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      font: "inherit",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(20px, 2vw, 26px)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.3,
                        color: isOpen
                          ? "var(--color-foreground)"
                          : "var(--color-muted-foreground)",
                        transition: "color 200ms",
                      }}
                    >
                      {item.q}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        width: 32,
                        height: 32,
                        borderRadius: 99,
                        border: "1px solid var(--color-border)",
                        display: "grid",
                        placeItems: "center",
                        color: isOpen
                          ? "var(--color-accent)"
                          : "var(--color-muted-foreground)",
                        transition: "all 200ms",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <line
                          x1="12"
                          y1="5"
                          x2="12"
                          y2="19"
                          style={{
                            transition: "transform 300ms var(--ease)",
                            transform: isOpen ? "scaleY(0)" : "scaleY(1)",
                            transformOrigin: "center",
                          }}
                        />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </span>
                  </button>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      transition: "grid-template-rows 400ms var(--ease)",
                    }}
                  >
                    <div style={{ overflow: "hidden" }}>
                      <p
                        style={{
                          margin: 0,
                          paddingBottom: 28,
                          color: "var(--color-muted-foreground)",
                          maxWidth: "60ch",
                          fontSize: 16,
                          lineHeight: 1.65,
                        }}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  const t = useTranslations("CTA");
  return (
    <section id="cta" style={{ position: "relative", overflow: "hidden" }}>
      <div className="container-wide">
        <div
          style={{
            position: "relative",
            borderRadius: "var(--radius-xl)",
            padding: "clamp(48px, 8vw, 120px)",
            background: "var(--color-primary)",
            color: "var(--color-primary-foreground)",
            overflow: "hidden",
          }}
        >
          <svg
            viewBox="0 0 800 400"
            preserveAspectRatio="xMidYMid slice"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.18,
            }}
            aria-hidden="true"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <ellipse
                key={i}
                cx="700"
                cy="380"
                rx={120 + i * 80}
                ry={(120 + i * 80) * 0.7}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "grid",
              gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)",
              gap: 64,
              alignItems: "end",
            }}
          >
            <Reveal>
              <div
                className="caption"
                style={{ color: "var(--color-accent)", marginBottom: 24 }}
              >
                {t("eyebrow")}
              </div>
              <h2
                className="display"
                style={{
                  fontSize: "clamp(48px, 7vw, 96px)",
                  margin: "0 0 24px",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.0,
                }}
              >
                {t("titlePart1")}
                <br />
                {t("titlePart2")}{" "}
                <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
                  {t("titleEm")}
                </em>
              </h2>
              <p
                className="body-lg"
                style={{
                  color:
                    "color-mix(in oklch, var(--color-primary-foreground) 75%, transparent)",
                  margin: 0,
                  maxWidth: "48ch",
                }}
              >
                {t("intro")}
              </p>
            </Reveal>

            <Reveal
              delay={120}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                alignItems: "flex-start",
              }}
            >
              <a
                href="/generator"
                className="btn btn-accent btn-arrow"
                style={{ padding: "16px 28px", fontSize: 16 }}
              >
                {t("ctaBook")} <ArrowRight size={16} />
              </a>
              <a
                href="mailto:contact@cordee.ia"
                style={{
                  color:
                    "color-mix(in oklch, var(--color-primary-foreground) 75%, transparent)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  borderBottom: "1px dashed currentColor",
                  paddingBottom: 2,
                }}
              >
                contact@cordee.ia
              </a>
              <div
                className="caption"
                style={{
                  color:
                    "color-mix(in oklch, var(--color-primary-foreground) 50%, transparent)",
                  marginTop: 24,
                }}
              >
                {t("responseTime")}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function FootCol({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; href: string; external?: boolean }>;
}) {
  return (
    <div>
      <div className="caption" style={{ marginBottom: 20 }}>
        {title}
      </div>
      <ul
        style={{
          margin: 0,
          padding: 0,
          listStyle: "none",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href}
              {...(it.external
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: 14,
                transition: "color 200ms",
              }}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-border)",
        paddingTop: 80,
        paddingBottom: 48,
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.5fr) repeat(3, minmax(0,1fr))",
            gap: 48,
            marginBottom: 80,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <CordeeMark size={28} />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  letterSpacing: "-0.02em",
                }}
              >
                Cordée
                <span style={{ color: "var(--color-accent)" }}>.</span>IA
              </span>
            </div>
            <p
              style={{
                margin: "0 0 24px",
                color: "var(--color-muted-foreground)",
                maxWidth: "32ch",
                lineHeight: 1.55,
              }}
            >
              {t("tagline")}
            </p>
            <div className="caption" style={{ marginBottom: 16 }}>
              {t("cities")}
            </div>
            <LanguageSwitcher variant="footer" />
          </div>

          <FootCol
            title={t("cabinet")}
            items={(t.raw("cabinetLinks") as string[]).map((label, i) => ({
              label,
              href: ["/#methode", "/#expertise", "/#personas", "/#use-cases", "/#faq"][i] ?? "/",
            }))}
          />
          <FootCol
            title={t("resources")}
            items={(t.raw("resourcesLinks") as string[]).map((label, i) => ({
              label,
              href: [
                "https://github.com/jdvot/cordee-ia",
                "https://github.com/jdvot/cordee-ia/blob/main/USE_CASES.md",
                "https://github.com/jdvot/cordee-ia/blob/main/CONTRIBUTING.md",
                "https://github.com/jdvot/cordee-ia/blob/main/CHANGELOG.md",
                "https://github.com/jdvot/cordee-ia/issues",
              ][i] ?? "https://github.com/jdvot/cordee-ia",
              external: true,
            }))}
          />
          <FootCol
            title={t("legal")}
            items={(t.raw("legalLinks") as string[]).map((label, i) => ({
              label,
              href: [
                "https://github.com/jdvot/cordee-ia/blob/main/LICENSE",
                "https://github.com/jdvot/cordee-ia#privacy",
                "https://github.com/jdvot/cordee-ia/blob/main/CODE_OF_CONDUCT.md",
                "mailto:julien.dvt57@gmail.com",
              ][i] ?? "/",
              external: i < 3,
            }))}
          />
        </div>

        <div className="divider" style={{ marginBottom: 32 }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            color: "var(--color-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
          }}
        >
          <span>{t("copyright")}</span>
          <span>{t("version")}</span>
        </div>
      </div>
    </footer>
  );
}
