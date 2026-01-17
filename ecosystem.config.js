const fs = require('fs');
const path = require('path');

// Load .env.production
const envProductionPath = path.join(__dirname, '.env.production');
let envVars = {};
if (fs.existsSync(envProductionPath)) {
  const envContent = fs.readFileSync(envProductionPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        envVars[key] = value;
      }
    }
  });
}

module.exports = {
  apps: [
    {
      name: 'khoahocgiare-frontend',
      
      // Point directly to Next.js binary
      script: './node_modules/next/dist/bin/next',
      
      args: 'start -p 4000',
      
      // Default environment (used when PM2 starts without --env flag)
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        NEXTAUTH_URL: envVars.NEXTAUTH_URL || 'https://khoahocgiare.info',
        NEXTAUTH_SECRET: envVars.NEXTAUTH_SECRET || '',
        ADMIN_EMAIL: envVars.ADMIN_EMAIL || '',
        ADMIN_PASSWORD_HASH: envVars.ADMIN_PASSWORD_HASH || '',
        NEXT_PUBLIC_API_URL: envVars.NEXT_PUBLIC_API_URL || 'https://api.khoahocgiare.info',
        NEXT_PUBLIC_SOCKET_URL: envVars.NEXT_PUBLIC_SOCKET_URL || 'https://api.khoahocgiare.info'
      },
      
      // Production environment variables (from .env.production)
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
        NEXTAUTH_URL: envVars.NEXTAUTH_URL || 'https://khoahocgiare.info',
        NEXTAUTH_SECRET: envVars.NEXTAUTH_SECRET || '',
        ADMIN_EMAIL: envVars.ADMIN_EMAIL || '',
        ADMIN_PASSWORD_HASH: envVars.ADMIN_PASSWORD_HASH || '',
        NEXT_PUBLIC_API_URL: envVars.NEXT_PUBLIC_API_URL || 'https://api.khoahocgiare.info',
        NEXT_PUBLIC_SOCKET_URL: envVars.NEXT_PUBLIC_SOCKET_URL || 'https://api.khoahocgiare.info'
      },
      
      // Log configuration
      error_file: '/root/project/clone-app/logs/error.log',
      out_file: '/root/project/clone-app/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
