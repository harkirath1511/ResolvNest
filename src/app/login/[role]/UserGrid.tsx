'use client';

import { useMemo, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { loginAction } from './actions';

type Role = 'student' | 'staff' | 'admin';

export interface UserOption {
  id: number;
  name: string;
  sub?: string;
}

interface UserGridProps {
  users: UserOption[];
  role: Role;
  accent: string;
  textOnAccent: string;
}

const AVATAR_COLORS = [
  'var(--yellow)',
  'var(--teal)',
  'var(--pink)',
  'var(--orange)',
  'var(--purple)',
  '#F87171',
  '#60A5FA',
  '#34D399',
  '#FBBF24',
  '#A78BFA',
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function UserGrid({ users, role, accent, textOnAccent }: UserGridProps) {
  const [query, setQuery] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.sub ?? '').toLowerCase().includes(q)
    );
  }, [query, users]);

  async function handlePick(user: UserOption) {
    setLoadingId(user.id);
    const fd = new FormData();
    fd.append('role', role);
    fd.append('user_id', String(user.id));
    fd.append('user_name', user.name);
    await loginAction(fd);
  }

  return (
    <>
      {/* Search */}
      {users.length > 4 && (
        <div className="relative mb-4">
          <Search
            size={16}
            strokeWidth={2.5}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--muted)' }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or room…"
            className="w-full rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium outline-none"
            style={{
              border: '2px solid #111',
              boxShadow: '3px 3px 0 #111',
              background: '#fff',
              fontFamily: 'var(--font-dm-sans)',
            }}
          />
        </div>
      )}

      {/* Count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>
          {filtered.length} {filtered.length === 1 ? 'account' : 'accounts'}
        </p>
        <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider" style={{ color: 'var(--muted)', fontFamily: 'var(--font-syne)' }}>
          <Sparkles size={10} strokeWidth={2.5} /> Demo
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className="rounded-xl px-6 py-8 text-center"
          style={{ border: '2px dashed #111', background: 'var(--bg)' }}
        >
          <p className="text-sm font-bold" style={{ color: 'var(--muted)' }}>No matches.</p>
        </div>
      ) : (
        <div
          className={
            users.length === 1
              ? 'grid grid-cols-1 gap-3'
              : 'grid grid-cols-1 sm:grid-cols-2 gap-3'
          }
        >
          {filtered.map((user, i) => {
            const color = AVATAR_COLORS[hashString(user.name) % AVATAR_COLORS.length];
            const isLoading = loadingId === user.id;
            return (
              <button
                key={user.id}
                type="button"
                onClick={() => handlePick(user)}
                disabled={loadingId !== null}
                className="animate-slide-in group text-left rounded-xl p-3 flex items-center gap-3 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                style={{
                  animationDelay: `${i * 0.03}s`,
                  background: '#fff',
                  border: '2px solid #111',
                  boxShadow: '3px 3px 0 #111',
                }}
              >
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-black shrink-0 transition-transform group-hover:-rotate-6 group-hover:scale-105"
                  style={{
                    background: color,
                    border: '2px solid #111',
                    boxShadow: '2px 2px 0 #111',
                    color: '#111',
                    fontFamily: 'var(--font-syne)',
                  }}
                >
                  {getInitials(user.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black truncate" style={{ fontFamily: 'var(--font-syne)' }}>
                    {user.name}
                  </p>
                  {user.sub && (
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--muted)' }}>
                      {user.sub}
                    </p>
                  )}
                </div>
                <span
                  className="text-[10px] font-black px-2 py-1 rounded-full shrink-0 transition-transform group-hover:translate-x-0.5"
                  style={{
                    background: accent,
                    color: textOnAccent,
                    border: '2px solid #111',
                  }}
                >
                  {isLoading ? '…' : '→'}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
