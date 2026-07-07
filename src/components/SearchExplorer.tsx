import { useMemo, useState } from 'react';
import type { Institute, InstituteType } from '@/lib/types';
import InstituteCard from './InstituteCard';
import { SearchIcon } from './icons';

interface SearchExplorerProps {
  institutes: Institute[];
  agencyCounts: Record<string, number>;
  /** Heading shown above the results grid. */
  heading?: string;
  /** Sub text under the heading. */
  subheading?: string;
  /**
   * When true, the filter bar renders as a floating card meant to overlap a
   * hero section above it (used on the homepage).
   */
  floating?: boolean;
}

const TYPES: (InstituteType | 'All')[] = [
  'All',
  'University',
  'Polytechnic',
  'Private Institute',
  'English Language School',
];

export default function SearchExplorer({
  institutes,
  agencyCounts,
  heading,
  subheading,
  floating = false,
}: SearchExplorerProps) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<InstituteType | 'All'>('All');
  const [city, setCity] = useState<string>('All');

  const cities = useMemo(() => {
    const set = new Set(institutes.map((i) => i.city_in_nz));
    return ['All', ...Array.from(set).sort()];
  }, [institutes]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return institutes.filter((i) => {
      if (type !== 'All' && i.type !== type) return false;
      if (city !== 'All' && i.city_in_nz !== city) return false;
      if (q && !i.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [institutes, query, type, city]);

  return (
    <div>
      {/* Filter bar */}
      <div
        className={
          floating
            ? 'relative z-10 rounded-2xl border border-ink-100 bg-white p-3 shadow-float sm:p-4'
            : 'rounded-2xl border border-ink-200/70 bg-white p-3 shadow-card sm:p-4'
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          <div className="sm:col-span-6">
            <label htmlFor="search" className="sr-only">Search institutes</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-ink-400">
                <SearchIcon className="h-5 w-5" />
              </span>
              <input
                id="search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by institute name…"
                className="input pl-11"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="type" className="sr-only">Institute type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as InstituteType | 'All')}
              className="select"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="city" className="sr-only">City in NZ</label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="select"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All NZ Cities' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className={floating ? 'mt-10' : 'mt-8'}>
        {heading && <h2 className="section-title">{heading}</h2>}
        <p className="mt-1 text-sm text-ink-500">
          {subheading ? `${subheading} · ` : ''}Showing{' '}
          <span className="font-semibold text-ink-700">{filtered.length}</span> of {institutes.length} institutes
        </p>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-ink-500">
            No institutes match your search. Try clearing the filters.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((inst) => (
              <InstituteCard
                key={inst.id}
                institute={inst}
                agencyCount={agencyCounts[inst.id] ?? 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
