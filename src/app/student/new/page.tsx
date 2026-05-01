import { listCategories } from '@/lib/db/categories';
import { NewComplaintForm } from './NewComplaintForm';

export default async function NewComplaintPage() {
  const categories = await listCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Raise a Complaint</h1>
        <p className="text-slate-500 mt-1">Describe your issue and we&apos;ll get it resolved.</p>
      </div>
      <NewComplaintForm categories={categories} />
    </div>
  );
}
