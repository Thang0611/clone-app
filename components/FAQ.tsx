export default function FAQ() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-center">
          CÂU HỎI THƯỜNG GẶP
        </h2>
        <p className="text-xl text-slate-600 mb-16 text-center">
          Các câu hỏi thường gặp khi mua khoá học tại Full Bootcamp
        </p>

        <div className="space-y-6">
          <div className="card bg-white p-6 sm:p-8 faq-accordion">
            <input type="checkbox" id="faq-1" className="faq-checkbox" />
            <label htmlFor="faq-1" className="faq-label">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Giá khoá học là bao nhiêu?
              </h3>
              <span className="faq-icon">▼</span>
            </label>
            <div className="faq-content">
              <p className="text-base sm:text-lg text-slate-600">
                1 khoá Udemy = 50k, Unica = 99k nhé bạn
              </p>
            </div>
          </div>

          <div className="card bg-white p-6 sm:p-8 faq-accordion">
            <input type="checkbox" id="faq-2" className="faq-checkbox" />
            <label htmlFor="faq-2" className="faq-label">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Mình có được tải về không?
              </h3>
              <span className="faq-icon">▼</span>
            </label>
            <div className="faq-content">
              <p className="text-base sm:text-lg text-slate-600">
                Có. Bạn hoàn toàn có quyền download mọi khóa học khi mua tại Full Bootcamp
              </p>
            </div>
          </div>

          <div className="card bg-white p-6 sm:p-8 faq-accordion">
            <input type="checkbox" id="faq-3" className="faq-checkbox" />
            <label htmlFor="faq-3" className="faq-label">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Có được Update khi khóa học cập nhật thêm không?
              </h3>
              <span className="faq-icon">▼</span>
            </label>
            <div className="faq-content">
              <p className="text-base sm:text-lg text-slate-600">
                Có. Mình có cập nhật MIỄN PHÍ cho các bạn
              </p>
            </div>
          </div>

          <div className="card bg-white p-6 sm:p-8 faq-accordion">
            <input type="checkbox" id="faq-4" className="faq-checkbox" />
            <label htmlFor="faq-4" className="faq-label">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Thanh toán xong bao lâu nhận được khoá học?
              </h3>
              <span className="faq-icon">▼</span>
            </label>
            <div className="faq-content">
              <p className="text-base sm:text-lg text-slate-600">
                Thời gian giao hàng khoảng 2-4 tiếng. Khoá nào nặng có thể lâu hơn
              </p>
            </div>
          </div>

          <div className="card bg-white p-6 sm:p-8 faq-accordion">
            <input type="checkbox" id="faq-5" className="faq-checkbox" />
            <label htmlFor="faq-5" className="faq-label">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Cách dùng phụ đề rời như thể nào? Cách dịch phụ đề sang tiếng việt?
              </h3>
              <span className="faq-icon">▼</span>
            </label>
            <div className="faq-content">
              <p className="text-base sm:text-lg text-slate-600">
                Hướng dẫn dùng phụ đề rời: <a href="#" className="text-primary-600 hover:underline font-semibold">Tại đây</a>
                <br />
                Cách dịch sang tiếng việt: <a href="#" className="text-primary-600 hover:underline font-semibold">Tại đây</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
