---
name: standup
description: Generates a daily standup synthesis — git activity over 24h, open PRs, in-progress tickets. Drop into Slack or paste in the daily.
---

# /standup

Compiles what you did yesterday and what is still open, without asking you to remember.

## What it does

1. Runs `git log --since="24 hours ago" --author="$(git config user.email)"` across the current repo (and any sibling repos if a list is configured).
2. Lists open pull requests authored by the current user (`gh pr list --author @me`).
3. Reads in-progress tickets from the configured tracker (Notion, Linear, GitHub Issues) — picks them up from `.mcp.json`.
4. Groups output into three blocks: **Yesterday** / **Today** / **Blockers**.

## When to use

- Daily, before the team standup.
- After a long weekend, to rebuild context before opening the IDE.
- After PTO, with `--since "last monday"` to reconstruct the gap.

## When NOT to use

- You already wrote a manual standup — no need to duplicate.
- The team uses async written standups in a doc — adapt this skill to write there directly instead of generating throwaway markdown.
- Solo project with no daily — overkill.

## Gotchas

- **`git config user.email` must match commit author** — co-authored commits or signed-off-by attribution can hide your activity. Pass `--author` explicitly if multiple emails.
- **Squash-merged PRs lose individual commits** — the skill dedups against PR titles to avoid double-counting, but a squash you authored months ago re-merged today will show up.
- **Tracker MCP must be configured** — without `notion` / `linear` MCP, the "Today" block falls back to "open PRs" only and skips tickets.
- **Multi-repo mode reads sequentially** — for 5+ repos this can hit GitHub rate limits. Pass a `--repos` allowlist.
- **Timezone of the host machine** — "yesterday" uses local time; if you traveled, the window may slip. Pass `--since` explicitly when in doubt.

## Inputs needed

- Optional: list of repos to include (default: current repo only).
- Optional: timeframe (default 24h, e.g. `--since "last friday"` for Mondays).

## Output

Markdown ready to paste in Slack, with one bullet per item. Commit messages are deduplicated and squashed-PR-aware.
