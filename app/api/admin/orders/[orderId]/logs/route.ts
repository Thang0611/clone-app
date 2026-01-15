import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy to backend API for admin order audit logs
 * Fetches real data from the Node.js backend API
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> | { orderId: string } }
) {
  try {
    // FIX: Handle both Next.js 13+ (Promise) and older versions
    const resolvedParams = params instanceof Promise ? await params : params;
    const orderId = resolvedParams.orderId;
    const searchParams = request.nextUrl.searchParams;
    const severity = searchParams.get('severity');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get backend API URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Build query string for backend API
    const queryParams = new URLSearchParams();
    if (severity) {
      queryParams.append('severity', severity);
    }

    // Call real backend API
    const backendUrl = `${apiUrl}/api/admin/orders/${orderId}/logs${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(30000), // 30 seconds
    });

    if (!response.ok) {
      // If backend returns 404, return empty logs instead of error
      if (response.status === 404) {
        return NextResponse.json({
          success: true,
          data: {
            logs: [],
            total: 0
          }
        });
      }
      throw new Error(`Backend API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    // Return the data in the expected format
    // Backend returns: { success: true, data: { logs: [...], ... } }
    // Frontend expects: { success: true, data: { logs: [...] } }
    return NextResponse.json({
      success: data.success !== false,
      data: {
        logs: data.data?.logs || data.data || [],
        total: data.data?.total || (Array.isArray(data.data) ? data.data.length : 0)
      }
    });
  } catch (error) {
    console.error('Error fetching logs from backend:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch logs from backend API' 
      },
      { status: 500 }
    );
  }
}
