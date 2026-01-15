import { NextResponse } from 'next/server';

/**
 * Proxy to backend API for dashboard statistics
 * Fetches real data from the Node.js backend API
 */
export async function GET() {
  try {
    // Get backend API URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Call real backend API (note: backend route is /api/admin/dashboard/stats)
    const backendUrl = `${apiUrl}/api/admin/dashboard/stats`;
    
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
      data: data.data || {
        orders: {
          total: 0,
          pending: 0,
          processing: 0,
          completed: 0,
          failed: 0
        },
        tasks: {},
        recentErrors: []
      }
    });
  } catch (error) {
    console.error('Error fetching stats from backend:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch statistics from backend API' 
      },
      { status: 500 }
    );
  }
}
