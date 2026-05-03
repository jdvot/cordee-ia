# REVIEW — Cordée.IA repo audit

> Auditor: `repo-reviewer` teammate
> Date: 2026-05-03
> HEAD: `9da2abf refactor: cordee-ia as unified all-in-one starter (greenfield + overlay)`
> Verdict: **GO** with caveats — 2 critical bugs to fix before publishing as a public template.

---

## ⚠️ Note on in-flight refactor

At audit time the working tree was **dirty with uncommitted deletions** of every starter file (`.claude/**`, `.mcp.json`, `CLAUDE.md`, `DESIGN.md`, `install.sh`) plus an untracked Next.js skeleton (`app/`, `components/`, `lib/`, `package.json`, `tsconfig.json`, `templates/`). HEAD still contains all the audited files (commit `9da2abf`). All findings below are anchored to HEAD. The in-flight reshape (likely another teammate moving `install.sh` → `templates/install.sh` and adding a Next.js demo) is outside the scope of this review and should be coordinated with team-lead before commit.

---

## ✅ What works (verified)

| Promise | Verified by | Result |
|---|---|---|
| `install.sh` dual-mode detection | `bash install.sh /tmp/test-greenfield` (empty) → `Mode detected: greenfield`. `bash install.sh /tmp/test-overlay` (≥3 files) → `Mode detected: overlay` | ✅ |
| Stack detection — Next.js + Tailwind + React | overlay test with `package.json` containing `"next"`, `"react"`, `"tailwindcss"` → `Detected stack: nextjs tailwind react` | ✅ |
| Stack detection — NestJS | `{ "@nestjs/core": "^10.0.0" }` → `Detected stack: nestjs` | ✅ |
| Stack detection — FastAPI | `pyproject.toml` with `fastapi` → `Detected stack: fastapi` | ✅ |
| Stack detection — Go | `go.mod` present → `Detected stack: go` | ✅ |
| Stack detection — Rust | `Cargo.toml` present → `Detected stack: rust` | ✅ |
| Backup existing `.claude/` | overlay test: pre-existing `.claude/settings.json` was moved to `.claude.backup.1777804425/` before write | ✅ |
| `chmod +x` on hooks | both hooks under `.claude/hooks/` are `-rwxr-xr-x` after install | ✅ |
| CLAUDE.md placeholder substitution | greenfield test produced `# test-greenfield — fill in at kickoff` (line 1) — `[PROJECT NAME]` and `[STACK]` substituted via `sed` | ✅ |
| Skips `.gitignore` if present | overlay test: pre-existing 14-byte `.gitignore` preserved (not overwritten) | ✅ |
| `pre-edit-secrets.sh` blocks `.env` | `echo '{"tool_input":{"file_path":".env"}}'` → exit 1 with `🚫 BLOCKED` | ✅ |
| Blocks `.env.production`, `.key`, `.pem`, `credentials.json`, `.ssh/id_rsa` | All return exit 1 with stderr message | ✅ |
| Allows source files | `src/index.ts` → exit 0 silently | ✅ |
| `post-edit-format.sh` exit 0 with missing path | `{"tool_input":{"file_path":"/nonexistent.py"}}` → exit 0 | ✅ |
| 4 agents present, valid YAML frontmatter | `researcher.md`, `challenger.md`, `reviewer.md`, `page-writer.md` — all have `name/description/model/effort/tools` | ✅ |
| 3 skills present | `.claude/skills/{audit,kickoff,design-handoff}/SKILL.md` | ✅ |
| 3 rules present | `coding-standards.md`, `git-workflow.md`, `security.md` — all have `description` + `alwaysApply: true` | ✅ |
| `DESIGN.md` 9 sections | confirmed sections 1–9 present (`Visual Theme`, `Color Palette`, `Typography`, `Component Stylings`, `Layout`, `Depth`, `Do/Don't`, `Responsive`, `Agent Prompt Guide`) | ✅ |
| `settings.json` valid JSON, hooks wired | parses cleanly, `PreToolUse`/`PostToolUse` matchers point to existing scripts | ✅ |
| `.mcp.json` Notion + Context7 declared | both servers present at top level of `mcpServers` | ⚠️ partial (see P0-3) |
| `.gitignore` covers secrets/builds/OS/IDE | `.env*`, `*.key`, `node_modules/`, `dist/`, `.DS_Store`, `.idea/` all listed | ✅ |

---

## ❌ Critical bugs (P0 — fix before public release)

### P0-1 · `pre-edit-secrets.sh` blocks `.env.example` (false positive)

**Repro**:
```bash
$ echo '{"tool_input":{"file_path":".env.example"}}' | bash .claude/hooks/pre-edit-secrets.sh
🚫 BLOCKED: Refusing to edit secret file: .env.example
exit: 1
```

**Cause**: pattern `'\.env\.[^.]+$'` (`.claude/hooks/pre-edit-secrets.sh:22`) matches `.env.example`.

**Conflict**: `.gitignore:4` explicitly whitelists `!.env.example` — the hook contradicts the gitignore.

**Impact**: every project using this template will be blocked from committing the canonical `.env.example` template file via Claude Code.

**Fix**:
```diff
 SECRET_PATTERNS=(
   '\.env$'
-  '\.env\.[^.]+$'
+  '\.env\.[^.]+$'   # then add explicit allowlist below
   '\.key$'
   ...
 )

+# Allowlist — env example/sample files are safe to edit/commit
+ALLOWLIST=( '\.env\.example$' '\.env\.sample$' '\.env\.template$' )
+for allow in "${ALLOWLIST[@]}"; do
+  if echo "$path" | grep -qE "$allow"; then exit 0; fi
+done
+
 for pattern in "${SECRET_PATTERNS[@]}"; do
   ...
```

---

### P0-2 · `pre-edit-secrets.sh` fails CLOSED without `jq` (README claims fail-soft)

**Repro**:
```bash
$ echo '{"tool_input":{"file_path":".env"}}' | env PATH="/usr/bin:/bin" bash .claude/hooks/pre-edit-secrets.sh
.claude/hooks/pre-edit-secrets.sh: line 13: jq: command not found
exit: 127
```

**README contract** (line 124): *"`pre-edit-secrets.sh` requiert `jq`. Sans `jq`, le hook fail-soft (autorise au lieu de bloquer)."*

**Reality**: `set -euo pipefail` (line 10) + missing `jq` at line 13 → exit 127. The harness will treat any non-zero exit from a `PreToolUse` hook as a deny. So **every Edit/Write call fails** until `jq` is installed.

**Fix**:
```diff
 set -euo pipefail

 input=$(cat)
+
+# Fail-soft if jq missing — README contract
+if ! command -v jq >/dev/null 2>&1; then
+  echo "⚠️ pre-edit-secrets: jq not installed, skipping secret check" >&2
+  exit 0
+fi
+
 path=$(echo "$input" | jq -r '.tool_input.file_path // .tool_input.path // ""')
```

Or — better — drop the `jq` dependency entirely and parse with `python3` (which ships on every macOS/Linux). Currently `jq` must be installed system-wide — adds friction for new contributors.

---

## ⚠️ Doc/code drift (P1 — will confuse users)

### P1-1 · `teammateMode` README claim mismatches `settings.json`

| File | Value |
|---|---|
| `README.md:16` | *"`settings.json` avec Agent Teams activés (`teammateMode: \"auto\"` — fonctionne avec ou sans tmux)"* |
| `.claude/settings.json:9` | `"teammateMode": "tmux"` |

`tmux` mode silently breaks for users on VS Code terminal / Windows Terminal / Ghostty (mentioned in README gotcha at line 123 — but the gotcha implies the mode is `auto`, not `tmux`).

**Fix**: either change settings.json to `"auto"` (probably the intent given the README copy), or update the README to match `tmux`.

---

### P1-2 · README claims **5 agents** including `[YOUR-AGENT].md` template — only 4 ship

| File | Claim |
|---|---|
| `README.md:17` | *"**5 agents génériques** prêts à l'emploi : `researcher`, `challenger`, `reviewer`, `page-writer`, plus un template `[YOUR-AGENT].md`"* |
| `.claude/agents/` | Only 4 files (`researcher.md`, `challenger.md`, `reviewer.md`, `page-writer.md`) |

**Fix**: either ship a `_template.md.example` with placeholder content, or update README to *"4 agents génériques"*.

---

### P1-3 · README claims `post-edit-format` covers **bash** — it doesn't

| File | Claim |
|---|---|
| `README.md:19` | *"post-edit auto-format (bash + Python + Go + Rust)"* |
| `.claude/hooks/post-edit-format.sh:16` | case statement only handles `*.ts/tsx/js/json/md/css` (prettier), `*.py` (ruff/black), `*.go` (gofmt), `*.rs` (rustfmt). No `*.sh` branch. |

**Fix**: add a `*.sh` branch with `shfmt` (soft-fail), or remove "bash" from the README claim. Suggest the latter — `shfmt` is rarely installed.

---

### P1-4 · `.mcp.json` `_optional_examples` key inside `mcpServers` — risks parser warning

`.mcp.json:16-39` puts `_optional_examples` as a sibling of `notion` and `context7` inside `mcpServers`. Claude Code's MCP loader will see a server named `_optional_examples` with no `type`/`command`/`url` at the top level and may emit a warning or silently ignore it.

**Fix**: move the optional examples out of `mcpServers` into a top-level `_examples` key, or — cleaner — ship a separate `.mcp.example.json` file documented in README:
```json
{
  "_comment": "Copy entries from .mcp.example.json into mcpServers as needed",
  "mcpServers": {
    "notion": { ... },
    "context7": { ... }
  }
}
```

---

## 🟡 Fragile spots (P2 — nice-to-have)

### P2-1 · Greenfield detection threshold (`NUM_FILES < 3`) is brittle

`install.sh:34-37`:
```bash
NUM_FILES=$(find . -maxdepth 2 -type f ! -path "./.git/*" ! -name ".gitignore" 2>/dev/null | wc -l)
if [ "$NUM_FILES" -lt 3 ]; then MODE="greenfield"; fi
```

A repo with just `LICENSE` + `README.md` (very common minimal setup) = 2 files = misdetected as greenfield → existing `.claude/` would be silently overwritten without backup… wait, actually backup runs in overlay only. So a misdetected-as-greenfield repo with a hand-crafted `.claude/` would **lose its config without backup**. Worth tightening:

**Suggested fix**: also bail to overlay if any of `package.json`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `Gemfile`, `Cargo.lock`, `pnpm-lock.yaml`, `requirements.txt`, `composer.json`, `Makefile`, `src/`, `lib/`, `app/` exist.

---

### P2-2 · `find -maxdepth 2` is OS-dependent

The `-maxdepth` flag is GNU-find-only; macOS BSD-find supports it but BSD-on-Solaris/Alpine images may not. Switch to `find . -path './.git' -prune -o -type f -print | head -10` for portability.

---

### P2-3 · `install.sh` does not copy `LICENSE`

A user installing via `curl | bash` into a new repo gets no `LICENSE` template. Either copy it (with `[ ! -f "LICENSE" ]` guard) or document that LICENSE is intentional manual choice.

---

### P2-4 · `install.sh` greenfield-from-template path undocumented

README mode 1 (`gh repo create --template`) ships `CLAUDE.md` with `[PROJECT NAME]` placeholders unsubstituted, then tells the user to `claude > /kickoff`. The `/kickoff` skill description (`.claude/skills/kickoff/SKILL.md`) doesn't explicitly say "replace the placeholders in CLAUDE.md" — that's an implicit contract. Worth adding a one-liner to the skill.

---

### P2-5 · Subagent permissions

The 4 agent definitions don't include any `disallowedTools` and don't restrict `Bash` patterns (only `reviewer` has `Bash`, others don't — good). But `reviewer` has full `Bash` access — could read prod secrets if invoked carelessly. Consider scoping: `Bash(git *)`, `Bash(grep *)`, `Bash(ls *)`.

---

### P2-6 · No CI / shellcheck / integration test for `install.sh`

A bash script that's the entrypoint to public users deserves at minimum:
- `shellcheck install.sh` in CI
- One smoke test (greenfield + overlay) that runs in GitHub Actions

---

## 📋 Priority backlog

**P0 (block public release)**:
1. Fix `.env.example` false-block in `pre-edit-secrets.sh`
2. Fix fail-soft jq behavior (or drop jq dependency)

**P1 (fix before next user lands)**:
3. Reconcile README ↔ `settings.json` on `teammateMode`
4. Reconcile README ↔ agents on agent count (4 vs 5)
5. Remove "bash" from post-edit-format README claim
6. Restructure `.mcp.json` to avoid `_optional_examples` parser confusion

**P2 (nice-to-have)**:
7. Tighten greenfield detection (presence of `package.json`/`go.mod`/etc.)
8. Add CI shellcheck + smoke test for `install.sh`
9. Scope `reviewer` agent's Bash allowlist
10. Optional `LICENSE` copy in install.sh
11. Cross-OS portability for `find -maxdepth`

---

## Verdict

**GO with conditions** — the architecture is solid, dual-mode install works, all promised pieces ship and are functional. But the 2 P0 hooks bugs would burn the first 100 users (every overlay install where jq isn't preinstalled = broken Edit; every project committing `.env.example` = blocked write). Fix those + the README divergences (P1-1/P1-2/P1-3) and this is shippable as a public template.

**Critical bugs**: 2 (P0-1, P0-2)
**High-impact doc drift**: 4 (P1-1 → P1-4)
**Nice-to-haves**: 6 (P2-1 → P2-6)
