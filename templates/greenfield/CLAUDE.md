# [PROJECT NAME] — fill in at kickoff

> First file Claude Code reads every session. Keep it under 300 lines.
> Format : WHAT / WHY / HOW (https://www.humanlayer.dev/blog/writing-a-good-claude-md)

## WHAT — project in 2 lines

[1-2 lines: what does this project do, for whom, what does success look like.]

## WHY — context Claude needs to make good calls

[Domain context, business constraints, non-obvious decisions already made.]

## Stack

[List your stack here. No assumptions baked in.]
- Frontend: ?
- Backend: ?
- DB: ?
- Auth: ?
- Hosting: ?

## Commands

```bash
# Dev
?

# Build
?

# Test
?

# Lint
?
```

## Conventions

- See `.claude/rules/coding-standards.md` for code style.
- See `.claude/rules/git-workflow.md` for branching and PRs.
- See `.claude/rules/security.md` for secrets and data handling.
- See `DESIGN.md` for visual design system.

## Agents available

- `researcher` — web research expert, factual-only output
- `challenger` — devil's advocate, attacks every decision
- `reviewer` — code reviewer for existing code (no writing)
- `page-writer` — owns one page (Notion or markdown)

To launch a team: `/team` (requires Opus 4.6 + tmux/iTerm2 for split-pane).

## Skills available

- `/kickoff` — initialize a fresh project (run once at project start)
- `/audit` — map an existing codebase Day 0 (run after `install.sh`)
- `/design-handoff` — receive a Claude Design bundle and scaffold Next.js + Tailwind + Shadcn

## MCPs configured

- `notion` — boards, docs, tickets
- `context7` — up-to-date library docs
- (Optional) `playwright`, `figma`, `sentry`, `linear` — uncomment in `.mcp.json` per project need

## Don't

- Edit `.env*`, `*.key`, `credentials.json` — blocked by `.claude/hooks/pre-edit-secrets.sh`
- Edit generated files (Prisma client, OpenAPI types, etc.) directly
- Skip `git status` before `git add -A` (avoid leaking secrets)
- Premature abstractions (3 similar lines > a wrong helper)

## Project-specific notes

[Add per-project gotchas, business rules, integrations.]
