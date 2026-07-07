import Head from 'next/head';
import Link from 'next/link';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Layout from '@/components/Layout';
import DemoBanner from '@/components/DemoBanner';
import Disclaimer from '@/components/Disclaimer';
import { InstituteTypeIcon, ExternalIcon, WarningIcon } from '@/components/icons';
import type { Agency, InstituteForAgency } from '@/lib/types';
import { getAllAgencies, getAgencyById, getInstitutesForAgency } from '@/lib/data';
import { isSupabaseConfigured } from '@/lib/supabase';
import { getTypeBadgeClass, getStatusBadgeClass, getStatusLabel, formatDate, formatPhone } from '@/lib/utils';

interface AgencyDetailProps {
  agency: Agency;
  institutes: InstituteForAgency[];
  demoMode: boolean;
}

export default function AgencyDetail({ agency, institutes, demoMode }: AgencyDetailProps) {
  return (
    <>
      <Head>
        <title>{`${agency.name} — New Zealand Study Planner - Bangladesh`}</title>
        <meta
          name="description"
          content={`${agency.name} in ${agency.city}, Bangladesh — authorized NZ education agent. Contact, address, and institute listings.`}
        />
      </Head>
      <Layout>
        {demoMode && <DemoBanner />}

        {/* Breadcrumb */}
        <div className="border-b border-ink-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-3 text-sm text-ink-500 sm:px-6 lg:px-8">
            <Link href="/" className="hover:text-accent-700">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/agencies" className="hover:text-accent-700">Agencies</Link>
            <span className="mx-2">/</span>
            <span className="text-ink-700">{agency.name}</span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

            {/* Sidebar — agency profile */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24 p-6">
                <h1 className="text-xl font-bold text-ink-900">{agency.name}</h1>
                <p className="mt-1 text-sm text-ink-500">{agency.city}, Bangladesh</p>

                <dl className="mt-5 space-y-3 text-sm">
                  {agency.address && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Address</dt>
                      <dd className="mt-0.5 text-ink-700">{agency.address}</dd>
                    </div>
                  )}
                  {agency.phone && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Phone</dt>
                      <dd>
                        <a href={`tel:${formatPhone(agency.phone).replace(/\s/g, '')}`} className="text-accent-700 hover:underline">{formatPhone(agency.phone)}</a>
                      </dd>
                    </div>
                  )}
                  {agency.email && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Email</dt>
                      <dd>
                        <a href={`mailto:${agency.email}`} className="break-all text-accent-700 hover:underline">{agency.email}</a>
                      </dd>
                    </div>
                  )}
                  {agency.website && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Website</dt>
                      <dd>
                        <a
                          href={agency.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 break-all text-accent-700 hover:underline"
                        >
                          {agency.website.replace(/^https?:\/\//, '')}
                          <ExternalIcon className="h-3.5 w-3.5 flex-shrink-0" />
                        </a>
                      </dd>
                    </div>
                  )}
                  {agency.contact_person && (
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-ink-400">Contact Person</dt>
                      <dd className="text-ink-700">{agency.contact_person}</dd>
                    </div>
                  )}
                </dl>

                {agency.notes && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    <WarningIcon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    {agency.notes}
                  </div>
                )}

                <div className="mt-5 border-t border-ink-100 pt-4">
                  <Link href={`/report?agency=${agency.id}`} className="text-sm text-red-500 hover:underline">
                    Report outdated information
                  </Link>
                </div>
              </div>
            </div>

            {/* Main — institutes */}
            <div className="lg:col-span-2">
              <h2 className="section-title mb-1">Institutes represented</h2>
              <p className="mb-5 text-ink-500">
                {agency.name} is listed as an authorized agent for the following New Zealand institutes.
              </p>

              {institutes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-10 text-center text-ink-500">
                  No institute listings found for this agency.
                </div>
              ) : (
                <div className="space-y-4">
                  {institutes.map((inst) => (
                    <div key={inst.id} className="card p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-700 ring-1 ring-accent-100">
                            <InstituteTypeIcon type={inst.type} className="h-5 w-5" />
                          </span>
                          <div>
                            <Link href={`/institutes/${inst.id}`} className="inline-flex items-center gap-1 font-semibold text-ink-900 transition hover:text-accent-700">
                              {inst.name}
                              <ExternalIcon className="h-3.5 w-3.5" />
                            </Link>
                            <p className="text-sm text-ink-500">{inst.city_in_nz}, New Zealand</p>
                            <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTypeBadgeClass(inst.type)}`}>
                              {inst.type}
                            </span>
                          </div>
                        </div>
                        <span className={getStatusBadgeClass(inst.authorization_status)}>
                          {getStatusLabel(inst.authorization_status)}
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3 border-t border-ink-100 pt-3 text-xs text-ink-400">
                        <span>Verified: {formatDate(inst.last_verified_at)}</span>
                        <span>·</span>
                        <a href={inst.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-600">
                          View source ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8">
                <Disclaimer />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const agencies = await getAllAgencies();
  return {
    paths: agencies.map((a) => ({ params: { id: a.id } })),
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<AgencyDetailProps> = async ({ params }) => {
  const id = params?.id as string;
  const agency = await getAgencyById(id);
  if (!agency) return { notFound: true };

  const institutes = await getInstitutesForAgency(id);
  return {
    props: { agency, institutes, demoMode: !isSupabaseConfigured },
    revalidate: 60 * 60,
  };
};
