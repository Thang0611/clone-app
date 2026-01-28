'use client';

/**
 * Learn Page - Compact mobile-friendly design
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { DirectorySelector } from '@/components/learning/DirectorySelector';
import { FolderOpen, Play, CheckCircle2, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LearnPage() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState<string>('');

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
    const courseSlug = folderName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    router.push(`/learn/${courseSlug}`);
  };

  const isSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="flex-1 px-3 sm:px-4 py-6 sm:py-10">
        <div className="mx-auto max-w-3xl">

          {/* Compact Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              📚 Học Offline
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Chọn folder chứa video khóa học đã tải về
            </p>
          </div>

          {/* Compact Features - Horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">Chọn Folder</span>
            </div>
            <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <Play className="w-4 h-4 text-indigo-500" />
              <span className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">Xem Video</span>
            </div>
            <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-200 dark:border-gray-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">Lưu Tiến Độ</span>
            </div>
          </div>

          {/* Browser Support Warning - Compact */}
          {!isSupported && (
            <div className="mb-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                    Yêu cầu Chrome hoặc Edge
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open('https://www.google.com/chrome/', '_blank')}
                      className="text-xs py-1 px-2"
                    >
                      Chrome
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.open('https://www.microsoft.com/edge', '_blank')}
                      className="text-xs py-1 px-2"
                    >
                      Edge
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Folder Selector - Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 sm:p-6 mb-6">
            <DirectorySelector
              onFolderSelected={handleFolderSelected}
              onError={(error) => console.error('[LearnPage] Error:', error)}
            />
          </div>

          {/* Compact Benefits - Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <Shield className="w-5 h-5 text-green-500 mb-1" />
              <p className="text-xs font-medium text-gray-900 dark:text-white">Offline</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Không cần internet</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <Shield className="w-5 h-5 text-blue-500 mb-1" />
              <p className="text-xs font-medium text-gray-900 dark:text-white">Bảo mật</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Video ở máy bạn</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <Zap className="w-5 h-5 text-purple-500 mb-1" />
              <p className="text-xs font-medium text-gray-900 dark:text-white">Portable</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Học nhiều máy</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <Zap className="w-5 h-5 text-indigo-500 mb-1" />
              <p className="text-xs font-medium text-gray-900 dark:text-white">Zero Install</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">Chỉ cần browser</p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
