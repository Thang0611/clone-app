import Image from "next/image";

export default function WhatIsFullBootcamp() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-center">
          Full Bootcamp là công cụ gì?
        </h2>
        <p className="text-xl text-slate-600 mb-12 text-center max-w-3xl mx-auto leading-relaxed">
          Là công cụ giúp bạn tải khóa học Udemy bạn cần về Drive!. Full Bootcamp sẽ tải khóa học rồi chia sẻ lại qua Google Drive cho bạn với chi phí thấp hơn giá gốc.
          <br />
          Trong Drive bạn nhận bao gồm: file, Video, Phụ đề : eng,vi
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-16">
          {/* Left Column - Image */}
          <div>
            <Image 
              src="/images/udemy-1.jpg" 
              alt="Udemy Course Laptop" 
              width={690} 
              height={765}
              className="w-full h-auto rounded-2xl shadow-xl"
            />
          </div>

          {/* Right Column - Features and Button */}
          <div className="flex flex-col">
            <div className="flex flex-col gap-8 mb-8">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image src="/images/icons/what-1.svg" alt="Chất lượng đảm bảo" width={32} height={32} className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Chất lượng đảm bảo</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Chất lượng Video HD, Phụ đề, Files, Bài tập đi kèm đầy đủ.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image src="/images/icons/what-2.svg" alt="Cập nhật liên tục" width={32} height={32} className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Cập nhật liên tục</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Luôn được cập nhật update video mới nhất, với kiến thức mới nhất. Hỗ trợ tải thêm, tải mới lại content của khóa học.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Image src="/images/icons/what-3.svg" alt="Tiết kiệm chi phí" width={32} height={32} className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Tiết kiệm chi phí</h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    Tool hỗ trợ bạn chi phí cũng như tiết kiệm thời gian cho bạn.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Button below features */}
            <div className="mt-4">
              <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl">
                Tải khóa học ngay!
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
