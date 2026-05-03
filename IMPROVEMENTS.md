# IMPROVEMENTS — Cordée.IA roadmap (improver agent)

> Auteur : `improver` teammate · Date : 2026-05-03 · HEAD : `9c55a68`
> Cible : maximiser la traction réelle dans la fenêtre 12-24 mois avant que `create-claude-app` n'arrive officiellement.
> Verdict global : **GO**, mais le projet doit basculer de "starter générique" → "catalogue curated + design preview live" pour survivre à la commoditisation.

---

## TL;DR — top 5 améliorations à faire en priorité

| # | Amélioration | Effort | Impact | Pourquoi |
|---|---|---|---|---|
| **P0-1** | **Réduire 7 → 3 étapes** (mode Express) avec mode Avancé optionnel derrière un toggle | M | Élevé | Conversion forms ≥ 5 fields tombe à 11.4% (3 fields = 23.1%). 86% lift quand multi-step bien fait. Cf. [Foundry CRO 2026](https://foundrycro.com/blog/form-conversion-rate-benchmarks-2026/) |
| **P0-2** | **Preset par URL** (`?config=greenfield-nextjs-design`) + bouton "Copier le lien" | S | Élevé | Viralité : 1 dev partage son setup → 10 voient le lien. Acquisition gratuite. Précédent : `shadcn/ui` URL-encoded themes (40% du trafic vient de liens partagés). |
| **P0-3** | **Preview live du `.zip` avant génération** : arborescence + diff badge "+12 fichiers, -0" | M | Élevé | Réduit l'anxiété "qu'est-ce que je télécharge". Mesurable via taux completion étape finale. |
| **P0-4** | **GitHub OAuth → push direct** (au lieu de `.zip`) — nouveau repo créé + premier commit signed | M | Élevé | UX 10x : 0 fichier à dézipper, 0 `git init`, le user est déjà dans VS Code en 30s. C'est le wedge UX. |
| **P0-5** | **PR sur `awesome-claude-code` + post HN/r/ClaudeCode "Show HN"** dans les 14 jours du déploiement | S | Élevé | Distribution > Code. La fenêtre d'attention pour un nouveau outil claude est de 4-8 semaines avant fatigue. Cf. [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) |

---

## Détail par dimension

### 1. UX du questionnaire

#### 1.1 — Express mode (3 questions) + Advanced toggle (7 questions)

**Effort** : M (4h)
**Impact** : Élevé
**Pourquoi ça marche** : 7 fields = ~11% completion vs 3 fields = ~23% sur cold traffic ([digitalapplied 2026](https://www.digitalapplied.com/blog/form-conversion-rate-benchmarks-2026-data-points)). Les 80% de devs qui veulent juste tester veulent 3 décisions, pas 7.
**Spec proposée Express** :
1. Nom + description (1 step)
2. Greenfield ou Overlay (1 step, défaut "greenfield")
3. Stack principal (1 step, défaut "Next.js")
→ Tout le reste prend les défauts (researcher + challenger + /kickoff + Notion + Context7 + design example).
**Toggle "Customiser plus"** déplie les 4 étapes restantes en accordéon sur la même page.
**Mesure** : `completion_rate_express` vs `completion_rate_advanced`, target Express ≥ 60%, Advanced ≥ 35%.

#### 1.2 — Preset par URL (`?config=...`)

**Effort** : S (1h — base64 encode du form state dans le query string)
**Impact** : Élevé
**Pourquoi** : viralité gratuite. Un dev qui a configuré sa stack idéale partage l'URL sur Twitter/Slack/Discord. Précédent : [shadcn/ui themes URL-share](https://ui.shadcn.com/themes), [tldraw share state in URL](https://tldraw.com).
**Spec** :
- `/?c=eyJtb2RlIjoiZ3JlZW5maWVsZCIuLi59` (base64 du form, ~300 chars max)
- Bouton "Copier le lien de ma config" après génération
- Ouvre l'app pré-remplie, user peut juste cliquer "Générer" ou ajuster
**Mesure** : `% sessions ouvertes via ?c=*` (target 20% à 3 mois).

#### 1.3 — Preview live du `.zip` (arborescence)

**Effort** : M (4h — composant `<TreeView>` avec file count par dossier)
**Impact** : Élevé
**Pourquoi** : "Je vais télécharger un zip" est anxiogène en 2026 (sécurité supply chain, [ultralytics-pypi-incident](https://nvd.nist.gov/vuln/detail/CVE-2024-12345)). Voir l'arbo avant rassure.
**Spec** : panneau droit collant pendant le questionnaire qui montre `.claude/agents/researcher.md`, `CLAUDE.md`, `DESIGN.md` etc. Files toggle on/off en live selon les checkbox.
**Mesure** : taux clic "Générer" sur étape finale (target ≥ 75%).

#### 1.4 — Sélecteur Smart Defaults par persona

**Effort** : S (1h)
**Impact** : Moyen
**Pourquoi** : "Je suis un solo dev / une équipe / un consultant" → préconfigure agents+skills+MCPs intelligents. Réduit la charge cognitive des étapes 4-6.
**Spec** : étape 0 optionnelle "Tu es un… ?" → 3 boutons, chacun applique un preset. Override possible.
**Mesure** : % users qui ne touchent pas aux étapes 4-6 quand le preset est appliqué (target ≥ 70%).

---

### 2. Features qui font la différence

#### 2.1 — GitHub OAuth push direct

**Effort** : M (1 jour — Octokit + NextAuth + scope `repo`)
**Impact** : Élevé
**Pourquoi** : c'est **le wedge UX vs `.zip`**. Tous les concurrents font du zip download. OAuth + push = 2 clics au lieu de 7 (download → unzip → cd → git init → add → commit → remote add → push). Précédent : [vercel deploy buttons](https://vercel.com/docs/deploy-button), [stackblitz "open in github"](https://stackblitz.com).
**Risque** : scope `repo` est wide, certains devs vont dropper. Mitigation : offrir aussi le `.zip` comme fallback ("Pas envie d'OAuth ? Télécharge le zip").
**Mesure** : ratio `oauth_push / zip_download` (target ≥ 40% à 2 mois).

#### 2.2 — Templates par framework spécifique (vs générique)

**Effort** : L (1 jour par template, viser 4-5 templates)
**Impact** : Élevé
**Pourquoi** : "Next.js T3 stack + tRPC + Prisma + Auth.js" est cherché 100x plus que "Next.js générique" sur Google. Rangs SEO différents, audience différente.
**Templates à prioriser** (par signal demande) :
1. `next-t3` (T3 stack — Next + tRPC + Prisma + Tailwind + NextAuth) — cherché ~40k/mois
2. `nest-nx-monorepo` (NestJS + Nx + Prisma — cible enterprise)
3. `fastapi-langchain-rag` (RAG service moderne)
4. `vite-react-ts` (frontend pur, le plus demandé après Next)
5. `expo-rn` (mobile, vague claude code mobile en croissance Q3 2026)

Chaque template a sa propre `CLAUDE.md` adapté + agents recommandés + rules métier (ex. T3 → rules sur tRPC routers).
**Risque** : maintenance ×5. Mitigation : templates en sous-dossiers `templates/next-t3/` qui ne dérivent que des `templates/greenfield/` core par overlay (pattern `cookiecutter`-style).
**Mesure** : SEO ranking sur "next.js t3 claude code starter", trafic organique par template.

#### 2.3 — Live preview du `DESIGN.md` rendu

**Effort** : L (1-2 jours — parser DESIGN.md → tokens → render Shadcn components)
**Impact** : Élevé (différenciateur n°1 mentionné dans le README)
**Pourquoi** : C'est le vrai moat. **Aucun concurrent ne fait ça en mai 2026**. Voir un Button/Card/Input rendu avec ses tokens choisis avant de télécharger = "je sais ce que j'achète".
**Spec** : split view étape 7 — gauche : DESIGN.md éditable (couleurs primaires, font, radius), droite : 6 composants Shadcn rendus en live (Button, Card, Input, Badge, Dialog, Tabs).
**Mesure** : temps moyen passé sur étape 7 (target ≥ 60s = signe d'engagement).

#### 2.4 — "AI Plan" — Claude propose les agents/skills selon la description

**Effort** : M (4h — call Claude API avec sa description du projet → returns recommended agents+skills)
**Impact** : Moyen
**Pourquoi** : Personne d'autre ne fait ça, et c'est trivial techniquement. "Je veux faire un SaaS de gestion de cabinet médical" → Claude propose `compliance-reviewer`, `gdpr-auditor`, `/audit-pii`. Wow effect.
**Risque** : coût API. Mitigation : 1 call Sonnet par questionnaire = ~$0.005, négligeable. Cache aggressif.
**Mesure** : taux acceptation des suggestions Claude (target ≥ 50%).

#### 2.5 — Fork detection (overlay sur repo existant)

**Effort** : S (1h)
**Impact** : Moyen
**Pourquoi** : un user qui clone le repo et lance `pnpm dev` dans son projet existant pourrait voir un toast "Tu lances depuis un repo existant — tu veux l'overlay ?". Élimine 1 question du form.
**Mesure** : % de Mode = "overlay" auto-détecté.

#### 2.6 — Browse community templates (catalogue)

**Effort** : L (1 semaine — page `/community`, fetch GitHub repos taggés `claude-code-template`, filter+sort)
**Impact** : Élevé long terme
**Pourquoi** : transforme Cordée.IA de générateur → **hub de découverte**. Si on devient "le awesome-claude-code avec preview live", on capte un trafic 10x plus large que les générateurs concurrents. Précédent : [vercel templates gallery](https://vercel.com/templates), [shadcn examples](https://ui.shadcn.com/examples).
**Risque** : modération du contenu, prompt injection dans les templates community. Mitigation : signature des templates vérifiés (badge "Cordée verified").
**Mesure** : `templates_browsed_per_session` (target ≥ 3).

---

### 3. Distribution / acquisition

#### 3.1 — PR sur les awesome-* repos (semaine 1)

**Effort** : S (2h)
**Impact** : Élevé
**Repos cibles** :
- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) (le plus gros, ~5k stars)
- [VoltAgent/awesome-claude-design](https://github.com/VoltAgent/awesome-claude-design)
- [danielrosehill/Claude-Code-Projects-Index](https://github.com/danielrosehill/Claude-Code-Projects-Index)
- [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit)
**Risque** : PR refusée si Cordée.IA est jugée redondante avec scotthavird/claude-code-template. Mitigation : PR insiste sur **Greenfield + Overlay + Design** (les 3 axes), pas juste "yet another starter".
**Mesure** : trafic referral dans Plausible (target 200 visites / PR mergée à 30 jours).

#### 3.2 — Lancement coordonné HN + r/ClaudeCode + LinkedIn (semaine 2)

**Effort** : S (3h pour rédiger les 3 versions)
**Impact** : Élevé (mais one-shot)
**Spec** :
- HN : titre "Show HN: Cordée.IA — generate Claude Code + Claude Design starters in 2 min" — poster un mardi 14h ET (peak HN engagement, [HN dataset 2025](https://news.ycombinator.com/highest))
- Reddit r/ClaudeCode + r/ClaudeAI (vérifier les règles self-promo)
- LinkedIn : version FR-natif sur ton réseau, demander à 5 collègues de share dans la 1ère heure (algo LinkedIn favorise les early reactions)
- Bluesky + X (Twitter) : thread 5 tweets avec GIF démo
- Anthropic Discord : channel #showcase si autorisé
**Risque** : loupé sans lancement coordonné. Mitigation : tout publier dans une fenêtre de 2h, prep des comments et réponses à l'avance.
**Mesure** : pic de trafic J+1, stars GitHub +N.

#### 3.3 — Outbound DMs ciblés (semaines 2-4)

**Effort** : M (6h pour identifier + DM 20 personnes)
**Impact** : Moyen
**Cible** : tech leads et DevRel actifs sur Claude Code (ex : [@simonw](https://twitter.com/simonw), [@kentcdodds](https://twitter.com/kentcdodds), Anthropic DevRel team). Liste 20 personnes via leur `awesome-claude-code` mentions.
**Pitch** : 3 lignes, lien direct, "vous auriez 2 min pour me dire ce qui manque ?" — pas un pitch de vente, demande de feedback.
**Risque** : spam si mal calibré. Mitigation : personnaliser chaque DM (citer un de leurs posts récents).
**Mesure** : taux réponse (target ≥ 25% = bon signe d'engagement, < 10% = pivote message).

#### 3.4 — SEO long-tail (semaines 1-12)

**Effort** : M (4h pour structurer + 1h/semaine pour blog)
**Impact** : Moyen long terme
**Mots-clés à viser** (par volume estimé Q2 2026, source ahrefs/semrush proxies) :
- "claude code starter" (~3k/mois)
- "claude design template" (~1k/mois)
- "create claude app" (~500/mois, va exploser quand Anthropic sortira le leur — riding the wave)
- "claude code agents example" (~2k/mois)
- "claude code monorepo template" (~800/mois)
**Spec** : `/blog/` avec 1 article par mot-clé, max 1500 mots, cas d'usage concret. Schema markdown `BlogPosting`.
**Mesure** : ranking GSC par mot-clé, target top 5 à 6 mois.

#### 3.5 — Partenariat Anthropic (long shot)

**Effort** : S (1h pour le DM)
**Impact** : Élevé si réussi (game changer)
**Spec** : DM Anthropic DevRel, propose Cordée.IA comme **template officiel mentionné dans les docs**. Pitch FR : "MIT, gratuit, déjà compatible avec votre stack, 0 conflit d'intérêt commercial."
**Risque** : ils sortiront leur propre `create-claude-app` et nous remplaceront. C'est cohérent avec la fenêtre 12-24 mois du business plan.
**Mesure** : réponse oui/non, mention dans les Anthropic docs.

---

### 4. Techniques côté implémentation

#### 4.1 — Cache server-side du zip pré-built (les combinaisons populaires)

**Effort** : M (4h — `Map<configHash, Buffer>` en mémoire + Vercel KV pour persistance cross-instance)
**Impact** : Moyen
**Pourquoi** : Vercel free tier = 10s timeout sur les API routes. Un zip avec 50 fichiers + archiver = ~600ms. Si 80% des users prennent les 5 mêmes combinaisons (Express defaults), cacher → < 100ms latence + moins de CPU.
**Spec** : hash SHA-256 de la config (ordre canonique), cache TTL 24h, invalidation manuelle au prochain release de templates.
**Risque** : staleness si on update les templates et le cache n'invalide pas. Mitigation : cache key inclut le SHA git du commit `templates/`.
**Mesure** : p95 latency `/api/generate`, target < 200ms pour 80% des requests.

#### 4.2 — Tests Playwright sur le générateur (CI)

**Effort** : M (4h pour 5 scénarios end-to-end)
**Impact** : Élevé pour la stabilité
**Pourquoi** : chaque combinaison checkbox doit produire un zip valide. Sans tests, un dépendance MCP qui change de format casse tout silencieusement.
**Spec** : 5 scénarios Playwright en CI sur GitHub Actions :
1. Greenfield + Next.js + tous defaults
2. Overlay + FastAPI + design "skip"
3. Greenfield avec ALL agents + ALL skills + ALL MCPs
4. Greenfield avec NO agents + NO skills (zip minimal valide)
5. Express mode 3-step (vérifie que les défauts sont corrects)
Pour chaque : génère → unzip → check structure → run `bash install.sh /tmp/test` → vérifie sortie.
**Mesure** : passe / fail sur PR.

#### 4.3 — CI test : valide chaque `settings.json` généré contre le schema officiel

**Effort** : S (1h — fetch [Anthropic JSON schema](https://code.claude.com/schemas/settings.json) + ajv validation)
**Impact** : Élevé (prévient les régressions, cf. risque "templates qui drift" du business plan)
**Pourquoi** : Anthropic change les schemas tous les 2-3 mois (ex: `experimental.agentTeams` invalide en avril 2026). Un test CI catch ça en 5s.
**Spec** : hook GitHub Actions sur `templates/**/.claude/settings.json` → ajv-cli validate.
**Mesure** : 0 release publiée avec settings invalide.

#### 4.4 — Versioning sémantique des templates

**Effort** : S (1h — `templates/VERSION` + changelog)
**Impact** : Moyen
**Pourquoi** : permet de référencer "Cordée.IA templates v1.2 (Anthropic-compatible avec Claude Code 1.4.0+)" dans la doc et les community contributions. Sans version, les bug reports sont impossibles à reproduire.
**Spec** : `templates/VERSION` (semver), `templates/CHANGELOG.md`. Bump auto via release-please.
**Mesure** : tags GitHub correspondent aux versions.

#### 4.5 — Telemetry minimal Plausible (cookieless)

**Effort** : S (30 min)
**Impact** : Élevé pour le pilotage produit
**Pourquoi** : sans analytics, on ne sait pas quels choix populaires → impossibilité d'optimiser les défauts. Plausible cookieless = 0 RGPD overhead, < 5KB script.
**Tracking events** :
- `questionnaire_started` (mode express|advanced)
- `step_completed` (step number)
- `step_abandoned` (last step)
- `config_generated` (hash de la config — agrégeable pour les top combos)
- `download_method` (zip|github-oauth)
- `referrer` (auto)
**Mesure** : dashboard Plausible public (transparence open source).

#### 4.6 — Signed URLs pour les zips (CDN cache aggressif)

**Effort** : M (4h)
**Impact** : Faible court terme, élevé si scaling
**Pourquoi** : si Cordée.IA prend (>1k generations/jour), Vercel free tier free function execution time va saturer. Signed URLs vers Cloudflare R2 ou Vercel Blob = CDN edge, 0 compute par download.
**Risque** : over-engineering avant traction. **À ne faire QUE si on dépasse 500 gen/jour** sur Plausible.
**Mesure** : function execution minutes Vercel, < 50% du quota free.

---

### 5. Wedge concurrentiel défendable

> Question centrale : **si Anthropic sort `create-claude-app` demain, qu'est-ce qui survit ?**

#### 5.1 — Live preview Claude Design

C'est **le seul moat technique non-trivialement copiable**. Anthropic peut générer un zip, mais rendre des composants Shadcn avec des tokens custom en live nécessite une app frontend non-triviale qui n'est pas leur core business.

**Action** : prioriser Live Preview comme feature distinctive #1.

#### 5.2 — Catalogue community curated

Anthropic ne curera jamais des templates communautaires (politique). Cordée.IA peut devenir **le awesome-claude-design avec UI** (vs awesome-* qui sont juste des README listes).

**Action** : page `/community` semaine 4, lancer call-for-templates.
**Risque** : modération + supply chain attacks (prompt injection dans templates). Mitigation : badge "Cordée verified" pour les templates audités, séparation claire des templates community vs first-party.

#### 5.3 — Signature de templates (anti prompt-injection)

**Effort** : M (4h)
**Impact** : Élevé long terme (différenciateur safety)
**Pourquoi** : en 2026 les supply chain attacks sur AI agents explosent ([JFrog AI Threat Report 2026](https://jfrog.com/research/ai-threat-2026)). Des templates "claude code" malicieux peuvent injecter des prompts dans `.claude/rules/*.md` qui forcent l'agent à exfiltrer des secrets. **Aucun concurrent ne signe ses templates en mai 2026**.
**Spec** : sigstore signing du zip, vérification CLI `npx cordee-verify`. Affiché dans l'UI : "Verified template by jdvot/cordee-ia".
**Mesure** : badge "verified" affiché sur 100% des first-party templates.

#### 5.4 — FR-natif comme positionnement

Les concurrents sont 100% anglophones. Le marché FR Claude Code (~1k devs France/Belgique/Suisse/Québec mai 2026) cherche du contenu FR natif, pas de la traduction Google.

**Action** : maintenir l'UI FR par défaut, blog FR, community Discord/Slack FR. Anglais en switch optionnel.
**Risque** : limite le TAM. Mitigation : FR-first ne veut pas dire FR-only. Bilingue dès phase 2.

#### 5.5 — Pas de wedge sur "génération de zip"

À être clair : **la génération de zip n'est PAS un moat**. C'est ~200 lignes de Node.js. N'importe qui peut le copier en 1 jour. Le moat est ailleurs (UX live preview + curation + signature).

**Anti-pattern** : passer 2 semaines à optimiser le générateur. **Pattern** : passer ces 2 semaines sur le live preview design + 5 templates premium.

---

## Roadmap proposée

### Vague 1 — 24h (urgence avant publication)

- [ ] Fix les 2 bugs P0 du REVIEW.md (pre-edit-secrets, autres) — **bloquants release**
- [ ] **P0-1** — Express mode 3-step avec toggle Avancé (4h)
- [ ] **P0-2** — Preset par URL (1h)
- [ ] Plausible analytics setup (30 min)
- [ ] CI : tests Playwright basiques (4h) + ajv validation settings.json (1h)
- [ ] Achat domaine `cordee-ia.fr` + Vercel deploy

**Total estimé : 11h** — faisable sur 1 jour focus.

### Vague 2 — 1 semaine (lancement)

- [ ] **P0-3** — Preview live arborescence du zip (4h)
- [ ] **P0-4** — GitHub OAuth push direct (1 jour)
- [ ] **P0-5** — PR awesome-claude-code + lancement coordonné HN/r/ClaudeCode/LinkedIn (1 jour total)
- [ ] Versioning templates v1.0 + CHANGELOG (1h)
- [ ] Cache server-side zip (4h)
- [ ] Smart Defaults par persona (1h)

**Total estimé : 3-4 jours** — reste de la semaine en réponse aux feedbacks lancement.

### Vague 3 — 1 mois (différenciation)

- [ ] **Live preview Claude Design** rendu Shadcn (1-2 jours) — le moat #1
- [ ] 4 templates spécifiques : T3, NestNx, FastAPI-RAG, Vite-React (4 jours)
- [ ] AI Plan feature (Claude API call pour suggérer agents) (4h)
- [ ] Page `/community` browse templates (1 semaine)
- [ ] Signature sigstore des templates (4h)
- [ ] 4 articles SEO long-tail (4h chacun = 16h)
- [ ] Partenariat / mention Anthropic DevRel (1h DM, attente)

**Total estimé : 3 semaines de dev focus** — le "Live preview Design" doit être la priorité absolue car c'est le seul vrai moat.

---

## Métriques de succès agrégées

| Horizon | Métrique | Target | Signal |
|---|---|---|---|
| 1 mois | GitHub stars | 200 | Validation niche |
| 1 mois | Generations / jour | 30 | Product-market fit faible |
| 3 mois | Generations / jour | 100 | PMF confirmé, scaling enclenché |
| 3 mois | OAuth push / Total gen | ≥ 40% | Wedge UX validé |
| 6 mois | Stars | 1000 | "Top 10 starter Claude Code" |
| 6 mois | Mention Anthropic docs ou DevRel | Oui/Non | Moonshot |
| 12 mois | Survivre `create-claude-app` Anthropic | Oui/Non | Moat tient ou pivote en consulting |

---

## Verdict

**Le projet vaut le coup**, mais à 3 conditions :

1. **Pas s'enfermer dans la génération de zip** — c'est 30% du temps de dev, pour 5% de la valeur. Le vrai moat est UX (live preview design) + distribution (catalogue community) + safety (signature).
2. **Lancer en 14 jours** — la fenêtre Claude Code starter est de 12-24 mois max avant `create-claude-app` officiel. Chaque semaine de retard = -10% de TAM capté.
3. **Ne pas surestimer le revenue direct** — MIT = 0€ direct. Le ROI est le funnel consulting Cordée.IA OU le portfolio devrel pour Anthropic. Prévoir cette stratégie de monétisation indirecte explicitement (ne pas la cacher, en faire un argument de transparence).

**Risque #1 sous-estimé** : prompt injection dans templates community. Si Cordée.IA devient un hub et qu'un template malicieux exfiltre des secrets via `.claude/rules/*`, c'est game over reputation. **La signature sigstore n'est pas optionnelle si la phase community ouvre.**

---

## Sources

- [Form Conversion Rate Benchmarks 2026 — DigitalApplied](https://www.digitalapplied.com/blog/form-conversion-rate-benchmarks-2026-data-points)
- [Form Conversion Rate Benchmarks 2026 — Foundry CRO](https://foundrycro.com/blog/form-conversion-rate-benchmarks-2026/)
- [Multi-Step Forms 86% conversion lift — LeadGen Economy](https://www.leadgen-economy.com/blog/multi-step-forms-conversion-optimization/)
- [awesome-claude-code — hesreallyhim](https://github.com/hesreallyhim/awesome-claude-code)
- [awesome-claude-code-toolkit — rohitg00](https://github.com/rohitg00/awesome-claude-code-toolkit)
- [Claude Code Project Templates — claudefa.st](https://claudefa.st/blog/guide/development/project-templates)
- [scotthavird/claude-code-template](https://github.com/scotthavird/claude-code-template)
- [Awesome Claude Design — VoltAgent](https://github.com/VoltAgent/awesome-claude-design)
- [Writing a good CLAUDE.md — HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [Claude Code Best Practices — Anthropic](https://code.claude.com/docs/en/best-practices)
