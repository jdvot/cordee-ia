#!/usr/bin/env bash
# Cordée.IA install.sh — dual mode: greenfield OR overlay.
#
# Usage:
#
#   # Greenfield (new project) — clone the template via gh:
#   gh repo create my-project --template jdvot/cordee-ia --public --clone
#   cd my-project && rm -rf .git && git init -b main
#
#   # Overlay (existing project) — drop into your repo:
#   cd /path/to/your/existing/project
#   curl -sL https://raw.githubusercontent.com/jdvot/cordee-ia/main/install.sh | bash
#
# What it does:
#   - Detects mode (greenfield vs overlay) by checking if the cwd has files beyond .git
#   - Detects stack (Next.js / NestJS / FastAPI / Go / Rust / Python / unknown)
#   - In overlay mode: backs up existing .claude/ before writing
#   - Generates a stack-aware CLAUDE.md
#   - Prints next steps

set -euo pipefail

TARGET="${1:-$PWD}"

if [ ! -d "$TARGET" ]; then
  echo "❌ Target directory not found: $TARGET" >&2
  exit 1
fi

cd "$TARGET"

# --- Mode detection ---------------------------------------------------------
MODE="overlay"
NUM_FILES=$(find . -maxdepth 2 -type f ! -path "./.git/*" ! -name ".gitignore" 2>/dev/null | wc -l | tr -d ' ')
if [ "$NUM_FILES" -lt 3 ]; then
  MODE="greenfield"
fi

echo "→ Mode detected: $MODE"

# --- Stack detection --------------------------------------------------------
STACK=""
if [ -f "package.json" ]; then
  if grep -q '"next"' package.json 2>/dev/null; then STACK="$STACK nextjs"; fi
  if grep -q '"@nestjs/core"' package.json 2>/dev/null; then STACK="$STACK nestjs"; fi
  if grep -q '"hono"' package.json 2>/dev/null; then STACK="$STACK hono"; fi
  if grep -q '"tailwindcss"' package.json 2>/dev/null; then STACK="$STACK tailwind"; fi
  if grep -q '"react"' package.json 2>/dev/null; then STACK="$STACK react"; fi
  if grep -q '"vue"' package.json 2>/dev/null; then STACK="$STACK vue"; fi
fi
if [ -f "pyproject.toml" ]; then
  if grep -q 'fastapi' pyproject.toml 2>/dev/null; then STACK="$STACK fastapi"; fi
  if grep -q 'django' pyproject.toml 2>/dev/null; then STACK="$STACK django"; fi
  if grep -q 'flask' pyproject.toml 2>/dev/null; then STACK="$STACK flask"; fi
fi
if [ -f "go.mod" ]; then STACK="$STACK go"; fi
if [ -f "Cargo.toml" ]; then STACK="$STACK rust"; fi

STACK="${STACK# }"
[ -z "$STACK" ] && STACK="unknown"
echo "→ Detected stack: $STACK"

# --- Locate sources --------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd || echo "")"
USE_REMOTE=false
if [ -z "$SCRIPT_DIR" ] || [ ! -d "$SCRIPT_DIR/.claude" ]; then
  USE_REMOTE=true
fi

REPO_RAW="https://raw.githubusercontent.com/jdvot/cordee-ia/main"

# --- Backup existing .claude/ in overlay mode ------------------------------
if [ "$MODE" = "overlay" ] && [ -e ".claude" ]; then
  BACKUP=".claude.backup.$(date +%s)"
  echo "→ Existing .claude/ found. Backing up to $BACKUP"
  mv .claude "$BACKUP"
fi

# --- Copy / fetch templates ------------------------------------------------
mkdir -p .claude/{agents,skills/audit,skills/kickoff,skills/design-handoff,hooks,rules}

if [ "$USE_REMOTE" = false ]; then
  cp -R "$SCRIPT_DIR/.claude/." .claude/
  [ ! -f ".mcp.json" ] && cp "$SCRIPT_DIR/.mcp.json" .mcp.json
  [ ! -f ".gitignore" ] && cp "$SCRIPT_DIR/.gitignore" .gitignore
  [ ! -f "DESIGN.md" ] && cp "$SCRIPT_DIR/DESIGN.md" DESIGN.md
  [ ! -f "CLAUDE.md" ] && cp "$SCRIPT_DIR/CLAUDE.md" CLAUDE.md.new
else
  echo "→ Fetching templates from GitHub…"
  for f in settings.json; do
    curl -fsSL "$REPO_RAW/.claude/$f" -o ".claude/$f"
  done
  for agent in researcher.md challenger.md reviewer.md page-writer.md; do
    curl -fsSL "$REPO_RAW/.claude/agents/$agent" -o ".claude/agents/$agent"
  done
  for skill in audit kickoff design-handoff; do
    curl -fsSL "$REPO_RAW/.claude/skills/$skill/SKILL.md" -o ".claude/skills/$skill/SKILL.md"
  done
  for hook in pre-edit-secrets.sh post-edit-format.sh; do
    curl -fsSL "$REPO_RAW/.claude/hooks/$hook" -o ".claude/hooks/$hook"
  done
  for rule in coding-standards.md git-workflow.md security.md; do
    curl -fsSL "$REPO_RAW/.claude/rules/$rule" -o ".claude/rules/$rule"
  done
  [ ! -f ".mcp.json" ] && curl -fsSL "$REPO_RAW/.mcp.json" -o .mcp.json
  [ ! -f ".gitignore" ] && curl -fsSL "$REPO_RAW/.gitignore" -o .gitignore
  [ ! -f "DESIGN.md" ] && curl -fsSL "$REPO_RAW/DESIGN.md" -o DESIGN.md
  [ ! -f "CLAUDE.md" ] && curl -fsSL "$REPO_RAW/CLAUDE.md" -o CLAUDE.md.new
fi

chmod +x .claude/hooks/*.sh

# --- Generate CLAUDE.md if absent ------------------------------------------
if [ ! -f "CLAUDE.md" ] && [ -f "CLAUDE.md.new" ]; then
  PROJECT_NAME="$(basename "$PWD")"
  sed -e "s|\[PROJECT NAME\]|$PROJECT_NAME|g" \
      -e "s|\[STACK\]|$STACK|g" \
      CLAUDE.md.new > CLAUDE.md
  rm CLAUDE.md.new
  echo "→ Generated CLAUDE.md (project=$PROJECT_NAME, stack=$STACK)"
elif [ -f "CLAUDE.md.new" ]; then
  echo "→ CLAUDE.md already exists. Template saved as CLAUDE.md.new for manual merge."
fi

# --- Done -------------------------------------------------------------------
echo ""
echo "✓ Cordée.IA installed (mode: $MODE, stack: $STACK)."
echo ""
echo "Next steps:"
if [ "$MODE" = "greenfield" ]; then
  echo "  1. Open Claude Code: claude"
  echo "  2. Run /kickoff — Claude will customize CLAUDE.md and propose a stack"
  echo "  3. (Optional) Customize DESIGN.md and upload to Claude Design"
  echo "  4. (Optional) Run /design-handoff after Claude Design hands off the bundle"
else
  echo "  1. Review CLAUDE.md — fill in WHAT/WHY/Stack details"
  echo "  2. Open Claude Code: claude"
  echo "  3. Run /audit — Claude will map your codebase, list tech debt, suggest 3 safe PRs"
  echo "  4. (Optional) Add a DESIGN.md for visual projects"
fi
echo ""
echo "Doc: https://github.com/jdvot/cordee-ia"
