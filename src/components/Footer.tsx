import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <span className="flex items-center gap-2 mb-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-nz-black text-white text-sm font-black">NZ</span>
              <span className="font-bold text-gray-900 text-sm">New Zealand Study Planner - Bangladesh</span>
            </span>
            <p className="text-xs text-gray-500 leading-relaxed">
              A student-friendly guide for Bangladeshis planning to study in New Zealand.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Quick Links</h3>
            <ul className="space-y-1.5 text-sm">
              {[
                { href: '/institutes', label: 'Browse Institutes' },
                { href: '/agencies', label: 'Browse Agencies' },
                { href: '/report', label: 'Report Outdated Info' },
                { href: '/faq', label: 'Student Visa FAQ' },
                { href: '/cost-calculator', label: 'Cost Calculator' },
                { href: '/about', label: 'About this Directory' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-600 hover:text-brand-700 transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Disclaimer</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Information is collected from publicly available pages on official New Zealand institute websites.
              Always verify agent authorization directly with the institute before making any payments.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} New Zealand Study Planner - Bangladesh. A resource for Bangladeshi students exploring New Zealand study options. Developed by{' '}
          <a
            href="https://www.linkedin.com/in/devnawaz/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-gray-500 hover:text-brand-700 hover:underline"
          >
            devnawaz
          </a>
          .
        </div>
      </div>
    </footer>
  );
}
