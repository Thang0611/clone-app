import { Button } from "../ui/Button";
import { formatCurrency } from "@/lib/utils";
import { Crown, Download } from "lucide-react";

interface PaymentFooterProps {
  regularAmount: number;
  premiumAmount: number;
  courseCount: number;
  onPaymentRegular: () => void;
  onPaymentPremium: () => void;
  isLoading: boolean;
  loadingType?: 'regular' | 'premium' | null;
}

export function PaymentFooter({
  regularAmount,
  premiumAmount,
  courseCount,
  onPaymentRegular,
  onPaymentPremium,
  isLoading,
  loadingType
}: PaymentFooterProps) {
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-2 sm:px-4 py-3 flex-shrink-0">
      {/* Compact Dual Payment - Side by side on all screens */}
      <div className="grid grid-cols-2 gap-2">

        {/* Premium - Left */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-2 sm:p-3">
          <div className="flex items-center gap-1 mb-1">
            <Crown className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-indigo-800 text-xs sm:text-sm">Premium</span>
          </div>

          <div className="text-[10px] sm:text-xs text-indigo-700 mb-1 leading-tight">
            ✅ {courseCount} khóa + Kho khóa học
          </div>

          <a href="/courses" target="_blank" rel="noopener noreferrer"
            className="text-[10px] text-purple-600 hover:underline block mb-2">
            👉 Xem kho
          </a>

          <div className="text-base sm:text-xl font-bold text-indigo-600 mb-2">
            {formatCurrency(premiumAmount)}
          </div>

          <Button
            onClick={onPaymentPremium}
            loading={isLoading && loadingType === 'premium'}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-xs sm:text-sm py-2"
            size="sm"
          >
            {isLoading && loadingType === 'premium' ? "..." : "Premium"}
          </Button>
        </div>

        {/* Regular - Right */}
        <div className="bg-white border border-slate-200 rounded-lg p-2 sm:p-3">
          <div className="flex items-center gap-1 mb-1">
            <Download className="w-4 h-4 text-slate-600" />
            <span className="font-bold text-slate-700 text-xs sm:text-sm">Regular</span>
          </div>

          <div className="text-[10px] sm:text-xs text-slate-600 leading-tight mb-1">
            📦 39k/khóa • 5 khóa 99k
          </div>
          <div className="text-[10px] sm:text-xs text-green-600 font-medium mb-2">
            🔥 10 khóa: 199k
          </div>

          <div className="text-base sm:text-xl font-bold text-green-600 mb-2">
            {formatCurrency(regularAmount)}
            <span className="text-[10px] sm:text-xs font-normal text-slate-500 ml-1">
              ({courseCount})
            </span>
          </div>

          <Button
            onClick={onPaymentRegular}
            loading={isLoading && loadingType === 'regular'}
            disabled={isLoading}
            variant="outline"
            className="w-full border-slate-300 hover:bg-slate-50 text-xs sm:text-sm py-2"
            size="sm"
          >
            {isLoading && loadingType === 'regular' ? "..." : "Thanh toán"}
          </Button>
        </div>

      </div>
    </div>
  );
}
