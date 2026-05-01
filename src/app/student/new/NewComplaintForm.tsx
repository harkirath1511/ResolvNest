'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { submitComplaintAction } from './actions';
import type { Category } from '@/lib/types';
import { Send } from 'lucide-react';

interface Props {
  categories: Category[];
}

export function NewComplaintForm({ categories }: Props) {
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const charCount = description.length;
  const minChars = 10;
  const maxChars = 1000;

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
    <Card className="animate-slide-up-1" accent="var(--pink)">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Select
          id="category"
          label="Category"
          placeholder="-- Select a category --"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categories.map((c) => ({ value: c.category_id, label: c.category_name }))}
          required
        />
        <div>
          <Textarea
            id="description"
            label="Describe the issue"
            placeholder="e.g. The tap in my washroom has been leaking for 2 days…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            required
            minLength={minChars}
            maxLength={maxChars}
          />
          <div className="flex items-center justify-between mt-1.5 text-xs font-medium">
            <p style={{ color: charCount < minChars ? 'var(--pink)' : 'var(--muted)' }}>
              {charCount < minChars
                ? `At least ${minChars - charCount} more ${minChars - charCount === 1 ? 'character' : 'characters'}`
                : 'Looks good'}
            </p>
            <p style={{ color: 'var(--muted)' }}>{charCount} / {maxChars}</p>
          </div>
        </div>
        {error && (
          <p className="text-sm font-bold px-3 py-2 rounded-lg" style={{ background: '#FFE4E6', border: '2px solid #111', color: '#BE123C' }}>
            {error}
          </p>
        )}
        <Button type="submit" disabled={isPending || charCount < minChars || !categoryId} variant="yellow" size="lg" className="w-full">
          <Send size={16} strokeWidth={2.5} />
          {isPending ? 'Submitting…' : 'Submit Complaint'}
        </Button>
      </form>
    </Card>
  );
}
