import Link from 'next/link';
import { requireRole } from '@/lib/session';
import { listForStaff } from '@/lib/db/complaints';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { Wrench, CheckCircle, Clock, AlertCircle } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default async function StaffDashboard() {
  const session = await requireRole('staff');
  const complaints = await listForStaff(session.user_id);

  const open = complaints.filter((c) => c.current_status !== 'Resolved');
  const resolved = complaints.filter((c) => c.current_status === 'Resolved');
  const inProgress = complaints.filter((c) => c.current_status === 'In_Progress');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome, {session.user_name}</h1>
        <p className="text-slate-500 mt-1">Manage your assigned maintenance complaints.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
            <AlertCircle size={20} className="text-indigo-600" />
          </span>
          <div>
            <p className="text-2xl font-bold text-slate-900">{complaints.length}</p>
            <p className="text-xs text-slate-500">Total assigned</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
            <Clock size={20} className="text-amber-600" />
          </span>
          <div>
            <p className="text-2xl font-bold text-slate-900">{open.length}</p>
            <p className="text-xs text-slate-500">Open</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
            <CheckCircle size={20} className="text-emerald-600" />
          </span>
          <div>
            <p className="text-2xl font-bold text-slate-900">{resolved.length}</p>
            <p className="text-xs text-slate-500">Resolved</p>
          </div>
        </Card>
      </div>

      {/* In-progress first, then rest */}
      {inProgress.length > 0 && (
        <Card padding="none">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Wrench size={16} className="text-amber-500" />
              In Progress
            </h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {inProgress.map((c) => (
              <li key={c.complaint_id}>
                <Link
                  href={`/staff/${c.complaint_id}`}
                  className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{c.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {c.student_name} · {c.hostel_name} {c.block}, Room {c.room_no} · {c.category_name} · {formatDate(c.complaint_date)}
                    </p>
                  </div>
                  <StatusBadge status={c.current_status} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">All Assigned Complaints</h2>
        </div>
        {complaints.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-500 text-sm">
            No complaints assigned to you yet.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <li key={c.complaint_id}>
                <Link
                  href={`/staff/${c.complaint_id}`}
                  className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{c.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {c.student_name} · {c.hostel_name} Blk {c.block} Rm {c.room_no} · {c.category_name} · {formatDate(c.complaint_date)}
                    </p>
                  </div>
                  <StatusBadge status={c.current_status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
