import Link from "next/link";
import { Facebook, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold text-white mb-4">
              KhoaHocGiaRe
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Nền tảng cung cấp khóa học Udemy, Unica, Gitiho với giá siêu tiết kiệm. Học tập không giới hạn!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Liên kết</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-white/70 hover:text-white transition-colors text-sm">
                  Khóa học
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/70 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-white/70 hover:text-white transition-colors text-sm">
                  Tra cứu đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-white/70 hover:text-white transition-colors text-sm">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-white transition-colors text-sm">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/70 hover:text-white transition-colors text-sm">
                  Điều khoản dịch vụ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/70 hover:text-white transition-colors text-sm">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Mail className="w-4 h-4" />
                <a href="mailto:support@khoahocgiare.info" className="hover:text-white transition-colors">
                  support@khoahocgiare.info
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Phone className="w-4 h-4" />
                <span>Hotline: 0123 456 789</span>
              </li>
              <li className="flex items-start gap-2 text-white/70 text-sm">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Việt Nam</span>
              </li>
              <li className="flex items-center gap-2 text-white/70 text-sm">
                <Facebook className="w-4 h-4" />
                <a href="#" className="hover:text-white transition-colors">
                  Facebook Fanpage
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/70 text-sm text-center md:text-left">
              © 2026 KhoaHocGiaRe.info - All Rights Reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
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
      </div>
    </footer>
  );
}
