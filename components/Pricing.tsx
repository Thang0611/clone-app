"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToFormAndFocus } from "@/lib/scrollToForm";

export default function Pricing() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 px-4 sm:px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-10 sm:mb-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Bảng giá
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed">
            Chọn gói phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Pricing Cards - Mobile: Stack, Desktop: 3 columns */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3 md:gap-6">
          
          {/* Plan 1: Gói Trải Nghiệm */}
          <div className={`bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300 hover:-translate-y-2 group ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
              Gói Trải Nghiệm
            </h3>
            <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-4 sm:mb-6">
              50.000đ <span className="text-xl text-slate-600">/ 1 khóa</span>
            </div>
            <p className="text-base sm:text-lg text-slate-700 mb-6 sm:mb-8">
              Gói mua thử và trải nghiệm
            </p>
            
            {/* Features */}
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <li className="flex items-start gap-3 group/item">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-slate-700 group-hover/item:text-slate-900 transition-colors duration-300">Link Google Drive tốc độ cao</span>
              </li>
              <li className="flex items-start gap-3 group/item">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-slate-700 group-hover/item:text-slate-900 transition-colors duration-300">Đầy đủ video & tài liệu</span>
              </li>
              <li className="flex items-start gap-3 group/item">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-slate-700 group-hover/item:text-slate-900 transition-colors duration-300">Hỗ trợ 24/7</span>
              </li>
            </ul>

            <button 
              onClick={scrollToFormAndFocus}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] transform hover:scale-105 group-hover:shadow-2xl"
            >
              <span className="flex items-center justify-center gap-2">
                Đăng ký ngay
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Plan 2: Gói Tiết Kiệm - RECOMMENDED */}
          <div className={`bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 relative border-4 border-primary-500 md:scale-105 hover:scale-110 hover:-translate-y-3 group ${
            isVisible ? 'opacity-100 translate-y-0 scale-105' : 'opacity-0 translate-y-8 scale-100'
          }`}
          style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
            {/* Recommended Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              KHUYÊN DÙNG
            </div>
            
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 mt-2">
              Gói Tiết Kiệm
            </h3>
            <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
              199.000đ
            </div>
            <div className="text-xl text-slate-600 mb-2">
              / 5 khóa • Chỉ ~40k/khóa
            </div>
            <p className="text-base sm:text-lg font-bold text-emerald-600 mb-6 sm:mb-8">
              Tiết kiệm 20% so với mua lẻ
            </p>
            
            {/* Features */}
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <li className="flex items-start gap-3 group/item">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base lg:text-lg text-slate-700 font-medium group-hover/item:text-slate-900 transition-colors duration-300">Link Google Drive tốc độ cao</span>
              </li>
              <li className="flex items-start gap-3 group/item">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base lg:text-lg text-slate-700 font-medium group-hover/item:text-slate-900 transition-colors duration-300">Đầy đủ video & tài liệu</span>
              </li>
              <li className="flex items-start gap-3 group/item">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base lg:text-lg text-slate-700 font-medium group-hover/item:text-slate-900 transition-colors duration-300">Hỗ trợ 24/7</span>
              </li>
            </ul>

            <button 
              onClick={scrollToFormAndFocus}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] transform hover:scale-105 group-hover:shadow-2xl"
            >
              <span className="flex items-center justify-center gap-2">
                Đăng ký ngay
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Plan 3: Gói Siêu Tốc */}
          <div className={`bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-violet-300 hover:-translate-y-2 group relative ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: isVisible ? '300ms' : '0ms' }}>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
              Gói Siêu Tốc
            </h3>
            <div className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
              299.000đ
            </div>
            <div className="flex items-baseline gap-1 text-base md:text-xl text-slate-600 mb-4 sm:mb-6 whitespace-nowrap">
              <span>/ 10 khóa</span>
              <span>•</span>
              <span>Chỉ ~30k/khóa</span>
            </div>
            <p className="text-base sm:text-lg text-slate-700 mb-6 sm:mb-8">
              Gói tốt nhất cho người học nhiều
            </p>
            
            {/* Features */}
            <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <li className="flex items-start gap-3 group/item">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base lg:text-lg text-slate-700 group-hover/item:text-slate-900 transition-colors duration-300">Link Google Drive tốc độ cao</span>
              </li>
              <li className="flex items-start gap-3 group/item">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base lg:text-lg text-slate-700 group-hover/item:text-slate-900 transition-colors duration-300">Đầy đủ video & tài liệu</span>
              </li>
              <li className="flex items-start gap-3 group/item">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base lg:text-lg text-slate-700 group-hover/item:text-slate-900 transition-colors duration-300">Hỗ trợ 24/7</span>
              </li>
            </ul>

            <button 
              onClick={scrollToFormAndFocus}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] transform hover:scale-105 group-hover:shadow-2xl"
            >
              <span className="flex items-center justify-center gap-2">
                Đăng ký ngay
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
