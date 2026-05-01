import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none',
        {
          'bg-indigo-600 text-white hover:bg-indigo-700': variant === 'primary',
          'bg-slate-100 text-slate-700 hover:bg-slate-200': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          'text-slate-600 hover:bg-slate-100': variant === 'ghost',
          'border border-slate-300 text-slate-700 hover:bg-slate-50': variant === 'outline',
          'text-xs px-2.5 py-1.5': size === 'sm',
          'text-sm px-4 py-2': size === 'md',
          'text-base px-5 py-2.5': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
