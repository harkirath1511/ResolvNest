import Link from 'next/link';
import {
  GraduationCap, Wrench, ShieldCheck, ArrowUpRight,
  Zap, Database, BarChart3,
} from 'lucide-react';
import { listStudents } from '@/lib/db/students';
import { listStaff } from '@/lib/db/staff';
import { listHostels } from '@/lib/db/hostels';
import { listCategories } from '@/lib/db/categories';

async function safeCount(fn: () => Promise<unknown[]>): Promise<number | null> {
  try {
    const rows = await fn();
    return rows.length;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [studentCount, staffCount, hostelCount, categoryCount] = await Promise.all([
    safeCount(listStudents),
    safeCount(listStaff),
    safeCount(listHostels),
    safeCount(listCategories),
  ]);

  const stats = [
    { label: 'Students', value: studentCount },
    { label: 'Staff',    value: staffCount },
    { label: 'Hostels',  value: hostelCount },
    { label: 'Types',    value: categoryCount },
  ];

  return (
    <main
      className="min-h-screen overflow-hidden relative"
      style={{ background: 'var(--bg)' }}
    >
      {/* ── Floating decorative blobs ── */}
      <div className="pointer-events-none select-none absolute inset-0">
        <div className="float-1 absolute top-12 right-[12%] w-20 h-20 rounded-full"
          style={{ background: 'var(--yellow)', border: '2px solid var(--border)', boxShadow: '3px 3px 0 #111' }} />
        <div className="float-2 absolute top-32 left-[6%] w-14 h-14 rounded-full"
          style={{ background: 'var(--pink)', border: '2px solid var(--border)', boxShadow: '3px 3px 0 #111' }} />
        <div className="float-3 absolute top-64 right-[6%] w-10 h-10"
          style={{ background: 'var(--teal)', border: '2px solid var(--border)', boxShadow: '2px 2px 0 #111', borderRadius: '4px', transform: 'rotate(20deg)' }} />
        <div className="spin-slow absolute bottom-48 left-[10%] w-16 h-16"
          style={{ border: '3px solid var(--purple)', borderRadius: '50%', borderTopColor: 'transparent' }} />
        <div className="float-2 absolute bottom-32 right-[18%] w-12 h-12 rounded-full"
          style={{ background: 'var(--orange)', border: '2px solid var(--border)', boxShadow: '2px 2px 0 #111' }} />
        <div className="float-1 absolute top-1/2 left-[3%] w-8 h-8"
          style={{ background: 'var(--yellow)', border: '2px solid var(--border)', transform: 'rotate(45deg)' }} />
        <div className="pulse-ring absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-20"
          style={{ border: '3px solid var(--purple)' }} />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full opacity-15"
          style={{ border: '3px solid var(--pink)' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 py-12 md:py-16 min-h-screen">

        {/* Top nav */}
        <div className="w-full max-w-5xl flex items-center justify-between mb-12 animate-slide-up">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black"
              style={{ background: 'var(--pink)', color: '#fff', border: '2px solid #111', boxShadow: '3px 3px 0 #111', fontFamily: 'var(--font-syne)' }}
            >
              RN
            </span>
            <span className="font-black text-lg" style={{ fontFamily: 'var(--font-syne)' }}>ResolvNest</span>
          </div>
          <a
            href="https://github.com/harkirath1511/ResolvNest"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full transition-all hover:-translate-y-0.5"
            style={{ border: '2px solid #111', background: '#fff', boxShadow: '2px 2px 0 #111', fontFamily: 'var(--font-syne)' }}
          >
            GitHub <ArrowUpRight size={12} strokeWidth={2.5} />
          </a>
        </div>

        {/* Pill badge */}
        <div className="animate-slide-up-1 mb-6">
          <span
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full"
            style={{ background: 'var(--yellow)', border: '2px solid var(--border)', boxShadow: '3px 3px 0 var(--border)' }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" /> UCS310 · DBMS Project
          </span>
        </div>

        {/* Hero heading */}
        <div className="animate-slide-up-2 text-center mb-4">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight"
            style={{ fontFamily: 'var(--font-syne)', color: 'var(--text)' }}
          >
            FIX IT FAST
            <br />
            <span
              className="inline-block relative mt-2 px-4 rounded-xl"
              style={{
                background: 'var(--pink)',
                border: '2px solid var(--border)',
                boxShadow: '6px 6px 0 var(--border)',
                color: '#fff',
                transform: 'rotate(-1.5deg)',
              }}
            >
              RESOLVNEST
            </span>
          </h1>
        </div>

        <p
          className="animate-slide-up-3 text-center text-base md:text-lg mb-10 max-w-lg font-medium"
          style={{ color: 'var(--muted)' }}
        >
          A hostel complaint &amp; resolution analytics platform. Students raise,
          staff resolve, admins analyse —{' '}
          <span className="font-black text-black">all backed by a real Postgres database.</span>
        </p>

        {/* Role cards */}
        <div className="animate-slide-up-3 grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl mb-14">
          <RoleCard
            href="/login/student"
            Icon={GraduationCap}
            title="Student"
            description="Raise complaints and follow their journey to resolution."
            accent="var(--yellow)"
            textOnAccent="#111"
            tiltClass="md:-rotate-2"
          />
          <RoleCard
            href="/login/staff"
            Icon={Wrench}
            title="Staff"
            description="Pick up assigned work and update status on the go."
            accent="var(--teal)"
            textOnAccent="#111"
            tiltClass=""
          />
          <RoleCard
            href="/login/admin"
            Icon={ShieldCheck}
            title="Admin"
            description="Assign staff, monitor SLAs and dig into analytics."
            accent="var(--pink)"
            textOnAccent="#fff"
            tiltClass="md:rotate-2"
          />
        </div>

        {/* Stats strip */}
        {stats.some((s) => s.value !== null) && (
          <div
            className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-0 mb-14 animate-slide-up-3"
            style={{ border: '2px solid #111', borderRadius: 16, boxShadow: '4px 4px 0 #111', background: '#fff', overflow: 'hidden' }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="px-5 py-4 text-center"
                style={{
                  borderRight: i < stats.length - 1 ? '2px solid #111' : undefined,
                  borderBottom: i < 2 ? '2px solid #111' : undefined,
                }}
              >
                <p
                  className="text-3xl md:text-4xl font-black"
                  style={{ fontFamily: 'var(--font-syne)' }}
                >
                  {s.value ?? '—'}
                </p>
                <p
                  className="text-[11px] font-black uppercase tracking-widest mt-1"
                  style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Feature highlights */}
        <div className="w-full max-w-4xl">
          <p
            className="text-center text-xs font-black uppercase tracking-[0.3em] mb-2"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}
          >
            Powered by
          </p>
          <h2
            className="text-center text-2xl md:text-3xl font-black mb-6"
            style={{ fontFamily: 'var(--font-syne)' }}
          >
            What&apos;s under the hood
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              Icon={Database}
              title="3NF Schema"
              description="6 relational tables with indexes, enums & foreign keys — normalised to Third Normal Form."
              accent="var(--teal)"
            />
            <FeatureCard
              Icon={Zap}
              title="PL/pgSQL"
              description="Stored functions, procedures, and triggers auto-log every status change in real time."
              accent="var(--yellow)"
            />
            <FeatureCard
              Icon={BarChart3}
              title="Live Analytics"
              description="Average resolution time, staff workload, recurring issues — all from SQL views."
              accent="var(--pink)"
            />
          </div>
        </div>

        <p
          className="mt-12 text-xs font-medium text-center"
          style={{ color: 'var(--muted)' }}
        >
          Demo mode — no password needed. Select a role above to start.
        </p>
      </div>
    </main>
  );
}

/* ── Sub-components ───────────────────────────────────── */

interface RoleCardProps {
  href: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  title: string;
  description: string;
  accent: string;
  textOnAccent: string;
  tiltClass?: string;
}

function RoleCard({ href, Icon, title, description, accent, textOnAccent, tiltClass = '' }: RoleCardProps) {
  return (
    <Link href={href} className={`group block transition-transform duration-200 hover:scale-[1.02] ${tiltClass}`}>
      <div
        className="nb-card p-6 h-full flex flex-col cursor-pointer"
        style={{ border: '2px solid var(--border)' }}
      >
        <div className="flex items-start justify-between mb-5">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-xl transition-transform group-hover:scale-110 group-hover:rotate-6"
            style={{ background: accent, border: '2px solid var(--border)', boxShadow: '3px 3px 0 var(--border)' }}
          >
            <Icon size={26} strokeWidth={2.5} color={textOnAccent} />
          </div>
          <span
            className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
            style={{ border: '2px solid #111', background: '#fff', fontFamily: 'var(--font-syne)' }}
          >
            ROLE
          </span>
        </div>
        <h3 className="text-2xl font-black mb-1" style={{ fontFamily: 'var(--font-syne)' }}>{title}</h3>
        <p className="text-sm font-medium mb-5 flex-1" style={{ color: 'var(--muted)' }}>
          {description}
        </p>
        <span
          className="inline-flex items-center justify-between gap-2 text-xs font-black px-3 py-2 rounded-xl transition-all group-hover:translate-y-0 group-hover:shadow-none"
          style={{
            background: accent,
            border: '2px solid var(--border)',
            boxShadow: '3px 3px 0 var(--border)',
            color: textOnAccent,
          }}
        >
          <span>Continue</span>
          <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}

interface FeatureCardProps {
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>;
  title: string;
  description: string;
  accent: string;
}

function FeatureCard({ Icon, title, description, accent }: FeatureCardProps) {
  return (
    <div className="nb-card p-5">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl mb-3"
        style={{ background: accent, border: '2px solid #111', boxShadow: '2px 2px 0 #111' }}
      >
        <Icon size={20} strokeWidth={2.5} color="#111" />
      </div>
      <p className="text-base font-black mb-1" style={{ fontFamily: 'var(--font-syne)' }}>{title}</p>
      <p className="text-sm font-medium" style={{ color: 'var(--muted)' }}>{description}</p>
    </div>
  );
}
