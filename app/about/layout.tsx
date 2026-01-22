import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "Về Chúng Tôi - GetCourses",
  description: "GetCourses - Nền tảng cung cấp khóa học online giá rẻ từ Udemy, Coursera, LinkedIn Learning. Hơn 50K+ người dùng tin tưởng, 100K+ khóa học có sẵn.",
  keywords: [
    'về chúng tôi',
    'giới thiệu',
    'getcourses',
    'khóa học giá rẻ',
    'online education',
  ],
  url: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
