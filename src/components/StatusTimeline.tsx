import type { StatusLog, ComplaintStatus } from '@/lib/types';

const dotStyle: Record<ComplaintStatus, { bg: string; border: string }> = {
  Submitted:   { bg: '#E5E7EB', border: '#374151' },
  Assigned:    { bg: '#E0F2FE', border: '#0369A1' },
  In_Progress: { bg: 'var(--yellow)', border: '#111' },
  Resolved:    { bg: '#DCFCE7', border: '#15803D' },
  Reopened:    { bg: '#EDE9FE', border: '#6D28D9' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function StatusTimeline({ logs }: { logs: StatusLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>No status history yet.</p>;
  }
  return (
    <ol className="relative ml-3" style={{ borderLeft: '2px solid #111' }}>
      {logs.map((log, i) => {
        const dot = dotStyle[log.status] ?? dotStyle.Submitted;
        return (
          <li key={log.log_id} className={i < logs.length - 1 ? 'mb-6' : ''}>
            <span
              className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full"
              style={{
                background: dot.bg,
                border: `2px solid ${dot.border}`,
                boxShadow: '2px 2px 0 #111',
              }}
            />
            <div className="ml-6">
              <p
                className="text-sm font-black"
                style={{ fontFamily: 'var(--font-syne)' }}
              >
                {log.status.replace('_', ' ')}
              </p>
              <time className="text-xs" style={{ color: 'var(--muted)' }}>
                {formatDate(log.updated_time)}
              </time>
              {log.note && (
                <p
                  className="mt-1.5 text-sm rounded-xl px-3 py-2 font-medium"
                  style={{ border: '2px solid #111', background: 'var(--bg)', boxShadow: '2px 2px 0 #111' }}
                >
                  {log.note}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
