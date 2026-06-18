# SESSION_HANDOFF.md

_Concise handoff for the next Claude Code session. Written 2026-06-18._

## Snapshot

- **Project:** NZ Study Agent Directory (Bangladeshi students → authorized NZ agents).
- **Repo:** `~/nz-study-agents`, remote `origin` = github.com/devvnawaz/nz-study-agents.
- **Branch:** `main`
- **Latest commit:** `8a02aa2` — "Add CSV importer and remove Admin link from footer"
- **Working tree:** clean at handoff time (only memory files updated in this session afterward).
- **Live URL:** https://nz-study-agents.vercel.app
- **Stack:** Next.js 14 (Pages Router), TypeScript, Tailwind, Supabase, Vercel.

## Completed in the last working session

1. **CSV Importer** (pushed in `8a02aa2`):
   - `src/pages/api/admin/import-csv.ts` (token-gated import + GET template)
   - CSV Import tab in `src/pages/admin/index.tsx`
   - `src/lib/csvImport.ts` (parse/validate/template/types)
   - `templates/csv-import-template.csv`
   - README docs
   - Verified locally in demo mode: first import created a link; re-import skipped duplicate.
2. **Footer edit** (pushed in `8a02aa2`): removed public Admin link; no other public
   admin links remain. `/admin` route still works directly.

## Next task (do this first)

Run a **production CSV import smoke test** with the real `ADMIN_TOKEN`:
1. `https://nz-study-agents.vercel.app/admin` → sign in.
2. CSV Import tab → small CSV (1 institute + 1 agency + 1 source URL).
3. Expect `created: 1`, `errors: 0`; re-import expects `skipped: 1`.
4. After ISR/redeploy, confirm the public institute page shows the agency.
Then proceed to real verified data collection/import.

## How the importer works (quick reference)

- One CSV row = one institute↔agency link.
- Required: `institute_name`, `agency_name`, `agency_city`, `source_url`.
- Matches existing by id or exact normalized name; creates missing; skips duplicate links.
- `authorization_status`: authorized | unverified | expired (default authorized).
- Quote cells containing commas. Works in demo (file-store) and Supabase modes.

## Warnings / do-not

- **Do not** add or re-add Vercel env vars — the user already configured them.
- **Do not** request or log the real `ADMIN_TOKEN`.
- **Do not** start new features — feature work is paused; verify production import first.
- **Do not** commit `.data/` (local file-store) — it is gitignored; remove after local tests.
- Treat seed/"(DEMO)" agencies as placeholders, not verified data.
- Importer is create-or-skip (no update of existing links); name matching is exact.
- Open npm audit warnings exist from `@vercel/analytics` install (not yet addressed).

## Memory files to read on resume

- `PROJECT_STATE.md` — full current status + next task.
- `TASKS.md` — Done / Next / follow-ups / Backlog / Blocked.
- `DECISIONS.md` — architecture + CSV importer decisions.
- `CHANGELOG.md` — feature history.
