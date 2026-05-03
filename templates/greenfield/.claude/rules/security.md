---
description: Security baseline — secrets, data, dependencies
alwaysApply: true
---

# Security

## Secrets

- Never hardcode API keys, tokens, connection strings. Use env vars.
- Never commit `.env*`, `*.key`, `*.pem`, `credentials.json`, `secrets.json`.
- The `pre-edit-secrets.sh` hook blocks writes to these. Don't bypass it without reason.
- If you commit a secret by accident: rotate it immediately. Then `git filter-repo` to clean history.

## Dependencies

- No `npm install` of unknown packages. Check the source repo first.
- Run `npm audit` / `pip-audit` regularly.
- Pin major versions in production lockfiles.

## Data

- Validate all user input at system boundaries (API endpoints, webhook handlers).
- Parameterized queries always. Never concatenate user input into SQL.
- Logs: never log full PII, tokens, or passwords. Hash or redact.

## HTTPS only

- No HTTP in production configs.
- HSTS + secure cookies for browser clients.

## OWASP top 10

- XSS: sanitize / escape all user-rendered content.
- SQL injection: parameterized only.
- CSRF: tokens or SameSite cookies.
- Auth: standard libraries (Better Auth, Auth.js, Clerk, Auth0). Don't roll your own.
