# TASKS.md

_Last updated: 2026-06-24 (admin route security hardening)._

## Done
- Scaffold Next.js 14 + TypeScript + Tailwind (manual).
- Data layer types + dual-mode access (Supabase / local JSON file-store).
- Supabase schema (`supabase/schema.sql`) with tables + indexes + RLS.
- Public pages: home/search, institutes list + detail, agencies list + detail,
  about, report form, 404.
- Admin panel `/manage` (token gate + Agencies/Institutes/Links/Reports tabs); `/admin` now 404s.
- Admin API routes `/api/admin/*` + public `/api/reports`.
- Deployment-readiness reviews (all green).
- Git initial commit + remote (github.com/devvnawaz/nz-study-agents).
- Deployed to Vercel (https://nz-study-agents.vercel.app); Supabase mode verified.
- Vercel Web Analytics installed (`@vercel/analytics`).
- Project memory files (PROJECT_STATE / TASKS / DECISIONS).
- **CSV Importer feature** — API `/api/admin/import-csv`, admin CSV Import tab,
  `src/lib/csvImport.ts`, template `templates/csv-import-template.csv`, README docs.
  Tested locally in demo mode (create + duplicate-skip verified). Pushed in `8a02aa2`.
- **Footer edit** — removed public Admin link from footer; confirmed no other public
  admin entry points. Pushed in `8a02aa2`.
- **Interview Questions page** — `/interview-questions` with grouped sample visa interview questions; linked from navbar.
- **Admin security hardening** — admin page moved to `/manage`, `/admin` now 404s, dev-mode token hint hidden in production, and basic rate limiting added to `/api/admin/*` routes.

## In progress
- (none — feature work paused for context/memory handoff.)

## Next
1. **Production CSV import smoke test** with the real `ADMIN_TOKEN`
   (1 institute + 1 agency + 1 source URL; confirm created, then public page renders).
2. **Real data collection / import** from verified official institute agent pages,
   replacing placeholder "(DEMO)" data.

## Security hardening (2026-06-24)
- Admin panel route moved from `/admin` to `/manage`; `/admin` now returns 404.
- Production no longer shows the local demo token hint.
- Basic in-memory rate limiting added to `/api/admin/*` routes.
- `SUPABASE_SERVICE_ROLE_KEY` remains server-only and is only imported from API routes.
- No public links to `/admin` or `/manage` exist in the navbar/footer/sitemap.

## CSV importer follow-ups
- Optional: support updating existing representation links (currently skip-only).
- Optional: fuzzy/alias matching for institute and agency names (currently exact, normalized).
- Optional: downloadable error report (CSV) for failed rows.
- Optional: dedupe agencies by website/email in addition to name.
- Optional: native multipart file upload (current upload reads file text client-side and posts JSON).

## Backlog
- Replace placeholder "(DEMO)" agencies with verified data.
- Verify each institute's real `representative_page_url` from official sources.
- SEO landing pages (e.g. "Authorized agents for University of Auckland in Bangladesh").
- Multi-user admin auth via Supabase Auth (if more than 1–2 admins needed).
- Address npm audit warnings introduced by analytics install.
- Consider a migration script to push `seed.ts` into Supabase.

## Blocked
- Production import verification blocked on the user's real `ADMIN_TOKEN`
  (known only to the user; never request or log it).
