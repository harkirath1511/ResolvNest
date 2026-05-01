import { requireRole } from '@/lib/session';
import { RoleSidebar } from '@/components/RoleSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole('student');

  return (
    <div className="flex min-h-screen">
      <RoleSidebar role="student" title="Student Portal" subtitle={session.user_name} />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader role="student" userName={session.user_name} />
        <main className="flex-1 px-5 pb-8 md:px-8 md:pb-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
