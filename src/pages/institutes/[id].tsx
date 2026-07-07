import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import DemoBanner from '@/components/DemoBanner';
import AgencyCard from '@/components/AgencyCard';
import Disclaimer from '@/components/Disclaimer';
import { InstituteTypeIcon, ExternalIcon } from '@/components/icons';
import type { Institute, AgencyForInstitute } from '@/lib/types';
import {
  getAllInstitutes,
  getInstituteById,
  getAgenciesForInstitute,
} from '@/lib/data';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getTypeBadgeClass, formatDate } from '@/lib/utils';

interface InstituteDetailProps {
  institute: Institute;
  agencies: AgencyForInstitute[];
  demoMode: boolean;
}

export default function InstituteDetail({ institute, agencies, demoMode }: InstituteDetailProps) {
  return (
    <>
      <Head>
        <title>{`${institute.name} — Authorized Agents in Bangladesh`}</title>
        <meta
          name="description"
          content={`Authorized agents in Bangladesh for ${institute.name}, ${institute.city_in_nz}, New Zealand.`}
        />
      </Head>
      <Layout>
        {demoMode && <DemoBanner />}

        {/* Breadcrumb */}
        <div className="border-b border-ink-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-ink-500 sm:px-6 lg:px-8">
            <Link href="/" className="hover:text-accent-700">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/institutes" className="hover:text-accent-700">Institutes</Link>
            <span className="mx-2">/</span>
            <span className="text-ink-700">{institute.name}</span>
          </div>
        </div>

        {/* Header */}
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-700 ring-1 ring-accent-100">
                <InstituteTypeIcon type={institute.type} className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-ink-900 sm:text-3xl">{institute.name}</h1>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTypeBadgeClass(institute.type)}`}>
                    {institute.type}
                  </span>
                </div>
                <p className="mt-1 text-ink-500">{institute.city_in_nz}, New Zealand</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a href={institute.official_website} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    Official website
                    <ExternalIcon className="h-4 w-4" />
                  </a>
                  <a href={institute.representative_page_url} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    Official agents page
                    <ExternalIcon className="h-4 w-4" />
                  </a>
                </div>
                <p className="mt-3 text-xs text-ink-400">
                  Source last checked: {formatDate(institute.last_checked_at)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Agencies */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="section-title mb-1">
            Authorized agents in Bangladesh
          </h2>
          <p className="mb-6 text-ink-500">
            {agencies.length} {agencies.length === 1 ? 'agent' : 'agents'} listed for {institute.name}.
          </p>

          {agencies.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-ink-500">
              <p>No authorized agents listed yet for this institute.</p>
              <p className="mt-2 text-sm">
                Check the{' '}
                <a href={institute.representative_page_url} target="_blank" rel="noopener noreferrer" className="text-accent-700 underline">
                  official agents page
                </a>{' '}
                or{' '}
                <Link href={`/report?institute=${institute.id}`} className="text-accent-700 underline">
                  submit info you have
                </Link>.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {agencies.map((agency) => (
                <AgencyCard key={agency.id} agency={agency} />
              ))}
            </div>
          )}

          <div className="mt-8">
            <Disclaimer />
          </div>
        </section>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const institutes = await getAllInstitutes();
  return {
    paths: institutes.map((i) => ({ params: { id: i.id } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<InstituteDetailProps> = async ({ params }) => {
  const id = params?.id as string;
  const institute = await getInstituteById(id);
  if (!institute) return { notFound: true };

  const agencies = await getAgenciesForInstitute(id);
  return {
    props: { institute, agencies, demoMode: !isSupabaseConfigured },
    revalidate: 60 * 60,
  };
};
