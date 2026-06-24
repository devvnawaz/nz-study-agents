import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminToken } from '@/lib/adminAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { Representation, AuthorizationStatus } from '@/lib/types';
import { readStore, writeStore } from '@/lib/store';
import { revalidatePaths } from '@/lib/revalidate';
import { rateLimit } from '@/lib/rateLimit';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 60;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkAdminToken(req, res)) return;
  if (!rateLimit(req, res, { windowMs: RATE_LIMIT_WINDOW_MS, max: RATE_LIMIT_MAX, prefix: 'admin:representations' })) return;

  if (req.method === 'GET') {
    if (!isSupabaseConfigured) {
      return res.status(200).json(readStore().representations);
    }
    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb.from('representations').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { institute_id, agency_id, source_url, authorization_status, last_verified_at } =
      req.body as Partial<Representation>;

    if (!institute_id || !agency_id || !source_url?.trim()) {
      return res.status(400).json({ error: 'Missing required fields: institute_id, agency_id, source_url' });
    }

    const payload: Omit<Representation, 'id'> = {
      institute_id,
      agency_id,
      source_url: source_url.trim(),
      authorization_status: (authorization_status ?? 'authorized') as AuthorizationStatus,
      last_verified_at: last_verified_at ?? new Date().toISOString().split('T')[0],
    };

    if (!isSupabaseConfigured) {
      const store = readStore();
      // prevent duplicates
      const exists = store.representations.some(
        (r) => r.institute_id === institute_id && r.agency_id === agency_id
      );
      if (exists) return res.status(409).json({ error: 'This link already exists.' });
      const newRep: Representation = { id: `rep-${Date.now()}`, ...payload };
      store.representations.push(newRep);
      writeStore(store);
      return res.status(201).json(newRep);
    }

    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb.from('representations').insert(payload).select().single();
    if (error) {
      // unique constraint violation
      if (error.code === '23505') return res.status(409).json({ error: 'This link already exists.' });
      return res.status(500).json({ error: error.message });
    }

    await revalidatePaths(res, ['/institutes', '/agencies', '/', `/institutes/${institute_id}`, `/agencies/${agency_id}`]);
    return res.status(201).json(data);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'id required' });

    if (!isSupabaseConfigured) {
      const store = readStore();
      store.representations = store.representations.filter((r) => r.id !== id);
      writeStore(store);
      return res.status(200).json({ ok: true });
    }

    const sb = getSupabaseAdmin()!;
    const existingRes = await sb.from('representations').select('institute_id, agency_id').eq('id', id).single();
    if (existingRes.error) return res.status(500).json({ error: existingRes.error.message });

    const { error } = await sb.from('representations').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });

    await revalidatePaths(res, ['/institutes', '/agencies', '/', `/institutes/${existingRes.data.institute_id}`, `/agencies/${existingRes.data.agency_id}`]);
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).end();
}
