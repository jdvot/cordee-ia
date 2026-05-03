"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Reveal } from "./atoms";

const ALTITUDES = ["1 200 m", "1 800 m", "2 600 m", "3 400 m", "4 200 m"];

export function Method() {
  const t = useTranslations("Method");
  const phaseEntries = t.raw("phases") as Array<{
    title: string;
    sub: string;
    desc: string;
    out: string[];
  }>;
  const PHASES = phaseEntries.map((p, i) => ({
    n: String(i + 1).padStart(2, "0"),
    title: p.title,
    sub: p.sub,
    desc: p.desc,
    out: p.out,
    alt: ALTITUDES[i] ?? "",
  }));

  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh * 0.6;
      const passed = Math.max(0, Math.min(total, vh * 0.4 - rect.top));
      setProgress(total > 0 ? passed / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="methode">
      <div className="container">
        <div className="section-eyebrow">
          <span className="num">{t("eyebrow")}</span>
          <span className="rule" />
        </div>

        <Reveal>
          <h2 className="display h2" style={{ maxWidth: "16ch", margin: "0 0 24px" }}>
            {t("titlePart1")}{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
              {t("titleEm")}
            </em>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="body-lg" style={{ maxWidth: "56ch", margin: "0 0 80px" }}>
            {t("intro")}
          </p>
        </Reveal>

        <div
          ref={trackRef}
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "120px 1fr",
            gap: 48,
          }}
        >
          {/* Vertical rail */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "sticky", top: "30vh", height: "60vh" }}>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  bottom: 0,
                  width: 1,
                  background: "var(--color-border)",
                  transform: "translateX(-0.5px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  width: 2,
                  height: `${progress * 100}%`,
                  background: "var(--color-accent)",
                  transform: "translateX(-1px)",
                  transition: "height 200ms linear",
                }}
              />
              {PHASES.map((p, i) => {
                const y = (i / (PHASES.length - 1)) * 100;
                const reached = progress >= i / (PHASES.length - 1) - 0.04;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                      width: 14,
                      height: 14,
                      borderRadius: 99,
                      background: reached
                        ? "var(--color-accent)"
                        : "var(--color-background)",
                      border: `2px solid ${
                        reached
                          ? "var(--color-accent)"
                          : "var(--color-border-strong)"
                      }`,
                      transition: "all 300ms var(--ease)",
                      boxShadow: reached
                        ? "0 0 0 6px color-mix(in oklch, var(--color-accent) 18%, transparent)"
                        : "none",
                    }}
                    aria-hidden="true"
                  />
                );
              })}
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--color-muted)",
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {t("summit")}
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: -40,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--color-muted)",
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                }}
              >
                {t("basecamp")}
              </div>
            </div>
          </div>

          {/* Phase blocks */}
          <div style={{ display: "flex", flexDirection: "column", gap: 96 }}>
            {PHASES.map((p, i) => (
              <Reveal
                key={i}
                delay={i * 60}
                style={{
                  minHeight: "60vh",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 24,
                    marginBottom: 16,
                  }}
                >
                  <span
                    className="display"
                    style={{
                      fontSize: 64,
                      color: "var(--color-accent)",
                      fontStyle: "italic",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {p.n}
                  </span>
                  <span className="caption">
                    {p.alt}, {t("phaseLabel")} {p.n}
                  </span>
                </div>
                <h3
                  className="display"
                  style={{
                    fontSize: "clamp(40px, 5vw, 72px)",
                    margin: "0 0 8px",
                    letterSpacing: "-0.025em",
                    lineHeight: 1,
                  }}
                >
                  {p.title}
                </h3>
                <div
                  className="display"
                  style={{
                    fontStyle: "italic",
                    fontSize: 28,
                    color: "var(--color-muted-foreground)",
                    marginBottom: 24,
                  }}
                >
                  {p.sub}
                </div>
                <p className="body-lg" style={{ maxWidth: "52ch", margin: "0 0 32px" }}>
                  {p.desc}
                </p>
                <ul
                  style={{
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {p.out.map((o, j) => (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 15,
                      }}
                    >
                      <span
                        style={{
                          width: 16,
                          height: 1,
                          background: "var(--color-accent)",
                        }}
                      />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
