/**
 * Challenger rule engine.
 *
 * Pure deterministic logic — NO LLM call. Reads the questionnaire payload,
 * applies a fixed set of rules, returns Findings. Used by the
 * <ChallengerPanel> rendered at the end of step 9 (before "Download zip").
 *
 * Design principles (after challenger review):
 *   - Two severities only: `warn` (worth reading) + `info` (FYI).
 *   - No `good` / 🟢 self-congratulation messages — saves clutter.
 *   - Phrasing is QUESTION not verdict ("Are you sure …?" not "Wrong: …").
 *     The user keeps agency; we surface the trade-off, they decide.
 *   - Each rule cites the WHY (Anthropic doc or pragmatic reasoning) so
 *     dismissals are informed, not blind.
 *   - Findings are individually dismissible — the panel never blocks
 *     submission and the rule engine doesn't know about dismissals
 *     (UI concern).
 */

export type Severity = "warn" | "info";

export interface Finding {
  /** Stable identifier so tests + i18n can lookup the rule. */
  ruleId: string;
  severity: Severity;
  /** Translation key under `Challenger.rules.<ruleId>`. */
  messageKey: string;
  /** Optional vars for next-intl interpolation. */
  vars?: Record<string, string | number>;
}

/**
 * Minimal shape of the questionnaire payload. We don't import the full
 * Payload type from the API to keep the lib decoupled.
 */
export interface ChallengerInput {
  projectName: string;
  projectDescription: string;
  mode: "greenfield" | "overlay";
  stack: string[];
  agents: string[];
  skills: string[];
  mcps: string[];
  designSystem: "use-example" | "empty-template" | "skip";
  extras: string[];
  license: string;
  teamSetup: boolean;
}

const FRONTEND_STACKS = ["nextjs", "vue", "sveltekit", "astro", "remix"];
const OPUS_AGENTS = ["challenger", "reviewer", "pr-reviewer", "db-migration-reviewer"];

const RULES: Array<(p: ChallengerInput) => Finding | null> = [
  // ── WARN ──────────────────────────────────────────────────────────
  (p) => {
    if (p.agents.length >= 5 && p.mcps.length === 0) {
      return {
        ruleId: "manyAgentsNoMcps",
        severity: "warn",
        messageKey: "manyAgentsNoMcps",
        vars: { count: p.agents.length },
      };
    }
    return null;
  },

  (p) => {
    const opusCount = p.agents.filter((a) => OPUS_AGENTS.includes(a)).length;
    if (opusCount >= 3) {
      return {
        ruleId: "opusHeavy",
        severity: "warn",
        messageKey: "opusHeavy",
        vars: { count: opusCount },
      };
    }
    return null;
  },

  (p) => {
    const hasFrontend = p.stack.some((s) => FRONTEND_STACKS.includes(s));
    if (hasFrontend && p.designSystem === "skip") {
      return {
        ruleId: "frontendNoDesign",
        severity: "warn",
        messageKey: "frontendNoDesign",
      };
    }
    return null;
  },

  (p) => {
    if (p.agents.includes("test-writer") && !p.skills.includes("test-coverage")) {
      return {
        ruleId: "testWriterNoCoverage",
        severity: "warn",
        messageKey: "testWriterNoCoverage",
      };
    }
    return null;
  },

  (p) => {
    if (p.agents.includes("pr-reviewer") && !p.skills.includes("pr-review")) {
      return {
        ruleId: "prReviewerNoSkill",
        severity: "warn",
        messageKey: "prReviewerNoSkill",
      };
    }
    return null;
  },

  (p) => {
    if (
      p.agents.includes("db-migration-reviewer") &&
      !p.mcps.includes("postgres") &&
      !p.mcps.includes("supabase")
    ) {
      return {
        ruleId: "dbReviewerNoDbMcp",
        severity: "warn",
        messageKey: "dbReviewerNoDbMcp",
      };
    }
    return null;
  },

  (p) => {
    if (p.mode === "greenfield" && !p.skills.includes("kickoff")) {
      return {
        ruleId: "greenfieldNoKickoff",
        severity: "warn",
        messageKey: "greenfieldNoKickoff",
      };
    }
    return null;
  },

  (p) => {
    if (p.mode === "overlay" && !p.skills.includes("audit")) {
      return {
        ruleId: "overlayNoAudit",
        severity: "warn",
        messageKey: "overlayNoAudit",
      };
    }
    return null;
  },

  (p) => {
    if (p.teamSetup && p.agents.length <= 1) {
      return {
        ruleId: "teamSetupSoloAgent",
        severity: "warn",
        messageKey: "teamSetupSoloAgent",
      };
    }
    return null;
  },

  // ── INFO ──────────────────────────────────────────────────────────
  (p) => {
    if (p.agents.length === 0) {
      return {
        ruleId: "noAgents",
        severity: "info",
        messageKey: "noAgents",
      };
    }
    return null;
  },

  (p) => {
    if (p.skills.length === 0) {
      return {
        ruleId: "noSkills",
        severity: "info",
        messageKey: "noSkills",
      };
    }
    return null;
  },

  (p) => {
    if (p.stack.length === 0 || p.stack.every((s) => s === "none")) {
      return {
        ruleId: "noStack",
        severity: "info",
        messageKey: "noStack",
      };
    }
    return null;
  },
];

/**
 * Run all rules against the input.
 * Findings are returned `warn` first, then `info`.
 */
export function runChallenger(input: ChallengerInput): Finding[] {
  const findings: Finding[] = [];
  for (const rule of RULES) {
    const f = rule(input);
    if (f) findings.push(f);
  }
  return findings.sort((a, b) => {
    if (a.severity === b.severity) return 0;
    return a.severity === "warn" ? -1 : 1;
  });
}

/** Exposed for tests — the full list of rule IDs the engine knows about. */
export const KNOWN_RULE_IDS = [
  "manyAgentsNoMcps",
  "opusHeavy",
  "frontendNoDesign",
  "testWriterNoCoverage",
  "prReviewerNoSkill",
  "dbReviewerNoDbMcp",
  "greenfieldNoKickoff",
  "overlayNoAudit",
  "teamSetupSoloAgent",
  "noAgents",
  "noSkills",
  "noStack",
] as const;
