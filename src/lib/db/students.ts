import { supabase } from '../supabase';
import type { Student } from '../types';

export async function listStudents(): Promise<Student[]> {
  const { data, error } = await supabase
    .from('student')
    .select('*')
    .order('name');
  if (error) throw new Error(error.message);
  return (data ?? []) as Student[];
}

export async function listStudentsByHostel(hostel_id: number): Promise<Student[]> {
  const { data, error } = await supabase
    .from('student')
    .select('*')
    .eq('hostel_id', hostel_id)
    .order('room_no');
  if (error) throw new Error(error.message);
  return (data ?? []) as Student[];
}

export async function getStudentById(student_id: number): Promise<Student | null> {
  const { data, error } = await supabase
    .from('student')
    .select('*')
    .eq('student_id', student_id)
    .single();
  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return (data ?? null) as Student | null;
}

export async function createStudent(payload: Omit<Student, 'student_id'>): Promise<Student> {
  const { data, error } = await supabase
    .from('student')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Student;
}

export async function deleteStudent(student_id: number): Promise<void> {
  const { error } = await supabase
    .from('student')
    .delete()
    .eq('student_id', student_id);
  if (error) throw new Error(error.message);
}
