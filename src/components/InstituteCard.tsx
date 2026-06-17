import Link from 'next/link';
import type { Institute } from '@/lib/types';
import { getTypeIcon, getTypeBadgeClass } from '@/lib/utils';

interface InstituteCardProps {
  institute: Institute;
  agencyCount?: number;
}

export default function InstituteCard({ institute, agencyCount }: InstituteCardProps) {
  return (
    <Link href={`/institutes/${institute.id}`} className="card block p-5 group">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{getTypeIcon(institute.type)}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition leading-snug">
            {institute.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{institute.city_in_nz}, New Zealand</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTypeBadgeClass(institute.type)}`}
            >
              {institute.type}
            </span>
            {agencyCount !== undefined && (
              <span className="text-xs text-gray-500">
                {agencyCount} authorized {agencyCount === 1 ? 'agent' : 'agents'} in Bangladesh
              </span>
            )}
          </div>
        </div>
        <svg className="h-4 w-4 flex-shrink-0 text-gray-300 group-hover:text-brand-700 transition mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
