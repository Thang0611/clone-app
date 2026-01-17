/**
 * NextAuth API Route Handler (v4)
 * Handles authentication requests
 */

// Load environment variables from .env.production if not already loaded
// This ensures env vars are available even if PM2 doesn't pass them correctly
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(process.cwd(), '.env.production');
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach((line: string) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const match = trimmed.match(/^([^=]+)=(.*)$/);
          if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            // Only set if not already set (PM2 env vars take priority)
            if (!process.env[key]) {
              process.env[key] = value;
            }
          }
        }
      });
    }
  } catch (error) {
    console.error('Failed to load .env.production:', error);
  }
}

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth.config';

// NextAuth v4 - export handler directly
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
