/**
 * Next.js Middleware (NextAuth v4)
 * Protects admin routes and handles authentication
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth(
  function middleware(req: NextRequest & { nextauth?: { token: any } }) {
    // This callback runs after authentication is verified
    const token = req.nextauth?.token;

    // Check if user has admin role
    if (token && (token as any).role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }: { token: any; req: NextRequest }) => {
        const { pathname } = req.nextUrl;

        // Allow login page for unauthenticated users
        if (pathname === '/admin/login') {
          return true;
        }

        // Protect admin routes - require valid token
        if (pathname.startsWith('/admin')) {
          return !!token;
        }

        // Allow other routes
        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
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
