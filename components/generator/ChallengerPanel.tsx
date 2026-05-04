"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  runChallenger,
  type ChallengerInput,
  type Finding,
} from "@/lib/challenger-rules";

interface Props {
  /** Current questionnaire state, used to compute findings on render. */
  input: ChallengerInput;
}

/**
 * ChallengerPanel
 *
 * Pre-download critique panel rendered at the end of step 9, above the
 * "Download zip" button. Reads the current questionnaire state, runs the
 * deterministic rule engine, and surfaces findings as dismissible cards.
 *
 * Design notes:
 *   - Findings phrased as questions, not verdicts (user keeps agency).
 *   - Each card has a × to dismiss (panel never blocks submission).
 *   - Two severities: warn (orange) + info (muted).
 *   - English-only at launch (per challenger review). FR keys can be added
 *     later when usage validates the feature.
 */
export function ChallengerPanel({ input }: Props) {
  const t = useTranslations("Challenger");
  const findings = useMemo<Finding[]>(() => runChallenger(input), [input]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = findings.filter((f) => !dismissed.has(f.ruleId));

  if (visible.length === 0) return null;

  return (
    <aside
      className="rounded-[12px] border p-5 space-y-3"
      style={{
        borderColor: "color-mix(in oklch, var(--color-accent) 30%, transparent)",
        background:
          "color-mix(in oklch, var(--color-accent) 4%, var(--color-background))",
      }}
      aria-label={t("panelLabel")}
    >
      <header className="flex items-baseline justify-between gap-3">
        <div>
          <div
            className="font-mono text-[10px] uppercase tracking-[0.12em]"
            style={{ color: "var(--color-accent)" }}
          >
            {t("eyebrow")}
          </div>
          <p className="text-sm mt-1 text-[var(--color-foreground)]">
            {t("intro", { count: visible.length })}
          </p>
        </div>
      </header>

      <ul className="space-y-2 list-none p-0 m-0">
        {visible.map((f) => (
          <li
            key={f.ruleId}
            className="flex gap-3 items-start rounded-[8px] p-3"
            style={{
              background: "var(--color-background)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span
              aria-hidden="true"
              className="font-mono text-xs uppercase tracking-wider mt-0.5 shrink-0"
              style={{
                color:
                  f.severity === "warn" ? "var(--color-accent)" : "var(--color-muted)",
                minWidth: 36,
              }}
            >
              {f.severity === "warn" ? "warn" : "info"}
            </span>
            <span className="text-sm leading-relaxed flex-1 text-[var(--color-foreground)]">
              {t(`rules.${f.messageKey}`, f.vars ?? {})}
            </span>
            <button
              type="button"
              onClick={() =>
                setDismissed((prev) => {
                  const next = new Set(prev);
                  next.add(f.ruleId);
                  return next;
                })
              }
              aria-label={t("dismiss")}
              className="font-mono text-xs opacity-50 hover:opacity-100 transition-opacity shrink-0"
              style={{ color: "var(--color-muted)" }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
