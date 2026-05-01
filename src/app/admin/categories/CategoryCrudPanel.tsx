'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createCategoryAction } from './actions';

export function CategoryCrudPanel() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append('category_name', name);
      const result = await createCategoryAction(fd);
      if (result?.error) setError(result.error);
      else {
        setName('');
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <h2 className="text-sm font-semibold text-slate-800 mb-4">Add Category</h2>
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <Input
          id="cat_name"
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Plumbing"
          required
          className="max-w-xs"
        />
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? 'Adding…' : 'Add'}
        </Button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </form>
    </Card>
  );
}
