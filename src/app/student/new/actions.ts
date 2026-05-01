'use server';

import { requireRole } from '@/lib/session';
import { createComplaint } from '@/lib/db/complaints';
import { createComplaintSchema } from '@/lib/validation';

export async function submitComplaintAction(formData: FormData) {
  const session = await requireRole('student');

  const parsed = createComplaintSchema.safeParse({
    category_id: formData.get('category_id'),
    description: formData.get('description'),
  });

  if (!parsed.success) {
    const messages = parsed.error.issues.map((e: { message: string }) => e.message).join(' ');
    return { error: messages };
  }

  try {
    await createComplaint(
      session.user_id,
      parsed.data.category_id,
      parsed.data.description
    );
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to submit complaint.' };
  }
}
