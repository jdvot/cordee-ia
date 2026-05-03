"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Reveal } from "./atoms";

export function Expertise() {
  const t = useTranslations("Expertise");
  const items = t.raw("items") as Array<{
    t: string;
    d: string;
    tags: string[];
  }>;
  const EXPERTISES = items.map((e, i) => ({
    n: String(i + 1).padStart(2, "0"),
    t: e.t,
    d: e.d,
    tags: e.tags,
  }));

  return (
    <section
      id="expertise"
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="container">
        <div className="section-eyebrow">
          <span className="num">{t("eyebrow")}</span>
          <span className="rule" />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr)",
            gap: 64,
            marginBottom: 64,
          }}
        >
          <Reveal>
            <h2 className="display h2" style={{ margin: 0 }}>
              {t("titlePart1")}
              <br />
              <em
                style={{
                  fontStyle: "italic",
                  color: "var(--color-muted-foreground)",
                }}
              >
                {t("titleEm")}
              </em>
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p
              className="body-lg"
              style={{ margin: 0, alignSelf: "end", maxWidth: "52ch" }}
            >
              {t("intro")}
            </p>
          </Reveal>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 0,
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            background: "var(--color-background)",
          }}
        >
          {EXPERTISES.map((e, i) => (
            <Reveal
              key={i}
              delay={i * 50}
              className="exp-cell"
              style={{
                padding: 40,
                borderRight: "1px solid var(--color-border)",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                transition: "background 250ms var(--ease)",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <span
                  className="display"
                  style={{
                    fontSize: 36,
                    color: "var(--color-accent)",
                    fontStyle: "italic",
                    letterSpacing: "-0.03em",
                  }}
                >
                  {e.n}
                </span>
                <ArrowRight size={18} />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 30,
                  margin: 0,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                {e.t}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "var(--color-muted-foreground)",
                  lineHeight: 1.55,
                }}
              >
                {e.d}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  flexWrap: "wrap",
                  marginTop: "auto",
                }}
              >
                {e.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      padding: "3px 10px",
                      border: "1px solid var(--color-border)",
                      borderRadius: 99,
                      color: "var(--color-muted-foreground)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Personas() {
  const t = useTranslations("Personas");
  const PERSONAS = t.raw("items") as Array<{
    role: string;
    title: string;
    quote: string;
    points: string[];
  }>;
  const [active, setActive] = useState(0);
  const p = PERSONAS[active];

  return (
    <section id="personas">
      <div className="container">
        <div className="section-eyebrow">
          <span className="num">{t("eyebrow")}</span>
          <span className="rule" />
        </div>
        <Reveal>
          <h2 className="display h2" style={{ margin: "0 0 64px", maxWidth: "20ch" }}>
            {t("titlePart1")}{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
              {t("titleEm")}
            </em>{" "}
            {t("titlePart2")}
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1.5fr)",
            gap: 48,
            alignItems: "start",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              borderTop: "1px solid var(--color-border)",
            }}
          >
            {PERSONAS.map((persona, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  textAlign: "left",
                  padding: "24px 0",
                  borderBottom: "1px solid var(--color-border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  transition: "all 200ms var(--ease)",
                  color:
                    active === i
                      ? "var(--color-foreground)"
                      : "var(--color-muted-foreground)",
                  background: "transparent",
                  border: "none",
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                  borderLeftWidth: 0,
                  cursor: "pointer",
                  font: "inherit",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 32,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {active === i && (
                    <span
                      style={{
                        color: "var(--color-accent)",
                        marginRight: 12,
                        fontStyle: "italic",
                      }}
                    >
                      
                    </span>
                  )}
                  {persona.role}
                </span>
                <ArrowRight size={18} />
              </button>
            ))}
          </div>

          <div className="card" style={{ padding: 48, minHeight: 360 }}>
            <div key={active} style={{ animation: "fadeIn 400ms var(--ease)" }}>
              <span className="caption">{p.title}</span>
              <div
                className="display"
                style={{
                  fontSize: "clamp(28px, 3vw, 40px)",
                  margin: "16px 0 32px",
                  lineHeight: 1.1,
                  fontStyle: "italic",
                  color: "var(--color-foreground)",
                }}
              >
                {p.quote}
              </div>
              <div className="caption" style={{ marginBottom: 16 }}>
                {t("whatWeBring")}
              </div>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {p.points.map((pt, j) => (
                  <li
                    key={j}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 14,
                      fontSize: 16,
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 1,
                        background: "var(--color-accent)",
                        marginTop: 12,
                        flexShrink: 0,
                      }}
                    />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  const t = useTranslations("Process");
  const DELIVERABLES = t.raw("deliverables") as Array<{
    w: string;
    t: string;
    d: string;
  }>;

  return (
    <section
      id="process"
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="container">
        <div className="section-eyebrow">
          <span className="num">{t("eyebrow")}</span>
          <span className="rule" />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) minmax(0,1.2fr)",
            gap: 64,
          }}
        >
          <Reveal>
            <div style={{ position: "sticky", top: 120 }}>
              <h2 className="display h2" style={{ margin: "0 0 24px" }}>
                {t("titlePart1")}
                <br />
                <em
                  style={{ fontStyle: "italic", color: "var(--color-accent)" }}
                >
                  {t("titleEm")}
                </em>
              </h2>
              <p
                className="body-lg"
                style={{ margin: "0 0 32px", maxWidth: "44ch" }}
              >
                {t("intro")}
              </p>
              <div className="caption" style={{ marginBottom: 12 }}>
                {t("engagement")}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  rowGap: 8,
                  columnGap: 24,
                  fontSize: 14,
                  fontFamily: "var(--font-mono)",
                }}
              >
                <span style={{ color: "var(--color-muted)" }}>
                  {t("fields.duration")}
                </span>
                <span>{t("fields.durationValue")}</span>
                <span style={{ color: "var(--color-muted)" }}>
                  {t("fields.team")}
                </span>
                <span>{t("fields.teamValue")}</span>
                <span style={{ color: "var(--color-muted)" }}>
                  {t("fields.fee")}
                </span>
                <span>{t("fields.feeValue")}</span>
                <span style={{ color: "var(--color-muted)" }}>
                  {t("fields.start")}
                </span>
                <span>{t("fields.startValue")}</span>
              </div>
            </div>
          </Reveal>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              borderLeft: "1px solid var(--color-border)",
            }}
          >
            {DELIVERABLES.map((d, i) => (
              <Reveal
                key={i}
                delay={i * 80}
                style={{
                  padding: "32px 0 32px 40px",
                  position: "relative",
                  borderBottom:
                    i < DELIVERABLES.length - 1
                      ? "1px solid var(--color-border)"
                      : "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: -7,
                    top: 40,
                    width: 13,
                    height: 13,
                    borderRadius: 99,
                    background: "var(--color-background)",
                    border: "2px solid var(--color-accent)",
                  }}
                />
                <div
                  className="caption"
                  style={{ color: "var(--color-accent)", marginBottom: 8 }}
                >
                  {d.w}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(28px, 3vw, 40px)",
                    margin: "0 0 12px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {d.t}
                </h3>
                <p
                  style={{
                    margin: 0,
                    color: "var(--color-muted-foreground)",
                    maxWidth: "48ch",
                    lineHeight: 1.55,
                  }}
                >
                  {d.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
