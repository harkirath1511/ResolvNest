import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';

interface EmptyStateProps {
  Icon: LucideIcon;
  title: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  accent?: string;
}

export function EmptyState({
  Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
  accent = 'var(--yellow)',
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center gap-3 text-center px-6 py-14 rounded-xl"
      style={{ border: '2px dashed #111', background: 'var(--bg)' }}
    >
      <div
        className="float-1 flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: accent, border: '2px solid #111', boxShadow: '3px 3px 0 #111' }}
      >
        <Icon size={26} strokeWidth={2.5} color="#111" />
      </div>
      <div>
        <p className="text-base font-black" style={{ fontFamily: 'var(--font-syne)' }}>
          {title}
        </p>
        {description && (
          <p className="text-sm font-medium mt-0.5 max-w-xs" style={{ color: 'var(--muted)' }}>
            {description}
          </p>
        )}
      </div>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-1.5 mt-2 text-xs font-black px-4 py-2 rounded-xl transition-all hover:-translate-y-0.5"
          style={{
            background: accent,
            border: '2px solid #111',
            boxShadow: '3px 3px 0 #111',
            color: '#111',
            fontFamily: 'var(--font-syne)',
          }}
        >
          {ctaLabel} <ArrowUpRight size={12} strokeWidth={2.5} />
        </Link>
      )}
    </div>
  );
}
