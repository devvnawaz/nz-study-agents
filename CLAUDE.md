# CLAUDE.md

Stable, long-term instructions for this project. (Day-to-day status lives in
PROJECT_STATE.md / TASKS.md; rationale in DECISIONS.md.)

## Project purpose

A directory website where Bangladeshi students select a New Zealand institute and
see its **authorized education agents in Bangladesh** — with contact details,
website, address, official source link, and a last-verified date. Goal: centralize
information that is otherwise scattered across each institute's own website.

## Stack

- Next.js 14, **Pages Router**, TypeScript (strict).
- Tailwind CSS 3.
- Supabase (PostgreSQL + RLS) for data; local JSON file-store for demo mode.
- Hosted on Vercel. ISR (`revalidate: 3600`, `fallback: 'blocking'`).
- Path alias `@/*` → `src/*`.

## Coding conventions

- TypeScript strict; share types from `src/lib/types.ts`.
- Reads go through `src/lib/data.ts` (never query Supabase directly from pages).
- Server-only modules (`store.ts` uses `fs`; `supabaseAdmin.ts` uses service key)
  must never be statically imported into client components — use API routes, dynamic
  import, or `import type` only.
- Keep components in `src/components/`, pages in `src/pages/`, API in `src/pages/api/`.
- Default to no comments unless the "why" is non-obvious. Prefer editing existing
  files over adding new ones. No speculative abstractions.
- Match existing Tailwind utility patterns and the `brand` / `nz` color tokens.

## Deployment rules

- Env vars are managed in the **Vercel dashboard by the user** — never commit them
  and never add/re-add them via tooling unless explicitly asked.
- Never commit `.env*` or `.data/` (already gitignored).
- The local machine is not linked to Vercel and has no Vercel CLI; do not assume it.
- File-store (`.data/store.json`) is dev-only and does NOT persist on Vercel —
  production data lives only in Supabase.
- After DB writes, public pages update on the next ISR revalidate (~60s) or redeploy.

## Security rules

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser-safe
  (read-only via RLS).
- `SUPABASE_SERVICE_ROLE_KEY` is **server-only** — no `NEXT_PUBLIC_` prefix, used
  only in `/api/admin/*`. Never expose it to the client.
- All writes to directory tables go through token-gated `/api/admin/*` routes
  (`x-admin-token` checked against `ADMIN_TOKEN`).
- `ADMIN_TOKEN` must be set in production; admin routes fail closed if it is missing
  (the `dev` default applies only in development).
- Never log or echo secret values.

## Compact instructions

When compacting or resuming: read PROJECT_STATE.md (status + next task + known
issues), TASKS.md (priorities), and DECISIONS.md (rationale) before acting. Do not
re-derive decisions already recorded there. Confirm the current "exact next task"
in PROJECT_STATE.md before starting work.
