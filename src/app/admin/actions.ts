'use server';

import { requireRole } from '@/lib/session';
import { assignComplaint } from '@/lib/db/complaints';
import { assignComplaintSchema } from '@/lib/validation';

export async function assignComplaintAction(formData: FormData) {
  await requireRole('admin');

  const parsed = assignComplaintSchema.safeParse({
    complaint_id: formData.get('complaint_id'),
    staff_id:     formData.get('staff_id'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues.map((e: { message: string }) => e.message).join(' ') };
  }

  try {
    await assignComplaint(parsed.data.complaint_id, parsed.data.staff_id);
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to assign complaint.' };
  }
}
