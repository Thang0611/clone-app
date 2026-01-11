import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Full Bootcamp - Get Khoá Học Udemy, Unica, Gitiho Giá Chỉ từ 50k",
  description: "Công cụ hỗ trợ GET khoá học Udemy về Google Drive. 9000+ khoá học có sẵn, update hàng tuần.",
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
      </body>
    </html>
  );
}
