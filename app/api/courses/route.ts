import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'Tất cả';
  const platform = searchParams.get('platform') || 'Tất cả';
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '20';

  try {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const queryParams = new URLSearchParams({
      category,
      platform,
      search,
      page,
      limit
    });

    const response = await fetch(
      `${serverUrl}/api/courses?${queryParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store' // Don't cache to get fresh data
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Failed to fetch courses:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch courses',
        courses: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 20,
          totalPages: 0
        }
      },
      { status: 500 }
    );
  }
}
