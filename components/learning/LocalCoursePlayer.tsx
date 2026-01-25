'use client';

/**
 * LocalCoursePlayer - Component tổng hợp để học khóa học từ local folder
 * Phase 1: Tích hợp DirectorySelector + VideoScanner + LocalVideoPlayer
 */

import { useState, useEffect } from 'react';
import { DirectorySelector } from './DirectorySelector';
import { LocalVideoPlayer } from './LocalVideoPlayer';
import { ScanProgressBar } from './ScanProgressBar';
import type { VideoFile, ScanProgress } from '@/lib/video-scanner';
import { scanFolderRecursive } from '@/lib/video-scanner';
import { getCourseProgress, startAutoSync, stopAutoSync, saveProgressHybrid } from '@/lib/progress-manager';
import { saveMetadataCache, loadMetadataCache, isMetadataCacheValid } from '@/lib/video-metadata-cache';
import { syncProgressFromFileToIndexedDB } from '@/lib/progress-file-manager';
import { getApiUrl } from '@/lib/config';
import { X, Menu, CheckCircle2, PlayCircle, BookOpen, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LocalCoursePlayerProps {
  courseId: string;
  courseName?: string;
  deviceId?: string;
  className?: string;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function LocalCoursePlayer({
  courseId,
  courseName,
  deviceId,
  className = '',
  sidebarOpen = true,
  onToggleSidebar,
}: LocalCoursePlayerProps) {
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [isLoadingCache, setIsLoadingCache] = useState(false);

  // Group videos by section (folder structure) - MUST be declared before early return
  interface Section {
    title: string;
    videos: VideoFile[];
    index: number;
  }

  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [sections, setSections] = useState<Section[]>([]);

  // Load progress khi videos thay đổi
  useEffect(() => {
    async function loadProgress() {
      if (videos.length === 0) return;

      const progressList = await getCourseProgress(courseId);
      const map: Record<string, number> = {};

      progressList.forEach((p) => {
        map[p.lectureId] = p.progressPercent;
      });

      setProgressMap(map);
    }

    loadProgress();
  }, [videos, courseId]);

  // Auto-load cached directory handle khi component mount
  // Chỉ auto-load nếu folder name trong cache khớp với courseId hiện tại
  useEffect(() => {
    async function loadCachedHandle() {
      if (directoryHandle) return; // Đã có handle rồi

      try {
        const { loadDirectoryHandle, verifyDirectoryHandle } = await import('@/lib/directory-manager');
        const cached = await loadDirectoryHandle();
        
        if (cached) {
          // Check xem folder name có khớp với courseId không
          const cachedSlug = cached.folderName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          
          // Chỉ auto-load nếu folder name khớp với courseId
          if (cachedSlug === courseId) {
            const isValid = await verifyDirectoryHandle(cached.handle);
            if (isValid) {
              // Có cached handle và valid → tự động load
              console.log('[LocalCoursePlayer] ✅ Auto-loaded cached folder:', cached.folderName);
              await handleFolderSelected(cached.handle, cached.folderName);
            } else {
              // Handle invalid → Clear cache nhưng không show picker
              const { clearDirectoryHandle } = await import('@/lib/directory-manager');
              await clearDirectoryHandle();
              console.log('[LocalCoursePlayer] ⚠️ Cached folder invalid, cleared');
            }
          } else {
            console.log('[LocalCoursePlayer] ℹ️ Cached folder does not match courseId, skipping auto-load');
            // Folder name không khớp → không auto-load, chờ user chọn
          }
        } else {
          console.log('[LocalCoursePlayer] ℹ️ No cached folder found');
          // Không có cached folder → không làm gì, chờ user chọn
        }
      } catch (error) {
        console.error('[LocalCoursePlayer] Error loading cached folder:', error);
        // Lỗi → không làm gì, chờ user chọn
      }
    }

    loadCachedHandle();
  }, [courseId]); // Depend on courseId để re-check khi courseId thay đổi

  // Start auto-sync khi có deviceId
  useEffect(() => {
    if (deviceId && directoryHandle) {
      const apiUrl = getApiUrl();
      startAutoSync(`${apiUrl}/api/v1`, deviceId, 30);

      return () => {
        stopAutoSync();
      };
    }
  }, [deviceId, directoryHandle]);

  // Group videos into sections - use useEffect to prevent infinite loops
  useEffect(() => {
    if (videos.length === 0) {
      setSections([]);
      return;
    }

    const sectionMap = new Map<string, VideoFile[]>();
    
    videos.forEach((video) => {
      // Extract section from path (folder name)
      const pathParts = video.path.split('/').filter(p => p);
      let sectionTitle = 'Tất cả bài học';
      
      if (pathParts.length > 1) {
        // Có folder structure: lấy folder cha
        sectionTitle = pathParts[pathParts.length - 2];
      } else if (pathParts.length === 1) {
        // Video ở root, có thể có prefix số
        const fileName = pathParts[0];
        const match = fileName.match(/^(\d+)[-_.]/);
        if (match) {
          sectionTitle = `Phần ${match[1]}`;
        } else {
          sectionTitle = 'Tất cả bài học';
        }
      }
      
      if (!sectionMap.has(sectionTitle)) {
        sectionMap.set(sectionTitle, []);
      }
      sectionMap.get(sectionTitle)!.push(video);
    });
    
    // Convert to array and sort
    const newSections: Section[] = Array.from(sectionMap.entries()).map(([title, videos], index) => ({
      title,
      videos: videos.sort((a, b) => {
        // Sort videos within section by path
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        return collator.compare(a.path, b.path);
      }),
      index,
    }));
    
    // Sort sections by title (natural sort)
    newSections.sort((a, b) => {
      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
      return collator.compare(a.title, b.title);
    });
    
    setSections(newSections);
    
    // Auto-expand all sections when videos are first loaded
    if (newSections.length > 0 && expandedSections.size === 0) {
      setExpandedSections(new Set(newSections.map((_, i) => i)));
    }
  }, [videos, expandedSections.size]); // Depend on videos and expandedSections.size

  const handleFolderSelected = async (
    handle: FileSystemDirectoryHandle,
    name: string
  ) => {
    setDirectoryHandle(handle);
    setFolderName(name);
    setError(null);
    setIsLoadingCache(true);

    try {
      let scannedVideos: VideoFile[] = [];
      
      // Phase 2: Try load metadata cache first
      const cachedMetadata = await loadMetadataCache(name);
      
      if (cachedMetadata) {
        console.log('[LocalCoursePlayer] 📦 Found cached metadata, validating...');
        
        // Quick scan để validate cache (chỉ check files, không load handles)
        // For now, we'll do a full scan but can optimize later
        setIsLoadingCache(false);
        setIsScanning(true);
        setScanProgress({ count: 0, currentPath: '', totalFoldersScanned: 0, totalFoldersRemaining: 1 });
        
        scannedVideos = await scanFolderRecursive(handle, (progress) => {
          setScanProgress(progress);
        });

        // Validate cache
        const isValid = await isMetadataCacheValid(cachedMetadata, scannedVideos);
        
        if (isValid && cachedMetadata.videos.length === scannedVideos.length) {
          // Cache is valid, use it (but we already scanned, so use scanned results)
          // In future, we can optimize to not scan if cache is valid
          console.log('[LocalCoursePlayer] ✅ Cache is valid, using scanned results');
        } else {
          // Cache invalid, save new cache
          await saveMetadataCache(name, scannedVideos);
        }
      } else {
        // No cache, do full scan
        setIsLoadingCache(false);
        setIsScanning(true);
        setScanProgress({ count: 0, currentPath: '', totalFoldersScanned: 0, totalFoldersRemaining: 1 });
        
        scannedVideos = await scanFolderRecursive(handle, (progress) => {
          setScanProgress(progress);
        });

        // Save metadata cache
        await saveMetadataCache(name, scannedVideos);
      }

      // Set videos state
      setVideos(scannedVideos);

      // Phase 2: Sync progress from file if available
      try {
        const syncedCount = await syncProgressFromFileToIndexedDB(
          handle,
          courseId,
          async (progress) => {
            // Save to IndexedDB
            const { saveProgress } = await import('@/lib/progress-manager');
            await saveProgress(progress);
          }
        );
        if (syncedCount > 0) {
          console.log(`[LocalCoursePlayer] ✅ Synced ${syncedCount} progress items from file`);
          // Reload progress map
          const progressList = await getCourseProgress(courseId);
          const map: Record<string, number> = {};
          progressList.forEach((p) => {
            map[p.lectureId] = p.progressPercent;
          });
          setProgressMap(map);
        }
      } catch (fileError) {
        console.warn('[LocalCoursePlayer] ⚠️ Could not sync from file:', fileError);
        // Continue, file sync is optional
      }

      // Auto-select video đầu tiên nếu có
      if (scannedVideos.length > 0 && !selectedVideo) {
        setSelectedVideo(scannedVideos[0]);
      }
    } catch (err) {
      console.error('[LocalCoursePlayer] Error scanning folder:', err);
      setError(err instanceof Error ? err.message : 'Lỗi khi quét folder');
    } finally {
      setIsScanning(false);
      setIsLoadingCache(false);
    }
  };

  const handleVideosScanned = (scannedVideos: VideoFile[]) => {
    setVideos(scannedVideos);
    if (scannedVideos.length > 0 && !selectedVideo) {
      setSelectedVideo(scannedVideos[0]);
    }
  };

  const handleError = (err: Error) => {
    setError(err.message);
  };

  const handleVideoSelect = (video: VideoFile) => {
    setSelectedVideo(video);
  };

  const handleProgressUpdate = (videoPath: string, progress: number) => {
    setProgressMap((prev) => ({
      ...prev,
      [videoPath]: progress,
    }));
  };

  // Tự động chuyển sang video tiếp theo khi video hiện tại kết thúc
  const handleVideoEnded = () => {
    if (!selectedVideo || videos.length === 0) return;

    const currentIndex = videos.findIndex((v) => v.path === selectedVideo.path);
    
    // Tìm video tiếp theo
    if (currentIndex >= 0 && currentIndex < videos.length - 1) {
      const nextVideo = videos[currentIndex + 1];
      console.log(`[LocalCoursePlayer] 🎬 Auto-playing next video: ${nextVideo.displayName}`);
      setSelectedVideo(nextVideo);
      
      // Scroll to top để user thấy video mới
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      console.log('[LocalCoursePlayer] ✅ Đã xem hết tất cả videos');
    }
  };

  if (!directoryHandle) {
    return (
      <div className={className}>
        <DirectorySelector
          onFolderSelected={handleFolderSelected}
          onVideosScanned={handleVideosScanned}
          onError={handleError}
        />
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    );
  }

  // Calculate course progress
  const totalVideos = videos.length;
  const completedVideos = videos.filter((v) => (progressMap[v.path] || 0) >= 95).length;
  const courseProgress = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className={`flex h-[calc(100vh-160px)] gap-4 ${className}`}>
      {/* Main - Video player (eLearning style) */}
      <div className="flex-1 min-w-0">
        {selectedVideo && directoryHandle ? (
          <div className="relative flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
            {/* Video Title Bar */}
            <div className="relative border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-gray-700 dark:bg-gray-800/50">
              <div className="flex items-center justify-between">
                <h3 className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedVideo.displayName}
                </h3>
                {!sidebarOpen && onToggleSidebar && (
                  <button
                    onClick={onToggleSidebar}
                    className="ml-2 flex-shrink-0 rounded-md p-1.5 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                    title="Mở danh sách bài học"
                  >
                    <Menu className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Video Player - Auto Fit */}
            <div className="relative flex-1 w-full overflow-hidden bg-black flex items-center justify-center">
              <LocalVideoPlayer
                video={selectedVideo}
                courseId={courseId}
                directoryHandle={directoryHandle}
                onProgressUpdate={(progress) => handleProgressUpdate(selectedVideo.path, progress)}
                onVideoEnded={handleVideoEnded}
                autoPlay={true}
                className="h-full w-full max-h-full max-w-full"
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white dark:border-gray-700 dark:from-gray-800 dark:to-gray-900">
            <div className="text-center px-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30">
                <PlayCircle className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                Chọn video để bắt đầu học
              </h3>
              <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
                Chọn một bài học từ danh sách bên phải để bắt đầu xem
              </p>
              {!sidebarOpen && onToggleSidebar && (
                <Button
                  variant="primary"
                  className="mt-4"
                  onClick={onToggleSidebar}
                >
                  <Menu className="mr-2 h-4 w-4" />
                  Mở danh sách bài học
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - Danh sách video (eLearning style) */}
      <div
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } flex-shrink-0 transition-all duration-300 overflow-hidden`}
      >
        <div className="h-full rounded-lg border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800">
          {/* Sidebar Header */}
          <div className="border-b border-gray-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-5 dark:border-gray-700 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="truncate font-semibold text-gray-900 dark:text-gray-100">
                  {courseName || 'Danh sách bài học'}
                </h2>
                {folderName && (
                  <p className="mt-1 truncate text-xs text-gray-600 dark:text-gray-400">
                    {folderName}
                  </p>
                )}
              </div>
              {onToggleSidebar && (
                <button
                  onClick={onToggleSidebar}
                  className="ml-2 flex-shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Course Progress */}
            {totalVideos > 0 && (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>Tiến độ khóa học</span>
                  <span className="font-medium">
                    {completedVideos}/{totalVideos} bài
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs font-medium text-gray-700 dark:text-gray-300">
                  {courseProgress.toFixed(0)}% hoàn thành
                </p>
              </div>
            )}

            {isLoadingCache && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                <span>Đang tải cache...</span>
              </div>
            )}
            {isScanning && scanProgress && (
              <div className="mt-3">
                <ScanProgressBar progress={scanProgress} />
              </div>
            )}
          </div>

          {/* Video List - Organized by Sections */}
          <div className="h-[calc(100%-140px)] overflow-y-auto bg-gradient-to-b from-white to-slate-50 dark:from-gray-800 dark:to-gray-900/50">
            {videos.length === 0 ? (
              <div className="flex h-full items-center justify-center p-4">
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {isScanning ? 'Đang quét folder...' : 'Không tìm thấy video'}
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {sections.map((section, sectionIndex) => {
                  const isExpanded = expandedSections.has(sectionIndex);
                  const sectionCompleted = section.videos.filter(
                    (v) => (progressMap[v.path] || 0) >= 95
                  ).length;
                  const sectionProgress =
                    section.videos.length > 0
                      ? (sectionCompleted / section.videos.length) * 100
                      : 0;

                  return (
                    <div
                      key={sectionIndex}
                      className="mb-3 rounded-xl border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow dark:border-gray-700 dark:bg-gray-800"
                    >
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(sectionIndex)}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 via-white to-slate-50 hover:from-blue-50 hover:via-white hover:to-blue-50 transition-all text-left rounded-t-xl dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 dark:hover:from-gray-700"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded dark:bg-primary-900/30 dark:text-primary-400">
                              Phần {sectionIndex + 1}
                            </span>
                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                              {section.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {section.videos.length} bài học
                            </span>
                            {sectionProgress > 0 && (
                              <span className="text-primary-600 dark:text-primary-400">
                                {sectionProgress.toFixed(0)}% hoàn thành
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Section Lectures */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gradient-to-b from-white to-slate-50/50 dark:border-gray-700 dark:from-gray-800 dark:to-gray-900/50 rounded-b-xl">
                          <div className="p-3 space-y-1.5">
                            {section.videos.map((video, videoIndex) => {
                              const progress = progressMap[video.path] || 0;
                              const isSelected = selectedVideo?.path === video.path;
                              const isCompleted = progress >= 95;

                              return (
                                <button
                                  key={video.path}
                                  onClick={() => handleVideoSelect(video)}
                                  className={`group w-full rounded-lg p-3 text-left transition-all ${
                                    isSelected
                                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md ring-2 ring-blue-500 dark:from-blue-900/30 dark:to-indigo-900/30 dark:ring-blue-400'
                                      : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50'
                                  }`}
                                >
                                  <div className="flex items-start gap-2.5">
                                    <div className="flex-shrink-0 mt-0.5">
                                      {isCompleted ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                      ) : isSelected ? (
                                        <PlayCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                      ) : (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {videoIndex + 1}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`text-xs font-medium leading-snug ${
                                          isSelected
                                            ? 'text-blue-900 dark:text-blue-100'
                                            : 'text-gray-900 dark:text-gray-100'
                                        }`}
                                      >
                                        {video.displayName}
                                      </p>
                                      {progress > 0 && (
                                        <div className="mt-1.5">
                                          <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                            <div
                                              className={`h-full transition-all ${
                                                isCompleted
                                                  ? 'bg-green-500'
                                                  : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                              }`}
                                              style={{ width: `${progress}%` }}
                                            />
                                          </div>
                                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                            {progress.toFixed(0)}%
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
