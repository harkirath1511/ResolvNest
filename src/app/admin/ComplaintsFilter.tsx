'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { Staff, Hostel, Category } from '@/lib/types';

const STATUS_OPTIONS = [
  { value: 'Submitted',   label: 'Submitted' },
  { value: 'Assigned',    label: 'Assigned' },
  { value: 'In_Progress', label: 'In Progress' },
  { value: 'Resolved',    label: 'Resolved' },
  { value: 'Reopened',    label: 'Reopened' },
];

interface Props {
  staffList: Staff[];
  hostelList: Hostel[];
  categoryList: Category[];
}

export function ComplaintsFilter({ staffList, hostelList, categoryList }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <Select
        id="filter_status"
        placeholder="All statuses"
        value={searchParams.get('status') ?? ''}
        onChange={(e) => update('status', e.target.value)}
        options={STATUS_OPTIONS}
        className="text-sm"
      />
      <Select
        id="filter_hostel"
        placeholder="All hostels"
        value={searchParams.get('hostel_name') ?? ''}
        onChange={(e) => update('hostel_name', e.target.value)}
        options={hostelList.map((h) => ({ value: h.hostel_name, label: h.hostel_name }))}
        className="text-sm"
      />
      <Select
        id="filter_category"
        placeholder="All categories"
        value={searchParams.get('category_name') ?? ''}
        onChange={(e) => update('category_name', e.target.value)}
        options={categoryList.map((c) => ({ value: c.category_name, label: c.category_name }))}
        className="text-sm"
      />
      <Select
        id="filter_staff"
        placeholder="All staff"
        value={searchParams.get('staff_id') ?? ''}
        onChange={(e) => update('staff_id', e.target.value)}
        options={staffList.map((s) => ({ value: s.staff_id, label: s.name }))}
        className="text-sm"
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => router.push(pathname)}
      >
        Clear
      </Button>
    </div>
  );
}
