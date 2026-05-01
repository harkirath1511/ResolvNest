import { Badge } from './ui/Badge';
import type { ComplaintStatus } from '@/lib/types';

const statusMap: Record<ComplaintStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' }> = {
  Submitted:   { label: 'Submitted',   variant: 'default' },
  Assigned:    { label: 'Assigned',    variant: 'info' },
  In_Progress: { label: 'In Progress', variant: 'warning' },
  Resolved:    { label: 'Resolved',    variant: 'success' },
  Reopened:    { label: 'Reopened',    variant: 'purple' },
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const { label, variant } = statusMap[status] ?? { label: status, variant: 'default' };
  return <Badge variant={variant}>{label}</Badge>;
}
