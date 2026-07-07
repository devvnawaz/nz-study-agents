import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  eyebrow?: string;
  children?: ReactNode;
}

/**
 * Compact navy header used at the top of inner pages, echoing the homepage
 * hero at a smaller scale for a consistent visual system.
 */
export default function PageHeader({ title, subtitle, eyebrow, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      {/* Subtle decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent-300">{eyebrow}</p>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-300">{subtitle}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
