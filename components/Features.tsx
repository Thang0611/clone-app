import Image from "next/image";

export default function Features() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 leading-tight px-2">
            Cách get khóa học Udemy, Unica, Gitiho?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto px-4">
            Chỉ cần nhập link khóa học và email, thanh toán sau đó nhận files qua GoogleDrive
          </p>
        </div>

        {/* Steps - Mobile: Stack vertical with proper spacing */}
        <div className="flex flex-col gap-8 sm:gap-10 md:grid md:grid-cols-3 md:gap-8 relative">
          
          {/* Connecting line - Desktop only */}
          <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-0.5 bg-indigo-200 -z-10"></div>
          
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            {/* Number Badge */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-full flex items-center justify-center mb-5 sm:mb-6 text-3xl sm:text-4xl font-bold shadow-lg z-10">
              01
            </div>
            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-5">
              <Image 
                src="/images/works/1.svg" 
                alt="Nhập link" 
                width={40} 
                height={40} 
                className="w-8 h-8 sm:w-10 sm:h-10" 
              />
            </div>
            {/* Text */}
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 leading-snug px-4">
              Nhập link khóa học bạn cần
            </h3>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            {/* Number Badge */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-full flex items-center justify-center mb-5 sm:mb-6 text-3xl sm:text-4xl font-bold shadow-lg z-10">
              02
            </div>
            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-5">
              <Image 
                src="/images/works/2.svg" 
                alt="Thanh toán" 
                width={40} 
                height={40} 
                className="w-8 h-8 sm:w-10 sm:h-10" 
              />
            </div>
            {/* Text */}
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 leading-snug px-4">
              Thanh toán đơn hàng
            </h3>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            {/* Number Badge */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-full flex items-center justify-center mb-5 sm:mb-6 text-3xl sm:text-4xl font-bold shadow-lg z-10">
              03
            </div>
            {/* Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-5">
              <Image 
                src="/images/works/3.svg" 
                alt="Nhận khóa học" 
                width={40} 
                height={40} 
                className="w-8 h-8 sm:w-10 sm:h-10" 
              />
            </div>
            {/* Text */}
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 leading-snug px-4">
              Nhận khóa học qua GoogleDrive
            </h3>
          </div>

        </div>
      </div>
    </section>
  );
}
