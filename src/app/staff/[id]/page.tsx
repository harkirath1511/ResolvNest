import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { requireRole } from '@/lib/session';
import { getById, getStatusLog } from '@/lib/db/complaints';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { StatusTimeline } from '@/components/StatusTimeline';
import { StatusUpdateForm } from './StatusUpdateForm';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default async function StaffComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireRole('staff');
  const complaint = await getById(Number(id));

  if (!complaint || complaint.staff_id !== session.user_id) notFound();

  const logs = await getStatusLog(complaint.complaint_id);

  const details = [
    { label: 'Category', value: complaint.category_name },
    { label: 'Student', value: complaint.student_name },
    { label: 'Location', value: `${complaint.hostel_name}, Block ${complaint.block}, Rm ${complaint.room_no}` },
    { label: 'Submitted', value: formatDate(complaint.complaint_date) },
    ...(complaint.resolved_at ? [{ label: 'Resolved', value: formatDate(complaint.resolved_at) }] : []),
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <Link
        href="/staff"
        className="inline-flex items-center gap-2 text-sm font-black px-3 py-1.5 rounded-full transition-all hover:-translate-x-1"
        style={{ border: '2px solid #111', background: '#fff', boxShadow: '2px 2px 0 #111', fontFamily: 'var(--font-syne)' }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} /> Back
      </Link>

      <div className="flex items-start justify-between gap-4 animate-slide-up">
        <div>
          <p className="text-xs font-black uppercase tracking-widest mb-0.5" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>
            Complaint
          </p>
          <h1 className="text-2xl md:text-3xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>
            #{complaint.complaint_id}
          </h1>
        </div>
        <StatusBadge status={complaint.current_status} />
      </div>

      <Card className="animate-slide-up-1" accent="var(--yellow)">
        <p className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>Description</p>
        <p className="text-sm font-medium mb-4">{complaint.description}</p>
        <div className="h-px w-full" style={{ background: '#e5e7eb' }} />
        <div className="grid grid-cols-2 gap-4 mt-4">
          {details.map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs font-black uppercase tracking-wide" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>{label}</p>
              <p className="text-sm font-semibold mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="animate-slide-up-2" accent="var(--pink)">
        <h2 className="text-base font-black mb-5" style={{ fontFamily: 'var(--font-syne)' }}>Update Status</h2>
        <StatusUpdateForm complaintId={complaint.complaint_id} currentStatus={complaint.current_status} />
      </Card>

      <Card className="animate-slide-up-3" accent="var(--teal)">
        <h2 className="text-base font-black mb-5" style={{ fontFamily: 'var(--font-syne)' }}>Status History</h2>
        <StatusTimeline logs={logs} />
      </Card>
    </div>
  );
}
