# `examples/` — démonstration des agents pré-configurés

Ce dossier contient des **exemples de sortie** générés par les agents Claude Code pré-configurés dans `.claude/agents/`. Ils servent à montrer ce que tu peux obtenir en lançant l'équipe sur ton propre projet.

**Tu peux les supprimer librement** — c'est juste de la démo.

## `case-studies/`

3 case studies anonymisés générés par un agent business pour un site marketing fictif (cabinet conseil AI integration). Démontre le format `Le défi → Ce qu'on a fait → Résultats chiffrés → Stack → Verbatim client`.

Lancé via :
```
claude
> Lance un agent business qui écrit 3 case studies anonymisés…
```

## `content/`

6 fichiers de copy marketing FR (hero, personas, méthode, expertise, FAQ, value-prop) générés par un agent copywriter. Démontre la voix de marque FR-natif sans anglicismes.

Lancé via :
```
claude
> Lance un agent copywriter qui écrit le contenu marketing du site…
```

## Comment reproduire pour ton projet

1. Customize `CLAUDE.md` avec ton WHAT/WHY/Stack
2. Customize `DESIGN.md` avec ta marque (ou laisse l'exemple)
3. Ouvre Claude Code dans le repo : `claude`
4. Lance `/team` pour activer Agent Teams (requires Opus 4.6 + tmux)
5. Briefe l'équipe avec ton scope

## Ne pas confondre

Ces exemples sont là pour **inspirer la structure**, pas le contenu. Ils ne décrivent **aucun client réel** de l'auteur du repo. Anonymisation totale.
