import { clsx } from 'clsx';
import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';

export function Table({ className, children, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table className={clsx('w-full text-sm', className)} {...props}>
        {children}
      </table>
    </div>
  );
}

export function Thead({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={clsx(className)}
      style={{ borderBottom: '2px solid #111', background: 'var(--bg)' }}
      {...props}
    >
      {children}
    </thead>
  );
}

export function Th({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={clsx('px-4 py-3 text-left text-xs font-black uppercase tracking-widest', className)}
      style={{ fontFamily: 'var(--font-syne)', color: '#111' }}
      {...props}
    >
      {children}
    </th>
  );
}

export function Tbody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={clsx('divide-y', className)} style={{ borderColor: '#e5e7eb' }} {...props}>
      {children}
    </tbody>
  );
}

export function Tr({ className, children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={clsx('transition-colors hover:bg-amber-50', className)}
      {...props}
    >
      {children}
    </tr>
  );
}

export function Td({ className, children, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={clsx('px-4 py-3', className)} {...props}>
      {children}
    </td>
  );
}
