import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useCourseAPI } from './useCourseAPI';
import {
  REGULAR_PRICE_PER_COURSE,
  REGULAR_PRICE_COMBO_5,
  REGULAR_PRICE_COMBO_10,
  PREMIUM_PRICE
} from '@/lib/constants';
import type { CourseInfo, OrderData } from '@/types';

interface UseCoursePaymentProps {
  courses: CourseInfo[];
  email?: string;
  onSuccess?: (orderCode: string) => void;
  onRequireLogin?: () => void; // Callback when login is required before payment
}

interface BankInfo {
  bankName: string;
  accountNo: string;
  accountName: string;
}

type PaymentType = 'regular' | 'premium';

/**
 * Calculate regular pricing with combo discounts
 */
const calculateRegularPrice = (courseCount: number): number => {
  if (courseCount <= 0) return 0;
  if (courseCount === 10) return REGULAR_PRICE_COMBO_10;
  if (courseCount >= 5) return REGULAR_PRICE_COMBO_5;
  return courseCount * REGULAR_PRICE_PER_COURSE;
};

export function useCoursePayment({ courses, email, onSuccess, onRequireLogin }: UseCoursePaymentProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { createOrder, createOrderLoading, createOrderAllCourses, createOrderAllCoursesLoading } = useCourseAPI();
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const [loadingType, setLoadingType] = useState<PaymentType | null>(null);
  const paymentRequestRef = useRef<boolean>(false);

  // Get backend user ID from session
  const backendUserId = (session?.user as any)?.backendUserId as number | null;
  const isLoggedIn = !!session?.user;

  const successfulCourses = courses.filter(c => c.success);
  const courseCount = successfulCourses.length;

  // Calculate both pricing options
  const regularAmount = calculateRegularPrice(courseCount);
  const premiumAmount = PREMIUM_PRICE;

  /**
   * Parse bank info from QR code URL
   */
  const parseBankInfoFromQR = (qrCodeUrl: string): BankInfo | null => {
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

  /**
   * Prepare full order data with all required fields
   */
  const prepareOrderData = (orderData: OrderData, bankInfo: BankInfo | null): OrderData => {
    return {
      ...orderData,
      bankInfo: bankInfo || orderData.bankInfo,
      email: email?.trim() || '',
      items: successfulCourses.map(course => ({
        title: course.title || "Khóa học",
        url: course.url || "",
        price: course.price || REGULAR_PRICE_PER_COURSE,
        courseId: course.courseId,
      })),
      status: "Chưa thanh toán",
      date: new Date().toLocaleDateString("vi-VN"),
    };
  };

  /**
   * Store order data in localStorage and server cache
   */
  const storeOrderData = async (orderCode: string, orderData: OrderData) => {
    localStorage.setItem("orderData", JSON.stringify(orderData));

    try {
      await fetch('/api/orders/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode, orderData }),
      });
    } catch (err) {
      console.error('Failed to cache order on server:', err);
    }
  };

  /**
   * Handle payment with type selection
   */
  const handlePayment = async (type: PaymentType) => {
    if (isPaymentInProgress || paymentRequestRef.current) {
      toast.warning("Đang xử lý đơn hàng, vui lòng đợi...");
      return;
    }

    // Check login requirement
    if (!isLoggedIn) {
      if (onRequireLogin) {
        onRequireLogin();
      } else {
        toast.error("Vui lòng đăng nhập để tiếp tục");
      }
      return;
    }

    if (successfulCourses.length === 0) {
      toast.error("Không có khóa học hợp lệ để thanh toán");
      return;
    }

    const orderEmail = email?.trim() || session?.user?.email || '';
    if (!orderEmail) {
      toast.error("Không tìm thấy email");
      return;
    }

    setIsPaymentInProgress(true);
    setLoadingType(type);
    paymentRequestRef.current = true;

    const loadingToast = toast.loading(
      type === 'premium' ? "Đang tạo đơn Premium..." : "Đang tạo đơn hàng...",
      { description: "Vui lòng không đóng trang này" }
    );

    try {
      // Use appropriate API based on payment type
      // Include backendUserId to link order to authenticated user
      const orderData = type === 'premium'
        ? await createOrderAllCourses({
          email: orderEmail,
          userId: backendUserId,
          courses: successfulCourses.map(course => ({
            url: course.url || "",
            title: course.title || "Khóa học",
            courseId: course.courseId,
            price: course.price || REGULAR_PRICE_PER_COURSE,
            courseType: course.courseType || 'temporary',
            category: course.category || null,
          })),
        })
        : await createOrder({
          email: orderEmail,
          userId: backendUserId,
          courses: successfulCourses.map(course => ({
            url: course.url || "",
            title: course.title || "Khóa học",
            courseId: course.courseId,
            price: course.price || REGULAR_PRICE_PER_COURSE,
            courseType: course.courseType || 'temporary',
            category: course.category || null,
          })),
        });

      const bankInfo = orderData.bankInfo
        ? null
        : orderData.qrCodeUrl
          ? parseBankInfoFromQR(orderData.qrCodeUrl)
          : null;

      const fullOrderData = prepareOrderData(orderData, bankInfo);
      await storeOrderData(orderData.orderCode, fullOrderData);

      toast.success(
        type === 'premium' ? "Tạo đơn Premium thành công!" : "Tạo đơn hàng thành công!",
        {
          id: loadingToast,
          description: `Mã đơn hàng: ${orderData.orderCode}`,
          duration: 5000,
        }
      );

      setIsPaymentInProgress(false);
      setLoadingType(null);
      paymentRequestRef.current = false;

      if (onSuccess) {
        onSuccess(orderData.orderCode);
      } else {
        router.push(`/order/${orderData.orderCode}`);
      }

    } catch (error: any) {
      const errorMessage = error.message || "Có lỗi xảy ra khi tạo đơn hàng";

      toast.error("Không thể tạo đơn hàng", {
        id: loadingToast,
        description: errorMessage,
        action: {
          label: "Thử lại",
          onClick: () => {
            setIsPaymentInProgress(false);
            setLoadingType(null);
            paymentRequestRef.current = false;
            handlePayment(type);
          },
        },
        duration: 7000,
      });

      setIsPaymentInProgress(false);
      setLoadingType(null);
      paymentRequestRef.current = false;
    }
  };

  const handlePaymentRegular = () => handlePayment('regular');
  const handlePaymentPremium = () => handlePayment('premium');

  const resetPaymentState = () => {
    setIsPaymentInProgress(false);
    setLoadingType(null);
    paymentRequestRef.current = false;
  };

  return {
    handlePaymentRegular,
    handlePaymentPremium,
    resetPaymentState,
    isPaymentInProgress,
    isLoading: isPaymentInProgress || createOrderLoading || createOrderAllCoursesLoading,
    loadingType,
    successfulCourses,
    courseCount,
    regularAmount,
    premiumAmount,
  };
}
