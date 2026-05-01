import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
}

const variantMap: Record<NonNullable<BadgeProps['variant']>, React.CSSProperties> = {
  default: { background: '#E5E7EB', color: '#374151', border: '2px solid #111' },
  success: { background: '#DCFCE7', color: '#15803D', border: '2px solid #111' },
  warning: { background: 'var(--yellow)', color: '#111', border: '2px solid #111' },
  error:   { background: '#FFE4E6', color: '#BE123C', border: '2px solid #111' },
  info:    { background: '#E0F2FE', color: '#0369A1', border: '2px solid #111' },
  purple:  { background: '#EDE9FE', color: '#6D28D9', border: '2px solid #111' },
};

export function Badge({ variant = 'default', className, style, children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-black',
        className
      )}
      style={{ ...variantMap[variant], boxShadow: '2px 2px 0 #111', fontFamily: 'var(--font-syne)', ...style }}
      {...props}
    >
      {children}
    </span>
  );
}
