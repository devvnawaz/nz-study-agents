-- =============================================================
-- NZ Study Agent Directory — Supabase / PostgreSQL schema
-- Run this in the Supabase SQL editor.
-- =============================================================

create extension if not exists "pgcrypto";

-- ---------- Institutes ----------
create table if not exists institutes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in (
    'University', 'Polytechnic', 'Private Institute', 'English Language School'
  )),
  city_in_nz text not null,
  official_website text not null,
  representative_page_url text not null,
  last_checked_at date not null default current_date,
  created_at timestamptz not null default now()
);

-- ---------- Agencies (in Bangladesh) ----------
create table if not exists agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null default 'Bangladesh',
  city text not null,
  address text not null default '',
  phone text not null default '',
  email text not null default '',
  website text not null default '',
  contact_person text,
  notes text,
  created_at timestamptz not null default now()
);

-- ---------- Institute <-> Agency relationships ----------
create table if not exists representations (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid not null references institutes(id) on delete cascade,
  agency_id uuid not null references agencies(id) on delete cascade,
  source_url text not null,
  authorization_status text not null default 'authorized'
    check (authorization_status in ('authorized', 'unverified', 'expired')),
  last_verified_at date not null default current_date,
  created_at timestamptz not null default now(),
  unique (institute_id, agency_id)
);

create index if not exists idx_repr_institute on representations(institute_id);
create index if not exists idx_repr_agency on representations(agency_id);
create index if not exists idx_institutes_type on institutes(type);
create index if not exists idx_agencies_city on agencies(city);

-- ---------- Outdated-info reports from users ----------
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  institute_id uuid references institutes(id) on delete set null,
  agency_id uuid references agencies(id) on delete set null,
  message text not null,
  reporter_contact text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

-- =============================================================
-- Row Level Security: allow public READ, restrict writes.
-- =============================================================
alter table institutes enable row level security;
alter table agencies enable row level security;
alter table representations enable row level security;
alter table reports enable row level security;

-- Public can read directory data
create policy "public read institutes" on institutes for select using (true);
create policy "public read agencies" on agencies for select using (true);
create policy "public read representations" on representations for select using (true);

-- Public can submit a report (insert only)
create policy "public insert reports" on reports for insert with check (true);

-- NOTE: Inserts/updates to directory tables should be done with the
-- service_role key from a trusted admin context only.
