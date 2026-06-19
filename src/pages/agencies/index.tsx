import { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import DemoBanner from '@/components/DemoBanner';
import type { Agency } from '@/lib/types';
import { getAllAgencies } from '@/lib/data';
import { isSupabaseConfigured } from '@/lib/supabase';
import { formatPhone } from '@/lib/utils';

interface AgenciesPageProps {
  agencies: Agency[];
  demoMode: boolean;
}

export default function AgenciesPage({ agencies, demoMode }: AgenciesPageProps) {
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All');

  const cities = useMemo(() => {
    const set = new Set(agencies.map((a) => a.city));
    return ['All', ...Array.from(set).sort()];
  }, [agencies]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return agencies.filter((a) => {
      if (city !== 'All' && a.city !== city) return false;
      if (q && !a.name.toLowerCase().includes(q) && !a.city.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [agencies, query, city]);

  return (
    <>
      <Head>
        <title>Agencies in Bangladesh — NZ Study Agent Directory</title>
        <meta name="description" content="All authorized NZ education agents in Bangladesh with contact details." />
      </Head>
      <Layout>
        {demoMode && <DemoBanner />}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="section-title mb-1">Agencies in Bangladesh</h1>
          <p className="mb-6 text-gray-500">{agencies.length} agencies listed. Click an agency to see which institutes it represents.</p>

          {/* Filters */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search agency name…"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All cities' : c}</option>
              ))}
            </select>
          </div>

          <p className="mb-3 text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of {agencies.length}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
              No agencies match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((agency) => (
                <Link key={agency.id} href={`/agencies/${agency.id}`} className="card block p-5 group">
                  <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition">{agency.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{agency.city}, Bangladesh</p>
                  {agency.phone && <p className="mt-2 text-sm text-gray-600">📞 {formatPhone(agency.phone)}</p>}
                  {agency.email && <p className="text-sm text-gray-600 break-all">✉️ {agency.email}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps<AgenciesPageProps> = async () => {
  const agencies = await getAllAgencies();
  return {
    props: { agencies, demoMode: !isSupabaseConfigured },
    revalidate: 60 * 60,
  };
};
