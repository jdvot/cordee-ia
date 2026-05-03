# Cordée.IA dans un monorepo

Comment utiliser Cordée.IA quand ton projet client est en monorepo (Turborepo, pnpm workspaces, Nx, Lerna).

> Le repo Cordée.IA lui-même est un **single repo**. Cette page parle de **comment générer un starter pour un projet client en monorepo**, ou comment dropper l'overlay dans un monorepo existant.

## Comportement de Claude Code dans un monorepo

Claude Code charge les fichiers `CLAUDE.md` et `.claude/` **en cascade hiérarchique** :

1. `~/CLAUDE.md` (global utilisateur, si existant)
2. `<repo-root>/CLAUDE.md` (vision globale, conventions transversales)
3. `<repo-root>/<sub-package>/CLAUDE.md` (spécifique au package courant)

Plus profond = plus spécifique = override. Idem pour `.claude/settings.json` (merge profondeur croissante, le plus profond gagne).

```
my-monorepo/
├── CLAUDE.md                         # racine — chargé d'abord
├── .claude/
│   ├── settings.json                 # mergé en profondeur
│   ├── agents/                       # agents partagés
│   └── skills/                       # skills partagés
├── .mcp.json                         # un seul à la racine
├── apps/
│   ├── web/
│   │   ├── CLAUDE.md                 # spécifique web (Next.js, deploy Vercel)
│   │   └── .claude/
│   │       ├── settings.json         # merge avec racine
│   │       └── agents/               # agents spécifiques web
│   └── api/
│       ├── CLAUDE.md                 # spécifique API (NestJS, DB, auth)
│       └── .claude/agents/
└── packages/
    └── shared/
        └── CLAUDE.md                 # conventions de la lib partagée
```

Quand tu lances `claude` dans `apps/web/`, la session voit la cascade complète.

## Cas 1 — Greenfield monorepo (nouveau projet)

Cordée.IA ne génère pas un squelette monorepo complet (pas de `apps/web` pré-scaffold avec Next.js + sous-packages). C'est volontaire — chaque équipe a sa préférence (Turborepo, pnpm workspaces, Nx).

**Workflow recommandé** :

1. **Génère un starter Cordée.IA** avec mode `greenfield` et stack `none` (ou ton stack root)
2. **Customize CLAUDE.md** racine pour parler de la philosophie monorepo de ton équipe
3. **Initialise ton monorepo manuellement** :
   ```bash
   # pnpm workspaces
   pnpm init
   echo 'packages:\n  - "apps/*"\n  - "packages/*"' > pnpm-workspace.yaml

   # Turborepo
   pnpm dlx create-turbo@latest

   # Nx
   pnpm dlx create-nx-workspace@latest
   ```
4. **Pour chaque sub-package**, drop un overlay Cordée.IA depuis le sub-dir :
   ```bash
   cd apps/web
   curl -sL https://raw.githubusercontent.com/jdvot/cordee-ia/main/templates/install.sh | bash
   ```
5. Le sub-`CLAUDE.md` complète le `CLAUDE.md` racine avec les specs du sous-package.

## Cas 2 — Drop overlay sur monorepo existant

Tu as déjà un monorepo en route. Tu veux ajouter Claude Code progressivement.

**Stratégie A — Overlay racine seule**

```bash
cd my-existing-monorepo
curl -sL https://raw.githubusercontent.com/jdvot/cordee-ia/main/templates/install.sh | bash
```

→ Ajoute `.claude/`, `CLAUDE.md`, `.mcp.json` à la racine. Suffisant pour 80 % des cas (les conventions transverses suffisent).

**Stratégie B — Overlay racine + par sub-package**

Idéal si tes sub-packages ont des stacks très différents (ex : `apps/web` en Next.js, `apps/api` en NestJS, `apps/cli` en Go).

```bash
# 1. Racine
cd my-existing-monorepo
curl -sL ... | bash

# 2. Pour chaque sub-package qui mérite ses propres specs
cd apps/web
curl -sL ... | bash

cd ../api
curl -sL ... | bash
```

À chaque drop, le `install.sh` détecte le stack du sub-package (`package.json` Next.js détecté = Next.js, etc.) et génère un `CLAUDE.md` adapté.

**Inconvénient** : tu dupliques `.claude/agents/` et `.claude/skills/` partout. Préfère la Stratégie A si possible.

## Pattern recommandé pour un gros monorepo

| Niveau | Contient |
|---|---|
| **Racine** `<root>/CLAUDE.md` + `.claude/` | Conventions de code transverses, agents partagés (researcher, challenger, reviewer), skills partagés (`/audit`, `/release`), MCPs racine (`.mcp.json` unique) |
| **Apps** `apps/<name>/CLAUDE.md` | Stack précis (Next.js 16 / NestJS 11 / FastAPI 0.115), commandes (dev/build/test), spécificités déploiement |
| **Apps** `apps/<name>/.claude/agents/` | Agents spécifiques au sub-stack (db-migration-reviewer pour l'API avec Prisma, a11y-auditor pour le web) |
| **Packages** `packages/<lib>/CLAUDE.md` | Conventions API publique, semver discipline, breaking change policy |

## Pièges à éviter

❌ **Dupliquer le même agent partout** — si `researcher.md` est utile pour toute l'org, mets-le seulement à la racine.

❌ **`.mcp.json` par sub-dir** — Claude Code ne supporte qu'un seul `.mcp.json` par session. Mets-le à la racine.

❌ **`settings.json` profonds qui contredisent la racine** — les hooks et permissions sont mergés, mais des conflits genre `permissions.defaultMode: "acceptEdits"` racine vs `bypassPermissions` package = comportement imprévisible. Garde la cohérence.

❌ **Tout en `bypassPermissions`** sur monorepo CI — si le hook `pre-edit-secrets.sh` est désactivé partout, un agent peut overwriter des fichiers sensibles. Garde au moins `acceptEdits`.

## Test rapide

Pour vérifier que la cascade marche :

```bash
cd my-monorepo
claude --print "Quels CLAUDE.md as-tu lus ?"
```

Claude Code devrait te lister les fichiers chargés en cascade.

## Questions ?

[Ouvre une discussion](https://github.com/jdvot/cordee-ia/discussions) ou [une issue](https://github.com/jdvot/cordee-ia/issues/new) si ton cas ne rentre dans aucun des 2 ci-dessus.
