"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Clock, 
  Copy, 
  QrCode,
  AlertCircle,
  ArrowLeft 
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { usePolling } from "@/hooks/usePolling";
import { formatCurrency, formatTimeRemaining, copyToClipboard } from "@/lib/utils";
import { apiClient } from "@/lib/api";
import type { OrderData } from "@/types";

function OrderPageContent() {
  const params = useParams();
  const router = useRouter();
  const orderCode = params.orderCode as string;
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // 15-minute checkout countdown timer (constant outside component would be better, but keeping it here for clarity)
  const CHECKOUT_TIMER_DURATION = 900; // 15 minutes in seconds
  const [checkoutTimeRemaining, setCheckoutTimeRemaining] = useState(CHECKOUT_TIMER_DURATION);
  const [isCheckoutExpired, setIsCheckoutExpired] = useState(false);
  const checkoutTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch order data from API
  useEffect(() => {
    async function fetchOrderData() {
      if (!orderCode) {
        setLoadError('Mã đơn hàng không hợp lệ');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);
        
        const response = await apiClient.getOrderByCode(orderCode);
        
        if (response.success && response.order) {
          setOrderData(response.order);
        } else {
          setLoadError('Không tìm thấy đơn hàng');
        }
      } catch (error: any) {
        console.error('Error fetching order:', error);
        const errorMessage = error instanceof Error ? error.message : 'Không thể tải thông tin đơn hàng';
        setLoadError(errorMessage);
        
        // Fallback: Try localStorage
        const stored = localStorage.getItem("orderData");
        if (stored) {
          try {
            const parsedOrder = JSON.parse(stored);
            if (parsedOrder.orderCode === orderCode) {
              setOrderData(parsedOrder);
              setLoadError(null);
              toast.info('Đang hiển thị dữ liệu từ cache local');
            }
          } catch (err) {
            console.error('Error parsing stored order:', err);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderData();
  }, [orderCode]);

  // Start 15-minute checkout countdown timer when order data is loaded
  useEffect(() => {
    if (!orderData || orderData.paymentStatus === 'paid') {
      // Stop timer if payment is successful
      if (checkoutTimerRef.current) {
        clearInterval(checkoutTimerRef.current);
        checkoutTimerRef.current = null;
      }
      return;
    }

    // Reset timer
    setCheckoutTimeRemaining(CHECKOUT_TIMER_DURATION);
    setIsCheckoutExpired(false);

    // Start countdown
    checkoutTimerRef.current = setInterval(() => {
      setCheckoutTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsCheckoutExpired(true);
          if (checkoutTimerRef.current) {
            clearInterval(checkoutTimerRef.current);
            checkoutTimerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup
    return () => {
      if (checkoutTimerRef.current) {
        clearInterval(checkoutTimerRef.current);
        checkoutTimerRef.current = null;
      }
    };
  }, [orderData]);

  // Polling hook with callbacks
  const { status, isPolling, timeRemaining } = usePolling(
    orderData?.orderCode || null,
    {
      enabled: orderData?.paymentStatus !== 'paid',
      onSuccess: () => {
        toast.success("✅ Thanh toán thành công!", {
          description: "Khóa học sẽ được gửi đến email của bạn trong 15-30 phút",
          duration: 10000,
        });
        
        // Update order data
        if (orderData) {
          const updatedData = {
            ...orderData,
            paymentStatus: 'paid' as const,
            status: 'Đã thanh toán',
          };
          setOrderData(updatedData);
          localStorage.setItem("orderData", JSON.stringify(updatedData));
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
  const isExpired = timeRemaining <= 0 && !isPaid;
  
  // Stop checkout timer when payment is successful
  useEffect(() => {
    if (isPaid && checkoutTimerRef.current) {
      clearInterval(checkoutTimerRef.current);
      checkoutTimerRef.current = null;
    }
  }, [isPaid]);
  
  // Get checkout timer color based on remaining time
  const getCheckoutTimerColor = () => {
    if (checkoutTimeRemaining > 600) return "text-green-600 bg-green-100 border-green-300"; // > 10 minutes
    if (checkoutTimeRemaining > 300) return "text-amber-600 bg-amber-100 border-amber-300"; // > 5 minutes
    return "text-red-600 bg-red-100 border-red-300"; // < 5 minutes
  };

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`Đã copy ${label}!`);
    } else {
      toast.error(`Không thể copy ${label}`);
    }
  };

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
        <div className="text-center mb-8">
          {isPaid ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-green-600 mb-2">
                Thanh toán thành công!
              </h1>
              <p className="text-xl text-slate-600">
                Hệ thống đang xử lý khóa học của bạn
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Vui lòng kiểm tra email trong 15-30 phút
              </p>
            </div>
          ) : isExpired ? (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-4xl font-bold text-red-600 mb-2">
                Đơn hàng đã hết hạn
              </h1>
              <p className="text-xl text-slate-600">
                Thời gian chờ thanh toán đã kết thúc
              </p>
              <p className="text-sm text-slate-500 mt-2">
                Vui lòng tạo đơn hàng mới hoặc liên hệ support nếu đã thanh toán
              </p>
              <div className="mt-6">
                <Button onClick={() => router.push('/')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tạo đơn hàng mới
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Clock className="w-10 h-10 text-blue-600 animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Xác nhận thanh toán
              </h1>
              <p className="text-slate-600 mb-2">
                Vui lòng quét mã bên dưới để hoàn tất đơn hàng
              </p>
              {isPolling && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-slate-600 font-medium">
                    Đang kiểm tra trạng thái thanh toán...
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 15-Minute Checkout Countdown Timer - Show only when not paid */}
        {!isPaid && !isExpired && (
          <Card className={`mb-6 animate-in fade-in slide-in-from-top-4 duration-500 border-2 ${
            isCheckoutExpired ? 'border-red-300 bg-red-50' : getCheckoutTimerColor()
          }`}>
            <CardBody className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${isCheckoutExpired ? 'bg-red-200' : 'bg-white'}`}>
                    <Clock className={`w-6 h-6 sm:w-8 sm:h-8 ${
                      isCheckoutExpired ? 'text-red-600' : checkoutTimeRemaining > 600 ? 'text-green-600 animate-pulse' : checkoutTimeRemaining > 300 ? 'text-amber-600 animate-pulse' : 'text-red-600 animate-pulse'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-semibold text-slate-700">
                      {isCheckoutExpired ? '⏱️ Hết thời gian thanh toán' : '⏰ Thời gian thanh toán còn lại'}
                    </p>
                    <p className="text-xs text-slate-600">
                      {isCheckoutExpired ? 'Vui lòng tạo đơn hàng mới' : 'Vui lòng hoàn tất thanh toán trong thời gian này'}
                    </p>
                  </div>
                </div>
                
                <div className={`px-6 py-3 rounded-xl border-2 ${
                  isCheckoutExpired ? 'bg-red-200 border-red-400' : getCheckoutTimerColor()
                }`}>
                  <p className={`text-3xl sm:text-4xl font-black tracking-wider ${
                    isCheckoutExpired ? 'text-red-700' : checkoutTimeRemaining > 600 ? 'text-green-700' : checkoutTimeRemaining > 300 ? 'text-amber-700' : 'text-red-700'
                  }`}>
                    {isCheckoutExpired ? '00:00' : formatTimeRemaining(checkoutTimeRemaining)}
                  </p>
                </div>
              </div>
              
              {isCheckoutExpired && (
                <div className="mt-4 p-4 bg-white rounded-lg border-2 border-red-200">
                  <p className="text-sm text-red-700 text-center font-medium">
                    ⚠️ Thời gian thanh toán đã hết. Nếu bạn đã thanh toán, vui lòng liên hệ support để được hỗ trợ.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {/* Payment Info Card - Show only when not paid and not expired */}
        {!isPaid && !isExpired && (
          <>
            {/* Check if payment info is available */}
            {!orderData.qrCodeUrl && !orderData.bankInfo ? (
              <Card className="mb-8 border-2 border-amber-200 bg-amber-50">
                <CardBody className="p-6 sm:p-8">
                  <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                      Thông tin thanh toán không khả dụng
                    </h2>
                    <p className="text-lg text-slate-700 mb-6">
                      Đơn hàng này không có thông tin thanh toán. Vui lòng liên hệ support để được hỗ trợ.
                    </p>
                    <div className="space-y-3">
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={() => window.open('mailto:support@khoahocgiare.info?subject=Thanh toán đơn hàng ' + orderData.orderCode, '_blank')}
                      >
                        📧 Liên hệ support
                      </Button>
                      <p className="text-sm text-slate-600">
                        Email: support@khoahocgiare.info<br/>
                        Hotline: 0123 456 789
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <Card className="mb-8 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardBody className="p-4 sm:p-6 md:p-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                    {/* Bank Info - Mobile-Optimized */}
                    <div className="space-y-3 sm:space-y-4">
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 sm:mb-6 flex items-center gap-2">
                        <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span>Thông tin chuyển khoản</span>
                      </h2>
                  
                  <div className="space-y-2 sm:space-y-3">
                    {/* Bank Name */}
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-slate-500 mb-1">Ngân hàng</p>
                      <p className="font-bold text-slate-900 text-base sm:text-lg break-words">
                        {orderData.bankInfo?.bankName || "..."}
                      </p>
                    </div>
                    
                    {/* Account Number - Copy on Click */}
                    <div 
                      className="bg-slate-50 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-slate-100 active:scale-[0.99] transition-all group"
                      onClick={() => handleCopy(orderData.bankInfo?.accountNo || "", "số tài khoản")}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-slate-500 mb-1">Số tài khoản</p>
                          <p className="text-lg sm:text-xl font-bold text-blue-600 break-all">
                            {orderData.bankInfo?.accountNo || "..."}
                          </p>
                        </div>
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                      </div>
                    </div>

                    {/* Account Holder */}
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-slate-500 mb-1">Chủ tài khoản</p>
                      <p className="font-bold text-slate-900 text-sm sm:text-base break-words">
                        {orderData.bankInfo?.accountName || "..."}
                      </p>
                    </div>
                    
                    {/* Order Code - CRITICAL (Mobile-Optimized) */}
                    <div 
                      className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 p-3 sm:p-4 rounded-lg cursor-pointer hover:shadow-md active:scale-[0.99] transition-all group"
                      onClick={() => handleCopy(orderData.orderCode, "nội dung chuyển khoản")}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-xs sm:text-sm text-amber-700 font-semibold flex-1">
                          ⚠️ Nội dung chuyển khoản (Bắt buộc)
                        </p>
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 group-hover:text-red-600 transition-colors flex-shrink-0" />
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-red-600 tracking-wide break-all mb-2">
                        {orderData.orderCode}
                      </p>
                      <p className="text-xs text-amber-700 italic">
                        * Click để copy - Nhập chính xác
                      </p>
                    </div>
                    
                    {/* Amount */}
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-lg">
                      <p className="text-xs sm:text-sm text-slate-500 mb-1">Số tiền</p>
                      <p className="text-2xl sm:text-3xl font-bold text-green-600">
                        {formatCurrency(orderData.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* QR Code - Mobile-Optimized */}
                <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border-2 border-dashed border-blue-200">
                  <p className="text-sm sm:text-base text-slate-700 mb-3 sm:mb-4 font-semibold text-center">
                    Quét mã để thanh toán tự động
                  </p>
                  
                  <div className="bg-white p-2 sm:p-3 rounded-xl shadow-lg w-full max-w-[280px]">
                    {orderData.qrCodeUrl ? (
                      <img 
                        src={orderData.qrCodeUrl} 
                        alt="QR Payment" 
                        className="w-full h-auto object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full aspect-square bg-slate-100 flex items-center justify-center rounded">
                        <Spinner text="Đang tải..." />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs sm:text-sm text-slate-600 mt-3 sm:mt-4 text-center px-2">
                    Dùng App ngân hàng/Ví điện tử để quét
                  </p>
                  {isPolling && (
                    <div className="mt-3 sm:mt-4 flex items-center space-x-2 bg-white px-3 py-2 rounded-full">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm text-green-700 font-semibold">
                        Đang chờ thanh toán...
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
            )}
          </>
        )}

        {/* Success Message Card */}
        {isPaid && (
          <Card className="mb-8 border-2 border-green-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardBody className="p-8 md:p-12">
              <div className="max-w-md mx-auto text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  Đơn hàng đã được xác nhận!
                </h2>
                <div className="bg-green-50 rounded-lg p-6 space-y-3">
                  <div>
                    <p className="text-sm text-slate-600">Mã đơn hàng</p>
                    <p className="text-xl font-bold text-slate-900">{orderData.orderCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Email nhận khóa học</p>
                    <p className="text-lg font-semibold text-slate-900">{orderData.email}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Order Details - Mobile-Optimized */}
        <Card>
          <CardBody className="p-4 sm:p-6">
            <h3 className="font-bold text-slate-700 text-lg sm:text-xl mb-3 sm:mb-4 break-words">
              Chi tiết đơn hàng #{orderData.orderCode}
            </h3>
            {orderData.items && orderData.items.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {orderData.items.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-3 px-3 sm:px-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm sm:text-base break-words line-clamp-2">{item.title}</p>
                      <p className="text-xs text-slate-500 truncate mt-1 hidden sm:block">{item.url}</p>
                    </div>
                    <p className="font-bold text-slate-900 text-base sm:text-lg whitespace-nowrap self-end sm:self-auto">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                ))}
                <div className="pt-3 sm:pt-4 border-t-2 border-slate-200 flex justify-between items-center">
                  <span className="text-base sm:text-lg font-semibold text-slate-700">Tổng cộng:</span>
                  <span className="text-xl sm:text-2xl font-bold text-green-600">
                    {formatCurrency(orderData.totalAmount)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-slate-600 text-center py-6 sm:py-8 text-sm sm:text-base">Không có sản phẩm trong đơn hàng</p>
            )}
          </CardBody>
        </Card>

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
