# SESSION_HANDOFF.md

_Read this first. Immediate handoff for the next AI/dev session (Codex, Claude Code,
or human). Updated 2026-07-08._

## Snapshot

- **Project:** New Zealand Study Planner - Bangladesh — https://www.nzstudy.help/
- **Repo:** `~/nz-study-agents`, remote = github.com/devvnawaz/nz-study-agents, branch `main`
- **Stack:** Next.js 14 (Pages Router), TypeScript strict, Tailwind 3, Supabase, Vercel
- **Latest app-change commit before this handoff update:** `45a0f8a` — "Add more institute card images"

## Most recently completed

Recent image work shipped after the full redesign:

- `public/images/hero-nz.jpg` was added for the homepage hero backdrop.
- `src/components/InstituteCard.tsx` now renders local WebP photo headers when
  available, with the original gradient/type-icon header as fallback.
- Institute card assets live in `public/images/institutes/`: `inst-aut.webp`,
  `inst-canterbury.webp`, `inst-eit.webp`, `inst-lincoln.webp`,
  `inst-massey.webp`, `inst-otago.webp`, `inst-unitec.webp`, `inst-uoa.webp`,
  `inst-vuw.webp`, `inst-waikato.webp`.
- Image matching supports local/demo IDs and normalized production institute
  names because Supabase production IDs may be UUIDs. EIT needed special handling
  for naming variants.

Build passed after the image-mapping changes.

## Currently in progress

- Nothing mid-flight. The latest image changes were pushed to `main`, so Vercel
  should auto-deploy. Local untracked files are only macOS `.DS_Store` files at
  repo root, `public/`, and `public/images/`; do not commit them.

## Next recommended task

1. Verify deployed institute-card images at https://www.nzstudy.help/ on the
   homepage and `/institutes`, including mobile widths. Specifically check AUT,
   EIT/Eastern Institute of Technology, Lincoln, UoA, Otago, VUW, Canterbury,
   Waikato, Massey, and Unitec.
2. If any provider image is missing on production, inspect the exact Supabase
   institute name and add an explicit normalized-name mapping in
   `src/components/InstituteCard.tsx`.
3. Then pick from TASKS.md "Next": robots.txt/sitemap, privacy policy, or ongoing
   verified-data upkeep via the CSV importer.

## How to run and verify

```bash
npm run dev        # local server (auto-picks port if 3000 busy)
npx tsc --noEmit   # type check
npm run build      # must pass before any commit
```

Manual checks: `/` (hero photo + floating search + institute card images),
`/institutes` (image cards + filters), `/institutes/inst-uoa`, `/agencies`,
`/faq` (accordions), `/cost-calculator` (30000/0/1.5yr/20000/5000 → NZD 80,000;
rate fetch + manual edit), `/report` (submits in demo mode), mobile menu.

## Important warnings

- **Do not commit or push unless the user asks.**
- **Do not** add or change Vercel env vars; never request/log the real `ADMIN_TOKEN`.
- **Do not** break: SearchExplorer filter logic, calculator math/fetch, FAQ
  `<details>` accordions, report POST contract (`/api/reports`), admin `/manage`.
- **Do not** invent agency/institute data; "(DEMO)" entries are placeholders.
- **Do not** fetch card images from remote URLs. Use compressed local WebP assets
  in `public/images/institutes/` and explicit mappings in `InstituteCard.tsx`.
- **Do not** add login/auth or fake spam protection; site is not immigration advice.
- Admin `/manage` was deliberately NOT restyled — leave it unless asked.
- Delete `tsconfig.tsbuildinfo` before committing; never commit `.data/`, `.env*`,
  or `.DS_Store`.

## Files likely to be touched next

- If redesign feedback: `src/components/*` (Navbar, Footer, HeroBackdrop,
  InstituteCard, SearchExplorer, PageHeader, Alert), `src/pages/index.tsx`,
  `src/styles/globals.css`, `tailwind.config.js`.
- If image-card follow-up: `src/components/InstituteCard.tsx` and
  `public/images/institutes/*.webp`.
- If data work: `/manage` CSV import flow (`src/lib/csvImport.ts`,
  `src/pages/api/admin/import-csv.ts`), `templates/*.csv`.
- If SEO/protection follow-ups: `public/robots.txt` + sitemap (new),
  `src/pages/api/reports.ts` (rate limit via existing `src/lib/rateLimit.ts`).

## Memory files map

- **CLAUDE.md** — how to work in this repo (applies to Codex and other agents too).
- **PROJECT_STATE.md** — current source of truth + exact next task.
- **TASKS.md** — Now / Next / Later / Done backlog.
- **DECISIONS.md** — product + technical decisions and rationale.
- **CHANGELOG.md** — completed change history.
