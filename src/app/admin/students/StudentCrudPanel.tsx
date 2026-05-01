'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { createStudentAction } from './actions';
import type { Hostel } from '@/lib/types';

export function StudentCrudPanel({ hostels }: { hostels: Hostel[] }) {
  const [name, setName] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [hostelId, setHostelId] = useState('');
  const [contact, setContact] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('room_no', roomNo);
      fd.append('hostel_id', hostelId);
      fd.append('contact', contact);
      const result = await createStudentAction(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        setName(''); setRoomNo(''); setHostelId(''); setContact('');
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <h2 className="text-sm font-semibold text-slate-800 mb-4">Add Student</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
        <Input id="s_name" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input id="s_room" label="Room No." value={roomNo} onChange={(e) => setRoomNo(e.target.value)} required />
        <Select
          id="s_hostel"
          label="Hostel"
          placeholder="-- Select --"
          value={hostelId}
          onChange={(e) => setHostelId(e.target.value)}
          options={hostels.map((h) => ({ value: h.hostel_id, label: h.hostel_name }))}
          required
        />
        <Input id="s_contact" label="Contact (10 digits)" value={contact} onChange={(e) => setContact(e.target.value)} required />
        <div className="col-span-2 md:col-span-4">
          {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? 'Adding…' : 'Add Student'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
