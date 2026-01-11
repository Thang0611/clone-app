export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-white/80 text-lg">© 2026 Full Bootcamp. All Right Reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 text-base">
          <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Về chúng tôi</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Chính sách bảo mật</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Liên Hệ</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Hỗ Trợ</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Fanpage</a>
        </div>
        <div className="text-center mt-10">
          <span className="text-white/80 text-lg">Tiếng Việt</span>
        </div>
      </div>
    </footer>
  );
}
