'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/session';
import { createHostel, deleteHostel } from '@/lib/db/hostels';
import { createHostelSchema } from '@/lib/validation';

export async function createHostelAction(formData: FormData) {
  await requireRole('admin');
  const parsed = createHostelSchema.safeParse({
    hostel_name: formData.get('hostel_name'),
    block:       formData.get('block'),
    capacity:    formData.get('capacity'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues.map((e: { message: string }) => e.message).join(' ') };
  }
  try {
    await createHostel(parsed.data);
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to add hostel.' };
  }
}

export async function deleteHostelAction(formData: FormData) {
  await requireRole('admin');
  const id = Number(formData.get('hostel_id'));
  try {
    await deleteHostel(id);
    revalidatePath('/admin/hostels');
  } catch {
    // silently ignore
  }
}
