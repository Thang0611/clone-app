import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-4 px-3">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center gap-2 sm:flex-row sm:justify-between sm:items-center">
          {/* Copyright */}
          <p className="text-white/80 text-[10px] sm:text-xs">
            © 2026 GetCourses
          </p>

          {/* Links */}
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
              Điều khoản
            </Link>
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
              Bảo mật
            </Link>
            <Link href="/contact" className="text-white/60 hover:text-white transition-colors">
              Hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
