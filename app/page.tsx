import type { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import WhatIsFullBootcamp from "@/components/WhatIsFullBootcamp";
import DiverseTopics from "@/components/DiverseTopics";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import { generateMetadata as generateSEOMetadata, generateFAQSchema } from "@/lib/seo";

export const metadata: Metadata = generateSEOMetadata({
  title: "GetCourses - Tải Khóa Học Online Chỉ 50k",
  description: "Tải khóa học Udemy, Coursera, LinkedIn Learning về Google Drive. 9000+ khóa học có sẵn, cập nhật hàng tuần. Giá chỉ 50k. Thanh toán đơn giản, nhận link Google Drive ngay.",
  keywords: [
    'khóa học online',
    'udemy giá rẻ',
    'coursera',
    'tải khóa học',
    'khóa học giá rẻ',
    'download khóa học udemy',
    'khóa học online giá rẻ',
    'getcourses',
  ],
  image: "/images/logo.webp",
});

// FAQ data for structured data
const faqs = [
  {
    question: "Làm thế nào để đặt hàng khóa học?",
    answer: "Bạn chỉ cần điền form trên trang chủ với link khóa học Udemy/Coursera, chọn gói combo phù hợp và thanh toán. Sau đó bạn sẽ nhận được link Google Drive chứa toàn bộ khóa học.",
  },
  {
    question: "Giá khóa học là bao nhiêu?",
    answer: "Giá khóa học chỉ từ 30.000 VNĐ. Chúng tôi có 3 gói combo: Gói 1 khóa (30k), Gói 3 khóa (80k), và Gói 5 khóa (120k).",
  },
  {
    question: "Khóa học có cập nhật không?",
    answer: "Có, chúng tôi cập nhật khóa học hàng tuần. Bạn sẽ nhận được thông báo khi có video mới hoặc cập nhật từ giảng viên.",
  },
  {
    question: "Thanh toán như thế nào?",
    answer: "Bạn có thể thanh toán qua chuyển khoản ngân hàng hoặc quét QR code. Sau khi thanh toán thành công, bạn sẽ nhận được link Google Drive trong vòng 5-10 phút.",
  },
];

export default function Home() {
  return (
    <>
      {/* FAQ Structured Data */}
      <StructuredData data={generateFAQSchema(faqs)} />

      <div className="min-h-screen bg-white">
        <Navbar />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
          <Hero />
        </Suspense>
        <Stats />
        <WhatIsFullBootcamp />
        <DiverseTopics />
        <Features />
        <Pricing />
        <FAQ />
        <Footer />
      </div>
    </>
  );
}
