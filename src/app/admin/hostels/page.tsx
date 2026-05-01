import { requireRole } from '@/lib/session';
import { listHostels } from '@/lib/db/hostels';
import { Card } from '@/components/ui/Card';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { HostelCrudPanel } from './HostelCrudPanel';

export default async function AdminHostelsPage() {
  await requireRole('admin');
  const hostels = await listHostels();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hostels</h1>
        <p className="text-slate-500 mt-1">{hostels.length} hostels</p>
      </div>

      <HostelCrudPanel />

      <Card padding="none">
        <Table>
          <Thead>
            <tr>
              <Th>#</Th>
              <Th>Hostel Name</Th>
              <Th>Block</Th>
              <Th>Capacity</Th>
            </tr>
          </Thead>
          <Tbody>
            {hostels.map((h) => (
              <Tr key={h.hostel_id}>
                <Td className="text-slate-400 text-xs">{h.hostel_id}</Td>
                <Td className="font-medium text-sm">{h.hostel_name}</Td>
                <Td className="text-sm">{h.block}</Td>
                <Td className="text-sm">{h.capacity}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
