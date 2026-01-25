'use client';

/**
 * DirectorySelector - Component chọn folder với UX tối ưu
 * Phase 1: Permission UX Flow + Error Handling
 */

import { useState, useEffect } from 'react';
import {
  requestDirectoryAccess,
  requestNewDirectoryAccess,
  getCachedFolderName,
  clearDirectoryHandle,
  getAllFolders,
  removeFolderFromList,
  saveDirectoryHandle,
  type DirectoryHandleData,
} from '@/lib/directory-manager';
import type { VideoFile } from '@/lib/video-scanner';

interface DirectorySelectorProps {
  onFolderSelected: (handle: FileSystemDirectoryHandle, folderName: string) => void;
  onVideosScanned?: (videos: VideoFile[]) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function DirectorySelector({
  onFolderSelected,
  onVideosScanned,
  onError,
  className = '',
}: DirectorySelectorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cachedFolderName, setCachedFolderName] = useState<string | null>(null);
  const [isCheckingCache, setIsCheckingCache] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [foldersList, setFoldersList] = useState<DirectoryHandleData[]>([]);

  // Set mounted flag để tránh hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check cached folder name và load danh sách folders khi component mount (chỉ trên client)
  useEffect(() => {
    if (!isMounted) return;

    async function checkCache() {
      try {
        const name = await getCachedFolderName();
        setCachedFolderName(name);
        
        // Load danh sách tất cả folders
        const folders = await getAllFolders();
        setFoldersList(folders);
      } catch (error) {
        console.error('[DirectorySelector] Error checking cache:', error);
      } finally {
        setIsCheckingCache(false);
      }
    }

    checkCache();
  }, [isMounted]);

  const handleSelectFolder = async () => {
    setIsLoading(true);

    try {
      const result = await requestDirectoryAccess();

      if (!result) {
        // User cancelled
        setIsLoading(false);
        return;
      }

      const { handle, folderName, isCached } = result;

      // Update cached folder name
      setCachedFolderName(folderName);
      
      // Reload folders list
      const folders = await getAllFolders();
      setFoldersList(folders);

      // Callback
      onFolderSelected(handle, folderName);

      // If not cached, scan videos
      if (!isCached && onVideosScanned) {
        const { scanFolderRecursive } = await import('@/lib/video-scanner');
        const videos = await scanFolderRecursive(handle, (progress) => {
          console.log(`[DirectorySelector] Scanning: ${progress.count} videos found (${progress.currentPath})`);
        });
        onVideosScanned(videos);
      }
    } catch (error) {
      console.error('[DirectorySelector] Error:', error);
      const err = error instanceof Error ? error : new Error('Unknown error');
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueWithCached = async () => {
    await handleSelectFolder();
  };

  const handleSelectNewFolder = async () => {
    setIsLoading(true);

    try {
      // Force show picker, bypass cache
      const result = await requestNewDirectoryAccess();

      if (!result) {
        // User cancelled
        setIsLoading(false);
        return;
      }

      const { handle, folderName } = result;

      // Update cached folder name
      setCachedFolderName(folderName);
      
      // Reload folders list
      const folders = await getAllFolders();
      setFoldersList(folders);

      // Callback
      onFolderSelected(handle, folderName);

      // Scan videos for new folder
      if (onVideosScanned) {
        const { scanFolderRecursive } = await import('@/lib/video-scanner');
        const videos = await scanFolderRecursive(handle, (progress) => {
          console.log(`[DirectorySelector] Scanning: ${progress.count} videos found (${progress.currentPath})`);
        });
        onVideosScanned(videos);
      }
    } catch (error) {
      console.error('[DirectorySelector] Error:', error);
      const err = error instanceof Error ? error : new Error('Unknown error');
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      await clearDirectoryHandle();
      setCachedFolderName(null);
      const folders = await getAllFolders();
      setFoldersList(folders);
    } catch (error) {
      console.error('[DirectorySelector] Error clearing cache:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to clear cache'));
    }
  };

  const handleSelectFolderFromList = async (folder: DirectoryHandleData) => {
    setIsLoading(true);
    try {
      // Set as current handle
      await saveDirectoryHandle(folder.handle, folder.folderName);
      setCachedFolderName(folder.folderName);
      
      // Callback
      onFolderSelected(folder.handle, folder.folderName);
    } catch (error) {
      console.error('[DirectorySelector] Error selecting folder from list:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to select folder'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFolder = async (folderName: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering folder selection
    try {
      await removeFolderFromList(folderName);
      const folders = await getAllFolders();
      setFoldersList(folders);
      
      // If removed folder was current, clear current
      if (cachedFolderName === folderName) {
        await clearDirectoryHandle();
        setCachedFolderName(null);
      }
    } catch (error) {
      console.error('[DirectorySelector] Error removing folder:', error);
      onError?.(error instanceof Error ? error : new Error('Failed to remove folder'));
    }
  };

  // Check browser support
  const isSupported = typeof window !== 'undefined' && 'showDirectoryPicker' in window;

  if (!isSupported) {
    return (
      <div className={`rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20 ${className}`}>
        <div className="flex items-start gap-3">
          <span className="text-yellow-600 dark:text-yellow-400 text-xl">⚠️</span>
          <div className="flex-1">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
              Trình duyệt không hỗ trợ
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              Tính năng này yêu cầu Chrome hoặc Edge (phiên bản mới). Vui lòng sử dụng trình duyệt
              được hỗ trợ để có trải nghiệm tốt nhất.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Không render gì trên server để tránh hydration mismatch
  if (!isMounted || isCheckingCache) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
        <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">Đang kiểm tra...</span>
      </div>
    );
  }

  // Hiển thị danh sách folders và nút thêm folder mới
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Danh sách folders đã chọn */}
      {foldersList.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Folders đã chọn ({foldersList.length})
          </h3>
          <div className="space-y-2">
            {foldersList.map((folder, index) => (
              <div
                key={`${folder.folderName}-${folder.savedAt}`}
                onClick={() => handleSelectFolderFromList(folder)}
                className={`group relative flex items-center justify-between rounded-lg border p-3 transition-all cursor-pointer ${
                  cachedFolderName === folder.folderName
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-700 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl">📂</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {folder.folderName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(folder.savedAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                {cachedFolderName === folder.folderName && (
                  <span className="ml-2 rounded-full bg-blue-600 px-2 py-1 text-xs font-medium text-white">
                    Đang dùng
                  </span>
                )}
                <button
                  onClick={(e) => handleRemoveFolder(folder.folderName, e)}
                  className="ml-2 opacity-0 group-hover:opacity-100 rounded p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  title="Xóa folder"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nút thêm folder mới */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSelectNewFolder}
          disabled={isLoading}
          className="w-full rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 text-center transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-blue-500 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Đang xử lý...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl">➕</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {foldersList.length > 0 ? 'Thêm Folder Mới' : 'Chọn Folder Khóa Học'}
                </h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {foldersList.length > 0
                    ? 'Chọn folder chứa video khóa học khác'
                    : 'Chọn folder chứa các video khóa học đã tải về'}
                </p>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
