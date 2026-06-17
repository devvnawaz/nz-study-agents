# TASKS.md

_Last updated: 2026-06-17 (pre-compact checkpoint)._

## Done
- Scaffold Next.js 14 + TypeScript + Tailwind (manual, no create-next-app).
- Data layer types + dual-mode access (Supabase / local JSON file-store).
- Supabase schema (`supabase/schema.sql`) with tables + indexes + RLS.
- Public pages: home/search, institutes list + detail, agencies list + detail,
  about, report form, 404.
- Shared UI components (Layout, Navbar, Footer, cards, Disclaimer, DemoBanner, SearchExplorer).
- Admin panel `/admin` (token gate + Agencies/Institutes/Links/Reports tabs).
- Admin API routes `/api/admin/*` + public `/api/reports`.
- Deployment-readiness reviews (twice) — all checks green.
- Git: initial commit on `main`; remote `origin` set (github.com/devvnawaz/nz-study-agents).
- Deployed to Vercel (https://nz-study-agents.vercel.app).
- Production verified: Supabase mode active, public pages 200, admin auth 401 without token.
- Memory files written: PROJECT_STATE.md, TASKS.md, DECISIONS.md, CLAUDE.md.

## In progress
- (none — feature work paused at user request for context preservation.)

## Next
1. **Populate Supabase with data** (DB is empty → institute detail pages 404).
   - Via `/admin` UI or admin API curl calls.
   - Run smoke test: add institute → agency → link → verify public page after ISR (~60s).
2. **CSV importer** (paused feature "b"): bulk-load agencies + links from a spreadsheet;
   per-row success/error summary; works in both Supabase and file-store modes;
   ship a sample CSV template + README docs.

## Backlog
- Replace placeholder "(DEMO)" agencies with real verified data.
- Verify each institute's real `representative_page_url` from official sources.
- SEO landing pages (e.g. "Authorized agents for University of Auckland in Bangladesh").
- Multi-user admin auth via Supabase Auth (if more than 1–2 admins needed).
- Consider a data migration script to push `seed.ts` into Supabase.

## Blocked
- Local admin API verification against production is blocked on `ADMIN_TOKEN`
  (known only to the user). User must run token-authenticated smoke tests.
- Production data entry blocked until someone signs into `/admin` with the real token.
