import Link from 'next/link';
import { requireRole } from '@/lib/session';
import { listForStudent } from '@/lib/db/complaints';
import { StatusBadge } from '@/components/StatusBadge';
import { EmptyState } from '@/components/EmptyState';
import { Inbox, ArrowUpRight } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function StudentComplaintsPage() {
  const session = await requireRole('student');
  const complaints = await listForStudent(session.user_id);

  return (
    <div className="space-y-6">
      <div className="animate-slide-up">
        <p className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>My complaints</p>
        <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>
          All Complaints
        </h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--muted)' }}>
          {complaints.length} {complaints.length === 1 ? 'complaint' : 'complaints'} raised so far.
        </p>
      </div>

      {complaints.length === 0 ? (
        <EmptyState
          Icon={Inbox}
          title="No complaints yet"
          description="When you raise a complaint, it'll show up here."
          ctaLabel="Raise your first complaint"
          ctaHref="/student/new"
          accent="var(--yellow)"
        />
      ) : (
        <div className="nb-card overflow-hidden p-0 animate-slide-up-1">
          <ul>
            {complaints.map((c, i) => (
              <li key={c.complaint_id} style={{ borderBottom: i < complaints.length - 1 ? '2px solid #f3f4f6' : undefined }}>
                <Link
                  href={`/student/complaints/${c.complaint_id}`}
                  className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-amber-50 transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate">{c.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs font-medium flex-wrap" style={{ color: 'var(--muted)' }}>
                      <span className="font-bold" style={{ color: '#111' }}>{c.category_name}</span>
                      <span>·</span>
                      <span>{formatDate(c.complaint_date)}</span>
                      {c.staff_name && (<><span>·</span><span>→ {c.staff_name}</span></>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={c.current_status} />
                    <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 hidden sm:block" />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
