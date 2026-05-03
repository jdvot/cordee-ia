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
   - `tailwind.config.ts` with extracted design tokens
   - `app/globals.css` with CSS variables
   - Shadcn UI components matching the design system
   - One reference page (e.g. landing) implementing the Claude Design layout
   - Framer Motion micro-interactions for any animations specified
4. Returns a punch list of pieces left manual.

## When to use

- Right after a Claude Design session ends with "Handoff to Claude Code".
- Re-running after design system changes (incremental update).

## When NOT to use

- You haven't run Claude Design yet — go there first.
- You want pixel-perfect Figma → code: use a Figma → code MCP instead, this skill is opinionated about Tailwind/Shadcn.

## Stack assumed

- Next.js 16 App Router
- Tailwind CSS v4
- Shadcn UI (latest)
- Framer Motion 12
- TypeScript strict

If your project differs, edit this skill's body before invoking.
