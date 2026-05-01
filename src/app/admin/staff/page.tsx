import { requireRole } from '@/lib/session';
import { listStaff } from '@/lib/db/staff';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { EmptyState } from '@/components/EmptyState';
import { StaffCrudPanel } from './StaffCrudPanel';
import { Wrench } from 'lucide-react';

export default async function AdminStaffPage() {
  await requireRole('admin');
  const staff = await listStaff();

  return (
    <div className="space-y-6">
      <div className="animate-slide-up">
        <p className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>Admin Panel</p>
        <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>Maintenance Staff</h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--muted)' }}>
          {staff.length} {staff.length === 1 ? 'staff member' : 'staff members'} ready to resolve complaints.
        </p>
      </div>

      <div className="animate-slide-up-1">
        <StaffCrudPanel />
      </div>

      {staff.length === 0 ? (
        <EmptyState Icon={Wrench} title="No staff yet" description="Add staff using the form above." accent="var(--orange)" />
      ) : (
        <div className="animate-slide-up-2 nb-card overflow-hidden p-0">
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
                  <Td className="text-xs font-black" style={{ color: 'var(--muted)' }}>{s.staff_id}</Td>
                  <Td className="font-bold text-sm">{s.name}</Td>
                  <Td className="text-sm font-medium">{s.role}</Td>
                  <Td className="text-sm font-medium">{s.contact}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
