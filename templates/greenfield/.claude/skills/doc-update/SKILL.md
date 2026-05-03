---
name: doc-update
description: Scans the repo for stale documentation — version mismatches, outdated commands, dead links, removed APIs still referenced. Lists 5 fixes to apply.
---

# /doc-update

Finds the documentation drift before a user does.

## What it does

1. Reads `package.json` / `pyproject.toml` to know the current version, deps, and scripts.
2. Greps `README.md`, `CHANGELOG.md`, `docs/`, `*.md` for:
   - Version strings (e.g. README mentions `v1.x` while package is at `v2.x`).
   - Commands / scripts referenced but no longer in the manifest.
   - Removed or renamed deps.
   - Hardcoded URLs (broken with `curl -I` for the suspicious ones).
   - References to files that no longer exist (`grep` then `test -f`).
3. Produces a ranked list of 5 fixes — file:line, what's stale, the suggested replacement.
4. Optionally hands off to `doc-writer` to apply them.

## When to use

- Before a release, as a final hygiene pass.
- After a major refactor (renamed module, removed feature, changed CLI flags).
- Quarterly, as scheduled tech-debt work.
- Before publishing a new README to product hunt / HN.

## When NOT to use

- Project < 1 month old — there's barely any doc to drift yet.
- Mid-feature with the doc intentionally in flux.
- Auto-generated API reference pages — they regenerate from source, no value to scan.

## Gotchas

- **Link-check is slow and rate-limited** — `curl -I` against 50+ URLs hits some hosts' rate limits. The skill checks suspicious links only (those matching `localhost`, `staging.`, `WIP`, or 6+ months in CHANGELOG context). For full link audit, use `lychee` or `markdown-link-check` instead.
- **False positives on intentional version pins** — a doc referencing "Next.js 14 LTS" by design will be flagged as stale once you bump to 16. Use a `<!-- doc-update: ignore -->` HTML comment to silence.
- **`docs/` may be a published site** — Mintlify, Docusaurus, MkDocs may have their own validation. The skill does not run their build.
- **`--apply` rewrites markdown** — `doc-writer` may reformat surrounding text (line breaks, list markers). Review the diff before committing.
- **Dead-link checking respects `.gitignore`** — but NOT `.docignore`. If you have draft docs not for publication, exclude them via `--exclude`.

## Inputs needed

- Optional: paths to include (default: README + docs/ + *.md at root).
- Optional: `--apply` flag to spawn `doc-writer` and execute the top 5 fixes.

## Output

A markdown report with each finding as a ticket-shaped entry: title, file:line, current vs expected, effort estimate (S / M / L).
