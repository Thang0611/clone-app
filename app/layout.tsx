import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import GoogleTagManager from "@/components/GoogleTagManager";
import MetaPixel from "@/components/MetaPixel";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PageViewTracker from "@/components/PageViewTracker";
import UserPropertiesTracker from "@/components/UserPropertiesTracker";
import { Providers } from "./providers";
import StructuredData from "@/components/StructuredData";
import { generateMetadata as generateSEOMetadata, generateViewport, generateOrganizationSchema } from "@/lib/seo";

// Validate environment variables during production build only
// For runtime validation, it's handled in env-validation.ts itself

export const metadata: Metadata = generateSEOMetadata({
  title: "GetCourses - Tải Khóa Học Online Chỉ từ 30k",
  description: "Tải khóa học Udemy, Coursera, LinkedIn Learning về Google Drive. 9000+ khóa học có sẵn, cập nhật hàng tuần. Giá chỉ từ 30k.",
  keywords: [
    'khóa học online',
    'udemy',
    'coursera',
    'linkedin learning',
    'tải khóa học',
    'khóa học giá rẻ',
    'online course',
    'học online',
    'giáo dục trực tuyến',
    'getcourses',
    'khóa học udemy giá rẻ',
    'download khóa học',
  ],
});

export const viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Structured Data - Organization */}
        <StructuredData data={generateOrganizationSchema()} />
        {/* Meta Pixel - Init sớm để tránh race condition với GTM tags */}
        <MetaPixel />
      </head>
      <body className="antialiased">
        {/* Google Tag Manager - Must be first in body */}
        <GoogleTagManager />
        
        {/* Google Analytics */}
        <GoogleAnalytics />
        
        {/* User Properties Tracker - Detects device, browser, traffic source */}
        <UserPropertiesTracker />
        
        {/* Page View Tracker - Tracks route changes */}
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        
        {/* Session Provider for NextAuth */}
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-right" richColors expand={false} />
      </body>
    </html>
  );
}
