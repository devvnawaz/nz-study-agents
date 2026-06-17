import type { NextApiRequest, NextApiResponse } from 'next';
import { submitReport } from '@/lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  const { institute_id, agency_id, message, reporter_contact } = req.body ?? {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  try {
    await submitReport({
      institute_id: typeof institute_id === 'string' ? institute_id : undefined,
      agency_id: typeof agency_id === 'string' ? agency_id : undefined,
      message: message.trim(),
      reporter_contact:
        typeof reporter_contact === 'string' && reporter_contact.trim()
          ? reporter_contact.trim()
          : undefined,
    });
    return res.status(201).json({ ok: true });
  } catch (err: unknown) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Failed to submit report' });
  }
}
