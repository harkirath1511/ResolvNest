import { requireRole } from '@/lib/session';
import { listAllForAdmin } from '@/lib/db/complaints';
import { listStaff } from '@/lib/db/staff';
import { listHostels } from '@/lib/db/hostels';
import { listCategories } from '@/lib/db/categories';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { ComplaintsFilter } from './ComplaintsFilter';
import { AssignForm } from './AssignForm';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
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

  const unassigned = complaints.filter((c) => c.staff_id === null);
  const open = complaints.filter((c) => c.current_status !== 'Resolved');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">All Complaints</h1>
        <p className="text-slate-500 mt-1">
          {complaints.length} complaint{complaints.length !== 1 ? 's' : ''} · {open.length} open · {unassigned.length} unassigned
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(['Submitted', 'Assigned', 'In_Progress', 'Resolved'] as const).map((s) => (
          <Card key={s} padding="sm" className="text-center">
            <p className="text-xl font-bold text-slate-900">
              {complaints.filter((c) => c.current_status === s).length}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{s.replace('_', ' ')}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <ComplaintsFilter staffList={staffList} hostelList={hostelList} categoryList={categoryList} />

      {/* Table */}
      <Card padding="none">
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
            {complaints.length === 0 ? (
              <Tr>
                <Td colSpan={8} className="text-center text-slate-500 py-8">
                  No complaints match the current filters.
                </Td>
              </Tr>
            ) : (
              complaints.map((c) => (
                <Tr key={c.complaint_id}>
                  <Td className="text-slate-400 text-xs">{c.complaint_id}</Td>
                  <Td className="max-w-xs">
                    <p className="truncate text-sm font-medium text-slate-800">{c.description}</p>
                    {c.staff_name && (
                      <p className="text-xs text-slate-500">→ {c.staff_name}</p>
                    )}
                  </Td>
                  <Td className="text-sm">{c.student_name}</Td>
                  <Td className="text-sm">{c.hostel_name} {c.block}</Td>
                  <Td className="text-sm">{c.category_name}</Td>
                  <Td><StatusBadge status={c.current_status} /></Td>
                  <Td className="text-xs text-slate-500">{formatDate(c.complaint_date)}</Td>
                  <Td>
                    {c.current_status !== 'Resolved' && (
                      <AssignForm
                        complaintId={c.complaint_id}
                        currentStaffId={c.staff_id}
                        staffList={staffList}
                      />
                    )}
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
