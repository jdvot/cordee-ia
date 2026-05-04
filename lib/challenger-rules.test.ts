import { describe, it, expect } from "vitest";
import { runChallenger, KNOWN_RULE_IDS, type ChallengerInput } from "./challenger-rules";

const baseline: ChallengerInput = {
  projectName: "test",
  projectDescription: "",
  mode: "greenfield",
  stack: ["nextjs"],
  agents: ["researcher"],
  skills: ["kickoff"],
  mcps: ["notion"],
  designSystem: "empty-template",
  extras: [],
  license: "MIT",
  teamSetup: false,
};

const fire = (overrides: Partial<ChallengerInput>) =>
  runChallenger({ ...baseline, ...overrides }).map((f) => f.ruleId);

describe("runChallenger", () => {
  // ── WARN rules ────────────────────────────────────────────────────

  it("manyAgentsNoMcps: fires when 5+ agents and 0 MCPs", () => {
    const ids = fire({
      agents: ["researcher", "challenger", "reviewer", "test-writer", "doc-writer"],
      mcps: [],
    });
    expect(ids).toContain("manyAgentsNoMcps");
  });

  it("opusHeavy: fires when 3+ Opus-tier agents are picked", () => {
    const ids = fire({
      agents: ["challenger", "reviewer", "pr-reviewer", "db-migration-reviewer"],
    });
    expect(ids).toContain("opusHeavy");
  });

  it("frontendNoDesign: fires when frontend stack is picked but DESIGN.md is skipped", () => {
    const ids = fire({ stack: ["nextjs"], designSystem: "skip" });
    expect(ids).toContain("frontendNoDesign");
  });

  it("testWriterNoCoverage: fires when test-writer agent picked without /test-coverage skill", () => {
    const ids = fire({ agents: ["test-writer"], skills: ["kickoff"] });
    expect(ids).toContain("testWriterNoCoverage");
  });

  it("prReviewerNoSkill: fires when pr-reviewer agent picked without /pr-review skill", () => {
    const ids = fire({ agents: ["pr-reviewer"], skills: ["kickoff"] });
    expect(ids).toContain("prReviewerNoSkill");
  });

  it("dbReviewerNoDbMcp: fires when db-migration-reviewer picked without postgres/supabase MCP", () => {
    const ids = fire({ agents: ["db-migration-reviewer"], mcps: ["notion"] });
    expect(ids).toContain("dbReviewerNoDbMcp");
  });

  it("greenfieldNoKickoff: fires on greenfield without /kickoff skill", () => {
    const ids = fire({ mode: "greenfield", skills: [] });
    expect(ids).toContain("greenfieldNoKickoff");
  });

  it("overlayNoAudit: fires on overlay without /audit skill", () => {
    const ids = fire({ mode: "overlay", skills: ["kickoff"] });
    expect(ids).toContain("overlayNoAudit");
  });

  it("teamSetupSoloAgent: fires when teamSetup=true with <= 1 agent", () => {
    const ids = fire({ teamSetup: true, agents: ["researcher"] });
    expect(ids).toContain("teamSetupSoloAgent");
  });

  // ── INFO rules ────────────────────────────────────────────────────

  it("noAgents: fires when 0 agents picked", () => {
    const ids = fire({ agents: [] });
    expect(ids).toContain("noAgents");
  });

  it("noSkills: fires when 0 skills picked", () => {
    const ids = fire({ skills: [], mode: "overlay" });
    // mode overlay so we don't double-fire greenfieldNoKickoff
    expect(ids).toContain("noSkills");
  });

  it("noStack: fires when stack is empty or only 'none'", () => {
    expect(fire({ stack: [] })).toContain("noStack");
    expect(fire({ stack: ["none"] })).toContain("noStack");
  });

  // ── Aggregator behaviour ──────────────────────────────────────────

  it("returns warn findings before info findings", () => {
    const findings = runChallenger({
      ...baseline,
      agents: [],
      skills: [],
      mode: "overlay",
    });
    const severities = findings.map((f) => f.severity);
    const firstInfo = severities.indexOf("info");
    const lastWarn = severities.lastIndexOf("warn");
    if (firstInfo !== -1 && lastWarn !== -1) {
      expect(lastWarn).toBeLessThan(firstInfo);
    }
  });

  it("returns no findings on a sane baseline (canary)", () => {
    const findings = runChallenger(baseline);
    // Baseline has empty-template design + nextjs + 1 agent + kickoff skill +
    // notion MCP. Minor info findings (e.g. "no a11y-auditor") may fire but
    // no warn-level finding should.
    const warns = findings.filter((f) => f.severity === "warn");
    expect(warns).toHaveLength(0);
  });

  it("every finding has a known ruleId (no typos in production rules)", () => {
    const knownSet = new Set(KNOWN_RULE_IDS);
    // Generate a payload that triggers many rules at once.
    const findings = runChallenger({
      ...baseline,
      agents: ["test-writer", "pr-reviewer", "db-migration-reviewer", "challenger", "reviewer"],
      skills: [],
      mcps: [],
      stack: ["nextjs"],
      designSystem: "skip",
      teamSetup: true,
    });
    for (const f of findings) {
      expect(knownSet.has(f.ruleId as (typeof KNOWN_RULE_IDS)[number])).toBe(true);
    }
  });
});
