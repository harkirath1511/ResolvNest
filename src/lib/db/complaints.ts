import { supabase } from '../supabase';
import type { Complaint, ComplaintView, StatusLog } from '../types';

export async function listForStudent(student_id: number): Promise<ComplaintView[]> {
  const { data, error } = await supabase
    .from('v_recent_complaints')
    .select('*')
    .eq('student_id', student_id)
    .order('complaint_date', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ComplaintView[];
}

export async function listForStaff(staff_id: number): Promise<ComplaintView[]> {
  const { data, error } = await supabase
    .from('v_recent_complaints')
    .select('*')
    .eq('staff_id', staff_id)
    .order('complaint_date', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as ComplaintView[];
}

export async function listAllForAdmin(filters?: {
  status?: string;
  hostel_name?: string;
  category_name?: string;
  staff_id?: number;
}): Promise<ComplaintView[]> {
  let query = supabase
    .from('v_recent_complaints')
    .select('*')
    .order('complaint_date', { ascending: false });

  if (filters?.status)        query = query.eq('current_status', filters.status);
  if (filters?.hostel_name)   query = query.eq('hostel_name', filters.hostel_name);
  if (filters?.category_name) query = query.eq('category_name', filters.category_name);
  if (filters?.staff_id)      query = query.eq('staff_id', filters.staff_id);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as ComplaintView[];
}

export async function getById(complaint_id: number): Promise<ComplaintView | null> {
  const { data, error } = await supabase
    .from('v_recent_complaints')
    .select('*')
    .eq('complaint_id', complaint_id)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return (data ?? null) as ComplaintView | null;
}

export async function getStatusLog(complaint_id: number): Promise<StatusLog[]> {
  const { data, error } = await supabase
    .from('status_log')
    .select('*')
    .eq('complaint_id', complaint_id)
    .order('updated_time', { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as StatusLog[];
}

export async function createComplaint(
  student_id: number,
  category_id: number,
  description: string
): Promise<Complaint> {
  const { data, error } = await supabase
    .from('complaint')
    .insert({ student_id, category_id, description })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Complaint;
}

export async function assignComplaint(complaint_id: number, staff_id: number): Promise<void> {
  const { error } = await supabase.rpc('sp_assign_complaint', {
    p_complaint_id: complaint_id,
    p_staff_id: staff_id,
  });
  if (error) throw new Error(error.message);
}

export async function updateStatus(
  complaint_id: number,
  new_status: string,
  note?: string
): Promise<void> {
  const { error } = await supabase.rpc('sp_update_status', {
    p_complaint_id: complaint_id,
    p_new_status: new_status,
    p_note: note ?? null,
  });
  if (error) throw new Error(error.message);
}
