import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img-c.udemycdn.com',
      },
      {
        protocol: 'https',
        hostname: 'udemycdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.udemycdn.com',
      },
    ],
  },
  
  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // HSTS - Only in production with HTTPS
          ...(process.env.NODE_ENV === 'production' ? [{
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }] : []),
        ],
      },
    ];
  },
  
  // Production optimizations
  compress: true,
  poweredByHeader: false, // Hide X-Powered-By header
  
  // Cho phép cross-origin requests trong development mode
  // Để loại bỏ warning về allowedDevOrigins
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: [
      '169.254.83.107', // IP local network nếu cần
      'localhost',
      '127.0.0.1',
      'khoahocgiare.info',
      'api.khoahocgiare.info',
    ],
  }),
};

export default nextConfig;
