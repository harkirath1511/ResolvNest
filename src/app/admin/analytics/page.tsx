import { requireRole } from '@/lib/session';
import {
  getComplaintsByStatus,
  getComplaintsByCategory,
  getComplaintsByHostel,
  getAvgResolutionByCategory,
  getStaffWorkload,
} from '@/lib/db/analytics';
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
    totalComplaints > 0 ? ((Number(totalResolved) / totalComplaints) * 100).toFixed(1) : '0';

  const kpis = [
    { label: 'Total Complaints', value: totalComplaints, accent: 'var(--yellow)' },
    { label: 'Resolved',         value: totalResolved,   accent: 'var(--teal)' },
    { label: 'In Progress',      value: statusData.find((s) => s.status === 'In_Progress')?.total ?? 0, accent: 'var(--orange)' },
    { label: 'Resolution Rate',  value: `${resolutionRate}%`, accent: 'var(--pink)' },
  ];

  return (
    <div className="space-y-8">
      <div className="animate-slide-up">
        <p className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--muted)' }}>Admin Panel</p>
        <h1 className="text-3xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>Analytics</h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--muted)' }}>Data-driven insights from the complaint database.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up-1">
        {kpis.map(({ label, value, accent }, i) => (
          <div
            key={label}
            className="nb-card p-5 text-center"
            style={{ borderTop: `4px solid ${accent}`, animationDelay: `${i * 0.06}s` }}
          >
            <p className="text-4xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>{value}</p>
            <p className="text-xs font-bold uppercase tracking-wide mt-1" style={{ color: 'var(--muted)' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up-2">
        <div className="nb-card p-6" style={{ borderTop: '4px solid var(--yellow)' }}>
          <h2 className="text-base font-black mb-4" style={{ fontFamily: 'var(--font-syne)' }}>By Status</h2>
          <StatusPieChart data={statusData} />
        </div>
        <div className="nb-card p-6" style={{ borderTop: '4px solid var(--pink)' }}>
          <h2 className="text-base font-black mb-4" style={{ fontFamily: 'var(--font-syne)' }}>By Category</h2>
          <CategoryBarChart data={categoryData} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up-3">
        <div className="nb-card p-6" style={{ borderTop: '4px solid var(--teal)' }}>
          <h2 className="text-base font-black mb-4" style={{ fontFamily: 'var(--font-syne)' }}>By Hostel</h2>
          <HostelBarChart data={hostelData} />
        </div>
        <div className="nb-card p-6" style={{ borderTop: '4px solid var(--purple)' }}>
          <h2 className="text-base font-black mb-4" style={{ fontFamily: 'var(--font-syne)' }}>Avg Resolution Time (hrs)</h2>
          {avgResData.length === 0
            ? <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>No resolved complaints yet.</p>
            : <AvgResolutionChart data={avgResData} />
          }
        </div>
      </div>

      {/* Staff workload table */}
      <div className="nb-card overflow-hidden p-0" style={{ borderTop: '4px solid var(--orange)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '2px solid #111' }}>
          <h2 className="text-base font-black" style={{ fontFamily: 'var(--font-syne)' }}>Staff Workload</h2>
        </div>
        <Table>
          <Thead>
            <tr><Th>Staff</Th><Th>Role</Th><Th>Total</Th><Th>Resolved</Th><Th>Open</Th></tr>
          </Thead>
          <Tbody>
            {staffData.map((s) => (
              <Tr key={s.staff_id}>
                <Td className="font-bold text-sm">{s.staff_name}</Td>
                <Td className="text-sm font-medium">{s.role}</Td>
                <Td className="text-sm font-black">{s.total_assigned}</Td>
                <Td className="text-sm font-bold" style={{ color: '#15803D' }}>{s.resolved_count}</Td>
                <Td className="text-sm font-bold" style={{ color: '#B45309' }}>{s.open_count}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      {/* Avg resolution table */}
      <div className="nb-card overflow-hidden p-0" style={{ borderTop: '4px solid var(--purple)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '2px solid #111' }}>
          <h2 className="text-base font-black" style={{ fontFamily: 'var(--font-syne)' }}>Avg Resolution by Category</h2>
          <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--muted)' }}>Powered by v_avg_resolution_by_category view + fn_avg_resolution_hours()</p>
        </div>
        <Table>
          <Thead>
            <tr><Th>Category</Th><Th>Resolved</Th><Th>Avg Time</Th></tr>
          </Thead>
          <Tbody>
            {avgResData.length === 0 ? (
              <Tr><Td colSpan={3} className="text-center py-8 font-medium" style={{ color: 'var(--muted)' }}>No data yet.</Td></Tr>
            ) : (
              avgResData.map((r) => (
                <Tr key={r.category_id}>
                  <Td className="font-bold text-sm">{r.category_name}</Td>
                  <Td className="text-sm font-medium">{r.resolved_count}</Td>
                  <Td className="text-sm font-black" style={{ color: 'var(--purple)' }}>{r.avg_resolution_hours} hrs</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}
