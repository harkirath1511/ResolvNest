import { requireRole } from '@/lib/session';
import {
  getComplaintsByStatus,
  getComplaintsByCategory,
  getComplaintsByHostel,
  getAvgResolutionByCategory,
  getStaffWorkload,
} from '@/lib/db/analytics';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import {
  CategoryBarChart,
  HostelBarChart,
  StatusPieChart,
  AvgResolutionChart,
} from './Charts';

export default async function AnalyticsPage() {
  await requireRole('admin');

  const [statusData, categoryData, hostelData, avgResData, staffData] = await Promise.all([
    getComplaintsByStatus(),
    getComplaintsByCategory(),
    getComplaintsByHostel(),
    getAvgResolutionByCategory(),
    getStaffWorkload(),
  ]);

  const totalComplaints = statusData.reduce((acc, s) => acc + Number(s.total), 0);
  const totalResolved = statusData.find((s) => s.status === 'Resolved')?.total ?? 0;
  const resolutionRate =
    totalComplaints > 0
      ? ((Number(totalResolved) / totalComplaints) * 100).toFixed(1)
      : '0';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 mt-1">Data-driven insights from the complaint database.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-indigo-600">{totalComplaints}</p>
          <p className="text-xs text-slate-500 mt-1">Total Complaints</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-emerald-600">{totalResolved}</p>
          <p className="text-xs text-slate-500 mt-1">Resolved</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-amber-600">
            {statusData.find((s) => s.status === 'In_Progress')?.total ?? 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">In Progress</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-slate-700">{resolutionRate}%</p>
          <p className="text-xs text-slate-500 mt-1">Resolution Rate</p>
        </Card>
      </div>

      {/* Row 1: Status pie + Category bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Status</CardTitle>
          </CardHeader>
          <StatusPieChart data={statusData} />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Category</CardTitle>
          </CardHeader>
          <CategoryBarChart data={categoryData} />
        </Card>
      </div>

      {/* Row 2: Hostel + Avg resolution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Complaints by Hostel</CardTitle>
          </CardHeader>
          <HostelBarChart data={hostelData} />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Resolution Time by Category (hrs)</CardTitle>
          </CardHeader>
          {avgResData.length === 0 ? (
            <p className="text-sm text-slate-500">No resolved complaints yet.</p>
          ) : (
            <AvgResolutionChart data={avgResData} />
          )}
        </Card>
      </div>

      {/* Staff workload table */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Staff Workload</h2>
          <p className="text-xs text-slate-500 mt-0.5">From v_staff_workload view</p>
        </div>
        <Table>
          <Thead>
            <tr>
              <Th>Staff Name</Th>
              <Th>Role</Th>
              <Th>Total Assigned</Th>
              <Th>Resolved</Th>
              <Th>Open</Th>
            </tr>
          </Thead>
          <Tbody>
            {staffData.map((s) => (
              <Tr key={s.staff_id}>
                <Td className="font-medium text-sm">{s.staff_name}</Td>
                <Td className="text-sm">{s.role}</Td>
                <Td className="text-sm font-semibold">{s.total_assigned}</Td>
                <Td className="text-sm text-emerald-700">{s.resolved_count}</Td>
                <Td className="text-sm text-amber-700">{s.open_count}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>

      {/* Avg resolution table */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-semibold text-slate-900">Average Resolution Time</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            From v_avg_resolution_by_category view · fn_avg_resolution_hours() function
          </p>
        </div>
        <Table>
          <Thead>
            <tr>
              <Th>Category</Th>
              <Th>Resolved Complaints</Th>
              <Th>Avg Resolution Time</Th>
            </tr>
          </Thead>
          <Tbody>
            {avgResData.length === 0 ? (
              <Tr>
                <Td colSpan={3} className="text-center text-slate-500 py-6">
                  No resolved complaints with timestamps yet.
                </Td>
              </Tr>
            ) : (
              avgResData.map((r) => (
                <Tr key={r.category_id}>
                  <Td className="font-medium text-sm">{r.category_name}</Td>
                  <Td className="text-sm">{r.resolved_count}</Td>
                  <Td className="text-sm font-semibold text-indigo-700">
                    {r.avg_resolution_hours} hrs
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
