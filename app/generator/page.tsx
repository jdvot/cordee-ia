import Link from "next/link";
import {
  FormInput,
  Settings,
  Download,
  Code2,
  Folder,
  FileText,
  Palette,
  Plug,
  Terminal,
  BookOpen,
  ArrowRight,
  Github,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { Questionnaire } from "@/components/Questionnaire";

const REPO_URL = "https://github.com/jdvot/cordee-ia";
const LINKEDIN_URL = "https://www.linkedin.com/in/julien-dvt/";
const CONTACT_EMAIL = "julien.dvt57@gmail.com";

export default function HomePage() {
  return (
    <main className="min-h-screen text-[var(--color-foreground)]">
      <Hero />
      <HowItWorks />
      <WhatYouGet />
      <QuestionnaireSection />
      <Faq />
      <Footer />
    </main>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 topo-bg pointer-events-none" />
      <div className="relative max-w-[1200px] mx-auto px-6 pt-32 pb-32 md:pt-40 md:pb-40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/70 backdrop-blur-sm text-xs font-medium text-[var(--color-muted-foreground)] mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            Cordée.IA — open source, MIT
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-[80px] tracking-tight text-[var(--color-primary)] mb-6"
            style={{
              fontFamily: "var(--font-display)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            Démarre un projet Claude Code + Claude Design en 2 minutes
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-muted-foreground)] max-w-2xl mb-10 leading-relaxed">
            Réponds à 6 questions. Télécharge un .zip prêt à l&apos;emploi.
            Gratuit, open source, MIT.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-20">
            <Button asChild variant="accent" size="lg">
              <Link href="#questionnaire">
                Démarrer le questionnaire
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href={REPO_URL} target="_blank" rel="noreferrer noopener">
                <Github className="h-4 w-4" />
                Voir le repo GitHub
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-12 border-t border-[var(--color-border)]">
            <Stat value={4} label="Agents Claude" sublabel="researcher · challenger · reviewer · page-writer" />
            <Stat value={3} label="Skills inclus" sublabel="/kickoff · /audit · /design-handoff" />
            <Stat value={9} label="Sections DESIGN.md" sublabel="template prêt à remplir" />
            <Stat value={2} label="Modes" sublabel="nouveau projet · projet existant" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How it works ──────────────────────────────────────────────────────────

const STEPS = [
  {
    icon: FormInput,
    title: "Réponds aux 6 questions",
    desc: "Nom du projet, mode, stack, agents, skills, MCPs. 2 minutes max.",
  },
  {
    icon: Settings,
    title: "On customize les templates",
    desc: "Le générateur ne garde que ce que tu as choisi et personnalise CLAUDE.md, .mcp.json, .claude/.",
  },
  {
    icon: Download,
    title: "Tu télécharges le zip",
    desc: "Un .zip prêt à dézipper dans ton repo (greenfield) ou par-dessus un repo existant (overlay).",
  },
  {
    icon: Code2,
    title: "Tu lances claude et tu codes",
    desc: "Premier prompt suggéré : /kickoff (greenfield) ou /audit (overlay). C'est parti.",
  },
];

function HowItWorks() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-32">
      <SectionHeader
        eyebrow="Workflow"
        title="Comment ça marche"
        subtitle="Quatre étapes, dans cet ordre. Pas de compte, pas de paywall."
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
        {STEPS.map((step, idx) => (
          <Card key={step.title} className="p-6 flex flex-col gap-4 h-full">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-[8px] bg-[var(--color-primary)]/5 border border-[var(--color-border)] flex items-center justify-center">
                <step.icon
                  className="h-5 w-5 text-[var(--color-primary)]"
                  strokeWidth={1.75}
                />
              </div>
              <span className="text-xs font-mono text-[var(--color-muted-foreground)]">
                0{idx + 1}
              </span>
            </div>
            <h3
              className="text-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {step.title}
            </h3>
            <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
              {step.desc}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ─── What you get ──────────────────────────────────────────────────────────

const DELIVERABLES = [
  {
    icon: Folder,
    name: ".claude/",
    desc: "settings, 4 agents, 3 skills, 2 hooks, 3 rules.",
  },
  {
    icon: FileText,
    name: "CLAUDE.md",
    desc: "Instructions Claude Code customisées avec ton stack.",
  },
  {
    icon: Palette,
    name: "DESIGN.md",
    desc: "Design system 9 sections (vide ou exemple Cordée).",
  },
  {
    icon: Plug,
    name: ".mcp.json",
    desc: "MCPs sélectionnés (notion, context7, figma…).",
  },
  {
    icon: Terminal,
    name: "install.sh",
    desc: "Script d'installation dual-mode (greenfield ou overlay).",
  },
  {
    icon: BookOpen,
    name: "README.md",
    desc: "Doc projet avec ton nom, ta stack, tes choix.",
  },
];

function WhatYouGet() {
  return (
    <section className="bg-[var(--color-primary)]/[0.02] border-y border-[var(--color-border)]">
      <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-32">
        <SectionHeader
          eyebrow="Livrable"
          title="Ce que tu reçois dans le zip"
          subtitle="Tout est versionnable, lisible, modifiable. Aucun fichier binaire, aucun lock-in."
        />

        <div className="grid md:grid-cols-2 gap-4 mt-16">
          {DELIVERABLES.map((item) => (
            <Card
              key={item.name}
              className="p-5 flex items-start gap-4 hover:border-[var(--color-accent)]/50 transition-colors"
            >
              <div className="h-10 w-10 rounded-[8px] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center shrink-0">
                <item.icon
                  className="h-5 w-5 text-[var(--color-accent)]"
                  strokeWidth={1.75}
                />
              </div>
              <div className="space-y-1">
                <code className="text-sm font-mono font-medium text-[var(--color-foreground)]">
                  {item.name}
                </code>
                <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Questionnaire ─────────────────────────────────────────────────────────

function QuestionnaireSection() {
  return (
    <section
      id="questionnaire"
      className="max-w-[1200px] mx-auto px-6 py-20 md:py-32"
    >
      <SectionHeader
        eyebrow="Configuration"
        title="Configure ton starter"
        subtitle="Six étapes. Aucun compte. La génération se fait côté serveur Next.js, rien n'est stocké."
      />
      <div className="mt-16">
        <Questionnaire />
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────

const FAQ = [
  {
    q: "C'est vraiment gratuit ?",
    a: "Oui. Le code est sous licence MIT, le générateur est open source, jamais de paywall.",
  },
  {
    q: "Mes données sont-elles envoyées à un serveur ?",
    a: "Tout est généré côté serveur Next.js, à la volée, en mémoire. Rien n'est stocké, rien n'est envoyé à OpenAI ni à Anthropic. Le payload du formulaire vit le temps de la requête HTTP.",
  },
  {
    q: "Je peux modifier le zip ensuite ?",
    a: "Oui, c'est ton repo. Modifie, supprime, ajoute, force-push. Cordée.IA n'a aucun lien avec le projet une fois généré.",
  },
  {
    q: "Pourquoi Claude Code et pas Cursor ou Cline ?",
    a: "Le starter est tool-agnostic — les agents et skills marchent avec n'importe quel outil qui lit les fichiers .md. Mais la structure .claude/ et les hooks sont optimisés pour Claude Code.",
  },
  {
    q: "Comment vous gagnez de l'argent ?",
    a: "On ne gagne pas. Le repo est OSS. Je consulte à côté (Cordée.IA consulting). Le générateur est ma manière de partager ce qui marche en mission.",
  },
  {
    q: "Et si j'ai un projet existant ?",
    a: "Choisis « Projet existant » dans le questionnaire. Le install.sh ajoute uniquement les fichiers Claude par-dessus ton repo, sans rien casser. Backup automatique du .claude/ existant.",
  },
];

function Faq() {
  return (
    <section className="bg-[var(--color-primary)]/[0.02] border-y border-[var(--color-border)]">
      <div className="max-w-[900px] mx-auto px-6 py-20 md:py-32">
        <SectionHeader
          eyebrow="Questions fréquentes"
          title="FAQ"
          subtitle="Six réponses honnêtes. S'il manque quelque chose, ouvre une issue sur GitHub."
        />

        <div className="mt-16 space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-[12px] border border-[var(--color-border)] bg-[var(--color-background)] open:bg-[var(--color-primary)]/[0.02]"
            >
              <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none">
                <span className="text-base font-medium text-[var(--color-foreground)]">
                  {item.q}
                </span>
                <span className="h-6 w-6 rounded-full border border-[var(--color-border)] flex items-center justify-center shrink-0 transition-transform group-open:rotate-45">
                  <span className="text-[var(--color-accent)] text-lg leading-none -mt-0.5">
                    +
                  </span>
                </span>
              </summary>
              <div className="px-5 pb-5 -mt-1 text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--color-muted-foreground)]">
        <div className="font-mono">Cordée.IA — MIT — 2026</div>
        <div className="flex items-center gap-6">
          <Link
            href={REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-2"
          >
            <Github className="h-4 w-4" />
            jdvot/cordee-ia
          </Link>
          <Link
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            LinkedIn
          </Link>
          <Link
            href={`mailto:${CONTACT_EMAIL}`}
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-accent)] mb-4">
        {eyebrow}
      </div>
      <h2
        className="text-4xl md:text-5xl text-[var(--color-primary)]"
        style={{
          fontFamily: "var(--font-display)",
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-[var(--color-muted-foreground)] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
