import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, GraduationCap, Wrench, ShieldCheck } from 'lucide-react';
import { listStudents } from '@/lib/db/students';
import { listStaff } from '@/lib/db/staff';
import { UserGrid, type UserOption } from './UserGrid';

type Role = 'student' | 'staff' | 'admin';

const ADMIN_USER = { id: 0, name: 'Hostel Administrator' };

const roleConfig = {
  student: {
    label: 'Student',
    sub: 'Raise & track your hostel complaints.',
    accent: 'var(--yellow)',
    textOnAccent: '#111',
    Icon: GraduationCap,
  },
  staff: {
    label: 'Maintenance Staff',
    sub: 'Pick up & resolve assigned work.',
    accent: 'var(--teal)',
    textOnAccent: '#111',
    Icon: Wrench,
  },
  admin: {
    label: 'Administrator',
    sub: 'Manage everything & view analytics.',
    accent: 'var(--pink)',
    textOnAccent: '#fff',
    Icon: ShieldCheck,
  },
} as const;

export default async function LoginPage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  if (!['student', 'staff', 'admin'].includes(role)) notFound();
  const typedRole = role as Role;
  const config = roleConfig[typedRole];

  let users: UserOption[] = [];
  if (typedRole === 'student') {
    const students = await listStudents();
    users = students.map((s) => ({ id: s.student_id, name: s.name, sub: `Room ${s.room_no}` }));
  } else if (typedRole === 'staff') {
    const staff = await listStaff();
    users = staff.map((s) => ({ id: s.staff_id, name: s.name, sub: s.role }));
  } else {
    users = [{ id: ADMIN_USER.id, name: ADMIN_USER.name, sub: 'Full system access' }];
  }

  const Icon = config.Icon;

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Floating shapes */}
      <div className="pointer-events-none select-none">
        <div className="float-1 absolute top-16 right-[8%] w-14 h-14 rounded-full"
          style={{ background: config.accent, border: '2px solid var(--border)', boxShadow: '2px 2px 0 #111' }} />
        <div className="float-2 absolute bottom-24 left-[6%] w-10 h-10"
          style={{ background: 'var(--yellow)', border: '2px solid var(--border)', borderRadius: '4px', transform: 'rotate(15deg)' }} />
        <div className="spin-slow absolute top-1/3 left-[5%] w-12 h-12 rounded-full opacity-30"
          style={{ border: '3px solid var(--border)' }} />
        <div className="float-3 absolute bottom-16 right-[10%] w-8 h-8"
          style={{ background: 'var(--pink)', border: '2px solid var(--border)', transform: 'rotate(45deg)' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl animate-slide-up">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-black mb-6 px-3 py-1.5 rounded-full transition-all hover:-translate-x-1"
          style={{ border: '2px solid var(--border)', background: 'var(--surface)', boxShadow: '2px 2px 0 var(--border)', fontFamily: 'var(--font-syne)' }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} /> Back
        </Link>

        <div
          className="nb-card p-6 md:p-8"
          style={{ borderTop: `6px solid ${config.accent}` }}
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-xl shrink-0"
              style={{ background: config.accent, border: '2px solid var(--border)', boxShadow: '3px 3px 0 var(--border)' }}
            >
              <Icon size={26} strokeWidth={2.5} color={config.textOnAccent} />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-black leading-tight" style={{ fontFamily: 'var(--font-syne)' }}>
                {config.label}
              </h1>
              <p className="text-sm mt-0.5 font-medium" style={{ color: 'var(--muted)' }}>{config.sub}</p>
            </div>
          </div>

          <div className="h-0.5 w-full mb-5" style={{ background: 'var(--border)' }} />

          <UserGrid
            users={users}
            role={typedRole}
            accent={config.accent}
            textOnAccent={config.textOnAccent}
          />
        </div>

        {/* Switch role helper */}
        <div className="mt-4 flex items-center justify-center gap-3 text-xs font-medium" style={{ color: 'var(--muted)' }}>
          <span>Wrong role?</span>
          {(['student', 'staff', 'admin'] as Role[])
            .filter((r) => r !== typedRole)
            .map((r) => (
              <Link
                key={r}
                href={`/login/${r}`}
                className="font-black px-2.5 py-1 rounded-full transition-all hover:-translate-y-0.5"
                style={{
                  border: '2px solid #111',
                  background: roleConfig[r].accent,
                  color: roleConfig[r].textOnAccent,
                  boxShadow: '2px 2px 0 #111',
                  fontFamily: 'var(--font-syne)',
                }}
              >
                {roleConfig[r].label.split(' ')[0]}
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
}
