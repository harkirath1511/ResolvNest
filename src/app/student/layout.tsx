import { requireRole } from '@/lib/session';
import { RoleSidebar } from '@/components/RoleSidebar';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole('student');

  return (
    <div className="flex min-h-screen">
      <RoleSidebar
        role="student"
        title="Student Portal"
        subtitle={session.user_name}
      />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
