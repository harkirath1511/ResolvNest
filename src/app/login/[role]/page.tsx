import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { listStudents } from '@/lib/db/students';
import { listStaff } from '@/lib/db/staff';
import { setSession } from '@/lib/session';
import type { Session } from '@/lib/types';

type Role = 'student' | 'staff' | 'admin';

const ADMIN_USER = { id: 0, name: 'Hostel Administrator' };

async function loginAction(formData: FormData) {
  'use server';
  const role = formData.get('role') as Role;
  const user_id = Number(formData.get('user_id'));
  const user_name = formData.get('user_name') as string;

  const session: Session = { role, user_id, user_name };
  await setSession(session);

  if (role === 'student') redirect('/student');
  if (role === 'staff') redirect('/staff');
  redirect('/admin');
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  if (!['student', 'staff', 'admin'].includes(role)) notFound();

  const typedRole = role as Role;

  let users: { id: number; name: string; sub?: string }[] = [];

  if (typedRole === 'student') {
    const students = await listStudents();
    users = students.map((s) => ({
      id: s.student_id,
      name: s.name,
      sub: `Room ${s.room_no}`,
    }));
  } else if (typedRole === 'staff') {
    const staff = await listStaff();
    users = staff.map((s) => ({ id: s.staff_id, name: s.name, sub: s.role }));
  } else {
    users = [{ id: ADMIN_USER.id, name: ADMIN_USER.name }];
  }

  const roleLabel: Record<Role, string> = {
    student: 'Student',
    staff: 'Maintenance Staff',
    admin: 'Administrator',
  };

  const accentColor: Record<Role, string> = {
    student: 'indigo',
    staff: 'amber',
    admin: 'emerald',
  };

  const accent = accentColor[typedRole];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Back to role picker
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">
            Sign in as {roleLabel[typedRole]}
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Select your account to continue — no password needed for demo.
          </p>

          <div className="space-y-3">
            {users.map((user) => (
              <form key={user.id} action={loginAction}>
                <input type="hidden" name="role" value={typedRole} />
                <input type="hidden" name="user_id" value={user.id} />
                <input type="hidden" name="user_name" value={user.name} />
                <button
                  type="submit"
                  className={`w-full flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left hover:border-${accent}-300 hover:bg-${accent}-50 transition-colors group`}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{user.name}</p>
                    {user.sub && <p className="text-xs text-slate-500">{user.sub}</p>}
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-slate-600">→</span>
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
