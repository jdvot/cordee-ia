---
name: release
description: Cuts a new release — bump version (semver), update CHANGELOG, tag git, build artifacts, publish (npm / Docker / GitHub release). Single command, audited steps.
---

# /release

Walks the project through a clean, reproducible release.

## What it does

1. Verifies the working tree is clean and on the release branch.
2. Reads `package.json` / `pyproject.toml` / `Cargo.toml` for the current version.
3. Asks for the bump type (patch / minor / major) or accepts a flag.
4. Updates the version in the manifest and the lockfile.
5. Updates `CHANGELOG.md` — moves the `[Unreleased]` block under a new dated heading.
6. Creates a release commit and a signed git tag (`v<version>`).
7. Builds the artifact (npm package, Docker image, binary).
8. Publishes — `npm publish` / `docker push` / `gh release create` — depending on what's configured.
9. Pushes the tag to the remote.

## When to use

- You merged the last PR for the milestone and the staging build is green.
- You want a reproducible release sequence rather than a manual checklist.
- A non-author needs to cut a release and you want guardrails.

## When NOT to use

- The CI/CD pipeline already releases automatically on merge — let it. Don't double-release.
- You're mid-feature; cut the feature branch first.
- The repo has no `CHANGELOG.md` strategy — set Keep a Changelog up first, then automate.

## Gotchas

- **Tag signing requires GPG configured** — if `git config commit.gpgsign true` and no key, the step fails silently on some platforms. Test once with `--dry-run`.
- **`pnpm publish` vs `npm publish`** — the skill detects the package manager from the lockfile but custom registries (`@scope:registry`) need manual `.npmrc`.
- **Docker tags** — by default tags both `<version>` and `latest`. If you ship a beta channel, pass `--dist-tag next` to avoid clobbering `latest` for users on stable.
- **Lockfile drift** — bumping `package.json` without running the install step leaves the lockfile stale and the published artifact may differ from what you tested. The skill installs, but if you cancelled, re-run.
- **No rollback** — once published to npm, you have a 72h unpublish window only. Use `npm deprecate` instead. The skill won't undo a publish for you.

## Inputs needed

- Bump type (patch / minor / major).
- Optional: dist tag (`latest`, `next`, `beta`).
- Optional: `--dry-run` flag to preview the changelog and tag without publishing.

## Output

A summary of: new version, tag, registry URL, GitHub release URL, and the diff applied to the changelog.
