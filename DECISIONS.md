# DECISIONS.md

_Architectural, product, and process decisions, with rationale. Last updated 2026-07-08._

## Product / branding decisions (2026-07-01 → 2026-07-08)

- **Rebrand (2026-07-06, commit `be88875`)** — the site was rebranded from an
  agent directory ("NZ Study Agent Directory - Bangladesh") to a broader helper:
  **"New Zealand Study Planner - Bangladesh"**. Rationale: the site now includes
  FAQ, interview questions, and a cost calculator, with more features planned.
- **Directory name preserved for the feature** — "NZ Study Agent Directory -
  Bangladesh" is used ONLY when referring to the agent-directory feature itself;
  never as the site name.
- **Short name in tight UI spaces** — use "NZ Study Planner" (header logo,
  `og:site_name`, mobile).
- **Unofficial, student-friendly, trust-first** — the site stays free and
  community-oriented; it is never positioned as immigration advice, and cautious
  wording ("generally", "may", "check the official source") is mandatory on
  FAQ/calculator/interview content. Trust-first positioning is preferred over any
  marketplace/review-style positioning (no ratings, no agency self-submissions).
- **Cost calculator is estimate-only** — no guarantee amounts will satisfy
  Immigration New Zealand; formula and disclaimers stay visible on the page.
- **Exchange rate is approximate and editable** — auto-fetched from Frankfurter v2
  client-side (no key needed), but the field is always manually editable and the
  calculator never blocks if the API fails.
- **No login/account features** — do not add auth for public users unless a real
  need emerges. The reference design's "Log in / Get Started" buttons were
  deliberately replaced with real actions (Report Outdated Info / Start Searching).
- **Developer credit** — footer credits "devnawaz" linking to
  https://www.linkedin.com/in/devnawaz/.

## Redesign decisions (2026-07-08)

- **Visual direction** — dark navy (`ink` scale) base with teal (`accent` scale)
  actions, from the user's reference screenshot: navy header/hero/footer, large
  hero typography with "New Zealand" highlighted in teal, floating search card
  overlapping the hero, modern rounded cards with soft shadows.
- **Tokens added, not replaced** — `accent` and `ink` scales were added to
  `tailwind.config.js`; legacy `brand`/`nz` tokens remain so old classes never break.
- **Hero image strategy** — the hero references optional `/images/hero-nz.jpg`
  under a navy gradient overlay, with an inline SVG mountain silhouette fallback
  (`HeroBackdrop.tsx`). Rationale: no suitable local asset existed and remote
  image URLs were ruled out as fragile; the page must look finished without the photo.
- **Institute card "images" are CSS gradients + SVG icons** — per-type gradient
  headers (`getTypeGradient`) instead of stock photos: consistent, zero binary
  assets, no licensing risk. Real campus photos can replace them later.
- **Icons: inline SVG set** (`src/components/icons.tsx`) replaces emoji iconography
  in redesigned surfaces — crisper and stylable; no icon library dependency.
- **Shared building blocks** — `PageHeader` (navy inner-page band) and `Alert`
  (info/warning with icon circle) were extracted because disclaimers and page
  headers repeat on nearly every page.
- **Flat nav kept (no dropdown)** — six links + CTA, collapsing to the hamburger
  below `lg`; a "Resources" dropdown was considered and rejected to avoid
  accessibility complexity.
- **Admin `/manage` intentionally NOT restyled** — internal tool, out of redesign
  scope; keep functional.

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
- **Admin route hardening (2026-06-24)** — the public panel moved from `/admin` to
  `/manage`; `/admin` now returns 404; production no longer shows the demo-mode token hint;
  basic in-memory rate limiting is applied to `/api/admin/*` routes. This reduces accidental
  discovery without changing the token-based auth model.
- Upgrade path: Supabase Auth for named multi-user admin accounts (backlog).

## Rate limiting

- **Lightweight in-memory limiter** (`src/lib/rateLimit.ts`) — 60 requests/minute per IP per admin route.
- Uses `x-forwarded-for` when present, with socket address fallback.
- Chosen as a minimal hardening step; it is intentionally simple and can be replaced with
  a distributed limiter later if traffic warrants it.

## Server-only secrets

- **`SUPABASE_SERVICE_ROLE_KEY` remains server-only** — referenced only in `src/lib/supabaseAdmin.ts`, imported only by `/api/admin/*` routes, and never exposed with a `NEXT_PUBLIC_` prefix.
- The client data layer uses `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` only.
- This preserves the RLS bypass needed for admin writes while keeping the service key off the client.

## Backend route naming

- The admin UI lives at `/manage`; `/admin` is intentionally hidden with a 404 to reduce discoverability.
- Public links should reference `/manage` only for internal users, and no public nav/footer/sitemap links should point to the admin surface.

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

## CSV importer decisions (2026-06-18)

- **Why CSV import over manual entry** — the directory's core value is breadth across
  many institutes, each with many Bangladesh agents. Manual single-record entry does
  not scale for bulk onboarding or spreadsheet-sourced data; a CSV importer lets an
  admin load many institute-agency links in one pass while keeping the same
  validation and security guarantees as the per-record admin forms.
- **One row = one representation link** — each CSV row models an institute↔agency
  relationship, not just an agency. This keeps the many-to-many model intact and lets
  one agency appear under multiple institutes via multiple rows.
- **Server-side, token-gated import** — import runs in `/api/admin/import-csv`,
  reusing `checkAdminToken` and (in production) the service-role client. CSV parsing
  and writes never happen client-side, consistent with the existing admin security model.
- **Dual-mode reuse** — the importer writes to the local file-store in demo mode and
  to Supabase in production, matching the existing data-layer split. No new storage path.
- **Matching strategy** — existing institutes/agencies are matched by explicit `id`
  if provided, else by exact case-insensitive `name`. Unknown ones can be created.
  Exact-name matching was chosen for predictability; fuzzy matching is a deliberate
  backlog item to avoid silent wrong-merges.
- **Validation** — required columns are `institute_name`, `agency_name`, `agency_city`,
  `source_url`; rows missing any are reported as `error` without aborting the whole import.
- **Deduplication** — duplicate institute-agency links are reported as `skipped`
  rather than erroring or duplicating, both within a single CSV (in-memory `seen` set)
  and against existing data (DB unique constraint / store lookup). Import is
  create-or-skip; it does not update existing representation records (update is backlog).
- **Per-row result summary** — the endpoint returns created/updated/skipped/errors
  counts plus a per-row status/message, so admins can see exactly what happened.
- **CSV quoting** — a minimal RFC-style line parser handles quoted cells so commas in
  addresses/notes are preserved; admins are told to quote such cells.
