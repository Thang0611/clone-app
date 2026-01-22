import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Blog - Tin Tức & Hướng Dẫn Khóa Học",
  description: "Cập nhật tin tức, hướng dẫn và tips về khóa học online. Review khóa học Udemy, Coursera. Học cách chọn khóa học phù hợp và tối ưu hóa việc học online.",
  keywords: [
    'blog khóa học',
    'tin tức khóa học',
    'review khóa học',
    'hướng dẫn học online',
    'tips học online',
    'khóa học udemy',
  ],
  url: "/blog",
  type: "website",
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
