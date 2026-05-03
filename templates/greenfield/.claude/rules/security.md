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

## OWASP Top 10 mapping (2021 / 2026 refresh)

Each risk → where it usually shows up in our stack → the rule that prevents it.

| OWASP risk | Where it bites in TS / Python web apps | Rule / control |
|---|---|---|
| **A01 Broken Access Control** | Missing role check on Next.js Server Action / NestJS controller / FastAPI route | Centralize auth in middleware; deny-by-default on every route handler |
| **A02 Cryptographic Failures** | `md5` / `sha1` for passwords; HTTP in prod; no TLS to internal services | Argon2id for passwords; HTTPS only; mTLS for internal hops |
| **A03 Injection (SQL / NoSQL / LDAP / OS)** | String concatenation into SQL; `eval()`; `child_process` with user input | Parameterized queries; never `eval`; spawn with arg array, never shell string |
| **A04 Insecure Design** | "We'll add rate-limiting later"; no abuse-case modeling | Threat-model per feature; add rate-limit + audit log from day 1 |
| **A05 Security Misconfiguration** | Default credentials shipped; verbose stack traces in prod; missing security headers | CSP / HSTS / X-Content-Type-Options on every response; disable verbose errors in prod |
| **A06 Vulnerable & Outdated Components** | Stale `lodash`, `axios`, `node-fetch` with known CVEs | `npm audit` / `pip-audit` in CI; auto-PR via Renovate / Dependabot |
| **A07 Identification & Auth Failures** | Roll-your-own JWT; weak password rules; no MFA | Use Better Auth / Auth.js / Clerk / Auth0 — never roll your own session |
| **A08 Software & Data Integrity Failures** | Unsigned deps; CI fetches from untrusted mirror; no SLSA attestation | Pin dep checksums in lockfile; signed git tags for releases |
| **A09 Security Logging & Monitoring Failures** | No logs on auth events; logs leak PII; no alert on spike | Audit-log every auth event; redact PII fields; Sentry / Datadog with anomaly alerts |
| **A10 Server-Side Request Forgery (SSRF)** | Server fetches arbitrary URLs from user input (image proxy, webhook tester) | Allowlist of domains; deny private IP ranges (`10.*`, `192.168.*`, `169.254.*`, `localhost`) |

## Quick controls per surface

- **XSS**: framework-default escaping (React, Jinja, Vue); `dangerouslySetInnerHTML` only on sanitized HTML (DOMPurify).
- **SQL injection**: ORMs with parameterized queries (Prisma, SQLAlchemy, Drizzle); raw SQL only via `$queryRaw` with `Prisma.sql`.
- **CSRF**: SameSite=Lax cookies as default; explicit CSRF tokens for cross-origin POST.
- **Auth**: standard libraries (Better Auth, Auth.js, Clerk, Auth0). Never roll your own session, JWT signing, or password hashing.
