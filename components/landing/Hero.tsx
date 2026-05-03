"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Counter, Reveal, Topo } from "./atoms";

export function Hero() {
  const t = useTranslations("Hero");

  const STATS = [
    {
      num: <Counter to={9} />,
      lab: t("stats.roi.lab"),
      note: t("stats.roi.note"),
    },
    {
      num: <Counter to={14} />,
      lab: t("stats.velocity.lab"),
      note: t("stats.velocity.note"),
    },
    {
      num: <Counter to={10} />,
      lab: t("stats.delivery.lab"),
      note: t("stats.delivery.note"),
    },
    {
      num: <Counter to={12} />,
      lab: t("stats.missions.lab"),
      note: t("stats.missions.note"),
    },
  ];

  return (
    <section
      style={{
        paddingTop: "calc(var(--section-py) + 32px)",
        paddingBottom: "calc(var(--section-py) - 32px)",
        overflow: "hidden",
      }}
    >
      <Topo />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <Reveal>
          <div className="badge" style={{ marginBottom: 32 }}>
            <span className="dot" />
            {t("badge")}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1
            className="display h1"
            style={{ marginBottom: 32, maxWidth: "16ch", letterSpacing: "-0.035em" }}
          >
            {t("titlePart1")}{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
              {t("titleEm")}
            </em>
            {t("titlePart2")}
          </h1>
        </Reveal>

        <div
          className="hero-cta-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)",
            gap: 64,
            alignItems: "end",
            marginTop: 24,
          }}
        >
          <Reveal delay={160}>
            <p className="body-lg" style={{ maxWidth: "50ch", margin: 0 }}>
              {t("subtitle")}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="generator" className="btn btn-accent btn-arrow">
                {t("ctaBook")} <ArrowRight />
              </a>
              <a
                href="https://github.com/jdvot/cordee-ia"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-arrow"
              >
                {t("ctaMethod")} <ArrowRight />
              </a>
            </div>
          </Reveal>
        </div>

        {/* Stats with vertical dividers — premium feel */}
        <Reveal delay={400}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 0,
              marginTop: 96,
              paddingTop: 48,
              borderTop: "1px solid var(--color-border)",
              position: "relative",
            }}
          >
            {STATS.map((s, i) => (
              <div
                key={i}
                className="stat"
                style={{
                  padding: "0 24px",
                  borderRight:
                    i < STATS.length - 1
                      ? "1px solid var(--color-border)"
                      : "none",
                }}
              >
                <div className="num">{s.num}</div>
                <div className="lab">{s.lab}</div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "var(--color-muted)",
                    letterSpacing: "0.08em",
                    marginTop: 6,
                    opacity: 0.7,
                  }}
                >
                  {s.note}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
