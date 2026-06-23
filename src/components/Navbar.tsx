import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          {/* NZ fern + flag colours */}
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-nz-black text-white text-lg font-black select-none">
            NZ
          </span>
          <span className="hidden font-bold text-gray-900 sm:block leading-tight">
            Study Agent<br />
            <span className="text-xs font-normal text-gray-500">Bangladesh Directory</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/institutes"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            Institutes
          </Link>
          <Link
            href="/agencies"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            Agencies
          </Link>
          <Link
            href="/about"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            About
          </Link>
          <Link
            href="/interview-questions"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
          >
            Interview Questions
          </Link>
          <Link
            href="/report"
            className="ml-2 btn-primary text-xs sm:text-sm"
          >
            Report Outdated Info
          </Link>
        </nav>
      </div>
    </header>
  );
}
