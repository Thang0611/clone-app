"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CourseInfo {
  success: boolean;
  url?: string;
  title?: string;
  image?: string;
  price?: number;
  courseId?: number | null;
  message?: string;
}

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: CourseInfo[];
  isLoading?: boolean;
  email?: string;
}

export default function CourseModal({ isOpen, onClose, courses, isLoading, email }: CourseModalProps) {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const router = useRouter();

  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePayment = async () => {
    // Filter only successful courses
    const successfulCourses = courses.filter(c => c.success);
    
    if (successfulCourses.length === 0) return;

    if (!email || email.trim() === "") {
      setPaymentError("Vui lòng nhập email");
      return;
    }

    setIsCreatingOrder(true);
    setPaymentError(null);

    try {
      // Prepare request body
      const requestBody = {
        email: email.trim(),
        courses: successfulCourses.map(course => ({
          url: course.url || "",
          price: course.price || 50000,
          title: course.title || "Khóa học",
        })),
      };

      // Call API to create order
      const response = await fetch("https://api.khoahocgiare.info/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      // Parse bank info from QR URL if needed
      let bankInfo = null;
      if (data.qrCodeUrl) {
        try {
          // Parse QR URL: https://img.vietqr.io/image/TPB-10001874613-compact.png?amount=50000&addInfo=DH953282&accountName=NGUYEN%20HUU%20THANG
          const urlMatch = data.qrCodeUrl.match(/image\/([^-]+)-(\d+)-/);
          const urlParams = new URLSearchParams(data.qrCodeUrl.split('?')[1]);
          if (urlMatch) {
            bankInfo = {
              bankName: urlMatch[1],
              accountNo: urlMatch[2],
              accountName: decodeURIComponent(urlParams.get('accountName') || ''),
            };
          }
        } catch (e) {
          console.error("Error parsing bank info from QR URL:", e);
        }
      }

      // Prepare order data with API response
      // Note: Luôn set paymentStatus là "pending" ban đầu, chờ webhook xác nhận
      const orderData = {
        success: data.success,
        orderId: data.orderId,
        orderCode: data.orderCode,
        totalAmount: data.totalAmount,
        qrCodeUrl: data.qrCodeUrl,
        paymentStatus: "pending", // Luôn là pending khi mới tạo, chờ webhook xác nhận
        bankInfo: bankInfo,
        email: email.trim(),
        items: data.courses || successfulCourses.map(course => ({
          title: course.title || "Khóa học",
          url: course.url || "",
          price: course.price || 50000,
          courseId: course.courseId,
        })),
        status: "Chưa thanh toán", // Luôn là "Chưa thanh toán" ban đầu
        date: new Date().toLocaleDateString("vi-VN"),
      };

      // Store in localStorage as backup
      localStorage.setItem("orderData", JSON.stringify(orderData));

      // Navigate to order page with data
      const encodedData = encodeURIComponent(JSON.stringify(orderData));
      router.push(`/order?data=${encodedData}`);
    } catch (err) {
      console.error("Error creating order:", err);
      setPaymentError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tạo đơn hàng");
      setIsCreatingOrder(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    // Reset image errors when courses change
    setImageErrors(new Set());
  }, [courses]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-slate-900">Check khóa học</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-slate-600">Không tìm thấy thông tin khóa học</p>
            </div>
          ) : (
            <div className="space-y-6">
              {courses.map((course, index) => (
                <div 
                  key={index} 
                  className={`flex gap-6 p-6 border rounded-xl transition-shadow ${
                    course.success 
                      ? "border-slate-200 hover:shadow-md" 
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  {/* Course Image */}
                  <div className="flex-shrink-0">
                    {course.image && !imageErrors.has(index) ? (
                      <div className="w-32 h-32 relative rounded-lg overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
                        <Image
                          src={course.image}
                          alt={course.title || "Course"}
                          width={150}
                          height={150}
                          className="w-full h-full object-cover"
                          onError={() => {
                            setImageErrors((prev) => new Set(prev).add(index));
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                        <svg className="w-16 h-16 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex-1">
                    {course.success ? (
                      <>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                          {course.title || "Khóa học"}
                        </h3>
                        {course.url && (
                          <a 
                            href={course.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:underline mb-4 block"
                          >
                            {course.url}
                          </a>
                        )}
                        
                        {/* Price */}
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-green-600">
                            {course.price ? `${course.price.toLocaleString("vi-VN")} VND` : "50.000 VND"}
                          </span>
                          {course.courseId && (
                            <span className="text-sm text-slate-500">
                              ID: {course.courseId}
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold text-red-600 mb-2">
                          Lỗi: Không thể lấy thông tin
                        </h3>
                        {course.url && (
                          <p className="text-sm text-slate-600 mb-2 break-all">
                            URL: {course.url}
                          </p>
                        )}
                        <p className="text-red-600">
                          {course.message || "Link bị lỗi hoặc cần đăng nhập"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payment Button - Only show if at least one course is successful */}
          {courses.length > 0 && !isLoading && courses.some(c => c.success) && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              {paymentError && (
                <p className="text-sm text-red-600 text-center mb-4">{paymentError}</p>
              )}
              <button 
                onClick={handlePayment}
                disabled={isCreatingOrder}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-bold text-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreatingOrder ? "Đang tạo đơn hàng..." : "Thanh toán"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
