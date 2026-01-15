import Image from "next/image";

export default function Stats() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Mobile: Single column stack, Desktop: 3 columns */}
        <div className="flex flex-col gap-8 sm:gap-10 md:grid md:grid-cols-3 md:gap-8">
          
          {/* Item 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-5">
              <Image 
                src="/images/icons/hero-1.svg" 
                alt="22000+ Khoá học" 
                width={40} 
                height={40} 
                className="w-8 h-8 sm:w-10 sm:h-10" 
              />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              22000+ Khoá học
            </h3>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Có sẵn kho đồ sộ từ Udemy, Coursera, LinkedIn Learning
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-5">
              <Image 
                src="/images/icons/hero-2.svg" 
                alt="Update miễn phí" 
                width={40} 
                height={40} 
                className="w-8 h-8 sm:w-10 sm:h-10" 
              />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Update miễn phí
            </h3>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Đầy đủ video mới nhất và cập nhật
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-5">
              <Image 
                src="/images/icons/hero-3.svg" 
                alt="Lifetime access" 
                width={40} 
                height={40} 
                className="w-8 h-8 sm:w-10 sm:h-10" 
              />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
              Lifetime access
            </h3>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Toàn quyền download
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
