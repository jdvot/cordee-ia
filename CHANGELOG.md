# Changelog

Toutes les modifications notables sont documentées ici.

Format basé sur [Keep a Changelog](https://keepachangelog.com/), versioning [SemVer](https://semver.org/).

## [Unreleased]

## [0.2.0] - 2026-05-04

### Ajouté

**Questionnaire**
- 9 questions au total (était 6) : ajout designSystem, extras (fichiers complémentaires), license, colors, teamSetup
- Step 2 inclut désormais une question dédiée **Team setup** (ajoute CONTRIBUTING.md, CODEOWNERS, PR/issue templates)
- Step 7 inclut un **ColorPicker** (palette primary + accent + custom hex + preview live)
- Step 8 propose 7 fichiers extras (.editorconfig, .prettierrc.json, Makefile, Dockerfile, docker-compose.yml, .vscode/settings.json, .github/workflows/ci.yml)
- Step 9 propose 4 licenses (MIT, Apache-2.0, AGPL-3.0, none)
- Live preview du file tree pendant la sélection (FileTreePreview, FileCounter)

**Agents (10 au total, était 4)**
- `pr-reviewer` (Opus xhigh) — review une PR end-to-end
- `db-migration-reviewer` (Opus xhigh) — review migrations Prisma/Alembic/Drizzle
- `a11y-auditor` (Sonnet) — audit WCAG 2.2 AA via Playwright MCP
- `doc-writer` (Sonnet) — écrit ou met à jour la doc
- `dependency-updater` (Sonnet, **stack-aware**) — variantes Node/Python/Go/Rust + default
- `test-writer` (Sonnet, **stack-aware**) — variantes node-web/node-server/python/go/rust + default
- Frontmatter complet sur tous les agents (Anthropic 2026) : `name + description + model + effort + color + tools`

**Skills (8 au total, était 3)**
- `/release` — bump version + CHANGELOG + tag + publish
- `/standup` — synthèse quotidienne (commits + PRs + tickets)
- `/pr-review` — review une PR par numéro
- `/test-coverage` — run coverage + suggère 3 tests prioritaires
- `/doc-update` — scan doc obsolète + 5 fixes

**Hooks (3 au total, était 2)**
- `session-start-context.sh` — re-injecte CLAUDE.md + git status après `:compact` (matcher `startup|resume|compact`)

**Stack-aware substitution (CLAUDE.md)**
- Pré-remplit la section Stack (Frontend/Backend) selon les choix du questionnaire
- Pré-remplit le bloc Commands (dev/build/test/lint) par stack (uvicorn pour FastAPI, pnpm pour Next.js, cargo pour Rust, etc.)
- Structure WHAT / WHY / HOW conforme aux best practices Anthropic 2026 (https://www.humanlayer.dev/blog/writing-a-good-claude-md)

**MCPs configurables (12 au total, était 4)**
- Ajout : vercel, supabase, stripe, postgres, slack, github, linear, sentry, figma, playwright, context7, notion
- Filtrage automatique : seuls les MCPs cochés apparaissent dans le `.mcp.json`

**SEO + accessibilité publique**
- `app/robots.ts` (Next.js metadata API)
- `app/sitemap.ts` avec hreflang FR/EN
- `app/icon.svg` + `app/apple-icon.svg` (brand mark)
- `app/[locale]/opengraph-image.tsx` (OG image dynamique 1200×630 par locale)
- `generateMetadata` : canonical URLs, hreflang alternates, twitter card, robots directives
- JSON-LD `SoftwareApplication` dans le `<body>` (rich snippets Google)

**Sécurité production**
- `lib/rate-limit.ts` : token bucket en mémoire, 20 req/min/IP sur `/api/generate`
- Body size cap : 32 KB sur `/api/generate` (rejet 413)
- pnpm overrides : esbuild >=0.25.0, vite >=6.3.6, postcss >=8.5.13, @eslint/plugin-kit >=0.3.4

**Tests**
- Vitest 4.x configuré (`vitest.config.ts`)
- 5 unit tests sur `lib/rate-limit.ts`
- 5 E2E tests sur `/api/generate` (skippables via `SKIP_E2E=1`)
- CI exécute les unit tests sur chaque PR

**i18n**
- Bilingue FR (default) + EN via `next-intl`, `localePrefix: as-needed`
- Toutes les pages, composants et messages de validation traduits

**Branch protection**
- Ruleset GitHub `protect-main` : pull_request requis (0 reviews requis, self-merge OK), no deletion, no force-push
- Bypass admin en mode `pull_request` uniquement (pas de push direct)

**DX**
- `.env.example`
- `.github/dependabot.yml` (weekly grouped npm + github-actions updates)
- `prettier` + `.prettierrc.json` + `.prettierignore`
- Scripts npm : `format`, `format:check`, `test`, `test:watch`

**Pivot landing**
- Refonte de la landing en produit-first (était cabinet de conseil)
- Hero stats reflètent la réalité : 9 questions, 14 stacks, 10 agents, 12 MCPs
- Sections Method/Expertise/Personas/Process/UseCases/FAQ/CTA réécrites
- Footer avec liens GitHub réels (était `href="#"`)

### Corrigé

- README + USE_CASES + landing : alignement "9 questions" partout (était mélange 6/9)
- Nav anchors : utilisation de Link `next-intl` avec `/#anchor` pour fonctionner depuis n'importe quelle page
- Mobile : Nav CTA `nav-cta` caché < 768px via `display: none !important`
- Mobile : grids 2 colonnes du landing collapse en 1 col < 768px (root cause : React render `minmax(0, 1fr)` avec espace, sélecteurs CSS le cherchaient sans espace)
- ColorPicker preview : fond clair forcé (#F8F7F4) pour rester lisible en dark mode
- Method timeline : labels SUMMIT/CAMP DE BASE `nowrap` + offset -40 pour ne plus chevaucher les markers
- Step 8 (extras) : `break-all` sur les noms de fichiers longs (`.github/workflows/ci.yml`)
- 0 vulnerabilité Dependabot (next 16.0 → 16.2.4 high CVE, esbuild + vite + postcss + plugin-kit)
- `teammateMode: "auto"` (était `"tmux"` qui forçait Opus 4.7)
- Em dashes (`—`) retirés de toute la copy UI : 45 occurrences sur messages FR + EN + composants landing

## [0.1.0] - 2026-05-03

### Ajouté
- App Next.js 16 + Tailwind v4 + Shadcn-style components
- One-page marketing avec questionnaire 6 étapes initial
- API `/api/generate` qui streame un `.zip` projet personnalisé
- Templates `greenfield/` (nouveau projet) et `overlay/` (projet existant)
- Script `install.sh` dual-mode avec détection auto du stack
- 4 agents génériques : researcher, challenger, reviewer, page-writer
- 3 skills : `/kickoff`, `/audit`, `/design-handoff`
- 2 hooks : `pre-edit-secrets.sh` (avec whitelist `.env.example` et fail-soft sans jq), `post-edit-format.sh`
- 3 rules : coding-standards, git-workflow, security
- `DESIGN.md` 9 sections (granite + cuivre)
- `.mcp.json` avec Notion + Context7 actifs
- GitHub Actions CI : lint + typecheck + build + validation templates + tests hooks
- Templates issues + PR
- USE_CASES.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md, CHANGELOG.md
- License MIT
