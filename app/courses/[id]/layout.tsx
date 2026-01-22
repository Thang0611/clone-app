import type { Metadata } from "next";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo";

// Mock function - Replace with actual API call when ready
async function getCourse(id: string) {
  // TODO: Replace with actual API call
  // const response = await fetch(`${process.env.API_URL}/courses/${id}`);
  // return response.json();
  
  // Mock data for now
  const mockCourses: Record<string, any> = {
    "1": {
      title: "The Complete Web Development Bootcamp",
      description: "Become a Full-Stack Web Developer with just ONE course. HTML, CSS, Javascript, Node, React, PostgreSQL, Web3 and DApps.",
      thumbnail: "https://via.placeholder.com/800x450/4F46E5/FFFFFF?text=Web+Development",
      platform: "Udemy",
      category: "Lập trình",
      rating: 4.7,
      price: 30000,
    },
  };
  
  return mockCourses[id] || null;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const course = await getCourse(params.id);

  if (!course) {
    return generateSEOMetadata({
      title: "Khóa học không tồn tại",
      description: "Khóa học bạn đang tìm kiếm không tồn tại.",
      noindex: true,
    });
  }

  return generateSEOMetadata({
    title: `${course.title} - GetCourses`,
    description: course.description || `Khóa học ${course.title} từ ${course.platform}. Giá chỉ từ 30k.`,
    keywords: [
      course.title.toLowerCase(),
      course.platform?.toLowerCase(),
      course.category?.toLowerCase(),
      'khóa học online',
      'udemy',
      'coursera',
    ],
    image: course.thumbnail,
    url: `/courses/${params.id}`,
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
