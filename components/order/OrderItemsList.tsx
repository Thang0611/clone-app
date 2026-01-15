import { Card, CardBody } from "../ui/Card";
import { formatCurrency } from "@/lib/utils";
import type { OrderData } from "@/types";

interface OrderItemsListProps {
  orderData: OrderData;
}

export function OrderItemsList({ orderData }: OrderItemsListProps) {
  return (
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
                  <p className="font-medium text-slate-900 text-sm sm:text-base break-words line-clamp-2">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-1 hidden sm:block">
                    {item.url}
                  </p>
                </div>
                <p className="font-bold text-slate-900 text-base sm:text-lg whitespace-nowrap self-end sm:self-auto">
                  {formatCurrency(item.price)}
                </p>
              </div>
            ))}
            <div className="pt-3 sm:pt-4 border-t-2 border-slate-200 flex justify-between items-center">
              <span className="text-base sm:text-lg font-semibold text-slate-700">
                Tổng cộng:
              </span>
              <span className="text-xl sm:text-2xl font-bold text-green-600">
                {formatCurrency(orderData.totalAmount)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-slate-600 text-center py-6 sm:py-8 text-sm sm:text-base">
            Không có sản phẩm trong đơn hàng
          </p>
        )}
      </CardBody>
    </Card>
  );
}
