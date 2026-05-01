'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard, PlusCircle, ListChecks, Wrench,
  BarChart2, Users, Building2, Tag, LogOut, ClipboardList,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: Record<'student' | 'staff' | 'admin', NavItem[]> = {
  student: [
    { label: 'Dashboard',     href: '/student',            icon: LayoutDashboard },
    { label: 'New Complaint', href: '/student/new',        icon: PlusCircle },
    { label: 'My Complaints', href: '/student/complaints', icon: ListChecks },
  ],
  staff: [
    { label: 'Dashboard',    href: '/staff', icon: LayoutDashboard },
    { label: 'Assigned Work', href: '/staff', icon: ClipboardList },
  ],
  admin: [
    { label: 'All Complaints', href: '/admin',            icon: LayoutDashboard },
    { label: 'Analytics',      href: '/admin/analytics',  icon: BarChart2 },
    { label: 'Students',       href: '/admin/students',   icon: Users },
    { label: 'Staff',          href: '/admin/staff',      icon: Wrench },
    { label: 'Hostels',        href: '/admin/hostels',    icon: Building2 },
    { label: 'Categories',     href: '/admin/categories', icon: Tag },
  ],
};

interface RoleSidebarProps {
  role: 'student' | 'staff' | 'admin';
  title: string;
  subtitle: string;
}

export function RoleSidebar({ role, title, subtitle }: RoleSidebarProps) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[role];

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-slate-200">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100">
        <p className="text-lg font-bold text-indigo-600 tracking-tight">ResolvNest</p>
        <p className="text-xs text-slate-500 mt-0.5">{title}</p>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-slate-100">
        <p className="text-sm font-medium text-slate-800 truncate">{subtitle}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100">
        <form action="/api/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
