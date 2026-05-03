"use client";

import { ArrowRight, Counter, Reveal, Topo } from "./atoms";

const STATS = [
  { num: <><Counter to={113} />%</>, lab: "ROI moyen à 12 mois", note: "Sur 32 missions" },
  { num: <><Counter to={2.4} decimals={1} />×</>, lab: "Vélocité produit", note: "Mesure DORA" },
  { num: <><Counter to={47} />j</>, lab: "Premier livrable", note: "Pilote en prod" },
  { num: <><Counter to={32} /></>, lab: "Cordées depuis 2022", note: "Aucune redescente" },
];

export function Hero() {
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
            Cabinet de conseil IA — Paris &amp; Lyon
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1
            className="display h1"
            style={{ marginBottom: 32, maxWidth: "16ch", letterSpacing: "-0.035em" }}
          >
            L&apos;altitude se gagne{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
              en cordée
            </em>
            , pas en solo.
          </h1>
        </Reveal>

        <div
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
              Nous accompagnons les CTO et dirigeants industriels à transformer
              l&apos;IA générative en levier opérationnel. Sans hype. Sans pilotes
              qui ne sortent jamais. Une méthode, cinq phases, des résultats
              mesurables.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#cta" className="btn btn-accent btn-arrow">
                Réserver 30 min <ArrowRight />
              </a>
              <a href="#methode" className="btn btn-ghost btn-arrow">
                Voir la méthode <ArrowRight />
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
