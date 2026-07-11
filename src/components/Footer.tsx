import Link from 'next/link';

const QUICK_LINKS = [
  { href: '/institutes', label: 'Browse Institutes' },
  { href: '/agencies', label: 'Browse Agencies' },
  { href: '/cost-calculator', label: 'Cost Calculator' },
  { href: '/faq', label: 'Student Visa FAQ' },
  { href: '/visa-checklist', label: 'Visa Checklist' },
  { href: '/interview-questions', label: 'Interview Questions' },
  { href: '/report', label: 'Report Outdated Info' },
  { href: '/about', label: 'About this Directory' },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-ink-950 text-ink-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <span className="mb-3 flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-sm font-black text-ink-950">
                NZ
              </span>
              <span className="leading-tight">
                <span className="block font-bold text-white">NZ Study Planner</span>
                <span className="block text-xs text-ink-400">Bangladesh</span>
              </span>
            </span>
            <p className="max-w-sm text-sm leading-relaxed text-ink-400">
              A student-friendly guide for Bangladeshis planning to study in New Zealand. Explore
              institutes, find authorized agents, and estimate costs.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-500">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-300 transition hover:text-accent-400">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="md:col-span-4">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-500">Disclaimer</h3>
            <p className="text-sm leading-relaxed text-ink-400">
              Information is collected from publicly available pages on official New Zealand institute
              websites. Always verify agent authorization directly with the institute before making any
              payments.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} New Zealand Study Planner - Bangladesh. A resource for
            Bangladeshi students exploring New Zealand study options.
          </p>
          <p>
            Developed by{' '}
            <a
              href="https://www.linkedin.com/in/devnawaz/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink-300 transition hover:text-accent-400"
            >
              devnawaz
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
