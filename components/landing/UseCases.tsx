"use client";

import { Reveal } from "./atoms";

const CASES = [
  {
    n: "01",
    persona: "Indie hacker · Freelance",
    title: "Démarrer un projet from scratch",
    desc: "Réponds à 6 questions, télécharge le .zip, lance claude. 2 minutes au lieu de 2 heures de config CLAUDE.md.",
    href: "/generator",
    cta: "Essayer le générateur",
  },
  {
    n: "02",
    persona: "Équipe avec un repo legacy",
    title: "Ajouter Claude à un projet existant",
    desc: "Mode overlay : install.sh détecte ton stack (Next, Nest, FastAPI, Go, Rust), backup ton .claude/ existant, drop la config sans rien casser.",
    href: "/generator",
    cta: "Essayer en mode overlay",
  },
  {
    n: "03",
    persona: "Enseignant · Tech Lead",
    title: "Animer un atelier ou un cours",
    desc: "Génère un starter identique pour 30 étudiants. Distribue le .zip via Moodle ou drive partagé. Tout le monde commence sur le même pied.",
    href: "/generator",
    cta: "Voir le scénario",
  },
  {
    n: "04",
    persona: "Speaker conférence",
    title: "Démo Claude Design dans un talk",
    desc: "DESIGN.md prêt à uploader sur claude.ai/design. Bouton Handoff to Claude Code. Skill /design-handoff scaffold le Next.js. Chaîne complète en 5 min.",
    href: "/generator",
    cta: "Voir le DESIGN.md d'exemple",
  },
  {
    n: "05",
    persona: "CTO · Tech Lead",
    title: "Standardiser une équipe",
    desc: "Génère le starter officiel de ton équipe une fois, push-le sur un repo template GitHub. Tous les nouveaux projets l'héritent automatiquement.",
    href: "/generator",
    cta: "Préparer le template équipe",
  },
  {
    n: "06",
    persona: "Nouveau dev · Consultant",
    title: "Onboarding rapide sur un legacy",
    desc: "Drop l'overlay, lance /audit. Claude cartographie le codebase, liste 5 zones risquées, 5 zones safe pour commencer, suggère 3 PRs sûres.",
    href: "/generator",
    cta: "Lancer l'overlay",
  },
];

export function UseCases() {
  return (
    <section id="use-cases">
      <div className="container">
        <div className="section-eyebrow">
          <span className="num">07 / Cas d&apos;usage</span>
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
              <em
                style={{
                  fontStyle: "italic",
                  color: "var(--color-accent)",
                }}
              >
                Une seule corde.
              </em>
            </h2>
          </Reveal>
          <Reveal delay={80}>
            <p
              className="body-lg"
              style={{ margin: 0, alignSelf: "end", maxWidth: "52ch" }}
            >
              Cordée.IA est gratuit, open source, MIT. Voici à qui il sert
              concrètement et comment l&apos;utiliser. Si ton cas n&apos;est
              pas couvert,{" "}
              <a
                href="https://github.com/jdvot/cordee-ia/issues/new?template=feature_request.md"
                style={{
                  color: "var(--color-accent)",
                  textDecoration: "underline",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "3px",
                }}
              >
                ouvre une issue
              </a>
              .
            </p>
          </Reveal>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
        >
          {CASES.map((c, i) => (
            <Reveal
              key={c.n}
              delay={i * 60}
              className="card hoverable"
              style={{
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 18,
                minHeight: 320,
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
                  {c.n}
                </span>
                <span
                  className="caption"
                  style={{ textAlign: "right", maxWidth: "60%" }}
                >
                  {c.persona}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  margin: 0,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.15,
                }}
              >
                {c.title}
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "var(--color-muted-foreground)",
                  fontSize: 15,
                  lineHeight: 1.6,
                  flexGrow: 1,
                }}
              >
                {c.desc}
              </p>

              <a
                href={c.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-accent)",
                  borderTop: "1px solid var(--color-border)",
                  paddingTop: 16,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                }}
              >
                {c.cta}
                <span aria-hidden="true">→</span>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400}>
          <div
            style={{
              marginTop: 64,
              paddingTop: 32,
              borderTop: "1px solid var(--color-border)",
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              className="body"
              style={{ margin: 0, color: "var(--color-muted-foreground)" }}
            >
              3 cas additionnels (mission consulting, hackathon, migration depuis
              Cursor) sont détaillés dans{" "}
              <a
                href="https://github.com/jdvot/cordee-ia/blob/main/USE_CASES.md"
                style={{
                  color: "var(--color-accent)",
                  textDecoration: "underline",
                  textDecorationThickness: "1px",
                  textUnderlineOffset: "3px",
                }}
              >
                USE_CASES.md
              </a>
              .
            </span>
            <a
              href="/generator"
              className="btn btn-accent btn-arrow"
              style={{ marginLeft: "auto" }}
            >
              Démarrer le générateur →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
