"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Target, Users, Heart, TrendingUp, Shield, Clock, CheckCircle2, Star } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Về KhoaHocGiaRe.info
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
            Nền tảng cung cấp khóa học online uy tín với mục tiêu làm cho giáo dục 
            trở nên <span className="font-bold">dễ tiếp cận</span> và <span className="font-bold">giá cả phải chăng</span> cho mọi người
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Story Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Câu chuyện của chúng tôi
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto"></div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <Card>
              <CardBody className="p-8 md:p-12">
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  <strong className="text-indigo-600">KhoaHocGiaRe.info</strong> được thành lập với niềm tin rằng 
                  <strong> giáo dục không nên bị giới hạn bởi rào cản tài chính</strong>. 
                  Chúng tôi nhận thấy rằng nhiều khóa học chất lượng cao trên các nền tảng như Udemy, Coursera, và LinkedIn Learning 
                  có giá khá cao, khiến nhiều người không thể tiếp cận.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  Với sứ mệnh <strong className="text-purple-600">"Học tập không giới hạn"</strong>, 
                  chúng tôi cung cấp giải pháp giúp bạn tiếp cận hàng nghìn khóa học với chi phí 
                  <strong className="text-green-600"> chỉ từ 2,000đ/khóa</strong> - tiết kiệm đến 99% so với giá gốc.
                </p>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Từ năm 2020 đến nay, chúng tôi đã phục vụ <strong>hơn 50,000+ học viên</strong> 
                  và cung cấp <strong>hơn 100,000+ khóa học</strong> trên nhiều lĩnh vực khác nhau. 
                  Sự hài lòng của bạn là động lực để chúng tôi tiếp tục phát triển.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Sứ mệnh & Giá trị cốt lõi
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mission 1 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                  <Target className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Sứ mệnh
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Làm cho giáo dục chất lượng cao trở nên dễ tiếp cận cho mọi người, 
                  không phân biệt hoàn cảnh kinh tế
                </p>
              </CardBody>
            </Card>

            {/* Value 1 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Khách hàng là trung tâm
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Luôn đặt nhu cầu và trải nghiệm của khách hàng lên hàng đầu 
                  trong mọi quyết định
                </p>
              </CardBody>
            </Card>

            {/* Value 2 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Chất lượng cam kết
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Đảm bảo tất cả khóa học đều đầy đủ video, phụ đề và tài liệu, 
                  được cập nhật liên tục
                </p>
              </CardBody>
            </Card>

            {/* Value 3 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Không ngừng đổi mới
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Liên tục cải tiến dịch vụ, mở rộng kho khóa học và 
                  tối ưu trải nghiệm người dùng
                </p>
              </CardBody>
            </Card>

            {/* Value 4 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  An toàn & Bảo mật
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Bảo vệ thông tin cá nhân và đảm bảo giao dịch thanh toán 
                  an toàn tuyệt đối
                </p>
              </CardBody>
            </Card>

            {/* Value 5 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Hỗ trợ 24/7
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Đội ngũ support luôn sẵn sàng hỗ trợ bạn mọi lúc, 
                  giải đáp thắc mắc nhanh chóng
                </p>
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20">
          <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-0">
            <CardBody className="p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
                  <div className="text-white/80 font-medium">Học viên</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">100K+</div>
                  <div className="text-white/80 font-medium">Khóa học</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">4.8/5</div>
                  <div className="text-white/80 font-medium">Đánh giá</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
                  <div className="text-white/80 font-medium">Hỗ trợ</div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "Giá cả siêu tiết kiệm - chỉ từ 2,000đ/khóa",
              "Đầy đủ video HD, phụ đề và tài liệu",
              "Cập nhật miễn phí khi khóa học có nội dung mới",
              "Toàn quyền download về máy",
              "Giao hàng nhanh chóng trong 2-4 giờ",
              "Hỗ trợ nhiều nền tảng: Udemy, Coursera, LinkedIn Learning",
              "Thanh toán an toàn qua ngân hàng",
              "Support 24/7 qua email và hotline"
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 border-0">
          <CardBody className="p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sẵn sàng bắt đầu học?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Hàng nghìn khóa học đang chờ bạn khám phá với giá siêu ưu đãi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => window.location.href = "/courses"}
              >
                Xem khóa học
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="bg-white/10 hover:bg-white/20 text-white border-2 border-white"
                onClick={() => window.location.href = "/contact"}
              >
                Liên hệ chúng tôi
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
