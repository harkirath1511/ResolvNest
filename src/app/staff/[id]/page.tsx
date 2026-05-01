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

  return (
    <div className="space-y-6 max-w-2xl">
      <Link
        href="/staff"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={14} /> Back to dashboard
      </Link>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Complaint #{complaint.complaint_id}
        </h1>
        <StatusBadge status={complaint.current_status} />
      </div>

      <Card className="space-y-4">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Description</p>
          <p className="text-sm text-slate-800">{complaint.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <p className="text-xs text-slate-500">Category</p>
            <p className="text-sm font-medium text-slate-800">{complaint.category_name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Student</p>
            <p className="text-sm font-medium text-slate-800">{complaint.student_name}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Location</p>
            <p className="text-sm font-medium text-slate-800">
              {complaint.hostel_name}, Block {complaint.block}, Room {complaint.room_no}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Submitted</p>
            <p className="text-sm font-medium text-slate-800">{formatDate(complaint.complaint_date)}</p>
          </div>
          {complaint.resolved_at && (
            <div>
              <p className="text-xs text-slate-500">Resolved</p>
              <p className="text-sm font-medium text-emerald-700">{formatDate(complaint.resolved_at)}</p>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-slate-900 mb-5">Update Status</h2>
        <StatusUpdateForm
          complaintId={complaint.complaint_id}
          currentStatus={complaint.current_status}
        />
      </Card>

      <Card>
        <h2 className="text-base font-semibold text-slate-900 mb-5">Status History</h2>
        <StatusTimeline logs={logs} />
      </Card>
    </div>
  );
}
