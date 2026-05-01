'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createStaffAction } from './actions';

export function StaffCrudPanel() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
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
      fd.append('role', role);
      fd.append('contact', contact);
      const result = await createStaffAction(fd);
      if (result?.error) setError(result.error);
      else {
        setName(''); setRole(''); setContact('');
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <h2 className="text-sm font-semibold text-slate-800 mb-4">Add Staff Member</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
        <Input id="sf_name" label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input id="sf_role" label="Role / Trade" value={role} onChange={(e) => setRole(e.target.value)} required />
        <Input id="sf_contact" label="Contact (10 digits)" value={contact} onChange={(e) => setContact(e.target.value)} required />
        <div className="md:col-span-3">
          {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? 'Adding…' : 'Add Staff'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
