#!/usr/bin/env bash
# session-start-context.sh — re-injects project context on session start.
#
# Fires on SessionStart events (matcher `startup|resume|clear|compact`).
# Output is captured by Claude Code and prepended as additionalContext to
# the session, so anything echoed here is visible to the model.
#
# Goals:
#   - After `:compact`, the model loses the prior turns. Re-inject the gist.
#   - On `resume`, surface what changed in the working tree since last time.
#   - Keep it small (< ~80 lines of output) to avoid eating context budget.

set -euo pipefail

echo "=== Project context (auto-injected on SessionStart) ==="
echo

# 1. Project header — first ~20 lines of CLAUDE.md (the WHO/WHAT/WHY summary)
if [ -f CLAUDE.md ]; then
  echo "--- CLAUDE.md (excerpt) ---"
  head -20 CLAUDE.md
  echo
fi

# 2. Git working state
if command -v git >/dev/null 2>&1 && git rev-parse --git-dir >/dev/null 2>&1; then
  echo "--- Git ---"
  echo "Branch: $(git branch --show-current 2>/dev/null || echo 'detached')"
  modified=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  echo "Modified files: $modified"
  if [ "$modified" -gt 0 ] && [ "$modified" -le 12 ]; then
    git status --porcelain | head -12
  fi
  echo "Last 3 commits:"
  git log --oneline -3 2>/dev/null || true
  echo
fi

# 3. Active worktrees (if any)
if command -v git >/dev/null 2>&1; then
  worktrees=$(git worktree list 2>/dev/null | wc -l | tr -d ' ')
  if [ "$worktrees" -gt 1 ]; then
    echo "--- Worktrees ($worktrees) ---"
    git worktree list 2>/dev/null
    echo
  fi
fi

echo "=== End project context ==="
