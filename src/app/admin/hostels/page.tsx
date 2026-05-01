import { requireRole } from '@/lib/session';
import { listHostels } from '@/lib/db/hostels';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { EmptyState } from '@/components/EmptyState';
import { HostelCrudPanel } from './HostelCrudPanel';
import { Building2 } from 'lucide-react';

export default async function AdminHostelsPage() {
  await requireRole('admin');
  const hostels = await listHostels();

  return (
    <div className="space-y-6">
      <div className="animate-slide-up">
        <p className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>Admin Panel</p>
        <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>Hostels</h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--muted)' }}>
          {hostels.length} {hostels.length === 1 ? 'hostel' : 'hostels'} managed by the system.
        </p>
      </div>

      <div className="animate-slide-up-1">
        <HostelCrudPanel />
      </div>

      {hostels.length === 0 ? (
        <EmptyState Icon={Building2} title="No hostels yet" description="Add hostels using the form above." accent="var(--purple)" />
      ) : (
        <div className="animate-slide-up-2 nb-card overflow-hidden p-0">
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
                  <Td className="text-xs font-black" style={{ color: 'var(--muted)' }}>{h.hostel_id}</Td>
                  <Td className="font-bold text-sm">{h.hostel_name}</Td>
                  <Td className="text-sm font-medium">{h.block}</Td>
                  <Td className="text-sm font-medium">{h.capacity}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
