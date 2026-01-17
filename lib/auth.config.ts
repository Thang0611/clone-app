/**
 * NextAuth Configuration (v4)
 * Gateway Authentication setup for Admin login
 */

// Load environment variables from .env.production if not already loaded
// This ensures env vars are available even if PM2 doesn't pass them correctly
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(process.cwd(), '.env.production');
    
    console.log('[AUTH CONFIG] Loading .env.production from:', envPath);
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
      console.log('[AUTH CONFIG] Loaded', loadedCount, 'environment variables from .env.production');
      console.log('[AUTH CONFIG] ADMIN_PASSWORD_HASH:', process.env.ADMIN_PASSWORD_HASH ? 'Loaded (' + process.env.ADMIN_PASSWORD_HASH.length + ' chars)' : 'NOT SET');
    } else {
      console.warn('[AUTH CONFIG] .env.production not found at:', envPath);
    }
  } catch (error) {
    console.error('[AUTH CONFIG] Failed to load .env.production:', error);
  }
}

// NextAuth v4 types - importing NextAuthOptions
// Will work correctly after installing next-auth v4
// Using any type temporarily during migration
type NextAuthOptions = any;

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

// NextAuth v4 configuration
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await validateAdminCredentials(
          credentials.email as string,
          credentials.password as string
        );

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
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
