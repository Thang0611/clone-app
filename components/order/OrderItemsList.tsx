import { Card, CardBody } from "../ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { OrderData } from "@/types";

interface OrderItemsListProps {
  orderData: OrderData;
}

export function OrderItemsList({ orderData }: OrderItemsListProps) {
  return (
    <Card>
      <CardBody className="p-3 sm:p-4">
        <h3 className="font-bold text-slate-700 text-base sm:text-lg mb-2 sm:mb-3 break-words">
          Chi tiết đơn hàng #{orderData.orderCode}
        </h3>
        {orderData.items && orderData.items.length > 0 ? (
          <div className="space-y-1.5 sm:space-y-2">
            {orderData.items.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 sm:gap-3 py-2 px-2.5 sm:px-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-xs sm:text-sm break-words line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5 hidden sm:block">
                    {item.url}
                  </p>
                </div>
                <p className="font-bold text-slate-900 text-sm sm:text-base whitespace-nowrap self-end sm:self-auto">
                  {formatCurrency(item.price)}
                </p>
              </div>
            ))}
            <div className="pt-2 sm:pt-3 border-t-2 border-slate-200 flex justify-between items-center">
              <span className="text-sm sm:text-base font-semibold text-slate-700">
                Tổng cộng:
              </span>
              <span className="text-lg sm:text-xl font-bold text-green-600">
                {formatCurrency(orderData.totalAmount)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-slate-600 text-center py-4 sm:py-6 text-xs sm:text-sm">
            Không có sản phẩm trong đơn hàng
          </p>
        )}
      </CardBody>
    </Card>
  );
}
