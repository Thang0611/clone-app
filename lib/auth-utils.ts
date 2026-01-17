/**
 * Auth Utilities for API Routes
 * Helper functions to get JWT token in Next.js API routes
 */

import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import jwt from 'jsonwebtoken';

/**
 * Get JWT access token from Next.js session
 * Returns a token that Express server can verify
 */
export async function getAccessTokenForAPI(request: NextRequest): Promise<string | null> {
  try {
    // Get token from NextAuth session
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return null;
    }

    // Create JWT token for Express server
    // Use the same secret that Express will use to verify
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      throw new Error('NEXTAUTH_SECRET is not set');
    }

    // Create a new JWT token with user info
    const accessToken = jwt.sign(
      {
        id: token.id || token.sub,
        role: token.role || 'admin',
        email: token.email,
        iat: Math.floor(Date.now() / 1000),
      },
      secret,
      {
        expiresIn: '24h',
      }
    );

    return accessToken;
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
}

/**
 * Get Authorization header value
 * Returns "Bearer <token>" or null
 */
export async function getAuthHeader(request: NextRequest): Promise<string | null> {
  const token = await getAccessTokenForAPI(request);
  if (!token) {
    return null;
  }
  return `Bearer ${token}`;
}
