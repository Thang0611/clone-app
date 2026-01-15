"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, CheckCircle2, Lock } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Chính sách bảo mật
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
                  Tại <strong>KhoaHocGiaRe.info</strong>, chúng tôi cam kết bảo vệ quyền riêng tư và 
                  thông tin cá nhân của bạn. Chính sách bảo mật này mô tả cách chúng tôi thu thập, 
                  sử dụng, lưu trữ và bảo vệ thông tin của bạn.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý với các điều khoản trong 
                  chính sách bảo mật này.
                </p>
              </section>

              {/* Information Collected */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  2. Thông tin chúng tôi thu thập
                </h2>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">2.1. Thông tin cá nhân</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Khi bạn sử dụng dịch vụ, chúng tôi có thể thu thập:
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "Địa chỉ email (bắt buộc để giao khóa học)",
                    "Họ tên (tùy chọn)",
                    "Số điện thoại (tùy chọn)",
                    "Thông tin thanh toán (mã giao dịch, số tiền)",
                    "Link khóa học bạn muốn mua"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-bold text-slate-900 mb-3 mt-6">2.2. Thông tin tự động</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Chúng tôi tự động thu thập một số thông tin khi bạn truy cập website:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Địa chỉ IP</li>
                  <li>Loại trình duyệt và thiết bị</li>
                  <li>Hệ điều hành</li>
                  <li>Thời gian truy cập</li>
                  <li>Trang đã xem</li>
                  <li>Cookies và tracking technologies</li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  3. Cách chúng tôi sử dụng thông tin
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Chúng tôi sử dụng thông tin của bạn để:
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "Xử lý đơn hàng và giao khóa học",
                    "Gửi thông báo về trạng thái đơn hàng",
                    "Hỗ trợ khách hàng",
                    "Cải thiện dịch vụ và trải nghiệm người dùng",
                    "Phân tích thống kê và xu hướng",
                    "Gửi thông tin marketing (nếu bạn đồng ý)",
                    "Phát hiện và ngăn chặn gian lận",
                    "Tuân thủ pháp luật và quy định"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Information Sharing */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  4. Chia sẻ thông tin
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Chúng tôi <strong>KHÔNG</strong> bán hoặc cho thuê thông tin cá nhân của bạn cho bên thứ ba. 
                  Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li><strong>Nhà cung cấp dịch vụ:</strong> Google Drive (lưu trữ khóa học), dịch vụ email, thanh toán</li>
                  <li><strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi cơ quan có thẩm quyền</li>
                  <li><strong>Bảo vệ quyền lợi:</strong> Để ngăn chặn gian lận hoặc hoạt động bất hợp pháp</li>
                  <li><strong>Sự đồng ý:</strong> Khi bạn cho phép chia sẻ với bên thứ ba cụ thể</li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-green-600" />
                  5. Bảo mật dữ liệu
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức để bảo vệ thông tin của bạn:
                </p>
                <ul className="space-y-2 mb-4">
                  {[
                    "Mã hóa SSL/TLS cho tất cả giao tiếp",
                    "Lưu trữ dữ liệu trên server bảo mật",
                    "Kiểm soát truy cập nghiêm ngặt",
                    "Giám sát và phát hiện xâm nhập",
                    "Sao lưu dữ liệu thường xuyên",
                    "Cập nhật bảo mật định kỳ"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <p className="text-slate-700 text-sm">
                    <strong>Lưu ý:</strong> Mặc dù chúng tôi nỗ lực bảo vệ thông tin, không có phương thức truyền 
                    tải hoặc lưu trữ nào là 100% an toàn. Bạn cũng có trách nhiệm bảo vệ thông tin của mình.
                  </p>
                </div>
              </section>

              {/* Data Retention */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  6. Lưu trữ dữ liệu
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Chúng tôi lưu trữ thông tin của bạn trong thời gian:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li><strong>Thông tin đơn hàng:</strong> 3 năm (để hỗ trợ và bảo hành)</li>
                  <li><strong>Email liên hệ:</strong> Đến khi bạn yêu cầu xóa</li>
                  <li><strong>Dữ liệu phân tích:</strong> Được ẩn danh và lưu trữ vô thời hạn</li>
                  <li><strong>Cookies:</strong> Theo cài đặt trình duyệt của bạn</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  7. Quyền của bạn
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Bạn có các quyền sau đối với dữ liệu cá nhân của mình:
                </p>
                <ul className="space-y-3 mb-4">
                  {[
                    { title: "Quyền truy cập", desc: "Yêu cầu xem thông tin chúng tôi có về bạn" },
                    { title: "Quyền chỉnh sửa", desc: "Yêu cầu sửa đổi thông tin không chính xác" },
                    { title: "Quyền xóa", desc: "Yêu cầu xóa dữ liệu cá nhân (trừ khi bị ràng buộc pháp lý)" },
                    { title: "Quyền hạn chế", desc: "Yêu cầu hạn chế xử lý dữ liệu" },
                    { title: "Quyền di chuyển", desc: "Nhận dữ liệu của bạn ở định dạng có thể đọc" },
                    { title: "Quyền phản đối", desc: "Phản đối việc xử lý dữ liệu cho mục đích marketing" },
                    { title: "Quyền rút đồng ý", desc: "Thu hồi sự đồng ý bất kỳ lúc nào" }
                  ].map((item, idx) => (
                    <li key={idx} className="bg-slate-50 p-4 rounded-lg">
                      <strong className="text-slate-900">{item.title}:</strong>
                      <span className="text-slate-700 ml-2">{item.desc}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-slate-700 leading-relaxed">
                  Để thực hiện các quyền này, vui lòng liên hệ: <strong>support@khoahocgiare.info</strong>
                </p>
              </section>

              {/* Cookies */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  8. Cookies và Tracking
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Chúng tôi sử dụng cookies và công nghệ tương tự để:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4 mb-4">
                  <li>Ghi nhớ preferences và settings</li>
                  <li>Phân tích lưu lượng truy cập</li>
                  <li>Cải thiện trải nghiệm người dùng</li>
                  <li>Hiển thị quảng cáo liên quan</li>
                </ul>
                <p className="text-slate-700 leading-relaxed">
                  Bạn có thể quản lý cookies thông qua cài đặt trình duyệt. Lưu ý rằng vô hiệu hóa cookies 
                  có thể ảnh hưởng đến chức năng của website.
                </p>
              </section>

              {/* Third Party Services */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  9. Dịch vụ bên thứ ba
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Website của chúng tôi có thể chứa links đến các trang bên thứ ba:
                </p>
                <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4">
                  <li>Google Drive (lưu trữ khóa học)</li>
                  <li>Udemy, Coursera, LinkedIn Learning (link khóa học gốc)</li>
                  <li>Ngân hàng (thanh toán)</li>
                  <li>Social media (Facebook, etc.)</li>
                </ul>
                <p className="text-slate-700 leading-relaxed mt-4">
                  Chúng tôi không chịu trách nhiệm về chính sách bảo mật của các trang bên thứ ba. 
                  Vui lòng đọc chính sách của họ trước khi cung cấp thông tin.
                </p>
              </section>

              {/* Children Privacy */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  10. Quyền riêng tư trẻ em
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  Dịch vụ của chúng tôi không dành cho trẻ em dưới 16 tuổi. 
                  Chúng tôi không cố ý thu thập thông tin từ trẻ em. 
                  Nếu bạn là phụ huynh và phát hiện con em mình cung cấp thông tin, 
                  vui lòng liên hệ để chúng tôi xóa dữ liệu.
                </p>
              </section>

              {/* International Transfer */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  11. Chuyển giao dữ liệu quốc tế
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  Dữ liệu của bạn có thể được lưu trữ và xử lý tại các server ở Việt Nam hoặc nước ngoài 
                  (như Google Drive servers). Chúng tôi đảm bảo rằng dữ liệu được bảo vệ theo tiêu chuẩn 
                  của chính sách này bất kể địa điểm lưu trữ.
                </p>
              </section>

              {/* Policy Changes */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  12. Thay đổi chính sách
                </h2>
                <p className="text-slate-700 leading-relaxed">
                  Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian. 
                  Thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trên website. 
                  Ngày "Cập nhật lần cuối" ở đầu trang sẽ được cập nhật.
                </p>
              </section>

              {/* Contact */}
              <section className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  13. Liên hệ
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  Nếu bạn có câu hỏi về chính sách bảo mật hoặc muốn thực hiện quyền của mình, vui lòng liên hệ:
                </p>
                <div className="bg-indigo-50 rounded-lg p-6 border-2 border-indigo-200">
                  <p className="text-slate-700 mb-2">
                    <strong>Email:</strong> support@khoahocgiare.info
                  </p>
                  <p className="text-slate-700 mb-2">
                    <strong>Hotline:</strong> 0123 456 789
                  </p>
                  <p className="text-slate-700">
                    <strong>Website:</strong> khoahocgiare.info
                  </p>
                </div>
              </section>

              {/* Last Update */}
              <section>
                <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-lg">
                  <p className="text-slate-700">
                    <strong>Cập nhật lần cuối:</strong> 13 tháng 1, 2026
                  </p>
                  <p className="text-slate-600 text-sm mt-2">
                    Chúng tôi cam kết bảo vệ quyền riêng tư của bạn và luôn minh bạch về cách xử lý dữ liệu.
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
