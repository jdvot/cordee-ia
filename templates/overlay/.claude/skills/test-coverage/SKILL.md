---
name: test-coverage
description: Runs the project test suite with coverage, identifies files below 80% line coverage, and proposes the 3 highest-leverage tests to add.
---

# /test-coverage

Surfaces the coverage gap and points to the next 3 tests worth writing.

## What it does

1. Detects the test runner (Vitest, Jest, pytest, go test) from manifests / config.
2. Runs the suite with coverage flags (`--coverage` / `pytest --cov`).
3. Parses the coverage report (lcov, coverage.json, or junit-xml).
4. Lists files below 80% line coverage, sorted by **uncovered LOC × call frequency** (heuristic: import count or routes touched).
5. For the top 3 files, reads the source and proposes one concrete test per file — name, arrange, assert sketch.
6. Optionally drafts the test file via the `test-writer` agent.

## When to use

- Before opening a release branch, to spot blind zones.
- After a refactor, to confirm coverage didn't drop silently.
- When onboarding to a new repo, as a map of risk.
- Before quoting a "harden the test suite" mission to a client.

## When NOT to use

- The codebase has no test suite — first install one (Vitest / pytest), then run this.
- Coverage is gated by feature flags and the project ships behind them — flag-testing matters more than line coverage.
- The project is exploratory / spike code that will be deleted — skip.

## Gotchas

- **80% line coverage ≠ correctness** — a fully covered file with bad assertions still ships bugs. Use this to find blind spots, not to certify safety.
- **Uncovered "import-only" lines inflate misses** — files re-exporting other modules look uncovered but execute fine. Configure your runner to exclude `index.ts` barrels.
- **Branch coverage > line coverage** — a 90% line / 40% branch file is more dangerous than the inverse. The skill reports both when available; weight branches.
- **Generated files skew metrics** — Prisma client, OpenAPI types, Tailwind classes. Add to your runner's `coverage.exclude` glob.
- **Slow suites discourage iteration** — if `pnpm test --coverage` takes > 2 min, the skill's value drops because devs won't re-run after each test added. Consider sharding before coverage.

## Inputs needed

- Optional: coverage threshold (default 80%).
- Optional: paths to include / exclude.
- Optional: `--draft` flag to auto-spawn `test-writer` for the top 3 files.

## Output

A ranked list of files with current %, missing branches, and the 3 prioritized test sketches. Plus the raw coverage summary.
