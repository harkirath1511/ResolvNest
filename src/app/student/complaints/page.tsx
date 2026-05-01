import Link from 'next/link';
import { requireRole } from '@/lib/session';
import { listForStudent } from '@/lib/db/complaints';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/StatusBadge';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export default async function StudentComplaintsPage() {
  const session = await requireRole('student');
  const complaints = await listForStudent(session.user_id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Complaints</h1>
        <p className="text-slate-500 mt-1">{complaints.length} complaint{complaints.length !== 1 ? 's' : ''} raised</p>
      </div>

      <Card padding="none">
        {complaints.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-500 text-sm">
            No complaints yet.{' '}
            <Link href="/student/new" className="text-indigo-600 hover:underline">
              Raise one now.
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <li key={c.complaint_id}>
                <Link
                  href={`/student/complaints/${c.complaint_id}`}
                  className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800">{c.description}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {c.category_name} · {formatDate(c.complaint_date)}
                      {c.staff_name && ` · Assigned to ${c.staff_name}`}
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
