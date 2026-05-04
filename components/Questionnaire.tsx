"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Download, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import {
  ColorPicker,
  DEFAULT_COLORS,
  type ColorsValue,
} from "@/components/generator/ColorPicker";
import { ChallengerPanel } from "@/components/generator/ChallengerPanel";

// ─── Schema ────────────────────────────────────────────────────────────────

const STACK_VALUES = [
  "nextjs",
  "remix",
  "vue",
  "sveltekit",
  "astro",
  "nestjs",
  "express",
  "hono",
  "fastapi",
  "django",
  "flask",
  "go",
  "rust",
  "none",
] as const;

const AGENT_VALUES = [
  "researcher",
  "challenger",
  "reviewer",
  "pr-reviewer",
  "db-migration-reviewer",
  "a11y-auditor",
  "doc-writer",
  "dependency-updater",
  "test-writer",
  "page-writer",
] as const;

const SKILL_VALUES = [
  "kickoff",
  "audit",
  "design-handoff",
  "release",
  "standup",
  "pr-review",
  "test-coverage",
  "doc-update",
] as const;

const MCP_VALUES = [
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
] as const;

const EXTRA_VALUES = [
  "editorconfig",
  "prettierrc",
  "makefile",
  "dockerfile",
  "docker-compose",
  "vscode-settings",
  "github-ci",
] as const;

const LICENSE_VALUES = ["MIT", "Apache-2.0", "AGPL-3.0", "none"] as const;

// Sanitize project name: lowercase, strip accents, spaces → dashes, drop disallowed chars.
// Called on blur — the user can type freely, and we clean up before validation.
function sanitizeProjectName(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^[-._]+|[-._]+$/g, "")
    .slice(0, 50);
}

function buildSchema(messages: {
  required: string;
  max: string;
  pattern: string;
}) {
  return z.object({
    projectName: z
      .string()
      .min(1, messages.required)
      .max(50, messages.max)
      .regex(/^[a-zA-Z0-9._-]+$/, messages.pattern),
    projectDescription: z.string().max(280).optional().default(""),
    mode: z.enum(["greenfield", "overlay"]),
    stack: z.array(z.enum(STACK_VALUES)).default([]),
    agents: z.array(z.enum(AGENT_VALUES)).default([]),
    skills: z.array(z.enum(SKILL_VALUES)).default([]),
    mcps: z.array(z.enum(MCP_VALUES)).default([]),
    designSystem: z.enum(["use-example", "empty-template", "skip"]),
    extras: z.array(z.enum(EXTRA_VALUES)).default([]),
    teamSetup: z.boolean().default(false),
    license: z.enum(LICENSE_VALUES).default("MIT"),
    colors: z
      .object({
        primary: z
          .string()
          .regex(/^#[0-9a-fA-F]{6}$/)
          .default(DEFAULT_COLORS.primary),
        accent: z
          .string()
          .regex(/^#[0-9a-fA-F]{6}$/)
          .default(DEFAULT_COLORS.accent),
      })
      .default(DEFAULT_COLORS),
  });
}

export type FormValues = z.infer<ReturnType<typeof buildSchema>>;

// ─── Component ─────────────────────────────────────────────────────────────

const TOTAL_STEPS = 9;

interface QuestionnaireProps {
  /**
   * Called whenever any form value changes — used by sibling preview widgets
   * (FileTreePreview, FileCounter) to render in real time.
   */
  onValuesChange?: (values: FormValues) => void;
}

export function Questionnaire({ onValuesChange }: QuestionnaireProps = {}) {
  const t = useTranslations("Generator.Questionnaire");
  const locale = useLocale();

  const FormSchema = React.useMemo(
    () =>
      buildSchema({
        required: t("validation.projectNameRequired"),
        max: t("validation.projectNameMax"),
        pattern: t("validation.projectNamePattern"),
      }),
    [t]
  );

  const STACK_OPTIONS: { value: (typeof STACK_VALUES)[number]; label: string }[] =
    STACK_VALUES.map((v) => ({
      value: v,
      label: t(`stack_options.${v}`),
    }));

  const AGENT_OPTIONS: {
    value: (typeof AGENT_VALUES)[number];
    label: string;
    hint: string;
  }[] = AGENT_VALUES.map((v) => ({
    value: v,
    label: v,
    hint: t(`agent_options.${v}`),
  }));

  const SKILL_OPTIONS: {
    value: (typeof SKILL_VALUES)[number];
    label: string;
    hint: string;
  }[] = SKILL_VALUES.map((v) => ({
    value: v,
    label: `/${v}`,
    hint: t(`skill_options.${v}`),
  }));

  const MCP_OPTIONS: {
    value: (typeof MCP_VALUES)[number];
    label: string;
    hint: string;
  }[] = MCP_VALUES.map((v) => ({
    value: v,
    label: v,
    hint: t(`mcp_options.${v}`),
  }));

  const EXTRA_LABELS: Record<(typeof EXTRA_VALUES)[number], string> = {
    editorconfig: ".editorconfig",
    prettierrc: ".prettierrc.json",
    makefile: "Makefile",
    dockerfile: "Dockerfile",
    "docker-compose": "docker-compose.yml",
    "vscode-settings": ".vscode/settings.json",
    "github-ci": ".github/workflows/ci.yml",
  };

  const EXTRA_OPTIONS: {
    value: (typeof EXTRA_VALUES)[number];
    label: string;
    hint: string;
  }[] = EXTRA_VALUES.map((v) => ({
    value: v,
    label: EXTRA_LABELS[v],
    hint: t(`extra_options.${v}`),
  }));

  // Keys like "Apache-2.0" contain a `.` which next-intl treats as a path
  // separator — use t.raw to grab the whole object.
  const licenseMap = t.raw("license_options") as Record<
    (typeof LICENSE_VALUES)[number],
    { label: string; hint: string }
  >;
  const LICENSE_OPTIONS: {
    value: (typeof LICENSE_VALUES)[number];
    label: string;
    hint: string;
  }[] = LICENSE_VALUES.map((v) => ({
    value: v,
    label: licenseMap[v].label,
    hint: licenseMap[v].hint,
  }));

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
      teamSetup: false,
      license: "MIT",
      colors: DEFAULT_COLORS,
    },
  });

  const {
    control,
    register,
    handleSubmit,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = form;

  // Publish initial + every subsequent change so sibling previews stay in sync.
  React.useEffect(() => {
    if (!onValuesChange) return;
    onValuesChange(getValues());
    const sub = watch((values) => {
      onValuesChange(values as FormValues);
    });
    return () => sub.unsubscribe();
  }, [watch, getValues, onValuesChange]);

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
        throw new Error(txt || t("errorWithCode", { code: res.status }));
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
      setError(e instanceof Error ? e.message : t("errorUnknown"));
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
            {t("stepLabel", { current: step, total: TOTAL_STEPS })}
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
                    {t("step1.title")}
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {t("step1.subtitle")}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectName">{t("step1.nameLabel")}</Label>
                  <Controller
                    control={control}
                    name="projectName"
                    render={({ field }) => (
                      <Input
                        id="projectName"
                        placeholder={t("step1.namePlaceholder")}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={(e) => {
                          const cleaned = sanitizeProjectName(e.target.value);
                          if (cleaned !== e.target.value) {
                            field.onChange(cleaned);
                          }
                          field.onBlur();
                        }}
                      />
                    )}
                  />
                  {!errors.projectName && (
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {t("validation.projectNameHint")}
                    </p>
                  )}
                  {errors.projectName && (
                    <p className="text-xs text-red-600">
                      {errors.projectName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectDescription">
                    {t("step1.descLabel")}
                  </Label>
                  <Textarea
                    id="projectDescription"
                    placeholder={t("step1.descPlaceholder")}
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
                    {t("step2.title")}
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {t("step2.subtitle")}
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
                        title={t("step2.greenfieldTitle")}
                        desc={t("step2.greenfieldDesc")}
                        checked={field.value === "greenfield"}
                      />
                      <RadioCardOption
                        value="overlay"
                        title={t("step2.overlayTitle")}
                        desc={t("step2.overlayDesc")}
                        checked={field.value === "overlay"}
                      />
                    </RadioGroup>
                  )}
                />
                <Controller
                  control={control}
                  name="teamSetup"
                  render={({ field }) => {
                    const checked = field.value === true;
                    return (
                      <label
                        className={`flex items-start gap-3 p-4 rounded-[10px] border cursor-pointer transition-colors ${
                          checked
                            ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                            : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
                        }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(c) => field.onChange(c === true)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-[var(--color-foreground)]">
                            {t("step2.teamSetupLabel")}
                          </div>
                          <div className="text-xs text-[var(--color-muted-foreground)] mt-1">
                            {t("step2.teamSetupDesc")}
                          </div>
                        </div>
                      </label>
                    );
                  }}
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
                    {t("step3.title")}
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {t("step3.subtitle")}
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
                    {t("step4.title")}
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {t("step4.subtitle")}
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
                    {t("step5.title")}
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {t("step5.subtitle")}
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
                    {t("step6.title")}
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {t("step6.subtitle")}
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
                    {t("step7.title")}
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {t("step7.subtitle")}
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
                        title={t("step7.useExampleTitle")}
                        desc={t("step7.useExampleDesc")}
                        checked={field.value === "use-example"}
                      />
                      <RadioCardOption
                        value="empty-template"
                        title={t("step7.emptyTitle")}
                        desc={t("step7.emptyDesc")}
                        checked={field.value === "empty-template"}
                      />
                      <RadioCardOption
                        value="skip"
                        title={t("step7.skipTitle")}
                        desc={t("step7.skipDesc")}
                        checked={field.value === "skip"}
                      />
                    </RadioGroup>
                  )}
                />

                {/* Color customization — only when DESIGN.md is generated. */}
                <Controller
                  control={control}
                  name="designSystem"
                  render={({ field: dsField }) =>
                    dsField.value === "skip" ? (
                      <></>
                    ) : (
                      <Controller
                        control={control}
                        name="colors"
                        render={({ field: cField }) => (
                          <div className="pt-4 mt-2 border-t border-[var(--color-border)]">
                            <ColorPicker
                              value={cField.value as ColorsValue}
                              onChange={(next) => cField.onChange(next)}
                              locale={locale}
                            />
                          </div>
                        )}
                      />
                    )
                  }
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
                    {t("step8.title")}
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {t("step8.subtitle")}
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
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-sm break-all">
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
                    {t("step9.title")}
                  </h3>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {t("step9.subtitle")}
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

        {step === TOTAL_STEPS && (
          <ChallengerPanel
            input={{
              projectName: watch("projectName") ?? "",
              projectDescription: watch("projectDescription") ?? "",
              mode: watch("mode") ?? "greenfield",
              stack: watch("stack") ?? [],
              agents: watch("agents") ?? [],
              skills: watch("skills") ?? [],
              mcps: watch("mcps") ?? [],
              designSystem: watch("designSystem") ?? "empty-template",
              extras: watch("extras") ?? [],
              license: watch("license") ?? "MIT",
              teamSetup: watch("teamSetup") ?? false,
            }}
          />
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <Button
            type="button"
            variant="ghost"
            onClick={prev}
            disabled={step === 1 || isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            {t("back")}
          </Button>

          {step < TOTAL_STEPS ? (
            <Button type="button" variant="primary" onClick={next}>
              {t("next")}
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
                  {t("submitting")}
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  {t("submit")}
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
