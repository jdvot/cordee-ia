"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FileTreeNode {
  /** Display name (filename or directory). */
  name: string;
  /** Stable unique id (relative path is fine). */
  id: string;
  /** Optional children — presence marks this as a directory. */
  children?: FileTreeNode[];
  /** Optional badge text rendered to the right (e.g. count, "agent"). */
  badge?: string;
}

interface FileTreePreviewProps {
  /** Tree to render (deterministic order). */
  nodes: FileTreeNode[];
  /** Total file count, displayed in the header. */
  total?: number;
  /** Section title. */
  title?: string;
  /** Subtitle / hint. */
  subtitle?: string;
  className?: string;
}

/**
 * Live file-tree preview. Animates additions / removals via framer-motion's
 * AnimatePresence. Designed to sit beside a questionnaire and reflect
 * current selections in real time.
 */
export function FileTreePreview({
  nodes,
  total,
  title = "Aperçu du .zip",
  subtitle,
  className,
}: FileTreePreviewProps) {
  return (
    <div
      className={cn(
        "rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)]",
        "overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[var(--color-border)]">
        <div>
          <div
            className="text-xs font-mono uppercase tracking-[0.12em] text-[var(--color-accent)]"
          >
            {title}
          </div>
          {subtitle && (
            <div className="text-xs text-[var(--color-muted-foreground)] mt-1">
              {subtitle}
            </div>
          )}
        </div>
        {typeof total === "number" && (
          <div
            className="font-mono text-xs px-2.5 py-1 rounded-full border border-[var(--color-border)] tabular-nums text-[var(--color-muted-foreground)]"
            aria-live="polite"
          >
            {total} fichier{total === 1 ? "" : "s"}
          </div>
        )}
      </div>

      {/* Tree */}
      <ul
        className="font-mono text-[13px] leading-[1.7] py-3 px-2"
        role="tree"
      >
        <AnimatePresence initial={false}>
          {nodes.map((n) => (
            <Branch key={n.id} node={n} depth={0} />
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function Branch({
  node,
  depth,
  isLast = false,
}: {
  node: FileTreeNode;
  depth: number;
  isLast?: boolean;
}) {
  const isDir = !!node.children && node.children.length > 0;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -6, height: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      role="treeitem"
      aria-expanded={isDir ? true : undefined}
      style={{ paddingLeft: depth * 16 }}
    >
      <div className="flex items-center gap-2 py-[2px] px-2 rounded-[4px] hover:bg-[var(--color-accent)]/[0.06] transition-colors">
        {/* Tree connector */}
        <span
          aria-hidden="true"
          className="text-[var(--color-muted)] select-none"
        >
          {depth === 0 ? "" : isLast ? "└─" : "├─"}
        </span>
        {/* Icon */}
        <span
          aria-hidden="true"
          className={cn(
            "inline-block w-3 text-center",
            isDir
              ? "text-[var(--color-accent)]"
              : "text-[var(--color-muted-foreground)]"
          )}
        >
          {isDir ? "▸" : "·"}
        </span>
        <span
          className={cn(
            isDir
              ? "text-[var(--color-foreground)] font-medium"
              : "text-[var(--color-muted-foreground)]"
          )}
        >
          {node.name}
          {isDir ? "/" : ""}
        </span>
        {node.badge && (
          <span
            className="ml-auto text-[10px] uppercase tracking-[0.1em] text-[var(--color-muted)] font-mono"
          >
            {node.badge}
          </span>
        )}
      </div>
      {isDir && (
        <ul role="group">
          <AnimatePresence initial={false}>
            {node.children!.map((c, i) => (
              <Branch
                key={c.id}
                node={c}
                depth={depth + 1}
                isLast={i === node.children!.length - 1}
              />
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.li>
  );
}

// ─── Builder helpers ───────────────────────────────────────────────────────

export interface ZipSelections {
  projectName?: string;
  mode: "greenfield" | "overlay";
  agents: string[];
  skills: string[];
  mcps: string[];
  extras: string[];
  designSystem: "use-example" | "empty-template" | "skip";
  license: "MIT" | "Apache-2.0" | "AGPL-3.0" | "none";
}

/**
 * Builds a deterministic FileTreeNode[] from current questionnaire selections.
 * Mirrors the actual generator output but lives entirely client-side — no
 * round-trip to /api/generate is required for the preview.
 */
export function buildZipTree(s: ZipSelections): {
  nodes: FileTreeNode[];
  total: number;
} {
  const root = (s.projectName?.trim() || "your-project").toLowerCase();
  const claudeChildren: FileTreeNode[] = [
    { id: ".claude/settings.json", name: "settings.json" },
  ];

  if (s.agents.length > 0) {
    claudeChildren.push({
      id: ".claude/agents",
      name: "agents",
      badge: `${s.agents.length}`,
      children: s.agents.map((a) => ({
        id: `.claude/agents/${a}.md`,
        name: `${a}.md`,
      })),
    });
  }

  if (s.skills.length > 0) {
    claudeChildren.push({
      id: ".claude/skills",
      name: "skills",
      badge: `${s.skills.length}`,
      children: s.skills.map((sk) => ({
        id: `.claude/skills/${sk}.md`,
        name: `${sk}.md`,
      })),
    });
  }

  // Hooks: mode-dependent
  if (s.mode === "greenfield") {
    claudeChildren.push({
      id: ".claude/hooks",
      name: "hooks",
      badge: "2",
      children: [
        { id: ".claude/hooks/pre-tool-use.sh", name: "pre-tool-use.sh" },
        { id: ".claude/hooks/post-tool-use.sh", name: "post-tool-use.sh" },
      ],
    });
  }

  // Rules
  claudeChildren.push({
    id: ".claude/rules",
    name: "rules",
    badge: "3",
    children: [
      { id: ".claude/rules/security.md", name: "security.md" },
      { id: ".claude/rules/git-workflow.md", name: "git-workflow.md" },
      { id: ".claude/rules/coding.md", name: "coding.md" },
    ],
  });

  const rootChildren: FileTreeNode[] = [
    { id: ".claude", name: ".claude", children: claudeChildren },
    { id: "CLAUDE.md", name: "CLAUDE.md" },
  ];

  if (s.designSystem !== "skip") {
    rootChildren.push({
      id: "DESIGN.md",
      name: "DESIGN.md",
      badge: s.designSystem === "use-example" ? "exemple" : "vide",
    });
  }

  if (s.mcps.length > 0) {
    rootChildren.push({
      id: ".mcp.json",
      name: ".mcp.json",
      badge: `${s.mcps.length}`,
    });
  }

  if (s.mode === "greenfield") {
    rootChildren.push({ id: "install.sh", name: "install.sh" });
  } else {
    rootChildren.push({
      id: "install.sh",
      name: "install.sh",
      badge: "overlay",
    });
  }

  rootChildren.push({ id: "README.md", name: "README.md" });

  if (s.license !== "none") {
    rootChildren.push({ id: "LICENSE", name: "LICENSE", badge: s.license });
  }

  // Extras
  const EXTRA_FILES: Record<string, string> = {
    editorconfig: ".editorconfig",
    prettierrc: ".prettierrc.json",
    makefile: "Makefile",
    dockerfile: "Dockerfile",
    "docker-compose": "docker-compose.yml",
    "vscode-settings": ".vscode/settings.json",
    "github-ci": ".github/workflows/ci.yml",
  };
  for (const ex of s.extras) {
    const filename = EXTRA_FILES[ex];
    if (filename) {
      rootChildren.push({ id: `extra:${ex}`, name: filename });
    }
  }

  const tree: FileTreeNode[] = [
    { id: "root", name: root, children: rootChildren },
  ];

  // Total file count (leaves only)
  const total = countLeaves(tree);
  return { nodes: tree, total };
}

function countLeaves(nodes: FileTreeNode[]): number {
  let n = 0;
  for (const node of nodes) {
    if (node.children && node.children.length > 0) {
      n += countLeaves(node.children);
    } else {
      n += 1;
    }
  }
  return n;
}
