import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeader } from '@/lib/auth-utils';

const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * POST /api/admin/courses/[id]/download
 * Trigger download for a course (permanent download)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get JWT token for authentication
    const authHeader = await getAuthHeader(request);
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Get request body to extract optional email
    let email: string | undefined;
    try {
      const body = await request.json();
      email = body.email;
    } catch {
      // Request body is empty or invalid JSON, use undefined
      email = undefined;
    }

    // Call backend API to trigger download
    const response = await fetch(`${serverUrl}/api/admin/courses/${id}/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: email ? JSON.stringify({ email }) : '{}'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Failed to trigger course download:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to trigger course download' },
      { status: 500 }
    );
  }
}
