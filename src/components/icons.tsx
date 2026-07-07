import type { SVGProps } from 'react';
import type { InstituteType } from '@/lib/types';

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps) => ({
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...props,
});

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9l5 3-5 3V9z" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

export function WarningIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M10.3 3.8L2 18a1.9 1.9 0 001.7 2.8h16.6A1.9 1.9 0 0022 18L13.7 3.8a1.9 1.9 0 00-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

export function UniversityIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 10l9-5 9 5-9 5-9-5z" />
      <path d="M5 12v5M9 12v5M15 12v5M19 12v5M4 20h16" />
    </svg>
  );
}

export function WrenchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14.7 6.3a4 4 0 00-5.4 5.4l-6 6 2.9 2.9 6-6a4 4 0 005.4-5.4l-2.6 2.6-2.9-2.9 2.6-2.6z" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5a2 2 0 012-2h9v16H6a2 2 0 00-2 2V5z" />
      <path d="M15 3h3a1 1 0 011 1v13a1 1 0 01-1 1h-3" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.5A8 8 0 1121 12z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M14 5h5v5M19 5l-9 9M12 5H6a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1v-6" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/** Maps an institute type to its themed icon. */
export function InstituteTypeIcon({ type, ...props }: IconProps & { type: InstituteType }) {
  switch (type) {
    case 'Polytechnic':
      return <WrenchIcon {...props} />;
    case 'Private Institute':
      return <BookIcon {...props} />;
    case 'English Language School':
      return <ChatIcon {...props} />;
    case 'University':
    default:
      return <UniversityIcon {...props} />;
  }
}
