# Cordée.IA — Site marketing one-page

> Site de pitch consulting. Conversion = booking Cal.com 30min découverte.

## WHAT

Cabinet de conseil qui intègre Claude Code + Claude Design + IA générative dans les équipes existantes. Méthode 5 phases : Discovery → Pilot → Expansion → Scale → Operate. Pricing public.

## WHY

- Marché = 244 healthtech FR Series A+, 200+ AI consultants en concurrence
- Différenciateur = on code en prod, pas du PowerPoint Qualiopi
- Wedge = AI Act août 2026 + niche healthcare où Vanta/Drata ne descendent pas
- Lead magnet potentiel = `start.cordee.ia` (générateur web Claude workspace)

## Stack

- Next.js 16 App Router
- React 19.2
- Tailwind CSS v4 (`@theme inline`)
- Shadcn UI (latest)
- Framer Motion 12
- Cal.com embed
- Plausible (cookieless analytics)
- Vercel hosting
- TypeScript strict

## Commands (à initialiser)

```bash
# Dev
pnpm dev

# Build
pnpm build

# Test
pnpm test

# Lint
pnpm lint
```

## Conventions

- 100% FR-natif. Pas d'anglicismes inutiles. "méthode" pas "framework", "équipe" pas "team".
- Pas d'emojis dans le copy marketing.
- Pas de gradient violet→rose (cliché AI startup).
- Pas de stock photos corporate. Photos B&W montagne/cordée uniquement.
- See `DESIGN.md` for the full design system (tokens, components, do/don't).
- See `.claude/rules/coding-standards.md` for code style.
- See `.claude/rules/security.md` for secrets baseline.

## Sections du site

1. **Hero** — H1 Fraunces 80px + 4 stats animées + CTA "Réserver 30min" accent copper
2. **Pour qui** — 3 personas cards (CTO healthtech / dirigeant PME / directeur agence)
3. **La méthode** — Timeline 5 phases interactive (révélée au scroll comme une ascension), prix publics
4. **Domaines d'expertise** — 4 cards avec modale détail (Claude Code / Claude Design / IA Marketing / IA Ops)
5. **Cas clients** — 2-3 case studies avec métriques
6. **À propos** — bio + crédibilité (Limitless, Cardio Brief)
7. **FAQ** — 6-8 questions (tarifs, déroulement, RGPD, durée, à distance)
8. **Contact** — Cal.com embed direct

## Workflow design → code

```
1. Upload ce repo dans Claude Design
2. Claude Design lit DESIGN.md + content/ + .claude/
3. Itération design (4-6 prompts moyens)
4. Bouton "Handoff to Claude Code"
5. Bundle arrive dans ./design-output/
6. /design-handoff [./design-output] → scaffold Next.js
7. Code ajusté manuellement
8. Push Vercel + domaine cordee-ia.fr
```

## Don't

- No big bullets > 3 lines (mobile-first readability).
- No more than 1 accent CTA per fold (the copper button = focus, dilute and it dies).
- No animations on first load that delay LCP.
- No tracking beyond Plausible (cookieless).
