import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
);

export interface AdminUser {
  id: number;
  email: string;
  username: string;
  role: string;
  type: 'admin';
}

export async function getAdminFromCookie(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token');

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token.value, JWT_SECRET);

    if (payload.type !== 'admin') {
      return null;
    }

    return {
      id: payload.id as number,
      email: payload.email as string,
      username: payload.username as string,
      role: payload.role as string,
      type: 'admin',
    };
  } catch (error) {
    console.error('Error verifying admin token:', error);
    return null;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const admin = await getAdminFromCookie();
  return admin !== null;
}
