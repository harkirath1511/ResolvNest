import { supabase } from '../supabase';
import type { Hostel } from '../types';

export async function listHostels(): Promise<Hostel[]> {
  const { data, error } = await supabase
    .from('hostel')
    .select('*')
    .order('hostel_name');
  if (error) throw new Error(error.message);
  return (data ?? []) as Hostel[];
}

export async function getHostelById(hostel_id: number): Promise<Hostel | null> {
  const { data, error } = await supabase
    .from('hostel')
    .select('*')
    .eq('hostel_id', hostel_id)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return (data ?? null) as Hostel | null;
}

export async function createHostel(payload: Omit<Hostel, 'hostel_id'>): Promise<Hostel> {
  const { data, error } = await supabase
    .from('hostel')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Hostel;
}

export async function deleteHostel(hostel_id: number): Promise<void> {
  const { error } = await supabase
    .from('hostel')
    .delete()
    .eq('hostel_id', hostel_id);
  if (error) throw new Error(error.message);
}
