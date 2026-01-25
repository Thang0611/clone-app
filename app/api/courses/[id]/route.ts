import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Handle both Promise and direct params (Next.js 15 compatibility)
    const resolvedParams = await Promise.resolve(params);
    const courseId = resolvedParams.id;
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Build backend URL - ensure it points to port 3001
    const backendUrl = `${serverUrl}/api/courses/${courseId}`;
    
    console.log('[Course API] Proxying to backend:', backendUrl);
    console.log('[Course API] Server URL from env:', serverUrl);

    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Course not found',
            course: null
          },
          { status: 404 }
        );
      }
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Failed to fetch course:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch course',
        course: null
      },
      { status: 500 }
    );
  }
}
