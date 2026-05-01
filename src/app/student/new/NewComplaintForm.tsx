'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { submitComplaintAction } from './actions';
import type { Category } from '@/lib/types';

interface Props {
  categories: Category[];
}

export function NewComplaintForm({ categories }: Props) {
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const fd = new FormData();
      fd.append('category_id', categoryId);
      fd.append('description', description);
      const result = await submitComplaintAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/student');
        router.refresh();
      }
    });
  }

  return (
    <Card className="max-w-lg">
      <h2 className="text-base font-semibold text-slate-900 mb-6">Complaint Details</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Select
          id="category"
          label="Category"
          placeholder="-- Select category --"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categories.map((c) => ({
            value: c.category_id,
            label: c.category_name,
          }))}
          required
        />
        <Textarea
          id="description"
          label="Describe the issue"
          placeholder="Provide a clear description of the problem…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
          minLength={10}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={isPending} className="w-full" size="lg">
          {isPending ? 'Submitting…' : 'Submit Complaint'}
        </Button>
      </form>
    </Card>
  );
}
