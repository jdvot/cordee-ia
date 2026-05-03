"use client";

import * as React from "react";
import { useTranslations } from "next-intl";

import { Questionnaire, type FormValues } from "@/components/Questionnaire";
import {
  FileTreePreview,
  buildZipTree,
  type FileTreeNode,
  type ZipSelections,
} from "@/components/generator/FileTreePreview";
import { FileCounter } from "@/components/generator/FileCounter";

interface Props {
  locale: string;
}

const DEFAULT_SELECTIONS: ZipSelections = {
  projectName: "",
  mode: "greenfield",
  agents: ["researcher", "challenger"],
  skills: ["kickoff", "design-handoff"],
  mcps: ["notion", "context7"],
  extras: ["editorconfig", "prettierrc"],
  designSystem: "empty-template",
  license: "MIT",
};

export function GeneratorQuestionnaireSection({ locale }: Props) {
  const t = useTranslations("Generator.QuestionnaireSection");
  const isFr = locale === "fr";

  // Bilingual hardcoded copy for the side hints — short, generic, doesn't
  // need a translation key (we'd add one if these grow).
  const tipLabel = isFr ? "Compteur" : "Counter";
  const tipText = isFr
    ? "Le décompte se met à jour à chaque sélection — chaque case cochée ajoute un fichier au .zip."
    : "The count updates with every selection — each box you tick adds a file to the .zip.";
  const outputLabel = isFr ? "Aperçu live" : "Live preview";

  const [values, setValues] = React.useState<ZipSelections>(DEFAULT_SELECTIONS);

  const handleValuesChange = React.useCallback((v: FormValues) => {
    setValues({
      projectName: v.projectName,
      mode: v.mode,
      agents: v.agents,
      skills: v.skills,
      mcps: v.mcps,
      extras: v.extras,
      designSystem: v.designSystem,
      license: v.license,
    });
  }, []);

  const tree = React.useMemo<{ nodes: FileTreeNode[]; total: number }>(
    () => buildZipTree(values),
    [values]
  );

  return (
    <section
      id="questionnaire"
      className="relative overflow-hidden py-20 md:py-32"
    >
      {/* Subtle topo bg behind the questionnaire to anchor it visually */}
      <div className="absolute inset-0 topo-bg pointer-events-none opacity-50" />

      <div className="relative max-w-[1200px] mx-auto px-6">
        <SectionHeader
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-16 grid lg:grid-cols-[220px_minmax(0,640px)_280px] gap-8 items-start">
          {/* LEFT — Animated file counter */}
          <aside className="hidden lg:block sticky top-32">
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-muted)] mb-3">
              {tipLabel}
            </div>
            <FileCounter
              count={tree.total}
              label={isFr ? "fichiers" : "files"}
              className="mb-4"
            />
            <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
              {tipText}
            </p>
          </aside>

          {/* CENTER — Questionnaire (lifted state via onValuesChange) */}
          <div>
            <Questionnaire onValuesChange={handleValuesChange} />
          </div>

          {/* RIGHT — Live file tree preview */}
          <aside className="hidden lg:block sticky top-32">
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-accent)] mb-3">
              {outputLabel}
            </div>
            <FileTreePreview
              nodes={tree.nodes}
              total={tree.total}
              title=".zip"
              subtitle={
                isFr
                  ? "Mis à jour en temps réel"
                  : "Updated in real time"
              }
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

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
