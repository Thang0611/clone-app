import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const testUrl = `${apiUrl}/api/admin/orders/paid?limit=1`;
    
    console.log('[Test] API URL:', apiUrl);
    console.log('[Test] Test URL:', testUrl);
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `Backend returned ${response.status}`,
        apiUrl,
        testUrl,
      }, { status: 500 });
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      apiUrl,
      backendWorking: true,
      dataLength: data.data?.length || 0,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    }, { status: 500 });
  }
}
