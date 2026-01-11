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
