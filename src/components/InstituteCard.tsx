import Link from 'next/link';
import type { Institute } from '@/lib/types';
import { getTypeGradient } from '@/lib/utils';
import { InstituteTypeIcon, PinIcon, ArrowRightIcon } from './icons';

interface InstituteCardProps {
  institute: Institute;
  agencyCount?: number;
}

const INSTITUTE_IMAGE_IDS = new Set([
  'inst-aut',
  'inst-eit',
  'inst-lincoln',
]);

export default function InstituteCard({ institute, agencyCount }: InstituteCardProps) {
  const imageSrc = INSTITUTE_IMAGE_IDS.has(institute.id)
    ? `/images/institutes/${institute.id}.webp`
    : null;

  return (
    <Link
      href={`/institutes/${institute.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink-200/70 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
    >
      {/* Image header */}
      <div className={`relative h-36 bg-gradient-to-br ${getTypeGradient(institute.type)}`}>
        {imageSrc && (
          <>
            <img
              src={imageSrc}
              alt=""
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/35 via-ink-950/5 to-transparent" />
          </>
        )}
        <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink-700 shadow-sm backdrop-blur">
          {institute.type}
        </span>
        <span className="absolute -bottom-5 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-ink-800 shadow-card ring-1 ring-ink-100">
          <InstituteTypeIcon type={institute.type} className="h-5 w-5" />
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 pt-8">
        <h3 className="font-semibold leading-snug text-ink-900 transition group-hover:text-accent-700">
          {institute.name}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
          <PinIcon className="h-4 w-4 flex-shrink-0 text-ink-400" />
          {institute.city_in_nz}, New Zealand
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-3">
          <span className="text-sm text-ink-500">
            {agencyCount !== undefined ? (
              <>
                <span className="font-semibold text-ink-800">{agencyCount}</span> authorized{' '}
                {agencyCount === 1 ? 'agent' : 'agents'}
              </>
            ) : (
              'View agents'
            )}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-700">
            View Details
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
