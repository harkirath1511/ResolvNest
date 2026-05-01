import type { ComplaintStatus } from '@/lib/types';

const statusMap: Record<ComplaintStatus, { label: string; bg: string; color: string }> = {
  Submitted:   { label: 'Submitted',   bg: '#E5E7EB', color: '#374151' },
  Assigned:    { label: 'Assigned',    bg: '#E0F2FE', color: '#0369A1' },
  In_Progress: { label: 'In Progress', bg: 'var(--yellow)', color: '#111' },
  Resolved:    { label: 'Resolved',    bg: '#DCFCE7', color: '#15803D' },
  Reopened:    { label: 'Reopened',    bg: '#EDE9FE', color: '#6D28D9' },
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const { label, bg, color } = statusMap[status] ?? statusMap.Submitted;
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-black whitespace-nowrap"
      style={{
        background: bg,
        color,
        border: '2px solid #111',
        boxShadow: '2px 2px 0 #111',
        fontFamily: 'var(--font-syne)',
      }}
    >
      {label}
    </span>
  );
}
