'use server';

import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/session';
import { createCategory, deleteCategory } from '@/lib/db/categories';
import { createCategorySchema } from '@/lib/validation';

export async function createCategoryAction(formData: FormData) {
  await requireRole('admin');
  const parsed = createCategorySchema.safeParse({
    category_name: formData.get('category_name'),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues.map((e: { message: string }) => e.message).join(' ') };
  }
  try {
    await createCategory(parsed.data.category_name);
    return { error: null };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to add category.' };
  }
}

export async function deleteCategoryAction(formData: FormData) {
  await requireRole('admin');
  const id = Number(formData.get('category_id'));
  try {
    await deleteCategory(id);
    revalidatePath('/admin/categories');
  } catch {
    // silently ignore
  }
}
