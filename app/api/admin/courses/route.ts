import { NextRequest, NextResponse } from 'next/server';

const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * GET /api/admin/courses
 * Get all courses (for admin management)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '50';
    const search = searchParams.get('search') || '';

    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search })
    });

    const response = await fetch(
      `${serverUrl}/api/courses?${queryParams.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Normalize course data - ensure numeric fields are numbers
    if (data.success && data.courses && Array.isArray(data.courses)) {
      data.courses = data.courses.map((course: any) => ({
        ...course,
        total_sections: course.total_sections ? (typeof course.total_sections === 'string' ? parseInt(course.total_sections, 10) : course.total_sections) : null,
        total_lectures: course.total_lectures ? (typeof course.total_lectures === 'string' ? parseInt(course.total_lectures, 10) : course.total_lectures) : null,
        total_duration_seconds: course.total_duration_seconds ? (typeof course.total_duration_seconds === 'string' ? parseInt(course.total_duration_seconds, 10) : course.total_duration_seconds) : null,
      }));
    }
    
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
          limit: 50,
          totalPages: 0
        }
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/courses
 * Delete a course by ID
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const courseId = searchParams.get('id');

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    // Call backend API to delete course
    const response = await fetch(
      `${serverUrl}/api/courses/${courseId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API responded with status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Failed to delete course:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete course' },
      { status: 500 }
    );
  }
}
