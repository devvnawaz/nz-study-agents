export default function DemoBanner() {
  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center text-sm text-yellow-800">
      <strong>Demo mode:</strong> Agency data shown is for development only.
      Connect Supabase and add real authorized-agent data before publishing.{' '}
      <a href="/about" className="underline font-medium">Learn more</a>
    </div>
  );
}
