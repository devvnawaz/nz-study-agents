import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Alert from '@/components/Alert';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About — New Zealand Study Planner - Bangladesh</title>
      </Head>
      <Layout>
        <PageHeader
          eyebrow="About"
          title="About this directory"
        />

        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <section className="card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-ink-900">What is this?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                The <strong className="text-ink-900">New Zealand Study Planner - Bangladesh</strong> is a
                free, student-friendly guide for Bangladeshi students planning to study in New Zealand. It
                brings together authorized education agent listings from the official websites of New
                Zealand institutes — through the <strong className="text-ink-900">NZ Study Agent Directory
                - Bangladesh</strong> feature — so students can find trustworthy agents in one place.
              </p>
            </section>

            <section className="card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-ink-900">Why was it built?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                In WhatsApp groups for NZ student visa applicants, the same questions come up again and
                again: <em>&quot;Who are the authorized agents for University of Auckland in
                Bangladesh?&quot;</em>, <em>&quot;Does this agency represent Massey University?&quot;</em>.
                Every answer requires going to a different institute website. This directory solves that
                by putting everything in one place.
              </p>
            </section>

            <section className="card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-ink-900">How is the data collected?</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Each entry is sourced from the official &quot;authorized representatives&quot; or
                &quot;find an agent&quot; page of the respective New Zealand institute. Every listing
                includes a link to the source page and the date it was last verified. We do not accept
                submissions from agencies directly — all data must be backed by an official institute
                source.
              </p>
            </section>

            <Alert variant="warning" title="Important disclaimer">
              <p>
                This directory is for <strong>information purposes only</strong>. Agent authorizations can
                change at any time. Before signing any agreement or making any payment to an agent, you
                must <strong>verify their authorization directly with the institute</strong> using the
                official source link provided in each listing.
              </p>
              <p className="mt-2">
                This website is <strong>not affiliated with any New Zealand government body, immigration
                authority, or any of the listed institutes or agencies</strong>.
              </p>
            </Alert>

            <section className="card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-ink-900">How can I help?</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-600">
                <li>
                  If you find outdated or incorrect information, use the{' '}
                  <Link href="/report" className="text-accent-700 underline">Report Outdated Info</Link> form.
                </li>
                <li>If you know of an institute whose agents are not yet listed, reach out via the report form with the official source URL.</li>
                <li>Share this directory with other students in NZ study groups.</li>
              </ul>
            </section>

            <section className="card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-ink-900">Contact</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                Use the <Link href="/report" className="text-accent-700 underline">Report form</Link> for
                data corrections or additions. You can also include your email address in the report if
                you would like a response.
              </p>
            </section>
          </div>
        </div>
      </Layout>
    </>
  );
}
