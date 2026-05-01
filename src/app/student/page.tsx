import Link from 'next/link';
import { requireRole } from '@/lib/session';
import { listForStudent } from '@/lib/db/complaints';
import { StatusBadge } from '@/components/StatusBadge';
import { StatCard } from '@/components/StatCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/ui/Button';
import { PlusCircle, AlertCircle, CheckCircle, Clock, Inbox, ArrowUpRight } from 'lucide-react';
import type { ComplaintView } from '@/lib/types';

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3_600_000);
  const days = Math.floor(hrs / 24);
  if (days >= 1) return `${days}d ago`;
  if (hrs >= 1) return `${hrs}h ago`;
  return 'just now';
}

export default async function StudentDashboard() {
  const session = await requireRole('student');
  const complaints: ComplaintView[] = await listForStudent(session.user_id);

  const open = complaints.filter((c) => c.current_status !== 'Resolved');
  const resolved = complaints.filter((c) => c.current_status === 'Resolved');
  const recent = complaints.slice(0, 5);
  const resolutionRate = complaints.length > 0 ? resolved.length / complaints.length : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 animate-slide-up">
        <div>
          <p className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>
            Student Portal
          </p>
          <h1 className="text-3xl md:text-4xl font-black leading-tight" style={{ fontFamily: 'var(--font-syne)' }}>
            Hey, {session.user_name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm font-medium mt-1" style={{ color: 'var(--muted)' }}>
            Here&apos;s what&apos;s happening with your complaints today.
          </p>
        </div>
        <Link href="/student/new">
          <Button variant="yellow" size="md">
            <PlusCircle size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">New Complaint</span>
            <span className="sm:hidden">New</span>
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Raised"
          value={complaints.length}
          Icon={AlertCircle}
          accent="var(--yellow)"
          delay="0s"
        />
        <StatCard
          label="Still Open"
          value={open.length}
          Icon={Clock}
          accent="var(--orange)"
          delay="0.08s"
          subtext={open.length > 0 ? 'Team is on it' : 'All caught up'}
        />
        <StatCard
          label="Resolved"
          value={resolved.length}
          Icon={CheckCircle}
          accent="var(--teal)"
          delay="0.16s"
          progress={resolutionRate}
          subtext={`${Math.round(resolutionRate * 100)}% resolution rate`}
        />
      </div>

      {/* Recent complaints */}
      <div className="animate-slide-up-2">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg md:text-xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>Recent Activity</h2>
            <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Your last {Math.min(5, complaints.length)} complaints</p>
          </div>
          {complaints.length > 0 && (
            <Link
              href="/student/complaints"
              className="inline-flex items-center gap-1 text-xs font-black px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
              style={{ border: '2px solid #111', boxShadow: '2px 2px 0 #111', background: '#fff', fontFamily: 'var(--font-syne)' }}
            >
              View all <ArrowUpRight size={12} strokeWidth={2.5} />
            </Link>
          )}
        </div>
        {recent.length === 0 ? (
          <EmptyState
            Icon={Inbox}
            title="No complaints yet"
            description="When you raise a complaint, it'll show up here with live status updates."
            ctaLabel="Raise your first complaint"
            ctaHref="/student/new"
            accent="var(--yellow)"
          />
        ) : (
          <div className="nb-card overflow-hidden p-0">
            <ul>
              {recent.map((c, i) => (
                <li key={c.complaint_id} style={{ borderBottom: i < recent.length - 1 ? '2px solid #f3f4f6' : undefined }}>
                  <Link
                    href={`/student/complaints/${c.complaint_id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-amber-50 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate">{c.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs font-medium flex-wrap" style={{ color: 'var(--muted)' }}>
                        <span className="font-bold" style={{ color: '#111' }}>{c.category_name}</span>
                        <span>·</span>
                        <span>{relTime(c.complaint_date)}</span>
                        {c.staff_name && (
                          <>
                            <span>·</span>
                            <span>→ {c.staff_name}</span>
                          </>
                        )}
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
    </div>
  );
}
