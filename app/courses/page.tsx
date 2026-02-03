"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Filter, Star, Clock, Users, BookOpen, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import CourseCard from "@/components/CourseCard";
import { toast } from "sonner";
import Breadcrumb from "@/components/Breadcrumb";

// Course interface matching API response
interface Course {
  id: number;
  slug?: string | null;
  title: string;
  platform: string;
  category: string | null;
  instructor: string | null;
  rating: number | null;
  students: number | null;
  duration: string | null;
  lectures: number | null;
  price: number;
  original_price: number | null;
  thumbnail: string | null;
  bestseller: boolean;
  url: string;
  description: string | null;
}

// Mock course data (fallback)
const MOCK_COURSES = [
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
    price: 50000,
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
    price: 50000,
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
    price: 50000,
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
    price: 50000,
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
    price: 50000,
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
    price: 50000,
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
    price: 50000,
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
    price: 50000,
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
    price: 50000,
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
    price: 50000,
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
    price: 50000,
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
    price: 50000,
    originalPrice: 2990000,
    thumbnail: "https://via.placeholder.com/400x225/DC2626/FFFFFF?text=Java",
    url: "https://www.linkedin.com/learning/java-spring-boot",
    description: "Xây dựng ứng dụng web với Java Spring Boot từ A-Z",
  },
];

function CoursesPageContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["Tất cả"]);
  const [platforms, setPlatforms] = useState<string[]>(["Tất cả"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedPlatform, setSelectedPlatform] = useState("Tất cả");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest"); // popular, rating, newest
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [purchasedCourseIds, setPurchasedCourseIds] = useState<Set<number>>(new Set());
  const ITEMS_PER_PAGE = 21;

  const backendUserId = (session?.user as any)?.backendUserId;

  // Initialize search query from URL params
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Fetch user enrollments to show purchased badge
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!backendUserId) {
        setPurchasedCourseIds(new Set());
        return;
      }

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/api/v1/users/${backendUserId}/enrollments`);
        if (response.ok) {
          const data = await response.json();
          const enrolledIds = new Set<number>(
            (data.enrollments || []).map((e: any) => e.course_id).filter(Boolean)
          );
          setPurchasedCourseIds(enrolledIds);
        }
      } catch (err) {
        console.error('Failed to fetch enrollments:', err);
      }
    };

    fetchEnrollments();
  }, [backendUserId]);

  // Load categories and platforms
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/api/courses/categories');
        const data = await response.json();

        // Handle different response formats
        let categoriesArray: string[] = [];
        if (data.success) {
          if (Array.isArray(data.data)) {
            categoriesArray = data.data;
          } else if (data.data && Array.isArray(data.data.categories)) {
            categoriesArray = data.data.categories;
          } else if (Array.isArray(data.categories)) {
            categoriesArray = data.categories;
          }
        }

        if (categoriesArray.length > 0) {
          setCategories(["Tất cả", ...categoriesArray]);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    const loadPlatforms = async () => {
      try {
        const response = await fetch('/api/courses/platforms');
        const data = await response.json();

        // Handle different response formats
        let platformsArray: string[] = [];
        if (data.success) {
          if (Array.isArray(data.data)) {
            platformsArray = data.data;
          } else if (data.data && Array.isArray(data.data.platforms)) {
            platformsArray = data.data.platforms;
          } else if (Array.isArray(data.platforms)) {
            platformsArray = data.platforms;
          }
        }

        if (platformsArray.length > 0) {
          setPlatforms(["Tất cả", ...platformsArray]);
        }
      } catch (error) {
        console.error('Failed to load platforms:', error);
      }
    };

    loadCategories();
    loadPlatforms();
  }, []);

  // Load courses from API
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setCourses([]);
    loadCourses(1, true);
  }, [selectedCategory, selectedPlatform, searchQuery]);

  const loadCourses = async (pageNum: number = 1, isNewFilter: boolean = false) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/courses?category=${encodeURIComponent(selectedCategory)}&platform=${encodeURIComponent(selectedPlatform)}&search=${encodeURIComponent(searchQuery)}&page=${pageNum}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();

      // Handle different response formats
      // Format 1: { success: true, courses: [...] }
      // Format 2: { success: true, data: { courses: [...] } }
      // Format 3: { success: true, data: [...] }
      let coursesArray: any[] = [];

      if (data.success) {
        if (Array.isArray(data.data)) {
          coursesArray = data.data;
        } else if (data.data && Array.isArray(data.data.courses)) {
          coursesArray = data.data.courses;
        } else if (Array.isArray(data.courses)) {
          coursesArray = data.courses;
        }
      }

      if (coursesArray.length > 0) {
        // Transform API response to match Course interface
        const transformedCourses: Course[] = coursesArray.map((c: any) => ({
          id: c.id,
          slug: c.slug || null,
          title: c.title,
          platform: c.platform || 'Udemy',
          category: c.category,
          instructor: c.instructor,
          rating: c.rating ? parseFloat(c.rating) : null,
          students: c.students,
          duration: c.duration,
          lectures: c.lectures,
          price: parseFloat(c.price) || 50000,
          original_price: c.original_price ? parseFloat(c.original_price) : null,
          thumbnail: c.thumbnail,
          bestseller: c.bestseller || false,
          url: c.course_url || c.url, // Support both course_url and url
          description: c.description
        }));

        if (isNewFilter || pageNum === 1) {
          setCourses(transformedCourses);
        } else {
          setCourses(prev => [...prev, ...transformedCourses]);
        }

        // If we got fewer items than requested, there are no more pages
        if (coursesArray.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }
      } else {
        if (isNewFilter || pageNum === 1) {
          setCourses([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
      toast.error('Không thể tải danh sách khóa học');
      if (isNewFilter || pageNum === 1) {
        setCourses([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadCourses(nextPage, false);
    }
  };

  // Filter and search courses (client-side filtering for search)
  const filteredCourses = useMemo(() => {
    let filtered = courses;

    // Client-side search filtering
    if (searchQuery.trim()) {
      filtered = filtered.filter((course) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          course.title?.toLowerCase().includes(searchLower) ||
          course.instructor?.toLowerCase().includes(searchLower) ||
          course.description?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === "rating") {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return ratingB - ratingA;
      }
      if (sortBy === "popular") {
        const studentsA = a.students || 0;
        const studentsB = b.students || 0;
        return studentsB - studentsA;
      }
      if (sortBy === "newest") {
        return b.id - a.id;
      }
      return 0;
    });
  }, [courses, searchQuery, sortBy]);

  const handleQuickOrder = (courseData?: { url: string; title: string; courseType: 'permanent'; category: string }) => {
    if (!courseData) {
      // Fallback: redirect to homepage with course URL
      toast.error('Không thể thêm khóa học vào giỏ hàng');
      return;
    }

    // Copy URL to clipboard and show toast
    navigator.clipboard.writeText(courseData.url);
    toast.success(`Đã copy link khóa học!`, {
      description: `"${courseData.title}" - Scroll xuống để nhập email và đặt hàng`,
      duration: 5000,
    });

    // Redirect to homepage with course URL and courseType parameter
    setTimeout(() => {
      window.location.href = `/?course=${encodeURIComponent(courseData.url)}&courseType=permanent&category=${encodeURIComponent(courseData.category || '')}`;
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
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Breadcrumb items={[{ name: "Khóa học", url: "/courses" }]} />

        {/* Main Content: Header & Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Khám phá khóa học
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                  Học từ những chuyên gia hàng đầu trên thế giới với chi phí tiết kiệm nhất.
                </p>
              </div>

              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khóa học, giảng viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Category Bar */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-slate-100">
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                <Button
                  variant={selectedCategory === "Tất cả" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedCategory("Tất cả")}
                  className={`rounded-full whitespace-nowrap px-6 transition-all duration-300 ${selectedCategory === "Tất cả"
                    ? "shadow-lg shadow-indigo-200"
                    : "hover:bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                >
                  Tất cả
                </Button>
                {["IT", "Ngoại ngữ", "Thiết kế đồ họa", "Marketing", "Facebook/Tiktok", "Kỹ năng mềm"].map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full whitespace-nowrap px-6 transition-all duration-300 ${selectedCategory === cat
                      ? "shadow-lg shadow-indigo-200"
                      : "hover:bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Additional Filters - Sort only */}
            <div className="flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer shadow-sm min-w-[150px]"
                  >
                    <option value="popular">Phổ biến nhất</option>
                    <option value="rating">Đánh giá cao</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="text-sm font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                <span className="text-slate-900">{filteredCourses.length}</span> kết quả
              </div>
            </div>
          </div>
        </div>

        {/* Courses List Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full mt-2">
          <div className="min-h-[400px]">
            {loading && courses.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 opacity-50">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-50 rounded-2xl h-[400px] animate-pulse border border-slate-100" />
                ))}
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="text-5xl mb-3">🔍</div>
                <h3 className="text-xl font-bold text-slate-900 mb-1.5">Không tìm thấy khóa học</h3>
                <p className="text-sm text-slate-600">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    {...course}
                    originalPrice={course.original_price || course.price}
                    thumbnail={course.thumbnail || 'https://via.placeholder.com/400x225'}
                    category={course.category || ''}
                    instructor={course.instructor || ''}
                    rating={course.rating || 0}
                    students={course.students || 0}
                    duration={course.duration || ''}
                    lectures={course.lectures || 0}
                    isPurchased={purchasedCourseIds.has(course.id)}
                    onAddToCart={handleQuickOrder}
                  />
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredCourses.length > 0 && hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="w-full sm:w-auto min-w-[200px]"
                >
                  {loading ? "Đang tải..." : "Xem thêm khóa học"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
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
