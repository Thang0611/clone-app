/**
 * NextAuth API Route Handler (v4)
 * Handles authentication requests
 */

// Load environment variables from .env files if not already loaded
// This ensures env vars are available even if PM2 doesn't pass them correctly
if (typeof process !== 'undefined') {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Try to load .env file (for development) or .env.production (for production)
    const nodeEnv = process.env.NODE_ENV || 'development';
    const envFileName = nodeEnv === 'production' ? '.env.production' : '.env';
    const envPath = path.join(process.cwd(), envFileName);
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      let loadedCount = 0;
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
              loadedCount++;
            }
          }
        }
      });
      console.log(`[AUTH ROUTE] Loaded ${loadedCount} environment variables from ${envFileName}`);
    } else {
      console.warn(`[AUTH ROUTE] ${envFileName} not found at: ${envPath}`);
    }
  } catch (error) {
    console.error('[AUTH ROUTE] Failed to load .env file:', error);
  }
}

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth.config';

// NextAuth v4 - export handler directly
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
