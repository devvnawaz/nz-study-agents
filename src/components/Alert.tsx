import type { ReactNode } from 'react';
import { InfoIcon, WarningIcon } from './icons';

interface AlertProps {
  variant?: 'info' | 'warning';
  title: string;
  children: ReactNode;
}

/**
 * Disclaimer / notice box with an icon circle. Communicates state with both
 * an icon and text (not colour alone) for accessibility.
 */
export default function Alert({ variant = 'info', title, children }: AlertProps) {
  const isWarning = variant === 'warning';
  return (
    <div className={isWarning ? 'alert-warning' : 'alert-info'}>
      <div className="flex gap-3.5">
        <span
          className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
            isWarning ? 'bg-amber-100 text-amber-700' : 'bg-accent-100 text-accent-700'
          }`}
        >
          {isWarning ? <WarningIcon className="h-4.5 w-4.5" /> : <InfoIcon className="h-4.5 w-4.5" />}
        </span>
        <div className="min-w-0">
          <p className={`font-semibold ${isWarning ? 'text-amber-900' : 'text-ink-900'}`}>{title}</p>
          <div className="mt-1 leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
