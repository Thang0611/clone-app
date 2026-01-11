"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import CourseModal from "./CourseModal";

interface CourseInfo {
  success: boolean;
  url?: string;
  title?: string;
  image?: string;
  price?: number;
  courseId?: number | null;
  message?: string;
}

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setIsModalOpen(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const courseLinks = formData.get("courseLinks") as string;

    if (!email || !courseLinks) {
      setError("Vui lòng điền đầy đủ thông tin");
      setIsLoading(false);
      return;
    }

    // Store email for order page
    setUserEmail(email);

    // Parse course links (split by newline)
    const urls = courseLinks
      .split("\n")
      .map((link) => link.trim())
      .filter((link) => link.length > 0);

    if (urls.length === 0) {
      setError("Vui lòng nhập ít nhất một link khóa học");
      setIsLoading(false);
      return;
    }

    try {
      // Create AbortController for timeout (30 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("https://api.khoahocgiare.info/api/v1/get-course-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          urls: urls,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Handle error responses from backend
      if (data.success === false) {
        const errorMessage = data.message || "Không thể lấy thông tin khóa học";
        throw new Error(errorMessage);
      }
      
      // Backend returns: { success: true, results: [...] }
      // or could be: { success: true, data: [...] }
      if (data.success && Array.isArray(data.results)) {
        setCourses(data.results);
      } else if (data.success && Array.isArray(data.data)) {
        setCourses(data.data);
      } else if (Array.isArray(data)) {
        // If response is directly an array
        setCourses(data);
      } else {
        throw new Error("Format response không đúng");
      }
    } catch (err: any) {
      console.error("Error fetching course info:", err);
      
      // Handle different types of errors with user-friendly messages
      let errorMessage = "Có lỗi xảy ra khi lấy thông tin khóa học";
      
      if (err.name === 'AbortError') {
        errorMessage = "Request timeout. Vui lòng thử lại sau.";
      } else if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight !text-white">
              Get Khoá Học Udemy, Unica, Gitiho{" "}
              <span className="!text-green-400 font-extrabold">Giá Chỉ từ 50k</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 !text-white">
              Công cụ hỗ trợ GET khoá học Udemy về Google Drive
            </p>
            
            <button className="bg-white text-slate-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-100 transition-colors mb-12">
              Hướng dẫn sử dụng
            </button>

            {/* Features Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image src="/images/icons/hero-1.svg" alt="Icon" width={24} height={24} className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-300 font-semibold">22000+ khoá học</p>
                  <p className="text-slate-300 text-sm">Có sẵn</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image src="/images/icons/hero-3.svg" alt="9000+ khoá học" width={24} height={24} className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-300 font-semibold">9000+ khoá học</p>
                  <p className="text-slate-300 text-sm">Có sẵn</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image src="/images/icons/hero-2.svg" alt="Update" width={24} height={24} className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-300 font-semibold">Update</p>
                  <p className="text-slate-300 text-sm">Khoá học hàng tuần</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:pl-8">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                Get khóa học TẠI ĐÂY !!!
              </h2>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-slate-900 font-semibold mb-3 text-lg">
                    Địa chỉ Gmail nhận khóa học
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all text-base text-slate-900 placeholder:text-slate-400 bg-white"
                    placeholder="your-email@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-slate-900 font-semibold mb-3 text-lg">
                    Link khoá học cần mua:
                  </label>
                  <textarea
                    name="courseLinks"
                    rows={5}
                    required
                    className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all text-base resize-none text-slate-900 placeholder:text-slate-400 bg-white"
                    placeholder="https://www.udemy.com/course/git-and-github-bootcamp/"
                  />
                  <p className="text-sm text-slate-600 mt-2">
                    Hỗ trợ nhiều link khoá học Udemy. Nhập mỗi link 1 dòng.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Đang kiểm tra..." : "Check Khóa Học"}
                </button>
                {error && (
                  <p className="text-sm text-red-600 text-center mt-2">{error}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Course Modal */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courses={courses}
        isLoading={isLoading}
        email={userEmail}
      />
    </section>
  );
}
