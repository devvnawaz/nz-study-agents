export default function DemoBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
      <strong>Demo mode:</strong> Agency data shown is for development only.
      Connect Supabase and add real authorized-agent data before publishing.{' '}
      <a href="/about" className="font-medium underline">Learn more</a>
    </div>
  );
}
