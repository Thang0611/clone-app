import Image from "next/image";

export default function Stats() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div>
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Image src="/images/icons/hero-1.svg" alt="22000+ Khoá học" width={40} height={40} className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">22000+ Khoá học</h3>
            <p className="text-lg text-slate-600">Có sẵn kho đồ sộ từ udemy</p>
          </div>
          <div>
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Image src="/images/icons/hero-2.svg" alt="Update miễn phí" width={40} height={40} className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">Update miễn phí</h3>
            <p className="text-lg text-slate-600">Đầy đủ video mới nhất và cập nhật</p>
          </div>
          <div>
            <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Image src="/images/icons/hero-3.svg" alt="Lifetime access" width={40} height={40} className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">Lifetime access</h3>
            <p className="text-lg text-slate-600">Toàn quyền download</p>
          </div>
        </div>
      </div>
    </section>
  );
}
