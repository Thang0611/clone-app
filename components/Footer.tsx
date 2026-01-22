import Link from "next/link";
import { Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Bottom Bar - Mobile: flex-col centered, Desktop: flex-row justify-between */}
        <div className="flex flex-col items-center text-center gap-4 md:flex-row md:justify-between md:items-center">
          {/* Copyright */}
          <p className="text-white/70 text-xs md:text-sm">
            © 2026 GetCourses - All Rights Reserved.
          </p>
          
          {/* Social Links / Terms */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs md:text-sm">
            <Link href="/terms" className="text-white/70 hover:text-white transition-colors">
              Điều khoản
            </Link>
            <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">
              Bảo mật
            </Link>
            <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
              Hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
