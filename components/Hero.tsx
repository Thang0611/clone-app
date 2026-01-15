"use client";

import { useState, FormEvent } from "react";
import { BookOpen, GraduationCap, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import CourseModal from "./CourseModal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { useCourseAPI } from "@/hooks/useCourseAPI";
import { parseUrls, isValidEmail } from "@/lib/utils";
import type { CourseInfo } from "@/types";

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [urlsError, setUrlsError] = useState<string>("");

  const { getCourseInfo, courseInfoLoading } = useCourseAPI();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset errors
    setEmailError("");
    setUrlsError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const courseLinks = formData.get("courseLinks") as string;

    // Validation
    if (!email || !courseLinks) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError("Email không hợp lệ");
      toast.error("Email không hợp lệ");
      return;
    }

    const urls = parseUrls(courseLinks);

    if (urls.length === 0) {
      setUrlsError("Vui lòng nhập ít nhất một link khóa học");
      toast.error("Vui lòng nhập ít nhất một link khóa học");
      return;
    }

    // Store email for later use
    setUserEmail(email);

    // Open modal first to show loading state
    setIsModalOpen(true);

    // Show loading toast
    const loadingToast = toast.loading(`Đang lấy thông tin ${urls.length} khóa học...`);

    try {
      const results = await getCourseInfo(urls);
      setCourses(results);
      
      // Success toast
      toast.success("Lấy thông tin thành công!", {
        id: loadingToast,
        description: `Tìm thấy ${results.filter(c => c.success).length}/${results.length} khóa học hợp lệ`,
      });
    } catch (error: any) {
      // Error handling
      const errorMessage = error.message || "Có lỗi xảy ra khi lấy thông tin khóa học";
      
      toast.error("Không thể lấy thông tin khóa học", {
        id: loadingToast,
        description: errorMessage,
        action: {
          label: "Thử lại",
          onClick: () => handleSubmit(e),
        },
      });
      
      setCourses([]);
      setIsModalOpen(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight !text-white">
              Tải Khóa Học Udemy, Coursera, LinkedIn Learning{" "}
              <span className="!text-green-400 font-extrabold">Giá Chỉ từ 2k</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 !text-white">
              Công cụ hỗ trợ tải khóa học từ Udemy, Coursera, LinkedIn Learning về Google Drive
            </p>
            
            <Button 
              variant="secondary" 
              size="lg"
              className="mb-12"
              onClick={() => toast.info("Tính năng đang phát triển")}
            >
              Hướng dẫn sử dụng
            </Button>

            {/* Features Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                  <BookOpen className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="!text-white font-semibold">22000+ khoá học</p>
                  <p className="!text-gray-200 text-sm">Có sẵn</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                  <GraduationCap className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="!text-white font-semibold">9000+ khoá học</p>
                  <p className="!text-gray-200 text-sm">Có sẵn</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-white/10">
                  <RefreshCw className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <div>
                  <p className="!text-white font-semibold">Update</p>
                  <p className="!text-gray-200 text-sm">Khoá học hàng tuần</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form - Modern Clean Design */}
          <div className="lg:pl-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/50 p-8 md:p-10 hover:shadow-2xl transition-shadow duration-300">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  Bắt đầu ngay
                </h2>
                <p className="text-slate-600 text-sm">
                  Nhập thông tin để nhận khóa học về email của bạn
                </p>
              </div>
              
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email Input - Modern Style */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gmail nhận khóa học <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="example@gmail.com"
                    disabled={courseInfoLoading}
                    className={`
                      w-full px-4 py-3.5 rounded-xl border-2 bg-white
                      text-slate-900 placeholder:text-slate-400
                      transition-all duration-200
                      focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400
                      hover:border-slate-300
                      disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-50
                      ${emailError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'}
                    `}
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Course Links Input - Modern Style */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Link khóa học <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="courseLinks"
                    rows={5}
                    required
                    placeholder="https://www.udemy.com/course/nodejs-for-beginners/"
                    disabled={courseInfoLoading}
                    className={`
                      w-full px-4 py-3.5 rounded-xl border-2 bg-white
                      text-slate-900 placeholder:text-slate-400 resize-none
                      transition-all duration-200
                      focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400
                      hover:border-slate-300
                      disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-50
                      ${urlsError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'}
                    `}
                  />
                  {urlsError ? (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      {urlsError}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-slate-500">
                      💡 Mỗi link một dòng. Hỗ trợ nhiều khóa học cùng lúc.
                    </p>
                  )}
                </div>

                {/* Submit Button - Modern Gradient */}
                <button
                  type="submit"
                  disabled={courseInfoLoading}
                  className="
                    group relative w-full px-6 py-4 rounded-xl font-semibold text-base
                    text-white bg-gradient-to-r from-indigo-600 to-indigo-700
                    hover:from-indigo-700 hover:to-indigo-800
                    focus:outline-none focus:ring-4 focus:ring-indigo-100
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transform transition-all duration-200
                    hover:scale-[1.02] hover:shadow-xl
                    active:scale-[0.98]
                    disabled:hover:scale-100
                  "
                >
                  {courseInfoLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang kiểm tra...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Kiểm tra khóa học
                    </span>
                  )}
                </button>
              </form>

              {/* Trust Indicators */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Tự động xử lý</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>An toàn & bảo mật</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>Gửi email tự động</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courses={courses}
        isLoading={courseInfoLoading}
        email={userEmail}
      />
    </section>
  );
}
