import { clsx } from 'clsx';
import type { StatusLog, ComplaintStatus } from '@/lib/types';

const dotColor: Record<ComplaintStatus, string> = {
  Submitted:   'bg-slate-400',
  Assigned:    'bg-sky-500',
  In_Progress: 'bg-amber-500',
  Resolved:    'bg-emerald-500',
  Reopened:    'bg-purple-500',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function StatusTimeline({ logs }: { logs: StatusLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-slate-500">No status history available.</p>;
  }

  return (
    <ol className="relative border-l border-slate-200 ml-2">
      {logs.map((log, i) => (
        <li key={log.log_id} className={clsx('ml-6', i < logs.length - 1 ? 'mb-6' : '')}>
          <span
            className={clsx(
              'absolute -left-2.5 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white',
              dotColor[log.status] ?? 'bg-slate-400'
            )}
          />
          <p className="text-sm font-semibold text-slate-800">
            {log.status.replace('_', ' ')}
          </p>
          <time className="text-xs text-slate-500">{formatDate(log.updated_time)}</time>
          {log.note && (
            <p className="mt-1 text-sm text-slate-600 bg-slate-50 rounded-md px-3 py-2">
              {log.note}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
