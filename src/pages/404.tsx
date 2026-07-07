import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';

export default function NotFound() {
  return (
    <>
      <Head><title>Page not found — New Zealand Study Planner - Bangladesh</title></Head>
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="text-6xl font-extrabold text-accent-600">404</p>
          <h1 className="mt-4 text-2xl font-bold text-ink-900">Page not found</h1>
          <p className="mt-2 text-ink-500">The page you are looking for does not exist.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/" className="btn-primary">Go to home</Link>
            <Link href="/institutes" className="btn-secondary">Browse institutes</Link>
          </div>
        </div>
      </Layout>
    </>
  );
}
