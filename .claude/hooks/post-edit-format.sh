#!/usr/bin/env bash
# Post-edit hook — auto-format edited files using available tools.
#
# Soft-fail design: if the formatter isn't installed, skip silently.
# Reads tool input from stdin (JSON), extracts file path, formats by extension.

set -uo pipefail

input=$(cat)
path=$(echo "$input" | jq -r '.tool_input.file_path // .tool_input.path // ""')

if [[ -z "$path" || ! -f "$path" ]]; then
  exit 0
fi

case "$path" in
  *.ts|*.tsx|*.js|*.jsx|*.mjs|*.cjs|*.json|*.md|*.css|*.scss|*.html)
    if command -v prettier &>/dev/null; then
      prettier --write "$path" 2>/dev/null || true
    fi
    ;;
  *.py)
    if command -v ruff &>/dev/null; then
      ruff format "$path" 2>/dev/null || true
      ruff check --fix "$path" 2>/dev/null || true
    elif command -v black &>/dev/null; then
      black "$path" 2>/dev/null || true
    fi
    ;;
  *.go)
    if command -v gofmt &>/dev/null; then
      gofmt -w "$path" 2>/dev/null || true
    fi
    ;;
  *.rs)
    if command -v rustfmt &>/dev/null; then
      rustfmt "$path" 2>/dev/null || true
    fi
    ;;
esac

exit 0
