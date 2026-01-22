import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Chính Sách Bảo Mật - GetCourses",
  description: "Chính sách bảo mật và quyền riêng tư của GetCourses. Thông tin về cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu cá nhân của bạn.",
  keywords: [
    'chính sách bảo mật',
    'privacy policy',
    'bảo vệ dữ liệu',
    'quyền riêng tư',
    'GDPR',
    'getcourses',
  ],
  url: "/privacy",
});

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
