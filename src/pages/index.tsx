import Head from 'next/head';
import type { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import DemoBanner from '@/components/DemoBanner';
import SearchExplorer from '@/components/SearchExplorer';
import Disclaimer from '@/components/Disclaimer';
import HeroBackdrop from '@/components/HeroBackdrop';
import { ArrowRightIcon, PlayIcon } from '@/components/icons';
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
        <section className="relative isolate overflow-hidden bg-ink-900 pb-28 pt-16 sm:pb-32 sm:pt-20">
          <HeroBackdrop />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink-200">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                Updated for New Zealand study planning
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your Path to <span className="text-accent-400">New Zealand</span> Starts Here
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-300 sm:text-lg">
                Find authorised agents, estimate study costs, prepare for visa questions, and explore
                practical guides for studying in New Zealand from Bangladesh.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#explore" className="btn-primary">
                  Start Searching
                  <ArrowRightIcon className="h-4 w-4" />
                </a>
                <a href="/about" className="btn-dark">
                  <PlayIcon className="h-4 w-4" />
                  How it works
                </a>
              </div>

              {/* Stats */}
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-8">
                <div>
                  <dd className="text-2xl font-extrabold text-white">{counts.institutes}+</dd>
                  <dt className="text-xs uppercase tracking-wide text-ink-400">Institutes</dt>
                </div>
                <div>
                  <dd className="text-2xl font-extrabold text-white">{counts.agencies}</dd>
                  <dt className="text-xs uppercase tracking-wide text-ink-400">Agents</dt>
                </div>
                <div>
                  <dd className="text-2xl font-extrabold text-white">{counts.representations}</dd>
                  <dt className="text-xs uppercase tracking-wide text-ink-400">Listings</dt>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Explorer — floating search card overlaps the hero/content boundary */}
        <section id="explore" className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
          <div className="-mt-16 sm:-mt-20">
            <SearchExplorer
              institutes={institutes}
              agencyCounts={agencyCounts}
              floating
              heading="Browse Institutes"
            />
          </div>
        </section>

        {/* Disclaimer */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
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
