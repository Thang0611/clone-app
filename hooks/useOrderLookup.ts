import { useState } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/constants';
import { isValidEmail } from '@/lib/utils';

interface OrderItem {
  id: number;
  course_url: string;
  title: string;
  status: string;
  drive_link: string | null;
  price: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderResult {
  order_code: string;
  status: string;
  payment_status: string;
  total_amount: string;
  created_at?: string;
  updated_at?: string;
  items: OrderItem[];
}

export function useOrderLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [error, setError] = useState<string>("");

  const lookupOrders = async (email: string) => {
    // Validate email
    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email");
      toast.error("Vui lòng nhập email");
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError("Email không hợp lệ");
      toast.error("Email không hợp lệ");
      return;
    }

    setIsLoading(true);
    setError("");
    setOrders([]);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/payment/lookup?email=${encodeURIComponent(email.trim())}`,
        {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText || 'Không thể tra cứu đơn hàng'}`);
      }

      const data = await response.json();

      if (data.success && data.data && data.data.length > 0) {
        setOrders(data.data);
        toast.success(`Tìm thấy ${data.count} đơn hàng!`);
      } else if (data.success && data.count === 0) {
        setError("Không tìm thấy đơn hàng nào với email này");
        toast.info("Không tìm thấy đơn hàng");
      } else {
        setError(data.error || "Không thể tra cứu đơn hàng");
        toast.error(data.error || "Có lỗi xảy ra");
      }
    } catch (err) {
      let errorMessage = "Có lỗi xảy ra khi tra cứu đơn hàng";
      
      if (err instanceof Error) {
        if (err.message.includes('CORS')) {
          errorMessage = "Lỗi kết nối: CORS policy. Vui lòng liên hệ admin để cấu hình backend.";
        } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
          errorMessage = "Lỗi kết nối: Không thể kết nối đến server. Vui lòng kiểm tra lại sau.";
        } else if (err.message.includes('API Error')) {
          errorMessage = err.message;
        } else {
          errorMessage = `Lỗi: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    lookupOrders,
    isLoading,
    orders,
    error,
  };
}
