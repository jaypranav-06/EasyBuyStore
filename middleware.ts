import NextAuth from 'next-auth';
import { authConfig } from './lib/auth/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Exclude admin routes from middleware - they're protected by layout
  matcher: ['/((?!api|_next/static|_next/image|admin|.*\\.png$).*)'],
};
