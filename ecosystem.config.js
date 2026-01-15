module.exports = {
  apps: [
    {
      name: 'khoahocgiare-frontend',
      
      // Point directly to Next.js binary
      script: './node_modules/next/dist/bin/next',
      
      args: 'start -p 4000',
      
      // Use Node v24 from NVM
      interpreter: '/root/.nvm/versions/node/v24.12.0/bin/node',
      
      // Production environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        NEXT_PUBLIC_SOCKET_URL: 'https://api.khoahocgiare.info',
        NEXT_PUBLIC_API_URL: 'https://api.khoahocgiare.info'
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
