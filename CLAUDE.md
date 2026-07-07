# CLAUDE.md — Agent working instructions

Stable, long-term instructions for AI coding agents working in this repo.
**This file is also useful for Codex and other AI coding agents, not only Claude Code.**
(Day-to-day status lives in PROJECT_STATE.md / TASKS.md; rationale in DECISIONS.md;
read SESSION_HANDOFF.md first when starting a session.)

## Project purpose

**New Zealand Study Planner - Bangladesh** (https://www.nzstudy.help/) — a free,
student-friendly guide for Bangladeshi students planning to study in New Zealand.
Its core feature is the **NZ Study Agent Directory - Bangladesh**: select an NZ
institute and see its authorized education agents in Bangladesh, with contact
details, official source link, and a last-verified date. Supporting features:
student visa FAQ, interview questions, and a study cost calculator.

## Stack

- Next.js 14, **Pages Router**, TypeScript (strict), React 18.
- Tailwind CSS 3 (tokens in `tailwind.config.js`: `accent` teal, `ink` navy,
  legacy `brand` blue, `nz` flag colours; shared classes in `src/styles/globals.css`).
- Supabase (PostgreSQL + RLS) for data; local JSON file-store (`.data/store.json`)
  for demo mode when Supabase env vars are absent.
- Hosted on Vercel. ISR (`revalidate: 3600`, `fallback: 'blocking'`).
- Path alias `@/*` → `src/*`. No other runtime dependencies — do not add heavy libraries.

## Important commands

- `npm run dev` — local dev server (picks the next free port if 3000 is busy).
- `npm run build` — production build; **run after any meaningful change**.
- `npx tsc --noEmit` — quick type check.
- `npm run lint` — Next.js lint.

## How to work safely in this repo

- **Inspect before editing** — read the file and its neighbours; match existing
  patterns and component classes instead of inventing new ones.
- **Do not commit or push unless the user explicitly asks.**
- **Preserve existing routes and features** — search/filter, FAQ accordions
  (`<details>/<summary>`), cost-calculator logic and Frankfurter fetch, report
  form POST to `/api/reports`, admin `/manage` — all must keep working.
- **Run `npm run build` after meaningful changes** and report failures honestly.
- **Keep branding consistent** — site: "New Zealand Study Planner - Bangladesh";
  tight UI spaces: "NZ Study Planner"; directory feature only:
  "NZ Study Agent Directory - Bangladesh".
- **Do not add fake login/auth features** — there are no user accounts by design.
- **Do not invent data** — agencies, institutes, and authorisations must come from
  official institute sources; treat `source_url` / `last_verified_at` fields and
  verification wording carefully. Seed "(DEMO)" agencies are placeholders.
- The site is **not immigration advice** — keep cautious wording and disclaimers
  on FAQ / calculator / interview pages.
- Do not remove `target="_blank" rel="noopener noreferrer"` from external links.
- Delete stray build artifacts (`tsconfig.tsbuildinfo`) rather than committing them.

## Coding conventions

- TypeScript strict; share types from `src/lib/types.ts`.
- Reads go through `src/lib/data.ts` (never query Supabase directly from pages).
- Server-only modules (`store.ts` uses `fs`; `supabaseAdmin.ts` uses service key)
  must never be statically imported into client components — use API routes, dynamic
  import, or `import type` only.
- Components in `src/components/`, pages in `src/pages/`, API in `src/pages/api/`.
  Shared UI: `Layout`, `Navbar`, `Footer`, `PageHeader`, `Alert`, `Disclaimer`,
  `InstituteCard`, `AgencyCard`, `SearchExplorer`, `HeroBackdrop`, `icons.tsx`.
- Default to no comments unless the "why" is non-obvious. Prefer editing existing
  files over adding new ones. No speculative abstractions.

## Deployment rules

- Env vars are managed in the **Vercel dashboard by the user** — never commit them
  and never add/re-add them via tooling unless explicitly asked.
- Never commit `.env*` or `.data/` (already gitignored).
- The local machine is not linked to Vercel and has no Vercel CLI; deploys happen
  automatically when `main` is pushed to GitHub.
- File-store (`.data/store.json`) is dev-only and does NOT persist on Vercel —
  production data lives only in Supabase.

## Security rules

- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser-safe
  (read-only via RLS).
- `SUPABASE_SERVICE_ROLE_KEY` is **server-only** — no `NEXT_PUBLIC_` prefix, used
  only in `/api/admin/*`. Never expose it to the client.
- All writes to directory tables go through token-gated `/api/admin/*` routes
  (`x-admin-token` checked against `ADMIN_TOKEN`); they are rate limited in-memory.
- Admin UI lives at `/manage`; `/admin` intentionally returns 404. Never link the
  admin surface from public nav/footer.
- `ADMIN_TOKEN` must be set in production; admin routes fail closed if missing
  (the `dev` default applies only in development). Never log or echo secret values.

## Session start / compact instructions

When starting, resuming, or compacting: read SESSION_HANDOFF.md (immediate context),
PROJECT_STATE.md (status + next task + known issues), TASKS.md (priorities), and
DECISIONS.md (rationale) before acting. Do not re-derive decisions already recorded
there. Confirm the current "exact next task" in PROJECT_STATE.md before starting work.
