import { clsx } from 'clsx';
import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react';

export function Table({ className, children, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table
        className={clsx('w-full text-sm text-left text-slate-700', className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function Thead({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={clsx('bg-slate-50 text-xs text-slate-500 uppercase tracking-wide', className)} {...props}>
      {children}
    </thead>
  );
}

export function Th({ className, children, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={clsx('px-4 py-3 font-medium', className)} {...props}>
      {children}
    </th>
  );
}

export function Tbody({ className, children, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={clsx('divide-y divide-slate-100', className)}
      {...props}
    >
      {children}
    </tbody>
  );
}

export function Tr({ className, children, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={clsx('hover:bg-slate-50 transition-colors', className)} {...props}>
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
