import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

async function getCourse(id: string) {
  try {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(
      `${serverUrl}/api/courses/${id}`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // Handle different response formats
    let courseData: any = null;
    if (data.success) {
      if (data.data) {
        courseData = data.data;
      } else if (data.course) {
        courseData = data.course;
      } else {
        courseData = data;
      }
    }
    
    return courseData;
  } catch (error) {
    console.error('Failed to fetch course for metadata:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  // Next.js 15: params is now a Promise and must be awaited
  const { id } = await params;
  const course = await getCourse(id);

  if (!course) {
    return generateSEOMetadata({
      title: "Khóa học không tồn tại",
      description: "Khóa học bạn đang tìm kiếm không tồn tại.",
      noindex: true,
    });
  }

  return generateSEOMetadata({
    title: `${course.title} - GetCourses`,
    description: course.description || `Khóa học ${course.title} từ ${course.platform}. Giá chỉ 50k.`,
    keywords: [
      course.title.toLowerCase(),
      course.platform?.toLowerCase(),
      course.category?.toLowerCase(),
      'khóa học online',
      'udemy',
      'coursera',
    ],
    image: course.thumbnail,
    url: `/courses/${id}`,
    type: 'product',
  });
}

export default function CourseDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
