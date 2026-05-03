# Cordée.IA — Site marketing one-page

> Cabinet de conseil qui intègre Claude Code, Claude Design et l'IA générative dans les équipes existantes.

## Pitch

On guide les CTO de startups healthtech et de PME à passer de zéro à l'IA en production en 90 jours, via une méthode en 5 phases : **Discovery → Pilot → Expansion → Scale → Operate**.

Notre signature : intégration chirurgicale dans le code et l'organisation. Pas de big-bang, pas de PowerPoint, pas de promesse hype. On forme la cordée, on guide étape par étape, on mesure à chaque palier.

## Cibles

- 244 healthtech FR Series A+ (TAM connue, marché validé)
- PME tech 50-500 personnes
- Agences créa/marketing en transition AI-native

## Différenciateur vs les ~200 agences AI consulting FR

- On code en prod, on ne fait pas de la formation 1 jour
- Métriques DORA + utilization trackées dès le sprint 1
- Pricing public (Discovery 5k€ / Pilot 10k€ / Expansion 15k€ / Scale 20k€ / Operate 2-3k€/mois)
- Maîtrise concrète Claude Code + Claude Design + tmux Agent Teams (peu de monde sait quand l'utiliser)

## Ce repo

Ce repo contient :
- `DESIGN.md` — Design system 9 sections, à uploader dans Claude Design
- `CLAUDE.md` — Instructions pour Claude Code lors du handoff
- `content/` — Copy/text des sections du site (FAQ, personas, hero, value prop)
- `case-studies/` — Études de cas anonymisées (Limitless RAG biomarqueurs, Cardio Brief, etc.)
- `.claude/` — Agents + skills + hooks pour quand on code la stack

## Workflow

```
1. Tu uploades ce repo dans Claude Design (https://claude.ai/design)
2. Claude Design extrait DESIGN.md + content + assets
3. Itération design (4-6 prompts en moyenne)
4. Handoff to Claude Code → bundle arrive ici
5. Skill /design-handoff scaffold Next.js 16 + Tailwind v4 + Shadcn + Framer
6. Push Vercel, domaine cordee-ia.fr connecté
```

## Stack cible

- Next.js 16 App Router (React 19.2)
- Tailwind CSS v4 (`@theme inline`)
- Shadcn UI (latest)
- Framer Motion 12
- Cal.com embed
- Plausible (cookieless analytics)
- Vercel hosting
- TypeScript strict (no `any`, no `as unknown as`)

## Status

Repo en préparation. Prochaines étapes :
- [ ] DESIGN.md finalisé avec tokens précis
- [ ] Copy FR-natif (hero, personas, FAQ, value prop)
- [ ] 3 case studies anonymisés
- [ ] Upload Claude Design + itération
- [ ] Handoff Claude Code + scaffold
- [ ] Domaine cordee-ia.fr acheté
- [ ] Push prod Vercel
