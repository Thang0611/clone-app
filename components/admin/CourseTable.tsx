'use client';

import { useState } from 'react';
import { Trash2, Loader2, ExternalLink, Download } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { ConfirmDialog } from './ConfirmDialog';
import { transformUdemy } from '@/lib/utils';

interface Course {
  id: number;
  title: string;
  course_url: string;
  platform: string;
  category: string | null;
  instructor: string | null;
  rating: number | string | null;
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

interface CourseTableProps {
  courses: Course[];
  loading: boolean;
  onRefresh: () => void;
}

export function CourseTable({ courses, loading, onRefresh }: CourseTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    course: Course | null;
    type: 'delete' | 'download' | null;
  }>({
    isOpen: false,
    course: null,
    type: null
  });

  const handleDeleteClick = (course: Course) => {
    setConfirmDialog({ isOpen: true, course, type: 'delete' });
  };

  const handleDownloadClick = (course: Course) => {
    if (!course.course_url) {
      toast.error('Khóa học không có URL');
      return;
    }
    setConfirmDialog({ isOpen: true, course, type: 'download' });
  };

  const handleDeleteConfirm = async () => {
    if (!confirmDialog.course) return;

    const courseId = confirmDialog.course.id;
    setDeletingId(courseId);
    setConfirmDialog({ isOpen: false, course: null, type: null });

    try {
      const response = await fetch(`/api/admin/courses?id=${courseId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Đã xóa khóa học thành công');
        onRefresh();
      } else {
        throw new Error(data.error || 'Failed to delete course');
      }
    } catch (error: any) {
      console.error('Failed to delete course:', error);
      toast.error(error.message || 'Không thể xóa khóa học');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadConfirm = async () => {
    if (!confirmDialog.course) return;

    const course = confirmDialog.course;
    setDownloadingId(course.id);
    setConfirmDialog({ isOpen: false, course: null, type: null });

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/download`, {
        method: 'POST'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Đã bắt đầu download khóa học. Quá trình này có thể mất vài phút.');
        // Refresh after a delay to show updated status
        setTimeout(() => {
          onRefresh();
        }, 2000);
      } else {
        throw new Error(data.error || 'Failed to trigger download');
      }
    } catch (error: any) {
      console.error('Failed to trigger download:', error);
      toast.error(error.message || 'Không thể bắt đầu download khóa học');
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '-';
      
      // Handle different date formats from database
      let date: Date;
      
      // Sequelize returns ISO string format: "2024-01-15T10:30:00.000Z"
      // MySQL TIMESTAMP can be: "2024-01-15 10:30:00" or ISO string
      if (typeof dateString === 'string') {
        // Try parsing as ISO string first (most common from Sequelize)
        date = new Date(dateString);
        
        // If invalid, try MySQL format "YYYY-MM-DD HH:mm:ss"
        if (isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(dateString)) {
          // Replace space with T to make it ISO-like
          date = new Date(dateString.replace(' ', 'T'));
        }
        
        // If still invalid, try Date.parse
        if (isNaN(date.getTime())) {
          const parsed = Date.parse(dateString);
          if (!isNaN(parsed)) {
            date = new Date(parsed);
          }
        }
      } else {
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date format:', dateString);
        return '-';
      }
      
      // Format as DD/MM/YYYY (Vietnamese format)
      // Use UTC methods to avoid timezone issues, then format in local timezone
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return '-';
    }
  };

  const formatDuration = (duration: string | null, totalSeconds: number | null) => {
    if (duration) {
      return duration;
    }
    if (totalSeconds && totalSeconds > 0) {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      if (hours > 0) {
        const minutesDecimal = (totalSeconds % 3600) / 60;
        const hoursDecimal = hours + (minutesDecimal / 60);
        return `${hoursDecimal.toFixed(1)} hours`;
      }
      if (minutes > 0) {
        return `${minutes} minutes`;
      }
      return `${totalSeconds} seconds`;
    }
    return '-';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg flex-1" />
              <div className="h-12 bg-gray-200 rounded-lg w-48" />
              <div className="h-12 bg-gray-200 rounded-lg w-32" />
              <div className="h-12 bg-gray-200 rounded-lg w-28" />
              <div className="h-12 bg-gray-200 rounded-lg w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500 text-lg">Chưa có khóa học nào</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              {/* Thumbnail Image */}
              <div className="flex-shrink-0">
                <a
                  href={`/courses/${course.slug || course.id}`}
                  className="block relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                >
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                      sizes="80px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  )}
                </a>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs text-gray-500">ID: {course.id}</span>
                  <span
                    className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                      course.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {course.status === 'active' ? 'Active' : course.status}
                  </span>
                </div>
                <a
                  href={`/courses/${course.slug || course.id}`}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline line-clamp-2"
                  title={course.title}
                >
                  {course.title}
                </a>
              </div>
            </div>
            
            <div className="space-y-2 mb-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Category:</span>
                <span className="text-gray-900">{course.category || '-'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Sections:</span>
                <span className="text-gray-900">
                  {course.total_sections !== null && course.total_sections !== undefined 
                    ? course.total_sections 
                    : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Lectures:</span>
                <span className="text-gray-900">
                  {course.total_lectures !== null && course.total_lectures !== undefined 
                    ? course.total_lectures 
                    : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Thời lượng:</span>
                <span className="text-gray-900">
                  {formatDuration(course.duration, course.total_duration_seconds)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Ngày tạo:</span>
                <span className="text-gray-900">{formatDate(course.created_at)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              {course.course_url && (
                <a
                  href={transformUdemy(course.course_url) || course.course_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>URL</span>
                </a>
              )}
              {course.drive_link ? (
                <a
                  href={course.drive_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 px-3 py-1.5 text-green-600 hover:text-green-800 rounded-lg hover:bg-green-50 transition-colors text-sm flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Drive Link</span>
                </a>
              ) : (
                <button
                  onClick={() => handleDownloadClick(course)}
                  disabled={downloadingId === course.id}
                  className="flex items-center justify-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex-1"
                >
                  {downloadingId === course.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tải...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => handleDeleteClick(course)}
                disabled={deletingId === course.id}
                className="flex items-center justify-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {deletingId === course.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[1280px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[300px]">
                Tiêu đề
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                URL Course
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 max-w-[150px]">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Sections
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Lectures
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Thời lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Drive Link
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <tr
                key={course.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {course.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a
                    href={`/courses/${course.slug || course.id}`}
                    className="block relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    {course.thumbnail ? (
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    )}
                  </a>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/courses/${course.slug || course.id}`}
                      className="text-gray-900 font-medium hover:text-blue-600 hover:underline break-words"
                      title={course.title}
                    >
                      {course.title}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {course.course_url ? (
                    <a
                      href={transformUdemy(course.course_url) || course.course_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors"
                      title={transformUdemy(course.course_url) || course.course_url}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={course.category || ''}>
                  {course.category || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.total_sections !== null && course.total_sections !== undefined 
                    ? course.total_sections 
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {course.total_lectures !== null && course.total_lectures !== undefined 
                    ? course.total_lectures 
                    : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDuration(course.duration, course.total_duration_seconds)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      course.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {course.status === 'active' ? 'Active' : course.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {course.drive_link ? (
                    <a
                      href={course.drive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate max-w-xs">Drive Link</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => handleDownloadClick(course)}
                      disabled={downloadingId === course.id}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {downloadingId === course.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          <span>Đang tải...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(course.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteClick(course)}
                    disabled={deletingId === course.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingId === course.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    <span>Xóa</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'delete'}
        title="Xác nhận xóa khóa học"
        message={`Bạn có chắc chắn muốn xóa khóa học "${confirmDialog.course?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteConfirm}
        onClose={() => setConfirmDialog({ isOpen: false, course: null, type: null })}
        type="danger"
        loading={deletingId !== null}
      />
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'download'}
        title="Xác nhận download khóa học"
        message={`Bạn có chắc chắn muốn bắt đầu download khóa học "${confirmDialog.course?.title}"? Quá trình này có thể mất vài phút.`}
        confirmText="Download"
        cancelText="Hủy"
        onConfirm={handleDownloadConfirm}
        onClose={() => setConfirmDialog({ isOpen: false, course: null, type: null })}
        type="warning"
        loading={downloadingId !== null}
      />
    </>
  );
}
