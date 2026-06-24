# Changelog

All notable changes to this project are recorded here.
Format is loosely based on Keep a Changelog. Dates are YYYY-MM-DD.

## [Unreleased]

### Added
- **CSV Importer** for bulk-loading directory data (commit `8a02aa2`).
  - New token-gated API endpoint `src/pages/api/admin/import-csv.ts` (GET returns a
    CSV template; POST imports CSV content).
  - New **CSV Import** tab in the admin panel (`src/pages/admin/index.tsx`) with
    file upload or paste, template download, and a per-row results summary
    (created / updated / skipped / errors).
  - New parsing/validation helpers and types in `src/lib/csvImport.ts`.
  - New spreadsheet template `templates/csv-import-template.csv`.
  - README documentation for the importer.
  - Behavior: one row = one institute-agency link; matches existing records by id or
    exact normalized name; can create missing institutes/agencies; skips duplicate links;
    works in both demo (file-store) and Supabase modes.
- **Visa Interview Questions** page at `/interview-questions` with grouped sample student visa interview questions, linked from the navbar.

### Changed
- **Footer:** removed the public **Admin** link (`src/components/Footer.tsx`,
  commit `8a02aa2`). The `/admin` route still exists but is no longer linked from the
  public site.
- **Admin route hardening:** the admin panel moved from `/admin` to `/manage`; `/admin` now returns 404. Production no longer shows the demo-mode token hint, and a lightweight in-memory rate limit was added to `/api/admin/*` routes.
- **Interview Questions navigation:** moved the page link into the top navbar next to About.
- **About page:** Credits section scaffold was added and later removed; no remaining user-facing change.

## [0.1.0] - 2026-06-17

### Added
- Initial NZ Study Agent Directory: Next.js 14 (Pages Router) + TypeScript + Tailwind.
- Supabase schema with RLS (`supabase/schema.sql`); dual-mode data layer
  (Supabase or local JSON file-store).
- Public pages: home/search, institutes list + detail, agencies list + detail,
  about, report form, 404.
- Admin panel `/admin` (token gate + Agencies / Institutes / Links / Reports tabs)
  and admin API routes `/api/admin/*`, plus public `/api/reports`.
- Deployed to Vercel; Supabase production mode verified.
- Vercel Web Analytics (`@vercel/analytics`).
- Project memory files (PROJECT_STATE.md, TASKS.md, DECISIONS.md).
