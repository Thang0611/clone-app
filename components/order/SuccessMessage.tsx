import { Card, CardBody } from "../ui/Card";
import type { OrderData } from "@/types";

interface SuccessMessageProps {
  orderData: OrderData;
}

export function SuccessMessage({ orderData }: SuccessMessageProps) {
  return (
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
  );
}
