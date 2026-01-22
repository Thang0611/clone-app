"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, CheckCircle2 } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Điều khoản dịch vụ
          </h1>
          <p className="text-lg text-white/90">
            Cập nhật lần cuối: 13 tháng 1, 2026
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <Card className="shadow-xl mb-8">
          <CardBody className="p-8 md:p-12">
            <div className="prose prose-slate max-w-none">
              
              {/* Introduction */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  1. Giới thiệu
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Chào mừng bạn đến với <strong>GetCourses</strong>. Bằng việc truy cập và sử dụng dịch vụ của chúng tôi, 
                  bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sau đây. 
                  Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, 
                  vui lòng không sử dụng dịch vụ của chúng tôi.
                </p>
              </section>

              {/* Service Description */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  2. Mô tả dịch vụ
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  GetCourses cung cấp dịch vụ phân phối khóa học trực tuyến từ các nền tảng như Udemy, Coursera, và LinkedIn Learning. 
                  Chúng tôi:
                </p>
                <ul className="space-y-3 mb-4">
                  {[
                    "Tải và lưu trữ nội dung khóa học trên Google Drive",
                    "Chia sẻ quyền truy cập khóa học đến người dùng",
                    "Cung cấp video, phụ đề và tài liệu đi kèm",
                    "Cập nhật nội dung mới khi khóa học có thay đổi",
                    "Hỗ trợ khách hàng trong quá trình sử dụng"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* User Obligations */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  3. Nghĩa vụ của người dùng
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Khi sử dụng dịch vụ, bạn cam kết:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Cung cấp thông tin chính xác và đầy đủ khi đặt hàng</li>
                  <li>Sử dụng khóa học chỉ cho mục đích học tập cá nhân</li>
                  <li>Không chia sẻ, bán lại hoặc phân phối khóa học cho người khác</li>
                  <li>Không sử dụng dịch vụ cho mục đích thương mại</li>
                  <li>Tuân thủ các quy định về bản quyền và sở hữu trí tuệ</li>
                  <li>Thanh toán đầy đủ và đúng hạn theo thỏa thuận</li>
                </ul>
              </section>

              {/* Payment & Refund */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  4. Thanh toán và hoàn tiền
                </h2>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4.1. Thanh toán</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4 mb-4">
                  <li>Thanh toán qua chuyển khoản ngân hàng</li>
                  <li>Đơn hàng được xử lý sau khi xác nhận thanh toán thành công</li>
                  <li>Thời gian xử lý: 2-4 giờ (có thể lâu hơn với khóa học dung lượng lớn)</li>
                </ul>

                <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">4.2. Chính sách hoàn tiền</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Hoàn tiền 100% nếu không nhận được khóa học trong 24 giờ</li>
                  <li>Hoàn tiền nếu nội dung khóa học không đúng như mô tả</li>
                  <li>Không hoàn tiền sau khi đã giao hàng thành công</li>
                  <li>Thời gian xử lý hoàn tiền: 3-7 ngày làm việc</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  5. Quyền sở hữu trí tuệ
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Tất cả nội dung khóa học (video, tài liệu, phụ đề) thuộc quyền sở hữu của tác giả và nền tảng gốc (Udemy, Coursera, LinkedIn Learning). 
                  Chúng tôi chỉ là đơn vị phân phối.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Người dùng không được phép:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Sao chép, phân phối lại nội dung khóa học</li>
                  <li>Sử dụng cho mục đích thương mại</li>
                  <li>Chỉnh sửa, cắt ghép nội dung</li>
                  <li>Xóa watermark hoặc thông tin bản quyền</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  6. Giới hạn trách nhiệm
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  GetCourses.net không chịu trách nhiệm cho:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Chất lượng nội dung khóa học (do tác giả gốc quyết định)</li>
                  <li>Sự gián đoạn dịch vụ do lỗi kỹ thuật bất khả kháng</li>
                  <li>Thiệt hại gián tiếp phát sinh từ việc sử dụng dịch vụ</li>
                  <li>Lỗi từ phía Google Drive hoặc nền tảng lưu trữ</li>
                </ul>
              </section>

              {/* Service Changes */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  7. Thay đổi dịch vụ
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  Chúng tôi có quyền:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Thay đổi, tạm ngừng hoặc chấm dứt dịch vụ bất kỳ lúc nào</li>
                  <li>Cập nhật giá cả và chính sách</li>
                  <li>Từ chối hoặc hủy đơn hàng trong trường hợp vi phạm điều khoản</li>
                  <li>Sửa đổi điều khoản dịch vụ mà không cần thông báo trước</li>
                </ul>
              </section>

              {/* User Account */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  8. Tài khoản người dùng
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Mỗi đơn hàng được liên kết với một địa chỉ email. Bạn có trách nhiệm:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Bảo mật thông tin email và mã đơn hàng</li>
                  <li>Thông báo ngay nếu phát hiện truy cập trái phép</li>
                  <li>Không chia sẻ quyền truy cập với người khác</li>
                </ul>
              </section>

              {/* Prohibited Activities */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  9. Hoạt động bị cấm
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Người dùng không được phép:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                  <li>Gian lận, lừa đảo hoặc vi phạm quyền lợi người khác</li>
                  <li>Tấn công, hack hoặc phá hoại hệ thống</li>
                  <li>Spam, quảng cáo trái phép</li>
                  <li>Upload virus, malware hoặc mã độc</li>
                </ul>
              </section>

              {/* Termination */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  10. Chấm dứt dịch vụ
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  Chúng tôi có quyền tạm ngừng hoặc chấm dứt quyền truy cập của bạn nếu:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Vi phạm bất kỳ điều khoản nào trong thỏa thuận này</li>
                  <li>Sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                  <li>Gây thiệt hại cho hệ thống hoặc người dùng khác</li>
                  <li>Không thanh toán hoặc thanh toán gian lận</li>
                </ul>
              </section>

              {/* Applicable Law */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  11. Luật áp dụng
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  Các điều khoản này được điều chỉnh bởi pháp luật Việt Nam. 
                  Mọi tranh chấp phát sinh sẽ được giải quyết tại Tòa án có thẩm quyền tại Việt Nam.
                </p>
              </section>

              {/* Contact */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  12. Liên hệ
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Nếu bạn có bất kỳ câu hỏi nào về Điều khoản dịch vụ, vui lòng liên hệ:
                </p>
                <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
                  <p className="text-slate-700 mb-2">
                    <strong>Email:</strong> getcourses.net@gmail.com
                  </p>
                  <p className="text-slate-700 mb-2">
                    <strong>Hotline:</strong> 0123 456 789
                  </p>
                  <p className="text-slate-700">
                    <strong>Website:</strong> getcourses.net
                  </p>
                </div>
              </section>

              {/* Last Update */}
              <section>
                <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-lg">
                  <p className="text-slate-700">
                    <strong>Cập nhật lần cuối:</strong> 13 tháng 1, 2026
                  </p>
                  <p className="text-slate-600 text-sm mt-2">
                    Chúng tôi có thể cập nhật các điều khoản này theo thời gian. 
                    Vui lòng kiểm tra thường xuyên để cập nhật thông tin mới nhất.
                  </p>
                </div>
              </section>

            </div>
          </CardBody>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Quay lại
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
}
