module.exports = {
  apps: [
    {
      name: 'client-nextjs',
      
      // FIX 1: Không dùng 'npm', trỏ thẳng vào file chạy của Next.js
      script: './node_modules/next/dist/bin/next',
      
      args: 'start',
      
      // FIX 2: Chỉ định rõ ràng đường dẫn Node v24 (Tránh PM2 dùng Node cũ)
      interpreter: '/root/.nvm/versions/node/v24.12.0/bin/node',
      
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};
