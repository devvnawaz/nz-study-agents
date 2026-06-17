# DECISIONS.md

_Architectural and process decisions, with rationale. Last updated 2026-06-17._

## Stack decisions

- **Next.js 14, Pages Router** — chosen over App Router for simpler ISR + API
  routes for this directory use case. The team's mental model fits pages/ + api/.
- **TypeScript (strict)** — type safety across the data layer and forms.
- **Tailwind CSS 3** — fast, consistent styling without a component library dependency.
- **Supabase (PostgreSQL)** — managed Postgres + RLS + simple JS client; free tier
  is enough for an MVP. Picked as "Option 1: Simple and fast".
- **Manual scaffold (no create-next-app)** — avoids interactive prompts in the
  agent environment and gives full control over file layout.
- **Exact-pinned dependency versions** — reproducible builds on Vercel.

## Deployment decisions

- **Vercel hosting** — first-class Next.js support, zero build config, ISR works natively.
- **ISR with `revalidate: 3600`** on public pages; **`fallback: 'blocking'`** on
  dynamic detail pages — balances static speed with the ability to serve new
  DB rows without a full redeploy.
- **Env vars set in Vercel dashboard by the user** — not committed. The user has
  already configured production env vars; do NOT add or re-add them.
- **`.data/` and `.env*` gitignored** — secrets and local-only state never tracked.
- Local machine is intentionally NOT linked to Vercel; deploys happen via the
  user's own Vercel project (git-push or dashboard).

## Auth / admin-token decisions

- **Single shared `ADMIN_TOKEN`** — sufficient for 1–2 trusted admins; avoids the
  complexity of full user auth for the MVP.
- **Token checked server-side only** (`adminAuth.ts`), via `x-admin-token` header
  (or cookie). Never trusted from the client.
- **Fail-closed in production** — if `ADMIN_TOKEN` is unset, admin routes return 500;
  the `dev` fallback token applies ONLY when `NODE_ENV === 'development'`.
- **Admin UI stores token in `localStorage`** and attaches it per request — acceptable
  for an internal admin tool; revisit if exposed to less-trusted users.
- Upgrade path: Supabase Auth for named multi-user admin accounts (backlog).

## Database decisions

- **Four tables:** `institutes`, `agencies`, `representations` (many-to-many link
  with source_url + authorization_status + last_verified_at), `reports`.
- **Row Level Security:** public SELECT on directory tables; public INSERT on
  `reports` only; all other writes require the service-role key.
- **Service-role key is server-only** (no `NEXT_PUBLIC_` prefix); used exclusively
  in `/api/admin/*`. This is what lets admin writes bypass RLS safely.
- **Dual-mode data layer** — `isSupabaseConfigured` (env vars present AND not
  placeholder values) switches between Supabase and a local JSON file-store
  (`.data/store.json`). Rationale: lets the app run/demo with zero setup, and flip
  to the DB automatically once env vars exist — no code change.
- **File-store is dev-only** — it does not persist on Vercel serverless; production
  relies entirely on Supabase. Accepted tradeoff.
- **`store.ts` uses `fs`** so it is server-only; `data.ts` dynamic-imports it and
  the admin page imports only `type`s from it, keeping `fs` out of client bundles.

## Data integrity / trust decisions

- **Source transparency mandatory** — every representation carries `source_url`,
  `authorization_status`, and `last_verified_at`; shown on listings.
- **Disclaimers site-wide** — students told to verify with the institute before
  paying; site states it is unaffiliated with any institute/government body.
- **Seed agencies are clearly labelled "(DEMO)"** and must be replaced with verified
  data before real use; institute representative-page URLs are unverified guesses.
- **Duplicate representation links rejected** (409) to keep the link table clean.
