"use client";

import { useState } from "react";
import { ArrowRight, Reveal } from "./atoms";

const EXPERTISES = [
  {
    n: "01",
    t: "Stratégie & cadrage IA",
    d: "Diagnostic, cas d'usage, business case. Décider quoi lancer, quoi arrêter, quoi attendre.",
    tags: ["Audit éclair", "Roadmap 18 mois", "Comité de pilotage"],
  },
  {
    n: "02",
    t: "Architecture LLM",
    d: "RAG hybride, agents, fine-tuning. La bonne corde pour la bonne paroi — pas de stack imposée.",
    tags: ["RAG", "Agents", "Fine-tuning", "Évaluation"],
  },
  {
    n: "03",
    t: "Industrialisation",
    d: "MLOps, observabilité, garde-fous métier. Sortir des proofs-of-concept qui ne sortent jamais.",
    tags: ["MLOps", "Observabilité", "Sécurité"],
  },
  {
    n: "04",
    t: "Gouvernance & conformité",
    d: "AI Act, RGPD, charte interne. Cadre de décision robuste pour les comités d'investissement.",
    tags: ["AI Act", "RGPD", "Charte"],
  },
  {
    n: "05",
    t: "Formation des équipes",
    d: "Montée en compétence des équipes tech et métier. Vous gardez la cordée à la fin.",
    tags: ["Coaching tech", "Ateliers métier"],
  },
  {
    n: "06",
    t: "Due diligence IA",
    d: "Évaluation de produits ou cibles d'acquisition. Ce qui marche vraiment vs. ce qui démontre.",
    tags: ["DD technique", "Audit modèle"],
  },
];

export function Expertise() {
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
          <span className="num">03 / Expertise</span>
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
              Six terrains.<br />
              <em style={{ fontStyle: "italic", color: "var(--color-muted-foreground)" }}>
                Aucune posture.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p
              className="body-lg"
              style={{ margin: 0, alignSelf: "end", maxWidth: "52ch" }}
            >
              Nous intervenons sur ce que nous avons opéré nous-mêmes. Pas de
              mission &laquo;découverte&raquo; à vos frais, pas de slides
              recyclées d&apos;un autre client. Si ce n&apos;est pas dans cette
              liste, on vous oriente ailleurs.
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
                {e.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      padding: "3px 10px",
                      border: "1px solid var(--color-border)",
                      borderRadius: 99,
                      color: "var(--color-muted-foreground)",
                    }}
                  >
                    {t}
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

const PERSONAS = [
  {
    role: "CTO",
    title: "Vous êtes CTO",
    quote: "« On a 14 POC. Aucun en prod. Le ComEx s'impatiente. »",
    points: [
      "Cartographier ce qui mérite d'aller en production",
      "Architecture cible robuste, pas un patchwork de démos",
      "Plan de transfert vers vos équipes",
    ],
  },
  {
    role: "COO / Directeur Industriel",
    title: "Vous êtes COO",
    quote: "« L'IA, oui, mais sans casser l'opérationnel. »",
    points: [
      "Identifier les gisements de productivité réels",
      "Garde-fous métier intégrés dès le pilote",
      "Mesure d'impact côté terrain, pas en lab",
    ],
  },
  {
    role: "Comité d'investissement",
    title: "Vous êtes ComEx / Board",
    quote: "« On finance, mais on veut comprendre ce qu'on signe. »",
    points: [
      "Due diligence technique sur cibles ou produits",
      "Lecture indépendante des promesses fournisseurs",
      "Cadre de décision aligné sur l'AI Act",
    ],
  },
];

export function Personas() {
  const [active, setActive] = useState(0);
  const p = PERSONAS[active];
  return (
    <section id="personas">
      <div className="container">
        <div className="section-eyebrow">
          <span className="num">04 / Pour qui</span>
          <span className="rule" />
        </div>
        <Reveal>
          <h2 className="display h2" style={{ margin: "0 0 64px", maxWidth: "20ch" }}>
            On encorde{" "}
            <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
              trois profils.
            </em>{" "}
            Pas plus.
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
                      —
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
                Ce qu&apos;on apporte
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

const DELIVERABLES = [
  {
    w: "J+10",
    t: "Diagnostic",
    d: "Carte des cas d'usage, matrice valeur × risque, recommandations.",
  },
  {
    w: "J+25",
    t: "Cadrage",
    d: "Charte IA, comité de pilotage, choix des 5 priorités.",
  },
  {
    w: "J+47",
    t: "Pilote en prod",
    d: "Premier cas d'usage livré, mesuré, transféré.",
  },
  {
    w: "J+90",
    t: "Plateforme",
    d: "Architecture cible, MLOps, observabilité, garde-fous.",
  },
  {
    w: "J+180",
    t: "Bilan & passage",
    d: "ROI documenté, équipes autonomes, roadmap actualisée.",
  },
];

export function Process() {
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
          <span className="num">05 / Process &amp; livrables</span>
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
                Six mois.<br />
                <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
                  Cinq jalons.
                </em>
              </h2>
              <p className="body-lg" style={{ margin: "0 0 32px", maxWidth: "44ch" }}>
                Chaque jalon est un livrable signé. Pas de &laquo;rapport
                intermédiaire&raquo; qui prend la poussière. À J+47, vous avez un
                système en production. À J+180, vous n&apos;avez plus besoin de
                nous.
              </p>
              <div className="caption" style={{ marginBottom: 12 }}>
                Engagement type
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
                <span style={{ color: "var(--color-muted)" }}>Durée</span>
                <span>4 à 6 mois</span>
                <span style={{ color: "var(--color-muted)" }}>Cordée</span>
                <span>2–3 consultants seniors</span>
                <span style={{ color: "var(--color-muted)" }}>Forfait</span>
                <span>À partir de 85 k€ HT</span>
                <span style={{ color: "var(--color-muted)" }}>Démarrage</span>
                <span>3 semaines après signature</span>
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
