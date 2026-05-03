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

- Day 0 of a new project.
- After cloning a `claude-workspace-starter` template.

## When NOT to use

- Project already has a customized `CLAUDE.md` you want to keep.
- You're mid-feature; don't run `/kickoff` on a live codebase, it overwrites.

## Inputs needed

- Project name + 2-line description
- Stack (Next.js / NestJS / FastAPI / etc.) — auto-detected if `package.json` or `pyproject.toml` exists
- Cible audience (devs internal / clients externe)
