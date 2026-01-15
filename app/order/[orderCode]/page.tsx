"use client";

import { useParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { usePolling } from "@/hooks/usePolling";
import { useOrderData } from "@/hooks/useOrderData";
import { useCheckoutTimer } from "@/hooks/useCheckoutTimer";
import { OrderHeader } from "@/components/order/OrderHeader";
import { CheckoutTimer } from "@/components/order/CheckoutTimer";
import { PaymentSection } from "@/components/order/PaymentSection";
import { OrderItemsList } from "@/components/order/OrderItemsList";
import { SuccessMessage } from "@/components/order/SuccessMessage";

function OrderPageContent() {
  const params = useParams();
  const router = useRouter();
  const orderCode = params.orderCode as string;
  
  // Fetch order data
  const { orderData, isLoading, loadError, updateOrderData } = useOrderData(orderCode);

  // Checkout timer (only when not paid)
  const isNotPaid = orderData?.paymentStatus !== 'paid';
  const { timeRemaining, isExpired: isTimerExpired, getTimerColor } = useCheckoutTimer({
    enabled: isNotPaid && !!orderData,
  });

  // Polling hook with callbacks
  const { status, isPolling, timeRemaining: pollingTimeRemaining } = usePolling(
    orderData?.orderCode || null,
    {
      enabled: isNotPaid,
      onSuccess: () => {
        toast.success("✅ Thanh toán thành công!", {
          description: "Khóa học sẽ được gửi đến email của bạn trong 15-30 phút",
          duration: 10000,
        });
        
        // Update order data
        if (orderData) {
          updateOrderData({
            paymentStatus: 'paid',
            status: 'Đã thanh toán',
          });
        }
      },
      onTimeout: () => {
        toast.error("⏱️ Hết thời gian chờ thanh toán", {
          description: "Nếu bạn đã thanh toán, vui lòng kiểm tra email hoặc liên hệ support",
          duration: 10000,
        });
      },
    }
  );

  const isPaid = status === 'paid' || orderData?.paymentStatus === 'paid';
  const isExpired = pollingTimeRemaining <= 0 && !isPaid;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <Spinner size="lg" text="Đang tải thông tin đơn hàng..." />
              </div>
            </CardBody>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (loadError && !orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {loadError}
                </h2>
                <p className="text-slate-600 mb-6">
                  Vui lòng tạo đơn hàng mới hoặc kiểm tra lại mã đơn hàng
                </p>
                <Button onClick={() => router.push('/')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Về trang chủ
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Không tìm thấy thông tin đơn hàng
                </h2>
                <p className="text-slate-600 mb-6">
                  Vui lòng tạo đơn hàng mới hoặc kiểm tra lại đường link
                </p>
                <Button onClick={() => router.push('/')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Về trang chủ
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Status */}
        <OrderHeader isPaid={isPaid} isExpired={isExpired} isPolling={isPolling} />

        {/* 15-Minute Checkout Countdown Timer */}
        {!isPaid && !isExpired && (
          <CheckoutTimer
            timeRemaining={timeRemaining}
            isExpired={isTimerExpired}
            getTimerColor={getTimerColor}
          />
        )}

        {/* Payment Info Card */}
        {!isPaid && !isExpired && (
          <PaymentSection orderData={orderData} isPolling={isPolling} />
        )}

        {/* Success Message Card */}
        {isPaid && <SuccessMessage orderData={orderData} />}

        {/* Order Details */}
        <OrderItemsList orderData={orderData} />

        {/* Back to Home Button */}
        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => router.push('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Default export with Suspense boundary
export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Spinner size="lg" text="Đang tải thông tin đơn hàng..." />
        </div>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
}
