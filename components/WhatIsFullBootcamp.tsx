import Image from "next/image";

export default function WhatIsFullBootcamp() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            Full Bootcamp là công cụ gì?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto px-4">
            Là công cụ giúp bạn tải khóa học Udemy về Drive với chi phí thấp hơn giá gốc.
            <br className="hidden sm:block" />
            <span className="block mt-2 sm:inline sm:mt-0">
              Bao gồm: Video HD, Phụ đề (eng, vi), Files đầy đủ.
            </span>
          </p>
        </div>

        {/* Content - Mobile: Stack vertical, Desktop: 2 columns */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Image - Mobile first */}
          <div className="w-full order-2 lg:order-1">
            <div className="relative w-full aspect-[690/765] rounded-2xl overflow-hidden shadow-xl">
              <Image 
                src="/images/udemy-1.jpg" 
                alt="Udemy Course Laptop" 
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Features List - Mobile first */}
          <div className="w-full order-1 lg:order-2 flex flex-col">
            <div className="flex flex-col gap-6 sm:gap-8 mb-8">
              
              {/* Feature 1 */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image 
                    src="/images/icons/what-1.svg" 
                    alt="Chất lượng" 
                    width={32} 
                    height={32} 
                    className="w-7 h-7 sm:w-8 sm:h-8" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
                    Chất lượng đảm bảo
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
                    Video HD, Phụ đề, Files, Bài tập đầy đủ
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image 
                    src="/images/icons/what-2.svg" 
                    alt="Cập nhật" 
                    width={32} 
                    height={32} 
                    className="w-7 h-7 sm:w-8 sm:h-8" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
                    Cập nhật liên tục
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
                    Luôn update video mới nhất. Hỗ trợ tải lại content của khóa học
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image 
                    src="/images/icons/what-3.svg" 
                    alt="Tiết kiệm" 
                    width={32} 
                    height={32} 
                    className="w-7 h-7 sm:w-8 sm:h-8" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5">
                    Tiết kiệm chi phí
                  </h3>
                  <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed">
                    Tool giúp bạn tiết kiệm chi phí và thời gian
                  </p>
                </div>
              </div>

            </div>
            
            {/* CTA Button */}
            <div className="mt-2">
              <button className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]">
                Tải khóa học ngay!
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
