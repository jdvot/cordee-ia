---
description: Coding standards for any TypeScript / Python project under this workspace
alwaysApply: true
---

# Coding Standards (generic)

## TypeScript

- Strict mode on. No `any`, no `as unknown as X`. If it can be typed, type it.
- Prefer `type` for primitives + unions, `interface` for object shapes that may be extended.
- React Server Components by default in Next.js — `"use client"` only when you actually need state/events.
- Never edit generated files (Orval, Prisma client, OpenAPI types). Regenerate instead.

## Python

- Black + Ruff for formatting + linting (run via `ruff format && ruff check --fix`).
- Type hints everywhere. `mypy --strict` if the project uses mypy.
- Async by default for I/O (`asyncio`, `httpx`, `asyncpg`).

## Cross-language

- One responsibility per file. If a file > 400 lines, ask: should this split?
- No premature abstraction. Three similar lines beats a wrong helper.
- No comments that say WHAT the code does (the code does that). Only WHY when non-obvious.
- No `// TODO` without an owner + ticket reference.

## Don't

- Add error handling for impossible cases (trust internal callers; validate at system boundaries only).
- Add backwards-compatibility shims if you can change the caller too.
- Pre-emptively design for hypothetical future needs.
