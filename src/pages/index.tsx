import Head from 'next/head';
import type { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import DemoBanner from '@/components/DemoBanner';
import SearchExplorer from '@/components/SearchExplorer';
import Disclaimer from '@/components/Disclaimer';
import type { Institute } from '@/lib/types';
import {
  getAllInstitutes,
  getSiteCounts,
  getAgenciesForInstitute,
  type SiteCounts,
} from '@/lib/data';
import { isSupabaseConfigured } from '@/lib/supabase';

interface HomeProps {
  institutes: Institute[];
  agencyCounts: Record<string, number>;
  counts: SiteCounts;
  demoMode: boolean;
}

export default function Home({ institutes, agencyCounts, counts, demoMode }: HomeProps) {
  return (
    <>
      <Head>
        <title>New Zealand Study Planner - Bangladesh</title>
        <meta
          name="description"
          content="A student-friendly resource for Bangladeshi students planning to study in New Zealand, including authorised agent listings, visa FAQs, interview questions, and a study cost calculator."
        />
        <meta property="og:title" content="New Zealand Study Planner - Bangladesh" />
        <meta
          property="og:description"
          content="A student-friendly resource for Bangladeshi students planning to study in New Zealand, including authorised agent listings, visa FAQs, interview questions, and a study cost calculator."
        />
        <meta property="twitter:title" content="New Zealand Study Planner - Bangladesh" />
        <meta
          property="twitter:description"
          content="A student-friendly resource for Bangladeshi students planning to study in New Zealand, including authorised agent listings, visa FAQs, interview questions, and a study cost calculator."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="NZ Study Planner" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@devnawaz" />
      </Head>
      <Layout>
        {demoMode && <DemoBanner />}

        {/* Hero */}
        <section className="bg-gradient-to-b from-nz-black to-brand-900 text-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                New Zealand Study Planner - Bangladesh
              </h1>
              <p className="mt-4 text-base text-brand-100 sm:text-lg">
                Find authorised agents, estimate study costs, prepare for visa questions, and explore practical
                guides for studying in New Zealand from Bangladesh.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="#explore" className="btn-primary bg-white text-brand-800 hover:bg-brand-50">
                  Start searching
                </a>
                <a href="/about" className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20">
                  How it works
                </a>
              </div>

              {/* Stats */}
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-brand-200">Institutes</dt>
                  <dd className="text-2xl font-bold">{counts.institutes}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-brand-200">Agents</dt>
                  <dd className="text-2xl font-bold">{counts.agencies}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-brand-200">Listings</dt>
                  <dd className="text-2xl font-bold">{counts.representations}</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Explorer */}
        <section id="explore" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="section-title mb-1">Browse institutes</h2>
          <p className="mb-6 text-gray-500">Search or filter to find your institute, then open it to see its authorized agents.</p>
          <SearchExplorer institutes={institutes} agencyCounts={agencyCounts} />
        </section>

        {/* Disclaimer */}
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <Disclaimer />
        </section>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const [institutes, counts] = await Promise.all([
    getAllInstitutes(),
    getSiteCounts(),
  ]);

  // Compute agency count per institute
  const entries = await Promise.all(
    institutes.map(async (i) => {
      const agencies = await getAgenciesForInstitute(i.id);
      return [i.id, agencies.length] as const;
    })
  );
  const agencyCounts = Object.fromEntries(entries);

  return {
    props: { institutes, agencyCounts, counts, demoMode: !isSupabaseConfigured },
    revalidate: 60 * 60, // re-generate hourly when using Supabase
  };
};
