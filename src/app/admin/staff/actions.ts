'use server';

import { requireRole } from '@/lib/session';
import { createStaff, deleteStaff } from '@/lib/db/staff';
import { createStaffSchema } from '@/lib/validation';

export async function createStaffAction(formData: FormData) {
  await requireRole('admin');
  const parsed = createStaffSchema.safeParse({
    name:    formData.get('name'),
    role:    formData.get('role'),
    contact: formData.get('contact'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues.map((e: { message: string }) => e.message).join(' ') };
  }
  try {
    await createStaff(parsed.data);
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to add staff.' };
  }
}

export async function deleteStaffAction(formData: FormData) {
  await requireRole('admin');
  const id = Number(formData.get('staff_id'));
  try {
    await deleteStaff(id);
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to delete staff.' };
  }
}
