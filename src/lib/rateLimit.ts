import type { NextApiRequest, NextApiResponse } from 'next';

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function getKey(req: NextApiRequest): string {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  return req.socket.remoteAddress || 'unknown';
}

export function rateLimit(
  req: NextApiRequest,
  res: NextApiResponse,
  options: { windowMs: number; max: number; prefix?: string }
): boolean {
  const key = `${options.prefix ?? 'rl'}:${getKey(req)}`;
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return true;
  }

  if (current.count >= options.max) {
    res.setHeader('Retry-After', Math.ceil((current.resetAt - now) / 1000).toString());
    res.status(429).json({ error: 'Too many requests. Please try again later.' });
    return false;
  }

  current.count += 1;
  buckets.set(key, current);
  return true;
}
