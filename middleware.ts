/**
 * Next.js Middleware (NextAuth v4)
 * Protects admin routes and handles authentication
 * Regular users (Google OAuth) can access public routes
 * Only admin routes require admin role
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req: NextRequest & { nextauth?: { token: any } }) {
    const token = req.nextauth?.token;
    const { pathname } = req.nextUrl;

    // Only check admin role for admin routes
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      if (!token || (token as any).role !== 'admin') {
        // Redirect to admin login if not admin
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }: { token: any; req: NextRequest }) => {
        const { pathname } = req.nextUrl;

        // Allow login pages for unauthenticated users
        if (pathname === '/admin/login' || pathname === '/login') {
          return true;
        }

        // Protect admin routes - require valid token with admin role
        if (pathname.startsWith('/admin')) {
          return !!token;
        }

        // Allow all other routes (including for Google OAuth users)
        return true;
      },
    },
    pages: {
      signIn: '/login', // Default sign in page for regular users
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
