# PROJECT_STATE.md

_Last updated: 2026-06-17 — checkpoint before auto-compact (post-deployment verification)._

## 1. Current project status

The website is **built, deployed to production, and confirmed running in Supabase
mode**. All code is committed to git (`main`, remote `origin` =
`https://github.com/devvnawaz/nz-study-agents.git`). Feature work is **paused**.

The app lets Bangladeshi students select an NZ institute and see its authorized
agents in Bangladesh (contact, website, address, source link, last-verified date).

## 2. Latest deployment status

- **Live URL:** https://nz-study-agents.vercel.app — `GET /` → 200.
- Public pages all 200: `/`, `/institutes`, `/agencies`, `/about`, `/report`.
- Custom 404 works.
- **Supabase mode is ACTIVE in production** — verified: no demo banner in HTML, no
  placeholder URL in the JS bundle (env vars were set before the build).
- Admin auth locked down: `/api/admin/*` returns **401** with no token and with a
  wrong token.

## 3. Supabase / Vercel environment setup status

- **Vercel production env vars: SET BY USER** — do NOT add or re-add them.
  (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TOKEN`.)
- **Supabase schema: APPLIED** — user ran `supabase/schema.sql` (tables exist).
- The local machine is **not** linked to Vercel (`.vercel/` absent) and the Vercel
  CLI is **not installed** locally. `ADMIN_TOKEN` value is known only to the user.

## 4. What has been completed

- Full Next.js 14 (Pages Router) + TypeScript + Tailwind app.
- Data layer with dual mode: Supabase when configured, local JSON file-store
  (`.data/store.json`) in demo mode.
- Public pages: home/search, institutes list + detail, agencies list + detail,
  about, report form, 404.
- Admin panel at `/admin`: token gate + 4 tabs (Agencies, Institutes, Links, Reports).
- Admin API routes (`/api/admin/*`) + public `/api/reports`.
- Supabase schema with RLS (public read, public insert on reports, writes via
  service role only).
- Deployment readiness reviewed (twice) — all green.
- Deployed to Vercel; production verified in Supabase mode.
- Memory files: PROJECT_STATE.md, TASKS.md, DECISIONS.md, CLAUDE.md.

## 5. Current known issues

- **Supabase database is EMPTY (expected, not a bug).** Schema was applied but no
  rows were migrated. Consequence:
  - `/institutes/[id]` (e.g. `/institutes/inst-uoa`) returns **404** in production
    (no rows → `getStaticPaths` pre-rendered nothing; `fallback:'blocking'` →
    `getInstituteById` returns null → 404).
  - Home/list pages render empty states ("No institutes match", zero stats).
  - **Fix = enter data**, not a code change. Use `/admin` or the admin API.
- Seed data (`src/lib/seed.ts`) and `.data/store.json` are local-only; they were
  **not** migrated into Supabase.
- Agency seed entries are **placeholder "(DEMO)"** data; institute
  `representative_page_url`s are unverified guesses — must be verified before real use.
- `.data/store.json` writes do **not** persist on Vercel serverless — only Supabase
  persists in production (by design).

## 6. Exact next task

**Populate the Supabase database** so the production site shows content. Two options:
1. Manually via `/admin` UI (sign in with ADMIN_TOKEN) or admin API curl calls
   (see smoke-test checklist / "commands that worked").
2. Build the **CSV importer** (task b, currently paused) to bulk-load agencies +
   links from a spreadsheet — this was the originally-planned next feature.

After data is in: run the smoke-test checklist (add institute → agency → link →
confirm public page renders after ISR revalidate ~60s).

## 7. Commands that worked

```bash
# Build & local run
cd ~/nz-study-agents
npm install
npm run build            # passes — 31 routes
npm run dev              # http://localhost:3000 (admin token in dev = "dev")

# Background dev + wait-until-ready
(npm run dev > /tmp/nz-dev.log 2>&1 &)
until grep -q "Ready in" /tmp/nz-dev.log; do sleep 0.5; done
pkill -f "next dev"      # stop strays (avoid double-server on 3000/3001)

# Reset local demo data
rm -rf .data

# Git state
git status --short        # clean
git ls-files | grep -E "\.env\.local|^\.data/"   # empty = good (not tracked)

# Production verification (note: re-resolve curl path per command in this shell)
CURL=$(which curl)
$CURL -s -o /dev/null -w "%{http_code}" https://nz-study-agents.vercel.app/        # 200
$CURL -s -o /dev/null -w "%{http_code}" -H "x-admin-token: wrong" \
  https://nz-study-agents.vercel.app/api/admin/agencies                            # 401

# Admin API to add data (user runs with real token)
curl -s -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  https://nz-study-agents.vercel.app/api/admin/agencies                            # [] not 401
# POST institute/agency → 201; POST representations links them; duplicate link → 409
```

Note: in one shell session `curl` fell out of PATH after the first call inside a
`for` loop — re-resolve with `CURL=$(which curl)` and call `$CURL` to be safe.

## 8. Important decisions made

(See DECISIONS.md for full rationale.)
- Stack: Next.js 14 Pages Router + Supabase + Vercel + Tailwind.
- Manual scaffold (no create-next-app) to avoid interactive prompts.
- Dual-mode data layer: Supabase OR local file-store; `isSupabaseConfigured`
  switches by inspecting env vars (and rejecting placeholder values).
- Security: anon key public (read-only via RLS); all writes through server-side
  `/api/admin/*` routes gated by `ADMIN_TOKEN`, using service-role key (server-only,
  no `NEXT_PUBLIC_` prefix). Admin page imports `store` as type-only.
- `ADMIN_TOKEN` fail-closed in production (defaults to `dev` only in development).
- ISR `revalidate: 3600`, `fallback: 'blocking'` on dynamic pages.
- Source transparency: every listing carries source_url + authorization_status +
  last_verified_at; disclaimers shown site-wide.

No app functionality changed in this checkpoint — documentation only.
