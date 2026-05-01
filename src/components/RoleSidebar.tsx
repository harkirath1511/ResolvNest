'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard, PlusCircle, ListChecks, Wrench,
  BarChart2, Users, Building2, Tag, LogOut, ClipboardList,
  Repeat, Home,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  accent?: string;
}

const NAV_ITEMS: Record<'student' | 'staff' | 'admin', NavItem[]> = {
  student: [
    { label: 'Dashboard',     href: '/student',            icon: LayoutDashboard, accent: 'var(--yellow)' },
    { label: 'New Complaint', href: '/student/new',        icon: PlusCircle,      accent: 'var(--pink)' },
    { label: 'My Complaints', href: '/student/complaints', icon: ListChecks,      accent: 'var(--teal)' },
  ],
  staff: [
    { label: 'Dashboard',     href: '/staff', icon: LayoutDashboard, accent: 'var(--yellow)' },
    { label: 'Assigned Work', href: '/staff', icon: ClipboardList,   accent: 'var(--teal)' },
  ],
  admin: [
    { label: 'Complaints', href: '/admin',            icon: LayoutDashboard, accent: 'var(--yellow)' },
    { label: 'Analytics',  href: '/admin/analytics',  icon: BarChart2,       accent: 'var(--pink)' },
    { label: 'Students',   href: '/admin/students',   icon: Users,           accent: 'var(--teal)' },
    { label: 'Staff',      href: '/admin/staff',      icon: Wrench,          accent: 'var(--orange)' },
    { label: 'Hostels',    href: '/admin/hostels',    icon: Building2,       accent: 'var(--purple)' },
    { label: 'Categories', href: '/admin/categories', icon: Tag,             accent: 'var(--yellow)' },
  ],
};

const roleAccent: Record<'student' | 'staff' | 'admin', string> = {
  student: 'var(--yellow)',
  staff:   'var(--teal)',
  admin:   'var(--pink)',
};

interface RoleSidebarProps {
  role: 'student' | 'staff' | 'admin';
  title: string;
  subtitle: string;
}

export function RoleSidebar({ role, title, subtitle }: RoleSidebarProps) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role];
  const accent = roleAccent[role];

  return (
    <aside
      className="w-64 shrink-0 hidden md:flex flex-col h-screen sticky top-0"
      style={{ background: '#0f0f0f' }}
    >
      {/* Logo */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid #222' }}>
        <Link href="/" className="flex items-center gap-2.5 group" title="Back to home">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black shrink-0 transition-transform group-hover:-rotate-6"
            style={{ background: accent, color: '#111', border: '2px solid #fff', boxShadow: '2px 2px 0 #fff', fontFamily: 'var(--font-syne)' }}
          >
            RN
          </span>
          <div className="min-w-0">
            <p className="text-white font-black text-base leading-none truncate" style={{ fontFamily: 'var(--font-syne)' }}>
              ResolvNest
            </p>
            <p className="text-[11px] mt-1 font-bold uppercase tracking-wider truncate" style={{ color: '#888' }}>{title}</p>
          </div>
        </Link>
      </div>

      {/* User chip */}
      <div className="px-4 py-4" style={{ borderBottom: '1px solid #222' }}>
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-black shrink-0"
            style={{ background: accent, color: '#111', fontFamily: 'var(--font-syne)' }}
          >
            {subtitle.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate" style={{ fontFamily: 'var(--font-dm-sans)' }}>{subtitle}</p>
            <p className="text-[10px] font-black uppercase tracking-wider mt-0.5" style={{ color: accent }}>Online</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] font-black uppercase tracking-wider px-3 mb-2" style={{ color: '#555', fontFamily: 'var(--font-syne)' }}>Menu</p>
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-all',
                active ? 'text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
              style={
                active
                  ? {
                      background: item.accent ?? accent,
                      border: '2px solid #fff',
                      boxShadow: '2px 2px 0 #fff',
                      fontFamily: 'var(--font-syne)',
                    }
                  : { fontFamily: 'var(--font-syne)' }
              }
            >
              <Icon size={16} strokeWidth={2.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-4 space-y-1" style={{ borderTop: '1px solid #222' }}>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          style={{ fontFamily: 'var(--font-syne)' }}
        >
          <Home size={14} strokeWidth={2.5} />
          Home
        </Link>
        <form action="/api/switch-role" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            <Repeat size={14} strokeWidth={2.5} />
            Switch Role
          </button>
        </form>
        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            <LogOut size={14} strokeWidth={2.5} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
