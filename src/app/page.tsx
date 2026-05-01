import Link from 'next/link';
import { GraduationCap, Wrench, ShieldCheck, Building2 } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-slate-50 flex flex-col items-center justify-center px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-600 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <Building2 size={14} />
          UCS310 — DBMS Project · Thapar Institute
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
          ResolvNest
        </h1>
        <p className="text-lg text-slate-500 max-w-md">
          Hostel Complaint &amp; Resolution Analytics System
        </p>
      </div>

      {/* Role picker cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {/* Student */}
        <Link
          href="/login/student"
          className="group flex flex-col items-center gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all p-8"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
            <GraduationCap size={32} className="text-indigo-600" />
          </span>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900">Student</p>
            <p className="text-sm text-slate-500 mt-1">Raise &amp; track complaints</p>
          </div>
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full px-3 py-1">
            Continue →
          </span>
        </Link>

        {/* Staff */}
        <Link
          href="/login/staff"
          className="group flex flex-col items-center gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all p-8"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 group-hover:bg-amber-200 transition-colors">
            <Wrench size={32} className="text-amber-600" />
          </span>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900">Maintenance Staff</p>
            <p className="text-sm text-slate-500 mt-1">View &amp; resolve assigned work</p>
          </div>
          <span className="text-xs font-medium text-amber-600 bg-amber-50 rounded-full px-3 py-1">
            Continue →
          </span>
        </Link>

        {/* Admin */}
        <Link
          href="/login/admin"
          className="group flex flex-col items-center gap-4 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all p-8"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
            <ShieldCheck size={32} className="text-emerald-600" />
          </span>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-900">Administrator</p>
            <p className="text-sm text-slate-500 mt-1">Manage, assign &amp; analyse</p>
          </div>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 rounded-full px-3 py-1">
            Continue →
          </span>
        </Link>
      </div>

      <p className="mt-10 text-xs text-slate-400 text-center">
        Demo mode — select a role to explore without logging in
      </p>
    </main>
  );
}
