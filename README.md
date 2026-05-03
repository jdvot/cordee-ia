# Cordée.IA — Le starter unifié Claude Code + Claude Design

> Un seul repo. Deux modes : **nouveau projet** ou **projet existant**. Tout prêt à l'emploi.

Cordée.IA est un starter "tout-inclus" pour démarrer ou ajouter Claude Code et Claude Design dans n'importe quel projet, sans tech imposée et sans dépendances cachées.

## Pourquoi un seul starter au lieu de deux

Avant : `claude-starter` (greenfield) + `claude-overlay` (existing) en deux repos. Maintenue dans deux endroits = drift assuré.

Maintenant : **Cordée.IA** unifié, avec un script `install.sh` qui détecte automatiquement le mode (vide vs existant) et adapte sa sortie.

## Ce que tu obtiens

### Configuration `.claude/`
- **`settings.json`** avec Agent Teams activés (`teammateMode: "auto"` — fonctionne avec ou sans tmux)
- **5 agents génériques** prêts à l'emploi : `researcher`, `challenger`, `reviewer`, `page-writer`, plus un template `[YOUR-AGENT].md`
- **3 skills** : `/kickoff` (init nouveau projet), `/design-handoff` (Claude Design → code), `/audit` (cartographier projet existant)
- **2 hooks** : pre-edit secrets blocker, post-edit auto-format (bash + Python + Go + Rust)
- **3 rules génériques** : `coding-standards.md`, `git-workflow.md`, `security.md`

### Templates Claude Design
- **`DESIGN.md`** — template 9 sections rempli avec un exemple complet (à customiser ou remplacer)
- Compatible direct upload Claude Design + handoff to Claude Code

### Templates projet
- **`CLAUDE.md`** — template WHAT/WHY/HOW à customiser
- **`.mcp.json`** — Notion + Context7 actifs ; Playwright/Figma/Sentry/Linear en commentaires
- **`.gitignore`** — couvre secrets, builds, OS, IDEs

### Infrastructure
- Script **`install.sh`** dual-mode (greenfield ou overlay)
- Détection auto du stack (Next.js / NestJS / FastAPI / Go / Rust / Python)
- Backup automatique de l'existant avant modification

## Installation

### Mode 1 — Nouveau projet (greenfield)

```bash
# Option A : GitHub template (recommandé)
gh repo create my-project --template jdvot/cordee-ia --public --clone
cd my-project

# Option B : clone manuel
gh repo clone jdvot/cordee-ia my-project
cd my-project
rm -rf .git && git init -b main
```

Puis :
```bash
claude
> /kickoff
# Claude lit ton brief, customize CLAUDE.md, propose un stack, génère DESIGN.md initial
```

### Mode 2 — Projet existant (overlay)

```bash
# Depuis ton projet existant
cd /path/to/your/existing/project
curl -sL https://raw.githubusercontent.com/jdvot/cordee-ia/main/install.sh | bash
```

Le script :
1. Détecte ton stack
2. Backup ton `.claude/` existant si présent
3. Drop les configurations
4. Génère un `CLAUDE.md` adapté au stack
5. Te donne les next steps

Puis :
```bash
claude
> /audit
# Claude cartographie ton codebase, liste tech debt, suggère 3 PRs sûres
```

### Mode 3 — Avec Claude Design (workflow design-to-code)

```bash
# 1. Bootstrap le repo (mode 1)
gh repo create my-saas --template jdvot/cordee-ia --public --clone
cd my-saas

# 2. Customize DESIGN.md avec ta marque (ou laisse le template d'exemple)
$EDITOR DESIGN.md

# 3. Upload sur Claude Design
# https://claude.ai/design — drop ton repo, itère 4-6 prompts

# 4. Handoff to Claude Code
# Bouton "Handoff" dans Claude Design → bundle arrive

# 5. Scaffold avec le skill
claude
> /design-handoff [path/to/handoff-bundle]
# Génère Next.js + Tailwind v4 + Shadcn + Framer matchant le design
```

## Quand utiliser Cordée.IA vs autres starters

| Starter | Focus | Greenfield | Existing | Claude Design |
|---|---|---|---|---|
| [`serpro69/claude-toolbox`](https://github.com/serpro69/claude-starter-kit) | Multi-lang prod-ready | ✅ | ❌ | ❌ |
| [`halans/cc-marketplace-boilerplate`](https://github.com/halans/cc-marketplace-boilerplate) | Plugin marketplace | ✅ | ❌ | ❌ |
| [`scotthavird/claude-code-template`](https://github.com/scotthavird/claude-code-template) | Comprehensive | ✅ | ❌ | ❌ |
| **`jdvot/cordee-ia`** (ce repo) | **Unifié + design** | **✅** | **✅** | **✅** |

## Customize après clone

1. **`CLAUDE.md`** — remplace les TODOs par ton WHAT/WHY/Stack/Commands
2. **`DESIGN.md`** — soit tu remplis à la main, soit tu uploades sur Claude Design pour itérer
3. **`.mcp.json`** — décommente les MCPs dont tu as besoin (Playwright, Figma, Sentry, Linear)
4. **`.claude/agents/`** — ajoute des agents domaine (ex: `db-migration-reviewer`, `api-contract-checker`)
5. **`.claude/skills/`** — ajoute des skills custom (ex: `/release`, `/standup`)
6. **`.claude/rules/`** — ajoute des rules métier (ex: `healthcare-compliance.md`, `gdpr.md`)

## Gotchas

- **Agent Teams** requiert Claude Pro/Max avec Opus 4.6. `teammateMode` est sur `"auto"` par défaut donc ça marche sans tmux mais sans split-pane visuel.
- **Tmux split-pane** ne marche pas dans VS Code terminal, Windows Terminal, Ghostty. Utilise iTerm2 sur macOS pour la meilleure expérience visuelle.
- **`pre-edit-secrets.sh`** requiert `jq`. Sans `jq`, le hook fail-soft (autorise au lieu de bloquer).
- **MCPs OAuth** (Notion) : 1er prompt te demande de t'authentifier dans le navigateur.

## Compatibilité testée

- Next.js 15-16, React, Vue, SvelteKit
- NestJS, Express, Hono, Fastify
- FastAPI, Django, Flask
- Go modules, Rust monorepos

## Sources / inspirations

Best practices appliquées et vérifiées en mai 2026 :
- [Claude Code Best Practices — Anthropic](https://code.claude.com/docs/en/best-practices)
- [How Anthropic teams use Claude Code (PDF)](https://www-cdn.anthropic.com/58284b19e702b49db9302d5b6f135ad8871e7658.pdf)
- [Writing a good CLAUDE.md — HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [Hooks reference — Anthropic](https://code.claude.com/docs/en/hooks)
- [Skills reference — Anthropic](https://code.claude.com/docs/en/skills)
- [Agent Teams — Anthropic](https://code.claude.com/docs/en/agent-teams)
- [Set up Claude Design system — Anthropic](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design)
- [Awesome Claude Design — VoltAgent](https://github.com/VoltAgent/awesome-claude-design) (68 DESIGN.md éprouvés)

## License

MIT — voir [LICENSE](LICENSE).

## Contribuer

PRs bienvenues. Issues encore plus.
