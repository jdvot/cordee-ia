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

To launch a team: `/team` (requires Opus 4.7 + tmux/iTerm2 for split-pane).

## Modèles Claude — routing recommandé

- **Tâches mécaniques / factuelles** (research, doc, bump deps, restructure) : `model: sonnet` (Sonnet 4.6 par défaut).
- **Reasoning lourd** (challenger, code review, db migration review, security audit) : `model: opus` + `effort: xhigh`.
- **Agent Teams (`/team`)** : nécessite **Opus 4.7** (Pro / Max / Enterprise) — Sonnet 4.6 ne supporte pas le mode multi-équipiers.
- **1M context** : disponible sur Opus 4.7 — utile pour `/audit` sur gros monorepo (100k+ lignes).
- **`teammateMode: "auto"`** : par défaut, compatible Sonnet pour les tâches simples ; `"tmux"` force le routage Opus.

Recommandation Anthropic : **90 % Sonnet 4.6, 10 % Opus 4.7** = jusqu'à -70 % de coût avec qualité préservée sur la majorité des workflows.

## Marketplace Anthropic

Avant d'écrire un skill ou un agent maison, vérifie si Anthropic ou la communauté propose déjà l'équivalent officiel :

- [`anthropics/skills`](https://github.com/anthropics/skills) — skills officiels (frontend-design, claude-api, etc.).
- [`anthropics/claude-plugins-official`](https://github.com/anthropics/claude-plugins-official) — plugins vérifiés Anthropic.
- Marketplace : [marketplace.anthropic.com](https://marketplace.anthropic.com).
- Installation : `/plugin install <name>@claude-plugins-official`.

Réutiliser un plugin officiel évite la dette de maintenance et bénéficie des mises à jour upstream.

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
