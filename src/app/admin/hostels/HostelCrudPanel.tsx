'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createHostelAction } from './actions';

export function HostelCrudPanel() {
  const [name, setName] = useState('');
  const [block, setBlock] = useState('');
  const [capacity, setCapacity] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append('hostel_name', name);
      fd.append('block', block);
      fd.append('capacity', capacity);
      const result = await createHostelAction(fd);
      if (result?.error) setError(result.error);
      else {
        setName(''); setBlock(''); setCapacity('');
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <h2 className="text-sm font-semibold text-slate-800 mb-4">Add Hostel</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <Input id="h_name" label="Hostel Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input id="h_block" label="Block" value={block} onChange={(e) => setBlock(e.target.value)} required />
        <Input id="h_cap" label="Capacity" type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} required />
        <div className="md:col-span-3">
          {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? 'Adding…' : 'Add Hostel'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
