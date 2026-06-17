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
