# Changelog

Toutes les modifications notables sont documentées ici.

Format basé sur [Keep a Changelog](https://keepachangelog.com/), versioning [SemVer](https://semver.org/).

## [Unreleased]

### Ajouté
- **USE_CASES.md** — 9 cas d'usage concrets (greenfield / overlay / atelier / talk / standardisation équipe / onboarding legacy / mission consulting / hackathon / migration depuis Cursor)
- **SECURITY.md** — politique de sécurité, modèle de menace, surface d'attaque
- **README.md** badges CI / License / Vercel / Issues + section Cas d'usage + section Roadmap pointant vers les Issues GitHub
- App Next.js 16 + Tailwind v4 + Shadcn-style components
- One-page marketing avec questionnaire 7 étapes
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
- CONTRIBUTING.md + CODE_OF_CONDUCT.md + CHANGELOG.md
- License MIT

### Corrigé
- `pre-edit-secrets.sh` ne bloque plus les fichiers `.env.example` (faux positif)
- `pre-edit-secrets.sh` fail-soft si `jq` est absent (au lieu de tout casser)
- `settings.json` : suppression du champ invalide `experimental.agentTeams` au profit de la combinaison officielle `env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` + `teammateMode`

## [0.1.0] - 2026-05-03

- Bootstrap initial du repo
