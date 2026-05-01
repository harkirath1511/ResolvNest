import { requireRole } from '@/lib/session';
import { listStudents } from '@/lib/db/students';
import { listHostels } from '@/lib/db/hostels';
import { Card } from '@/components/ui/Card';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { StudentCrudPanel } from './StudentCrudPanel';

export default async function AdminStudentsPage() {
  await requireRole('admin');
  const [students, hostels] = await Promise.all([listStudents(), listHostels()]);
  const hostelMap = Object.fromEntries(hostels.map((h) => [h.hostel_id, h.hostel_name]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-500 mt-1">{students.length} students registered</p>
      </div>

      <StudentCrudPanel hostels={hostels} />

      <Card padding="none">
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
                <Td className="text-slate-400 text-xs">{s.student_id}</Td>
                <Td className="font-medium text-sm">{s.name}</Td>
                <Td className="text-sm">{s.room_no}</Td>
                <Td className="text-sm">{hostelMap[s.hostel_id] ?? s.hostel_id}</Td>
                <Td className="text-sm">{s.contact}</Td>
                <Td>
                  <form action="/admin/students/delete" method="POST">
                    <input type="hidden" name="student_id" value={s.student_id} />
                    <DeleteStudentButton />
                  </form>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}

function DeleteStudentButton() {
  return (
    <button
      type="submit"
      className="text-xs text-red-500 hover:text-red-700 hover:underline"
      onClick={(e) => {
        if (!confirm('Delete this student?')) e.preventDefault();
      }}
    >
      Delete
    </button>
  );
}
