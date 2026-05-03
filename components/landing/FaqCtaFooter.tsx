"use client";

import { useState } from "react";
import { ArrowRight, CordeeMark, Reveal } from "./atoms";

const FAQ_ITEMS = [
  {
    q: "Quelle différence avec un cabinet de conseil généraliste ?",
    a: "Nous ne faisons que de l'IA appliquée — et seulement sur des terrains que nous opérons nous-mêmes. Pas de junior à 1 200 €/jour qui découvre votre métier en lisant la presse spécialisée. Trois consultants seniors au maximum, présents tous les jours sur la mission.",
  },
  {
    q: "Pourquoi un forfait et pas un T&M ?",
    a: "Le forfait nous engage sur le résultat, pas sur les heures. Si la mission dépasse, c'est notre problème, pas le vôtre. Conséquence : nous ne prenons pas tous les sujets, et nous refusons les missions mal cadrées.",
  },
  {
    q: "Vous travaillez avec quels modèles / fournisseurs ?",
    a: "Indépendants. Selon le cas : Claude, GPT, Mistral, Llama en self-hosted. Nous n'avons aucun partenariat commercial avec un éditeur de modèle. La recommandation suit la valeur métier, pas une rétrocommission.",
  },
  {
    q: "Et la conformité — AI Act, RGPD, secret industriel ?",
    a: "Cadre intégré dès la phase de cadrage. Nous travaillons régulièrement avec des équipes juridiques internes et des cabinets spécialisés. Hébergement souverain disponible (OVHcloud, Scaleway) sur demande.",
  },
  {
    q: "Combien de missions menez-vous en parallèle ?",
    a: "Trois, jamais plus. C'est ce qui nous permet de garantir la présence terrain et le forfait. Un démarrage demande typiquement 3 semaines après signature — parfois plus si nous sommes complets.",
  },
  {
    q: "Travaillez-vous avec des PME ou seulement des grands comptes ?",
    a: "Les deux, à condition que le sujet soit cadrable et que la décision puisse être prise rapidement. Nous avons accompagné des ETI familiales comme des groupes du SBF 120. Le forfait minimum est de 85 k€ HT.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="faq">
      <div className="container">
        <div className="section-eyebrow">
          <span className="num">06 / Questions</span>
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
              On répond<br />
              <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
                franchement.
              </em>
            </h2>
            <p className="body-lg" style={{ marginTop: 24, maxWidth: "36ch" }}>
              Six questions qui reviennent en réunion de cadrage. Si la vôtre
              n&apos;y est pas, écrivez-nous — on répond en moins de 24h.
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
                Prochain départ
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
                30 minutes,<br />
                pour décider{" "}
                <em style={{ fontStyle: "italic", color: "var(--color-accent)" }}>
                  si on monte ensemble.
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
                Premier appel cadré — votre contexte, vos contraintes, ce
                qu&apos;on peut vraiment apporter. Sans slides, sans engagement.
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
                href="#"
                className="btn btn-accent btn-arrow"
                style={{ padding: "16px 28px", fontSize: 16 }}
              >
                Réserver un créneau <ArrowRight size={16} />
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
                Réponse sous 24h ouvrées
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function FootCol({ title, links }: { title: string; links: string[] }) {
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
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: 14,
                transition: "color 200ms",
              }}
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
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
              Cabinet de conseil indépendant. IA appliquée pour CTO, COO et
              comités d&apos;investissement.
            </p>
            <div className="caption">Paris &middot; Lyon &middot; Genève</div>
          </div>

          <FootCol
            title="Cabinet"
            links={["Méthode", "Expertise", "Pour qui", "Cas clients", "Équipe"]}
          />
          <FootCol
            title="Ressources"
            links={[
              "Études",
              "Note AI Act",
              "Charte IA modèle",
              "Newsletter — La Cordée",
              "Générateur de starter",
            ]}
          />
          <FootCol
            title="Légal"
            links={[
              "Mentions légales",
              "Politique de confidentialité",
              "CGU",
              "contact@cordee.ia",
            ]}
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
          <span>© 2026 Cordée.IA SAS — Capital 50 000 € — RCS Paris 932 481 207</span>
          <span>v.2026.05 — fait à 1&thinsp;200&thinsp;m</span>
        </div>
      </div>
    </footer>
  );
}
