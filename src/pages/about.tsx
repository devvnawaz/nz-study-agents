import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About — New Zealand Study Planner - Bangladesh</title>
      </Head>
      <Layout>
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="section-title mb-6">About this directory</h1>

          <div className="prose prose-sm prose-gray max-w-none space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-gray-900">What is this?</h2>
              <p>
                The <strong>New Zealand Study Planner - Bangladesh</strong> is a free, student-friendly guide for Bangladeshi students planning to study in New Zealand.
                website for Bangladeshi students who want to study in New Zealand. It brings together
                authorized education agent listings from the official websites of New Zealand institutes
                so students can find trustworthy agents in one place.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900">Why was it built?</h2>
              <p>
                In WhatsApp groups for NZ student visa applicants, the same questions come up again and
                again: <em>&quot;Who are the authorized agents for University of Auckland in Bangladesh?&quot;</em>,
                <em>&quot;Does this agency represent Massey University?&quot;</em>. Every answer requires going
                to a different institute website. This directory solves that by putting everything in one place.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900">How is the data collected?</h2>
              <p>
                Each entry is sourced from the official &quot;authorized representatives&quot; or
                &quot;find an agent&quot; page of the respective New Zealand institute. Every listing
                includes a link to the source page and the date it was last verified. We do not accept
                submissions from agencies directly — all data must be backed by an official institute source.
              </p>
            </section>

            <section className="rounded-xl border border-red-200 bg-red-50 p-5">
              <h2 className="text-base font-semibold text-red-800">⚠️ Important disclaimer</h2>
              <p className="text-red-700">
                This directory is for <strong>information purposes only</strong>. Agent authorizations
                can change at any time. Before signing any agreement or making any payment to an agent,
                you must <strong>verify their authorization directly with the institute</strong> using the
                official source link provided in each listing.
              </p>
              <p className="mt-2 text-red-700">
                This website is <strong>not affiliated with any New Zealand government body, immigration
                authority, or any of the listed institutes or agencies</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900">How can I help?</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>If you find outdated or incorrect information, use the <Link href="/report" className="text-brand-700 underline">Report Outdated Info</Link> form.</li>
                <li>If you know of an institute whose agents are not yet listed, reach out via the report form with the official source URL.</li>
                <li>Share this directory with other students in NZ study groups.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900">Contact</h2>
              <p>
                Use the <Link href="/report" className="text-brand-700 underline">Report form</Link> for
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
