# PROJECT_STATE.md

_Last updated: 2026-07-01 — student visa FAQ page added._

## Current project status

The NZ Study Agent Directory is built, deployed, connected to Supabase, and under
GitHub/Vercel workflow. Recent work includes data import workflow improvements,
public interview-question content, and admin-route security hardening.

- Branch: `main`
- Remote: `origin` → `https://github.com/devvnawaz/nz-study-agents.git`
- Latest commit: `8a02aa2 Add CSV importer and remove Admin link from footer`
- Working tree before this handoff update: clean
- Production URL: https://nz-study-agents.vercel.app

## Latest completed feature: CSV Importer

A bulk CSV importer was added to the existing admin panel.

### What it does

- Adds `/api/admin/import-csv` as a token-gated server-side import endpoint.
- Adds a **CSV Import** tab to `/admin`.
- Supports uploading or pasting CSV content.
- Provides a CSV template download in the UI.
- Adds a repo template at `templates/csv-import-template.csv`.
- Adds row-by-row import results: created / skipped / updated / errors.
- Works in local demo/file-store mode and Supabase production mode.

### Import behavior

- One CSV row = one institute-agency representation link.
- Required fields: `institute_name`, `agency_name`, `agency_city`, `source_url`.
- Existing institutes/agencies are matched by explicit ID if provided, otherwise
  by exact case-insensitive name.
- Missing institutes/agencies can be created.
- Duplicate representation links are skipped.
- `authorization_status` accepts `authorized`, `unverified`, or `expired`; defaults
  to `authorized`.
- If address/notes contain commas, the CSV cell must be quoted.

## Admin route security hardening (2026-06-24)

- The admin page moved from `/admin` to **`/manage`** (`src/pages/manage/index.tsx`).
- **`/admin` now returns 404** via `getServerSideProps` `{ notFound: true }`
  (`src/pages/admin/index.tsx`) to reduce accidental discovery of the admin surface.
- No public links to `/admin` or `/manage` exist in navbar, footer, or any sitemap
  (there is no sitemap/robots file). The earlier footer Admin link was already removed.
- The token-gate **"Try dev in demo mode" hint is hidden in production** — the demo
  hint text, placeholder, and footer note only render when `NODE_ENV === 'development'`.
- **Basic per-IP rate limiting** added to all `/api/admin/*` routes via
  `src/lib/rateLimit.ts` (in-memory, 60 requests/min/IP per route, returns HTTP 429
  with `Retry-After`). Keyed by `x-forwarded-for` (Vercel) with socket-address fallback.
- **`ADMIN_TOKEN` auth is unchanged** (still `x-admin-token` via `adminAuth.ts`).
- **`SUPABASE_SERVICE_ROLE_KEY` confirmed server-only**: referenced only in
  `src/lib/supabaseAdmin.ts`, imported only by `/api/admin/*` routes, never prefixed
  `NEXT_PUBLIC_`, never sent to the client.
- No database schema changes. Supabase Auth intentionally not added yet.

## Current deployment / Git status

- CSV Importer + footer edit were committed and pushed in commit `8a02aa2`.
- Vercel is expected to auto-deploy from GitHub on push.
- `main` was up to date with `origin/main` before this memory-only handoff update.
- The Vercel project directory is ignored via `.vercel` (commit `308f973`).

## Current Supabase / Vercel status

- Vercel production environment variables were configured by the user; do not add
  or re-add them unless explicitly asked.
- Supabase `schema.sql` was run by the user; tables and RLS exist.
- Production was previously verified to be in Supabase mode (no demo banner; public
  pages 200; admin API 401 without/wrong token).
- Local demo mode uses `.data/store.json`, which is ignored and should not be committed.

## Files changed recently

FAQ update (uncommitted at the time of this handoff) changed:

- `src/pages/faq.tsx` — new FAQ page with accordion sections, disclaimer, and source links.
- `src/components/Navbar.tsx` — added FAQ to the desktop/mobile navigation.
- `src/components/Footer.tsx` — added FAQ to the quick links.

CSV Importer/footer commit `8a02aa2` changed:

- `README.md` — CSV importer documentation.
- `src/components/Footer.tsx` — removed footer Admin link.
- `src/lib/csvImport.ts` — CSV parsing, template, validation helpers, import summary types.
- `src/pages/admin/index.tsx` — added CSV Import tab and UI.
- `src/pages/api/admin/import-csv.ts` — server-side token-gated import endpoint.
- `templates/csv-import-template.csv` — spreadsheet template.

Additional relevant prior commits:

- `8969309` / PR merge `dfc5676` — Vercel Web Analytics installed; `_app.tsx`
  imports `@vercel/analytics/next`.
- `308f973` — `.vercel` ignored.
- `5b4520e` — initial project memory files.

## Known issues / cautions

- Production data may still be empty unless the user imported or entered real data.
- Seed/demo agencies are placeholders and must not be treated as verified real data.
- CSV importer currently matches existing agencies/institutes by exact normalized name;
  spelling differences create new rows.
- The importer skips duplicate institute-agency links; it does not update existing
  representation records.
- Production admin API requires the user's real `ADMIN_TOKEN`; do not ask for or log it.
- Local smoke tests may create `.data/store.json`; remove `.data/` after testing.
- `npm install @vercel/analytics` introduced npm audit warnings reported earlier
  (2 low, 1 moderate, 1 critical). No remediation has been performed yet.

## Exact next recommended task

Run a **production CSV importer smoke test** using the real admin token:

1. Open `https://nz-study-agents.vercel.app/admin`.
2. Log in with `ADMIN_TOKEN`.
3. Use **CSV Import** with a small verified CSV containing 1 institute + 1 agency + 1 source URL.
4. Confirm result shows `created: 1`, `errors: 0`.
5. Wait for ISR or redeploy, then confirm the public institute page shows the imported agency.
6. If satisfied, begin real data collection/import from verified institute source pages.

Do not build new features until production import is verified with real data.
