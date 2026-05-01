import Link from 'next/link';
import { requireRole } from '@/lib/session';
import { listForStaff } from '@/lib/db/complaints';
import { StatusBadge } from '@/components/StatusBadge';
import { StatCard } from '@/components/StatCard';
import { EmptyState } from '@/components/EmptyState';
import {
  AlertCircle, CheckCircle, Clock, Wrench, CheckCircle2, ArrowUpRight,
} from 'lucide-react';

function relTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = Math.floor(diff / 3_600_000);
  const days = Math.floor(hrs / 24);
  if (days >= 1) return `${days}d ago`;
  if (hrs >= 1) return `${hrs}h ago`;
  return 'just now';
}

export default async function StaffDashboard() {
  const session = await requireRole('staff');
  const complaints = await listForStaff(session.user_id);

  const open = complaints.filter((c) => c.current_status !== 'Resolved');
  const resolved = complaints.filter((c) => c.current_status === 'Resolved');
  const inProgress = complaints.filter((c) => c.current_status === 'In_Progress');
  const assigned = complaints.filter((c) => c.current_status === 'Assigned');
  const resolutionRate = complaints.length > 0 ? resolved.length / complaints.length : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-up">
        <p className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>
          Staff Portal
        </p>
        <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>
          Hey, {session.user_name.split(' ')[0]} 🔧
        </h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--muted)' }}>
          {open.length > 0 ? `${open.length} open ${open.length === 1 ? 'job' : 'jobs'} waiting for you.` : 'All caught up — great work!'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Assigned" value={complaints.length} Icon={AlertCircle} accent="var(--yellow)" delay="0s" />
        <StatCard label="Open" value={open.length} Icon={Clock} accent="var(--orange)" delay="0.06s" />
        <StatCard label="In Progress" value={inProgress.length} Icon={Wrench} accent="var(--pink)" delay="0.12s" />
        <StatCard
          label="Resolved"
          value={resolved.length}
          Icon={CheckCircle}
          accent="var(--teal)"
          delay="0.18s"
          progress={resolutionRate}
          subtext={`${Math.round(resolutionRate * 100)}% completion`}
        />
      </div>

      {/* In-Progress */}
      {inProgress.length > 0 && (
        <div className="animate-slide-up-1">
          <div className="flex items-center gap-2 mb-3">
            <Wrench size={16} strokeWidth={2.5} style={{ color: 'var(--orange)' }} />
            <h2 className="text-lg md:text-xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>Currently Working On</h2>
          </div>
          <div className="nb-card overflow-hidden p-0" style={{ borderTop: '4px solid var(--orange)' }}>
            <ul>
              {inProgress.map((c, i) => (
                <ComplaintRow
                  key={c.complaint_id}
                  complaintId={c.complaint_id}
                  title={c.description}
                  meta={`${c.student_name} · ${c.hostel_name} Blk ${c.block} Rm ${c.room_no} · ${c.category_name}`}
                  time={relTime(c.complaint_date)}
                  status={c.current_status}
                  hasBorder={i < inProgress.length - 1}
                  linkTo={`/staff/${c.complaint_id}`}
                />
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Newly Assigned */}
      {assigned.length > 0 && (
        <div className="animate-slide-up-2">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} strokeWidth={2.5} style={{ color: '#0369A1' }} />
            <h2 className="text-lg md:text-xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>Newly Assigned</h2>
          </div>
          <div className="nb-card overflow-hidden p-0" style={{ borderTop: '4px solid #0369A1' }}>
            <ul>
              {assigned.map((c, i) => (
                <ComplaintRow
                  key={c.complaint_id}
                  complaintId={c.complaint_id}
                  title={c.description}
                  meta={`${c.student_name} · ${c.hostel_name} Blk ${c.block} Rm ${c.room_no} · ${c.category_name}`}
                  time={relTime(c.complaint_date)}
                  status={c.current_status}
                  hasBorder={i < assigned.length - 1}
                  linkTo={`/staff/${c.complaint_id}`}
                />
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Recently Resolved */}
      {resolved.length > 0 && (
        <div className="animate-slide-up-3">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={16} strokeWidth={2.5} style={{ color: '#15803D' }} />
            <h2 className="text-lg md:text-xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>Recently Resolved</h2>
          </div>
          <div className="nb-card overflow-hidden p-0" style={{ borderTop: '4px solid var(--teal)' }}>
            <ul>
              {resolved.slice(0, 5).map((c, i, arr) => (
                <ComplaintRow
                  key={c.complaint_id}
                  complaintId={c.complaint_id}
                  title={c.description}
                  meta={`${c.student_name} · ${c.hostel_name} Blk ${c.block}`}
                  time={relTime(c.complaint_date)}
                  status={c.current_status}
                  hasBorder={i < arr.length - 1}
                  linkTo={`/staff/${c.complaint_id}`}
                />
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Nothing at all */}
      {complaints.length === 0 && (
        <EmptyState
          Icon={Wrench}
          title="No jobs yet"
          description="When the admin assigns a complaint to you, it'll show up here."
          accent="var(--teal)"
        />
      )}
    </div>
  );
}

interface ComplaintRowProps {
  complaintId: number;
  title: string;
  meta: string;
  time: string;
  status: import('@/lib/types').ComplaintStatus;
  hasBorder: boolean;
  linkTo: string;
}

function ComplaintRow({ title, meta, time, status, hasBorder, linkTo }: ComplaintRowProps) {
  return (
    <li style={{ borderBottom: hasBorder ? '2px solid #f3f4f6' : undefined }}>
      <Link href={linkTo} className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-amber-50 transition-colors group">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold truncate">{title}</p>
          <div className="flex items-center gap-2 mt-1 text-xs font-medium" style={{ color: 'var(--muted)' }}>
            <span className="truncate">{meta}</span>
            <span>·</span>
            <span className="shrink-0">{time}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={status} />
          <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 hidden sm:block" />
        </div>
      </Link>
    </li>
  );
}
