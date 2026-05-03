#!/usr/bin/env bash
# Pre-edit hook — blocks writes to secret files.
#
# Reads tool input from stdin (JSON), checks if the target path matches
# a secret pattern, exits 1 (= deny) if so.
#
# Why: prevent accidental commits of .env, *.key, credentials.json — even
# if Claude Code "thinks" it's a good idea. Secrets stay out of git history.

set -euo pipefail

input=$(cat)
path=$(echo "$input" | jq -r '.tool_input.file_path // .tool_input.path // ""')

if [[ -z "$path" ]]; then
  exit 0
fi

# Pattern list — extend as needed
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
    echo "🚫 BLOCKED: Refusing to edit secret file: $path" >&2
    echo "   If you really need to write a secret, do it manually outside Claude Code." >&2
    exit 1
  fi
done

exit 0
