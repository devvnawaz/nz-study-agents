import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Alert from '@/components/Alert';
import { ExternalIcon } from '@/components/icons';

const RATE_ENDPOINT = 'https://api.frankfurter.dev/v2/rate/NZD/BDT';
const DEFAULT_EXCHANGE_RATE = 70;
const DURATIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4];

interface RateInfo {
  status: 'idle' | 'loading' | 'success' | 'error' | 'manual';
  date?: string;
  message?: string;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

function formatCurrency(value: number, currency: 'NZD' | 'BDT') {
  return `${currency} ${formatNumber(value)}`;
}

function formatRate(value: number) {
  return Number.isFinite(value) ? value.toFixed(2) : DEFAULT_EXCHANGE_RATE.toFixed(2);
}

function toNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

async function fetchNzdToBdtRate() {
  const response = await fetch(RATE_ENDPOINT);
  if (!response.ok) {
    throw new Error('Could not fetch exchange rate');
  }
  const data = await response.json();
  const rate = Number(data.rate);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error('Invalid exchange rate');
  }
  return { rate, date: typeof data.date === 'string' ? data.date : undefined };
}

export default function CostCalculatorPage() {
  const [tuitionPerYear, setTuitionPerYear] = useState('30000');
  const [scholarshipPerYear, setScholarshipPerYear] = useState('0');
  const [programDuration, setProgramDuration] = useState(1);
  const [livingCostPerYear, setLivingCostPerYear] = useState('20000');
  const [oneTimeExtraExpenses, setOneTimeExtraExpenses] = useState('5000');
  const [exchangeRate, setExchangeRate] = useState(String(DEFAULT_EXCHANGE_RATE));
  const [rateInfo, setRateInfo] = useState<RateInfo>({ status: 'idle' });

  const loadExchangeRate = async () => {
    setRateInfo({ status: 'loading' });
    try {
      const data = await fetchNzdToBdtRate();
      setExchangeRate(data.rate.toFixed(2));
      setRateInfo({ status: 'success', date: data.date });
    } catch {
      setRateInfo({
        status: 'error',
        message: 'Could not fetch today’s exchange rate. Please enter the current NZD to BDT rate manually.',
      });
    }
  };

  useEffect(() => {
    loadExchangeRate();
  }, []);

  const values = useMemo(() => {
    const tuition = toNumber(tuitionPerYear);
    const scholarship = toNumber(scholarshipPerYear);
    const living = toNumber(livingCostPerYear);
    const extras = toNumber(oneTimeExtraExpenses);
    const rate = toNumber(exchangeRate) || DEFAULT_EXCHANGE_RATE;
    const annualTuitionAfterScholarship = Math.max(tuition - scholarship, 0);
    const totalTuition = annualTuitionAfterScholarship * programDuration;
    const totalLivingCost = living * programDuration;
    const estimatedMinimumFundsNZD = totalTuition + totalLivingCost + extras;
    const estimatedBDT = estimatedMinimumFundsNZD * rate;

    return {
      annualTuitionAfterScholarship,
      totalTuition,
      totalLivingCost,
      extras,
      estimatedMinimumFundsNZD,
      estimatedBDT,
      rate,
    };
  }, [tuitionPerYear, scholarshipPerYear, livingCostPerYear, oneTimeExtraExpenses, exchangeRate, programDuration]);

  const setNonNegativeValue = (value: string, setter: (next: string) => void) => {
    if (value === '') {
      setter('');
      return;
    }
    setter(String(Math.max(Number(value) || 0, 0)));
  };

  const handleManualRateChange = (value: string) => {
    setNonNegativeValue(value, setExchangeRate);
    setRateInfo({ status: 'manual', message: 'Manual exchange rate entered.' });
  };

  return (
    <>
      <Head>
        <title>New Zealand Study Cost Calculator — New Zealand Study Planner - Bangladesh</title>
        <meta
          name="description"
          content="Estimate tuition, living costs, one-time expenses, scholarships, and approximate BDT equivalent for New Zealand study planning."
        />
      </Head>
      <Layout>
        <PageHeader
          eyebrow="Plan your budget"
          title="New Zealand Study Cost Calculator"
          subtitle="Estimate your tuition, living cost, and approximate fund preparation amount before applying."
        />

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Alert variant="warning" title="Disclaimer">
              This calculator is for general planning only and is not immigration advice. Costs, visa
              fees, living expenses, financial requirements, and exchange rates can change. Always verify
              details from Immigration New Zealand, your institution, and official sources.
            </Alert>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            {/* Calculator form */}
            <section className="card p-5 sm:p-6 lg:col-span-3">
              <h2 className="text-lg font-semibold text-ink-900">Calculator form</h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-ink-700">Tuition fee per year before scholarship</span>
                  <div className="mt-1.5 flex overflow-hidden rounded-xl border border-ink-300 bg-white shadow-sm focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-500/40">
                    <span className="inline-flex items-center border-r border-ink-200 bg-ink-50 px-3 text-sm text-ink-500">NZD</span>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={tuitionPerYear}
                      onChange={(e) => setNonNegativeValue(e.target.value, setTuitionPerYear)}
                      className="w-full border-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-0"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-ink-700">Expected scholarship per year</span>
                  <div className="mt-1.5 flex overflow-hidden rounded-xl border border-ink-300 bg-white shadow-sm focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-500/40">
                    <span className="inline-flex items-center border-r border-ink-200 bg-ink-50 px-3 text-sm text-ink-500">NZD</span>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={scholarshipPerYear}
                      onChange={(e) => setNonNegativeValue(e.target.value, setScholarshipPerYear)}
                      className="w-full border-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-0"
                    />
                  </div>
                </label>

                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-ink-700">Program duration</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {DURATIONS.map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => setProgramDuration(duration)}
                        aria-pressed={programDuration === duration}
                        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 ${
                          programDuration === duration
                            ? 'bg-accent-600 text-white shadow-sm'
                            : 'border border-ink-300 bg-white text-ink-700 hover:bg-ink-50'
                        }`}
                      >
                        {duration} {duration === 1 ? 'year' : 'years'}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-ink-700">Estimated living cost per year</span>
                  <div className="mt-1.5 flex overflow-hidden rounded-xl border border-ink-300 bg-white shadow-sm focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-500/40">
                    <span className="inline-flex items-center border-r border-ink-200 bg-ink-50 px-3 text-sm text-ink-500">NZD</span>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={livingCostPerYear}
                      onChange={(e) => setNonNegativeValue(e.target.value, setLivingCostPerYear)}
                      className="w-full border-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-0"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-ink-500">You can adjust this if your expected living cost is different.</p>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-ink-700">One-time extra expenses</span>
                  <div className="mt-1.5 flex overflow-hidden rounded-xl border border-ink-300 bg-white shadow-sm focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-500/40">
                    <span className="inline-flex items-center border-r border-ink-200 bg-ink-50 px-3 text-sm text-ink-500">NZD</span>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={oneTimeExtraExpenses}
                      onChange={(e) => setNonNegativeValue(e.target.value, setOneTimeExtraExpenses)}
                      className="w-full border-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-0"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-ink-500">For visa fees, airfare, initial setup, and miscellaneous expenses.</p>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-ink-700">NZD to BDT exchange rate</span>
                  <div className="mt-1.5 flex overflow-hidden rounded-xl border border-ink-300 bg-white shadow-sm focus-within:border-accent-500 focus-within:ring-2 focus-within:ring-accent-500/40">
                    <span className="inline-flex items-center border-r border-ink-200 bg-ink-50 px-3 text-sm text-ink-500">1 NZD =</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={exchangeRate}
                      onChange={(e) => handleManualRateChange(e.target.value)}
                      className="w-full border-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-0"
                    />
                    <span className="inline-flex items-center border-l border-ink-200 bg-ink-50 px-3 text-sm text-ink-500">BDT</span>
                  </div>
                  <p className="mt-1.5 text-xs text-ink-500">
                    This is approximate. You can manually update it based on your bank or money exchange provider.
                  </p>
                </label>
              </div>
            </section>

            <aside className="space-y-6 lg:col-span-2">
              {/* Exchange-rate info */}
              <section className="alert-info">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold text-ink-900">Exchange-rate info</h2>
                  <button
                    type="button"
                    onClick={loadExchangeRate}
                    className="rounded-lg border border-accent-200 bg-white px-3 py-1.5 text-xs font-semibold text-accent-800 shadow-sm transition hover:bg-accent-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
                  >
                    Refresh rate
                  </button>
                </div>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-ink-700">
                  {rateInfo.status === 'loading' && <p>Fetching today’s approximate exchange rate…</p>}
                  {rateInfo.status === 'success' && (
                    <>
                      <p className="font-medium text-ink-900">
                        Today’s approximate exchange rate: 1 NZD = {formatRate(values.rate)} BDT
                      </p>
                      <p>Source: Frankfurter API</p>
                      <p>{rateInfo.date ? `Last updated: ${rateInfo.date}` : 'Fetched today. Please verify before using.'}</p>
                    </>
                  )}
                  {rateInfo.status === 'error' && <p className="text-amber-800">{rateInfo.message}</p>}
                  {rateInfo.status === 'manual' && <p className="font-medium text-ink-900">{rateInfo.message}</p>}
                  {rateInfo.status === 'idle' && <p>Exchange rate will be fetched automatically when the page loads.</p>}
                  <p className="text-xs text-ink-500">
                    The exchange rate is approximate and may differ from bank, card, remittance, or money exchange rates.
                    Always verify the actual rate before preparing financial documents.
                  </p>
                </div>
              </section>

              {/* Result summary */}
              <section className="card p-5 sm:p-6">
                <h2 className="text-base font-semibold text-ink-900">Result summary</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Annual tuition after scholarship</dt>
                    <dd className="font-semibold text-ink-900">{formatCurrency(values.annualTuitionAfterScholarship, 'NZD')}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Total tuition after scholarship</dt>
                    <dd className="font-semibold text-ink-900">{formatCurrency(values.totalTuition, 'NZD')}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Total living cost</dt>
                    <dd className="font-semibold text-ink-900">{formatCurrency(values.totalLivingCost, 'NZD')}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">One-time extra expenses</dt>
                    <dd className="font-semibold text-ink-900">{formatCurrency(values.extras, 'NZD')}</dd>
                  </div>
                  <div className="border-t border-ink-100 pt-3">
                    <dt className="text-ink-500">Estimated minimum funds in NZD</dt>
                    <dd className="mt-1 text-2xl font-bold text-accent-700">{formatCurrency(values.estimatedMinimumFundsNZD, 'NZD')}</dd>
                  </div>
                  <div className="rounded-xl bg-ink-900 p-4 text-white">
                    <dt className="text-xs uppercase tracking-wide text-ink-300">Estimated equivalent in BDT</dt>
                    <dd className="mt-1 text-xl font-bold">{formatCurrency(values.estimatedBDT, 'BDT')}</dd>
                    <p className="mt-1 text-xs text-ink-400">
                      Estimated BDT equivalent based on 1 NZD = {formatRate(values.rate)} BDT
                    </p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Exchange rate used</dt>
                    <dd className="font-semibold text-ink-900">1 NZD = {formatRate(values.rate)} BDT</dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>

          <section className="mt-8 card p-5 sm:p-6">
            <h2 className="text-base font-semibold text-ink-900">How this estimate works</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">
              Total estimate = tuition after scholarship + living cost + one-time extra expenses.
              If your scholarship is higher than the tuition fee, tuition after scholarship is treated as NZD 0.
            </p>
          </section>

          <section className="mt-6 rounded-2xl border border-ink-200/70 bg-ink-50/60 p-5 sm:p-6">
            <h2 className="text-base font-semibold text-ink-900">Official sources to check</h2>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {[
                {
                  label: 'Immigration New Zealand student fund requirements',
                  url: 'https://www.immigration.govt.nz/process-to-apply/applying-for-a-visa/providing-evidence-and-documents-to-support-your-visa-application/student-fund-requirements/',
                },
                { label: 'Fee Paying Student Visa', url: 'https://www.immigration.govt.nz/visas/fee-paying-student-visa/' },
                {
                  label: 'Study with New Zealand cost of living',
                  url: 'http://naumainz.studywithnewzealand.govt.nz/studying-in-nz/before-your-arrival/cost-of-living',
                },
                { label: 'Frankfurter API', url: 'https://frankfurter.dev/' },
              ].map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 font-medium text-accent-700 shadow-sm transition hover:border-accent-200 hover:text-accent-900"
                >
                  {source.label}
                  <ExternalIcon className="h-4 w-4 flex-shrink-0" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
