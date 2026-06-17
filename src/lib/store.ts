/**
 * Local JSON-file store for DEMO mode (no Supabase configured).
 * Lets the admin page persist data during local development.
 * In production, Supabase is the source of truth and this file is unused.
 *
 * Server-side only (uses fs). Never import from client components.
 */
import fs from 'fs';
import path from 'path';
import type { Institute, Agency, Representation } from './types';
import {
  institutes as seedInstitutes,
  agencies as seedAgencies,
  representations as seedRepresentations,
} from './seed';

export interface Report {
  id: string;
  institute_id?: string;
  agency_id?: string;
  message: string;
  reporter_contact?: string;
  resolved: boolean;
  created_at: string;
}

export interface StoreData {
  institutes: Institute[];
  agencies: Agency[];
  representations: Representation[];
  reports: Report[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

function seedData(): StoreData {
  return {
    institutes: [...seedInstitutes],
    agencies: [...seedAgencies],
    representations: [...seedRepresentations],
    reports: [],
  };
}

export function readStore(): StoreData {
  try {
    if (!fs.existsSync(STORE_FILE)) {
      const data = seedData();
      writeStore(data);
      return data;
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreData>;
    // Backfill any missing collections
    return {
      institutes: parsed.institutes ?? [],
      agencies: parsed.agencies ?? [],
      representations: parsed.representations ?? [],
      reports: parsed.reports ?? [],
    };
  } catch {
    return seedData();
  }
}

export function writeStore(data: StoreData): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/** Reset the store back to seed data (used by admin "reset demo data"). */
export function resetStore(): StoreData {
  const data = seedData();
  writeStore(data);
  return data;
}
