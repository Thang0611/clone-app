import { Button } from "../ui/Button";
import { formatCurrency } from "@/lib/utils";

interface PaymentFooterProps {
  totalAmount: number;
  onPayment: () => void;
  isLoading: boolean;
}

export function PaymentFooter({ totalAmount, onPayment, isLoading }: PaymentFooterProps) {
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6 py-4 flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <span className="text-base sm:text-lg font-semibold text-slate-700">
          Tổng cộng:
        </span>
        <span className="text-xl sm:text-2xl font-bold text-green-600">
          {formatCurrency(totalAmount)}
        </span>
      </div>

      <Button
        onClick={onPayment}
        loading={isLoading}
        disabled={isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? "Đang xử lý..." : "Thanh toán"}
      </Button>
    </div>
  );
}
