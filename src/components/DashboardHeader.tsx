import Link from 'next/link';
import { Repeat, LogOut, Home } from 'lucide-react';

interface DashboardHeaderProps {
  role: 'student' | 'staff' | 'admin';
  userName: string;
}

const roleConfig: Record<DashboardHeaderProps['role'], { label: string; accent: string; textOnAccent: string }> = {
  student: { label: 'Student',   accent: 'var(--yellow)', textOnAccent: '#111' },
  staff:   { label: 'Staff',     accent: 'var(--teal)',   textOnAccent: '#111' },
  admin:   { label: 'Admin',     accent: 'var(--pink)',   textOnAccent: '#fff' },
};

export function DashboardHeader({ role, userName }: DashboardHeaderProps) {
  const config = roleConfig[role];
  return (
    <header
      className="flex items-center justify-between gap-3 px-5 py-3 mb-6 sticky top-0 z-20"
      style={{
        background: 'rgba(247, 243, 237, 0.85)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        borderBottom: '2px solid #111',
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
          style={{ border: '2px solid #111', background: '#fff', boxShadow: '2px 2px 0 #111', fontFamily: 'var(--font-syne)' }}
          title="Home"
        >
          <Home size={12} strokeWidth={2.5} />
          Home
        </Link>
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest" style={{ fontFamily: 'var(--font-syne)' }}>
          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              background: config.accent,
              color: config.textOnAccent,
              border: '2px solid #111',
              boxShadow: '2px 2px 0 #111',
            }}
          >
            {config.label}
          </span>
          <span style={{ color: 'var(--muted)' }}>·</span>
          <span className="truncate max-w-[140px] sm:max-w-[240px]" style={{ color: '#111' }}>
            {userName}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <form action="/api/switch-role" method="POST">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
            style={{ border: '2px solid #111', background: 'var(--yellow)', boxShadow: '2px 2px 0 #111', fontFamily: 'var(--font-syne)' }}
            title="Switch role"
          >
            <Repeat size={12} strokeWidth={2.5} />
            <span className="hidden sm:inline">Switch Role</span>
          </button>
        </form>
        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
            style={{ border: '2px solid #111', background: '#fff', boxShadow: '2px 2px 0 #111', fontFamily: 'var(--font-syne)' }}
            title="Sign out"
          >
            <LogOut size={12} strokeWidth={2.5} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
