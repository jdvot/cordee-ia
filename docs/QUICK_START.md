# Démarrage rapide — 1 minute

> Cordée.IA en 5 étapes. Lecture : 60 secondes. Exécution : 2 minutes.

## En une image

```
                ┌─────────────────────────────────────┐
                │  cordee-ia.vercel.app/generator     │
                └──────────────┬──────────────────────┘
                               │
                          (9 questions, 2 min)
                               │
                               ▼
                ┌─────────────────────────────────────┐
                │   <ton-projet>.zip                  │
                │   .claude/  CLAUDE.md  DESIGN.md    │
                │   .mcp.json  hooks  agents  skills  │
                │   + extras + LICENSE + README       │
                └──────────────┬──────────────────────┘
                               │
                          unzip + claude
                               │
                               ▼
                ┌─────────────────────────────────────┐
                │   /kickoff (greenfield)             │
                │   /audit   (overlay)                │
                │   tu codes ta feature               │
                └─────────────────────────────────────┘
```

## Les 5 étapes

### 1. Va sur le générateur

[cordee-ia.vercel.app/generator](https://cordee-ia.vercel.app/generator)

### 2. Réponds aux 9 questions

Compte 2 minutes. Tu choisis dans cet ordre :

1. **Nom de projet + description**
2. **Mode** (greenfield from scratch ou overlay sur repo existant) + option Team setup
3. **Stack** (14 au choix : Next.js, NestJS, FastAPI, Django, Flask, Go, Rust, Vue, SvelteKit, Astro, Remix, Hono, Express, ou aucune)
4. **Agents Claude** (10 au choix, dont test-writer + dependency-updater stack-aware)
5. **Skills** (8 au choix : `/kickoff`, `/audit`, `/design-handoff`, `/release`, `/standup`, `/pr-review`, `/test-coverage`, `/doc-update`)
6. **MCPs** (12 au choix : Notion, Sentry, Figma, Playwright, GitHub, Linear, Vercel, Supabase, Stripe, Postgres, Slack, Context7)
7. **Design system** + couleurs (exemple Cordée, template vide à 9 sections, ou skip + ColorPicker primary/accent)
8. **Fichiers complémentaires** (.editorconfig, Prettier, Makefile, Dockerfile, docker-compose, .vscode, GitHub Actions CI)
9. **License** (MIT, Apache-2.0, AGPL-3.0, ou aucune)

### 3. Télécharge le `.zip`

Le bouton "Générer le starter" streame un `.zip` directement, sans stocker quoi que ce soit côté serveur.

### 4. Extrais et lance Claude Code

```bash
unzip mon-projet.zip
cd mon-projet
claude
```

### 5. Lance `/kickoff` (greenfield) ou `/audit` (overlay)

```
/kickoff   # initialise CLAUDE.md, DESIGN.md, .gitignore selon ta réponse
/audit     # mappe le code existant et propose 3 PRs prioritaires
```

Tu codes ta feature. Le starter contient déjà :

- Conventions (`coding-standards`, `git-workflow`, `security`).
- Hooks de protection (blocage `.env`, `*.key`, `credentials.json`).
- Agents prêts à l'emploi avec routing 90/10 (Sonnet daily, Opus pour reasoning lourd).
- MCPs configurés.

## Et après

- Lance `/audit` même sur un projet greenfield après 2 semaines pour mesurer la dette qui s'accumule.
- Lance `/test-coverage` avant chaque release.
- Lance `/pr-review <num>` sur chaque PR avant merge.
- Lance `/team` si tu as Opus 4.7 et veux orchestrer plusieurs sous-agents en parallèle (tmux split-pane).

## Besoin de plus

- 9 cas d'usage détaillés : [USE_CASES.md](../USE_CASES.md).
- Liste des skills générés : [README.md](../README.md#stack).
- Contribuer ou signaler un bug : [CONTRIBUTING.md](../CONTRIBUTING.md).
