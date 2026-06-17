import Head from 'next/head';
import type { GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import DemoBanner from '@/components/DemoBanner';
import SearchExplorer from '@/components/SearchExplorer';
import type { Institute } from '@/lib/types';
import { getAllInstitutes, getAgenciesForInstitute } from '@/lib/data';
import { isSupabaseConfigured } from '@/lib/supabase';

interface InstitutesPageProps {
  institutes: Institute[];
  agencyCounts: Record<string, number>;
  demoMode: boolean;
}

export default function InstitutesPage({ institutes, agencyCounts, demoMode }: InstitutesPageProps) {
  return (
    <>
      <Head>
        <title>All Institutes — NZ Study Agent Directory</title>
        <meta name="description" content="Browse all New Zealand institutes and find their authorized agents in Bangladesh." />
      </Head>
      <Layout>
        {demoMode && <DemoBanner />}
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="section-title mb-1">All institutes</h1>
          <p className="mb-6 text-gray-500">
            {institutes.length} New Zealand institutes. Open one to see its authorized agents in Bangladesh.
          </p>
          <SearchExplorer institutes={institutes} agencyCounts={agencyCounts} />
        </div>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps<InstitutesPageProps> = async () => {
  const institutes = await getAllInstitutes();
  const entries = await Promise.all(
    institutes.map(async (i) => {
      const agencies = await getAgenciesForInstitute(i.id);
      return [i.id, agencies.length] as const;
    })
  );
  return {
    props: {
      institutes,
      agencyCounts: Object.fromEntries(entries),
      demoMode: !isSupabaseConfigured,
    },
    revalidate: 60 * 60,
  };
};
