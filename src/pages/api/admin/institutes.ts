import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminToken } from '@/lib/adminAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { Institute, InstituteType } from '@/lib/types';
import { readStore, writeStore } from '@/lib/store';
import { revalidatePaths } from '@/lib/revalidate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkAdminToken(req, res)) return;

  if (req.method === 'GET') {
    if (!isSupabaseConfigured) {
      return res.status(200).json(readStore().institutes);
    }
    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb.from('institutes').select('*').order('name');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const {
      name, type, city_in_nz, official_website,
      representative_page_url, last_checked_at,
    } = req.body as Partial<Institute>;

    if (!name?.trim() || !type || !city_in_nz?.trim() || !official_website?.trim() || !representative_page_url?.trim()) {
      return res.status(400).json({ error: 'Missing required fields: name, type, city_in_nz, official_website, representative_page_url' });
    }

    if (!isSupabaseConfigured) {
      const store = readStore();
      const newInstitute: Institute = {
        id: `inst-${Date.now()}`,
        name: name.trim(),
        type: type as InstituteType,
        city_in_nz: city_in_nz.trim(),
        official_website: official_website.trim(),
        representative_page_url: representative_page_url.trim(),
        last_checked_at: last_checked_at ?? new Date().toISOString().split('T')[0],
      };
      store.institutes.push(newInstitute);
      writeStore(store);
      return res.status(201).json(newInstitute);
    }

    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb.from('institutes').insert({
      name: name.trim(), type, city_in_nz: city_in_nz.trim(),
      official_website: official_website.trim(),
      representative_page_url: representative_page_url.trim(),
      last_checked_at: last_checked_at ?? new Date().toISOString().split('T')[0],
    }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    await revalidatePaths(res, ['/institutes', '/']);
    return res.status(201).json(data);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'id required' });

    if (!isSupabaseConfigured) {
      const store = readStore();
      store.institutes = store.institutes.filter((i) => i.id !== id);
      store.representations = store.representations.filter((r) => r.institute_id !== id);
      writeStore(store);
      return res.status(200).json({ ok: true });
    }

    const sb = getSupabaseAdmin()!;
    const linksRes = await sb.from('representations').select('agency_id').eq('institute_id', id);
    if (linksRes.error) return res.status(500).json({ error: linksRes.error.message });

    const { error } = await sb.from('institutes').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });

    const agencyIds = [...new Set((linksRes.data ?? []).map((row) => row.agency_id).filter(Boolean))] as string[];
    await revalidatePaths(res, ['/institutes', '/', `/institutes/${id}`, '/agencies', ...agencyIds.map((agencyId) => `/agencies/${agencyId}`)]);
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end();
}
