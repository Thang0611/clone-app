import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Danh sách Khóa Học - 9000+ Khóa Học Online",
  description: "Khám phá 9000+ khóa học online từ Udemy, Coursera, LinkedIn Learning. Lập trình, Thiết kế, Marketing, Tiếng Anh và nhiều chủ đề khác. Giá chỉ từ 30k.",
  keywords: [
    'danh sách khóa học',
    'khóa học udemy',
    'khóa học lập trình',
    'khóa học thiết kế',
    'khóa học marketing',
    'online courses',
    'udemy courses',
  ],
  url: "/courses",
});

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
