"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { Spinner } from "./ui/Spinner";
import { useCoursePayment } from "@/hooks/useCoursePayment";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";
import { CourseModalHeader } from "./course-modal/CourseModalHeader";
import { CourseScrollList } from "./course-modal/CourseScrollList";
import { PaymentFooter } from "./course-modal/PaymentFooter";
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
  const router = useRouter();
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  
  // Payment logic
  const {
    handlePayment,
    resetPaymentState,
    isPaymentInProgress,
    isLoading: paymentLoading,
    successfulCourses,
    totalAmount,
  } = useCoursePayment({
    courses,
    email,
    onSuccess: (orderCode) => {
      // Close modal and navigate to order page
      onClose();
      router.push(`/order/${orderCode}`);
    },
  });

  // Horizontal scroll logic
  const {
    scrollContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollHorizontal,
    checkScrollPosition,
  } = useHorizontalScroll({ enabled: isOpen });

  // Handle image error
  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      // Reset payment flags when closing
      resetPaymentState();
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, resetPaymentState]);

  // Reset image errors when courses change
  useEffect(() => {
    setImageErrors(new Set());
    
    // Check scroll position after courses load
    if (courses.length > 0) {
      setTimeout(checkScrollPosition, 100);
    }
  }, [courses, checkScrollPosition]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300 flex flex-col">
        
        {/* Header */}
        <CourseModalHeader
          successfulCount={successfulCourses.length}
          totalCount={courses.length}
          onClose={onClose}
          disabled={isPaymentInProgress}
        />

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
              <CourseScrollList
                courses={courses}
                imageErrors={imageErrors}
                onImageError={handleImageError}
                scrollContainerRef={scrollContainerRef}
                canScrollLeft={canScrollLeft}
                canScrollRight={canScrollRight}
                onScroll={checkScrollPosition}
                onScrollLeft={() => scrollHorizontal('left')}
                onScrollRight={() => scrollHorizontal('right')}
              />
            )}
          </div>
        </div>

        {/* Footer - Payment Section */}
        {successfulCourses.length > 0 && !isLoading && (
          <PaymentFooter
            totalAmount={totalAmount}
            onPayment={handlePayment}
            isLoading={paymentLoading}
          />
        )}
      </div>
    </div>
  );
}
