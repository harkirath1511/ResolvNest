import { requireRole } from '@/lib/session';
import { listStaff } from '@/lib/db/staff';
import { Card } from '@/components/ui/Card';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { StaffCrudPanel } from './StaffCrudPanel';

export default async function AdminStaffPage() {
  await requireRole('admin');
  const staff = await listStaff();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Maintenance Staff</h1>
        <p className="text-slate-500 mt-1">{staff.length} staff members</p>
      </div>

      <StaffCrudPanel />

      <Card padding="none">
        <Table>
          <Thead>
            <tr>
              <Th>#</Th>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Contact</Th>
            </tr>
          </Thead>
          <Tbody>
            {staff.map((s) => (
              <Tr key={s.staff_id}>
                <Td className="text-slate-400 text-xs">{s.staff_id}</Td>
                <Td className="font-medium text-sm">{s.name}</Td>
                <Td className="text-sm">{s.role}</Td>
                <Td className="text-sm">{s.contact}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
