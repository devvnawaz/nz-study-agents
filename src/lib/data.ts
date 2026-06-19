/**
 * Data-access layer.
 * READ path: Supabase when configured, local JSON file-store in demo mode.
 * WRITE path: handled by API routes (supabaseAdmin or store mutations).
 */
import type {
  Institute,
  Agency,
  AgencyForInstitute,
  InstituteForAgency,
  InstituteType,
  AuthorizationStatus,
} from './types';
import { getSupabase, isSupabaseConfigured } from './supabase';

// Dynamic import so `fs` is only touched server-side
async function getStore() {
  const { readStore } = await import('./store');
  return readStore();
}

// ──────────────────────────────────────────────────────────────────────
// Institutes
// ──────────────────────────────────────────────────────────────────────

export async function getAllInstitutes(): Promise<Institute[]> {
  if (!isSupabaseConfigured) {
    return (await getStore()).institutes;
  }
  const sb = getSupabase()!;
  const { data, error } = await sb.from('institutes').select('*').order('name');
  if (error) throw error;
  return data as Institute[];
}

export async function getInstituteById(id: string): Promise<Institute | null> {
  if (!isSupabaseConfigured) {
    return (await getStore()).institutes.find((i) => i.id === id) ?? null;
  }
  const sb = getSupabase()!;
  const { data, error } = await sb.from('institutes').select('*').eq('id', id).single();
  if (error) return null;
  return data as Institute;
}

export async function getInstitutesByType(type: InstituteType): Promise<Institute[]> {
  if (!isSupabaseConfigured) {
    return (await getStore()).institutes.filter((i) => i.type === type);
  }
  const sb = getSupabase()!;
  const { data, error } = await sb.from('institutes').select('*').eq('type', type).order('name');
  if (error) throw error;
  return data as Institute[];
}

// ──────────────────────────────────────────────────────────────────────
// Agencies
// ──────────────────────────────────────────────────────────────────────

export async function getAllAgencies(): Promise<Agency[]> {
  if (!isSupabaseConfigured) {
    return (await getStore()).agencies;
  }
  const sb = getSupabase()!;
  const { data, error } = await sb.from('agencies').select('*').order('name');
  if (error) throw error;
  return data as Agency[];
}

export async function getAgencyById(id: string): Promise<Agency | null> {
  if (!isSupabaseConfigured) {
    return (await getStore()).agencies.find((a) => a.id === id) ?? null;
  }
  const sb = getSupabase()!;
  const { data, error } = await sb.from('agencies').select('*').eq('id', id).single();
  if (error) return null;
  return data as Agency;
}

// ──────────────────────────────────────────────────────────────────────
// Agencies for an institute
// ──────────────────────────────────────────────────────────────────────

export async function getAgenciesForInstitute(
  instituteId: string
): Promise<AgencyForInstitute[]> {
  if (!isSupabaseConfigured) {
    const store = await getStore();
    const rels = store.representations.filter((r) => r.institute_id === instituteId);
    return rels.flatMap((r) => {
      const ag = store.agencies.find((a) => a.id === r.agency_id);
      if (!ag) return [];
      return [{
        ...ag,
        source_url: r.source_url,
        authorization_status: r.authorization_status,
        last_verified_at: r.last_verified_at,
      }];
    }).sort((a, b) => a.name.localeCompare(b.name));
  }

  const sb = getSupabase()!;
  const { data, error } = await sb
    .from('representations')
    .select('source_url, authorization_status, last_verified_at, agencies (*)')
    .eq('institute_id', instituteId);
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map((row) => ({
    ...(row.agencies as Agency),
    source_url: row.source_url as string,
    authorization_status: row.authorization_status as AuthorizationStatus,
    last_verified_at: row.last_verified_at as string,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

// ──────────────────────────────────────────────────────────────────────
// Institutes for an agency
// ──────────────────────────────────────────────────────────────────────

export async function getInstitutesForAgency(
  agencyId: string
): Promise<InstituteForAgency[]> {
  if (!isSupabaseConfigured) {
    const store = await getStore();
    const rels = store.representations.filter((r) => r.agency_id === agencyId);
    return rels.flatMap((r) => {
      const inst = store.institutes.find((i) => i.id === r.institute_id);
      if (!inst) return [];
      return [{
        ...inst,
        source_url: r.source_url,
        authorization_status: r.authorization_status,
        last_verified_at: r.last_verified_at,
      }];
    });
  }

  const sb = getSupabase()!;
  const { data, error } = await sb
    .from('representations')
    .select('source_url, authorization_status, last_verified_at, institutes (*)')
    .eq('agency_id', agencyId);
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data as any[]).map((row) => ({
    ...(row.institutes as Institute),
    source_url: row.source_url as string,
    authorization_status: row.authorization_status as AuthorizationStatus,
    last_verified_at: row.last_verified_at as string,
  }));
}

// ──────────────────────────────────────────────────────────────────────
// Submit a report
// ──────────────────────────────────────────────────────────────────────

export async function submitReport(payload: {
  institute_id?: string;
  agency_id?: string;
  message: string;
  reporter_contact?: string;
}): Promise<void> {
  if (!isSupabaseConfigured) {
    const { readStore, writeStore } = await import('./store');
    const store = readStore();
    store.reports.push({
      id: `report-${Date.now()}`,
      ...payload,
      resolved: false,
      created_at: new Date().toISOString(),
    });
    writeStore(store);
    return;
  }
  const sb = getSupabase()!;
  const { error } = await sb.from('reports').insert(payload);
  if (error) throw error;
}

// ──────────────────────────────────────────────────────────────────────
// Site-wide counts for the home page stat bar
// ──────────────────────────────────────────────────────────────────────

export interface SiteCounts {
  institutes: number;
  agencies: number;
  representations: number;
}

export async function getSiteCounts(): Promise<SiteCounts> {
  if (!isSupabaseConfigured) {
    const store = await getStore();
    return {
      institutes: store.institutes.length,
      agencies: store.agencies.length,
      representations: store.representations.length,
    };
  }
  const sb = getSupabase()!;
  const [i, a, r] = await Promise.all([
    sb.from('institutes').select('id', { count: 'exact', head: true }),
    sb.from('agencies').select('id', { count: 'exact', head: true }),
    sb.from('representations').select('id', { count: 'exact', head: true }),
  ]);
  return {
    institutes: i.count ?? 0,
    agencies: a.count ?? 0,
    representations: r.count ?? 0,
  };
}

// ──────────────────────────────────────────────────────────────────────
// Search
// ──────────────────────────────────────────────────────────────────────

export async function searchInstitutes(q: string): Promise<Institute[]> {
  if (!isSupabaseConfigured) {
    const lower = q.toLowerCase();
    return (await getStore()).institutes.filter((i) =>
      i.name.toLowerCase().includes(lower)
    );
  }
  const sb = getSupabase()!;
  const { data, error } = await sb
    .from('institutes')
    .select('*')
    .ilike('name', `%${q}%`)
    .order('name');
  if (error) throw error;
  return data as Institute[];
}
