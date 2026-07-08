import type { NextApiRequest, NextApiResponse } from 'next';
import { submitReport } from '@/lib/data';
import { rateLimit } from '@/lib/rateLimit';

const MAX_MESSAGE_LENGTH = 5000;
const MAX_CONTACT_LENGTH = 320;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end();
  }

  if (!rateLimit(req, res, { windowMs: 10 * 60 * 1000, max: 5, prefix: 'reports' })) {
    return;
  }

  const { institute_id, agency_id, message, reporter_contact, website } = req.body ?? {};

  // Honeypot: real users never see this field; bots that fill it get a fake
  // success so they don't learn to skip it. Nothing is stored.
  if (typeof website === 'string' && website.trim()) {
    return res.status(201).json({ ok: true });
  }

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: 'Message is too long.' });
  }
  if (typeof reporter_contact === 'string' && reporter_contact.length > MAX_CONTACT_LENGTH) {
    return res.status(400).json({ error: 'Contact is too long.' });
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
