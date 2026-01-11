import Image from "next/image";

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-center">
          Cách get khoá học Udemy, Unica, Gitiho?
        </h2>
        <p className="text-xl text-slate-600 mb-16 text-center max-w-3xl mx-auto">
          Bạn chỉ cần nhập link khoá học và email, thanh toán sau đó nhận files qua GoogleDrive
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-primary-200"></div>
          
          <div className="text-center relative">
            <div className="w-24 h-24 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold shadow-lg">
              01
            </div>
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Image src="/images/works/1.svg" alt="Nhập link" width={40} height={40} className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Nhập link khoá học bạn cần.</h3>
          </div>
          <div className="text-center relative">
            <div className="w-24 h-24 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold shadow-lg">
              02
            </div>
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Image src="/images/works/2.svg" alt="Thanh toán" width={40} height={40} className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Thanh toán đơn hàng.</h3>
          </div>
          <div className="text-center relative">
            <div className="w-24 h-24 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-8 text-4xl font-bold shadow-lg">
              03
            </div>
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Image src="/images/works/3.svg" alt="Nhận khóa học" width={40} height={40} className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Nhận khoá học qua GoogleDrive.</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
