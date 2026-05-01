'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { updateStatusAction } from './actions';
import type { ComplaintStatus } from '@/lib/types';

const TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  Submitted:   [],
  Assigned:    ['In_Progress'],
  In_Progress: ['Resolved'],
  Resolved:    ['Reopened'],
  Reopened:    ['In_Progress'],
};

interface Props {
  complaintId: number;
  currentStatus: ComplaintStatus;
}

export function StatusUpdateForm({ complaintId, currentStatus }: Props) {
  const nextStatuses = TRANSITIONS[currentStatus] ?? [];
  const [newStatus, setNewStatus] = useState<ComplaintStatus | ''>(nextStatuses[0] ?? '');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (nextStatuses.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        No further transitions available from <strong>{currentStatus.replace('_', ' ')}</strong>.
      </p>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append('complaint_id', String(complaintId));
      fd.append('new_status', newStatus);
      if (note) fd.append('note', note);
      const result = await updateStatusAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        id="new_status"
        label="Change status to"
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
        options={nextStatuses.map((s) => ({
          value: s,
          label: s.replace('_', ' '),
        }))}
      />
      <Textarea
        id="note"
        label="Note (optional)"
        placeholder="Add a note about this update…"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Updating…' : 'Update Status'}
      </Button>
    </form>
  );
}
