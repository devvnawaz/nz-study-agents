/**
 * Thin typed fetch wrapper for the admin API routes.
 * Attaches the admin token from localStorage automatically.
 */

export function getToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('admin_token') ?? '';
}

export function setToken(token: string) {
  localStorage.setItem('admin_token', token);
}

async function api<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': getToken(),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? res.statusText);
  return json as T;
}

export const adminApi = {
  // Agencies
  getAgencies: () => api<import('@/lib/types').Agency[]>('GET', '/api/admin/agencies'),
  createAgency: (body: Partial<import('@/lib/types').Agency>) =>
    api<import('@/lib/types').Agency>('POST', '/api/admin/agencies', body),
  updateAgency: (id: string, body: Partial<import('@/lib/types').Agency>) =>
    api<import('@/lib/types').Agency>('PUT', `/api/admin/agencies?id=${id}`, body),
  deleteAgency: (id: string) =>
    api<{ ok: boolean }>('DELETE', `/api/admin/agencies?id=${id}`),

  // Institutes
  getInstitutes: () =>
    api<import('@/lib/types').Institute[]>('GET', '/api/admin/institutes'),
  createInstitute: (body: Partial<import('@/lib/types').Institute>) =>
    api<import('@/lib/types').Institute>('POST', '/api/admin/institutes', body),
  deleteInstitute: (id: string) =>
    api<{ ok: boolean }>('DELETE', `/api/admin/institutes?id=${id}`),

  // Representations
  getRepresentations: () =>
    api<import('@/lib/types').Representation[]>('GET', '/api/admin/representations'),
  createRepresentation: (body: Partial<import('@/lib/types').Representation>) =>
    api<import('@/lib/types').Representation>('POST', '/api/admin/representations', body),
  deleteRepresentation: (id: string) =>
    api<{ ok: boolean }>('DELETE', `/api/admin/representations?id=${id}`),

  // Reports
  getReports: () =>
    api<import('@/lib/store').Report[]>('GET', '/api/admin/reports'),
  resolveReport: (id: string) =>
    api<import('@/lib/store').Report>('PATCH', `/api/admin/reports?id=${id}`),
};
