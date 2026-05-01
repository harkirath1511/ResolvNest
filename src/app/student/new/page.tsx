import { listCategories } from '@/lib/db/categories';
import { NewComplaintForm } from './NewComplaintForm';

export default async function NewComplaintPage() {
  const categories = await listCategories();

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="animate-slide-up">
        <p className="text-sm font-black uppercase tracking-widest mb-1" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>New Complaint</p>
        <h1 className="text-3xl md:text-4xl font-black" style={{ fontFamily: 'var(--font-syne)' }}>Raise a Complaint</h1>
        <p className="text-sm font-medium mt-1" style={{ color: 'var(--muted)' }}>
          Describe your issue clearly and we&apos;ll get the right team on it.
        </p>
      </div>
      <NewComplaintForm categories={categories} />
    </div>
  );
}
