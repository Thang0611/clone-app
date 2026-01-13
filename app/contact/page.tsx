"use client";

import { useState, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, Facebook } from "lucide-react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast.success("Gửi tin nhắn thành công!", {
      description: "Chúng tôi sẽ phản hồi trong vòng 24 giờ",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
            Có thắc mắc? Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Email Card */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Email</h3>
                    <a 
                      href="mailto:support@khoahocgiare.info" 
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      support@khoahocgiare.info
                    </a>
                    <p className="text-sm text-slate-600 mt-1">
                      Phản hồi trong 24h
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Phone Card */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Hotline</h3>
                    <a 
                      href="tel:0123456789" 
                      className="text-green-600 hover:text-green-700 font-bold text-lg"
                    >
                      0123 456 789
                    </a>
                    <p className="text-sm text-slate-600 mt-1">
                      Hỗ trợ 24/7
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Location Card */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Địa chỉ</h3>
                    <p className="text-slate-700">
                      Việt Nam
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      Online Platform
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Working Hours Card */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Giờ làm việc</h3>
                    <p className="text-slate-700">
                      Thứ 2 - Chủ nhật
                    </p>
                    <p className="text-sm text-slate-600 mt-1">
                      24/7 - Luôn online
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Social Card */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardBody className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Facebook className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">Facebook</h3>
                    <a 
                      href="#" 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      KhoaHocGiaRe Fanpage
                    </a>
                    <p className="text-sm text-slate-600 mt-1">
                      Chat trực tiếp
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl">
              <CardBody className="p-8 md:p-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">
                  Gửi tin nhắn cho chúng tôi
                </h2>
                <p className="text-slate-600 mb-8">
                  Điền form bên dưới và chúng tôi sẽ phản hồi sớm nhất có thể
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Tiêu đề
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Chủ đề tin nhắn"
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Message Textarea */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nội dung <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      rows={6}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Đang gửi...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" />
                        Gửi tin nhắn
                      </span>
                    )}
                  </Button>
                </form>

                {/* Additional Info */}
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <p className="text-sm text-slate-600 text-center">
                    Bằng việc gửi form này, bạn đồng ý với{" "}
                    <a href="/privacy" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Chính sách bảo mật
                    </a>{" "}
                    của chúng tôi
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100">
            <CardBody className="p-8 md:p-10">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Câu hỏi thường gặp
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">
                    Tôi có thể thanh toán như thế nào?
                  </h4>
                  <p className="text-slate-700">
                    Chúng tôi hỗ trợ thanh toán qua chuyển khoản ngân hàng với QR code tự động.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">
                    Bao lâu tôi nhận được khóa học?
                  </h4>
                  <p className="text-slate-700">
                    Thời gian xử lý là 2-4 giờ sau khi thanh toán thành công.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">
                    Khóa học có được cập nhật không?
                  </h4>
                  <p className="text-slate-700">
                    Có, tất cả khóa học đều được cập nhật miễn phí khi có nội dung mới.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">
                    Tôi có thể tải về máy không?
                  </h4>
                  <p className="text-slate-700">
                    Có, bạn có toàn quyền download khóa học về máy và học offline.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

      </div>

      <Footer />
    </div>
  );
}
