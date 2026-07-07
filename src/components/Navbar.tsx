import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/institutes', label: 'Institutes' },
  { href: '/agencies', label: 'Agencies' },
  { href: '/about', label: 'About' },
  { href: '/faq', label: 'FAQ' },
  { href: '/cost-calculator', label: 'Cost Calculator' },
  { href: '/interview-questions', label: 'Interview Questions' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          {/* NZ fern + flag colours */}
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-nz-black text-white text-lg font-black select-none">
            NZ
          </span>
          <span className="hidden font-bold text-gray-900 sm:block leading-tight">
            NZ Study Planner<br />
            <span className="text-xs font-normal text-gray-500">Bangladesh</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex md:gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/report" className="ml-2 btn-primary text-xs sm:text-sm">
            Report Outdated Info
          </Link>
        </nav>

        {/* Mobile hamburger button */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 md:hidden"
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-gray-200 bg-white md:hidden"
        >
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/report"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full justify-center text-sm"
            >
              Report Outdated Info
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
