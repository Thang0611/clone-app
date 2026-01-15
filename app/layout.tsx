import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khóa Học Giá Rẻ - Tải Khóa Học Udemy, Coursera, LinkedIn Learning Giá Chỉ từ 2k",
  description: "Công cụ hỗ trợ tải khóa học từ Udemy, Coursera, LinkedIn Learning về Google Drive. 9000+ khoá học có sẵn, update hàng tuần.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
        <Toaster position="top-right" richColors expand={false} />
      </body>
    </html>
  );
}
