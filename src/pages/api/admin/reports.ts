import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminToken } from '@/lib/adminAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { readStore, writeStore } from '@/lib/store';
import { rateLimit } from '@/lib/rateLimit';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkAdminToken(req, res)) return;
  if (!rateLimit(req, res, { windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX, prefix: 'admin:reports' })) return;

  if (req.method === 'GET') {
    if (!isSupabaseConfigured) {
      const store = readStore();
      return res.status(200).json(store.reports);
    }
    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // PATCH — mark a report as resolved
  if (req.method === 'PATCH') {
    const { id } = req.query;
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'id required' });

    if (!isSupabaseConfigured) {
      const store = readStore();
      const idx = store.reports.findIndex((r) => r.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Report not found' });
      store.reports[idx].resolved = true;
      writeStore(store);
      return res.status(200).json(store.reports[idx]);
    }

    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb
      .from('reports').update({ resolved: true }).eq('id', id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).end();
}
