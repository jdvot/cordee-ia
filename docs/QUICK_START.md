# Démarrage rapide — 1 minute

> Cordée.IA en 5 étapes. Lecture : 60 secondes. Exécution : 2 minutes.

## En une image

```
                ┌─────────────────────────────────────┐
                │  cordee-ia.vercel.app/generator     │
                └──────────────┬──────────────────────┘
                               │
                          (7 questions)
                               │
                               ▼
                ┌─────────────────────────────────────┐
                │   <ton-projet>.zip                  │
                │   .claude/  CLAUDE.md  DESIGN.md    │
                │   .mcp.json  hooks  agents  skills  │
                └──────────────┬──────────────────────┘
                               │
                          unzip + claude
                               │
                               ▼
                ┌─────────────────────────────────────┐
                │   /kickoff                          │
                │   tu codes ta feature               │
                └─────────────────────────────────────┘
```

## Les 5 étapes

### 1. Va sur le générateur

[cordee-ia.vercel.app/generator](https://cordee-ia.vercel.app/generator)

### 2. Réponds aux 7 questions

Mode complet (~ 2 minutes) ou mode express (~ 30 secondes) si tu es pressé.
Tu choisis :

- Nom de projet + description
- Mode (greenfield from scratch / overlay sur repo existant)
- Stack (Next.js, NestJS, FastAPI, Django, Rails, Go, etc.)
- Agents Claude à inclure (researcher, challenger, reviewer, doc-writer, etc.)
- Skills (`/kickoff`, `/audit`, `/design-handoff`, `/release`, etc.)
- MCPs (Notion, Linear, Sentry, Playwright, Figma, etc.)
- Design system (Cordée granite + cuivre, custom, ou skip)

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
