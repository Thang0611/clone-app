// ============================================
// Next.js API Route: POST /api/orders/store
// ============================================

import { NextRequest, NextResponse } from 'next/server';
import { orderCache } from '../[orderCode]/route';

export async function POST(request: NextRequest) {
  try {
    const { orderCode, orderData } = await request.json();

    if (!orderCode || !orderData) {
      return NextResponse.json(
        { success: false, error: 'Missing orderCode or orderData' },
        { status: 400 }
      );
    }

    // Store in cache with timestamp
    orderCache.set(orderCode, {
      ...orderData,
      cachedAt: new Date().toISOString(),
    });

    // Auto-expire after 24 hours
    setTimeout(() => {
      orderCache.delete(orderCode);
    }, 24 * 60 * 60 * 1000);

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Store order error:', errorMessage);
    return NextResponse.json(
      { success: false, error: 'Failed to store order' },
      { status: 500 }
    );
  }
}
