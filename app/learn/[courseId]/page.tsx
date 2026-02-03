'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import VideoPlayer from '@/components/VideoPlayer';
import CurriculumSidebar from '@/components/CurriculumSidebar';
import Header from '@/components/Header';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.getcourses.net';

interface Lecture {
  id: number;
  title: string;
  position: number;
  filename: string;
  relative_path: string;
  size: number;
  streamUrl?: string;
}

interface Section {
  id: number;
  title: string;
  position: number;
  lectures: Lecture[];
}

interface CourseInfo {
  id: number;
  title: string;
  slug: string;
  courseType: string;
  streamingReady: boolean;
}

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default function LearnPage({ params }: PageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [courseId, setCourseId] = useState<string | null>(null);
  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [driveLink, setDriveLink] = useState<string | null>(null);

  // Unwrap params
  useEffect(() => {
    params.then((p) => setCourseId(p.courseId));
  }, [params]);

  // Get backend user ID from session
  const backendUserId = (session?.user as { backendUserId?: number })?.backendUserId;

  // Check access
  useEffect(() => {
    if (!courseId || status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/learn/${courseId}`);
      return;
    }

    if (!backendUserId) {
      setError('Không tìm thấy thông tin người dùng');
      setLoading(false);
      return;
    }

    const checkAccess = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/videos/${courseId}/access?userId=${backendUserId}`);
        const data = await res.json();

        if (!data.success || !data.hasAccess) {
          setError('Bạn chưa có quyền truy cập khóa học này');
          setHasAccess(false);
          setLoading(false);
          return;
        }

        setHasAccess(true);

        // Check if drive link fallback is needed
        if (data.hasDriveLink && !data.canStream) {
          setDriveLink(data.driveLink);
        }

        // Load curriculum
        await loadCurriculum();
      } catch (err) {
        console.error('Access check error:', err);
        setError('Không thể kiểm tra quyền truy cập');
        setLoading(false);
      }
    };

    checkAccess();
  }, [courseId, backendUserId, status, router]);

  // Load curriculum
  const loadCurriculum = useCallback(async () => {
    if (!courseId || !backendUserId) return;

    try {
      const res = await fetch(`${API_URL}/api/v1/videos/${courseId}/curriculum?userId=${backendUserId}`);
      const data = await res.json();

      if (data.success) {
        setCourse(data.course);
        setSections(data.curriculum.sections || []);

        // Auto-select first lecture
        if (data.curriculum.sections?.length > 0 && data.curriculum.sections[0].lectures?.length > 0) {
          const firstLecture = data.curriculum.sections[0].lectures[0];
          selectLecture(firstLecture);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Curriculum load error:', err);
      setError('Không thể tải nội dung khóa học');
      setLoading(false);
    }
  }, [courseId, backendUserId]);

  // Select lecture and get stream URL
  const selectLecture = useCallback(async (lecture: Lecture) => {
    if (!courseId || !backendUserId) return;

    setCurrentLecture(lecture);
    setStreamUrl(null);

    try {
      const res = await fetch(`${API_URL}/api/v1/videos/${courseId}/lecture/${lecture.id}?userId=${backendUserId}`);
      const data = await res.json();

      if (data.success && data.streamUrl) {
        setStreamUrl(data.streamUrl);
      } else {
        setError('Không thể tải video');
      }
    } catch (err) {
      console.error('Stream URL error:', err);
      setError('Không thể tải video');
    }
  }, [courseId, backendUserId]);

  // Handle video ended - auto-play next
  const handleVideoEnded = useCallback(() => {
    if (!currentLecture || sections.length === 0) return;

    // Find next lecture
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const lectureIndex = section.lectures.findIndex(l => l.id === currentLecture.id);

      if (lectureIndex !== -1) {
        // Found current lecture
        if (lectureIndex < section.lectures.length - 1) {
          // Next lecture in same section
          selectLecture(section.lectures[lectureIndex + 1]);
          return;
        } else if (i < sections.length - 1 && sections[i + 1].lectures.length > 0) {
          // First lecture of next section
          selectLecture(sections[i + 1].lectures[0]);
          return;
        }
      }
    }
  }, [currentLecture, sections, selectLecture]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !hasAccess) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <h2 className="text-xl font-semibold text-white mb-2">Không có quyền truy cập</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Drive link fallback (no streaming ready)
  if (driveLink && sections.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-white mb-4">{course?.title || 'Khóa học'}</h1>
            <p className="text-gray-400 mb-6">
              Video streaming chưa sẵn sàng. Bạn có thể tải khóa học từ Google Drive:
            </p>
            <a
              href={driveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.71 3.5L1.15 15l4.58 8h13.14l4.58-8L17.85 3.5H7.71zM16.79 21h-9L4.2 15l3.5-7h9l3.5 7-3.41 6z" />
              </svg>
              Mở Google Drive
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />

      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)]">
        {/* Video area */}
        <div className="flex-1 flex flex-col">
          {/* Video player */}
          <div className="p-4">
            <VideoPlayer
              streamUrl={streamUrl || undefined}
              title={currentLecture?.title}
              onEnded={handleVideoEnded}
              autoPlay={false}
            />
          </div>

          {/* Video title */}
          <div className="px-4 pb-4">
            <h1 className="text-xl font-bold text-white">
              {currentLecture?.title || course?.title || 'Đang tải...'}
            </h1>
            {course && (
              <p className="text-sm text-gray-400 mt-1">{course.title}</p>
            )}
          </div>
        </div>

        {/* Curriculum sidebar */}
        <div className="w-full lg:w-96 border-l border-gray-800 overflow-hidden">
          <CurriculumSidebar
            sections={sections}
            currentLectureId={currentLecture?.id || null}
            onLectureSelect={selectLecture}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
