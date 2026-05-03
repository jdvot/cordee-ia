---
description: Branching, PRs, commits — generic git workflow
alwaysApply: true
---

# Git Workflow

## Branching

- Feature branches off `main` (or `staging` if multi-env): `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`.
- Worktrees in parent directory: `git worktree add ../wt-<name> -b <branch> main`.
- Never push directly to `main` — always PR.

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
