# SESSION_HANDOFF.md

_Read this first. Immediate handoff for the next AI/dev session (Codex, Claude Code,
or human). Written 2026-07-08._

## Snapshot

- **Project:** New Zealand Study Planner - Bangladesh — https://www.nzstudy.help/
- **Repo:** `~/nz-study-agents`, remote = github.com/devvnawaz/nz-study-agents, branch `main`
- **Stack:** Next.js 14 (Pages Router), TypeScript strict, Tailwind 3, Supabase, Vercel
- **Latest commit:** `2914959` — "Redesign UI with navy and teal theme"

## Most recently completed

A **full visual redesign** (navy `ink` + teal `accent` theme, matching the user's
reference screenshot) shipped across every public page (commit `2914959`): dark
header/footer, new homepage hero with floating search card, gradient-header
institute cards, new `PageHeader`/`Alert`/`icons` components. User reviewed and
approved it locally; build passes. The project memory files were also rewritten
for cross-agent handoff. Details in PROJECT_STATE.md and CHANGELOG.md.

## Currently in progress

- Nothing mid-flight. Vercel auto-deploys `main` on push — verify the live site
  after deploy.

## Next recommended task

1. Verify the deployed redesign at https://www.nzstudy.help/ (all pages + mobile).
2. Optional: user drops a NZ landscape photo at `public/images/hero-nz.jpg`
   (spec in `public/images/README.md`) — hero upgrades automatically, no code change.
3. Then pick from TASKS.md "Next": report-form spam protection, robots.txt/sitemap,
   privacy policy, or ongoing verified-data upkeep via the CSV importer.

## How to run and verify

```bash
npm run dev        # local server (auto-picks port if 3000 busy)
npx tsc --noEmit   # type check
npm run build      # must pass before any commit
```

Manual checks: `/` (hero + floating search), `/institutes`, `/institutes/inst-uoa`,
`/agencies`, `/faq` (accordions), `/cost-calculator` (30000/0/1.5yr/20000/5000 →
NZD 80,000; rate fetch + manual edit), `/report` (submits in demo mode), mobile menu.

## Important warnings

- **Do not commit or push unless the user asks.**
- **Do not** add or change Vercel env vars; never request/log the real `ADMIN_TOKEN`.
- **Do not** break: SearchExplorer filter logic, calculator math/fetch, FAQ
  `<details>` accordions, report POST contract (`/api/reports`), admin `/manage`.
- **Do not** invent agency/institute data; "(DEMO)" entries are placeholders.
- **Do not** add login/auth or fake spam protection; site is not immigration advice.
- Admin `/manage` was deliberately NOT restyled — leave it unless asked.
- Delete `tsconfig.tsbuildinfo` before committing; never commit `.data/` or `.env*`.

## Files likely to be touched next

- If redesign feedback: `src/components/*` (Navbar, Footer, HeroBackdrop,
  InstituteCard, SearchExplorer, PageHeader, Alert), `src/pages/index.tsx`,
  `src/styles/globals.css`, `tailwind.config.js`.
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
