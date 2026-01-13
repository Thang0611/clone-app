// ============================================
// Next.js API Route: GET /api/orders/[orderCode]
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api';

interface CachedOrder {
  orderCode: string;
  email: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid';
  qrCodeUrl?: string;
  bankInfo?: {
    bankName: string;
    accountNo: string;
    accountName: string;
  };
  items?: Array<{
    title: string;
    url: string;
    price: number;
    courseId?: string;
  }>;
  status: string;
  date: string;
  cachedAt?: string;
}

// In-memory order storage (for demo - in production, use a database or Redis)
// This stores orders temporarily when they're created
const orderCache = new Map<string, CachedOrder>();

// Helper to store order (called from frontend after order creation)
export function storeOrder(orderCode: string, orderData: CachedOrder) {
  orderCache.set(orderCode, {
    ...orderData,
    cachedAt: new Date().toISOString(),
  });
  
  // Auto-expire after 24 hours
  setTimeout(() => {
    orderCache.delete(orderCode);
  }, 24 * 60 * 60 * 1000);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderCode: string }> }
) {
  try {
    const { orderCode } = await params;

    if (!orderCode || !/^DH\d{6}$/.test(orderCode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid order code format' },
        { status: 400 }
      );
    }

    // First, check cache
    const cachedOrder = orderCache.get(orderCode);
    
    if (cachedOrder) {
      // Verify payment status from backend
      try {
        const statusResponse = await apiClient.checkPaymentStatus(orderCode);
        
        // Update cached order with latest payment status
        const updatedOrder = {
          ...cachedOrder,
          paymentStatus: statusResponse.status,
          status: statusResponse.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán',
        };
        
        orderCache.set(orderCode, updatedOrder);
        
        return NextResponse.json({
          success: true,
          order: updatedOrder,
        });
      } catch {
        // If status check fails, return cached data
        return NextResponse.json({
          success: true,
          order: cachedOrder,
        });
      }
    }

    // If not in cache, try to get status from backend
    // (This is limited data, but better than nothing)
    try {
      const statusResponse = await apiClient.checkPaymentStatus(orderCode);
      
      return NextResponse.json({
        success: true,
        order: {
          orderCode,
          paymentStatus: statusResponse.status,
          status: statusResponse.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán',
          totalAmount: statusResponse.amount,
          // Minimal data - full details not available without cache
          items: [],
          date: new Date().toLocaleDateString('vi-VN'),
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Order not found';
      return NextResponse.json(
        { 
          success: false, 
          error: errorMessage,
        },
        { status: 404 }
      );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      console.error('Order API Error:', errorMessage);
      return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// Export the cache for use in other API routes
export { orderCache };
