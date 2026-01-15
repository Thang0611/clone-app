import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy to backend API for admin orders
 * Fetches real data from the Node.js backend API
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'paid';
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    // Get backend API URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Build query string for backend API
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(status && { order_status: status })
    });

    // Call real backend API
    const backendUrl = `${apiUrl}/api/admin/orders/paid?${queryParams.toString()}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(30000), // 30 seconds
    });

    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Return the data in the expected format
    return NextResponse.json({
      success: data.success !== false,
      data: data.data || [],
      pagination: data.pagination || {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        totalPages: 0
      }
    });
  } catch (error) {
    console.error('Error fetching orders from backend:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch orders from backend API' 
      },
      { status: 500 }
    );
  }
}
