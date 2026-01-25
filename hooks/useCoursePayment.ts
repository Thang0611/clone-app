import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCourseAPI } from './useCourseAPI';
// import { useTracking } from './useTracking'; // ❌ REMOVED: Không track purchase khi tạo order
import type { CourseInfo, OrderData } from '@/types';

interface UseCoursePaymentProps {
  courses: CourseInfo[];
  email?: string;
  onSuccess?: (orderCode: string) => void;
}

interface BankInfo {
  bankName: string;
  accountNo: string;
  accountName: string;
}

export function useCoursePayment({ courses, email, onSuccess }: UseCoursePaymentProps) {
  const router = useRouter();
  const { createOrder, createOrderLoading } = useCourseAPI();
  // const { trackPurchase } = useTracking(); // ❌ REMOVED: Không track purchase khi tạo order
  const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);
  const paymentRequestRef = useRef<boolean>(false);

  const successfulCourses = courses.filter(c => c.success);
  const totalAmount = successfulCourses.reduce((sum, course) => sum + (course.price || 2000), 0);

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
        price: course.price || 2000,
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
    // Store in localStorage as backup
    localStorage.setItem("orderData", JSON.stringify(orderData));

    // Store order data in server-side cache via API
    try {
      await fetch('/api/orders/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode, orderData }),
      });
    } catch (err) {
      console.error('Failed to cache order on server:', err);
      // Non-critical, continue anyway
    }
  };

  /**
   * Handle payment with double-submission prevention
   */
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
      // Create order
      const orderData = await createOrder({
        email: email.trim(),
        courses: successfulCourses.map(course => ({
          url: course.url || "",
          title: course.title || "Khóa học",
          courseId: course.courseId,
          price: course.price || 2000,
          courseType: course.courseType || 'temporary', // Pass courseType
          category: course.category || null, // Pass category
        })),
      });

      // Parse bank info from QR URL if not provided
      const bankInfo = orderData.bankInfo 
        ? null 
        : orderData.qrCodeUrl 
          ? parseBankInfoFromQR(orderData.qrCodeUrl)
          : null;

      // Prepare full order data
      const fullOrderData = prepareOrderData(orderData, bankInfo);

      // Store order data
      await storeOrderData(orderData.orderCode, fullOrderData);

      // ❌ REMOVED: Track purchase khi tạo order (chưa có tiền)
      // ✅ Purchase event sẽ được track khi payment confirmed
      // Xem: app/order/[orderCode]/page.tsx (usePolling.onSuccess)
      // 
      // Lý do remove:
      // - Purchase event chỉ nên track khi ĐÃ NHẬN ĐƯỢC TIỀN
      // - Khi tạo order, payment status = 'pending' → chưa có tiền
      // - Tracking ở đây sẽ gây duplicate và sai số conversion
      // 
      // Flow đúng:
      // 1. User tạo order → (Không track Purchase)
      // 2. User thanh toán → Backend update status = 'paid'
      // 3. Polling detect status = 'paid' → Track Purchase (app/order/[orderCode]/page.tsx)

      // Success toast
      toast.success("Tạo đơn hàng thành công!", {
        id: loadingToast,
        description: `Mã đơn hàng: ${orderData.orderCode}`,
        duration: 5000,
      });

      // Reset payment flags before navigation
      setIsPaymentInProgress(false);
      paymentRequestRef.current = false;

      // Call success callback or navigate
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

  /**
   * Reset payment state
   */
  const resetPaymentState = () => {
    setIsPaymentInProgress(false);
    paymentRequestRef.current = false;
  };

  return {
    handlePayment,
    resetPaymentState,
    isPaymentInProgress,
    isLoading: isPaymentInProgress || createOrderLoading,
    successfulCourses,
    totalAmount,
  };
}
