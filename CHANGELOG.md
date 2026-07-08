# Changelog

All notable changes to this project are recorded here.
Format is loosely based on Keep a Changelog. Dates are YYYY-MM-DD.

## [Unreleased] — implemented, not yet committed

### Added
- **Report-form spam protection** (`src/pages/api/reports.ts`, `src/pages/report.tsx`):
  - In-memory rate limit on `/api/reports` — 5 submissions per 10 minutes per IP
    (reuses `src/lib/rateLimit.ts`; returns 429 with `Retry-After`).
  - Hidden honeypot field (`website`) — visually hidden and keyboard/screen-reader
    inaccessible on the form; the API returns a fake success and stores nothing
    when it is filled.
  - Message (5000 chars) and contact (320 chars) length caps.

## [2026-07-08]

### Added
- **Homepage/institute card imagery**:
  - Added `public/images/hero-nz.jpg` for the homepage hero backdrop.
  - Added WebP institute-card images under `public/images/institutes/` for AUT,
    EIT/Eastern Institute of Technology, Lincoln, University of Auckland,
    University of Otago, Victoria University of Wellington, University of
    Canterbury, University of Waikato, Massey University, and Unitec.

### Changed
- **Institute cards now use real images where available**:
  - `src/components/InstituteCard.tsx` renders a local WebP photo header when a
    matching asset exists, with gradient fallback for all other institutes.
  - Matching supports local/demo institute IDs and normalized production Supabase
    institute names, including EIT naming variants.
- **Full visual redesign** (commit `2914959`, navy + teal theme, based on the user's reference design):
  - New Tailwind tokens `ink` (navy) and `accent` (teal); new shared classes
    (`.btn-primary` teal, `.btn-dark`, `.input`, `.select`, `.alert-info/-warning`).
  - Dark navy sticky header and dark footer on all pages.
  - Homepage hero: badge, "Your Path to New Zealand Starts Here" (teal highlight),
    stats row, optional photo backdrop with SVG-mountain fallback
    (`src/components/HeroBackdrop.tsx`, `public/images/README.md`), and a floating
    search card overlapping the hero.
  - Modern institute cards with gradient "image" headers + SVG type icons.
  - New shared components: `PageHeader`, `Alert`, `icons.tsx` (inline SVG icon set).
  - All public pages restyled (home, institutes, institute detail, agencies, agency
    detail, FAQ incl. category jump list, interview questions as category cards,
    cost calculator, report form, about, 404). Logic, routes, and data untouched.
  - Admin `/manage` intentionally not restyled.

## Committed history

## [2026-07-01 → 2026-07-06]

### Added
- **Student Visa FAQ** page at `/faq` (commit `d2b8f56`) — 9 grouped categories,
  cautious general-information answers, official source links, disclaimer.
- **Study Cost Calculator** at `/cost-calculator` (commit `28bd4f3`) — tuition,
  scholarship, duration chips, living cost, one-time expenses; NZD + BDT results;
  **Frankfurter API v2** exchange-rate fetch (`/v2/rate/NZD/BDT`, client-side,
  no key) with manual override and refresh button; official source links.
- **Institutes page disclaimer** (commit `fc86a8c`) — "Can't find your preferred
  institution?" section + 18 "Institutions checked so far" links on `/institutes`.
- **Mobile navigation** (commit `fd250b6`) — hamburger menu below `md` with
  accessible toggle (`aria-expanded`), closing on link tap.

### Changed
- **Rebrand** (commit `be88875`) — site renamed from "NZ Study Agent Directory —
  Bangladesh" to **"New Zealand Study Planner - Bangladesh"** (short: "NZ Study
  Planner"); homepage hero/metadata/OG tags updated; footer credit "Developed by
  devnawaz" (LinkedIn) added; directory wording kept for the directory feature.
- **Navigation/footer:** FAQ and Cost Calculator links added to navbar and footer.
- Footer description updated to "…created by students for students." then to the
  planner positioning during the rebrand.

## [2026-06-18 → 2026-06-24]

### Added
- **CSV Importer** for bulk-loading directory data (commit `8a02aa2`).
  - Token-gated API endpoint `src/pages/api/admin/import-csv.ts` (GET returns a
    CSV template; POST imports CSV content).
  - **CSV Import** tab in the admin panel with file upload or paste, template
    download, and per-row results (created / updated / skipped / errors).
  - Parsing/validation helpers in `src/lib/csvImport.ts`; template
    `templates/csv-import-template.csv`; README documentation.
  - Behavior: one row = one institute-agency link; matches by id or exact
    normalized name; creates missing records; skips duplicate links; works in
    demo (file-store) and Supabase modes.
- **Visa Interview Questions** page at `/interview-questions` with grouped sample
  student visa interview questions, linked from the navbar.

### Changed
- **Footer:** removed the public **Admin** link (commit `8a02aa2`).
- **Admin route hardening (2026-06-24):** admin panel moved from `/admin` to
  `/manage`; `/admin` now returns 404; production no longer shows the demo-mode
  token hint; lightweight in-memory rate limiting added to `/api/admin/*` routes.

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
