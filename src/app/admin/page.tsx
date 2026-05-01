import { requireRole } from '@/lib/session';
import { listAllForAdmin } from '@/lib/db/complaints';
import { listStaff } from '@/lib/db/staff';
import { listHostels } from '@/lib/db/hostels';
import { listCategories } from '@/lib/db/categories';
import { StatusBadge } from '@/components/StatusBadge';
import { StatCard } from '@/components/StatCard';
import { EmptyState } from '@/components/EmptyState';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { ComplaintsFilter } from './ComplaintsFilter';
import { AssignForm } from './AssignForm';
import { Inbox, Clock, CheckCircle, AlertCircle, Wrench } from 'lucide-react';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  await requireRole('admin');
  const sp = await searchParams;

  const [complaints, staffList, hostelList, categoryList] = await Promise.all([
    listAllForAdmin({
      status:        sp.status,
      hostel_name:   sp.hostel_name,
      category_name: sp.category_name,
      staff_id:      sp.staff_id ? Number(sp.staff_id) : undefined,
    }),
    listStaff(),
    listHostels(),
    listCategories(),
  ]);

  const resolved = complaints.filter((c) => c.current_status === 'Resolved');
  const inProgress = complaints.filter((c) => c.current_status === 'In_Progress');
  const unassigned = complaints.filter((c) => c.staff_id === null);
  const resolutionRate = complaints.length > 0 ? resolved.length / complaints.length : 0;

  const hasFilters = !!(sp.status || sp.hostel_name || sp.category_name || sp.staff_id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-up">
        <p className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>Admin Panel</p>
        <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>Complaints Dashboard</h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--muted)' }}>
          Assign, monitor and resolve every complaint across all hostels.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total"       value={complaints.length} Icon={Inbox}       accent="var(--yellow)" delay="0s" />
        <StatCard label="Unassigned"  value={unassigned.length} Icon={AlertCircle} accent="var(--pink)"   delay="0.06s" subtext={unassigned.length > 0 ? 'Needs your attention' : 'All assigned'} />
        <StatCard label="In Progress" value={inProgress.length} Icon={Wrench}      accent="var(--orange)" delay="0.12s" />
        <StatCard
          label="Resolved"
          value={resolved.length}
          Icon={CheckCircle}
          accent="var(--teal)"
          delay="0.18s"
          progress={resolutionRate}
          subtext={`${Math.round(resolutionRate * 100)}% resolution rate`}
        />
      </div>

      {/* Filters */}
      <div className="animate-slide-up-2">
        <p className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>
          Filters
        </p>
        <ComplaintsFilter staffList={staffList} hostelList={hostelList} categoryList={categoryList} />
      </div>

      {/* Table */}
      <div className="animate-slide-up-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg md:text-xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>
            {hasFilters ? 'Filtered Results' : 'All Complaints'}
          </h2>
          <p className="text-xs font-bold" style={{ color: 'var(--muted)' }}>
            {complaints.length} {complaints.length === 1 ? 'complaint' : 'complaints'}
          </p>
        </div>

        {complaints.length === 0 ? (
          <EmptyState
            Icon={hasFilters ? Inbox : Clock}
            title={hasFilters ? 'No complaints match your filters' : 'No complaints yet'}
            description={hasFilters ? 'Try clearing some filters above.' : 'New complaints from students will appear here.'}
            accent="var(--yellow)"
          />
        ) : (
          <div className="nb-card overflow-hidden p-0">
            <Table>
              <Thead>
                <tr>
                  <Th>#</Th>
                  <Th>Description</Th>
                  <Th>Student</Th>
                  <Th>Hostel</Th>
                  <Th>Category</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                  <Th>Assign Staff</Th>
                </tr>
              </Thead>
              <Tbody>
                {complaints.map((c) => (
                  <Tr key={c.complaint_id}>
                    <Td className="text-xs font-black" style={{ color: 'var(--muted)' }}>{c.complaint_id}</Td>
                    <Td className="max-w-xs">
                      <p className="truncate text-sm font-bold">{c.description}</p>
                      {c.staff_name && (
                        <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--muted)' }}>→ {c.staff_name}</p>
                      )}
                    </Td>
                    <Td className="text-sm font-medium">{c.student_name}</Td>
                    <Td className="text-sm font-medium">{c.hostel_name} {c.block}</Td>
                    <Td className="text-sm font-medium">{c.category_name}</Td>
                    <Td><StatusBadge status={c.current_status} /></Td>
                    <Td className="text-xs font-medium" style={{ color: 'var(--muted)' }}>{formatDate(c.complaint_date)}</Td>
                    <Td>
                      {c.current_status !== 'Resolved' && (
                        <AssignForm complaintId={c.complaint_id} currentStaffId={c.staff_id} staffList={staffList} />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
