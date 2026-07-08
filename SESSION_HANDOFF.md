# SESSION_HANDOFF.md

_Read this first. Immediate handoff for the next AI/dev session (Codex, Claude Code,
or human). Updated 2026-07-08 (end of session)._

## Snapshot

- **Project:** New Zealand Study Planner - Bangladesh — https://www.nzstudy.help/
- **Repo:** `~/nz-study-agents`, remote = github.com/devvnawaz/nz-study-agents, branch `main`
- **Stack:** Next.js 14 (Pages Router), TypeScript strict, Tailwind 3, Supabase, Vercel
- **Latest commits:** `841144c` (Unitec image + .gitignore), `3f70f00` (spam protection)
- **Working tree:** clean; `npm run build` passes.

## What changed in this session

1. **Live-site image verification** (no code change) — all 10 institute card
   images + hero photo confirmed rendering on production against real Supabase
   names (UUID IDs → name-based matching), including the
   "Eastern Institute of Technology - EIT" variant. Zero gradient fallbacks.
2. **Report-form spam protection** (`3f70f00`):
   - `src/pages/api/reports.ts` — in-memory rate limit (5 per 10 min per IP via
     `src/lib/rateLimit.ts`, 429 + `Retry-After`); honeypot check (`website`
     field → fake 201, nothing stored); message ≤ 5000 / contact ≤ 320 caps.
   - `src/pages/report.tsx` — hidden honeypot input (off-screen, `aria-hidden`,
     `tabIndex=-1`, `autoComplete="off"`); form otherwise unchanged.
3. **Housekeeping** (`841144c`) — `.gitignore` now covers `.DS_Store` and
   `tsconfig.tsbuildinfo`; Unitec card image replaced with an updated photo
   (verified serving on production, byte-identical to local).

## Known issues / risks

- The public rate limiter is **in-memory / per-serverless-instance** on Vercel —
  best-effort, not globally strict. Documented upgrade path: distributed limiter
  (e.g. Upstash) if spam persists. Do NOT fake stronger protection.
- No robots.txt / sitemap / structured data yet (top backlog item).
- Local `.data/store.json` contains throwaway test reports from this session's
  local verification — harmless, gitignored, dev-only.
- Dev-server tip: don't run `npm run build` while `next dev` is running — they
  share `.next` and the dev server can crash with MODULE_NOT_FOUND; clean with
  `rm -rf .next` and restart if it happens.

## What should be tested

- On production (optional): 6 rapid `/report` submissions → 6th should return 429;
  honeypot-filled POST returns 201 but stores nothing.
- Report form still submits normally for real users (verified locally: 201 +
  stored; empty message → 400).
- Unitec card photo crop looks right in the `h-36` header on desktop + mobile.

## What should be done next

1. **SEO basics** (top of TASKS.md) — `public/robots.txt` + sitemap; consider
   JSON-LD for FAQ/directory pages.
2. **Privacy policy page** — if/when the user wants one.
3. Ongoing verified-data upkeep via the CSV importer in `/manage`.

## Important constraints (unchanged)

- **Do not commit or push unless the user asks.**
- Never touch Vercel env vars; never request/log the real `ADMIN_TOKEN`.
- Don't break: SearchExplorer filters, calculator math/Frankfurter fetch, FAQ
  `<details>` accordions, `/api/reports` JSON contract (now includes optional
  `website` honeypot key), admin `/manage` (not restyled, intentional).
- No login/auth features; site is not immigration advice; never invent data.
- Branding: site = "New Zealand Study Planner - Bangladesh"; short = "NZ Study
  Planner"; "NZ Study Agent Directory - Bangladesh" only for the directory feature.

## How to run and verify

```bash
npm run dev        # local server (auto-picks port if 3000 busy)
npx tsc --noEmit   # type check
npm run build      # must pass before any commit
```

Manual checks: `/` (hero photo + floating search + institute card images),
`/institutes` (image cards + filters), `/institutes/[id]`, `/agencies`,
`/faq` (accordions), `/cost-calculator` (30000/0/1.5yr/20000/5000 → NZD 80,000;
rate fetch + manual edit), `/report` (submits; honeypot hidden), mobile menu.

## Memory files map

- **CLAUDE.md** — how to work in this repo (applies to Codex and other agents too).
- **PROJECT_STATE.md** — current source of truth + exact next task.
- **TASKS.md** — Now / Next / Later / Done backlog.
- **DECISIONS.md** — product + technical decisions and rationale.
- **CHANGELOG.md** — completed change history.
