---
name: audit
description: Audit an existing codebase. Maps the structure, lists tech debt, identifies high-risk areas, suggests where Claude Code can help safely. Run once after dropping the overlay.
---

# /audit

Maps an existing codebase Claude Code is meeting for the first time.

## What it does

1. Reads `package.json` / `pyproject.toml` / `go.mod` to detect stack and key deps.
2. Walks top-level dirs, samples files to understand architecture.
3. Lists obvious tech debt (TODO/FIXME, deprecated libs, files > 500 lines).
4. Flags security/secret risks (hardcoded keys, weak hash algorithms, missing input validation).
5. Identifies safe entry points for Claude Code (well-tested modules, isolated features).
6. Identifies risky areas (legacy core, untested critical paths, god classes).
7. Suggests 3 starter improvements with low risk + measurable value.

## When to use

- Day 0 after installing the claude-overlay on an existing repo.
- After major version changes you didn't write yourself.
- When onboarding a new dev — pair them with this report.
- Before quoting a refactor mission to a client.

## When NOT to use

- Tiny repos (< 20 files) — just open them with `claude` and read.
- Codebases you wrote yourself last week — you already have the map.
- Mid-incident — fix the fire first, audit later.

## Gotchas

- **Sampling, not exhaustive** — the audit reads representative files, not every file. A specific bug in an unsampled module will be missed.
- **No runtime info** — pure static read. Performance hotspots only show up under load; this won't surface them.
- **Heuristics for "risky"** — based on size, last-edit date, and test coverage signals. A small well-tested file editing prod data is "safe-looking" but still risky.
- **Generated files inflate metrics** — Prisma client, OpenAPI types, `.next/`, `dist/`. The audit excludes common patterns but custom generators may slip through. Add to `.gitignore` or pass an exclude list.
- **3 suggested PRs are starting points, not gospel** — they prioritize low risk, not highest impact. Pair with a human PM call.

## Inputs needed

- Optional: paths to exclude (default excludes `node_modules/`, `dist/`, `.next/`, `vendor/`).
- Optional: focus area (`security`, `perf`, `dx`) — filters the suggested PRs.

## Output

A markdown report with:
- Stack summary (detected versions, key deps).
- Top 5 risk areas (file path, why risky, blast radius).
- Top 5 safe starter zones (good for first AI-assisted PRs).
- 3 suggested PRs with effort estimate (S/M/L) and expected payoff.
