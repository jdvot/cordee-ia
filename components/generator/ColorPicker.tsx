"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Presets ───────────────────────────────────────────────────────────────
//
// Defaults match templates/greenfield/DESIGN.md. The schema's z.string()
// regex requires `^#[0-9a-fA-F]{6}$` so all values are 6-digit hex (no #abc
// shorthand, no alpha).

export interface ColorsValue {
  primary: string;
  accent: string;
}

export const DEFAULT_COLORS: ColorsValue = {
  primary: "#1A2B3C", // granite
  accent: "#D4824A", // cuivre
};

interface Swatch {
  id: string;
  name: string;
  hex: string;
}

const PRIMARY_PRESETS: readonly Swatch[] = [
  { id: "granite", name: "Granite", hex: "#1A2B3C" },
  { id: "midnight", name: "Midnight", hex: "#0F172A" },
  { id: "forest", name: "Forest", hex: "#1F3A2E" },
  { id: "espresso", name: "Espresso", hex: "#3B2A1F" },
  { id: "obsidian", name: "Obsidian", hex: "#171717" },
  { id: "ink", name: "Ink", hex: "#1B1F3A" },
];

const ACCENT_PRESETS: readonly Swatch[] = [
  { id: "cuivre", name: "Cuivre", hex: "#D4824A" },
  { id: "sapin", name: "Sapin", hex: "#5C8A6E" },
  { id: "glacier", name: "Glacier", hex: "#5B8FB8" },
  { id: "sand", name: "Sable", hex: "#C9A66B" },
  { id: "rose-bois", name: "Rose-bois", hex: "#B57B6E" },
  { id: "or", name: "Or", hex: "#C9A227" },
  { id: "emerald", name: "Émeraude", hex: "#10B981" },
  { id: "lavande", name: "Lavande", hex: "#8B7BB3" },
];

// ─── Component ─────────────────────────────────────────────────────────────

export interface ColorPickerProps {
  value: ColorsValue;
  onChange: (next: ColorsValue) => void;
  /** Optional locale ("fr" | "en") to localise the few labels. */
  locale?: string;
  className?: string;
}

/**
 * Two-color picker (primary + accent) for the GENERATED project's DESIGN.md.
 *
 * NOT a site-wide retinter — these values are persisted in the form payload
 * (`colors.primary`, `colors.accent`), sent to /api/generate, and substituted
 * into templates/greenfield/DESIGN.md by the API's customizeDesignMd().
 *
 * UI: 6/8 swatches per role + native <input type="color"> for custom hex,
 * with a live mini preview card so the user sees the combination instantly.
 */
export function ColorPicker({
  value,
  onChange,
  locale = "fr",
  className,
}: ColorPickerProps) {
  const isFr = locale === "fr";
  const L = isFr
    ? {
        primary: "Couleur primaire",
        accent: "Couleur d'accent",
        primaryHint:
          "Granite par défaut. Utilisée pour les titres, les textes, les CTA principaux.",
        accentHint:
          "Cuivre par défaut. Utilisée pour les highlights, italiques, dividers.",
        custom: "Personnalisée",
        preview: "Aperçu",
        previewBody:
          "L'altitude se gagne en cordée. Voici à quoi ressembleront les boutons et accents de ton starter.",
        ctaPrimary: "Action principale",
        ctaAccent: "Réserver",
      }
    : {
        primary: "Primary color",
        accent: "Accent color",
        primaryHint:
          "Defaults to granite. Used for titles, body text, primary CTAs.",
        accentHint:
          "Defaults to copper. Used for highlights, italics, dividers.",
        custom: "Custom",
        preview: "Preview",
        previewBody:
          "Altitude is reached roped together. Here's what your starter's buttons and accents will look like.",
        ctaPrimary: "Primary action",
        ctaAccent: "Book",
      };

  return (
    <div className={cn("space-y-6", className)}>
      <SwatchRow
        label={L.primary}
        hint={L.primaryHint}
        presets={PRIMARY_PRESETS}
        value={value.primary}
        customLabel={L.custom}
        onChange={(hex) => onChange({ ...value, primary: hex })}
      />
      <SwatchRow
        label={L.accent}
        hint={L.accentHint}
        presets={ACCENT_PRESETS}
        value={value.accent}
        customLabel={L.custom}
        onChange={(hex) => onChange({ ...value, accent: hex })}
      />
      <Preview colors={value} labels={L} />
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function SwatchRow({
  label,
  hint,
  presets,
  value,
  customLabel,
  onChange,
}: {
  label: string;
  hint: string;
  presets: readonly Swatch[];
  value: string;
  customLabel: string;
  onChange: (hex: string) => void;
}) {
  const isPreset = presets.some(
    (s) => s.hex.toLowerCase() === value.toLowerCase()
  );

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div className="text-sm font-medium text-[var(--color-foreground)]">
          {label}
        </div>
        <code className="text-[11px] font-mono text-[var(--color-muted-foreground)] uppercase">
          {value}
        </code>
      </div>
      <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
        {hint}
      </p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-2 pt-1">
        {presets.map((s) => {
          const active = s.hex.toLowerCase() === value.toLowerCase();
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={s.name}
              title={`${s.name} — ${s.hex}`}
              onClick={() => onChange(s.hex)}
              className="h-7 w-7 rounded-full transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
              style={{
                background: s.hex,
                boxShadow: active
                  ? `0 0 0 2px var(--color-background), 0 0 0 4px ${s.hex}`
                  : "none",
                border: active
                  ? "none"
                  : "1px solid color-mix(in srgb, currentColor 18%, transparent)",
              }}
            />
          );
        })}
        {/* Custom hex via native color input */}
        <label
          className={cn(
            "inline-flex items-center gap-1.5 ml-1 cursor-pointer",
            "px-2 py-1 rounded-full border transition-colors",
            !isPreset
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
              : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
          )}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="h-4 w-4 rounded-full border-0 cursor-pointer p-0 bg-transparent"
            style={{ appearance: "none" }}
            aria-label={customLabel}
          />
          <span className="text-[11px] font-mono uppercase tracking-wide text-[var(--color-muted-foreground)]">
            {customLabel}
          </span>
        </label>
      </div>
    </div>
  );
}

function Preview({
  colors,
  labels,
}: {
  colors: ColorsValue;
  labels: { preview: string; previewBody: string; ctaPrimary: string; ctaAccent: string };
}) {
  // Render with inline CSS vars so the preview card is fully isolated from
  // the surrounding theme — no global var leak.
  const previewStyle = {
    "--c-primary": colors.primary,
    "--c-accent": colors.accent,
  } as React.CSSProperties;

  return (
    <div className="space-y-2 pt-2">
      <div className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--color-accent)]">
        {labels.preview}
      </div>
      <div
        style={{ ...previewStyle, background: "#F8F7F4", borderColor: "rgba(26,43,60,0.12)" }}
        className="rounded-[12px] border p-5 space-y-4"
      >
        <p className="text-sm leading-relaxed" style={{ color: "var(--c-primary)" }}>
          {labels.previewBody}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            tabIndex={-1}
            className="inline-flex items-center justify-center h-9 px-4 rounded-[10px] text-xs font-medium transition-opacity hover:opacity-90"
            style={{
              background: "var(--c-primary)",
              color: "#F8F7F4",
            }}
          >
            {labels.ctaPrimary}
          </button>
          <button
            type="button"
            tabIndex={-1}
            className="inline-flex items-center justify-center h-9 px-4 rounded-[10px] text-xs font-medium transition-opacity hover:opacity-90"
            style={{
              background: "var(--c-accent)",
              color: "var(--c-primary)",
            }}
          >
            {labels.ctaAccent} →
          </button>
          <span
            className="inline-block w-1 h-4 rounded-full"
            style={{ background: "var(--c-accent)" }}
            aria-hidden="true"
          />
          <span
            className="text-xs italic"
            style={{ color: "var(--c-accent)", fontFamily: "var(--font-display)" }}
          >
            en cordée
          </span>
        </div>
      </div>
    </div>
  );
}
