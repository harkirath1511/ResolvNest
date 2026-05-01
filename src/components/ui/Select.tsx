import { clsx } from 'clsx';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  options: { value: string | number; label: string }[];
}

export function Select({ label, error, placeholder, options, className, id, style, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-bold" style={{ fontFamily: 'var(--font-syne)' }}>
          {label}
        </label>
      )}
      <select
        id={id}
        className={clsx('rounded-xl px-4 py-2.5 text-sm font-medium bg-white w-full outline-none appearance-none cursor-pointer', className)}
        style={{
          border: '2px solid #111',
          boxShadow: '3px 3px 0 #111',
          borderColor: error ? 'var(--pink)' : '#111',
          fontFamily: 'var(--font-dm-sans)',
          ...style,
        }}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs font-semibold" style={{ color: 'var(--pink)' }}>{error}</p>}
    </div>
  );
}
