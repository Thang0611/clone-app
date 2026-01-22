import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Điều Khoản Dịch Vụ - GetCourses",
  description: "Điều khoản dịch vụ của GetCourses. Quy định về việc sử dụng dịch vụ, thanh toán, hoàn tiền và quyền lợi của người dùng.",
  keywords: [
    'điều khoản dịch vụ',
    'terms of service',
    'quy định',
    'điều kiện sử dụng',
    'getcourses',
  ],
  url: "/terms",
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
