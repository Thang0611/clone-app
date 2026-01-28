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
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Navbar />
      
      {/* Main Content - eLearning Layout - Full Screen */}
      <div className="flex-1 overflow-hidden ">
        <LocalCoursePlayer
          courseId={courseId}
          courseName={courseTitle}
          deviceId={deviceId}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>
    </div>
  );
}
