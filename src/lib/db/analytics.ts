import { supabase } from '../supabase';
import type {
  AvgResolutionByCategory,
  ComplaintsByCategory,
  ComplaintsByHostel,
  ComplaintsByStatus,
  StaffWorkload,
} from '../types';

export async function getComplaintsByStatus(): Promise<ComplaintsByStatus[]> {
  const { data, error } = await supabase
    .from('v_complaints_by_status')
    .select('*');
  if (error) throw new Error(error.message);
  return (data ?? []) as ComplaintsByStatus[];
}

export async function getComplaintsByHostel(): Promise<ComplaintsByHostel[]> {
  const { data, error } = await supabase
    .from('v_complaints_by_hostel')
    .select('*');
  if (error) throw new Error(error.message);
  return (data ?? []) as ComplaintsByHostel[];
}

export async function getComplaintsByCategory(): Promise<ComplaintsByCategory[]> {
  const { data, error } = await supabase
    .from('v_complaints_by_category')
    .select('*')
    .order('total_complaints', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ComplaintsByCategory[];
}

export async function getAvgResolutionByCategory(): Promise<AvgResolutionByCategory[]> {
  const { data, error } = await supabase
    .from('v_avg_resolution_by_category')
    .select('*')
    .order('avg_resolution_hours', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as AvgResolutionByCategory[];
}

export async function getStaffWorkload(): Promise<StaffWorkload[]> {
  const { data, error } = await supabase
    .from('v_staff_workload')
    .select('*')
    .order('total_assigned', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as StaffWorkload[];
}
