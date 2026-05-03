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

## Go

- `go fmt ./...` + `golangci-lint run` before commit.
- Errors are values: return `error` explicitly, never `panic` outside `main` or `init`.
- Small interfaces at the consumer side (accept interfaces, return structs).
- Context first arg on any function that does I/O or can be cancelled.

## Rust

- `cargo fmt && cargo clippy -- -D warnings` before commit.
- Prefer `Result<T, E>` over `unwrap()`. `expect()` only with a message that explains the invariant.
- Avoid `unsafe` unless wrapping a clearly-marked FFI boundary with a safety comment.
- Lifetimes elided where the compiler accepts it; explicit only when ambiguous.

## Other stacks (Vue, SvelteKit, Astro, Remix, Hono, Express, Django, Flask, NestJS)

- Use the framework's own conventions and folder layout — do not reinvent them.
- Keep server vs client boundaries explicit (RSC, `+page.server.ts`, Astro islands, etc.).
- Validate at request boundaries with the ecosystem's standard (Zod, Pydantic, valibot, class-validator).

## Cross-language

- One responsibility per file. If a file > 400 lines, ask: should this split?
- No premature abstraction. Three similar lines beats a wrong helper.
- No comments that say WHAT the code does (the code does that). Only WHY when non-obvious.
- No `// TODO` without an owner + ticket reference.

## Don't

- Add error handling for impossible cases (trust internal callers; validate at system boundaries only).
- Add backwards-compatibility shims if you can change the caller too.
- Pre-emptively design for hypothetical future needs.

## Anti-patterns

- **`any` / `as unknown as X`** — if it can be typed, type it. Cast escapes the compiler.
- **God components / god files** — if a single file holds routing + state + UI + data fetching, split.
- **Re-implementing standard library** — `Array.prototype.groupBy`, `Object.groupBy`, `structuredClone`, `Promise.allSettled` exist. Use them.
- **Magic numbers / strings without a constant** — `if (status === 3)` is unreadable. Name it.
- **Catch-and-rethrow without handling** — adds nothing, hides the stack trace. Either handle or don't catch.
- **`useEffect` for derived state** — derive from existing state, do not sync via effect.
- **Mutating props or function arguments** — return new values, never reassign inputs.
- **Comments duplicating code** — `// increment counter` above `counter++` — delete.
- **Premature memoization** — `useMemo` / `useCallback` everywhere "for perf". Profile first.
- **Catch-all `try/catch` around an entire function** — reduces the catch to "something went wrong". Scope tight.
