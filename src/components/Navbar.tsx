import { useState } from 'react';
import Link from 'next/link';
import { MenuIcon, CloseIcon } from './icons';

const NAV_LINKS = [
  { href: '/institutes', label: 'Institutes' },
  { href: '/agencies', label: 'Agencies' },
  { href: '/faq', label: 'FAQ' },
  { href: '/cost-calculator', label: 'Cost Calculator' },
  { href: '/interview-questions', label: 'Interview Questions' },
  { href: '/about', label: 'About' },
];

function LogoMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-sm font-black text-ink-950 shadow-sm select-none">
      NZ
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink-900/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <LogoMark />
          <span className="leading-tight">
            <span className="block font-bold text-white">NZ Study Planner</span>
            <span className="block text-xs font-normal text-ink-400">Bangladesh</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-200 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/report" className="btn-primary ml-2 text-sm">
            Report Outdated Info
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className="inline-flex items-center justify-center rounded-lg p-2 text-ink-200 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 lg:hidden"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav id="mobile-nav" className="border-t border-white/10 bg-ink-900 lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-base font-medium text-ink-100 transition hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/report"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full text-sm"
            >
              Report Outdated Info
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
