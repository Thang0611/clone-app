"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  ShoppingCart,
  CheckCircle2,
  Shield,
  ArrowLeft
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import Breadcrumb from "@/components/Breadcrumb";
import StructuredData from "@/components/StructuredData";
import { generateCourseSchema } from "@/lib/seo";

// Mock course data - In production, fetch from API
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
    thumbnail: "https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=Web+Development",
    bestseller: true,
    url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
    description: "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps. This course covers everything you need to know to become a professional web developer.",
    curriculum: [
      {
        chapter: "Introduction to Web Development",
        lessons: [
          "What is Web Development?",
          "Setting up your development environment",
          "Introduction to HTML, CSS, and JavaScript"
        ]
      },
      {
        chapter: "HTML Fundamentals",
        lessons: [
          "HTML Structure and Syntax",
          "HTML Elements and Attributes",
          "Forms and Input Types",
          "Semantic HTML"
        ]
      },
      {
        chapter: "CSS Styling",
        lessons: [
          "CSS Basics and Selectors",
          "Box Model and Layout",
          "Flexbox and Grid",
          "Responsive Design"
        ]
      },
      {
        chapter: "JavaScript Fundamentals",
        lessons: [
          "Variables and Data Types",
          "Functions and Scope",
          "DOM Manipulation",
          "Event Handling"
        ]
      },
      {
        chapter: "React Development",
        lessons: [
          "React Components",
          "State and Props",
          "Hooks and Context",
          "Building Real Projects"
        ]
      }
    ]
  },
  // Add more courses as needed
];

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = parseInt(params.id as string);
  const course = COURSES.find(c => c.id === courseId);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Khóa học không tồn tại</h1>
          <Button onClick={() => router.push("/courses")}>Quay lại danh sách</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const toggleChapter = (index: number) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedChapters(newExpanded);
  };

  const handleBuyNow = () => {
    toast.success("Chuyển đến trang thanh toán...");
    // Navigate to order page with course
    router.push(`/order?courseId=${course.id}`);
  };

  const handleAddToCart = () => {
    toast.success("Đã thêm vào giỏ hàng!");
    // Add to cart logic
  };

  // Generate Course Structured Data
  const courseSchema = generateCourseSchema({
    name: course.title,
    description: course.description,
    provider: course.platform,
    image: course.thumbnail,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://getcourses.net'}/courses/${course.id}`,
    price: course.price,
    priceCurrency: 'VND',
    rating: course.rating,
    reviewCount: course.students,
  });

  return (
    <>
      {/* Course Structured Data */}
      <StructuredData data={courseSchema} />
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Breadcrumb */}
        <Breadcrumb items={[
          { name: "Khóa học", url: "/courses" },
          { name: course.category || "Danh mục", url: `/courses?category=${encodeURIComponent(course.category || '')}` },
          { name: course.title, url: `/courses/${course.id}` },
        ]} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Left Column - 70% */}
          <div className="lg:col-span-7 space-y-6">
            {/* Course Thumbnail */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              {course.bestseller && (
                <Badge className="absolute top-4 left-4 bg-amber-500 text-white font-semibold shadow-lg">
                  Bestseller
                </Badge>
              )}
            </div>

            {/* Course Title & Meta */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-slate-900">{course.rating}</span>
                  <span>({formatNumber(course.students)} đánh giá)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{formatNumber(course.students)} học viên</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lectures} bài học</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{course.category}</Badge>
                <Badge variant="secondary">{course.platform}</Badge>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Mô tả khóa học</h2>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {course.description}
                </p>
              </CardBody>
            </Card>

            {/* Curriculum Accordion */}
            {course.curriculum && course.curriculum.length > 0 && (
              <Card>
                <CardBody className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Nội dung khóa học</h2>
                  <div className="space-y-2">
                    {course.curriculum.map((chapter, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleChapter(index)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                      >
                        <span className="font-semibold text-slate-900">
                          {index + 1}. {chapter.chapter}
                        </span>
                        {expandedChapters.has(index) ? (
                          <ChevronUp className="w-5 h-5 text-slate-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-600" />
                        )}
                      </button>
                      {expandedChapters.has(index) && (
                        <div className="p-4 bg-white border-t border-slate-200">
                          <ul className="space-y-2">
                            {chapter.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex} className="flex items-start gap-2 text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                <span>{lesson}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Instructor Info */}
            <Card>
              <CardBody className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Giảng viên</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{course.instructor}</h3>
                    <p className="text-slate-600 text-sm">
                      Giảng viên chuyên nghiệp với nhiều năm kinh nghiệm trong lĩnh vực phát triển web.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Column - Sticky Buy Box - 30% */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <Card className="border-2 border-slate-200 shadow-lg">
                <CardBody className="p-6">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-emerald-600">
                        {formatCurrency(course.price)}
                      </span>
                      <span className="text-lg text-slate-500 line-through">
                        {formatCurrency(course.originalPrice)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">
                      Giảm {Math.round((1 - course.price / course.originalPrice) * 100)}% so với giá gốc
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mb-6">
                    <Button
                      onClick={handleBuyNow}
                      className="w-full"
                      size="lg"
                    >
                      Mua ngay
                    </Button>
                    <Button
                      onClick={handleAddToCart}
                      variant="secondary"
                      className="w-full"
                      size="lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Thêm vào giỏ hàng
                    </Button>
                  </div>

                  {/* Trust Badges */}
                  <div className="space-y-3 pt-6 border-t border-slate-200">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">Bảo hành hoàn tiền</p>
                        <p className="text-xs text-slate-600">Hoàn tiền trong 30 ngày nếu không hài lòng</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">Truy cập trọn đời</p>
                        <p className="text-xs text-slate-600">Học mãi mãi, không giới hạn thời gian</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">Hỗ trợ 24/7</p>
                        <p className="text-xs text-slate-600">Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ</p>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </>
  );
}
