import type { Metadata } from "next";
import { Suspense } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import GoogleTagManager from "@/components/GoogleTagManager";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PageViewTracker from "@/components/PageViewTracker";
import UserPropertiesTracker from "@/components/UserPropertiesTracker";
import { Providers } from "./providers";

// Validate environment variables during production build only
// For runtime validation, it's handled in env-validation.ts itself

export const metadata: Metadata = {
  title: "Khóa Học Giá Rẻ - Tải Khóa Học Online Chỉ từ 30k",
  description: "Tải khóa học Udemy, Coursera, LinkedIn Learning về Google Drive. 9000+ khóa học có sẵn, cập nhật hàng tuần.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
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
