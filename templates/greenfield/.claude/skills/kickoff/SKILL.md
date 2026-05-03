---
name: kickoff
description: Initialize a new project with sensible Claude Code defaults — CLAUDE.md, DESIGN.md, .gitignore, basic agent team. Run once at project start.
---

# /kickoff

Bootstraps a new project so Claude Code (and a future team) has everything it needs.

## What it does

1. Reads the user's project description.
2. Generates a project-specific `CLAUDE.md` (stack, conventions, do/don't).
3. Generates an empty `DESIGN.md` 9-section template (visual theme, tokens, components, layout, do/don't, responsive, agent prompt guide).
4. Adds a `.gitignore` adapted to detected stack.
5. Creates 2-3 starter sub-agents (researcher, challenger, reviewer) tailored to the project.
6. Suggests 2-3 starter skills (e.g. `/audit`, `/handoff`, `/release`).

## When to use

- Day 0 of a new project — empty repo or just-cloned starter.
- After cloning a `claude-workspace-starter` template.
- When onboarding a side-project that has no `.claude/` folder yet.

## When NOT to use

- Project already has a customized `CLAUDE.md` you want to keep — `/kickoff` overwrites.
- You're mid-feature on a live codebase — wait until between sprints.
- The repo is < 10 files of throwaway code — overkill, just open `claude` and ask.

## Gotchas

- **Overwrites silently** — there is no "merge mode". If `CLAUDE.md` exists, it gets rewritten. Back up first.
- **Stack auto-detection is naive** — reads `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`. Polyglot repos may need manual stack hint.
- **Generated agents reference tools that may not be installed** — if you uncheck `playwright` in `.mcp.json`, remove the matching tool entries in `a11y-auditor.md` or it will fail at first invocation.
- **`DESIGN.md` is empty by design** — running `/kickoff` does NOT call Claude Design. Run a Claude Design session separately, then `/design-handoff` to populate.
- **Agents on Opus require Pro/Max/Enterprise** — if your plan is Free, switch their `model:` frontmatter to `sonnet` before first run.

## Inputs needed

- Project name + 2-line description.
- Stack hint (Next.js / NestJS / FastAPI / Django / etc.) — auto-detected when manifests are present.
- Target audience (internal devs / external clients / both).

## Output

- `CLAUDE.md`, `DESIGN.md`, `.gitignore` written at repo root.
- `.claude/agents/`, `.claude/skills/`, `.claude/rules/`, `.claude/hooks/` populated.
- A short "next 3 steps" report — typically: run `/audit`, install MCPs you ticked, open the first PR with the new conventions.
