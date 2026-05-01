import { requireRole } from '@/lib/session';
import { listStudents } from '@/lib/db/students';
import { listHostels } from '@/lib/db/hostels';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { DeleteButton } from '@/components/ui/DeleteButton';
import { EmptyState } from '@/components/EmptyState';
import { StudentCrudPanel } from './StudentCrudPanel';
import { deleteStudentAction } from './actions';
import { Users } from 'lucide-react';

export default async function AdminStudentsPage() {
  await requireRole('admin');
  const [students, hostels] = await Promise.all([listStudents(), listHostels()]);
  const hostelMap = Object.fromEntries(hostels.map((h) => [h.hostel_id, h.hostel_name]));

  return (
    <div className="space-y-6">
      <div className="animate-slide-up">
        <p className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>Admin Panel</p>
        <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>Students</h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--muted)' }}>
          {students.length} {students.length === 1 ? 'student' : 'students'} registered across all hostels.
        </p>
      </div>

      <div className="animate-slide-up-1">
        <StudentCrudPanel hostels={hostels} />
      </div>

      {students.length === 0 ? (
        <EmptyState Icon={Users} title="No students yet" description="Add students using the form above to get started." accent="var(--teal)" />
      ) : (
        <div className="animate-slide-up-2 nb-card overflow-hidden p-0">
          <Table>
            <Thead>
              <tr>
                <Th>#</Th>
                <Th>Name</Th>
                <Th>Room</Th>
                <Th>Hostel</Th>
                <Th>Contact</Th>
                <Th>Action</Th>
              </tr>
            </Thead>
            <Tbody>
              {students.map((s) => (
                <Tr key={s.student_id}>
                  <Td className="text-xs font-black" style={{ color: 'var(--muted)' }}>{s.student_id}</Td>
                  <Td className="font-bold text-sm">{s.name}</Td>
                  <Td className="text-sm font-medium">{s.room_no}</Td>
                  <Td className="text-sm font-medium">{hostelMap[s.hostel_id] ?? s.hostel_id}</Td>
                  <Td className="text-sm font-medium">{s.contact}</Td>
                  <Td>
                    <form action={deleteStudentAction}>
                      <input type="hidden" name="student_id" value={s.student_id} />
                      <DeleteButton confirmMessage={`Delete ${s.name}?`} />
                    </form>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
