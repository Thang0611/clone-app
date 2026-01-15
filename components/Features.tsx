import { Link, CreditCard, MailCheck } from "lucide-react";

export default function Features() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight px-2">
            Cách thức hoạt động
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto px-4">
            Quy trình đơn giản, nhanh chóng chỉ trong 3 bước
          </p>
        </div>

        {/* Steps - Mobile: Stack vertical with proper spacing */}
        <div className="flex flex-col gap-8 sm:gap-10 md:grid md:grid-cols-3 md:gap-8 relative">
          
          {/* Connecting line - Desktop only: Dashed line behind icons */}
          <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] border-t-2 border-dashed border-slate-200 -z-10"></div>
          
          {/* Step 1: Copy Link */}
          <div className="flex flex-col items-center text-center group">
            {/* Step Number Badge - Small Pill */}
            <div className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full mb-3">
              Bước 01
            </div>
            {/* Icon Container */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-105 group-hover:bg-indigo-100">
              <Link className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" strokeWidth={2} />
            </div>
            {/* Text */}
            <h3 className="text-lg font-bold text-slate-900 leading-snug px-4 mb-2">
              Copy Link
            </h3>
            <p className="text-sm text-slate-600 px-4">
              Sao chép URL khóa học từ Udemy, Coursera hoặc LinkedIn Learning
            </p>
          </div>

          {/* Step 2: Dán & Thanh toán */}
          <div className="flex flex-col items-center text-center group">
            {/* Step Number Badge - Small Pill */}
            <div className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full mb-3">
              Bước 02
            </div>
            {/* Icon Container */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-105 group-hover:bg-indigo-100">
              <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" strokeWidth={2} />
            </div>
            {/* Text */}
            <h3 className="text-lg font-bold text-slate-900 leading-snug px-4 mb-2">
              Dán & Thanh toán
            </h3>
            <p className="text-sm text-slate-600 px-4">
              Dán link vào form và thanh toán để bắt đầu xử lý
            </p>
          </div>

          {/* Step 3: Check Email */}
          <div className="flex flex-col items-center text-center group">
            {/* Step Number Badge - Small Pill */}
            <div className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-700 rounded-full mb-3">
              Bước 03
            </div>
            {/* Icon Container */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-105 group-hover:bg-indigo-100">
              <MailCheck className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600" strokeWidth={2} />
            </div>
            {/* Text */}
            <h3 className="text-lg font-bold text-slate-900 leading-snug px-4 mb-2">
              Check Email
            </h3>
            <p className="text-sm text-slate-600 px-4">
              Nhận link Google Drive tốc độ cao qua email của bạn
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
