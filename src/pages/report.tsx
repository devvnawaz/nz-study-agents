import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Alert from '@/components/Alert';

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
        <title>Report Outdated Info — New Zealand Study Planner - Bangladesh</title>
      </Head>
      <Layout>
        <PageHeader
          eyebrow="Keep the directory accurate"
          title="Report outdated information"
          subtitle="Tell us what is wrong or missing and we will review it."
        />

        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          {status === 'success' ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center text-emerald-800">
              <p className="text-lg font-semibold">✓ Report submitted — thank you!</p>
              <p className="mt-2 text-sm">We will review the information and update the directory if needed.</p>
              <button
                onClick={() => setStatus('idle')}
                className="btn-secondary mt-4"
              >
                Submit another report
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-7">
              {(institute || agency) && (
                <Alert variant="info" title="Linked listing">
                  This report is linked to {institute ? 'an institute' : 'an agency'} listing. You can also
                  describe the issue in the message below.
                </Alert>
              )}

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink-700">
                  What needs to be corrected or added? <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. The phone number for XYZ Agency is wrong — the correct number is... / The agent list for University of Auckland now includes ABC Consultancy: [source URL]"
                  className="input"
                />
                <p className="mt-1.5 text-xs text-ink-500">
                  If possible, include the official institute source URL — it helps us verify and update
                  the listing faster.
                </p>
              </div>

              <div>
                <label htmlFor="contact" className="mb-1.5 block text-sm font-medium text-ink-700">
                  Your email (optional — for follow-up only)
                </label>
                <input
                  id="contact"
                  type="email"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="you@example.com"
                  className="input"
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
