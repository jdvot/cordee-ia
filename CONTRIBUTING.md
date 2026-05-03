# Contributing to Cordée.IA

Merci de t'intéresser à Cordée.IA ! Voici comment contribuer efficacement.

## Code de conduite

Be excellent to each other. Pas de harcèlement, pas de discrimination, pas de comportement toxique. Voir [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Comment contribuer

### Signaler un bug

1. Vérifie d'abord dans les [issues](https://github.com/jdvot/cordee-ia/issues) existantes.
2. Ouvre une nouvelle issue avec le template "Bug report" :
   - **Reproduction** : étapes minimales pour reproduire
   - **Comportement attendu** vs **observé**
   - **Environnement** : OS, version Node, version Claude Code
   - **Captures** si pertinent

### Proposer une fonctionnalité

1. Ouvre une [discussion](https://github.com/jdvot/cordee-ia/discussions) **avant** de coder, pour valider l'approche.
2. Si validée, ouvre une issue avec le template "Feature request".

### Soumettre du code

1. **Fork** le repo, crée une branche : `git checkout -b feat/ma-feature`.
2. Commits avec [Conventional Commits](https://www.conventionalcommits.org/) : `feat:`, `fix:`, `docs:`, `chore:`, etc.
3. **Tests** : si tu ajoutes une feature, ajoute un test minimal. Si tu fixes un bug, ajoute un test qui aurait reproduit le bug.
4. **Lint + typecheck** : `pnpm lint && pnpm typecheck` doivent passer.
5. **Build** : `pnpm build` doit passer.
6. Push vers ton fork, ouvre une [Pull Request](https://github.com/jdvot/cordee-ia/pulls) vers `main`.
7. Description PR : mentionne l'issue (`Closes #123`), explique le **pourquoi** plus que le **quoi** (le diff montre déjà le quoi).

### Templates de projet (`templates/`)

Si tu veux ajouter ou améliorer un template :

- **Greenfield** (`templates/greenfield/`) : scaffold complet pour un nouveau projet
- **Overlay** (`templates/overlay/`) : minimal, à dropper dans un projet existant

Critères d'acceptation pour un template :
- `.claude/settings.json` valide contre le [schema officiel](https://json.schemastore.org/claude-code-settings.json)
- Hooks exécutables, testés avec un input JSON simulé
- Pas de fichiers secrets ou références à des credentials privés
- Conventions FR-natives respectées (méthode, équipe, étape)

### Agents (`templates/*/.claude/agents/`)

Un nouvel agent doit avoir :
- Frontmatter complet : `name`, `description`, `model`, `tools`
- Description en 1-2 phrases qui dit **quand utiliser** l'agent
- Tool allowlist tight (pas de `*` sans raison)
- Modèle adapté : `haiku` pour mécanique, `sonnet` pour mid-task, `opus` pour reasoning lourd

### Skills (`templates/*/.claude/skills/`)

Un nouveau skill doit avoir :
- `SKILL.md` avec frontmatter `name`, `description`
- Section "When to use" et "When NOT to use"
- Steps clairs (pas de magie cachée)
- Inputs documentés

## Setup local

```bash
git clone https://github.com/jdvot/cordee-ia.git
cd cordee-ia
pnpm install
pnpm dev
# http://localhost:3000
```

## Releases

Les releases suivent [SemVer](https://semver.org/) : `MAJOR.MINOR.PATCH`.

- `PATCH` : bug fixes, doc updates, template tweaks rétro-compatibles
- `MINOR` : nouvelle feature rétro-compatible (nouvel agent, nouveau skill, etc.)
- `MAJOR` : breaking change (changement schema settings.json, restructuration templates)

## Questions

- [Discussions GitHub](https://github.com/jdvot/cordee-ia/discussions)
- Email : julien.dvt57@gmail.com
- LinkedIn : https://www.linkedin.com/in/julien-dvt/

Merci de ta contribution !
