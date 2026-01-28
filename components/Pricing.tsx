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

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-10 sm:mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Bảng giá
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed">
            Chọn gói phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Pricing Cards - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

          {/* Plan 1: Regular */}
          <div className={`bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300 hover:-translate-y-2 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Gói Regular
            </h3>
            <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">
              39.000đ <span className="text-lg text-slate-600">/ khóa</span>
            </div>
            <div className="text-base sm:text-lg text-slate-600 mb-4">
              Download từng khóa học
            </div>

            {/* Combo Pricing */}
            <div className="bg-green-50 rounded-xl p-4 mb-6 border border-green-200">
              <p className="text-sm font-bold text-green-700 mb-2">🔥 Ưu đãi combo:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2 text-sm text-green-700">
                  <span className="font-bold">5 khóa:</span> 99.000đ (tiết kiệm 96k)
                </li>
                <li className="flex items-center gap-2 text-sm text-green-700">
                  <span className="font-bold">10 khóa:</span> 199.000đ (tiết kiệm 191k)
                </li>
              </ul>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-slate-700">Link Google Drive tốc độ cao</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-slate-700">Đầy đủ video & tài liệu</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-slate-700">Hỗ trợ 24/7</span>
              </li>
            </ul>

            <button
              onClick={scrollToFormAndFocus}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 rounded-xl font-bold text-base hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Đăng ký ngay
            </button>
          </div>

          {/* Plan 2: Premium - RECOMMENDED */}
          <div className={`bg-gradient-to-br from-white to-indigo-50/50 rounded-2xl p-6 sm:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 relative border-4 border-indigo-500 hover:-translate-y-2 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
            {/* Recommended Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              KHUYÊN DÙNG
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 mt-2">
              Gói Premium
            </h3>
            <div className="text-3xl sm:text-4xl font-bold text-indigo-600 mb-2">
              199.000đ
            </div>
            <div className="text-base sm:text-lg text-slate-600 mb-4">
              Trọn bộ kho khóa học
            </div>

            {/* Premium Benefits */}
            <div className="bg-indigo-50 rounded-xl p-4 mb-6 border border-indigo-200">
              <p className="text-sm font-bold text-indigo-700 mb-2">🎁 Đặc quyền Premium:</p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2 text-sm text-indigo-700">
                  ✨ Truy cập <strong>toàn bộ kho khóa học</strong>
                </li>
                <li className="flex items-center gap-2 text-sm text-indigo-700">
                  🎁 Tặng <strong>1 lượt Get khóa học miễn phí</strong>
                </li>
              </ul>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-slate-700">Link Google Drive tốc độ cao</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-slate-700">Đầy đủ video & tài liệu</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm sm:text-base text-slate-700">Hỗ trợ ưu tiên 24/7</span>
              </li>
            </ul>

            <button
              onClick={scrollToFormAndFocus}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold text-base hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Đăng ký Premium
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
