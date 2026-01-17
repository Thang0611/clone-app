'use client';

/**
 * Client-side Providers
 * Wraps the app with SessionProvider for NextAuth
 */

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
