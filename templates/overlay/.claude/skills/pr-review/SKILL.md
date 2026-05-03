---
name: pr-review
description: Reviews an open PR by number — fetches the diff, files, and checks via gh CLI, then runs the reviewer + pr-reviewer agents in tandem and produces a merge verdict.
---

# /pr-review

End-to-end review of one specific PR.

## What it does

1. Takes a PR number (or URL) as input.
2. Fetches metadata: `gh pr view <num> --json title,body,files,baseRefName,headRefName,statusCheckRollup`.
3. Fetches the diff: `gh pr diff <num>`.
4. Runs the `reviewer` agent on changed files for general quality concerns.
5. Runs the `pr-reviewer` agent on the diff for breaking-change / migration / scope concerns.
6. Aggregates findings, dedupes, and produces a single merge verdict: **GO** / **GO with comments** / **NO-GO**.
7. Optionally posts the verdict as a PR review comment via `gh pr review`.

## When to use

- A teammate's PR is sitting in your queue and you want a structured review.
- Before merging your own PR, as a self-check.
- When a PR has been review-bombed and you need an independent verdict.

## When NOT to use

- Drafts that aren't ready — you'll waste cycles on WIP code.
- Massive PRs (> 500 lines diff) — split first, then review each. Otherwise the verdict drowns in noise.
- Generated-code-only PRs (Prisma migrations alone, lockfile bumps) — use `db-migration-reviewer` or `dependency-updater` directly.

## Gotchas

- **Two agents in tandem doubles the token cost** — both are Opus by default. For small diffs (< 100 lines) prefer `reviewer` alone.
- **`gh pr diff` truncates large diffs** — for PRs > ~3000 lines the diff comes back partial. The skill warns but the verdict will be incomplete.
- **`--post` writes a top-level review** — once posted, edits are append-only. Use `--dry-run` first if you're unsure.
- **CI status influences verdict** — failing CI auto-flips to NO-GO regardless of code quality. Re-run after a flaky failure if needed.
- **Cross-repo PRs (forks)** — `gh` may need additional auth scopes. Authenticate with `gh auth refresh -s repo,read:org`.

## Inputs needed

- PR number or URL.
- Optional: target branch (auto-detected via `gh pr view`).
- Optional: `--post` flag to publish the review to GitHub.
- Optional: list of focus areas (`security`, `perf`, `tests` — narrows the review).

## Output

A markdown report with: summary, blockers, majors, minors, verdict, and a one-line rationale.
