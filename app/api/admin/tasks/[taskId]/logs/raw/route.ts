import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy to backend API for raw task log file content
 * Fetches worker download logs from log files
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> | { taskId: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const taskId = resolvedParams.taskId;
    const searchParams = request.nextUrl.searchParams;
    const lines = searchParams.get('lines') || '200';

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: 'Task ID is required' },
        { status: 400 }
      );
    }

    // Get backend API URL from environment
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Call backend API
    const backendUrl = `${apiUrl}/api/admin/tasks/${taskId}/logs/raw?lines=${lines}`;
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(30000), // 30 seconds
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({
          success: true,
          data: {
            logs: [],
            totalLines: 0,
            rawContent: ''
          }
        });
      }
      throw new Error(`Backend API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching raw logs from backend:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch raw logs from backend API' 
      },
      { status: 500 }
    );
  }
}
