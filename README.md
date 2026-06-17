# NZ Study Agent Directory — Bangladesh

A free, community-maintained directory of authorized New Zealand education agents in Bangladesh.
Students select an institute in New Zealand and see its official authorized agents with full contact details.

## Tech stack

- **Next.js 14** (Pages Router, TypeScript, ISR)
- **Tailwind CSS 3**
- **Supabase** (PostgreSQL + Row Level Security)
- **Vercel** (hosting)

## Getting started

### 1. Clone and install

```bash
git clone <your-repo>
cd nz-study-agents
npm install
```

### 2. Run in demo mode (no database needed)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs on local seed data — good for development and testing.

### 3. Connect Supabase (for production)

1. Create a free project at [supabase.com](https://supabase.com)
2. In the Supabase SQL editor, run `supabase/schema.sql`
3. Copy `.env.example` to `.env.local` and fill in your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Add real agency data via the Supabase table editor or a CSV import

### 4. Deploy to Vercel

```bash
npx vercel
```

Add the two Supabase env vars in the Vercel project settings.

## Admin panel

Visit **`/admin`** to manage data through a web UI — no SQL needed.

### Signing in

The admin panel is protected by a token (the `ADMIN_TOKEN` env var).

- **Local demo mode:** if `ADMIN_TOKEN` is not set, the default token is `dev`.
- **Production:** set a strong `ADMIN_TOKEN` in `.env.local` / Vercel env vars.

### What you can do

| Tab | Actions |
|-----|---------|
| **Agencies** | Add, edit, and delete Bangladesh agencies (name, city, address, phone, email, website, contact person, notes) |
| **Institutes** | Add and delete NZ institutes |
| **Links** | Connect an agency to an institute with a source URL, authorization status, and verified date |
| **Reports** | Review and resolve student-submitted corrections |

Deleting an institute or agency automatically removes its links.

### How writes are secured

- Reads use the public **anon key** (browser-safe).
- All writes go through server-side API routes under `/api/admin/*`, which:
  1. verify the `x-admin-token` header against `ADMIN_TOKEN`, then
  2. use the **service-role key** (server-only) to write past Row Level Security.

The service-role key is never exposed to the browser. In demo mode (no Supabase),
writes persist to a local `.data/store.json` file (gitignored) so you can try the
admin panel without a database.

## Data structure

```
institutes        — New Zealand education providers
agencies          — Authorized representatives in Bangladesh
representations   — Links between institutes and agencies (many-to-many)
reports           — User-submitted corrections (admin review required)
```

See `supabase/schema.sql` for the full PostgreSQL schema with Row Level Security.

## Adding real agency data

1. For each institute, visit its official representative/agent page (URL stored in `representative_page_url`)
2. Enter each Bangladesh agent into the `agencies` table
3. Create the link in the `representations` table with `source_url` pointing to the official page and `last_verified_at` set to today
4. Agencies with `notes` containing "DEMO" or "Placeholder" should be replaced

**Never publish the demo/seed agencies.** They are illustrative only.

## Project structure

```
src/
  lib/
    types.ts        — TypeScript interfaces
    supabase.ts     — Supabase client (returns null when not configured)
    data.ts         — Data-access layer (Supabase + seed fallback)
    seed.ts         — Demo data for local development
    utils.ts        — Formatting helpers
  components/
    Layout.tsx
    Navbar.tsx
    Footer.tsx
    InstituteCard.tsx
    AgencyCard.tsx
    SearchExplorer.tsx
    Disclaimer.tsx
    DemoBanner.tsx
  pages/
    index.tsx         — Home + search
    institutes/
      index.tsx       — All institutes
      [id].tsx        — Institute detail + agent list
    agencies/
      index.tsx       — All agencies
      [id].tsx        — Agency detail + institutes list
    about.tsx
    report.tsx        — Report outdated info
    404.tsx
supabase/
  schema.sql          — PostgreSQL schema + RLS policies
```

## Disclaimer

This directory collects publicly available information from official New Zealand institute websites.
Always verify agent authorization directly with the institute before making payments or signing agreements.
This website is not affiliated with any New Zealand government body or immigration authority.
