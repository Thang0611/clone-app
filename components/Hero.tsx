"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen, GraduationCap, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import CourseModal from "./CourseModal";
import YouTubeModal from "./YouTubeModal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { useCourseAPI } from "@/hooks/useCourseAPI";
import { parseUrls, isValidEmail } from "@/lib/utils";
import { useTracking } from "@/hooks/useTracking";
import type { CourseInfo } from "@/types";

export default function Hero() {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [urlsError, setUrlsError] = useState<string>("");

  const { getCourseInfo, courseInfoLoading } = useCourseAPI();
  const { trackContent, trackFormBegin, trackForm, trackFormSuccess, trackFormError } = useTracking();

  // Refs for tracking
  const formRef = useRef<HTMLFormElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const formViewTracked = useRef(false);
  const formSubmitTracked = useRef(false); // Prevent duplicate Lead event

  // Reset form submit tracking flag when modal closes (allow re-tracking if user submits again)
  useEffect(() => {
    if (!isModalOpen) {
      formSubmitTracked.current = false;
    }
  }, [isModalOpen]);

  // Step 3.2: ViewContent tracking - Track when form is in viewport for 3+ seconds
  useEffect(() => {
    if (formViewTracked.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !formViewTracked.current) {
            // Track after 3 seconds in viewport
            const timer = setTimeout(() => {
              trackContent('course_form', 'main_hero_form', 'education');
              formViewTracked.current = true;
            }, 3000);

            // Cleanup timer if element leaves viewport
            return () => clearTimeout(timer);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of form is visible
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, [trackContent]);

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

    // Step 3.4: Track form submit BEFORE API call (with email for Advanced Matching)
    // Prevent duplicate Lead event - chỉ track 1 lần mỗi lần submit form
    if (!formSubmitTracked.current) {
      // Validate email trước khi track
      if (!email || !email.trim()) {
        console.warn('[Tracking] Lead: Email is missing when submitting form');
      } else {
        await trackForm('hero_course_form', 'Course Request Form', 'hero_section', urls.length, email.trim());
      }
      formSubmitTracked.current = true;
    }

    // Store email for later use
    setUserEmail(email);

    // Open modal first to show loading state
    setIsModalOpen(true);

    // Show loading toast
    const loadingToast = toast.loading(`Đang lấy thông tin ${urls.length} khóa học...`);

    try {
      const results = await getCourseInfo(urls);
      // Kiểm tra URL params để xác định courseType
      // Nếu có courseType=permanent trong URL (từ trang courses), dùng permanent
      // Ngược lại, mặc định là temporary (từ trang chủ)
      const courseTypeFromUrl = searchParams.get('courseType');
      const categoryFromUrl = searchParams.get('category');
      const courseType: 'temporary' | 'permanent' = courseTypeFromUrl === 'permanent' ? 'permanent' : 'temporary';

      // Đánh dấu courses với courseType và category từ URL hoặc mặc định
      const coursesWithType: CourseInfo[] = results.map(course => ({
        ...course,
        courseType: courseType,
        category: categoryFromUrl || course.category || null
      }));
      setCourses(coursesWithType);

      // Step 3.4: Track form submit success after successful API response
      const validCourses = results.filter(c => c.success).length;
      trackFormSuccess('hero_course_form', urls.length, validCourses);

      // Success toast
      toast.success("Lấy thông tin thành công!", {
        id: loadingToast,
        description: `Tìm thấy ${validCourses}/${results.length} khóa học hợp lệ`,
      });
    } catch (error: any) {
      // Step 3.4: Track form submit error on API failure
      const errorMessage = error.message || "Có lỗi xảy ra khi lấy thông tin khóa học";
      trackFormError('hero_course_form', errorMessage);

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
    <section className="relative bg-gradient-to-br from-blue-100 via-indigo-100 to-violet-100 py-10 sm:py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-300/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Left Content */}
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-slate-800">
              Tải Khóa Học Online{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent font-extrabold animate-gradient">
                Giá Chỉ 50k
              </span>
            </h1>
            <p className="text-base sm:text-lg mb-5 text-slate-600">
              Công cụ hỗ trợ tải khóa học từ Udemy 100% FullHD về Google Drive
            </p>

            <Button
              variant="secondary"
              size="md"
              className="mb-6 sm:mb-8"
              onClick={() => setIsYouTubeModalOpen(true)}
            >
              Hướng dẫn sử dụng
            </Button>

            {/* Features Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-200/50 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                  <BookOpen className="w-6 h-6 text-blue-600" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-slate-800 font-semibold">9000+ khóa học</p>
                  <p className="text-slate-500 text-sm">Có sẵn</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-violet-100 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-200/50 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                  <GraduationCap className="w-6 h-6 text-indigo-600" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-slate-800 font-semibold">Đa nền tảng</p>
                  <p className="text-slate-500 text-sm">Udemy, Coursera, LinkedIn</p>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-violet-200/50 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                  <RefreshCw className="w-6 h-6 text-violet-600" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-slate-800 font-semibold">Cập nhật</p>
                  <p className="text-slate-500 text-sm">Hàng tuần</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form - Modern Clean Design */}
          <div className="lg:pl-6 animate-in fade-in slide-in-from-right duration-700">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/50 p-5 sm:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
              <div className="text-center mb-5">
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1.5">
                  Bắt đầu ngay
                </h2>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Nhập thông tin để nhận khóa học về email của bạn
                </p>
              </div>

              <form ref={formRef} className="space-y-4" onSubmit={handleSubmit} action="#">
                {/* Email Input - Modern Style */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gmail nhận khóa học <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={emailInputRef}
                    type="email"
                    name="email"
                    required
                    placeholder="example@gmail.com"
                    disabled={courseInfoLoading}
                    // Step 3.3: Track form start on focus
                    onFocus={() => {
                      trackFormBegin('hero_course_form', 'Course Request Form', 'hero_section');
                    }}
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
                    group relative w-full px-5 py-3 rounded-xl font-semibold text-sm sm:text-base
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
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-center gap-4 text-[10px] sm:text-xs text-slate-500">
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

      {/* YouTube Modal */}
      <YouTubeModal
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        videoId="YA5jUsf4O2g"
        title="Hướng dẫn sử dụng GetCourses"
      />
    </section>
  );
}
