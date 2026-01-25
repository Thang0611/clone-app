'use client';

import { useState, useEffect } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { CourseTable } from '@/components/admin/CourseTable';
import { AddCourseModal } from '@/components/admin/AddCourseModal';
import { toast } from 'sonner';

interface Course {
  id: number;
  title: string;
  course_url: string;
  platform: string;
  category: string | null;
  instructor: string | null;
  rating: number | null;
  students: number | null;
  status: string;
  created_at: string;
  total_sections: number | null;
  total_lectures: number | null;
  duration: string | null;
  total_duration_seconds: number | null;
  drive_link: string | null;
  slug: string | null;
  thumbnail: string | null;
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0
  });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString()
      });
      
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }

      const response = await fetch(`/api/admin/courses?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setCourses(data.courses || []);
        setPagination(data.pagination || pagination);
      } else {
        throw new Error(data.error || 'Failed to fetch courses');
      }
    } catch (error: any) {
      console.error('Failed to fetch courses:', error);
      toast.error(error.message || 'Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [pagination.page, searchQuery]);

  const handleRefresh = () => {
    fetchCourses();
  };

  const handleImportSuccess = () => {
    fetchCourses();
    toast.success('Đã import khóa học thành công');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchCourses();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activeView="courses" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 lg:ml-64">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 md:px-8 md:py-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Quản lý khóa học
              </h1>
              <p className="text-gray-600 mt-1.5 text-sm md:text-base">
                Thêm, xóa và quản lý các khóa học trong hệ thống
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto flex-shrink-0"
            >
              <Plus className="w-5 h-5" />
              <span className="whitespace-nowrap">Thêm khóa học</span>
            </button>
          </div>

          {/* Search and Refresh */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <form onSubmit={handleSearch} className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm khóa học..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
                />
              </div>
            </form>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-4 md:p-8">
          <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="text-sm text-gray-600">
              Tổng số: <span className="font-semibold text-gray-900">{pagination.total}</span> khóa học
            </div>
            {pagination.totalPages > 1 && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                <span className="text-sm text-gray-600 whitespace-nowrap">
                  Trang {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            )}
          </div>

          {/* Courses Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <CourseTable
              courses={courses}
              loading={loading}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </main>

      {/* Add Course Modal */}
      <AddCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
}
