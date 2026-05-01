import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'yellow' | 'teal' | 'pink';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, React.CSSProperties> = {
  primary:   { background: '#111111', color: '#fff',  border: '2px solid #111', boxShadow: '3px 3px 0 #111' },
  yellow:    { background: 'var(--yellow)', color: '#111', border: '2px solid #111', boxShadow: '3px 3px 0 #111' },
  teal:      { background: 'var(--teal)',   color: '#111', border: '2px solid #111', boxShadow: '3px 3px 0 #111' },
  pink:      { background: 'var(--pink)',   color: '#fff', border: '2px solid #111', boxShadow: '3px 3px 0 #111' },
  secondary: { background: '#fff',         color: '#111', border: '2px solid #111', boxShadow: '3px 3px 0 #111' },
  danger:    { background: 'var(--pink)',   color: '#fff', border: '2px solid #111', boxShadow: '3px 3px 0 #111' },
  ghost:     { background: 'transparent',  color: '#111', border: '2px solid transparent' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  style,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-bold rounded-xl',
        'transition-all duration-150 cursor-pointer',
        'hover:-translate-y-0.5 hover:shadow-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black',
        'disabled:opacity-50 disabled:pointer-events-none',
        'active:translate-y-0 active:shadow-none',
        {
          'text-xs px-3 py-1.5': size === 'sm',
          'text-sm px-4 py-2.5': size === 'md',
          'text-base px-6 py-3': size === 'lg',
        },
        className
      )}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
