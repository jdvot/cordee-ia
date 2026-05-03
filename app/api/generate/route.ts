import { NextRequest } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";
import { Readable } from "node:stream";
import archiver from "archiver";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ─── Schema (mirror Questionnaire) ─────────────────────────────────────────

const PayloadSchema = z.object({
  projectName: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-zA-Z0-9._-]+$/, {
      message: "projectName must be alphanumeric, dot, dash or underscore",
    }),
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
  colors: z
    .object({
      primary: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .default("#1A2B3C"),
      accent: z
        .string()
        .regex(/^#[0-9a-fA-F]{6}$/)
        .default("#D4824A"),
    })
    .default({ primary: "#1A2B3C", accent: "#D4824A" }),
});

type Payload = z.infer<typeof PayloadSchema>;

// ─── Stack labels ──────────────────────────────────────────────────────────

const STACK_LABELS: Record<Payload["stack"][number], string> = {
  nextjs: "Next.js (App Router, React 19, Tailwind v4)",
  nestjs: "NestJS (Node 24)",
  fastapi: "FastAPI (Python 3.12+)",
  go: "Go",
  rust: "Rust",
  none: "Unspecified",
  vue: "Vue 3 / Nuxt 3",
  sveltekit: "SvelteKit (Vite)",
  astro: "Astro 5",
  remix: "Remix (React Router 7)",
  hono: "Hono (Edge runtime)",
  express: "Express (Node 24)",
  django: "Django 5 (Python 3.12+)",
  flask: "Flask (Python 3.12+)",
};

// ─── Stack groups (for variant agents) ─────────────────────────────────────
//
// Compresses the 14 stacks into 5 buckets so agent-variant trees stay finite.
// Anything not listed (e.g. multiple languages, or "none") falls back to
// "default".

type StackGroup =
  | "node-web"
  | "node-server"
  | "python"
  | "go"
  | "rust"
  | "default";

const STACK_GROUP: Record<Payload["stack"][number], StackGroup> = {
  nextjs: "node-web",
  vue: "node-web",
  sveltekit: "node-web",
  astro: "node-web",
  remix: "node-web",
  nestjs: "node-server",
  hono: "node-server",
  express: "node-server",
  fastapi: "python",
  django: "python",
  flask: "python",
  go: "go",
  rust: "rust",
  none: "default",
};

/**
 * Pick the dominant variant for a multi-stack selection.
 *
 * Rule: first non-"default" stack wins. If the user picked Next.js + FastAPI,
 * the test-writer agent gets the node-web variant — they can override later.
 * Falls back to "default" if no stack or only "none" was picked.
 */
function dominantStackGroup(stacks: Payload["stack"]): StackGroup {
  for (const s of stacks) {
    const g = STACK_GROUP[s];
    if (g !== "default") return g;
  }
  return "default";
}

/**
 * Variant fallback chain for the dependency-updater agent. It only has 4
 * concrete variants (node, python, go, rust) so node-web and node-server
 * both collapse to "node".
 */
function dependencyUpdaterVariant(group: StackGroup): string {
  if (group === "node-web" || group === "node-server") return "node";
  return group;
}

// ─── Handler ───────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let payload: Payload;
  try {
    const body = await req.json();
    payload = PayloadSchema.parse(body);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid payload";
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const templatesRoot = path.join(process.cwd(), "templates");
  const sourceDir = path.join(
    templatesRoot,
    payload.mode === "greenfield" ? "greenfield" : "overlay"
  );

  // Verify template dir exists
  try {
    await fs.access(sourceDir);
  } catch {
    return new Response(
      JSON.stringify({ error: `Template not found: ${payload.mode}` }),
      { status: 500, headers: { "content-type": "application/json" } }
    );
  }

  // Build the file map
  const files = await collectFiles(sourceDir, payload);

  // Generated, project-specific files
  files.push({
    name: "README.md",
    content: renderReadme(payload),
  });
  files.push({
    name: "install.sh",
    content: await readSafe(path.join(templatesRoot, "install.sh")),
    mode: 0o755,
  });

  // Extras — optional config files at project root (one source → one dest).
  const EXTRAS_MAP: Record<Payload["extras"][number], { src: string; dest: string; mode?: number }> = {
    editorconfig: { src: "extras/.editorconfig", dest: ".editorconfig" },
    prettierrc: { src: "extras/.prettierrc.json", dest: ".prettierrc.json" },
    makefile: { src: "extras/Makefile", dest: "Makefile" },
    dockerfile: { src: "extras/Dockerfile", dest: "Dockerfile" },
    "docker-compose": { src: "extras/docker-compose.yml", dest: "docker-compose.yml" },
    "vscode-settings": { src: "extras/.vscode/settings.json", dest: ".vscode/settings.json" },
    "github-ci": { src: "extras/github/workflows/ci.yml", dest: ".github/workflows/ci.yml" },
  };
  for (const extra of payload.extras) {
    const info = EXTRAS_MAP[extra];
    if (!info) continue;
    const buf = await readBuf(path.join(templatesRoot, info.src));
    if (buf) files.push({ name: info.dest, content: buf, mode: info.mode });
  }

  // Add .dockerignore automatically if dockerfile or docker-compose chosen
  if (payload.extras.includes("dockerfile") || payload.extras.includes("docker-compose")) {
    const buf = await readBuf(path.join(templatesRoot, "extras/.dockerignore"));
    if (buf) files.push({ name: ".dockerignore", content: buf });
  }

  // License file at project root
  if (payload.license !== "none") {
    const buf = await readSafe(path.join(templatesRoot, "licenses", `${payload.license}.txt`));
    if (buf) {
      files.push({
        name: "LICENSE",
        content: buf
          // Case-insensitive replacements for the common SPDX placeholders.
          // MIT.txt uses "[year] [fullname]"; Apache-2.0/AGPL-3.0 use other forms.
          .replace(/\[year\]/gi, String(new Date().getFullYear()))
          .replace(/\[fullname\]/gi, payload.projectName)
          .replace(/<year>/gi, String(new Date().getFullYear()))
          .replace(/<name of author>/gi, payload.projectName)
          .replace(/<name of copyright owner>/gi, payload.projectName),
      });
    }
  }

  // Stream archive
  const archive = archiver("zip", { zlib: { level: 9 } });

  for (const f of files) {
    if (f.content === null) continue;
    archive.append(f.content, {
      name: `${payload.projectName}/${f.name}`,
      mode: f.mode,
    });
  }

  archive.finalize();

  // Web ReadableStream from Node Readable
  const webStream = Readable.toWeb(
    archive as unknown as Readable
  ) as ReadableStream<Uint8Array>;

  return new Response(webStream, {
    status: 200,
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${payload.projectName}.zip"`,
      "cache-control": "no-store",
    },
  });
}

// ─── File collection (with selection logic) ────────────────────────────────

interface ZipFile {
  name: string;
  content: string | Buffer | null;
  mode?: number;
}

async function collectFiles(
  sourceDir: string,
  payload: Payload
): Promise<ZipFile[]> {
  const out: ZipFile[] = [];
  const entries = await walk(sourceDir);
  const stackGroup = dominantStackGroup(payload.stack);

  // Variant agents: each has its own subfolder with one file per stack group
  // plus a `default.md` fallback. Resolved AFTER the main loop so we can
  // gracefully fall back to default when the desired variant is missing.
  const VARIANT_AGENT_PICKS: Record<string, string> = {
    "test-writer": stackGroup,
    "dependency-updater": dependencyUpdaterVariant(stackGroup),
  };
  const variantAgentNames = new Set(Object.keys(VARIANT_AGENT_PICKS));

  for (const abs of entries) {
    const rel = path.relative(sourceDir, abs).split(path.sep).join("/");

    // Selection rules ────────────────────────────────────────────────────
    if (rel.startsWith(".claude/agents/")) {
      const segments = rel.split("/"); // [".claude", "agents", <name-or-folder>, ...]
      const agentNode = segments[2];
      if (!agentNode) continue;

      // Variant folder: skip here, resolved after the loop.
      if (variantAgentNames.has(agentNode)) continue;

      const agentName = path.basename(agentNode, ".md");
      if (!payload.agents.includes(agentName as Payload["agents"][number])) continue;
    }

    if (rel.startsWith(".claude/skills/")) {
      const skill = rel.split("/")[2];
      if (
        !skill ||
        !payload.skills.includes(skill as Payload["skills"][number])
      )
        continue;
    }

    if (rel === "DESIGN.md") {
      if (payload.designSystem === "skip") continue;
      if (payload.designSystem === "empty-template") {
        out.push({ name: rel, content: renderEmptyDesign(payload) });
        continue;
      }
      // use-example → read template + substitute palette hex values.
      const raw = await fs.readFile(abs, "utf-8");
      out.push({ name: rel, content: customizeDesignMd(raw, payload) });
      continue;
    }

    if (rel === ".mcp.json") {
      out.push({ name: rel, content: renderMcpJson(payload) });
      continue;
    }

    if (rel === "CLAUDE.md" || rel === "CLAUDE.md.template") {
      const raw = await fs.readFile(abs, "utf-8");
      out.push({
        name: "CLAUDE.md",
        content: customizeClaudeMd(raw, payload),
      });
      continue;
    }

    // Default: copy as-is
    const buf = await fs.readFile(abs);
    const isExecutable = abs.endsWith(".sh");
    out.push({ name: rel, content: buf, mode: isExecutable ? 0o755 : undefined });
  }

  // Resolve variant agents (test-writer, dependency-updater).
  // Pick the desired variant, fall back to default.md if missing.
  for (const [agentName, desiredVariant] of Object.entries(VARIANT_AGENT_PICKS)) {
    if (!payload.agents.includes(agentName as Payload["agents"][number])) continue;

    const variantDir = path.join(sourceDir, ".claude", "agents", agentName);
    const desiredPath = path.join(variantDir, `${desiredVariant}.md`);
    const fallbackPath = path.join(variantDir, "default.md");

    let chosenPath: string | null = null;
    try {
      await fs.access(desiredPath);
      chosenPath = desiredPath;
    } catch {
      try {
        await fs.access(fallbackPath);
        chosenPath = fallbackPath;
      } catch {
        // Neither variant nor default exists — skip silently.
      }
    }

    if (chosenPath) {
      const buf = await fs.readFile(chosenPath, "utf-8");
      out.push({ name: `.claude/agents/${agentName}.md`, content: buf });
    }
  }

  return out;
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  async function recurse(d: string) {
    const items = await fs.readdir(d, { withFileTypes: true });
    for (const item of items) {
      const p = path.join(d, item.name);
      if (item.isDirectory()) await recurse(p);
      else if (item.isFile()) out.push(p);
    }
  }
  await recurse(dir);
  return out;
}

async function readSafe(p: string): Promise<string> {
  try {
    return await fs.readFile(p, "utf-8");
  } catch {
    return "";
  }
}

async function readBuf(p: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(p);
  } catch {
    return null;
  }
}

// ─── Customizers ───────────────────────────────────────────────────────────

// ─── Color helpers ─────────────────────────────────────────────────────────

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

/**
 * Lighten or darken a hex color by an amount in [-1, 1].
 * Negative = darker, positive = lighter. Naive RGB-space mix — fine for
 * generating hover variants from a base.
 */
function shadeHex(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  if (amount >= 0) {
    return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
  }
  const a = 1 + amount; // 0..1
  return rgbToHex(r * a, g * a, b * a);
}

/**
 * Replace the default palette hex values in templates/greenfield/DESIGN.md
 * with the user's chosen primary + accent. Hover variants are derived
 * mechanically (primary → +6% lighten, accent → -6% darken).
 *
 * Substitution is case-insensitive on the hex input but always emits
 * uppercase to match the template's existing convention.
 */
function customizeDesignMd(raw: string, p: Payload): string {
  const primary = p.colors.primary.toUpperCase();
  const accent = p.colors.accent.toUpperCase();
  const primaryHover = shadeHex(primary, 0.06);
  const accentHover = shadeHex(accent, -0.06);

  // Map of template hex → replacement. Order matters only when one is a
  // prefix/substring of another — which it isn't here, so a simple loop
  // suffices.
  const replacements: Array<[RegExp, string]> = [
    [/#1A2B3C/gi, primary],
    [/#243748/gi, primaryHover],
    [/#D4824A/gi, accent],
    [/#C4723A/gi, accentHover],
  ];

  let out = raw;
  for (const [re, val] of replacements) out = out.replace(re, val);

  // Project name in the H1 if present.
  out = out.replace(/^# Cordée\.IA — Design System/m, `# ${p.projectName} — Design System`);
  return out;
}

function customizeClaudeMd(raw: string, p: Payload): string {
  let out = raw;
  out = out.replaceAll("[PROJECT NAME]", p.projectName);
  out = out.replaceAll(
    "[STACK]",
    p.stack.length ? p.stack.map((s) => STACK_LABELS[s]).join(" + ") : "Unspecified"
  );
  if (p.projectDescription.trim()) {
    out = out.replace(
      "[1-2 lines: what does this project do, for whom, what does success look like.]",
      p.projectDescription.trim()
    );
  }
  return out;
}

function renderMcpJson(p: Payload): string {
  const allMcps: Record<string, Record<string, unknown>> = {
    notion: { type: "http", url: "https://mcp.notion.com/mcp" },
    context7: {
      type: "stdio",
      command: "npx",
      args: ["-y", "@upstash/context7-mcp@latest"],
    },
    playwright: {
      type: "stdio",
      command: "npx",
      args: ["-y", "@playwright/mcp@latest"],
    },
    figma: { type: "http", url: "https://mcp.figma.com/mcp" },
    sentry: { type: "http", url: "https://mcp.sentry.dev/mcp" },
    linear: { type: "http", url: "https://mcp.linear.app/mcp" },
    github: { type: "http", url: "https://mcp.github.com/mcp" },
    vercel: {
      type: "stdio",
      command: "npx",
      args: ["-y", "@vercel/mcp@latest"],
    },
    supabase: {
      type: "stdio",
      command: "npx",
      args: ["-y", "@supabase/mcp-server@latest"],
    },
    stripe: { type: "http", url: "https://mcp.stripe.com/mcp" },
    postgres: {
      type: "stdio",
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-postgres@latest"],
    },
    slack: { type: "http", url: "https://mcp.slack.com/mcp" },
  };

  const servers: Record<string, unknown> = {};
  for (const m of p.mcps) {
    if (allMcps[m]) servers[m] = allMcps[m];
  }

  return JSON.stringify(
    {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      mcpServers: servers,
    },
    null,
    2
  );
}

function renderReadme(p: Payload): string {
  const stack = p.stack.length
    ? p.stack.map((s) => `- ${STACK_LABELS[s]}`).join("\n")
    : "- À définir";
  const agents = p.agents.length
    ? p.agents.map((a) => `- \`${a}\``).join("\n")
    : "- Aucun agent sélectionné";
  const skills = p.skills.length
    ? p.skills.map((s) => `- \`/${s}\``).join("\n")
    : "- Aucun skill sélectionné";
  const mcps = p.mcps.length
    ? p.mcps.map((m) => `- \`${m}\``).join("\n")
    : "- Aucun MCP sélectionné";

  const firstPrompt =
    p.mode === "greenfield"
      ? "/kickoff (initialise le projet à partir de zéro)"
      : "/audit (cartographie le codebase existant)";

  return `# ${p.projectName}

${p.projectDescription || "Projet généré par Cordée.IA — starter Claude Code + Claude Design."}

## Mode

${p.mode === "greenfield" ? "**Greenfield** — projet vierge, scaffold complet." : "**Overlay** — surcouche Claude par-dessus un repo existant."}

## Stack

${stack}

## Agents Claude inclus

${agents}

## Skills

${skills}

## MCPs configurés

${mcps}

## Design system

${
  p.designSystem === "use-example"
    ? "Exemple Cordée (granite + cuivre) inclus dans `DESIGN.md`."
    : p.designSystem === "empty-template"
    ? "Template vide à 9 sections inclus dans `DESIGN.md`."
    : "Pas de DESIGN.md (projet sans interface)."
}

## Démarrage

\`\`\`bash
# 1. Installe (greenfield ou overlay)
bash install.sh

# 2. Lance Claude Code
claude

# 3. Premier prompt
${firstPrompt}
\`\`\`

## Documentation

- \`CLAUDE.md\` — instructions Claude Code (lu à chaque session)
- \`DESIGN.md\` — design system (si applicable)
- \`.claude/rules/\` — coding standards, git workflow, sécurité
- \`.claude/agents/\` — agents spécialisés
- \`.claude/skills/\` — slash commands réutilisables

---

Généré par [Cordée.IA](https://github.com/jdvot/cordee-ia) — MIT.
`;
}

function renderEmptyDesign(p: Payload): string {
  const primary = p.colors.primary.toUpperCase();
  const accent = p.colors.accent.toUpperCase();
  return `# ${p.projectName} — Design System

> Squelette à remplir. Les 9 sections sont obligatoires pour qu'un agent design produise un site cohérent.

## 1. Visual Theme & Atmosphere

## 2. Color Palette & Roles

\`\`\`css
:root {
  /* Primary — pré-rempli depuis le générateur Cordée.IA */
  --color-primary: ${primary};
  --color-primary-hover: ${shadeHex(primary, 0.06)};
  --color-primary-foreground: #F8F7F4;

  /* Accent */
  --color-accent: ${accent};
  --color-accent-hover: ${shadeHex(accent, -0.06)};
  --color-accent-foreground: ${primary};

  /* À compléter : background, foreground, muted, border, success, etc. */
}
\`\`\`

## 3. Typography

## 4. Spacing & Layout

## 5. Components

## 6. Motion & Interactions

## 7. Imagery & Iconography

## 8. Tone & Voice

## 9. Accessibility

---

Modèle inspiré du DESIGN.md d'exemple Cordée — voir [cordee-ia](https://github.com/jdvot/cordee-ia).
`;
}
