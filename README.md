# New Zealand Study Planner - Bangladesh

A free, student-friendly guide for Bangladeshi students planning to study in
New Zealand — live at **https://www.nzstudy.help/**.

Its core feature is the **NZ Study Agent Directory - Bangladesh**: students select
a New Zealand institute and see its official authorized education agents in
Bangladesh with full contact details, the official source link, and a
last-verified date.

## Who it's for

Bangladeshi students (and their families) researching New Zealand study options
who need trustworthy, source-backed information in one place.

## Features

- **Institute directory** — searchable/filterable list of NZ institutes; each
  detail page lists its authorized agents in Bangladesh with source links.
- **Agencies** — browse agencies and see which institutes each one represents.
- **Student Visa FAQ** — common questions with links to official
  Immigration New Zealand / Study with New Zealand sources.
- **Interview questions** — sample student-visa interview questions by topic.
- **Cost calculator** — estimate tuition, living cost, one-time expenses, and an
  approximate BDT equivalent (exchange rate auto-fetched from the Frankfurter API,
  manually editable).
- **Report outdated info** — public form so students can flag incorrect listings.
- **Admin panel** — token-gated management UI with bulk CSV import.

## Tech stack

- **Next.js 14** (Pages Router, TypeScript strict, ISR)
- **Tailwind CSS 3** (navy `ink` + teal `accent` design tokens)
- **Supabase** (PostgreSQL + Row Level Security); local JSON file-store demo mode
  when Supabase env vars are absent
- **Vercel** (hosting + analytics)

## Local development

```bash
npm install
cp .env.example .env.local   # optional — leave unset for demo mode
npm run dev                  # http://localhost:3000
```

Other commands:

```bash
npx tsc --noEmit   # type check
npm run lint       # lint
npm run build      # production build
npm start          # serve the production build
```

Without Supabase env vars the app runs in **demo mode** (seed data in a local
`.data/store.json`); with them it reads/writes Supabase.

## Deployment

Pushing to `main` on GitHub triggers a Vercel deployment. Environment variables
(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TOKEN`) are managed in the Vercel dashboard
and are never committed.

Optional asset: place a New Zealand landscape photo at `public/images/hero-nz.jpg`
(see `public/images/README.md`) to enable the photo hero on the homepage.

## CSV importer (admin)

One CSV row = one institute↔agency link. Required columns: `institute_name`,
`agency_name`, `agency_city`, `source_url`. Existing records match by id or exact
normalized name; missing ones are created; duplicate links are skipped. Template:
`templates/csv-import-template.csv` (also downloadable from the admin panel).

## Disclaimer

This website is **unofficial** and for information purposes only. It is not
immigration advice and is not affiliated with any New Zealand government body,
immigration authority, institute, or agency. Data is collected from publicly
available pages on official New Zealand institute websites; agent authorizations
can change at any time. **Always verify an agent's authorization directly with
the institute before signing agreements or making payments.**

## For AI coding agents

Working instructions live in `CLAUDE.md` (applies to Codex and other agents too).
Start with `SESSION_HANDOFF.md`, then `PROJECT_STATE.md` / `TASKS.md` / `DECISIONS.md`.
