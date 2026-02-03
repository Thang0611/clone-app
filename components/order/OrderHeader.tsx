import { CheckCircle2, Clock, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";

interface OrderHeaderProps {
  isPaid: boolean;
  isExpired: boolean;
  isPolling: boolean;
}

export function OrderHeader({ isPaid, isExpired, isPolling }: OrderHeaderProps) {
  const router = useRouter();

  if (isPaid) {
    return (
      <div className="text-center mb-6">
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-3">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
            Thanh toán thành công!
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Hệ thống đang xử lý khóa học của bạn
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Vui lòng kiểm tra email trong 15-30 phút
          </p>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="text-center mb-6">
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mb-3">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 mb-1">
            Đơn hàng đã hết hạn
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Thời gian chờ thanh toán đã kết thúc
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Vui lòng tạo đơn hàng mới hoặc liên hệ support nếu đã thanh toán
          </p>
          <div className="mt-4">
            <Button onClick={() => router.push('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tạo đơn hàng mới
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center mb-6">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
        <Clock className="w-7 h-7 text-blue-600 animate-pulse" />
      </div>
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
        Xác nhận thanh toán
      </h1>
      <p className="text-sm text-slate-600 mb-1">
        Vui lòng quét mã bên dưới để hoàn tất đơn hàng
      </p>
      {isPolling && (
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className="text-xs text-slate-600 font-medium">
            Đang kiểm tra trạng thái thanh toán...
          </p>
        </div>
      )}
    </div>
  );
}
