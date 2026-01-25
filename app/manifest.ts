/**
 * Web App Manifest
 * PWA configuration for installable web app
 */

import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://getcourses.net';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GetCourses - Tải Khóa Học Online',
    short_name: 'GetCourses',
    description: 'Tải khóa học Udemy, Coursera, LinkedIn Learning về Google Drive. Giá chỉ 50k.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4F46E5',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/images/icon-logo.webp',
        sizes: '192x192',
        type: 'image/webp',
        purpose: 'any',
      },
      {
        src: '/images/icon-logo.webp',
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'any',
      },
    ],
    categories: ['education', 'learning', 'courses'],
    lang: 'vi',
    dir: 'ltr',
  };
}
