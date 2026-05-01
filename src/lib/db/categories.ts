import { supabase } from '../supabase';
import type { Category } from '../types';

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('category')
    .select('*')
    .order('category_name');
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getCategoryById(category_id: number): Promise<Category | null> {
  const { data, error } = await supabase
    .from('category')
    .select('*')
    .eq('category_id', category_id)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return (data ?? null) as Category | null;
}

export async function createCategory(category_name: string): Promise<Category> {
  const { data, error } = await supabase
    .from('category')
    .insert({ category_name })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Category;
}

export async function deleteCategory(category_id: number): Promise<void> {
  const { error } = await supabase
    .from('category')
    .delete()
    .eq('category_id', category_id);
  if (error) throw new Error(error.message);
}
