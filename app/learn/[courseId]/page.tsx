'use client';

/**
 * Learn Course Page - Trang xem video khóa học
 * Thiết kế theo chuẩn eLearning, đồng bộ với courses/[id]
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LocalCoursePlayer } from '@/components/learning/LocalCoursePlayer';
import { ArrowLeft, Menu, X, BookOpen, Clock, CheckCircle2, PlayCircle, Star, Users, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import Breadcrumb from '@/components/Breadcrumb';
import { getCachedFolderName } from '@/lib/directory-manager';

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [deviceId, setDeviceId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [cachedFolderName, setCachedFolderName] = useState<string | null>(null);
  const [isLoadingFolder, setIsLoadingFolder] = useState(true);

  // Generate or get device ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('device-id');
      if (!id) {
        id = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('device-id', id);
      }
      setDeviceId(id);
    }
  }, []);

  // Extract course title from courseId (slug)
  useEffect(() => {
    if (courseId) {
      const title = courseId
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setCourseTitle(title);
    }
  }, [courseId]);

  // Load cached folder name
  useEffect(() => {
    async function loadCachedFolder() {
      try {
        const folderName = await getCachedFolderName();
        setCachedFolderName(folderName);
      } catch (error) {
        console.error('[LearnPage] Error loading cached folder:', error);
      } finally {
        setIsLoadingFolder(false);
      }
    }
    loadCachedFolder();
  }, []);

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <main className="flex-1">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { name: 'Học khóa học', url: '/learn' },
            { name: courseTitle || 'Khóa học', url: '#' },
          ]}
        />


        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start gap-3">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">
                    Trình duyệt không hỗ trợ
                  </h3>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                    Tính năng này yêu cầu Chrome hoặc Edge (phiên bản mới).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - eLearning Layout */}
        <div className="w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <LocalCoursePlayer
            courseId={courseId}
            courseName={courseTitle}
            deviceId={deviceId}
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
