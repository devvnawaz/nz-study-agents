import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ReportPage() {
  const router = useRouter();
  const { institute, agency } = router.query;

  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institute_id: typeof institute === 'string' ? institute : undefined,
          agency_id: typeof agency === 'string' ? agency : undefined,
          message: message.trim(),
          reporter_contact: contact.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('success');
      setMessage('');
      setContact('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <>
      <Head>
        <title>Report Outdated Info — NZ Study Agent Directory</title>
      </Head>
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="section-title mb-2">Report outdated information</h1>
          <p className="mb-6 text-gray-500 text-sm">
            Help keep the directory accurate. Tell us what is wrong or missing and we will update it.
          </p>

          {status === 'success' ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center text-green-800">
              <p className="text-lg font-semibold">✓ Report submitted — thank you!</p>
              <p className="mt-2 text-sm">We will review the information and update the directory if needed.</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 btn-secondary"
              >
                Submit another report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 space-y-5">
              {(institute || agency) && (
                <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                  This report is linked to {institute ? 'an institute' : 'an agency'} listing.
                  {' '}You can also describe the issue in the message below.
                </div>
              )}

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-gray-700">
                  What needs to be corrected or added? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. The phone number for XYZ Agency is wrong — the correct number is... / The agent list for University of Auckland now includes ABC Consultancy: [source URL]"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label htmlFor="contact" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Your email (optional — for follow-up only)
                </label>
                <input
                  id="contact"
                  type="email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-600">Something went wrong. Please try again or email us directly.</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || !message.trim()}
                className="btn-primary disabled:opacity-60"
              >
                {status === 'loading' ? 'Submitting…' : 'Submit report'}
              </button>
            </form>
          )}
        </div>
      </Layout>
    </>
  );
}
