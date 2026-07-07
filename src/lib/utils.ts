import type { InstituteType, AuthorizationStatus } from '@/lib/types';

export function getTypeIcon(type: InstituteType): string {
  switch (type) {
    case 'University':             return '🎓';
    case 'Polytechnic':            return '🔧';
    case 'Private Institute':      return '🏫';
    case 'English Language School': return '🗣️';
    default:                        return '🏛️';
  }
}

export function getTypeBadgeClass(type: InstituteType): string {
  switch (type) {
    case 'University':             return 'bg-purple-100 text-purple-800';
    case 'Polytechnic':            return 'bg-blue-100 text-blue-800';
    case 'Private Institute':      return 'bg-orange-100 text-orange-800';
    case 'English Language School': return 'bg-teal-100 text-teal-800';
    default:                        return 'bg-gray-100 text-gray-700';
  }
}

/** Decorative gradient used as the "image" header on institute cards. */
export function getTypeGradient(type: InstituteType): string {
  switch (type) {
    case 'University':             return 'from-sky-200 via-cyan-100 to-teal-100';
    case 'Polytechnic':            return 'from-indigo-200 via-sky-100 to-blue-100';
    case 'Private Institute':      return 'from-amber-200 via-orange-100 to-rose-100';
    case 'English Language School': return 'from-teal-200 via-emerald-100 to-green-100';
    default:                        return 'from-slate-200 via-slate-100 to-gray-100';
  }
}

export function getStatusBadgeClass(status: AuthorizationStatus): string {
  switch (status) {
    case 'authorized': return 'badge-authorized';
    case 'expired':    return 'badge-expired';
    default:           return 'badge-unverified';
  }
}

export function getStatusLabel(status: AuthorizationStatus): string {
  switch (status) {
    case 'authorized': return '✓ Authorized';
    case 'expired':    return '✕ Expired';
    default:           return '? Unverified';
  }
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return raw.trim();
  let national = digits;
  if (national.startsWith('880')) national = national.slice(3);
  national = national.replace(/^0+/, '');
  if (!national) return raw.trim();
  return `+880 ${national}`;
}
