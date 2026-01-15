import { Clock } from "lucide-react";
import { Card, CardBody } from "../ui/Card";
import { formatTimeRemaining } from "@/lib/utils";

interface CheckoutTimerProps {
  timeRemaining: number;
  isExpired: boolean;
  getTimerColor: () => string;
}

export function CheckoutTimer({ timeRemaining, isExpired, getTimerColor }: CheckoutTimerProps) {
  const timerColor = getTimerColor();

  return (
    <Card className={`mb-6 animate-in fade-in slide-in-from-top-4 duration-500 border-2 ${
      isExpired ? 'border-red-300 bg-red-50' : timerColor
    }`}>
      <CardBody className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${isExpired ? 'bg-red-200' : 'bg-white'}`}>
              <Clock className={`w-6 h-6 sm:w-8 sm:h-8 ${
                isExpired 
                  ? 'text-red-600' 
                  : timeRemaining > 600 
                    ? 'text-green-600 animate-pulse' 
                    : timeRemaining > 300 
                      ? 'text-amber-600 animate-pulse' 
                      : 'text-red-600 animate-pulse'
              }`} />
            </div>
            <div>
              <p className="text-sm sm:text-base font-semibold text-slate-700">
                {isExpired ? '⏱️ Hết thời gian thanh toán' : '⏰ Thời gian thanh toán còn lại'}
              </p>
              <p className="text-xs text-slate-600">
                {isExpired ? 'Vui lòng tạo đơn hàng mới' : 'Vui lòng hoàn tất thanh toán trong thời gian này'}
              </p>
            </div>
          </div>
          
          <div className={`px-6 py-3 rounded-xl border-2 ${
            isExpired ? 'bg-red-200 border-red-400' : timerColor
          }`}>
            <p className={`text-3xl sm:text-4xl font-black tracking-wider ${
              isExpired 
                ? 'text-red-700' 
                : timeRemaining > 600 
                  ? 'text-green-700' 
                  : timeRemaining > 300 
                    ? 'text-amber-700' 
                    : 'text-red-700'
            }`}>
              {isExpired ? '00:00' : formatTimeRemaining(timeRemaining)}
            </p>
          </div>
        </div>
        
        {isExpired && (
          <div className="mt-4 p-4 bg-white rounded-lg border-2 border-red-200">
            <p className="text-sm text-red-700 text-center font-medium">
              ⚠️ Thời gian thanh toán đã hết. Nếu bạn đã thanh toán, vui lòng liên hệ support để được hỗ trợ.
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
