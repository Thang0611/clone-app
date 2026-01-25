"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
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
  ArrowLeft,
  AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import Breadcrumb from "@/components/Breadcrumb";
import StructuredData from "@/components/StructuredData";
import { generateCourseSchema } from "@/lib/seo";
import { API_BASE_URL } from "@/lib/constants";
import { useCourseAPI } from "@/hooks/useCourseAPI";
import { Input } from "@/components/ui/Input";
import SafeHtml from "@/components/SafeHtml";

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
  course_url?: string;
  description: string | null;
}

interface Lecture {
  id: number;
  lecture_id: string;
  lecture_index: number;
  title: string;
  type: string; // VIDEO_LECTURE, ARTICLE_LECTURE, QUIZ, etc.
  duration_seconds: number;
  is_previewable: boolean;
  // For backward compatibility
  duration?: string | null;
  index?: number;
  description?: string | null;
}

interface Section {
  id: number;
  section_id: string;
  section_index: number;
  title: string;
  lecture_count: number;
  duration_seconds: number;
  lectures: Lecture[];
  // For backward compatibility
  chapter?: string;
  lessons?: string[];
  duration?: string | null;
  index?: number;
}

interface CurriculumResponse {
  success: boolean;
  curriculum: {
    total_sections: number;
    total_lectures: number;
    total_duration_seconds: number;
    sections: Section[];
  };
}

interface CurriculumChapter {
  chapter: string;
  lessons: string[];
  // New format support
  sections?: Section[];
  title?: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [curriculum, setCurriculum] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [curriculumLoading, setCurriculumLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [email, setEmail] = useState("");
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  
  const { createOrder } = useCourseAPI();

  // Helper functions
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds || seconds === 0) return '';
    
    // Làm tròn lên đến phút (round up to nearest minute)
    const totalMinutes = Math.ceil(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    // Format: "1h 29min" hoặc "45min"
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}min`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}min`;
    }
  };

  // Fetch course detail
  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        // Call through Next.js API route (which proxies to backend)
        const response = await fetch(`/api/courses/${courseId}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        
        // Handle different response formats
        let courseData: any = null;
        if (data.success) {
          if (data.data) {
            courseData = data.data;
          } else if (data.course) {
            courseData = data.course;
          } else {
            courseData = data;
          }
        }
        
        if (courseData) {
          // Transform API response to match Course interface
          const transformedCourse: Course = {
            id: courseData.id,
            slug: courseData.slug || null,
            title: courseData.title,
            platform: courseData.platform || 'Udemy',
            category: courseData.category,
            instructor: courseData.instructor,
            rating: courseData.rating ? parseFloat(courseData.rating) : null,
            students: courseData.students,
            duration: courseData.duration,
            lectures: courseData.lectures,
            price: parseFloat(courseData.price) || 50000,
            original_price: courseData.original_price ? parseFloat(courseData.original_price) : null,
            thumbnail: courseData.thumbnail,
            bestseller: courseData.bestseller || false,
            url: courseData.course_url || courseData.url || '',
            description: courseData.description
          };
          setCourse(transformedCourse);
        } else {
          setError('Khóa học không tồn tại');
        }
      } catch (err) {
        console.error('Failed to fetch course:', err);
        setError('Không thể tải thông tin khóa học');
        toast.error('Không thể tải thông tin khóa học');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  // Fetch curriculum
  useEffect(() => {
    const fetchCurriculum = async () => {
      if (!courseId) return;
      
      setCurriculumLoading(true);
      try {
        const response = await fetch(`/api/courses/${courseId}/curriculum`);
        const data = await response.json();
        
        console.log('[Curriculum] Raw API response:', data);
        console.log('[Curriculum] data.success:', data.success);
        console.log('[Curriculum] data.curriculum:', data.curriculum);
        console.log('[Curriculum] data.curriculum?.sections:', data.curriculum?.sections);
        
        // Handle API response format: { success: true, curriculum: { sections: [...] } }
        let curriculumData: Section[] = [];
        
        // Check if data has curriculum with sections
        if (data.success && data.curriculum && data.curriculum.sections) {
          // New API format: data.curriculum.sections
          if (Array.isArray(data.curriculum.sections)) {
            console.log('[Curriculum] Found sections array with length:', data.curriculum.sections.length);
            curriculumData = data.curriculum.sections.map((section: any) => ({
              id: section.id,
              section_id: section.section_id,
              section_index: section.section_index,
              title: section.title,
              lecture_count: section.lecture_count,
              duration_seconds: section.duration_seconds,
              lectures: (section.lectures || []).map((lecture: any) => ({
                id: lecture.id,
                lecture_id: lecture.lecture_id,
                lecture_index: lecture.lecture_index,
                title: lecture.title,
                type: lecture.type,
                duration_seconds: lecture.duration_seconds,
                is_previewable: lecture.is_previewable || false,
                // Format duration for display
                duration: formatDuration(lecture.duration_seconds),
                index: lecture.lecture_index
              }))
            }));
            console.log('[Curriculum] Parsed curriculum data:', curriculumData);
            console.log('[Curriculum] First section sample:', curriculumData[0]);
          } else {
            console.warn('[Curriculum] data.curriculum.sections is not an array:', data.curriculum.sections);
          }
        } else {
          console.warn('[Curriculum] Missing data.curriculum or data.success is false');
          console.warn('[Curriculum] data structure:', {
            success: data.success,
            hasCurriculum: !!data.curriculum,
            curriculumKeys: data.curriculum ? Object.keys(data.curriculum) : []
          });
          
          // Fallback: try to find sections in different locations
          if (data.success) {
            let rawSections: any[] = [];
            
            if (Array.isArray(data.data)) {
              rawSections = data.data;
            } else if (data.data && Array.isArray(data.data.sections)) {
              rawSections = data.data.sections;
            } else if (data.data && Array.isArray(data.data.curriculum)) {
              rawSections = data.data.curriculum;
            } else if (Array.isArray(data.sections)) {
              rawSections = data.sections;
            } else if (Array.isArray(data.curriculum)) {
              rawSections = data.curriculum;
            }
            
            // Transform to Section format
            if (rawSections.length > 0) {
              curriculumData = rawSections.map((item: any, index: number) => {
                // Handle old format: { chapter: string, lessons: string[] }
                if (item.chapter && item.lessons) {
                  return {
                    id: item.id || index + 1,
                    section_id: String(item.id || index + 1),
                    section_index: index + 1,
                    title: item.chapter,
                    lecture_count: item.lessons.length,
                    duration_seconds: 0,
                    lectures: item.lessons.map((lesson: string, idx: number) => ({
                      id: idx + 1,
                      lecture_id: String(idx + 1),
                      lecture_index: idx + 1,
                      title: lesson,
                      type: 'VIDEO_LECTURE',
                      duration_seconds: 0,
                      is_previewable: false,
                      duration: null,
                      index: idx + 1
                    }))
                  };
                }
                
                // Handle section with lectures
                return {
                  id: item.id || index + 1,
                  section_id: item.section_id || String(item.id || index + 1),
                  section_index: item.section_index || index + 1,
                  title: item.title || item.section_title || item.chapter || `Section ${index + 1}`,
                  lecture_count: item.lecture_count || item.lectures?.length || 0,
                  duration_seconds: item.duration_seconds || 0,
                  lectures: (item.lectures || []).map((lecture: any, idx: number) => ({
                    id: lecture.id || idx + 1,
                    lecture_id: lecture.lecture_id || String(lecture.id || idx + 1),
                    lecture_index: lecture.lecture_index || idx + 1,
                    title: typeof lecture === 'string' ? lecture : (lecture.title || 'Lecture'),
                    type: lecture.type || 'VIDEO_LECTURE',
                    duration_seconds: lecture.duration_seconds || 0,
                    is_previewable: lecture.is_previewable || false,
                    duration: lecture.duration || formatDuration(lecture.duration_seconds || 0),
                    index: lecture.lecture_index || lecture.index || idx + 1
                  }))
                };
              });
            }
          }
        }
        
        console.log('[Curriculum] Final curriculum data to set:', curriculumData);
        console.log('[Curriculum] Number of sections:', curriculumData.length);
        console.log('[Curriculum] First section sample:', curriculumData[0]);
        
        if (curriculumData.length === 0) {
          console.warn('[Curriculum] WARNING: No curriculum data parsed!');
          console.warn('[Curriculum] Data structure:', JSON.stringify(data, null, 2));
        }
        
        setCurriculum(curriculumData);
      } catch (err) {
        console.error('Failed to fetch curriculum:', err);
        // Curriculum is optional, don't show error
        setCurriculum([]);
      } finally {
        setCurriculumLoading(false);
      }
    };

    if (courseId) {
      fetchCurriculum();
    }
  }, [courseId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <div className="text-center">
              <Spinner size="lg" text="Đang tải thông tin khóa học..." />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {error || 'Khóa học không tồn tại'}
          </h1>
          <Button onClick={() => router.push("/courses")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const expandAllSections = () => {
    const allIndices = new Set(curriculum.map((_, index) => index));
    setExpandedSections(allIndices);
  };

  const collapseAllSections = () => {
    setExpandedSections(new Set());
  };

  const handleBuyNow = async () => {
    // Validate email
    if (!email || email.trim() === "") {
      toast.error("Vui lòng nhập email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Validate course data
    if (!course.url) {
      toast.error("Không thể lấy thông tin khóa học");
      return;
    }

    // Prevent double submission
    if (isCreatingOrder) {
      toast.warning("Đang xử lý đơn hàng, vui lòng đợi...");
      return;
    }

    setIsCreatingOrder(true);
    const loadingToast = toast.loading("Đang tạo đơn hàng...", {
      description: "Vui lòng không đóng trang này",
    });

    try {
      // Create order with courseType='permanent'
      const orderData = await createOrder({
        email: email.trim(),
        courses: [{
          url: course.url,
          title: course.title || "Khóa học",
          courseId: course.id,
          price: course.price || 50000,
          courseType: 'permanent',
          category: course.category || null,
        }],
      });

      // Parse bank info from QR URL if not provided
      const parseBankInfoFromQR = (qrCodeUrl: string) => {
        try {
          const urlMatch = qrCodeUrl.match(/image\/([^-]+)-(\d+)-/);
          const urlParams = new URLSearchParams(qrCodeUrl.split('?')[1]);
          if (urlMatch) {
            return {
              bankName: urlMatch[1],
              accountNo: urlMatch[2],
              accountName: decodeURIComponent(urlParams.get('accountName') || ''),
            };
          }
        } catch (e) {
          console.error("Error parsing bank info:", e);
        }
        return null;
      };

      const bankInfo = orderData.bankInfo 
        ? orderData.bankInfo 
        : orderData.qrCodeUrl 
          ? parseBankInfoFromQR(orderData.qrCodeUrl)
          : null;

      // Prepare full order data with all required fields
      const fullOrderData = {
        ...orderData,
        bankInfo: bankInfo || orderData.bankInfo || null,
        email: email.trim(),
        items: [{
          title: course.title || "Khóa học",
          url: course.url,
          price: course.price || 50000,
          courseId: course.id,
        }],
        status: "Chưa thanh toán",
        date: new Date().toLocaleDateString("vi-VN"),
      };

      // Store order data in localStorage and server cache
      localStorage.setItem("orderData", JSON.stringify(fullOrderData));

      // Store order data in server-side cache via API
      try {
        await fetch('/api/orders/store', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderCode: orderData.orderCode, orderData: fullOrderData }),
        });
      } catch (err) {
        console.error('Failed to cache order on server:', err);
        // Non-critical, continue anyway
      }

      // Success toast
      toast.success("Tạo đơn hàng thành công!", {
        id: loadingToast,
        description: `Mã đơn hàng: ${orderData.orderCode}`,
        duration: 5000,
      });

      // Navigate to payment page
      router.push(`/order/${orderData.orderCode}`);
    } catch (error: any) {
      const errorMessage = error.message || "Có lỗi xảy ra khi tạo đơn hàng";
      toast.error("Không thể tạo đơn hàng", {
        id: loadingToast,
        description: errorMessage,
        duration: 7000,
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // Generate Course Structured Data
  const courseSchema = course ? generateCourseSchema({
    name: course.title,
    description: course.description || '',
    provider: course.platform,
    image: course.thumbnail || '',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://getcourses.net'}/courses/${course.slug || course.id}`,
    price: course.price,
    priceCurrency: 'VND',
    rating: course.rating || 0,
    reviewCount: course.students || 0,
  }) : null;

  return (
    <>
      {/* Course Structured Data */}
      {courseSchema && <StructuredData data={courseSchema} />}
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Breadcrumb */}
        <Breadcrumb items={[
          { name: "Khóa học", url: "/courses" },
          { name: course.category || "Danh mục", url: `/courses?category=${encodeURIComponent(course.category || '')}` },
          { name: course.title, url: `/courses/${course.slug || course.id}` },
        ]} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:grid lg:grid-cols-10 gap-8">
          {/* Left Column - 70% */}
          <div className="lg:col-span-7 space-y-6">
            {/* Course Thumbnail */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={course.thumbnail || 'https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=Course+Image'}
                alt={course.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=Course+Image';
                }}
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
                {course.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-semibold text-slate-900">{course.rating}</span>
                    {course.students && (
                  <span>({formatNumber(course.students)} đánh giá)</span>
                    )}
                </div>
                )}
                {course.students && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{formatNumber(course.students)} học viên</span>
                </div>
                )}
                {course.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                )}
                {course.lectures && (
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lectures} bài học</span>
                </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {course.category && (
                <Badge variant="secondary">{course.category}</Badge>
                )}
                <Badge variant="secondary">{course.platform}</Badge>
              </div>
            </div>

            {/* Description */}
            {course.description && (
              <Card>
                <CardBody className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">Mô tả khóa học</h2>
                  <div className="relative">
                    <div 
                      className={`text-slate-600 leading-relaxed ${
                        !descriptionExpanded ? 'line-clamp-5' : ''
                      }`}
                    >
                      <SafeHtml 
                        html={course.description}
                        className="[&_p]:mb-3 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_li]:mb-1 [&_a]:text-primary-600 [&_a]:underline"
                      />
                    </div>
                    {/* Show button if description is longer than ~4-5 lines (approximately 300-400 characters) */}
                    {(course.description.length > 300 || course.description.split('\n').length > 5) && (
                      <button
                        onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                        className="mt-3 text-primary-600 hover:text-primary-700 font-semibold text-sm flex items-center gap-1 transition-colors"
                      >
                        {descriptionExpanded ? (
                          <>
                            Thu gọn
                            <ChevronUp className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            Xem thêm
                            <ChevronDown className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Payment Box - Mobile Only - Order 3 */}
            <div className="lg:hidden order-3">
              <Card className="border-2 border-slate-200 shadow-lg">
                <CardBody className="p-6">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-emerald-600">
                        {formatCurrency(course.price)}
                      </span>
                      {course.original_price && course.original_price > course.price && (
                        <>
                          <span className="text-lg text-slate-500 line-through">
                            {formatCurrency(course.original_price)}
                          </span>
                          <p className="text-sm text-slate-600">
                            Giảm {Math.round((1 - course.price / course.original_price) * 100)}% so với giá gốc
                          </p>
                        </>
                      )}
                    </div>
                    {(!course.original_price || course.original_price <= course.price) && (
                      <p className="text-sm text-slate-600">
                        Giá tốt nhất thị trường
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="mb-6">
                    <label htmlFor="email-mobile" className="block text-sm font-semibold text-slate-900 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email-mobile"
                      type="email"
                      placeholder="Nhập email của bạn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Action Button */}
                  <div className="mb-6">
                    <Button
                      onClick={handleBuyNow}
                      className="w-full"
                      size="lg"
                      disabled={isCreatingOrder}
                    >
                      {isCreatingOrder ? "Đang tạo đơn hàng..." : "Mua ngay"}
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
                        <p className="text-xs text-slate-600">Lưu Driver vô thời hạn</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">Truy cập linh hoạt</p>
                        <p className="text-xs text-slate-600">Học mọi lúc mọi nơi</p>
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

            {/* Curriculum Accordion - Order 4 on mobile */}
            {curriculumLoading ? (
              <Card className="order-4 lg:order-none">
                <CardBody className="p-6">
                  <div className="text-center py-8">
                    <Spinner size="md" text="Đang tải nội dung khóa học..." />
                  </div>
                </CardBody>
              </Card>
            ) : curriculum && curriculum.length > 0 ? (
              <Card className="order-4 lg:order-none">
                <CardBody className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-1">Nội dung khóa học</h2>
                      <p className="text-sm text-slate-600">
                    {curriculum.length} {curriculum.length === 1 ? 'phần' : 'phần'} • {' '}
                    {curriculum.reduce((total, section) => total + section.lecture_count, 0)} bài học • {' '}
                    {formatDuration(curriculum.reduce((total, section) => total + section.duration_seconds, 0))} tổng thời lượng
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={expandAllSections}
                        className="text-xs"
                      >
                        Mở tất cả
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={collapseAllSections}
                        className="text-xs"
                      >
                        Đóng tất cả
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {curriculum.map((section, index) => {
                      const lectureCount = section.lecture_count || section.lectures?.length || 0;
                      const isExpanded = expandedSections.has(index);
                      
                      return (
                        <div key={section.id || index} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                          <button
                            onClick={() => toggleSection(index)}
                            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 hover:to-slate-50 transition-colors text-left"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                                  Phần {section.section_index || section.index || index + 1}
                                </span>
                                <span className="font-semibold text-slate-900 text-base">
                                  {section.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-slate-600">
                                {lectureCount > 0 && (
                                  <span className="flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    {lectureCount} {lectureCount === 1 ? 'bài học' : 'bài học'}
                                  </span>
                                )}
                                {section.duration_seconds > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDuration(section.duration_seconds)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="ml-4 flex-shrink-0">
                              {isExpanded ? (
                                <ChevronUp className="w-5 h-5 text-slate-600" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-slate-600" />
                              )}
                            </div>
                          </button>
                          {isExpanded && section.lectures && section.lectures.length > 0 && (
                            <div className="p-4 bg-slate-50 border-t border-slate-200">
                              <div className="space-y-2">
                                {section.lectures.map((lecture, lectureIndex) => (
                                  <div
                                    key={lecture.id || lectureIndex}
                                    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors"
                                  >
                                    <div className="flex-shrink-0 mt-0.5">
                                      {lecture.type === 'QUIZ' || lecture.type?.includes('QUIZ') ? (
                                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
                                          <span className="text-xs font-bold text-amber-700">Q</span>
                                        </div>
                                      ) : lecture.type === 'ARTICLE_LECTURE' || lecture.type?.includes('ARTICLE') ? (
                                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                          <span className="text-xs font-bold text-blue-700">A</span>
                                        </div>
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                          <p className="font-medium text-slate-900 text-sm mb-1">
                                            {lecture.lecture_index && `${lecture.lecture_index}. `}
                                            {lecture.title}
                                          </p>
                                          {lecture.description && (
                                            <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                                              {lecture.description}
                                            </p>
                                          )}
                                        </div>
                                        {lecture.duration_seconds > 0 && (
                                          <span className="text-xs text-slate-500 flex-shrink-0 ml-2 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDuration(lecture.duration_seconds)}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {isExpanded && (!section.lectures || section.lectures.length === 0) && (
                            <div className="p-4 bg-slate-50 border-t border-slate-200">
                              <p className="text-sm text-slate-500 italic">Chưa có bài học trong phần này</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>
            ) : !curriculumLoading && curriculum.length === 0 ? (
              <Card className="order-4 lg:order-none">
                <CardBody className="p-6">
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600">Nội dung khóa học chưa có sẵn</p>
                    <p className="text-xs text-slate-400 mt-2">Debug: curriculum.length = {curriculum.length}</p>
                  </div>
                </CardBody>
              </Card>
            ) : null}

            {/* Instructor Info - Order 2 on mobile */}
            {course.instructor && (
              <Card className="order-2 lg:order-none">
              <CardBody className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Giảng viên</h2>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                      {course.instructor.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{course.instructor}</h3>
                    <p className="text-slate-600 text-sm">
                        Giảng viên chuyên nghiệp với nhiều năm kinh nghiệm.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
            )}
          </div>

          {/* Right Column - Sticky Buy Box - 30% - Desktop Only */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <Card className="border-2 border-slate-200 shadow-lg">
                <CardBody className="p-6">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-emerald-600">
                        {formatCurrency(course.price)}
                      </span>
                      {course.original_price && course.original_price > course.price && (
                        <>
                      <span className="text-lg text-slate-500 line-through">
                            {formatCurrency(course.original_price)}
                      </span>
                          <p className="text-sm text-slate-600">
                            Giảm {Math.round((1 - course.price / course.original_price) * 100)}% so với giá gốc
                          </p>
                        </>
                      )}
                    </div>
                    {(!course.original_price || course.original_price <= course.price) && (
                    <p className="text-sm text-slate-600">
                        Giá tốt nhất thị trường
                    </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="mb-6">
                    <label htmlFor="email-desktop" className="block text-sm font-semibold text-slate-900 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="email-desktop"
                      type="email"
                      placeholder="Nhập email của bạn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      required
                    />
                  </div>

                  {/* Action Button */}
                  <div className="mb-6">
                    <Button
                      onClick={handleBuyNow}
                      className="w-full"
                      size="lg"
                      disabled={isCreatingOrder}
                    >
                      {isCreatingOrder ? "Đang tạo đơn hàng..." : "Mua ngay"}
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
                        <p className="text-xs text-slate-600">Lưu Driver vô thời hạn</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">Truy cập linh hoạt</p>
                        <p className="text-xs text-slate-600">Học mọi lúc mọi nơi</p>
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
