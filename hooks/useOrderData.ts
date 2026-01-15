import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api';
import type { OrderData } from '@/types';

export function useOrderData(orderCode: string | null) {
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrderData() {
      if (!orderCode) {
        setLoadError('Mã đơn hàng không hợp lệ');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);
        
        const response = await apiClient.getOrderByCode(orderCode);
        
        if (response.success && response.order) {
          setOrderData(response.order);
        } else {
          setLoadError('Không tìm thấy đơn hàng');
        }
      } catch (error: any) {
        console.error('Error fetching order:', error);
        const errorMessage = error instanceof Error ? error.message : 'Không thể tải thông tin đơn hàng';
        setLoadError(errorMessage);
        
        // Fallback: Try localStorage
        const stored = localStorage.getItem("orderData");
        if (stored) {
          try {
            const parsedOrder = JSON.parse(stored);
            if (parsedOrder.orderCode === orderCode) {
              setOrderData(parsedOrder);
              setLoadError(null);
              toast.info('Đang hiển thị dữ liệu từ cache local');
            }
          } catch (err) {
            console.error('Error parsing stored order:', err);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderData();
  }, [orderCode]);

  /**
   * Update order data (e.g., after payment confirmation)
   */
  const updateOrderData = (updates: Partial<OrderData>) => {
    if (orderData) {
      const updatedData = { ...orderData, ...updates };
      setOrderData(updatedData);
      localStorage.setItem("orderData", JSON.stringify(updatedData));
    }
  };

  return {
    orderData,
    isLoading,
    loadError,
    updateOrderData,
  };
}
