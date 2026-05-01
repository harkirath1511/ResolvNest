import { requireRole } from '@/lib/session';
import { listCategories } from '@/lib/db/categories';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { EmptyState } from '@/components/EmptyState';
import { CategoryCrudPanel } from './CategoryCrudPanel';
import { Tag } from 'lucide-react';

export default async function AdminCategoriesPage() {
  await requireRole('admin');
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <div className="animate-slide-up">
        <p className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>Admin Panel</p>
        <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>Complaint Categories</h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--muted)' }}>
          {categories.length} {categories.length === 1 ? 'category' : 'categories'} available when raising complaints.
        </p>
      </div>

      <div className="animate-slide-up-1">
        <CategoryCrudPanel />
      </div>

      {categories.length === 0 ? (
        <EmptyState Icon={Tag} title="No categories yet" description="Add complaint categories using the form above." accent="var(--yellow)" />
      ) : (
        <div className="animate-slide-up-2 nb-card overflow-hidden p-0">
          <Table>
            <Thead>
              <tr><Th>#</Th><Th>Category Name</Th></tr>
            </Thead>
            <Tbody>
              {categories.map((c) => (
                <Tr key={c.category_id}>
                  <Td className="text-xs font-black" style={{ color: 'var(--muted)' }}>{c.category_id}</Td>
                  <Td className="font-bold text-sm">{c.category_name}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </div>
      )}
    </div>
  );
}
