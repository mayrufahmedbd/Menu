import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export interface ISessionUser {
  userId: string;
  role: 'customer' | 'vendor' | 'admin' | 'superadmin';
}

export async function getSession(): Promise<ISessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const decoded = jwt.verify(token, secret) as any;

    if (!decoded || !decoded.userId || !decoded.role) {
      return null;
    }

    return {
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
}

export async function requireAuth(): Promise<ISessionUser> {
  const session = await getSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function requireRole(allowedRoles: ('customer' | 'vendor' | 'admin' | 'superadmin')[]): Promise<ISessionUser> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new Error('Forbidden');
  }
  return session;
}
