import { clsx } from 'clsx';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const baseInput = 'rounded-xl px-4 py-2.5 text-sm font-medium bg-white w-full outline-none transition-all';
const baseInputStyle: React.CSSProperties = {
  border: '2px solid #111',
  boxShadow: '3px 3px 0 #111',
  fontFamily: 'var(--font-dm-sans)',
};
const focusStyle = 'focus:ring-0';

export function Input({ label, error, className, id, style, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-bold" style={{ fontFamily: 'var(--font-syne)' }}>
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(baseInput, focusStyle, className)}
        style={{ ...baseInputStyle, borderColor: error ? 'var(--pink)' : '#111', ...style }}
        {...props}
      />
      {error && <p className="text-xs font-semibold" style={{ color: 'var(--pink)' }}>{error}</p>}
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, id, style, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-bold" style={{ fontFamily: 'var(--font-syne)' }}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={clsx(baseInput, focusStyle, 'resize-none', className)}
        style={{ ...baseInputStyle, borderColor: error ? 'var(--pink)' : '#111', ...style }}
        rows={4}
        {...props}
      />
      {error && <p className="text-xs font-semibold" style={{ color: 'var(--pink)' }}>{error}</p>}
    </div>
  );
}
