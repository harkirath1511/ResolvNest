import { requireRole } from '@/lib/session';
import { RoleSidebar } from '@/components/RoleSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole('admin');

  return (
    <div className="flex min-h-screen">
      <RoleSidebar role="admin" title="Admin Panel" subtitle={session.user_name} />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader role="admin" userName={session.user_name} />
        <main className="flex-1 px-5 pb-8 md:px-8 md:pb-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
