'use server';

import { redirect } from 'next/navigation';
import { setSession } from '@/lib/session';
import type { Session } from '@/lib/types';

export async function loginAction(formData: FormData) {
  const role = formData.get('role') as Session['role'];
  const user_id = Number(formData.get('user_id'));
  const user_name = formData.get('user_name') as string;
  const session: Session = { role, user_id, user_name };
  await setSession(session);
  if (role === 'student') redirect('/student');
  if (role === 'staff') redirect('/staff');
  redirect('/admin');
}
