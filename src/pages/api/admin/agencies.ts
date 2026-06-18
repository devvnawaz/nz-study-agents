import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminToken } from '@/lib/adminAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { Agency } from '@/lib/types';
import { readStore, writeStore } from '@/lib/store';
import { revalidatePaths } from '@/lib/revalidate';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!checkAdminToken(req, res)) return;

  if (req.method === 'GET') {
    if (!isSupabaseConfigured) {
      return res.status(200).json(readStore().agencies);
    }
    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb.from('agencies').select('*').order('name');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, city, address, phone, email, website, contact_person, notes } =
      req.body as Partial<Agency>;

    if (!name?.trim() || !city?.trim()) {
      return res.status(400).json({ error: 'Missing required fields: name, city' });
    }

    const payload = {
      name: name.trim(),
      country: 'Bangladesh',
      city: city.trim(),
      address: (address ?? '').trim(),
      phone: (phone ?? '').trim(),
      email: (email ?? '').trim(),
      website: (website ?? '').trim(),
      contact_person: contact_person?.trim() || undefined,
      notes: notes?.trim() || undefined,
    };

    if (!isSupabaseConfigured) {
      const store = readStore();
      const newAgency: Agency = { id: `ag-${Date.now()}`, ...payload };
      store.agencies.push(newAgency);
      writeStore(store);
      return res.status(201).json(newAgency);
    }

    const sb = getSupabaseAdmin()!;
    const { data, error } = await sb.from('agencies').insert(payload).select().single();
    if (error) return res.status(500).json({ error: error.message });
    await revalidatePaths(res, ['/agencies', '/']);
    return res.status(201).json(data);
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'id required' });

    const { name, city, address, phone, email, website, contact_person, notes } =
      req.body as Partial<Agency>;

    if (!name?.trim() || !city?.trim()) {
      return res.status(400).json({ error: 'Missing required fields: name, city' });
    }

    const payload = {
      name: name.trim(),
      city: city.trim(),
      address: (address ?? '').trim(),
      phone: (phone ?? '').trim(),
      email: (email ?? '').trim(),
      website: (website ?? '').trim(),
      contact_person: contact_person?.trim() || undefined,
      notes: notes?.trim() || undefined,
    };

    if (!isSupabaseConfigured) {
      const store = readStore();
      const idx = store.agencies.findIndex((a) => a.id === id);
      if (idx === -1) return res.status(404).json({ error: 'Agency not found' });
      store.agencies[idx] = { ...store.agencies[idx], ...payload };
      writeStore(store);
      return res.status(200).json(store.agencies[idx]);
    }

    const sb = getSupabaseAdmin()!;
    const [linksRes, updateRes] = await Promise.all([
      sb.from('representations').select('institute_id').eq('agency_id', id),
      sb.from('agencies').update(payload).eq('id', id).select().single(),
    ]);
    if (linksRes.error) return res.status(500).json({ error: linksRes.error.message });
    if (updateRes.error) return res.status(500).json({ error: updateRes.error.message });

    const instituteIds = [...new Set((linksRes.data ?? []).map((row) => row.institute_id).filter(Boolean))] as string[];
    await revalidatePaths(res, ['/agencies', '/', `/agencies/${id}`, ...instituteIds.map((instituteId) => `/institutes/${instituteId}`)]);
    return res.status(200).json(updateRes.data);
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id || typeof id !== 'string') return res.status(400).json({ error: 'id required' });

    if (!isSupabaseConfigured) {
      const store = readStore();
      store.agencies = store.agencies.filter((a) => a.id !== id);
      store.representations = store.representations.filter((r) => r.agency_id !== id);
      writeStore(store);
      return res.status(200).json({ ok: true });
    }

    const sb = getSupabaseAdmin()!;
    const linksRes = await sb.from('representations').select('institute_id').eq('agency_id', id);
    if (linksRes.error) return res.status(500).json({ error: linksRes.error.message });

    const { error } = await sb.from('agencies').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });

    const instituteIds = [...new Set((linksRes.data ?? []).map((row) => row.institute_id).filter(Boolean))] as string[];
    await revalidatePaths(res, ['/agencies', '/', '/institutes', ...instituteIds.map((instituteId) => `/institutes/${instituteId}`)]);
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).end();
}
