import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireRole } from '@/lib/session';
import { getById, getStatusLog } from '@/lib/db/complaints';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { StatusTimeline } from '@/components/StatusTimeline';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole('student');
  const complaint = await getById(Number(id));

  if (!complaint || complaint.student_id !== session.user_id) notFound();

  const logs = await getStatusLog(complaint.complaint_id);

  return (
    <div className="space-y-6 max-w-2xl">
      <Link
        href="/student/complaints"
        className="inline-flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-full transition-all hover:-translate-x-1"
        style={{ border: '2px solid #111', background: 'var(--surface)', boxShadow: '2px 2px 0 #111' }}
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="flex items-start justify-between gap-4 animate-slide-up">
        <h1 className="text-2xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>
          Complaint #{complaint.complaint_id}
        </h1>
        <StatusBadge status={complaint.current_status} />
      </div>

      <Card className="space-y-4 animate-slide-up-1">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>Description</p>
          <p className="text-sm font-medium">{complaint.description}</p>
        </div>
        <div
          className="h-px w-full"
          style={{ background: '#e5e7eb' }}
        />
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Category', value: complaint.category_name },
            { label: 'Submitted', value: formatDate(complaint.complaint_date) },
            { label: 'Location', value: `${complaint.hostel_name}, Block ${complaint.block}, Rm ${complaint.room_no}` },
            { label: 'Assigned Staff', value: complaint.staff_name ?? 'Not yet assigned' },
            ...(complaint.resolved_at
              ? [{ label: 'Resolved At', value: formatDate(complaint.resolved_at) }]
              : []),
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-black uppercase tracking-wide" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>{label}</p>
              <p className="text-sm font-semibold mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="animate-slide-up-2">
        <h2 className="text-base font-black mb-5" style={{ fontFamily: 'var(--font-syne)' }}>Status History</h2>
        <StatusTimeline logs={logs} />
      </Card>
    </div>
  );
}
