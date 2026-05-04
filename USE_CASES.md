# Cas d'usage — Cordée.IA

Cordée.IA est un générateur de starter Claude Code + Claude Design. Voici **9 cas d'usage concrets** qui décrivent à qui le projet sert et comment l'utiliser dans la pratique.

> Si ton cas n'est pas couvert, [ouvre une issue](https://github.com/jdvot/cordee-ia/issues/new?template=feature_request.md) — on l'ajoute.

---

## 1. Démarrer un nouveau projet from scratch

**Pour qui** : indie hacker, freelance, équipe qui lance un MVP, hackathon.
**Douleur** : tu veux démarrer un projet propre avec Claude Code mais tu ne veux pas passer 2h à écrire `CLAUDE.md`, configurer hooks, choisir des agents.
**Solution** :

```bash
# 1. Va sur https://cordee-ia.vercel.app/generator
# 2. Réponds aux 9 questions : nom, mode "nouveau projet", stack, agents, skills, MCPs, design system
# 3. Télécharge le .zip → décompresse
cd ~/Downloads/mon-projet
git init -b main && git add -A && git commit -m "init from cordee-ia"
claude
> /kickoff
```

**Gain** : 2 minutes au lieu de 2 heures. Tu codes ta feature, pas la config.

---

## 2. Ajouter Claude Code à un projet existant (overlay)

**Pour qui** : équipe qui a un repo legacy ou un side-project en cours et veut intégrer Claude Code sans tout casser.
**Douleur** : tu as déjà un projet, tu ne veux pas le scaffolder à nouveau, tu veux juste les bons fichiers `.claude/` ajoutés intelligemment.
**Solution** :

```bash
# Option A : générateur web (mode overlay)
# https://cordee-ia.vercel.app/generator → choisis "Projet existant"
# Décompresse le .zip dans ton repo, l'install.sh détecte ton stack automatiquement

# Option B : pipe direct (sans navigateur)
cd /chemin/vers/ton/repo
curl -sL https://raw.githubusercontent.com/jdvot/cordee-ia/main/templates/install.sh | bash
claude
> /audit
```

**Gain** : ton `.claude/` existant est sauvegardé en `.claude.backup.<timestamp>`. Le stack est détecté (Next.js/NestJS/FastAPI/Go/Rust). Aucun fichier source écrasé.

---

## 3. Animer un atelier ou cours sur Claude Code

**Pour qui** : enseignant Université / école d'ingé, formateur Qualiopi, Tech Lead qui forme son équipe.
**Douleur** : tu veux montrer Claude Code en live, mais demander à 30 étudiants de configurer leur `CLAUDE.md` à la main = 30 minutes de perdues.
**Solution** :

1. Avant le cours : génère un starter **identique pour tous les étudiants** sur https://cordee-ia.vercel.app/generator. Mets le .zip sur ton drive partagé ou Moodle.
2. Pendant le cours : projette https://cordee-ia.vercel.app et démontre la génération en live (2 min). Les étudiants téléchargent le .zip pré-préparé.
3. Tu codes en parallèle avec eux — la config est déjà là.

**Gain** : focus sur le contenu pédagogique, pas la config. Et les étudiants repartent avec un starter qu'ils peuvent réutiliser.

---

## 4. Démo Claude Design dans un talk

**Pour qui** : speaker tech (conférence, meetup, podcast vidéo) qui veut montrer le workflow design-to-code.
**Douleur** : tu veux montrer Claude Design en live mais sans avoir 5 onglets ouverts et un setup fragile.
**Solution** :

1. Génère un starter Cordée.IA avec `designSystem: use-example` — ça inclut un `DESIGN.md` rempli (granite + cuivre, exemple complet 9 sections).
2. Sur scène : ouvre Claude Design (https://claude.ai/design), uploade le `DESIGN.md`, demande une nouvelle page → Claude Design génère.
3. Clique "Handoff to Claude Code". Récupère le bundle.
4. Dans ton starter : `claude` → `/design-handoff <chemin-vers-bundle>` → scaffold instantané.

**Gain** : démontre la chaîne complète (design tokens → React/Tailwind/Shadcn) en moins de 5 minutes, sans bug.

---

## 5. Standardiser une équipe sur Claude Code

**Pour qui** : CTO ou Tech Lead qui veut que tous les devs de son équipe partagent la même config Claude (mêmes hooks, mêmes agents, mêmes skills).
**Douleur** : chaque dev configure son `CLAUDE.md` à sa sauce → drift inévitable, hooks différents, MCPs différents, conventions divergentes.
**Solution** :

1. Le Tech Lead génère le starter "officiel" de l'équipe sur Cordée.IA avec les agents/skills/rules choisis.
2. Push le contenu sur un repo template interne `team-claude-template`.
3. Marque le repo comme "Template" dans GitHub Settings.
4. Tout nouveau projet équipe : `gh repo create <nom> --template org/team-claude-template`.

**Gain** : config Claude uniforme à travers toute l'équipe. Quand un agent ou skill évolue, tu mets à jour le template, les futurs projets l'héritent. Les anciens projets peuvent merger les changements via `git remote add template ... && git pull template main`.

---

## 6. Onboarding rapide sur un codebase legacy

**Pour qui** : nouveau dev qui rejoint une équipe avec un gros monorepo, consultant ponctuel, sysadmin qui doit lire un repo qu'il n'a pas écrit.
**Douleur** : 50 000 lignes de code, 0 doc, tu ne sais pas par où commencer ni où sont les vrais points de risque.
**Solution** :

```bash
cd /chemin/vers/le/repo-legacy
curl -sL https://raw.githubusercontent.com/jdvot/cordee-ia/main/templates/install.sh | bash
# (le script détecte le stack, ajoute .claude/ avec l'agent "reviewer" + skill /audit)

claude
> /audit
# Claude lit la structure, sample des fichiers, liste tech debt + 5 zones risquées
# + 5 zones safe pour commencer + 3 PRs suggérées avec effort estimé
```

**Gain** : carte du codebase en 10 minutes. Tu sais où mettre les pieds avant ta 1ère PR.

---

## 7. Bootstrap d'un projet client de consulting

**Pour qui** : consultant AI / agence qui livre une mission Discovery ou Pilot, freelance Healthcare AI, équipe Cordée.IA en mission.
**Douleur** : pour chaque nouveau client, tu repars du même modèle (recherche, audit, livrables) — autant l'industrialiser.
**Solution** :

1. Customise ton fork Cordée.IA avec :
   - Agents domaine (`hl7-mapper.md`, `gdpr-reviewer.md`, `mcp-integrator.md`, etc.)
   - Skills client (`/discovery-week-1`, `/pilot-sprint`, `/handoff-deck`)
   - Rules métier (`healthcare-compliance.md`, `ai-act.md`)
2. Pour chaque mission : génère un starter customisé via ton Cordée.IA fork (tu ajoutes les MCPs spécifiques au stack du client : Notion, Linear, Sentry, etc.).
3. Livre le repo au client en fin de mission — il peut continuer sans toi.

**Gain** : ton expertise méthodologique devient un asset versionné. Plus tu fais de missions, plus le starter s'enrichit.

---

## 8. Hackathon / démo MVP en weekend

**Pour qui** : équipe hackathon (Junction, AI Hackathon, etc.), maker qui veut shipper en 48h.
**Douleur** : 48h pour livrer un MVP, perdre 2h sur la config Claude Code = 4% du temps total.
**Solution** :

1. Vendredi soir, en arrivant : ouvre https://cordee-ia.vercel.app/generator depuis ton portable.
2. Réponds aux 9 questions en 2 minutes (nom, mode greenfield, stack Next.js, agents researcher + reviewer, skills /kickoff + /design-handoff, MCPs Notion + Context7, design system empty-template).
3. Décompresse, `git init`, `claude`, `/kickoff`.
4. Tu codes ta feature. Le jury vote dimanche soir.

**Gain** : 2 minutes vs 30 minutes. Plus de temps pour la valeur métier.

---

## 9. Migration vers Claude Code depuis Cursor / Cline / Copilot

**Pour qui** : équipe qui utilise déjà un AI coding assistant (Cursor, Cline, Aider, Copilot) et veut tester Claude Code sans casser le workflow existant.
**Douleur** : tu ne veux pas migrer brutalement. Tu veux juste **ajouter** Claude Code en parallèle, comparer pendant 2 semaines, décider.
**Solution** :

1. Mode overlay sur ton repo existant : `curl ... | bash`.
2. Cursor/Cline/Copilot continuent de marcher (ils utilisent leurs propres configs).
3. Claude Code lit `CLAUDE.md` + `.claude/` que l'overlay vient d'ajouter.
4. Pendant 2 semaines : alterne Claude Code et ton AI actuel sur les mêmes tâches.
5. Mesure : DORA metrics (PR throughput, cycle time), satisfaction subjective, coût.
6. Décide.

**Gain** : aucun engagement, aucune migration. Tu bascules ou pas selon les chiffres.

---

## Cas d'usage non-couverts (encore)

| Cas | Status | Issue tracker |
|---|---|---|
| GitHub OAuth push direct (au lieu de download .zip) | 🟡 prévu | [#4](https://github.com/jdvot/cordee-ia/issues/4) |
| Mode express 3 questions (vs 7 actuellement) | 🟡 prévu | [#1](https://github.com/jdvot/cordee-ia/issues/1) |
| Templates spécialisés par stack (T3, Nx, FastAPI) | 🟡 prévu | [#5](https://github.com/jdvot/cordee-ia/issues/5) |
| CLI alternative `npx create-cordee-ia` | 🟡 prévu | [#6](https://github.com/jdvot/cordee-ia/issues/6) |
| i18n EN (FR par défaut) | 🟡 prévu | [#10](https://github.com/jdvot/cordee-ia/issues/10) |
| Live preview design system pendant le questionnaire | 🟡 prévu | [#2](https://github.com/jdvot/cordee-ia/issues/2) |

Vote pour les features que tu veux en priorité en mettant un 👍 sur l'issue correspondante.

---

## Quel cas est ton cas ?

Pose-toi 2 questions :

1. **Tu démarres un projet from scratch ou tu en as déjà un ?**
   - From scratch → mode greenfield (cas 1, 4, 8)
   - Existant → mode overlay (cas 2, 6, 9)

2. **Tu codes seul ou avec une équipe ?**
   - Seul → tu peux improviser la config (cas 1, 4, 8)
   - Équipe → standardiser via template (cas 5, 7), ou onboarder propre (cas 6)

Si tu as encore un doute, [ouvre une discussion](https://github.com/jdvot/cordee-ia/discussions) — on t'oriente.
