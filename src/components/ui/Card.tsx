import { clsx } from 'clsx';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg' | 'none';
  accent?: string;
}

export function Card({ padding = 'md', accent, className, style, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        'nb-card',
        {
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
          '': padding === 'none',
        },
        className
      )}
      style={{
        borderTop: accent ? `4px solid ${accent}` : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={clsx('text-base font-black', className)}
      style={{ fontFamily: 'var(--font-syne)' }}
      {...props}
    >
      {children}
    </h3>
  );
}
