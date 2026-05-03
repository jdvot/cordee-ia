# Politique de sécurité

## Versions supportées

Seule la version `main` reçoit des correctifs de sécurité actifs. Pas de back-port sur des branches anciennes.

| Version | Supportée |
| ------- | --------- |
| `main`  | ✅        |
| autres  | ❌        |

## Signaler une vulnérabilité

**Ne pas ouvrir d'issue publique pour une faille de sécurité.**

Envoie un email à : **julien.dvt57@gmail.com**

Inclure :
- Description claire de la faille
- Étapes de reproduction
- Impact estimé (qui est touché, à quel point)
- Tu as un correctif proposé ? Bonus.

**Réponse sous 72h ouvrées.** Patch critique en moins de 7 jours si vulnérabilité confirmée.

## Surface d'attaque

Cordée.IA est une app Next.js stateless. Surface limitée :

- **`/api/generate`** : valide tout input via `zod`, lit uniquement `templates/` (pas d'arbitrary file read), produit un `.zip` éphémère en mémoire. Pas de persistence, pas de DB, pas d'auth.
- **Templates générés** : les fichiers `.claude/hooks/*.sh` et `install.sh` sont exécutables côté **utilisateur final** uniquement (jamais côté serveur).
- **MCPs** : les configs `.mcp.json` ne contiennent **aucun token** — l'OAuth se fait localement chez l'utilisateur.

## Modèle de menace connu

| Vecteur | Sévérité | Mitigation |
|---|---|---|
| Path traversal via `projectName` | 🟢 bas | Regex `/^[a-zA-Z0-9._-]+$/` côté API |
| Prompt injection via templates community | 🟡 moyen | Pas encore de templates community — quand on les ouvrira, signature sigstore obligatoire ([#9](https://github.com/jdvot/cordee-ia/issues/9)) |
| Vercel function timeout / DoS | 🟢 bas | Vercel limit 300s par défaut ; un .zip prend < 2s |
| Vol de credentials via `pre-edit-secrets.sh` faille | 🟢 bas | Hook fail-soft sans `jq` ; si `jq` absent, l'utilisateur garde la responsabilité |

## Politique de divulgation

- **90 jours** pour patcher avant divulgation publique (standard Project Zero).
- **Si la faille est exploitée activement** : patch immédiat + advisory GitHub + CVE si applicable.
- Le rapporteur est crédité (sauf demande contraire) dans le commit + advisory.

## Ce que tu trouveras **jamais** dans ce repo

- Token / API key hardcodé (le hook `pre-edit-secrets.sh` bloque `.env*`, `*.key`, `credentials.json`)
- Données client / personnelles (le repo est public, on ne committe rien d'identifiable)
- Backdoor ou télémétrie cachée (lis le code de `app/api/generate/route.ts`, c'est 387 lignes lisibles)

## Audit communautaire bienvenu

Si tu as audité le code et trouvé un comportement louche : ouvre une discussion ou écris-nous. On préfère une critique honnête à un trou caché.
