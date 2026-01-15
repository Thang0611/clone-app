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
      <div className="text-center mb-8">
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
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="text-center mb-8">
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
      </div>
    );
  }

  return (
    <div className="text-center mb-8">
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
  );
}
