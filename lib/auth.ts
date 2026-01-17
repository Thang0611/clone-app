/**
 * Auth Utilities
 * Server-side authentication helpers
 * Updated for NextAuth v4
 */

import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { authOptions } from './auth.config';

/**
 * Get current session (server-side)
 * NextAuth v4 uses getServerSession() function
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get current user (server-side)
 */
export async function getCurrentUser() {
  const session = await getSession();
  return (session as any)?.user || null;
}

/**
 * Get JWT token from request (for API routes)
 */
export async function getJWTToken(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  return token;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * Check if user has admin role
 */
export async function isAdmin() {
  const session = await getSession();
  return (session as any)?.user?.role === 'admin';
}

/**
 * Get JWT access token for API requests
 * This token will be sent to Express server
 */
export async function getAccessToken(request?: NextRequest) {
  if (request) {
    const token = await getJWTToken(request);
    if (!token) return null;
    
    // Generate JWT token that Express can verify
    return encodeJWT({
      id: (token.id as string) || token.sub || '',
      role: (token.role as string) || 'admin',
      email: (token.email as string) || '',
    });
  }

  // For server components
  const session = await getSession();
  const user = (session as any)?.user;
  if (!session || !user) return null;

  // Generate JWT token that Express can verify
  return encodeJWT({
    id: user.id || '',
    role: user.role || 'admin',
    email: user.email || '',
  });
}

/**
 * Encode JWT token for Express server
 * Uses the same NEXTAUTH_SECRET that Express will use to verify
 */
function encodeJWT(payload: { id: string; role: string; email: string }) {
  const jwt = require('jsonwebtoken');
  const secret = process.env.NEXTAUTH_SECRET;
  
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not set');
  }

  return jwt.sign(
    {
      id: payload.id,
      role: payload.role,
      email: payload.email,
      iat: Math.floor(Date.now() / 1000),
    },
    secret,
    {
      expiresIn: '24h',
    }
  );
}
