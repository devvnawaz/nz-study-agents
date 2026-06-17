import { useMemo, useState } from 'react';
import type { Institute, InstituteType } from '@/lib/types';
import InstituteCard from './InstituteCard';

interface SearchExplorerProps {
  institutes: Institute[];
  agencyCounts: Record<string, number>;
}

const TYPES: (InstituteType | 'All')[] = [
  'All',
  'University',
  'Polytechnic',
  'Private Institute',
  'English Language School',
];

export default function SearchExplorer({ institutes, agencyCounts }: SearchExplorerProps) {
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
      {/* Search controls */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
          {/* Search box */}
          <div className="sm:col-span-6">
            <label htmlFor="search" className="sr-only">Search institutes</label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                id="search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by institute name…"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Type filter */}
          <div className="sm:col-span-3">
            <label htmlFor="type" className="sr-only">Institute type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as InstituteType | 'All')}
              className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>{t === 'All' ? 'All types' : t}</option>
              ))}
            </select>
          </div>

          {/* City filter */}
          <div className="sm:col-span-3">
            <label htmlFor="city" className="sr-only">City in NZ</label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All NZ cities' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6">
        <p className="mb-3 text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of {institutes.length} institutes
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            No institutes match your search. Try clearing the filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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
