'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { assignComplaintAction } from './actions';
import type { Staff } from '@/lib/types';

interface Props {
  complaintId: number;
  currentStaffId: number | null;
  staffList: Staff[];
}

export function AssignForm({ complaintId, currentStaffId, staffList }: Props) {
  const [staffId, setStaffId] = useState(String(currentStaffId ?? ''));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append('complaint_id', String(complaintId));
      fd.append('staff_id', staffId);
      const result = await assignComplaintAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Select
        id={`assign_${complaintId}`}
        placeholder="-- Assign staff --"
        value={staffId}
        onChange={(e) => setStaffId(e.target.value)}
        options={staffList.map((s) => ({ value: s.staff_id, label: `${s.name} (${s.role})` }))}
        className="text-xs"
      />
      <Button type="submit" size="sm" disabled={isPending || !staffId}>
        {isPending ? '…' : 'Assign'}
      </Button>
      {error && <p className="text-xs text-red-600 ml-1">{error}</p>}
    </form>
  );
}
