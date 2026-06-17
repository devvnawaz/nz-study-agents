/**
 * Server-side helper: verify the X-Admin-Token request header.
 * Token is stored in the ADMIN_TOKEN env var.
 * In development, if ADMIN_TOKEN is unset, the default token is "dev".
 */
import type { NextApiRequest, NextApiResponse } from 'next';

export function checkAdminToken(
  req: NextApiRequest,
  res: NextApiResponse
): boolean {
  const expected =
    process.env.ADMIN_TOKEN ||
    (process.env.NODE_ENV === 'development' ? 'dev' : null);

  if (!expected) {
    res.status(500).json({ error: 'ADMIN_TOKEN env var is not set.' });
    return false;
  }

  const provided =
    req.headers['x-admin-token'] ??
    req.cookies?.['admin_token'];

  if (provided !== expected) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}
