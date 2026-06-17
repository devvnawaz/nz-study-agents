# PROJECT_STATE.md

_Last updated: 2026-06-17 — checkpoint after admin panel build._

## 1. Current project goal

Build a website where Bangladeshi students wanting to study in New Zealand can
**select an NZ institute and instantly see its authorized education agents in
Bangladesh**, with contact details (phone, email, website, address, contact
person), a link to the official source page, and a "last verified" date.

The data currently lives scattered across each institute's own website; this
project centralizes it into one searchable directory. The idea came from a
WhatsApp group for NZ student-visa applicants who repeatedly ask "who are the
authorized agents for [institute] in Bangladesh?".

Chosen stack ("Option 1: Simple and fast"): **Next.js + Supabase + Vercel**.

## 2. Files changed / created so far

Project root: `~/nz-study-agents` (`/Users/nawaz/nz-study-agents`)

### Config / tooling
- `package.json` — deps: next 14.2.5, react 18.3.1, @supabase/supabase-js 2.45.0; dev: typescript, tailwind, postcss, autoprefixer, types
- `tsconfig.json` — `@/*` path alias → `./src/*`
- `tailwind.config.js` — custom `brand` palette + `nz.black` / `nz.red`
- `postcss.config.js`
- `next.config.js` — `reactStrictMode: true`
- `.env.example` — Supabase URL/anon key, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TOKEN`
- `.gitignore` — ignores `node_modules/`, `.next/`, `.env*`, `.data/`
- `next-env.d.ts`
- `README.md` — setup, deploy, data model, **admin panel docs**

### Database
- `supabase/schema.sql` — tables: `institutes`, `agencies`, `representations`,
  `reports`; indexes; RLS (public read; public insert on reports; writes via
  service role only)

### Data layer (`src/lib/`)
- `types.ts` — `Institute`, `Agency`, `Representation`, `AgencyForInstitute`,
  `InstituteForAgency`, `InstituteType`, `AuthorizationStatus`
- `seed.ts` — 18 real NZ institutes; **4 placeholder DEMO agencies**; 16 demo links
- `supabase.ts` — public anon client; `isSupabaseConfigured` flag (detects placeholder values)
- `supabaseAdmin.ts` — **service-role** client, server-only
- `adminAuth.ts` — `checkAdminToken()` verifies `x-admin-token` header / cookie
- `store.ts` — **JSON file-store** (`.data/store.json`) for demo-mode persistence (server-only, uses `fs`)
- `data.ts` — read layer; Supabase when configured, else file-store; dynamic-imports `store.ts` so `fs` never reaches client bundles
- `utils.ts` — icon/badge/label/date formatting helpers

### Hooks
- `src/hooks/useAdminApi.ts` — typed fetch wrapper; stores token in `localStorage`, attaches `x-admin-token`

### Components (`src/components/`)
- `Layout.tsx`, `Navbar.tsx`, `Footer.tsx` (Footer now links to `/admin`)
- `InstituteCard.tsx`, `AgencyCard.tsx`, `SearchExplorer.tsx`
- `Disclaimer.tsx`, `DemoBanner.tsx`

### Pages (`src/pages/`)
- `_app.tsx`, `_document.tsx`, `404.tsx`
- `index.tsx` — home: hero, stats, search/filter explorer
- `institutes/index.tsx` — all institutes + search
- `institutes/[id].tsx` — institute detail + its agents (SSG, `fallback: 'blocking'`)
- `agencies/index.tsx` — all agencies + search
- `agencies/[id].tsx` — agency detail + institutes it represents
- `about.tsx` — about + disclaimer
- `report.tsx` — "report outdated info" form (posts to `/api/reports`)
- `admin/index.tsx` — **admin panel**: token gate + 4 tabs (Agencies/Institutes/Links/Reports)

### API routes (`src/pages/api/`)
- `reports.ts` — public POST endpoint for student reports
- `admin/agencies.ts` — GET/POST/PUT/DELETE (token-gated)
- `admin/institutes.ts` — GET/POST/DELETE
- `admin/representations.ts` — GET/POST/DELETE (dedup → 409)
- `admin/reports.ts` — GET/PATCH (mark resolved)

## 3. Important decisions made

1. **Manual scaffold** instead of `create-next-app` — avoids interactive prompts; full control.
2. **Pages Router** (not App Router) — simpler ISR + API routes for this use case.
3. **Demo-mode fallback** — app runs fully without Supabase. `isSupabaseConfigured`
   switches reads between Supabase and the local JSON file-store. Lets us develop/demo
   with zero setup; flips to DB automatically when env vars are added.
4. **Security model**: anon key = public reads only; all writes go through
   server-side `/api/admin/*` routes that check `ADMIN_TOKEN`, then write with the
   service-role key. Service-role key never reaches the browser.
5. **Source transparency baked in** — every agency listing carries `source_url`,
   `authorization_status`, and `last_verified_at`. Disclaimers on home/about/detail pages.
6. **Placeholder agency data is clearly labelled "(DEMO)"** — real agent data must
   be verified from official institute pages before publishing. Institute names are
   real but their `representative_page_url`s are **constructed/unverified guesses**.
7. **ISR** with `revalidate: 3600` on public pages; `fallback: 'blocking'` for new detail pages.
8. Single shared admin token (fine for 1–2 trusted admins); real multi-user auth
   deferred to a future Supabase Auth upgrade.

## 4. Current bug / problem being solved

**None active.** Build is green, dev server runs, all admin flows verified.
This checkpoint is a state-preservation step before continuing to the next feature.

## 5. What has already been tried (and resolved)

- TS union-type error in `data.ts`: Supabase rows cast `authorization_status` to
  `string` instead of `AuthorizationStatus` → fixed by importing the union type and casting to it.
- `<title>` hydration warnings on dynamic pages (mixed expression + text children)
  → fixed by using single template-literal titles.
- Two dev servers ran simultaneously (ports 3000 + 3001) causing a confusing 404
  → resolved by `pkill -f "next dev"` then starting one clean instance.
- `Module not found: Can't resolve 'fs'` — `report.tsx` imported `submitReport`
  from `data.ts`, which pulled the `fs`-using store into the client bundle
  → fixed by creating `/api/reports` and having the page POST to it; `data.ts`
  now dynamic-imports `store.ts`.
- `Agency` type: `null` vs `undefined` mismatch on optional fields in
  `admin/agencies.ts` → fixed by using `|| undefined` instead of `?? null`.
- First-hit cold-compile of an API route returned an empty body once (JSON parse
  error in test) → not a real bug; route returns 201 once warm.

## 6. Commands that worked

```bash
# Environment
node --version            # v22.17.0
npm --version             # 10.9.2

# Project setup
mkdir -p ~/nz-study-agents && cd ~/nz-study-agents && git init -q
npm install               # installed cleanly

# Build & run
npm run build             # passes — 30 routes (after fixes)
npm run dev               # serves on http://localhost:3000

# Start dev in background + wait until ready
(npm run dev > /tmp/nz-dev.log 2>&1 &)
until grep -q "Ready in" /tmp/nz-dev.log; do sleep 0.5; done

# Kill stray servers
pkill -f "next dev"

# Reset demo data (regenerates from seed on next read)
rm -rf .data

# Admin API smoke tests (all passed)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/admin/agencies            # 401 (no token)
curl -s -H "x-admin-token: dev" http://localhost:3000/api/admin/agencies                   # 200
curl -s -X POST -H "x-admin-token: dev" -H "Content-Type: application/json" \
  -d '{"name":"...","city":"Dhaka"}' http://localhost:3000/api/admin/agencies              # 201
# duplicate representation -> 409; missing field -> 400; delete cascade verified
```

## 7. Commands / errors that failed (and why)

- `npm run build` (1st) — TS error: `string` not assignable to `AuthorizationStatus` in `data.ts`. → fixed.
- `npm run build` (2nd) — TS error: `string | null` vs `string | undefined` on `Agency.contact_person` in `admin/agencies.ts`. → fixed.
- `npm run build` (3rd) — webpack: `Module not found: Can't resolve 'fs'` via `report.tsx → data.ts → store.ts`. → fixed.
- Test step "create institute" once printed a Python `JSONDecodeError` because the
  first request hit an uncompiled route and returned empty — transient, not a code bug.
- Visiting `http://localhost:3000/...` returned 404 during the two-servers incident
  (correct server was on 3001). → resolved by killing all and restarting one.

## 8. Remaining tasks in priority order

1. **(b) CSV importer** — bulk-load agencies + links from a spreadsheet (admin upload
   or a Node script reading CSV). Highest leverage for entering many records.
2. **(c) Real verified data** — replace DEMO agencies; verify each institute's real
   `representative_page_url` and authorized agents from official sources.
3. **Connect Supabase** — create project, run `supabase/schema.sql`, set env vars,
   migrate seed/store data into the DB.
4. **Deploy to Vercel** — set env vars (`NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_TOKEN`).
5. **SEO pages** — e.g. "Authorized agents for University of Auckland in Bangladesh".
6. **Multi-user admin auth** (Supabase Auth) — if more than 1–2 admins.
7. **Git**: nothing committed yet (`git init` done, no commits). Consider first commit.

## 9. Assumptions / constraints given by the user

- Audience: Bangladeshi students seeking authorized NZ education agents.
- Data should be organized **by institute** → list that institute's BD agents.
- Required fields per agent: contact, website, location, address.
- Stack explicitly chosen: **Option 1 — Next.js + Supabase + Vercel**.
- User asked to **build the site**, then specifically to **build the admin page (option a)**.
- Implicit (from earlier discussion): trust/verification matters — source links,
  "last verified" dates, disclaimers; don't present paid agencies as "more authorized".

## 10. Exact next step after this checkpoint

Begin **task (b): the CSV importer.** Plan:
- Define a CSV column format (institute name/id, agency name, city, address, phone,
  email, website, contact person, source URL, authorization status, last verified).
- Add an admin "Import CSV" capability: file upload → server parses → upserts
  agencies, matches/creates institutes, creates representations (skip duplicates),
  return a per-row success/error summary.
- Make it work in both demo (file-store) and Supabase modes, reusing existing logic.
- Provide a sample `.csv` template + README docs.

No code has been changed in this checkpoint — state preserved only.
