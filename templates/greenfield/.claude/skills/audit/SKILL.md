---
name: audit
description: Audit an existing codebase. Maps the structure, lists tech debt, identifies high-risk areas, suggests where Claude Code can help safely. Run once after dropping the overlay.
---

# /audit

Maps an existing codebase Claude Code is meeting for the first time.

## What it does

1. Reads `package.json` / `pyproject.toml` / `go.mod` to detect stack.
2. Walks top-level dirs, samples files to understand architecture.
3. Lists obvious tech debt (TODO/FIXME, deprecated libs, large files > 500 lines).
4. Flags security/secret risks (hardcoded keys, weak hash, etc.).
5. Identifies safe entry points for Claude Code (well-tested modules, isolated features).
6. Identifies risky areas (legacy core, untested critical paths).
7. Suggests 3 starter improvements with low risk + measurable value.

## When to use

- Day 0 after installing claude-overlay on an existing repo.
- After major version changes you didn't write.
- When onboarding a new dev and you want a quick architecture map.

## When NOT to use

- Tiny repos (< 20 files) — overkill, just open them.
- Codebases you wrote 100% yourself last week — you already know.

## Output format

Markdown report with:
- Stack summary
- Top 5 risk areas
- Top 5 safe starter zones
- 3 suggested PRs with effort estimate (S/M/L)
