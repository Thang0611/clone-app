"use client";

import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/Button";
import { Spinner } from "./ui/Spinner";
import { Badge } from "./ui/Badge";
import { useCourseAPI } from "@/hooks/useCourseAPI";
import { formatCurrency } from "@/lib/utils";
import type { CourseInfo } from "@/types";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: CourseInfo[];
  isLoading?: boolean;
  email?: string;
}

export default function CourseModal({ 
  isOpen, 
  onClose, 
  courses, 
  isLoading, 
  email 
}: CourseModalProps) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const router = useRouter();
  const { createOrder, createOrderLoading } = useCourseAPI();

  // Payment protection states
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const paymentRequestRef = useRef<boolean>(false);

  // Horizontal scroll state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const successfulCourses = courses.filter(c => c.success);
  const totalAmount = successfulCourses.reduce((sum, course) => sum + (course.price || 2000), 0);

  // Check scroll position for navigation arrows
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    );
  }, []);

  // Horizontal scroll navigation
  const scrollHorizontal = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 300;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  // Handle payment with double-submission prevention
  const handlePayment = async () => {
    // Guard 1: Check if already processing
    if (isPaymentInProgress || paymentRequestRef.current) {
      toast.warning("Đang xử lý đơn hàng, vui lòng đợi...");
      return;
    }

    // Guard 2: Validate data
    if (successfulCourses.length === 0) {
      toast.error("Không có khóa học hợp lệ để thanh toán");
      return;
    }

    if (!email || email.trim() === "") {
      toast.error("Vui lòng nhập email");
      return;
    }

    // Set protection flags IMMEDIATELY
    setIsPaymentInProgress(true);
    paymentRequestRef.current = true;

    // Show loading toast
    const loadingToast = toast.loading("Đang tạo đơn hàng...", {
      description: "Vui lòng không đóng trang này",
    });

    try {
      const orderData = await createOrder({
        email: email.trim(),
        courses: successfulCourses.map(course => ({
          url: course.url || "",
          title: course.title || "Khóa học",
          courseId: course.courseId,
          price: course.price || 2000,
        })),
      });

      // Parse bank info from QR URL if not provided
      let bankInfo = orderData.bankInfo;
      if (!bankInfo && orderData.qrCodeUrl) {
        try {
          const urlMatch = orderData.qrCodeUrl.match(/image\/([^-]+)-(\d+)-/);
          const urlParams = new URLSearchParams(orderData.qrCodeUrl.split('?')[1]);
          if (urlMatch) {
            bankInfo = {
              bankName: urlMatch[1],
              accountNo: urlMatch[2],
              accountName: decodeURIComponent(urlParams.get('accountName') || ''),
            };
          }
        } catch (e) {
          console.error("Error parsing bank info:", e);
        }
      }

      // Prepare full order data
      const fullOrderData = {
        ...orderData,
        bankInfo,
        email: email.trim(),
        items: successfulCourses.map(course => ({
          title: course.title || "Khóa học",
          url: course.url || "",
          price: course.price || 2000,
          courseId: course.courseId,
        })),
        status: "Chưa thanh toán",
        date: new Date().toLocaleDateString("vi-VN"),
      };

      // Store in localStorage as backup
      localStorage.setItem("orderData", JSON.stringify(fullOrderData));

      // Store order data in server-side cache via API
      try {
        await fetch('/api/orders/store', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            orderCode: orderData.orderCode, 
            orderData: fullOrderData 
          }),
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

      // Navigate to order page with clean URL (orderCode only)
      router.push(`/order/${orderData.orderCode}`);
      
    } catch (error: any) {
      const errorMessage = error.message || "Có lỗi xảy ra khi tạo đơn hàng";
      
      toast.error("Không thể tạo đơn hàng", {
        id: loadingToast,
        description: errorMessage,
        action: {
          label: "Thử lại",
          onClick: () => {
            // Reset flags before retry
            setIsPaymentInProgress(false);
            paymentRequestRef.current = false;
            handlePayment();
          },
        },
        duration: 7000,
      });

      // Reset flags on error
      setIsPaymentInProgress(false);
      paymentRequestRef.current = false;
    }
  };

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset payment flags when closing
      setIsPaymentInProgress(false);
      paymentRequestRef.current = false;
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset image errors when courses change
  useEffect(() => {
    setImageErrors(new Set());
    
    // Check scroll position after courses load
    if (courses.length > 0) {
      setTimeout(checkScrollPosition, 100);
    }
  }, [courses, checkScrollPosition]);

  // Check scroll position on resize
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, [isOpen, checkScrollPosition]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
        
        {/* Header - Compact */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex-1 min-w-0 mr-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
              Thông Tin Khóa Học
            </h2>
            {successfulCourses.length > 0 && (
              <p className="text-xs sm:text-sm text-slate-600">
                {successfulCourses.length}/{courses.length} khóa học hợp lệ
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            disabled={isPaymentInProgress}
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50 flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" text="Đang lấy thông tin khóa học..." />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-lg text-slate-600">Không tìm thấy thông tin khóa học</p>
              </div>
            ) : (
              <>
                {/* Horizontal Scrollable Course List */}
                <div className="relative group">
                  {/* Left Scroll Button */}
                  {canScrollLeft && (
                    <button
                      onClick={() => scrollHorizontal('left')}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="w-5 h-5 text-slate-700" />
                    </button>
                  )}

                  {/* Horizontal Scroll Container */}
                  <div
                    ref={scrollContainerRef}
                    onScroll={checkScrollPosition}
                    className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#cbd5e1 #f1f5f9',
                    }}
                  >
                    {courses.map((course, index) => (
                      <div
                        key={index}
                        className={`
                          flex-shrink-0 w-72 sm:w-80 p-4 border-2 rounded-xl transition-all
                          ${course.success
                            ? "border-slate-200 hover:border-indigo-300 hover:shadow-md bg-white"
                            : "border-red-200 bg-red-50"
                          }
                        `}
                      >
                        {/* Compact Image */}
                        <div className="w-full h-32 mb-3 relative rounded-lg overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200">
                          {course.image && !imageErrors.has(index) ? (
                            <Image
                              src={course.image}
                              alt={course.title || "Course"}
                              fill
                              className="object-cover"
                              onError={() => {
                                setImageErrors((prev) => new Set(prev).add(index));
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-8 h-8 text-indigo-600" />
                            </div>
                          )}
                        </div>

                        {/* Compact Info */}
                        <div className="space-y-2">
                          {course.success ? (
                            <>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-bold text-slate-900 line-clamp-2 flex-1">
                                  {course.title || "Khóa học"}
                                </h3>
                                <Badge variant="success" className="flex-shrink-0">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                </Badge>
                              </div>

                              {course.url && (
                                <a
                                  href={course.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-indigo-600 hover:underline block truncate"
                                  title={course.url}
                                >
                                  {course.url}
                                </a>
                              )}

                              <div className="pt-2 border-t border-slate-100">
                                <span className="text-lg font-bold text-green-600">
                                  {formatCurrency(course.price || 2000)}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-bold text-red-600 line-clamp-2 flex-1">
                                  Không thể lấy thông tin
                                </h3>
                                <Badge variant="error" className="flex-shrink-0">Lỗi</Badge>
                              </div>

                              {course.url && (
                                <p className="text-xs text-slate-600 truncate">
                                  {course.url}
                                </p>
                              )}

                              <p className="text-xs text-red-600">
                                {course.message || "Link bị lỗi"}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Scroll Button */}
                  {canScrollRight && (
                    <button
                      onClick={() => scrollHorizontal('right')}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="w-5 h-5 text-slate-700" />
                    </button>
                  )}
                </div>

                {/* Scroll Hint for Mobile */}
                {courses.length > 1 && (
                  <p className="text-xs text-center text-slate-500 mt-3">
                    ← Vuốt để xem thêm khóa học →
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Footer - Payment Section */}
        {successfulCourses.length > 0 && !isLoading && (
          <div className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base sm:text-lg font-semibold text-slate-700">
                Tổng cộng:
              </span>
              <span className="text-xl sm:text-2xl font-bold text-green-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>

            <Button
              onClick={handlePayment}
              loading={isPaymentInProgress || createOrderLoading}
              disabled={isPaymentInProgress || createOrderLoading}
              className="w-full"
              size="lg"
            >
              {isPaymentInProgress || createOrderLoading
                ? "Đang xử lý..."
                : "Thanh toán"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
