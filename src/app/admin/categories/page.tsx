import { requireRole } from '@/lib/session';
import { listCategories } from '@/lib/db/categories';
import { Card } from '@/components/ui/Card';
import { Table, Thead, Th, Tbody, Tr, Td } from '@/components/ui/Table';
import { CategoryCrudPanel } from './CategoryCrudPanel';

export default async function AdminCategoriesPage() {
  await requireRole('admin');
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Complaint Categories</h1>
        <p className="text-slate-500 mt-1">{categories.length} categories</p>
      </div>

      <CategoryCrudPanel />

      <Card padding="none">
        <Table>
          <Thead>
            <tr>
              <Th>#</Th>
              <Th>Category Name</Th>
            </tr>
          </Thead>
          <Tbody>
            {categories.map((c) => (
              <Tr key={c.category_id}>
                <Td className="text-slate-400 text-xs">{c.category_id}</Td>
                <Td className="font-medium text-sm">{c.category_name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
