#!/usr/bin/env bash
# Pre-edit hook — blocks writes to secret files.
#
# Reads tool input from stdin (JSON), checks if the target path matches
# a secret pattern, exits 1 (= deny) if so.
#
# Design principles:
#   - Fail soft: if jq is missing, allow the edit (don't break Claude Code workflows).
#     Document this in README so users know to install jq for hard blocking.
#   - Whitelist common safe files like .env.example before applying secret patterns.

set -uo pipefail

# Fail soft if jq is missing — don't break every Edit/Write call.
if ! command -v jq >/dev/null 2>&1; then
  exit 0
fi

input=$(cat)
path=$(echo "$input" | jq -r '.tool_input.file_path // .tool_input.path // ""' 2>/dev/null)

if [[ -z "$path" ]]; then
  exit 0
fi

# Whitelist — files that look like secrets but are actually safe to edit.
WHITELIST_PATTERNS=(
  '\.env\.example$'
  '\.env\.sample$'
  '\.env\.template$'
  '\.env\.dist$'
  '\.env\.local\.example$'
)
for pattern in "${WHITELIST_PATTERNS[@]}"; do
  if echo "$path" | grep -qE "$pattern"; then
    exit 0
  fi
done

# Secret patterns — extend as needed
SECRET_PATTERNS=(
  '\.env$'
  '\.env\.[^.]+$'
  '\.key$'
  '\.pem$'
  'credentials\.json$'
  'secrets\.json$'
  'service-account.*\.json$'
  '\.aws/credentials'
  '\.ssh/id_'
)

for pattern in "${SECRET_PATTERNS[@]}"; do
  if echo "$path" | grep -qE "$pattern"; then
    cat >&2 <<EOF
BLOCKED: Refusing to edit secret file: $path

If you really need to write this file, do it manually outside Claude Code.
This hook is in .claude/hooks/pre-edit-secrets.sh — adjust the WHITELIST_PATTERNS
or SECRET_PATTERNS arrays if your project needs a different policy.
EOF
    exit 1
  fi
done

exit 0
