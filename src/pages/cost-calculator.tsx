import { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';

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
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="section-title mb-3">New Zealand Study Cost Calculator</h1>
            <p className="text-sm leading-relaxed text-gray-600">
              Estimate your tuition, living cost, and approximate fund preparation amount before applying.
            </p>
          </div>

          <section className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-800">
            <p>
              <strong>Disclaimer:</strong> This calculator is for general planning only and is not immigration advice.
              Costs, visa fees, living expenses, financial requirements, and exchange rates can change. Always verify
              details from Immigration New Zealand, your institution, and official sources.
            </p>
          </section>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-3">
              <h2 className="text-lg font-semibold text-gray-900">Calculator form</h2>
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Tuition fee per year before scholarship</span>
                  <div className="mt-1 flex rounded-lg border border-gray-300 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
                    <span className="inline-flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">NZD</span>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={tuitionPerYear}
                      onChange={(e) => setNonNegativeValue(e.target.value, setTuitionPerYear)}
                      className="w-full rounded-r-lg border-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-0"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Expected scholarship per year</span>
                  <div className="mt-1 flex rounded-lg border border-gray-300 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
                    <span className="inline-flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">NZD</span>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={scholarshipPerYear}
                      onChange={(e) => setNonNegativeValue(e.target.value, setScholarshipPerYear)}
                      className="w-full rounded-r-lg border-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-0"
                    />
                  </div>
                </label>

                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-gray-700">Program duration</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {DURATIONS.map((duration) => (
                      <button
                        key={duration}
                        type="button"
                        onClick={() => setProgramDuration(duration)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 ${
                          programDuration === duration
                            ? 'bg-brand-700 text-white shadow-sm'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {duration} {duration === 1 ? 'year' : 'years'}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Estimated living cost per year</span>
                  <div className="mt-1 flex rounded-lg border border-gray-300 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
                    <span className="inline-flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">NZD</span>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={livingCostPerYear}
                      onChange={(e) => setNonNegativeValue(e.target.value, setLivingCostPerYear)}
                      className="w-full rounded-r-lg border-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-0"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">You can adjust this if your expected living cost is different.</p>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">One-time extra expenses</span>
                  <div className="mt-1 flex rounded-lg border border-gray-300 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
                    <span className="inline-flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">NZD</span>
                    <input
                      type="number"
                      min="0"
                      inputMode="decimal"
                      value={oneTimeExtraExpenses}
                      onChange={(e) => setNonNegativeValue(e.target.value, setOneTimeExtraExpenses)}
                      className="w-full rounded-r-lg border-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-0"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">For visa fees, airfare, initial setup, and miscellaneous expenses.</p>
                </label>

                <label className="block sm:col-span-2">
                  <span className="text-sm font-medium text-gray-700">NZD to BDT exchange rate</span>
                  <div className="mt-1 flex rounded-lg border border-gray-300 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500">
                    <span className="inline-flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">1 NZD =</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      inputMode="decimal"
                      value={exchangeRate}
                      onChange={(e) => handleManualRateChange(e.target.value)}
                      className="w-full border-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-0"
                    />
                    <span className="inline-flex items-center rounded-r-lg border-l border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">BDT</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    This is approximate. You can manually update it based on your bank or money exchange provider.
                  </p>
                </label>
              </div>
            </section>

            <aside className="space-y-6 lg:col-span-2">
              <section className="rounded-2xl border border-brand-100 bg-brand-50/70 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold text-gray-900">Exchange-rate info</h2>
                  <button
                    type="button"
                    onClick={loadExchangeRate}
                    className="rounded-md border border-brand-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-800 transition hover:bg-brand-50 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
                  >
                    Refresh rate
                  </button>
                </div>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-gray-700">
                  {rateInfo.status === 'loading' && <p>Fetching today’s approximate exchange rate…</p>}
                  {rateInfo.status === 'success' && (
                    <>
                      <p className="font-medium text-gray-900">
                        Today’s approximate exchange rate: 1 NZD = {formatRate(values.rate)} BDT
                      </p>
                      <p>Source: Frankfurter API</p>
                      <p>{rateInfo.date ? `Last updated: ${rateInfo.date}` : 'Fetched today. Please verify before using.'}</p>
                    </>
                  )}
                  {rateInfo.status === 'error' && <p className="text-amber-800">{rateInfo.message}</p>}
                  {rateInfo.status === 'manual' && <p className="font-medium text-gray-900">{rateInfo.message}</p>}
                  {rateInfo.status === 'idle' && <p>Exchange rate will be fetched automatically when the page loads.</p>}
                  <p className="text-xs text-gray-600">
                    The exchange rate is approximate and may differ from bank, card, remittance, or money exchange rates.
                    Always verify the actual rate before preparing financial documents.
                  </p>
                </div>
              </section>

              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900">Result summary</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Annual tuition after scholarship</dt>
                    <dd className="font-semibold text-gray-900">{formatCurrency(values.annualTuitionAfterScholarship, 'NZD')}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Total tuition after scholarship</dt>
                    <dd className="font-semibold text-gray-900">{formatCurrency(values.totalTuition, 'NZD')}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Total living cost</dt>
                    <dd className="font-semibold text-gray-900">{formatCurrency(values.totalLivingCost, 'NZD')}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">One-time extra expenses</dt>
                    <dd className="font-semibold text-gray-900">{formatCurrency(values.extras, 'NZD')}</dd>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <dt className="text-gray-500">Estimated minimum funds in NZD</dt>
                    <dd className="mt-1 text-2xl font-bold text-brand-800">{formatCurrency(values.estimatedMinimumFundsNZD, 'NZD')}</dd>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-3">
                    <dt className="text-gray-500">Estimated equivalent in BDT</dt>
                    <dd className="mt-1 text-xl font-bold text-gray-900">{formatCurrency(values.estimatedBDT, 'BDT')}</dd>
                    <p className="mt-1 text-xs text-gray-500">
                      Estimated BDT equivalent based on 1 NZD = {formatRate(values.rate)} BDT
                    </p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-gray-500">Exchange rate used</dt>
                    <dd className="font-semibold text-gray-900">1 NZD = {formatRate(values.rate)} BDT</dd>
                  </div>
                </dl>
              </section>
            </aside>
          </div>

          <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-700 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">How this estimate works</h2>
            <p className="mt-2">
              Total estimate = tuition after scholarship + living cost + one-time extra expenses.
              If your scholarship is higher than the tuition fee, tuition after scholarship is treated as NZD 0.
            </p>
          </section>

          <section className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h2 className="text-base font-semibold text-gray-900">Official sources to check</h2>
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
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 font-medium text-brand-700 transition hover:border-brand-200 hover:text-brand-900 hover:underline"
                >
                  {source.label}
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
