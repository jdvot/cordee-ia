---
description: Branching, PRs, commits — generic git workflow
alwaysApply: true
---

# Git Workflow

## Branching

- Feature branches off `main` (or `staging` if multi-env): `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.
- Worktrees in parent directory: `git worktree add ../wt-<name> -b <branch> main`.
- Never push directly to `main` — always PR.

## When to branch off `staging` vs `main`

Pick the base branch that matches the gate the change must clear before reaching prod.

- **Branch off `staging`** when:
  - The repo runs a `staging → main` integration flow with QA on staging.
  - The change needs to bake on a shared environment with other in-flight features.
  - The team uses preview / staging deployments for stakeholder review.
  - Default for `feat/*` and routine `fix/*` work in mature multi-env repos.
- **Branch off `main`** when:
  - The repo is single-env (no staging) — `main` is production.
  - You're shipping a hotfix that must reach prod before next staging promotion (`hotfix/<short-name>`).
  - `staging` has diverged or is broken and you'd rebase later anyway.
  - Documentation-only changes that don't need staging validation.
- **Worktree commands**:
  - `git worktree add ../wt-<name> -b feat/<name> staging` (default)
  - `git worktree add ../wt-<name> -b hotfix/<name> main` (urgent prod fix)
- **Rebase rule**: before pushing, `git rebase origin/<base>` to keep history linear and surface conflicts early.

## Commits

- Conventional Commits format: `feat(scope): subject`, `fix(scope): subject`, `chore(scope): subject`.
- Keep each commit one logical change. Multi-purpose commits = nightmare to revert.
- Commit message body: explain WHY, not WHAT (the diff already shows what).

## Pull Requests

- Title under 70 chars.
- Body: ## Summary (1-3 bullets) + ## Test plan (checklist).
- Co-author Claude when AI-assisted: `Co-Authored-By: Claude <noreply@anthropic.com>`.

## Don't

- `git add -A` blindly — `git status` first to avoid leaking secrets.
- Force-push to a branch other people are using.
- Skip pre-commit hooks (`--no-verify`) unless the user explicitly asks.
- Amend already-pushed commits.
