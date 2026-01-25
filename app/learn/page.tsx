'use client';

/**
 * Learn Page - Trang chọn folder để học
 * Thiết kế theo chuẩn eLearning
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DirectorySelector } from '@/components/learning/DirectorySelector';
import { FolderOpen, BookOpen, Play, CheckCircle2, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

export default function LearnPage() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState<string>('');

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

  const handleFolderSelected = async (
    handle: FileSystemDirectoryHandle,
    folderName: string
  ) => {
    // Generate course ID từ folder name (slugify)
    const courseSlug = folderName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Navigate to course page
    router.push(`/learn/${courseSlug}`);
  };

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <main className="flex-1">
        

        {/* Main Content */}
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Features Grid */}
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            <Card className="border-2 border-transparent transition-all hover:border-blue-200 hover:shadow-lg dark:hover:border-blue-800">
              <CardBody className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                  <FolderOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Chọn Folder
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chọn folder chứa video khóa học đã tải về từ máy tính
                </p>
              </CardBody>
            </Card>

            <Card className="border-2 border-transparent transition-all hover:border-indigo-200 hover:shadow-lg dark:hover:border-indigo-800">
              <CardBody className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                  <Play className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Xem Video
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Phát video trực tiếp từ ổ cứng, không cần upload hay stream
                </p>
              </CardBody>
            </Card>

            <Card className="border-2 border-transparent transition-all hover:border-purple-200 hover:shadow-lg dark:hover:border-purple-800">
              <CardBody className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                  <CheckCircle2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Lưu Tiến Độ
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tự động lưu tiến độ học tập, tiếp tục từ vị trí đã xem
                </p>
              </CardBody>
            </Card>
          </div>

          {/* Browser Support Warning */}
          {!isSupported && (
            <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                    <span className="text-xl">⚠️</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-300">
                    Trình duyệt không hỗ trợ
                  </h3>
                  <p className="mb-3 text-sm text-yellow-700 dark:text-yellow-400">
                    Tính năng này yêu cầu Chrome hoặc Edge (phiên bản mới). Vui lòng sử dụng
                    trình duyệt được hỗ trợ để có trải nghiệm tốt nhất.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open('https://www.google.com/chrome/', '_blank')}
                      className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/30"
                    >
                      Tải Chrome
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open('https://www.microsoft.com/edge', '_blank')}
                      className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-300 dark:hover:bg-yellow-900/30"
                    >
                      Tải Edge
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Folder Selector Card */}
          <Card className="border-2 border-gray-200 shadow-xl dark:border-gray-700">
            <CardBody className="p-8">
              <div className="mb-6 text-center">
                <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Bắt Đầu Học Ngay
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Chọn folder chứa video khóa học để bắt đầu
                </p>
              </div>

              <DirectorySelector
                onFolderSelected={handleFolderSelected}
                onError={(error) => {
                  console.error('[LearnPage] Error:', error);
                }}
              />
            </CardBody>
          </Card>

          {/* How It Works */}
          <div className="mt-12">
            <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-100">
              Cách Thức Hoạt Động
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  1
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                  Chọn Folder
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click nút "Chọn Folder Khóa Học" và chọn folder chứa video
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  2
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                  Quét Video
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Hệ thống tự động quét và hiển thị danh sách video
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  3
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                  Bắt Đầu Học
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click vào video để bắt đầu xem, tự động tiếp tục từ vị trí đã xem
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  4
                </div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                  Lưu Tiến Độ
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tiến độ được tự động lưu, có thể mang theo khi copy folder
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
              Tại Sao Chọn Giải Pháp Này?
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                    Hoàn Toàn Offline
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Không cần internet, học mọi lúc mọi nơi
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                    Bảo Mật Tuyệt Đối
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Video không bao giờ rời khỏi máy tính của bạn
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                    Portable Progress
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Copy folder → Progress đi theo, học trên nhiều máy
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
                    Zero Install
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Không cần cài đặt phần mềm, chỉ cần trình duyệt
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
