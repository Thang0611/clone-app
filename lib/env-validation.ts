/**
 * Environment Variable Validation
 * Validates all required environment variables at startup
 */

const REQUIRED_ENV_VARS = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'NEXT_PUBLIC_API_URL',
] as const;

const REQUIRED_PUBLIC_ENV_VARS = [
  'NEXT_PUBLIC_API_URL',
] as const;

/**
 * Validate all required environment variables
 * Throws error if any required variable is missing
 */
export function validateEnvironment(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required server-side variables
  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Check required public variables (for Next.js)
  for (const key of REQUIRED_PUBLIC_ENV_VARS) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  // Validate NEXTAUTH_SECRET strength
  if (process.env.NEXTAUTH_SECRET) {
    if (process.env.NEXTAUTH_SECRET.length < 32) {
      warnings.push('NEXTAUTH_SECRET should be at least 32 characters for security');
    }
    if (process.env.NEXTAUTH_SECRET === 'fallback-secret-for-dev') {
      warnings.push('NEXTAUTH_SECRET is using fallback value - NOT SECURE FOR PRODUCTION');
    }
  }

  // Validate NEXTAUTH_URL
  if (process.env.NEXTAUTH_URL) {
    if (!process.env.NEXTAUTH_URL.startsWith('http')) {
      warnings.push('NEXTAUTH_URL should start with http:// or https://');
    }
    // Only check for localhost in production mode (not during build)
    const isProductionBuild = process.env.NODE_ENV === 'production' && 
                              process.env.NEXT_PHASE === 'phase-production-build';
    if (isProductionBuild && process.env.NEXTAUTH_URL.includes('localhost')) {
      warnings.push('NEXTAUTH_URL should not use localhost in production');
    }
  }

  // Validate ADMIN_PASSWORD strength (basic check)
  if (process.env.ADMIN_PASSWORD) {
    if (process.env.ADMIN_PASSWORD.length < 12) {
      warnings.push('ADMIN_PASSWORD should be at least 12 characters');
    }
  }

  // Throw error if missing required variables
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please set these variables in .env.production or .env.local`
    );
  }

  // Log warnings (non-fatal)
  if (warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn('Environment variable warnings:');
    warnings.forEach(warning => console.warn(`  ⚠️  ${warning}`));
  }

  // In production builds, treat critical warnings as errors
  const isProductionBuild = process.env.NODE_ENV === 'production' && 
                            process.env.NEXT_PHASE === 'phase-production-build';
  if (warnings.length > 0 && isProductionBuild) {
    const criticalWarnings = warnings.filter(w => 
      w.includes('fallback') || (w.includes('localhost') && !process.env.CI)
    );
    if (criticalWarnings.length > 0) {
      throw new Error(
        `Critical environment variable issues in production:\n${criticalWarnings.join('\n')}`
      );
    }
  }
}

/**
 * Validate environment on module load (for server-side)
 * Only validate during production build, not during dev
 */
if (typeof window === 'undefined') {
  // Only validate during production build or when explicitly enabled
  const shouldValidate = process.env.NEXT_PHASE === 'phase-production-build' || 
                         process.env.VALIDATE_ENV === 'true';
  
  if (shouldValidate) {
    try {
      validateEnvironment();
    } catch (error) {
      console.error('❌ Environment validation failed:');
      console.error(error);
      // In production build, fail fast
      if (process.env.NEXT_PHASE === 'phase-production-build') {
        process.exit(1);
      }
    }
  }
}
