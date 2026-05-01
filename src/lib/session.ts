import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Session } from './types';

const COOKIE_NAME = 'resolvnest_session';

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export async function setSession(session: Session): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Guard: redirects to '/' if no session or role mismatch.
 * Returns the session if valid.
 */
export async function requireRole(
  role: Session['role'] | Session['role'][]
): Promise<Session> {
  const session = await getSession();
  const allowed = Array.isArray(role) ? role : [role];
  if (!session || !allowed.includes(session.role)) {
    redirect('/');
  }
  return session;
}
