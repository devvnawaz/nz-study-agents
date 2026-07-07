# TASKS.md

_Prioritized backlog. Last updated: 2026-07-08 (visual redesign committed, `2914959`)._

## Now

1. **Verify the deployed redesign** on https://www.nzstudy.help/ after the
   Vercel deploy (all pages + mobile widths).
2. **Hero photo (optional)** — user supplies `public/images/hero-nz.jpg` per
   `public/images/README.md`; no code change needed.

## Next

1. **Ongoing verified-data upkeep** — production Supabase already holds real data
   (user-confirmed 2026-07-08); keep listings verified against official institute
   agent pages via the CSV importer in `/manage` (production import needs the
   user's real `ADMIN_TOKEN`; never request/log it).
2. **Spam protection for the report form** — `/api/reports` currently has no
   rate limit or CAPTCHA; reuse `src/lib/rateLimit.ts` and/or add a honeypot.
   Do NOT fake protection — implement it properly or leave it documented.
3. **SEO basics** — add `public/robots.txt` and a sitemap; consider JSON-LD
   structured data for FAQ and directory pages.
4. **Privacy policy page** — none exists; add if/when the user wants one.

## Later

- Central site config (site name/description/nav links defined once — branding
  strings currently repeat across pages).
- Clearer "last verified" display on listings if users find it too subtle.
- Institute card photos — swap gradient headers for real licensed campus images.
- Accessibility pass — skip link, focus audit on the dark header/footer, contrast checks.
- CSV importer follow-ups: update-existing links, fuzzy name matching,
  downloadable error report, dedupe by website/email, native multipart upload.
- Multi-user admin auth via Supabase Auth (if more than 1–2 admins needed).
- Address npm audit warnings from the `@vercel/analytics` install.
- SEO landing pages (e.g. "Authorized agents for University of Auckland in Bangladesh").
- Restyle admin `/manage` to the new design system (deliberately skipped so far).

## Done

- Scaffold Next.js 14 + TypeScript + Tailwind; data layer with dual-mode access
  (Supabase / local JSON file-store); Supabase schema with RLS.
- Public pages: home/search, institutes list + detail, agencies list + detail,
  about, report form, 404.
- Admin panel (token gate + Agencies/Institutes/Links/Reports tabs) + admin API
  routes + public `/api/reports`.
- Deployed to Vercel (now at https://www.nzstudy.help/); Supabase mode verified;
  Vercel Web Analytics installed.
- **CSV Importer** — `/api/admin/import-csv`, admin CSV Import tab,
  `src/lib/csvImport.ts`, template. (commit `8a02aa2`)
- **Admin security hardening (2026-06-24)** — `/admin` → `/manage` (+404), prod
  token hint hidden, in-memory rate limiting on `/api/admin/*`.
- **Interview Questions page** at `/interview-questions`. 
- **Institutes page disclaimer** + 18 "Institutions checked so far" links. (`fc86a8c`)
- **Mobile hamburger navigation**. (`fd250b6`)
- **Student Visa FAQ page** at `/faq` with official source links. (`d2b8f56`)
- **Study Cost Calculator** at `/cost-calculator` with Frankfurter v2 rate fetch. (`28bd4f3`)
- **Rebrand to "New Zealand Study Planner - Bangladesh"** with devnawaz footer
  credit. (`be88875`)
- **Full visual redesign** (navy/teal theme: hero + floating search,
  gradient institute cards, dark footer, PageHeader/Alert/icons components,
  FAQ jump list, interview category cards, calculator restyle) — reviewed and
  committed. (`2914959`)

## Blocked

- (none — production data confirmed real by the user on 2026-07-08. Any future
  production import still needs the user's real `ADMIN_TOKEN`; never request or
  log it.)
