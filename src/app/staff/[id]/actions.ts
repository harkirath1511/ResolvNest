'use server';

import { requireRole } from '@/lib/session';
import { updateStatus } from '@/lib/db/complaints';
import { updateStatusSchema } from '@/lib/validation';

export async function updateStatusAction(formData: FormData) {
  await requireRole('staff');

  const parsed = updateStatusSchema.safeParse({
    complaint_id: formData.get('complaint_id'),
    new_status:   formData.get('new_status'),
    note:         formData.get('note') || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues.map((e: { message: string }) => e.message).join(' ') };
  }

  try {
    await updateStatus(
      parsed.data.complaint_id,
      parsed.data.new_status,
      parsed.data.note
    );
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to update status.' };
  }
}
