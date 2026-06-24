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

const CHECKED_INSTITUTIONS = [
  { name: 'University of Auckland', url: 'https://www.auckland.ac.nz/' },
  { name: 'Auckland University of Technology (AUT)', url: 'https://www.aut.ac.nz/' },
  { name: 'Massey University', url: 'https://www.massey.ac.nz/' },
  { name: 'University of Waikato', url: 'https://www.waikato.ac.nz/' },
  { name: 'Victoria University of Wellington', url: 'https://www.wgtn.ac.nz/' },
  { name: 'University of Canterbury', url: 'https://www.canterbury.ac.nz/' },
  { name: 'University of Otago', url: 'https://www.otago.ac.nz/' },
  { name: 'Lincoln University', url: 'https://www.lincoln.ac.nz/' },
  { name: 'Ara Institute of Canterbury', url: 'https://www.ara.ac.nz/' },
  { name: 'Unitec Institute of Technology', url: 'https://www.unitec.ac.nz/' },
  { name: 'Manukau Institute of Technology', url: 'https://www.manukau.ac.nz/' },
  { name: 'Eastern Institute of Technology', url: 'https://www.eit.ac.nz/' },
  { name: 'Waikato Institute of Technology', url: 'https://www.wintec.ac.nz/' },
  { name: 'Otago Polytechnic', url: 'https://www.op.ac.nz/' },
  { name: 'Southern Institute of Technology', url: 'https://www.sit.ac.nz/' },
  { name: 'Toi Ohomai Institute of Technology', url: 'https://www.toiohomai.ac.nz/' },
  { name: 'Nelson Marlborough Institute of Technology', url: 'https://www.nmit.ac.nz/' },
  { name: 'Auckland Institute of Studies', url: 'https://www.ais.ac.nz/' },
];

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

          <section className="mt-10 rounded-2xl border border-brand-100 bg-brand-50/70 p-5 sm:p-6">
            <div className="max-w-4xl">
              <h2 className="text-lg font-semibold text-gray-900">Can&apos;t find your preferred institution?</h2>
              <div className="mt-3 space-y-3 text-sm leading-6 text-gray-700">
                <p>
                  This directory is built from publicly available authorised-agent information found on each New Zealand institution&apos;s official website. If you do not see your preferred institution listed here, please check that institution&apos;s official website directly to find its authorised education agents or representatives.
                </p>
                <p>
                  Please also note that some institutions may not update their agent lists regularly, or may not publish every authorised agency on their website. Because of this, our directory may not include every authorised agency. We rely on official institute sources and update listings as we verify new information.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-brand-100 pt-5">
              <h3 className="text-base font-semibold text-gray-900">Institutions checked so far</h3>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {CHECKED_INSTITUTIONS.map((institution) => (
                  <a
                    key={institution.url}
                    href={institution.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-brand-800 shadow-sm transition hover:border-brand-200 hover:bg-white hover:text-brand-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
                  >
                    {institution.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
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
