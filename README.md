# Cordée.IA

> Démarre un projet Claude Code + Claude Design en 2 minutes. Réponds à 6 questions, télécharge un .zip prêt à l'emploi. Gratuit, open source, MIT.

Cordée.IA est une **app Next.js** qui génère, à la volée, un starter de projet personnalisé pour [Claude Code](https://www.anthropic.com/claude-code). Le générateur tourne entièrement côté serveur Next.js : aucun compte, aucun stockage, aucun appel à OpenAI ou Anthropic.

## Stack

- **Next.js 16** (App Router) + React 19
- **Tailwind CSS v4** (via `@theme`)
- **Shadcn-style components** (Radix UI primitives, custom code, pas de full install)
- **react-hook-form + zod** pour le questionnaire
- **archiver** pour streamer le `.zip` côté serveur
- **framer-motion** pour les animations subtiles (compteurs au scroll, transitions stepper)

## Démarrage local

```bash
pnpm install
pnpm dev
# http://localhost:3000
```

Autres commandes :

```bash
pnpm typecheck   # tsc --noEmit
pnpm build       # next build
pnpm start       # next start (prod)
pnpm lint        # next lint
```

## Architecture

```
.
├── app/
│   ├── page.tsx                    # One-page (Hero, How, What, Questionnaire, FAQ, Footer)
│   ├── layout.tsx                  # Fonts (Fraunces, Inter, JetBrains Mono)
│   ├── globals.css                 # Tokens granite + cuivre + topo-bg
│   └── api/generate/route.ts       # POST → stream zip personnalisé
├── components/
│   ├── Questionnaire.tsx           # Stepper 7 étapes (rhf + zod)
│   └── ui/                         # Button, Card, Input, Textarea, Label, Checkbox, RadioGroup, Stat
├── lib/utils.ts                    # cn() (clsx + tailwind-merge)
├── templates/
│   ├── greenfield/                 # Scaffold complet (.claude/, CLAUDE.md, DESIGN.md, .mcp.json)
│   ├── overlay/                    # Surcouche pour repo existant
│   └── install.sh                  # Script dual-mode greenfield/overlay
└── examples/                       # Exemples projets générés
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

Tout est en mémoire — rien n'est stocké, rien n'est envoyé à un tiers.

## Déploiement

L'app est déployable sur **Vercel** sans configuration spéciale (`runtime: nodejs` requis sur la route `/api/generate` à cause de `archiver`).

## Style

- 100 % FR-natif (pas team / framework / step).
- Zéro emoji body.
- Un seul CTA accent cuivre par fold.
- Border-radius 8–12 px.
- Sections `py-32` desktop / `py-20` mobile.
- Container `max-w-[1200px]` centré.

Voir `templates/greenfield/DESIGN.md` pour l'exemple complet du design system Cordée (granite + cuivre).

## Licence

MIT — fork, modifie, redistribue. Le code est à toi.

## Auteur

Julien Devot — [LinkedIn](https://www.linkedin.com/in/julien-dvt/) · [GitHub](https://github.com/jdvot) · julien.dvt57@gmail.com
