# PROJECT_STATE.md

_Source of truth for the current project state. Last updated: 2026-07-08 — institute card images committed (`45a0f8a`)._

## Identity

- **Live domain:** https://www.nzstudy.help/ (Vercel deployment; also reachable at nz-study-agents.vercel.app)
- **Brand (full):** New Zealand Study Planner - Bangladesh
- **Brand (short UI name):** NZ Study Planner
- **Agent directory feature name:** NZ Study Agent Directory - Bangladesh (use only when referring to the directory feature)
- **Audience:** Bangladeshi students planning to study in New Zealand
- **Positioning:** free, unofficial, student-friendly, trust-first. Not immigration advice; not affiliated with any NZ government body, institute, or agency.

## Git status

- Branch: `main`; remote `origin` → https://github.com/devvnawaz/nz-study-agents.git
- Latest app-change commit before this handoff update: `45a0f8a` — "Add more
  institute card images". `npm run build` passes.
- Untracked locally (intentionally not committed): macOS `.DS_Store` files at repo
  root, `public/`, and `public/images/`. `tsconfig.tsbuildinfo` may reappear after
  local type checks; delete it rather than committing it.

## Current features

1. **Institute directory** — `/institutes` list + `/institutes/[id]` detail with
   authorized agents, source links, last-verified dates; client-side search/type/city filter.
   Institute cards use WebP images when available and fall back to the original
   type gradient for institutes without an image.
2. **Agencies** — `/agencies` list + `/agencies/[id]` detail (contacts, institutes represented).
3. **Student Visa FAQ** — `/faq`, 9 categories, `<details>` accordions, official source links.
4. **Interview questions** — `/interview-questions`, 11 grouped categories.
5. **Cost calculator** — `/cost-calculator`; tuition/scholarship/duration/living/one-time inputs;
   NZD + BDT results; **Frankfurter API v2** (`https://api.frankfurter.dev/v2/rate/NZD/BDT`)
   fetched client-side with manual-edit + refresh fallback.
6. **Report outdated info** — `/report` form → POST `/api/reports` (basic validation only).
7. **About** — `/about`.
8. **Admin** — `/manage` (token gate, Agencies/Institutes/Links/CSV Import/Reports tabs);
   `/admin` returns 404; `/api/admin/*` token-gated + in-memory rate limited.

## Tech stack (verified against code)

- Next.js 14.2.5, Pages Router, React 18, TypeScript strict, Tailwind CSS 3.
- Data layer `src/lib/data.ts` — dual mode: Supabase (production) or local JSON
  file-store `.data/store.json` (demo/dev, seeded from `src/lib/seed.ts`).
- Supabase schema `supabase/schema.sql`: `institutes`, `agencies`, `representations`,
  `reports` + RLS (public SELECT on directory tables, public INSERT on reports).
- ISR: `revalidate: 3600`; dynamic detail pages `fallback: 'blocking'`.
- `@vercel/analytics` in `_app.tsx`. No other runtime deps.

## Deployment approach

- Vercel auto-deploys `main` on push to GitHub. Env vars managed by the user in the
  Vercel dashboard (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
  `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TOKEN`). Never add or change them via tooling.

## Design direction (redesign committed 2026-07-08, `2914959`)

- Reference: user screenshot "New Design I want to Achieve.png" (dark navy + teal).
- Tokens: `ink` (navy/slate) + `accent` (teal) added in `tailwind.config.js`;
  legacy `brand`/`nz` kept for compatibility. Shared classes in `globals.css`
  (`.btn-primary` teal, `.btn-dark`, `.input`, `.select`, `.alert-*`, `.card`).
- Dark navy sticky header + dark footer on all pages; homepage hero with badge,
  "Your Path to **New Zealand** Starts Here", stats row, floating search card
  overlapping the hero; modern institute cards with photo headers where assets
  exist, otherwise gradient "image" headers + SVG type icons; `PageHeader` navy
  band on inner pages; `Alert` component for disclaimers; inline SVG icon set
  (`src/components/icons.tsx`) replacing emoji.
- **Hero photo:** `public/images/hero-nz.jpg` exists and is used by
  `HeroBackdrop.tsx` under a navy overlay; if removed, the hero falls back to the
  SVG mountain silhouette.
- **Institute card images:** stored in `public/images/institutes/*.webp`.
  `src/components/InstituteCard.tsx` maps known demo IDs and normalized production
  institute names to those filenames. Current assets: `inst-aut`, `inst-canterbury`,
  `inst-eit`, `inst-lincoln`, `inst-massey`, `inst-otago`, `inst-unitec`,
  `inst-uoa`, `inst-vuw`, `inst-waikato`.

## Known limitations / cautions

- Public `/api/reports` has **no spam protection** (no CAPTCHA/rate limit) — only
  required-message validation. Known gap; do not fake protection.
- No sitemap.xml, robots.txt, or structured data yet.
- Branding strings are repeated across pages (no central site config).
- Production Supabase holds real data (user-confirmed 2026-07-08). Any remaining
  "(DEMO)"-labelled seed entries are placeholders; never invent data.
- CSV importer matches by exact normalized name; create-or-skip only (no update).
- npm audit warnings exist from the `@vercel/analytics` install (unaddressed).
- Production admin actions need the user's real `ADMIN_TOKEN` — never request or log it.
- `src/pages/manage/index.tsx` (~785 lines) is the most complex file; it was NOT
  restyled in the redesign (deliberately out of scope).
- Image matching for institute cards is deliberately explicit. If production
  Supabase has provider names that differ from the current normalized-name checks,
  add a mapping in `InstituteCard.tsx` rather than relying on broad fuzzy matching.

## Exact next task

1. Verify the deployed institute-card images on https://www.nzstudy.help/ after the
   Vercel deploy, especially AUT, EIT/Eastern Institute of Technology, Lincoln,
   Auckland, Otago, Victoria University of Wellington, Canterbury, Waikato, Massey,
   and Unitec cards on desktop and mobile.
2. Ongoing data upkeep: keep agent listings verified against official institute
   pages via the CSV importer in `/manage`.
3. Next feature-quality tasks (see TASKS.md): report-form spam protection,
   robots.txt/sitemap, privacy policy.
