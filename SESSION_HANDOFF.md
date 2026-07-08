# SESSION_HANDOFF.md

_Read this first. Immediate handoff for the next AI/dev session (Codex, Claude Code,
or human). Updated 2026-07-09 (end of session)._

## Snapshot

- **Project:** New Zealand Study Planner - Bangladesh — https://www.nzstudy.help/
- **Repo:** `~/nz-study-agents`, remote = github.com/devvnawaz/nz-study-agents, branch `main`
- **Stack:** Next.js 14 (Pages Router), TypeScript strict, Tailwind 3, Supabase, Vercel
- **Latest code commits:** `841144c` (Unitec image + .gitignore), `3f70f00` (spam protection)
- **Working tree:** clean; `npm run build` passes. **No code changes this session.**

## What changed in this session

**Planning only — zero code changes.** The user proposed a student **visa checklist**
feature; it was assessed as valuable and a full plan was agreed in principle:

- Route `/visa-checklist`; one profile-driven page (study level × family situation
  chips), checklist composed from typed modules (base / master's / spouse /
  children), checkboxes with progress saved to localStorage, cautious wording +
  INZ source links per item, grouped sections, no DB/API/dependency changes.
- Full spec: PROJECT_STATE.md "Planned feature" section + DECISIONS.md
  "Visa checklist feature — planning decisions".

**⚠️ Build is blocked on two user answers** (asked, not yet answered):
1. Content source — agent drafts cautious wording + INZ links (like the FAQ), or
   the user supplies a prepared list?
2. Study levels — Bachelor's/Master's only, or also PhD / diploma-polytechnic?

If the user answers these, build the feature per the spec. Do not start without
the answers.

## Files/components updated this session

- Context files only: PROJECT_STATE.md, TASKS.md, DECISIONS.md, SESSION_HANDOFF.md
  (CHANGELOG.md deliberately unchanged — nothing shipped).

## Known issues / risks (unchanged from last session)

- Public `/api/reports` rate limiter is in-memory / per-serverless-instance on
  Vercel — best-effort. Upgrade path: distributed limiter if spam persists.
- No robots.txt / sitemap / structured data yet.
- Local `.data/store.json` holds throwaway dev test reports (gitignored).
- Dev tip: don't run `npm run build` while `next dev` is running (shared `.next`
  can corrupt; fix with `rm -rf .next` + restart).

## What should be tested (when next session makes changes)

- Nothing pending from this session. Standard checks remain: `/` hero + cards,
  `/institutes` filters, `/faq` accordions, `/cost-calculator`
  (30000/0/1.5yr/20000/5000 → NZD 80,000), `/report` submit + honeypot hidden,
  mobile menu.

## What should be done next

1. **Visa checklist feature** — once the two open questions are answered.
2. **SEO basics** — `public/robots.txt` + sitemap; consider JSON-LD.
3. **Privacy policy page** — if/when the user wants one.
4. Ongoing verified-data upkeep via the CSV importer in `/manage`.

## Important constraints (unchanged)

- **Do not commit or push unless the user asks.**
- Never touch Vercel env vars; never request/log the real `ADMIN_TOKEN`.
- Don't break: SearchExplorer filters, calculator math/Frankfurter fetch, FAQ
  `<details>` accordions, `/api/reports` JSON contract (includes optional
  `website` honeypot key), admin `/manage` (not restyled, intentional).
- No login/account features; site is not immigration advice; never invent data.
- Branding: site = "New Zealand Study Planner - Bangladesh"; short = "NZ Study
  Planner"; "NZ Study Agent Directory - Bangladesh" only for the directory feature.

## How to run and verify

```bash
npm run dev        # local server (auto-picks port if 3000 busy)
npx tsc --noEmit   # type check
npm run build      # must pass before any commit
```

## Memory files map

- **CLAUDE.md** — how to work in this repo (applies to Codex and other agents too).
- **PROJECT_STATE.md** — current source of truth + planned checklist spec + next task.
- **TASKS.md** — Now / Next / Later / Done backlog.
- **DECISIONS.md** — product + technical decisions and rationale.
- **CHANGELOG.md** — completed change history.
