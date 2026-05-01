import { supabase } from '../supabase';
import type { Staff } from '../types';

export async function listStaff(): Promise<Staff[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('name');
  if (error) throw new Error(error.message);
  return (data ?? []) as Staff[];
}

export async function getStaffById(staff_id: number): Promise<Staff | null> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('staff_id', staff_id)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return (data ?? null) as Staff | null;
}

export async function createStaff(payload: Omit<Staff, 'staff_id'>): Promise<Staff> {
  const { data, error } = await supabase
    .from('staff')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Staff;
}

export async function deleteStaff(staff_id: number): Promise<void> {
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('staff_id', staff_id);
  if (error) throw new Error(error.message);
}
