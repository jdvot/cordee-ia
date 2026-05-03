"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "./atoms";

const PHASES = [
  {
    n: "01",
    title: "Reconnaissance",
    sub: "Cartographier le terrain",
    desc: "Audit éclair de votre paysage IA : cas d'usage, données, équipes, contraintes réglementaires. On sépare les sommets accessibles des faux espoirs.",
    out: ["Diagnostic en 10 jours", "Carte des cas d'usage", "Matrice valeur × risque"],
    alt: "1 200 m",
  },
  {
    n: "02",
    title: "Encordement",
    sub: "Aligner la cordée",
    desc: "Atelier dirigeants + équipe tech. On définit les rôles, les garde-fous, le rythme. Aucune ascension ne réussit sans encordement clair.",
    out: ["Charte IA interne", "Comité de pilotage", "Cadrage des 5 priorités"],
    alt: "1 800 m",
  },
  {
    n: "03",
    title: "Acclimatation",
    sub: "Pilote sur cas réel",
    desc: "Un cas d'usage, ciblé, livré en six semaines. RAG, agents, fine-tuning : on choisit la bonne corde pour la bonne paroi. Pas de démo jouet.",
    out: ["Pilote en production", "Mesure ROI baseline", "Équipe interne formée"],
    alt: "2 600 m",
  },
  {
    n: "04",
    title: "Ascension",
    sub: "Industrialiser",
    desc: "Passage à l'échelle : MLOps, observabilité, gouvernance. La cordée monte régulière, sans à-coups. Vous n'aurez pas besoin de nous pour la phase suivante.",
    out: ["Plateforme IA interne", "SLO + monitoring", "Plan de transfert"],
    alt: "3 400 m",
  },
  {
    n: "05",
    title: "Sommet",
    sub: "Autonomie + mesure",
    desc: "On redescend. Vous gardez la cordée, les outils, l'expertise. Bilan ROI, plan de capitalisation, prochains itinéraires possibles.",
    out: ["ROI documenté", "Roadmap 18 mois", "Cordée autonome"],
    alt: "4 200 m",
  },
];

export function Method() {
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
          <span className="num">02 / Méthode</span>
          <span className="rule" />
        </div>

        <Reveal>
          <h2 className="display h2" style={{ maxWidth: "16ch", margin: "0 0 24px" }}>
            Cinq phases.{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
              Une seule corde.
            </em>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="body-lg" style={{ maxWidth: "56ch", margin: "0 0 80px" }}>
            Ce que nous faisons quand vous nous engagez. Pas un cadre théorique :
            une routine d&apos;ascension répétée sur 32 missions. Chaque phase
            s&apos;ouvre sur un livrable signé.
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
                  top: -28,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--color-muted)",
                  letterSpacing: "0.1em",
                }}
              >
                SOMMET
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: -28,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--color-muted)",
                  letterSpacing: "0.1em",
                }}
              >
                CAMP DE BASE
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
                    {p.alt} — Phase {p.n}
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
