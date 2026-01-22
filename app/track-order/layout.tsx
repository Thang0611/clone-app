import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Tra Cứu Đơn Hàng - GetCourses",
  description: "Tra cứu trạng thái đơn hàng của bạn bằng mã đơn hàng hoặc email. Kiểm tra tiến độ xử lý và nhận link Google Drive.",
  keywords: [
    'tra cứu đơn hàng',
    'track order',
    'kiểm tra đơn hàng',
    'trạng thái đơn hàng',
  ],
  url: "/track-order",
  noindex: true, // Don't index order tracking pages
});

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
