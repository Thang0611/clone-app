import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeader } from '@/lib/auth-utils';

/**
 * Proxy to backend API for resending order completion email
 * POST /api/admin/orders/:id/resend-email
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Get JWT token for authentication
    const authHeader = await getAuthHeader(request);
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    // Get backend API URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const backendUrl = `${apiUrl}/api/admin/orders/${orderId}/resend-email`;

    console.log('[Resend Email] Calling backend:', backendUrl);
    console.log('[Resend Email] API URL from env:', apiUrl);

    let response;
    try {
      response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
      });
    } catch (fetchError) {
      console.error('[Resend Email] Fetch error:', fetchError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to connect to backend: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`,
        },
        { status: 503 }
      );
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: `Backend API returned ${response.status}` };
      }
      
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || errorData.error || `Backend API returned ${response.status}`,
        },
        { status: response.status }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse backend response:', parseError);
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid response from backend server',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error resending order email:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to resend order email',
      },
      { status: 500 }
    );
  }
}