import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Image 
              src="/images/logo.png" 
              alt="Full Bootcamp Logo" 
              width={140} 
              height={50}
              className="h-12 w-auto"
            />
          </div>
          <div className="hidden md:flex space-x-10">
            <a href="#" className="text-slate-700 hover:text-primary-600 transition-colors font-medium text-base">Trang chủ</a>
            <a href="#" className="text-slate-700 hover:text-primary-600 transition-colors font-medium text-base">Khóa học</a>
            <a href="#" className="text-slate-700 hover:text-primary-600 transition-colors font-medium text-base">Blog</a>
            <a href="#" className="text-slate-700 hover:text-primary-600 transition-colors font-medium text-base">Cửa hàng</a>
            <a href="#" className="text-slate-700 hover:text-primary-600 transition-colors font-medium text-base">Kiếm tra đơn hàng</a>
          </div>
          <button className="bg-white text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-all shadow-md hover:shadow-lg">
            Tải khóa học
          </button>
        </div>
      </div>
    </nav>
  );
}
