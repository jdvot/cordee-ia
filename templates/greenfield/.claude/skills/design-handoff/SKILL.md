---
name: design-handoff
description: Receive a Claude Design handoff bundle and scaffold the corresponding Next.js + Tailwind + Shadcn implementation. Bridges Claude Design output to production code.
---

# /design-handoff

Takes a Claude Design export and produces a runnable Next.js scaffold.

## What it does

1. Reads the handoff bundle (HTML export, design tokens, component descriptions) from a path you provide.
2. Reads the project's `DESIGN.md` to align tokens and components.
3. Generates:
   - `tailwind.config.ts` with extracted design tokens.
   - `app/globals.css` with CSS variables.
   - Shadcn UI components matching the design system.
   - One reference page (e.g. landing) implementing the Claude Design layout.
   - Framer Motion micro-interactions for any animations specified.
4. Returns a punch list of pieces left manual.

## When to use

- Right after a Claude Design session ends with "Handoff to Claude Code".
- Re-running after design system changes (incremental update — diff-based).
- When migrating a static design from another tool to a Claude Code stack.

## When NOT to use

- You haven't run Claude Design yet — go there first.
- You want pixel-perfect Figma → code: use a Figma → code MCP instead. This skill is opinionated about Tailwind + Shadcn semantics, not pixel fidelity.
- The project uses a non-Tailwind CSS strategy (CSS Modules, Vanilla Extract, styled-components) — the generator will not adapt.

## Gotchas

- **Token mapping is best-effort** — Claude Design exports semantic tokens (`--color-accent`), Tailwind expects utility scales (`bg-amber-500`). The skill maps, but expect to review one or two values per re-run.
- **Re-runs overwrite components by default** — if you customized `components/ui/button.tsx` after first run, your changes are lost on re-run. Pass `--diff-only` or commit before re-running.
- **Framer Motion is opinionated** — the generator uses `motion/react` v12 with sensible defaults. If your project uses Motion One or another animation lib, edit the skill body.
- **Does NOT touch your routes** — only `app/(handoff)/` is created. Wiring to your existing app router is manual.
- **Shadcn version drift** — generated components target the current Shadcn registry. Older Shadcn projects may need `npx shadcn migrate` first.

## Inputs needed

- Path to the handoff bundle (`./handoff.zip` or a folder).
- Optional: target output dir (default `app/(handoff)/`).
- Optional: `--diff-only` flag to preserve manual edits.

## Output

- Tailwind config + globals patched.
- `components/ui/*` Shadcn components added or updated.
- One reference page generated, ready to `pnpm dev`.
- A `HANDOFF_PUNCH_LIST.md` listing pieces that need human touch (icons, asset paths, content copy).

## Stack assumed

- Next.js 16 App Router.
- Tailwind CSS v4.
- Shadcn UI (latest registry).
- Framer Motion 12.
- TypeScript strict.

If your project differs, edit this skill's body before invoking.
