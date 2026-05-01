'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/session';
import { createStudent, deleteStudent } from '@/lib/db/students';
import { createStudentSchema } from '@/lib/validation';

export async function createStudentAction(formData: FormData) {
  await requireRole('admin');
  const parsed = createStudentSchema.safeParse({
    name:      formData.get('name'),
    room_no:   formData.get('room_no'),
    hostel_id: formData.get('hostel_id'),
    contact:   formData.get('contact'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues.map((e: { message: string }) => e.message).join(' ') };
  }
  try {
    await createStudent(parsed.data);
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to add student.' };
  }
}

export async function deleteStudentAction(formData: FormData) {
  await requireRole('admin');
  const id = Number(formData.get('student_id'));
  try {
    await deleteStudent(id);
    revalidatePath('/admin/students');
  } catch {
    // silently ignore — UI will show stale data, user can refresh
  }
}
