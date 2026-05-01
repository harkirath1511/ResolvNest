import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: number | string;
  Icon: LucideIcon;
  accent: string;
  delay?: string;
  /** Progress bar fraction 0..1 — if provided, renders a mini bar */
  progress?: number;
  subtext?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  Icon,
  accent,
  delay,
  progress,
  subtext,
  className,
}: StatCardProps) {
  const pct = typeof progress === 'number' ? Math.max(0, Math.min(1, progress)) * 100 : null;
  return (
    <div
      className={clsx('nb-card p-5 flex flex-col gap-3 animate-slide-up', className)}
      style={{ animationDelay: delay, borderTop: `4px solid ${accent}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-[11px] font-black uppercase tracking-widest"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}
          >
            {label}
          </p>
          <p
            className="text-3xl md:text-4xl font-black mt-1 leading-none"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            {value}
          </p>
          {subtext && (
            <p className="text-xs font-medium mt-1" style={{ color: 'var(--muted)' }}>
              {subtext}
            </p>
          )}
        </div>
        <span
          className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
          style={{
            background: accent,
            border: '2px solid #111',
            boxShadow: '2px 2px 0 #111',
          }}
        >
          <Icon size={20} strokeWidth={2.5} color="#111" />
        </span>
      </div>
      {pct !== null && (
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ background: '#F1F1ED', border: '1.5px solid #111' }}
        >
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${pct}%`, background: accent }}
          />
        </div>
      )}
    </div>
  );
}
