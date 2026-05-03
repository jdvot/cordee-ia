# Contributing

Thanks for your interest in contributing. This document covers branching,
commit style, PRs, and how Claude Code is wired into the team workflow.

## Branching

- `main` is protected. Never push directly.
- Branch names: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`,
  `hotfix/<short-name>`.
- Default base: `staging` if the repo runs a staging→main flow, otherwise
  `main`. See `.claude/rules/git-workflow.md` for detail.
- Worktrees recommended for parallel work:
  `git worktree add ../wt-<name> -b feat/<name> staging`

## Commits

- Conventional Commits: `feat(scope): subject`, `fix(scope): subject`,
  `chore(scope): subject`, `docs(scope): subject`, `test(scope): subject`.
- One logical change per commit. Multi-purpose commits are nightmares to
  revert.
- Body: explain the **why**, not the **what** (the diff already shows what).

## Pull Requests

- Title under 70 chars.
- Body must include:
  - **## Summary** — 1 to 3 bullets describing the change.
  - **## Test plan** — checklist of how the change was verified.
  - **## Screenshots** — for any UI change, before / after.
- Co-author Claude Code if AI-assisted:
  `Co-Authored-By: Claude <noreply@anthropic.com>`
- Request review from the relevant `CODEOWNERS` group.

## Review SLA

- Standard PRs: review within 1 business day.
- Hotfixes: review within 2 hours during business hours.
- Drafts: open them early; reviewers can comment without being assigned.

## Claude Code in this repo

Every team member is expected to have Claude Code configured locally
(`.claude/` is checked in). See `CLAUDE.md` for project-wide instructions.

- Agents (`.claude/agents/`) are shared. Don't rename or reshape them
  without team agreement — submit a PR if you want a new one.
- Skills (`.claude/skills/`) are shared too. Adding one is fine; renaming
  or removing one needs a heads-up in the team channel.
- MCPs (`.mcp.json`) are committed. If you add one that needs an API key,
  document the env var in `.env.example` (never commit the secret).
- Rules (`.claude/rules/`) are the team's coding contract. Changes go
  through PR.

## Local setup

```bash
# Clone + install
git clone <repo>
cd <repo>
# follow README setup steps

# Verify Claude Code reads the config
claude --help
# In a Claude Code session, the welcome banner should mention
# the agents and skills loaded from .claude/
```

## Reporting issues

Use the GitHub issue templates (`.github/ISSUE_TEMPLATE/`):
- **Bug report** for unexpected behavior.
- **Feature request** for new functionality.

Please search existing issues before opening a new one.

## Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/).
Be kind, be specific, be patient.
