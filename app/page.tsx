export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-primary-600">Full Bootcamp</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Trang chủ</a>
              <a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Khóa học</a>
              <a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Blog</a>
              <a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Cửa hàng</a>
              <a href="#" className="text-slate-600 hover:text-primary-600 transition-colors">Kiếm tra đơn hàng</a>
            </div>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Tải khóa học
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Get Khoá Học Udemy, Unica, Gitiho Giá Chỉ từ 50k
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Công cụ hỗ trợ GET khoá học Udemy về Google Drive
            </p>
          </div>

          {/* Features Icons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">9000+ khoá học có sẵn</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">Update khoá học hàng tuần</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">Hỗ trợ 24/7</p>
            </div>
          </div>

          {/* Order Form */}
          <div className="max-w-2xl mx-auto">
            <div className="card bg-white p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Get khóa học TẠI ĐÂY !!!
              </h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-slate-900 font-medium mb-2">
                    Địa chỉ Gmail nhận khóa học
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-900 font-medium mb-2">
                    Link khoá học cần mua:
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Hỗ trợ nhiều link khoá học Udemy. Nhập mỗi link 1 dòng."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Check Khóa Học
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">22000+ Khoá học</h3>
              <p className="text-slate-600">Có sẵn kho đồ sộ từ udemy</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Update miễn phí</h3>
              <p className="text-slate-600">Đầy đủ video mới nhất và cập nhật</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Lifetime access</h3>
              <p className="text-slate-600">Toàn quyền download</p>
            </div>
          </div>
        </div>
      </section>

      {/* What is Full Bootcamp */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Full Bootcamp là công cụ gì?
          </h2>
          <p className="text-lg text-slate-600 mb-8 text-center max-w-3xl mx-auto">
            Là công cụ giúp bạn tải khóa học Udemy bạn cần về Drive!. Full Bootcamp sẽ tải khóa học rồi chia sẻ lại qua Google Drive cho bạn với chi phí thấp hơn giá gốc.
            <br />
            Trong Drive bạn nhận bao gồm: file, Video, Phụ đề : eng,vi
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="card bg-white p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Chất lượng đảm bảo</h3>
              <p className="text-slate-600">
                Chất lượng Video HD, Phụ đề, Files, Bài tập đi kèm đầy đủ.
              </p>
            </div>
            <div className="card bg-white p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Cập nhật liên tục</h3>
              <p className="text-slate-600">
                Luôn được cập nhật update video mới nhất, với kiến thức mới nhất. Hỗ trợ tải thêm, tải mới lại content của khóa học.
              </p>
            </div>
            <div className="card bg-white p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Tiết kiệm chi phí</h3>
              <p className="text-slate-600">
                Tool hỗ trợ bạn chi phí cũng như tiết kiệm thời gian cho bạn.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
              Tải khóa học ngay!
            </button>
          </div>
        </div>
      </section>

      {/* Diverse Topics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Đa Dạng Chủ Đề, Nhiều Lĩnh Vực
          </h2>
          <p className="text-lg text-slate-600 text-center max-w-3xl mx-auto">
            Chúng tôi tự hào cung cấp một bộ sưu tập đa dạng các khoá học trên nhiều lĩnh vực khác nhau, bao gồm lập trình, thiết kế đồ họa, kỹ năng mềm, tiếng Anh, marketing, quản lý dự án và nhiều lĩnh vực khác. Bất kể bạn quan tâm đến lĩnh vực nào, chúng tôi đều có khoá học phù hợp cho bạn, và tất cả đều có sẵn trên các trang web mà Full Bootcamp hỗ trợ, như Unica, Gitiho, và Udemy.
          </p>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
            Cách get khoá học Udemy, Unica, Gitiho?
          </h2>
          <p className="text-lg text-slate-600 mb-12 text-center">
            Bạn chỉ cần nhập link khoá học và email, thanh toán sau đó nhận files qua GoogleDrive
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                01
              </div>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Nhập link khoá học bạn cần.</h3>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                02
              </div>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Thanh toán đơn hàng.</h3>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
                03
              </div>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Nhận khoá học qua GoogleDrive.</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Table */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Bảng giá</h2>
          <p className="text-slate-600 mb-12 text-center">
            Bạn hãy mua khoá học theo Combo để được giảm giá.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mua lẻ */}
            <div className="card bg-white p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Mua lẻ</h3>
              <div className="text-4xl font-bold text-primary-600 mb-4">50K / Khóa</div>
              <p className="text-slate-600 mb-6">Gói mua thử và trải nghiệm</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">Đầy đủ video</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">Không chặn download</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">Update miễn phí</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">24/7 Full support</span>
                </li>
              </ul>
              <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Tải khóa học ngay!
              </button>
            </div>

            {/* Combo 5 */}
            <div className="card bg-white p-8 border-2 border-primary-600 relative">
              <div className="absolute top-0 right-0 bg-primary-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                Giảm 10%
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Combo 5 khoá</h3>
              <div className="text-4xl font-bold text-primary-600 mb-4">225K</div>
              <p className="text-slate-600 mb-6">Combo 5 khoá tiết kiệm 10%</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">Đầy đủ video</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">Không chặn download</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">Update miễn phí</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">24/7 Full support</span>
                </li>
              </ul>
              <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Tải khóa học ngay!
              </button>
            </div>

            {/* Combo 10 */}
            <div className="card bg-white p-8 relative">
              <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
                Khuyến mãi
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Combo 10 khoá</h3>
              <div className="text-4xl font-bold text-primary-600 mb-4">299k</div>
              <p className="text-slate-600 mb-6">Combo mua nhiều siêu khuyến mãi đến hết 15/2/2026</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">Đầy đủ video</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">Không chặn download</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">Update miễn phí</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-600">24/7 Full support</span>
                </li>
              </ul>
              <button className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                Tải khóa học ngay!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
            CÂU HỎI THƯỜNG GẶP
          </h2>
          <p className="text-slate-600 mb-12 text-center">
            Các câu hỏi thường gặp khi mua khoá học tại Full Bootcamp
          </p>

          <div className="space-y-6">
            <div className="card bg-white p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Giá khoá học là bao nhiêu?
              </h3>
              <p className="text-slate-600">
                1 khoá Udemy = 50k, Unica = 99k nhé bạn
              </p>
            </div>

            <div className="card bg-white p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Mình có được tải về không?
              </h3>
              <p className="text-slate-600">
                Có. Bạn hoàn toàn có quyền download mọi khóa học khi mua tại Full Bootcamp
              </p>
            </div>

            <div className="card bg-white p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Có được Update khi khóa học cập nhật thêm không?
              </h3>
              <p className="text-slate-600">
                Có. Mình có cập nhật MIỄN PHÍ cho các bạn
              </p>
            </div>

            <div className="card bg-white p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Thanh toán xong bao lâu nhận được khoá học?
              </h3>
              <p className="text-slate-600">
                Thời gian giao hàng khoảng 2-4 tiếng. Khoá nào nặng có thể lâu hơn
              </p>
            </div>

            <div className="card bg-white p-6">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Cách dùng phụ đề rời như thể nào? Cách dịch phụ đề sang tiếng việt?
              </h3>
              <p className="text-slate-600">
                Hướng dẫn dùng phụ đề rời: <a href="#" className="text-primary-600 hover:underline">Tại đây</a>
                <br />
                Cách dịch sang tiếng việt: <a href="#" className="text-primary-600 hover:underline">Tại đây</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-slate-400">© 2025 Full Bootcamp. All Right Reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Về chúng tôi</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Chính sách bảo mật</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Liên Hệ</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Hỗ Trợ</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">Fanpage</a>
          </div>
          <div className="text-center mt-8">
            <span className="text-slate-400">Tiếng Việt</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
