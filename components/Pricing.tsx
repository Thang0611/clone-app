"use client";

export default function Pricing() {
  const scrollToForm = () => {
    const heroSection = document.querySelector('section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-50 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Bảng giá
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed">
            Mua theo Combo để được giảm giá tốt nhất
          </p>
        </div>

        {/* Pricing Cards - Mobile: Stack, Desktop: 3 columns */}
        <div className="flex flex-col gap-6 sm:gap-8 md:grid md:grid-cols-3 md:gap-6">
          
          {/* Plan 1: Mua lẻ */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow border border-slate-200">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
              Mua lẻ
            </h3>
            <div className="text-4xl sm:text-5xl font-bold text-indigo-600 mb-4 sm:mb-6">
              2K <span className="text-xl text-slate-600">/ Khóa</span>
            </div>
            <p className="text-base sm:text-lg text-slate-700 mb-6 sm:mb-8">
              Gói mua thử và trải nghiệm
            </p>
            
            {/* Features */}
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {[
                "Đầy đủ video",
                "Không chặn download",
                "Update miễn phí",
                "24/7 Full support"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={scrollToForm}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Tải khóa học ngay!
            </button>
          </div>

          {/* Plan 2: Combo 5 - POPULAR */}
          <div className="bg-indigo-600 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-shadow relative border-4 border-indigo-400 transform md:scale-105">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-indigo-600 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              PHỔ BIẾN
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 mt-2">
              Combo 5 khóa
            </h3>
            <div className="text-4xl sm:text-5xl font-bold text-white mb-4 sm:mb-6">
              8K <span className="text-xl text-indigo-200">~1.6K/khóa</span>
            </div>
            <p className="text-base sm:text-lg text-indigo-100 mb-6 sm:mb-8">
              Combo tiết kiệm 20%
            </p>
            
            {/* Features */}
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {[
                "Đầy đủ video",
                "Không chặn download",
                "Update miễn phí",
                "24/7 Full support"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base lg:text-lg text-white font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={scrollToForm}
              className="w-full bg-white text-indigo-600 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Tải khóa học ngay!
            </button>
          </div>

          {/* Plan 3: Combo 10 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-xl transition-shadow border border-slate-200 relative">
            {/* Sale Badge */}
            <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-2 rounded-bl-xl text-xs sm:text-sm font-bold">
              KHUYẾN MÃI
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
              Combo 10 khóa
            </h3>
            <div className="text-4xl sm:text-5xl font-bold text-indigo-600 mb-4 sm:mb-6">
              15K <span className="text-xl text-slate-600">~1.5K/khóa</span>
            </div>
            <p className="text-base sm:text-lg text-slate-700 mb-6 sm:mb-8">
              Siêu khuyến mãi đến 15/2/2026
            </p>
            
            {/* Features */}
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              {[
                "Đầy đủ video",
                "Không chặn download",
                "Update miễn phí",
                "24/7 Full support"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm sm:text-base lg:text-lg text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={scrollToForm}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Tải khóa học ngay!
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
