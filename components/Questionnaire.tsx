"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Download, Loader2 } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";

// ─── Schema ────────────────────────────────────────────────────────────────

const FormSchema = z.object({
  projectName: z
    .string()
    .min(1, "Renseigne un nom de projet")
    .max(50, "50 caractères max"),
  projectDescription: z.string().max(280).optional().default(""),
  mode: z.enum(["greenfield", "overlay"]),
  stack: z
    .array(
      z.enum([
        "nextjs",
        "nestjs",
        "fastapi",
        "go",
        "rust",
        "none",
        "vue",
        "sveltekit",
        "astro",
        "remix",
        "hono",
        "express",
        "django",
        "flask",
      ])
    )
    .default([]),
  agents: z
    .array(
      z.enum([
        "researcher",
        "challenger",
        "reviewer",
        "page-writer",
        "pr-reviewer",
        "db-migration-reviewer",
        "a11y-auditor",
        "doc-writer",
        "dependency-updater",
        "test-writer",
      ])
    )
    .default([]),
  skills: z
    .array(
      z.enum([
        "kickoff",
        "audit",
        "design-handoff",
        "release",
        "standup",
        "pr-review",
        "test-coverage",
        "doc-update",
      ])
    )
    .default([]),
  mcps: z
    .array(
      z.enum([
        "notion",
        "context7",
        "playwright",
        "figma",
        "sentry",
        "linear",
        "github",
        "vercel",
        "supabase",
        "stripe",
        "postgres",
        "slack",
      ])
    )
    .default([]),
  designSystem: z.enum(["use-example", "empty-template", "skip"]),
  extras: z
    .array(
      z.enum([
        "editorconfig",
        "prettierrc",
        "makefile",
        "dockerfile",
        "docker-compose",
        "vscode-settings",
        "github-ci",
      ])
    )
    .default([]),
  license: z.enum(["MIT", "Apache-2.0", "AGPL-3.0", "none"]).default("MIT"),
});

export type FormValues = z.infer<typeof FormSchema>;

// ─── Step content ──────────────────────────────────────────────────────────

const STACK_OPTIONS: { value: FormValues["stack"][number]; label: string }[] = [
  { value: "nextjs", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "vue", label: "Vue / Nuxt" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "astro", label: "Astro" },
  { value: "nestjs", label: "NestJS" },
  { value: "express", label: "Express" },
  { value: "hono", label: "Hono (Edge)" },
  { value: "fastapi", label: "FastAPI" },
  { value: "django", label: "Django" },
  { value: "flask", label: "Flask" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "none", label: "Pas de stack défini" },
];

const AGENT_OPTIONS: {
  value: FormValues["agents"][number];
  label: string;
  hint: string;
}[] = [
  { value: "researcher", label: "researcher", hint: "Veille web, sources factuelles (Sonnet)" },
  { value: "challenger", label: "challenger", hint: "Avocat du diable, critique chaque décision (Opus xhigh)" },
  { value: "reviewer", label: "reviewer", hint: "Relecture code, sans écrire (Opus xhigh)" },
  { value: "pr-reviewer", label: "pr-reviewer", hint: "Review une PR : diff, tests, breaking changes (Opus xhigh)" },
  { value: "db-migration-reviewer", label: "db-migration-reviewer", hint: "Review migrations Prisma/Alembic/Drizzle (Opus xhigh)" },
  { value: "a11y-auditor", label: "a11y-auditor", hint: "Audit accessibilité WCAG 2.2 (Sonnet)" },
  { value: "doc-writer", label: "doc-writer", hint: "Écrit ou met à jour la doc (Sonnet)" },
  { value: "dependency-updater", label: "dependency-updater", hint: "Bump deps + lit les changelogs (Sonnet)" },
  { value: "test-writer", label: "test-writer", hint: "Écrit des tests Vitest/Jest/pytest (Sonnet)" },
  { value: "page-writer", label: "page-writer", hint: "Owner d'une page Notion / markdown (Sonnet)" },
];

const SKILL_OPTIONS: {
  value: FormValues["skills"][number];
  label: string;
  hint: string;
}[] = [
  { value: "kickoff", label: "/kickoff", hint: "Initialiser un projet vierge" },
  { value: "audit", label: "/audit", hint: "Cartographier un codebase existant" },
  { value: "design-handoff", label: "/design-handoff", hint: "Recevoir un livrable Claude Design" },
  { value: "release", label: "/release", hint: "Bump version + CHANGELOG + tag + publish" },
  { value: "standup", label: "/standup", hint: "Synthèse quotidienne (commits + PRs + tickets)" },
  { value: "pr-review", label: "/pr-review", hint: "Review une PR par numéro" },
  { value: "test-coverage", label: "/test-coverage", hint: "Run coverage + suggère 3 tests prioritaires" },
  { value: "doc-update", label: "/doc-update", hint: "Scan doc obsolète + 5 fixes" },
];

const MCP_OPTIONS: {
  value: FormValues["mcps"][number];
  label: string;
  hint: string;
}[] = [
  { value: "notion", label: "notion", hint: "Tickets, docs, boards" },
  { value: "context7", label: "context7", hint: "Docs librairies à jour" },
  { value: "playwright", label: "playwright", hint: "E2E, screenshots" },
  { value: "figma", label: "figma", hint: "Tokens design Figma" },
  { value: "sentry", label: "sentry", hint: "Erreurs production" },
  { value: "linear", label: "linear", hint: "Tickets Linear" },
  { value: "github", label: "github", hint: "PRs, issues, repos" },
  { value: "vercel", label: "vercel", hint: "Deploys, env vars, logs" },
  { value: "supabase", label: "supabase", hint: "DB, auth, storage" },
  { value: "stripe", label: "stripe", hint: "Customers, prix, webhooks" },
  { value: "postgres", label: "postgres", hint: "Query DB direct" },
  { value: "slack", label: "slack", hint: "Messages, channels" },
];

const EXTRA_OPTIONS: {
  value: FormValues["extras"][number];
  label: string;
  hint: string;
}[] = [
  { value: "editorconfig", label: ".editorconfig", hint: "Indent + EOL + charset partagés IDE" },
  { value: "prettierrc", label: ".prettierrc.json", hint: "Formatage Prettier (sensible defaults)" },
  { value: "makefile", label: "Makefile", hint: "Cibles dev / build / test / lint / clean" },
  { value: "dockerfile", label: "Dockerfile", hint: "Multi-stage build Node 24 / Python 3.12" },
  { value: "docker-compose", label: "docker-compose.yml", hint: "App + Postgres en local" },
  { value: "vscode-settings", label: ".vscode/settings.json", hint: "ESLint format on save, Tailwind IntelliSense" },
  { value: "github-ci", label: ".github/workflows/ci.yml", hint: "CI lint + typecheck + build + test" },
];

const LICENSE_OPTIONS: {
  value: FormValues["license"];
  label: string;
  hint: string;
}[] = [
  { value: "MIT", label: "MIT", hint: "Permissive, par défaut. Fork libre." },
  { value: "Apache-2.0", label: "Apache 2.0", hint: "Permissive + clause brevets." },
  { value: "AGPL-3.0", label: "AGPL 3.0", hint: "Copyleft fort. Toute modif réutilisée doit être OSS." },
  { value: "none", label: "Aucune", hint: "Code privé, tous droits réservés." },
];

// ─── Component ─────────────────────────────────────────────────────────────

const TOTAL_STEPS = 9;

export function Questionnaire() {
  const [step, setStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      projectName: "",
      projectDescription: "",
      mode: "greenfield",
      stack: [],
      agents: ["researcher", "challenger"],
      skills: ["kickoff", "design-handoff"],
      mcps: ["notion", "context7"],
      designSystem: "empty-template",
      extras: ["editorconfig", "prettierrc"],
      license: "MIT",
    },
  });

  const {
    control,
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = form;

  async function next() {
    let fieldsToValidate: (keyof FormValues)[] = [];
    if (step === 1) fieldsToValidate = ["projectName", "projectDescription"];
    if (step === 2) fieldsToValidate = ["mode"];
    if (step === 7) fieldsToValidate = ["designSystem"];
    const ok = fieldsToValidate.length
      ? await trigger(fieldsToValidate)
      : true;
    if (ok) setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }

  function prev() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function onSubmit(values: FormValues) {
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `Erreur ${res.status}`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${values.projectName}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setIsSubmitting(false);
    }
  }

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <Card className="p-8 md:p-12 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Étape {step} sur {TOTAL_STEPS}
          </span>
          <span className="text-xs font-medium text-[var(--color-muted-foreground)]">
            {Math.round(progress)} %
          </span>
        </div>
        <div className="h-1 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-accent)] rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="min-h-[280px]"
          >
            {/* Step 1 — Project name */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3
                    className="text-3xl mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Comment s'appelle ton projet ?
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Nom de repo, slug ou nom de produit. Tu peux changer plus
                    tard.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectName">Nom du projet</Label>
                  <Input
                    id="projectName"
                    placeholder="mon-projet-genial"
                    {...register("projectName")}
                  />
                  {errors.projectName && (
                    <p className="text-xs text-red-600">
                      {errors.projectName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">
                    Description courte (optionnel)
                  </Label>
                  <Textarea
                    id="projectDescription"
                    placeholder="2 lignes sur ce que fait ton projet."
                    rows={3}
                    {...register("projectDescription")}
                  />
                </div>
              </div>
            )}

            {/* Step 2 — Mode */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3
                    className="text-3xl mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Nouveau projet ou projet existant ?
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Le mode détermine si on scaffold tout, ou si on dépose
                    juste l'overlay Claude par-dessus ton repo.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="mode"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="gap-3"
                    >
                      <RadioCardOption
                        value="greenfield"
                        title="Nouveau projet (greenfield)"
                        desc="On scaffold .claude/, CLAUDE.md, DESIGN.md, .mcp.json, install.sh."
                        checked={field.value === "greenfield"}
                      />
                      <RadioCardOption
                        value="overlay"
                        title="Projet existant (overlay)"
                        desc="On ajoute uniquement les fichiers Claude par-dessus ton repo. Ton code n'est pas touché."
                        checked={field.value === "overlay"}
                      />
                    </RadioGroup>
                  )}
                />
              </div>
            )}

            {/* Step 3 — Stack */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3
                    className="text-3xl mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Stack technique ?
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Optionnel. Sert à pré-remplir les conventions de code dans
                    CLAUDE.md.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="stack"
                  render={({ field }) => (
                    <CheckboxList
                      options={STACK_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            )}

            {/* Step 4 — Agents */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3
                    className="text-3xl mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Agents Claude voulus ?
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Recommandé : researcher + challenger (couple
                    investigation / contradiction).
                  </p>
                </div>
                <Controller
                  control={control}
                  name="agents"
                  render={({ field }) => (
                    <CheckboxList
                      options={AGENT_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            )}

            {/* Step 5 — Skills */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h3
                    className="text-3xl mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Skills voulus ?
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Skills = slash commands réutilisables.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="skills"
                  render={({ field }) => (
                    <CheckboxList
                      options={SKILL_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            )}

            {/* Step 6 — MCPs */}
            {step === 6 && (
              <div className="space-y-6">
                <div>
                  <h3
                    className="text-3xl mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    MCPs branchés ?
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Tu peux toujours en ajouter plus tard dans .mcp.json.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="mcps"
                  render={({ field }) => (
                    <CheckboxList
                      options={MCP_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            )}

            {/* Step 7 — Design system */}
            {step === 7 && (
              <div className="space-y-6">
                <div>
                  <h3
                    className="text-3xl mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    DESIGN.md de départ ?
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Le design system est la première chose qu'un agent design
                    ouvre.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="designSystem"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="gap-3"
                    >
                      <RadioCardOption
                        value="use-example"
                        title="Garder l'exemple Cordée (granite + cuivre)"
                        desc="Pratique pour voir un DESIGN.md complet en action et l'adapter."
                        checked={field.value === "use-example"}
                      />
                      <RadioCardOption
                        value="empty-template"
                        title="Template vide à 9 sections"
                        desc="Le squelette sans contenu. À remplir avec ton agent design."
                        checked={field.value === "empty-template"}
                      />
                      <RadioCardOption
                        value="skip"
                        title="Pas de DESIGN.md"
                        desc="Si ton projet n'a pas d'interface."
                        checked={field.value === "skip"}
                      />
                    </RadioGroup>
                  )}
                />
              </div>
            )}

            {/* Step 8 — Extras */}
            {step === 8 && (
              <div className="space-y-6">
                <div>
                  <h3
                    className="text-3xl mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Fichiers complémentaires
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Optionnels. Tu peux toujours les ajouter à la main plus tard.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="extras"
                  render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {EXTRA_OPTIONS.map((opt) => {
                        const checked = field.value.includes(opt.value);
                        return (
                          <label
                            key={opt.value}
                            className={`flex items-start gap-3 p-4 rounded-[10px] border cursor-pointer transition-colors ${
                              checked
                                ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                                : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                            }`}
                          >
                            <Checkbox
                              checked={checked}
                              onCheckedChange={(c) => {
                                if (c)
                                  field.onChange([...field.value, opt.value]);
                                else
                                  field.onChange(
                                    field.value.filter((v) => v !== opt.value)
                                  );
                              }}
                            />
                            <div className="flex-1">
                              <div className="font-mono text-sm">
                                {opt.label}
                              </div>
                              <div className="text-xs text-[var(--color-muted-foreground)] mt-1">
                                {opt.hint}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                />
              </div>
            )}

            {/* Step 9 — License */}
            {step === 9 && (
              <div className="space-y-6">
                <div>
                  <h3
                    className="text-3xl mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Quelle licence ?
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Le fichier LICENSE est ajouté à la racine. Aucun cas =
                    code privé tous droits réservés.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="license"
                  render={({ field }) => (
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="gap-3"
                    >
                      {LICENSE_OPTIONS.map((opt) => (
                        <RadioCardOption
                          key={opt.value}
                          value={opt.value}
                          title={opt.label}
                          desc={opt.hint}
                          checked={field.value === opt.value}
                        />
                      ))}
                    </RadioGroup>
                  )}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-[10px] p-3">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <Button
            type="button"
            variant="ghost"
            onClick={prev}
            disabled={step === 1 || isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            Précédent
          </Button>

          {step < TOTAL_STEPS ? (
            <Button type="button" variant="primary" onClick={next}>
              Suivant
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Génération…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Télécharger le zip
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function RadioCardOption({
  value,
  title,
  desc,
  checked,
}: {
  value: string;
  title: string;
  desc: string;
  checked: boolean;
}) {
  return (
    <label
      htmlFor={`radio-${value}`}
      className={`flex items-start gap-4 p-4 rounded-[10px] border cursor-pointer transition-colors ${
        checked
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
          : "border-[var(--color-border)] hover:bg-[var(--color-border)]/20"
      }`}
    >
      <RadioGroupItem id={`radio-${value}`} value={value} className="mt-0.5" />
      <div className="space-y-1">
        <div className="text-sm font-medium text-[var(--color-foreground)]">
          {title}
        </div>
        <div className="text-xs text-[var(--color-muted-foreground)]">
          {desc}
        </div>
      </div>
    </label>
  );
}

function CheckboxList<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; hint?: string }[];
  value: T[];
  onChange: (v: T[]) => void;
}) {
  function toggle(v: T, checked: boolean) {
    if (checked) onChange(Array.from(new Set([...value, v])));
    else onChange(value.filter((x) => x !== v));
  }

  return (
    <div className="grid gap-3">
      {options.map((opt) => {
        const checked = value.includes(opt.value);
        const id = `cb-${opt.value}`;
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={`flex items-start gap-4 p-4 rounded-[10px] border cursor-pointer transition-colors ${
              checked
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
                : "border-[var(--color-border)] hover:bg-[var(--color-border)]/20"
            }`}
          >
            <Checkbox
              id={id}
              checked={checked}
              onCheckedChange={(c) => toggle(opt.value, c === true)}
              className="mt-0.5"
            />
            <div className="space-y-1">
              <div className="text-sm font-medium text-[var(--color-foreground)] font-mono">
                {opt.label}
              </div>
              {opt.hint && (
                <div className="text-xs text-[var(--color-muted-foreground)]">
                  {opt.hint}
                </div>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
