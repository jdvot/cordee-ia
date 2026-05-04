# [PROJECT NAME]

> Claude Code reads this on every session. Keep it concise (Anthropic guidance: under 300 lines, shorter is better).
> Structure follows WHAT / WHY / HOW. Reference: https://www.humanlayer.dev/blog/writing-a-good-claude-md

## WHAT

[1-2 lines: what does this project do, for whom.]

**Stack**
- Frontend: [FRONTEND]
- Backend: [BACKEND]
- DB: ?
- Auth: ?
- Hosting: ?

## WHY

[Domain context, business constraints, non-obvious decisions already made.
This is what Claude can't infer from the code. Keep it 3-5 bullets.]

- ?
- ?
- ?

## HOW

**Commands**
```bash
[COMMANDS_BLOCK]
```

**Conventions**
- Code style → `.claude/rules/coding-standards.md`
- Git workflow → `.claude/rules/git-workflow.md`
- Secrets and data → `.claude/rules/security.md`
- Visual design → `DESIGN.md`

**Don't**
- Edit `.env*`, `*.key`, `credentials.json` (blocked by `.claude/hooks/pre-edit-secrets.sh`)
- Edit generated files (Prisma client, OpenAPI types, etc.)
- `git add -A` without `git status` first (leak risk)
- Premature abstractions (3 similar lines beats a wrong helper)

## Tooling

**Agents** (in `.claude/agents/`) — invoked via `Task(subagent_type=…)`. List: `ls .claude/agents/`.

**Skills** (in `.claude/skills/`) — invoked as slash commands.
Day 0:
- `/kickoff` — fill in the blanks above by asking you questions
- `/audit` — map an existing codebase

**MCPs** (in `.mcp.json`) — already configured per the questionnaire.

## Models (90/10 routing)

90 % Sonnet 4.6 (mechanical: research, docs, deps, restructure).
10 % Opus 4.7 + `effort: xhigh` (reasoning: challenger, code review, db migrations, security audit).

`teammateMode: "auto"` (default) routes to Sonnet for simple tasks. `"tmux"` forces Opus 4.7 + multi-pane.

Anthropic guidance: this 90/10 routing cuts cost by up to 70 % with no measurable quality loss on most workflows.

## Marketplace

Before writing a custom skill or agent, check if Anthropic ships it:
- [`anthropics/skills`](https://github.com/anthropics/skills)
- [`anthropics/claude-plugins-official`](https://github.com/anthropics/claude-plugins-official)
- [marketplace.anthropic.com](https://marketplace.anthropic.com)

Install: `/plugin install <name>@claude-plugins-official`.

## Project-specific notes

[Gotchas, business rules, third-party integrations, on-call info.
This section grows over time. Edit as you learn.]
