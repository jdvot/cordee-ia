# Plateforme dev tools open-source — 2 starters Claude Code

**Industrie** : Dev tools open-source — outillage IA pour équipes produit
**Taille équipe** : Mainteneur principal + contributeurs externes
**Phase Cordée.IA** : Pilot
**Durée** : 3 semaines

## Le défi

Les équipes qui adoptent Claude Code partent souvent d'une page blanche : pas de `CLAUDE.md` structuré, pas de hooks de sécurité, pas de skills réutilisables. Résultat : chaque dev configure son coin, les standards divergent en deux semaines, et les secrets fuient régulièrement dans les commits. Le besoin : deux templates publics, l'un pour démarrer un projet from scratch, l'autre pour ajouter Claude Code à un repo existant sans casser l'organisation en place.

## Ce qu'on a fait

- Publication de deux dépôts GitHub publics : un starter greenfield (projet neuf, structure complète) et un overlay (à dropper sur un repo existant sans toucher au code métier).
- Template `DESIGN.md` en 9 sections (objectifs, contraintes, choix d'archi, alternatives, métriques, etc.) pour forcer une décision documentée avant toute génération de code.
- Trois skills prêts à l'emploi : `/kickoff` (initialisation projet), `/design-handoff` (passage design → dev), `/audit` (revue sécurité + qualité).
- Hooks pre-edit qui bloquent l'écriture dans `.env`, fichiers de credentials, certificats, et hooks post-edit qui lancent prettier (TS/JS) ou black + ruff (Python) automatiquement.
- Configuration Agent Teams pré-câblée (tmux split panes) pour orchestrer 3-5 agents en parallèle sur des tâches multi-repos sans conflit de fichiers.
- Documentation README orientée décision : quand utiliser greenfield vs overlay, comment auditer les MCPs tiers avant installation, quand NE PAS utiliser Claude Code.

## Résultats

- Temps d'onboarding d'un nouveau projet sur Claude Code : de 4h (config manuelle hooks + skills + agents) à 12 min (clone + adapt).
- 0 fuite de secret commit-side observée sur les 6 projets utilisateurs ayant adopté l'overlay (vs 2 incidents documentés en pré-overlay).
- Stars GitHub combinées : 0 → 180 sur 8 semaines (sans budget marketing).
- Taux de PRs externes acceptées sans modification : 64% (vs ~30% sur des templates moins structurés selon la moyenne open-source dev tools).

## Stack

- Markdown (CLAUDE.md, DESIGN.md, skills, rules)
- Bash + jq (hooks pre/post edit)
- tmux (Agent Teams split panes)
- GitHub Actions (CI lint + tests sur les hooks)
- MCP servers : GitHub, Notion, Playwright (trio recommandé par défaut)

## Verbatim client

> "L'overlay nous a permis d'ajouter Claude Code à un monorepo existant sans toucher à la CI ni aux conventions de l'équipe. Les hooks pre-edit ont attrapé un .env qu'on aurait commit le premier jour."
> — Tech Lead, équipe utilisatrice de l'overlay
