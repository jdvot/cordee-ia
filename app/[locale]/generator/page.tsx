import { setRequestLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
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

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Stat } from "@/components/ui/Stat";
import { Questionnaire } from "@/components/Questionnaire";

const REPO_URL = "https://github.com/jdvot/cordee-ia";
const LINKEDIN_URL = "https://www.linkedin.com/in/julien-dvt/";
const CONTACT_EMAIL = "julien.dvt57@gmail.com";

const STEP_ICONS = [FormInput, Settings, Download, Code2] as const;
const DELIVERABLE_ICONS = [
  Folder,
  FileText,
  Palette,
  Plug,
  Terminal,
  BookOpen,
] as const;

export default async function GeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Pre-load translations to ensure server rendering
  await getTranslations({ locale, namespace: "Generator" });

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
  const t = useTranslations("Generator.Hero");
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 topo-bg pointer-events-none" />
      <div className="relative max-w-[1200px] mx-auto px-6 pt-32 pb-32 md:pt-40 md:pb-40">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)]/70 backdrop-blur-sm text-xs font-medium text-[var(--color-muted-foreground)] mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            {t("badge")}
          </div>
          <h1
            className="text-5xl md:text-7xl lg:text-[80px] tracking-tight text-[var(--color-primary)] mb-6"
            style={{
              fontFamily: "var(--font-display)",
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
            }}
          >
            {t("title")}
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-muted-foreground)] max-w-2xl mb-10 leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-20">
            <Button asChild variant="accent" size="lg">
              <a href="#questionnaire">
                {t("ctaStart")}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href={REPO_URL} target="_blank" rel="noreferrer noopener">
                <Github className="h-4 w-4" />
                {t("ctaRepo")}
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-12 border-t border-[var(--color-border)]">
            <Stat
              value={4}
              label={t("stats.agents.label")}
              sublabel={t("stats.agents.sublabel")}
            />
            <Stat
              value={3}
              label={t("stats.skills.label")}
              sublabel={t("stats.skills.sublabel")}
            />
            <Stat
              value={9}
              label={t("stats.sections.label")}
              sublabel={t("stats.sections.sublabel")}
            />
            <Stat
              value={2}
              label={t("stats.modes.label")}
              sublabel={t("stats.modes.sublabel")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How it works ──────────────────────────────────────────────────────────

function HowItWorks() {
  const t = useTranslations("Generator.HowItWorks");
  const steps = t.raw("steps") as Array<{ title: string; desc: string }>;

  return (
    <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-32">
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
        {steps.map((step, idx) => {
          const Icon = STEP_ICONS[idx] ?? FormInput;
          return (
            <Card key={step.title} className="p-6 flex flex-col gap-4 h-full">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[8px] bg-[var(--color-primary)]/5 border border-[var(--color-border)] flex items-center justify-center">
                  <Icon
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
          );
        })}
      </div>
    </section>
  );
}

// ─── What you get ──────────────────────────────────────────────────────────

function WhatYouGet() {
  const t = useTranslations("Generator.WhatYouGet");
  const items = t.raw("items") as Array<{ name: string; desc: string }>;

  return (
    <section className="bg-[var(--color-primary)]/[0.02] border-y border-[var(--color-border)]">
      <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-32">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="grid md:grid-cols-2 gap-4 mt-16">
          {items.map((item, idx) => {
            const Icon = DELIVERABLE_ICONS[idx] ?? Folder;
            return (
              <Card
                key={item.name}
                className="p-5 flex items-start gap-4 hover:border-[var(--color-accent)]/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-[8px] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center shrink-0">
                  <Icon
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
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Questionnaire ─────────────────────────────────────────────────────────

function QuestionnaireSection() {
  const t = useTranslations("Generator.QuestionnaireSection");
  return (
    <section
      id="questionnaire"
      className="max-w-[1200px] mx-auto px-6 py-20 md:py-32"
    >
      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <div className="mt-16">
        <Questionnaire />
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────

function Faq() {
  const t = useTranslations("Generator.Faq");
  const items = t.raw("items") as Array<{ q: string; a: string }>;

  return (
    <section className="bg-[var(--color-primary)]/[0.02] border-y border-[var(--color-border)]">
      <div className="max-w-[900px] mx-auto px-6 py-20 md:py-32">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-16 space-y-3">
          {items.map((item) => (
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
  const t = useTranslations("Generator.Footer");
  return (
    <footer className="border-t border-[var(--color-border)]">
      <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[var(--color-muted-foreground)]">
        <div className="font-mono">{t("copyright")}</div>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            ← Cordée.IA
          </Link>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-2"
          >
            <Github className="h-4 w-4" />
            jdvot/cordee-ia
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            {t("linkedin")}
          </a>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            {t("contact")}
          </a>
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
