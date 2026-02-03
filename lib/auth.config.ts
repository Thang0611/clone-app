/**
 * NextAuth Configuration (v4)
 * Gateway Authentication setup for Admin login
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

    console.log('[AUTH CONFIG] Loading environment from:', envPath);
    console.log('[AUTH CONFIG] NODE_ENV:', nodeEnv);
    console.log('[AUTH CONFIG] File exists:', fs.existsSync(envPath));

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
      console.log('[AUTH CONFIG] Loaded', loadedCount, 'environment variables from', envFileName);
      console.log('[AUTH CONFIG] ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH ? 'Loaded (' + process.env.ADMIN_PASSWORD_HASH.length + ' chars)' : 'NOT SET');
      console.log('[AUTH CONFIG] NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Loaded (' + process.env.NEXTAUTH_SECRET.length + ' chars)' : 'NOT SET');
    } else {
      console.warn('[AUTH CONFIG]', envFileName, 'not found at:', envPath);
    }
  } catch (error) {
    console.error('[AUTH CONFIG] Failed to load .env file:', error);
  }
}

// NextAuth v4 types
import type { NextAuthOptions } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

/**
 * Admin credentials validation with bcrypt password hashing
 * In production, this should query a database
 * For now, we use environment variables with hashed passwords
 */
async function validateAdminCredentials(
  email: string,
  password: string
): Promise<{ id: string; email: string; role: string; name: string } | null> {
  const isDev = process.env.NODE_ENV === 'development';

  // Debug log for environment variable loading
  console.log("Debug Env:", process.env.ADMIN_PASSWORD_HASH ? "Loaded" : "Missing");

  if (isDev) {
    console.log('🔍 [AUTH DEBUG] validateAdminCredentials called');
    console.log('   Email received:', JSON.stringify(email));
    console.log('   Password length:', password.length);
  }

  // Get admin credentials from environment variables
  const adminEmail = process.env.ADMIN_EMAIL;

  // Support both hashed and plain text (for migration)
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const adminPasswordPlain = process.env.ADMIN_PASSWORD;

  if (isDev) {
    console.log('   ADMIN_EMAIL:', adminEmail ? `Set (${adminEmail.length} chars)` : 'NOT SET');
    console.log('   ADMIN_PASSWORD_HASH:', adminPasswordHash ? `Set (${adminPasswordHash.length} chars)` : 'NOT SET');
    console.log('   ADMIN_PASSWORD (plain):', adminPasswordPlain ? `Set (${adminPasswordPlain.length} chars)` : 'NOT SET');
  }

  if (!adminEmail) {
    console.error('❌ [AUTH ERROR] ADMIN_EMAIL must be set in environment variables');
    console.error('   NODE_ENV:', process.env.NODE_ENV);
    console.error('   Available env vars:', Object.keys(process.env).filter(k => k.includes('ADMIN')).join(', '));
    return null;
  }
  console.log('adminPasswordHash', adminPasswordHash);
  console.log('adminPasswordPlain', adminPasswordPlain);
  // Check if we have either hashed or plain text password
  if (!adminPasswordHash && !adminPasswordPlain) {
    console.error('❌ [AUTH ERROR] ADMIN_PASSWORD_HASH or ADMIN_PASSWORD must be set in environment variables');
    console.error('   NODE_ENV:', process.env.NODE_ENV);
    console.error('   ADMIN_PASSWORD_HASH:', adminPasswordHash ? 'Set' : 'NOT SET');
    console.error('   ADMIN_PASSWORD:', adminPasswordPlain ? 'Set' : 'NOT SET');
    return null;
  }

  // Validate email
  // Normalize emails (trim, lowercase) for comparison
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedAdminEmail = adminEmail.trim().toLowerCase();

  if (isDev) {
    console.log('   Normalized email entered:', JSON.stringify(normalizedEmail));
    console.log('   Normalized email expected:', JSON.stringify(normalizedAdminEmail));
    console.log('   Email match:', normalizedEmail === normalizedAdminEmail);
  }

  if (normalizedEmail !== normalizedAdminEmail) {
    console.log('❌ [AUTH ERROR] Email mismatch');
    console.log('   Entered:', JSON.stringify(email));
    console.log('   Expected:', JSON.stringify(adminEmail));
    console.log('   Normalized entered:', JSON.stringify(normalizedEmail));
    console.log('   Normalized expected:', JSON.stringify(normalizedAdminEmail));
    return null; // Email mismatch, don't reveal which field is wrong
  }

  console.log('✅ [AUTH] Email matches, checking password...');

  // Validate password - prefer hashed over plain text
  let passwordValid = false;

  if (adminPasswordHash) {
    console.log('🔍 [AUTH] Using bcrypt comparison');
    // Use bcrypt comparison for hashed password
    try {
      passwordValid = await bcrypt.compare(password, adminPasswordHash);
      console.log('   bcrypt.compare result:', passwordValid);

      if (!passwordValid) {
        console.log('❌ [AUTH ERROR] Password comparison failed');
        console.log('   Hash length:', adminPasswordHash.length);
        console.log('   Password length:', password.length);
        console.log('   Hash prefix:', adminPasswordHash.substring(0, 20) + '...');
      }
    } catch (error) {
      console.error('❌ [AUTH ERROR] Error comparing password hash:', error);
      return null;
    }
  } else if (adminPasswordPlain) {
    console.log('🔍 [AUTH] Using plain text comparison');
    // Fallback to plain text comparison (for backward compatibility during migration)
    // This will be removed in future versions
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️  WARNING: Using plain text password in production. Please migrate to ADMIN_PASSWORD_HASH immediately!');
    }
    passwordValid = password === adminPasswordPlain;
    console.log('   Plain text comparison result:', passwordValid);

    if (!passwordValid) {
      console.log('❌ [AUTH ERROR] Plain text password comparison failed');
    }
  }

  if (passwordValid) {
    console.log('✅ [AUTH] Password is valid! Returning user object...');
    return {
      id: '1', // In production, use actual admin ID from database
      email: adminEmail,
      role: 'admin',
      name: 'Administrator',
    };
  }

  console.log('❌ [AUTH ERROR] Password validation failed, returning null');
  return null;
}

/**
 * Sync user to backend after OAuth login
 * Creates or updates user in the backend database
 */
async function syncUserToBackend(user: { email: string; name?: string; image?: string; googleId?: string }) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${apiUrl}/api/v1/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        google_id: user.googleId,
        name: user.name,
        avatar_url: user.image
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('[AUTH] User synced to backend:', data.user?.id);
      return data.user;
    } else {
      console.error('[AUTH] Failed to sync user to backend:', response.status);
      return null;
    }
  } catch (error) {
    console.error('[AUTH] Error syncing user to backend:', error);
    return null;
  }
}

// Import Google provider
import GoogleProvider from 'next-auth/providers/google';

// Validate Google OAuth credentials
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  console.warn('[AUTH CONFIG] ⚠️ GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set. Google OAuth will not work.');
}

// NextAuth v4 configuration
export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth provider for regular users (only add if credentials exist)
    ...(googleClientId && googleClientSecret ? [
      GoogleProvider({
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code'
          }
        }
      })
    ] : []),
    // Credentials provider for admin login
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('[AUTH] Missing credentials');
            return null;
          }

          console.log('[AUTH] Authorize called with email:', credentials.email);

          const user = await validateAdminCredentials(
            credentials.email as string,
            credentials.password as string
          );

          if (!user) {
            console.log('[AUTH] User validation failed');
            return null;
          }

          console.log('[AUTH] User validated successfully:', user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('[AUTH] Error in authorize:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login', // User login page (Google OAuth)
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;

        // Determine role based on provider
        if (account?.provider === 'google') {
          token.role = 'user';
          token.googleId = account.providerAccountId;

          // Sync Google user to backend
          const backendUser = await syncUserToBackend({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: account.providerAccountId
          });

          if (backendUser) {
            token.backendUserId = backendUser.id;
            token.isPremium = backendUser.is_premium;
          }
        } else if (account?.provider === 'credentials') {
          token.role = (user as any).role || 'admin';
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.backendUserId = token.backendUserId as number;
        (session.user as any).role = token.role as string;
        (session.user as any).googleId = token.googleId as string;
        (session.user as any).isPremium = token.isPremium as boolean;
        (session as any).accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: (() => {
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error('NEXTAUTH_SECRET is required but not set in environment variables');
    }
    if (secret.length < 32) {
      throw new Error('NEXTAUTH_SECRET must be at least 32 characters for security');
    }
    if (secret === 'fallback-secret-for-dev' && process.env.NODE_ENV === 'production') {
      throw new Error('Cannot use fallback secret in production');
    }
    return secret;
  })(),
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
};
