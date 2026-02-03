import Image from "next/image";

export default function Stats() {
  return (
    <section className="py-6 sm:py-8 bg-white">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* 3 columns on all screens */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6">

          {/* Item 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-2 sm:mb-3">
              <Image
                src="/images/icons/hero-1.svg"
                alt="22000+ Khoá học"
                width={24}
                height={24}
                className="w-5 h-5 sm:w-7 sm:h-7"
              />
            </div>
            <h3 className="text-sm sm:text-xl font-bold text-slate-900 mb-0.5">
              22000+
            </h3>
            <p className="text-[10px] sm:text-sm text-slate-600 leading-tight">
              Khóa học có sẵn
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-2 sm:mb-3">
              <Image
                src="/images/icons/hero-2.svg"
                alt="Update miễn phí"
                width={24}
                height={24}
                className="w-5 h-5 sm:w-7 sm:h-7"
              />
            </div>
            <h3 className="text-sm sm:text-xl font-bold text-slate-900 mb-0.5">
              Free Update
            </h3>
            <p className="text-[10px] sm:text-sm text-slate-600 leading-tight">
              Video mới nhất
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-2 sm:mb-3">
              <Image
                src="/images/icons/hero-3.svg"
                alt="Lifetime access"
                width={24}
                height={24}
                className="w-5 h-5 sm:w-7 sm:h-7"
              />
            </div>
            <h3 className="text-sm sm:text-xl font-bold text-slate-900 mb-0.5">
              Lifetime
            </h3>
            <p className="text-[10px] sm:text-sm text-slate-600 leading-tight">
              Toàn quyền download
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
