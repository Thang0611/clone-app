import { NextRequest, NextResponse } from 'next/server';

const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * POST /api/admin/courses/import
 * Import courses from URLs
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { urls, shouldDownload = false } = body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng cung cấp danh sách URL hợp lệ' },
        { status: 400 }
      );
    }

    // Call backend API to import courses
    const response = await fetch(`${serverUrl}/api/courses/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ urls, shouldDownload })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Failed to import courses:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to import courses' },
      { status: 500 }
    );
  }
}
