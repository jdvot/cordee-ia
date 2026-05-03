# Cordée.IA

[![CI](https://github.com/jdvot/cordee-ia/actions/workflows/ci.yml/badge.svg)](https://github.com/jdvot/cordee-ia/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-D4824A.svg)](LICENSE)
[![Deploy on Vercel](https://img.shields.io/badge/Vercel-deployed-1A2B3C?logo=vercel&logoColor=white)](https://cordee-ia.vercel.app)
[![Issues](https://img.shields.io/github/issues/jdvot/cordee-ia.svg?color=D4824A)](https://github.com/jdvot/cordee-ia/issues)

> **Démarre un projet Claude Code + Claude Design en 2 minutes.** Réponds à 6 questions, télécharge un `.zip` prêt à l'emploi. Gratuit, open source, MIT.

🌐 **Démo en ligne** : [cordee-ia.vercel.app](https://cordee-ia.vercel.app) · 📦 **Générateur** : [cordee-ia.vercel.app/generator](https://cordee-ia.vercel.app/generator)

---

## Pourquoi ça existe

Configurer Claude Code à la main coûte 2 heures à chaque nouveau projet :
écrire `CLAUDE.md`, choisir des agents, écrire des hooks, configurer des MCPs,
décider des conventions. **C'est de la friction qui ne crée pas de valeur métier.**

Cordée.IA fait ce travail à ta place. Tu réponds à 6 questions, tu cliques
"Télécharger", tu lances `claude` dans le dossier, tu codes ta feature.

## Cas d'usage

9 cas concrets détaillés dans [USE_CASES.md](USE_CASES.md) :

1. **Démarrer un nouveau projet from scratch** (greenfield) — 2 min vs 2 h
2. **Ajouter Claude Code à un projet existant** (overlay, sans casser)
3. **Animer un cours / atelier** (générer un starter identique pour 30 étudiants)
4. **Démo Claude Design dans un talk** (chaîne design → code en live)
5. **Standardiser une équipe** (template GitHub officiel pour tous les devs)
6. **Onboarding sur un legacy codebase** (`/audit` mappe le projet en 10 min)
7. **Bootstrap mission consulting** (starter customisé client par client)
8. **Hackathon / démo MVP** (gagner 28 minutes sur 48 heures)
9. **Migration depuis Cursor / Cline / Copilot** (overlay sans engagement)

## Stack

- **Next.js 16.2** (App Router) + React 19.2
- **Tailwind CSS v4** (via `@theme inline`)
- **Shadcn-style components** (Radix UI primitives, custom code minimaliste)
- **react-hook-form + zod** pour le questionnaire validé
- **archiver** pour streamer le `.zip` côté serveur
- **framer-motion 12** pour les animations (compteurs au scroll, transitions stepper)
- **TypeScript 5.x strict** (no `any`, no `as unknown as`)
- **pnpm** comme gestionnaire de paquets

## Modèles Claude utilisés (routing 90/10)

Les starters générés appliquent le routing recommandé par Anthropic :

- **90 % Sonnet 4.6** — daily driver, tâches mécaniques (research, doc, dependency bump, restructure)
- **10 % Opus 4.7** — reasoning lourd (challenger, code review, db migration, security audit, agent teams)
- **Économie estimée** : jusqu'à -70 % de coût vs all-Opus, avec une qualité préservée

Détails dans le `CLAUDE.md` généré dans chaque starter — section "Modèles Claude — routing recommandé".

> Note : le mode multi-équipiers (`/team`) nécessite Opus 4.7 (Pro / Max / Enterprise).
> Sonnet 4.6 ne supporte pas le orchestrateur de teammates.

## Démarrage local

```bash
gh repo clone jdvot/cordee-ia
cd cordee-ia
pnpm install
pnpm dev
# http://localhost:3000
```

Autres commandes :

```bash
pnpm typecheck   # tsc --noEmit
pnpm build       # next build (Turbopack)
pnpm start       # next start (prod)
pnpm lint        # next lint
```

## Architecture

```
.
├── app/
│   ├── page.tsx                    # Landing consulting (Cordée.IA)
│   ├── generator/page.tsx          # Questionnaire de génération
│   ├── api/generate/route.ts       # POST → stream zip personnalisé
│   ├── layout.tsx                  # Fonts (Instrument Serif, Inter, JetBrains Mono)
│   └── globals.css                 # Tokens granite + cuivre + topo-bg
├── components/
│   ├── landing/                    # Sections de la landing (Hero, Method, etc.)
│   ├── Questionnaire.tsx           # Stepper 7 étapes (rhf + zod)
│   └── ui/                         # Button, Card, Input, Textarea, Label, Checkbox…
├── lib/utils.ts                    # cn() (clsx + tailwind-merge)
├── templates/
│   ├── greenfield/                 # Scaffold complet (.claude/, CLAUDE.md, DESIGN.md, .mcp.json)
│   ├── overlay/                    # Surcouche pour repo existant
│   └── install.sh                  # Script dual-mode greenfield/overlay
├── examples/                       # Sorties d'exemple générées par les agents
├── USE_CASES.md                    # 9 cas d'usage concrets
├── CONTRIBUTING.md                 # Comment contribuer
├── CODE_OF_CONDUCT.md              # Contributor Covenant 2.1
├── SECURITY.md                     # Politique de sécurité
├── CHANGELOG.md                    # Historique des changements
├── REVIEW.md                       # Audit qualité code (transparency)
├── CHALLENGE.md                    # Audit critique du projet (devil's advocate)
└── IMPROVEMENTS.md                 # Roadmap d'amélioration
```

## Comment ça marche

1. L'utilisateur répond à 6 questions (nom, mode, stack, agents, skills, MCPs, design).
2. Le frontend POST `/api/generate` avec le payload (validé via `zod`).
3. La route lit récursivement `templates/greenfield/` ou `templates/overlay/` :
   - Filtre `.claude/agents/` selon les agents cochés.
   - Filtre `.claude/skills/` selon les skills cochés.
   - Régénère `.mcp.json` avec uniquement les MCPs cochés.
   - Customize `CLAUDE.md` (`[PROJECT NAME]`, `[STACK]`, description).
   - Garde, vide, ou supprime `DESIGN.md` selon le choix.
   - Génère un `README.md` projet personnalisé.
4. La route streame un `.zip` (`archiver`) avec headers `attachment; filename="<projectName>.zip"`.

**Tout est en mémoire** — rien n'est stocké, rien n'est envoyé à un tiers
(pas même Anthropic ou OpenAI).

## Tests CI

À chaque push sur `main` ou PR, GitHub Actions vérifie :

- ✅ `pnpm lint` passe
- ✅ `pnpm typecheck` passe
- ✅ `pnpm build` passe (avec Next.js Turbopack)
- ✅ `templates/*/.claude/settings.json` sont valides JSON
- ✅ `settings.json` contiennent `env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` + `teammateMode`
- ✅ `settings.json` ne contiennent **pas** le champ invalide `experimental.agentTeams`
- ✅ Hooks `pre-edit-secrets.sh` bloquent `.env`, `*.key`, `credentials.json`
- ✅ Hooks `pre-edit-secrets.sh` autorisent `.env.example` et fichiers normaux

Voir [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

## Déploiement

Déployable sur **Vercel** sans configuration spéciale.

Le seul détail technique : `runtime: nodejs` est requis sur `/api/generate`
(à cause de `archiver`), et `outputFileTracingIncludes` est utilisé dans
`next.config.ts` pour packager `templates/**` dans le bundle de la fonction
serverless (sinon Next.js ne le détecte pas car les fichiers sont lus
dynamiquement).

```bash
vercel --prod
```

## Style et conventions

- 100 % FR-natif (pas `team` / `framework` / `step`)
- Zéro emoji dans le corps des fichiers (sauf README, USE_CASES, badges)
- Un seul CTA accent cuivre par fold de la landing
- Border-radius 8–12 px
- Sections `py-32` desktop / `py-20` mobile
- Container `max-w-[1200px]` centré
- TypeScript strict

Voir `templates/greenfield/DESIGN.md` pour l'exemple complet du design system
Cordée (granite + cuivre).

## Documentation associée

- [USE_CASES.md](USE_CASES.md) — 9 cas d'usage concrets
- [CONTRIBUTING.md](CONTRIBUTING.md) — guide de contribution
- [SECURITY.md](SECURITY.md) — politique de sécurité, vulnérabilités
- [CHANGELOG.md](CHANGELOG.md) — historique versionné
- [REVIEW.md](REVIEW.md) — audit qualité code (transparence)
- [CHALLENGE.md](CHALLENGE.md) — audit critique (devil's advocate)
- [IMPROVEMENTS.md](IMPROVEMENTS.md) — roadmap

## Roadmap

10 issues prioritaires sont [tracées sur GitHub](https://github.com/jdvot/cordee-ia/issues) :

- **P0** : tests E2E Playwright, deploy domaine `cordee-ia.fr`
- **P1** : mode express 3 questions, GitHub OAuth push direct, live preview design
- **P2** : templates spécialisés (T3, Nx, FastAPI), CLI alternative `npx create-cordee-ia`, presets community, i18n EN

Vote pour les features que tu veux en priorité avec un 👍 sur l'issue correspondante.

## Licence

MIT — fork, modifie, redistribue. Le code est à toi.
Voir [LICENSE](LICENSE).

## Auteur

**Julien Devot** — [LinkedIn](https://www.linkedin.com/in/julien-dvt/) · [GitHub](https://github.com/jdvot) · julien.dvt57@gmail.com

PRs et issues bienvenues. Discussions encore plus.
