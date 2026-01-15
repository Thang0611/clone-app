"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Filter, Star, Clock, Users, BookOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import CourseCard from "@/components/CourseCard";
import { toast } from "sonner";

// Mock course data
const COURSES = [
  {
    id: 1,
    title: "The Complete Web Development Bootcamp",
    platform: "Udemy",
    category: "Lập trình",
    instructor: "Dr. Angela Yu",
    rating: 4.7,
    students: 856234,
    duration: "54.5 hours",
    lectures: 392,
    price: 2000,
    originalPrice: 4990000,
    thumbnail: "https://via.placeholder.com/400x225/4F46E5/FFFFFF?text=Web+Dev",
    bestseller: true,
    url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
    description: "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps",
  },
  {
    id: 2,
    title: "100 Days of Code: The Complete Python Pro Bootcamp",
    platform: "Udemy",
    category: "Lập trình",
    instructor: "Dr. Angela Yu",
    rating: 4.7,
    students: 623451,
    duration: "58 hours",
    lectures: 445,
    price: 2000,
    originalPrice: 3990000,
    thumbnail: "https://via.placeholder.com/400x225/7C3AED/FFFFFF?text=Python",
    bestseller: true,
    url: "https://www.udemy.com/course/100-days-of-code/",
    description: "Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!",
  },
  {
    id: 3,
    title: "The Complete 2024 Web Development Bootcamp",
    platform: "Udemy",
    category: "Lập trình",
    instructor: "Colt Steele",
    rating: 4.6,
    students: 432890,
    duration: "63.5 hours",
    lectures: 489,
    price: 2000,
    originalPrice: 4290000,
    thumbnail: "https://via.placeholder.com/400x225/EC4899/FFFFFF?text=Fullstack",
    url: "https://www.udemy.com/course/the-web-developer-bootcamp/",
    description: "The only course you need to learn web development - HTML, CSS, JS, Node, and More!",
  },
  {
    id: 4,
    title: "React - The Complete Guide 2024",
    platform: "Udemy",
    category: "Lập trình",
    instructor: "Maximilian Schwarzmüller",
    rating: 4.6,
    students: 782345,
    duration: "48.5 hours",
    lectures: 578,
    price: 2000,
    originalPrice: 3790000,
    thumbnail: "https://via.placeholder.com/400x225/06B6D4/FFFFFF?text=React",
    bestseller: true,
    url: "https://www.udemy.com/course/react-the-complete-guide/",
    description: "Dive in and learn React.js from scratch! Learn React, Hooks, Redux, React Router, Next.js, Best Practices and way more!",
  },
  {
    id: 5,
    title: "Graphic Design Masterclass",
    platform: "Udemy",
    category: "Thiết kế",
    instructor: "Lindsay Marsh",
    rating: 4.5,
    students: 234567,
    duration: "22 hours",
    lectures: 145,
    price: 2000,
    originalPrice: 2990000,
    thumbnail: "https://via.placeholder.com/400x225/F59E0B/FFFFFF?text=Design",
    url: "https://www.udemy.com/course/graphic-design-masterclass/",
    description: "Learn Graphic Design Theory. Adobe Photoshop, Illustrator, & InDesign. All in one course!",
  },
  {
    id: 6,
    title: "The Complete Digital Marketing Course",
    platform: "Udemy",
    category: "Marketing",
    instructor: "Rob Percival",
    rating: 4.4,
    students: 345678,
    duration: "23 hours",
    lectures: 178,
    price: 2000,
    originalPrice: 3290000,
    thumbnail: "https://via.placeholder.com/400x225/10B981/FFFFFF?text=Marketing",
    url: "https://www.udemy.com/course/learn-digital-marketing-course/",
    description: "12 Courses in 1. Learn SEO, Social Media, Email, Analytics, Copywriting, Sales Funnels, PR & more!",
  },
  {
    id: 7,
    title: "Complete English Course - English Speaking",
    platform: "Udemy",
    category: "Tiếng Anh",
    instructor: "Kate W.",
    rating: 4.5,
    students: 567890,
    duration: "35 hours",
    lectures: 234,
    price: 2000,
    originalPrice: 2590000,
    thumbnail: "https://via.placeholder.com/400x225/EF4444/FFFFFF?text=English",
    url: "https://www.udemy.com/course/complete-english-course/",
    description: "Learn to Speak English Fluently: English Speaking Skills from Beginner to Advanced",
  },
  {
    id: 8,
    title: "The Complete Financial Analyst Training",
    platform: "Udemy",
    category: "Tài chính",
    instructor: "365 Careers",
    rating: 4.6,
    students: 456789,
    duration: "47 hours",
    lectures: 389,
    price: 2000,
    originalPrice: 3990000,
    thumbnail: "https://via.placeholder.com/400x225/8B5CF6/FFFFFF?text=Finance",
    url: "https://www.udemy.com/course/the-complete-financial-analyst-course/",
    description: "Excel, Financial Statement Analysis, Business Analysis, Financial Modeling, Company Valuation",
  },
  {
    id: 9,
    title: "Machine Learning A-Z: AI, Python & R",
    platform: "Udemy",
    category: "AI & Data Science",
    instructor: "Kirill Eremenko",
    rating: 4.5,
    students: 934567,
    duration: "44 hours",
    lectures: 312,
    price: 2000,
    originalPrice: 4590000,
    thumbnail: "https://via.placeholder.com/400x225/6366F1/FFFFFF?text=AI+ML",
    bestseller: true,
    url: "https://www.udemy.com/course/machinelearning/",
    description: "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts.",
  },
  {
    id: 10,
    title: "UI/UX Design với Figma",
    platform: "Coursera",
    category: "Thiết kế",
    instructor: "Google",
    rating: 4.7,
    students: 12345,
    duration: "15 hours",
    lectures: 89,
    price: 2000,
    originalPrice: 1990000,
    thumbnail: "https://via.placeholder.com/400x225/DB2777/FFFFFF?text=UI+UX",
    url: "https://www.coursera.org/learn/ui-ux-design",
    description: "Học thiết kế giao diện chuyên nghiệp với Figma từ cơ bản đến nâng cao",
  },
  {
    id: 11,
    title: "Excel từ cơ bản đến nâng cao",
    platform: "Coursera",
    category: "Kỹ năng văn phòng",
    instructor: "Macquarie University",
    rating: 4.6,
    students: 23456,
    duration: "12 hours",
    lectures: 67,
    price: 2000,
    originalPrice: 1490000,
    thumbnail: "https://via.placeholder.com/400x225/059669/FFFFFF?text=Excel",
    url: "https://www.coursera.org/learn/excel-basics",
    description: "Làm chủ Excel với các công thức, biểu đồ và phân tích dữ liệu chuyên nghiệp",
  },
  {
    id: 12,
    title: "Lập trình Java Spring Boot",
    platform: "LinkedIn Learning",
    category: "Lập trình",
    instructor: "Frank Moley",
    rating: 4.5,
    students: 8901,
    duration: "28 hours",
    lectures: 156,
    price: 2000,
    originalPrice: 2990000,
    thumbnail: "https://via.placeholder.com/400x225/DC2626/FFFFFF?text=Java",
    url: "https://www.linkedin.com/learning/java-spring-boot",
    description: "Xây dựng ứng dụng web với Java Spring Boot từ A-Z",
  },
];

const CATEGORIES = [
  "Tất cả",
  "Lập trình",
  "Thiết kế",
  "Marketing",
  "Tiếng Anh",
  "Tài chính",
  "AI & Data Science",
  "Kỹ năng văn phòng",
];

const PLATFORMS = ["Tất cả", "Udemy", "Coursera", "LinkedIn Learning"];

function CoursesPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedPlatform, setSelectedPlatform] = useState("Tất cả");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular"); // popular, rating, newest

  // Initialize search query from URL params
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Filter and search courses
  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "Tất cả" || course.category === selectedCategory;

      const matchesPlatform =
        selectedPlatform === "Tất cả" || course.platform === selectedPlatform;

      return matchesSearch && matchesCategory && matchesPlatform;
    }).sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "popular") return b.students - a.students;
      if (sortBy === "newest") return b.id - a.id;
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedPlatform, sortBy]);

  const handleQuickOrder = (course: typeof COURSES[0]) => {
    // Copy URL to clipboard and show toast
    navigator.clipboard.writeText(course.url);
    toast.success(`Đã copy link khóa học!`, {
      description: `"${course.title}" - Scroll xuống để nhập email và đặt hàng`,
      duration: 5000,
    });

    // Scroll to homepage after a delay
    setTimeout(() => {
      window.location.href = "/?course=" + encodeURIComponent(course.url);
    }, 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Khám phá khóa học
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Hơn {COURSES.length}+ khóa học từ Udemy, Coursera, LinkedIn Learning với giá chỉ từ 30K
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm khóa học, giảng viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/40 text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 text-slate-700 font-medium"
            >
              <Filter className="w-5 h-5" />
              Bộ lọc
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Filters */}
            <div className={`flex flex-col lg:flex-row gap-4 w-full lg:w-auto ${showFilters ? 'block' : 'hidden lg:flex'}`}>
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block lg:hidden">
                  Danh mục
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-700 font-medium min-w-[180px]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block lg:hidden">
                  Nền tảng
                </label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="px-4 py-2 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-700 font-medium min-w-[150px]"
                >
                  {PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block lg:hidden">
                  Sắp xếp
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-700 font-medium min-w-[150px]"
                >
                  <option value="popular">Phổ biến nhất</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-slate-600 font-medium">
              {filteredCourses.length} khóa học
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              Không tìm thấy khóa học
            </h3>
            <p className="text-slate-600">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                {...course}
                onAddToCart={() => handleQuickOrder(course)}
              />
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Không tìm thấy khóa học bạn cần?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Gửi link khóa học bất kỳ từ Udemy, Coursera, LinkedIn Learning và chúng tôi sẽ hỗ trợ bạn!
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => window.location.href = "/"}
          >
            Gửi yêu cầu ngay
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="animate-pulse">Đang tải...</div>
        </div>
        <Footer />
      </div>
    }>
      <CoursesPageContent />
    </Suspense>
  );
}
