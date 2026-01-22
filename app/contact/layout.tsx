import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Liên Hệ - GetCourses",
  description: "Liên hệ với chúng tôi qua email, điện thoại hoặc Facebook. Hỗ trợ khách hàng 24/7. Email: getcourses.net@gmail.com",
  keywords: [
    'liên hệ',
    'contact',
    'hỗ trợ',
    'customer service',
    'getcourses',
  ],
  url: "/contact",
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
