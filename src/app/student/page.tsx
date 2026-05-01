import Link from 'next/link';
import { requireRole } from '@/lib/session';
import { listForStudent } from '@/lib/db/complaints';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/Button';
import { PlusCircle, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { ComplaintView } from '@/lib/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default async function StudentDashboard() {
  const session = await requireRole('student');
  const complaints: ComplaintView[] = await listForStudent(session.user_id);

  const open = complaints.filter((c) => c.current_status !== 'Resolved');
  const resolved = complaints.filter((c) => c.current_status === 'Resolved');
  const recent = complaints.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {session.user_name}
          </h1>
          <p className="text-slate-500 mt-1">Track and manage your hostel complaints.</p>
        </div>
        <Link href="/student/new">
          <Button>
            <PlusCircle size={16} />
            New Complaint
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100">
            <AlertCircle size={20} className="text-indigo-600" />
          </span>
          <div>
            <p className="text-2xl font-bold text-slate-900">{complaints.length}</p>
            <p className="text-xs text-slate-500">Total complaints</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
            <Clock size={20} className="text-amber-600" />
          </span>
          <div>
            <p className="text-2xl font-bold text-slate-900">{open.length}</p>
            <p className="text-xs text-slate-500">Open complaints</p>
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

      {/* Recent complaints */}
      <Card padding="none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Recent Complaints</h2>
          <Link href="/student/complaints" className="text-sm text-indigo-600 hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-5 py-10 text-center text-slate-500 text-sm">
            No complaints yet.{' '}
            <Link href="/student/new" className="text-indigo-600 hover:underline">
              Raise one now.
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((c) => (
              <li key={c.complaint_id}>
                <Link
                  href={`/student/complaints/${c.complaint_id}`}
                  className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1 mr-4">
                    <p className="text-sm font-medium text-slate-800 truncate">{c.description}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {c.category_name} · {formatDate(c.complaint_date)}
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
