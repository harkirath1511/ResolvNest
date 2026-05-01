import { requireRole } from '@/lib/session';
import { RoleSidebar } from '@/components/RoleSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireRole('admin');

  return (
    <div className="flex min-h-screen">
      <RoleSidebar
        role="admin"
        title="Admin Panel"
        subtitle={session.user_name}
      />
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
