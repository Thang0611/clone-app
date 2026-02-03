"use client";

import Image from "next/image";
import { scrollToFormAndFocus } from "@/lib/scrollToForm";

export default function WhatIsFullBootcamp() {
  return (
    <section className="py-8 sm:py-10 lg:py-12 px-4 sm:px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 leading-tight">
            GetCourses là gì?
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto px-4">
            Là công cụ giúp bạn tải khóa học từ Udemy, Coursera, LinkedIn Learning về Drive với chi phí thấp hơn giá gốc.
            <br className="hidden sm:block" />
            <span className="block mt-1 sm:inline sm:mt-0">
              Bao gồm: Video 100% FullHD, Phụ đề (eng, vi), Files đầy đủ.
            </span>
          </p>
        </div>

        {/* Content - Mobile: Stack vertical, Desktop: 2 columns */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">

          {/* Image - Mobile first */}
          <div className="w-full order-2 lg:order-1">
            <div className="relative w-full aspect-[690/765] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/udemy-1.webp"
                alt="Udemy Course Laptop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Features List - Mobile first */}
          <div className="w-full order-1 lg:order-2 flex flex-col">
            <div className="flex flex-col gap-4 sm:gap-5 mb-5">

              {/* Feature 1 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/images/icons/what-1.svg"
                    alt="Chất lượng"
                    width={24}
                    height={24}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                    Chất lượng đảm bảo
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                    Video HD, Phụ đề, Files, Bài tập đầy đủ
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/images/icons/what-2.svg"
                    alt="Cập nhật"
                    width={24}
                    height={24}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                    Cập nhật liên tục
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                    Luôn update video mới nhất. Hỗ trợ tải lại content của khóa học
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/images/icons/what-3.svg"
                    alt="Tiết kiệm"
                    width={24}
                    height={24}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                    Tiết kiệm chi phí
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
                    Tool giúp bạn tiết kiệm chi phí và thời gian
                  </p>
                </div>
              </div>

            </div>

            {/* CTA Button */}
            <div className="mt-1">
              <button
                onClick={scrollToFormAndFocus}
                className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-sm sm:text-base hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Tải khóa học ngay!
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
