import { QrCode, Copy, AlertCircle } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { formatCurrency, copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";
import type { OrderData } from "@/types";

interface PaymentSectionProps {
  orderData: OrderData;
  isPolling: boolean;
}

export function PaymentSection({ orderData, isPolling }: PaymentSectionProps) {
  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`Đã copy ${label}!`);
    } else {
      toast.error(`Không thể copy ${label}`);
    }
  };

  // Check if payment info is available
  if (!orderData.qrCodeUrl && !orderData.bankInfo) {
    return (
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
                onClick={() => window.open('mailto:getcourses.net@gmail.com?subject=Payment for order ' + orderData.orderCode, '_blank')}
              >
                📧 Liên hệ support
              </Button>
              <p className="text-sm text-slate-600">
                Email: getcourses.net@gmail.com<br/>
                Zalo: 0986 787 542
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mb-8 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardBody className="p-4 sm:p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Bank Info */}
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
              
              {/* Account Number */}
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
              
              {/* Order Code */}
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

          {/* QR Code */}
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
  );
}
