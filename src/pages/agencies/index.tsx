import { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import DemoBanner from '@/components/DemoBanner';
import PageHeader from '@/components/PageHeader';
import { SearchIcon, PinIcon, ArrowRightIcon } from '@/components/icons';
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
        <title>Agencies in Bangladesh — New Zealand Study Planner - Bangladesh</title>
        <meta name="description" content="All authorized NZ education agents in Bangladesh with contact details." />
      </Head>
      <Layout>
        {demoMode && <DemoBanner />}

        <PageHeader
          eyebrow="Agency directory"
          title="Agencies in Bangladesh"
          subtitle={`${agencies.length} agencies listed. Click an agency to see which institutes it represents.`}
        />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="rounded-2xl border border-ink-200/70 bg-white p-3 shadow-card sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-ink-400">
                  <SearchIcon className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search agency name…"
                  className="input pl-10"
                />
              </div>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="select sm:w-56"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>
                ))}
              </select>
            </div>
          </div>

          <p className="mb-3 mt-6 text-sm text-ink-500">
            Showing <span className="font-semibold text-ink-700">{filtered.length}</span> of {agencies.length}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-ink-500">
              No agencies match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((agency) => (
                <Link
                  key={agency.id}
                  href={`/agencies/${agency.id}`}
                  className="group card block p-5 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-ink-900 transition group-hover:text-accent-700">{agency.name}</h3>
                    <ArrowRightIcon className="mt-1 h-4 w-4 flex-shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-accent-600" />
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-500">
                    <PinIcon className="h-4 w-4 flex-shrink-0 text-ink-400" />
                    {agency.city}, Bangladesh
                  </p>
                  <div className="mt-3 space-y-1 border-t border-ink-100 pt-3 text-sm text-ink-600">
                    {agency.phone && <p>{formatPhone(agency.phone)}</p>}
                    {agency.email && <p className="break-all">{agency.email}</p>}
                  </div>
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
