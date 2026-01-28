'use client';

/**
 * LocalCoursePlayer - Component tổng hợp để học khóa học từ local folder
 * Phase 1: Tích hợp DirectorySelector + VideoScanner + LocalVideoPlayer
 */

import { useState, useEffect, useRef } from 'react';
import { DirectorySelector } from './DirectorySelector';
import { VidstackVideoPlayer } from './VidstackVideoPlayer';
import { ScanProgressBar } from './ScanProgressBar';
import type { VideoFile, ScanProgress } from '@/lib/video-scanner';
import { scanFolderRecursive, cleanFileName } from '@/lib/video-scanner';
import { getCourseProgress, startAutoSync, stopAutoSync, saveProgressHybrid, type VideoProgress } from '@/lib/progress-manager';
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
  // Resource folder interface
  interface ResourceFolder {
    name: string;
    path: string;
    displayName: string;
    resourceCount: number;
    fileTypes: string[];
    handle: FileSystemDirectoryHandle;
  }

  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [resourceFolders, setResourceFolders] = useState<ResourceFolder[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoFile | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [progressDataMap, setProgressDataMap] = useState<Record<string, VideoProgress>>({});
  const [isLoadingCache, setIsLoadingCache] = useState(false);
  const [nextVideoCountdown, setNextVideoCountdown] = useState<number>(0);
  const [nextVideoScheduled, setNextVideoScheduled] = useState<VideoFile | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextVideoTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentLectureRef = useRef<HTMLButtonElement | null>(null);

  // Group videos by section (folder structure) - MUST be declared before early return
  interface SectionItem {
    type: 'video' | 'folder';
    video?: VideoFile;
    folder?: ResourceFolder;
  }

  interface Section {
    title: string;
    items: SectionItem[];
    index: number;
  }

  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set());
  const [sections, setSections] = useState<Section[]>([]);

  // scanResourceFolders - Find folders containing resource files only (no videos)
  async function scanResourceFolders(
    rootHandle: FileSystemDirectoryHandle,
    videos: VideoFile[]
  ): Promise<ResourceFolder[]> {
    const folders: ResourceFolder[] = [];
    const videoFolders = new Set(videos.map(v => {
      const parts = v.path.split('/');
      return parts.length > 1 ? parts.slice(0, -1).join('/') : '';
    }));

    // Scan all directories
    for await (const entry of rootHandle.values()) {
      if (entry.kind === 'directory') {
        const dirHandle = entry as FileSystemDirectoryHandle;
        const folderPath = entry.name;
        
        // Skip if this folder has videos
        if (videoFolders.has(folderPath)) continue;
        
        // Count resource files
        let resourceCount = 0;
        const fileTypes = new Set<string>();
        
        try {
          for await (const fileEntry of dirHandle.values()) {
            if (fileEntry.kind === 'file') {
              const fileName = fileEntry.name;
              const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.')).substring(1);
              
              // Check if resource file
              if (['zip', 'pdf', 'html', 'md', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'json', 'csv'].includes(ext)) {
                resourceCount++;
                fileTypes.add(ext);
              }
            }
          }
        } catch (err) {
          // Could not scan folder
        }
        
        // Only add if has resources
        if (resourceCount > 0) {
          folders.push({
            name: entry.name,
            path: folderPath,
            displayName: cleanFileName(entry.name),
            resourceCount,
            fileTypes: Array.from(fileTypes),
            handle: dirHandle
          });
        }
      }
    }
    
    return folders;
  }

  // Load progress khi videos thay đổi
  useEffect(() => {
    async function loadProgress() {
      if (videos.length === 0) return;

      const progressList = await getCourseProgress(courseId);
      const map: Record<string, number> = {};
      const dataMap: Record<string, VideoProgress> = {};

      progressList.forEach((p) => {
        map[p.lectureId] = p.progressPercent;
        dataMap[p.lectureId] = p;
      });

      setProgressMap(map);
      setProgressDataMap(dataMap);
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
              await handleFolderSelected(cached.handle, cached.folderName);
            } else {
              // Handle invalid → Clear cache nhưng không show picker
              const { clearDirectoryHandle } = await import('@/lib/directory-manager');
              await clearDirectoryHandle();
            }
          } else {
            // Folder name không khớp → không auto-load, chờ user chọn
          }
        } else {
          // Không có cached folder → không làm gì, chờ user chọn
        }
      } catch (error) {
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

  // Group videos and resource folders into sections - use useEffect to prevent infinite loops
  useEffect(() => {
    if (videos.length === 0 && resourceFolders.length === 0) {
      setSections([]);
      return;
    }

    const sectionMap = new Map<string, SectionItem[]>();
    
    // Add videos
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
      sectionMap.get(sectionTitle)!.push({ type: 'video', video });
    });
    
    // Add resource folders
    resourceFolders.forEach((folder) => {
      const sectionTitle = folder.name; // Folder name is the section
      
      if (!sectionMap.has(sectionTitle)) {
        sectionMap.set(sectionTitle, []);
      }
      sectionMap.get(sectionTitle)!.push({ type: 'folder', folder });
    });
    
    // Convert to array and sort
    const newSections: Section[] = Array.from(sectionMap.entries()).map(([title, items], index) => ({
      title,
      items: items.sort((a, b) => {
        // Videos first, then folders
        if (a.type === 'video' && b.type === 'folder') return -1;
        if (a.type === 'folder' && b.type === 'video') return 1;
        
        // Sort by path/name
        const aPath = a.video?.path || a.folder?.path || '';
        const bPath = b.video?.path || b.folder?.path || '';
        const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
        return collator.compare(aPath, bPath);
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
  }, [videos, resourceFolders, expandedSections.size]); // Depend on videos, resourceFolders, and expandedSections.size

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
        // console.log('[LocalCoursePlayer] 📦 Found cached metadata, validating...');
        
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
          // console.log('[LocalCoursePlayer] ✅ Cache is valid, using scanned results');
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

      // Scan for resource folders
      try {
        const scannedResourceFolders = await scanResourceFolders(handle, scannedVideos);
        setResourceFolders(scannedResourceFolders);
        // console.log(`[LocalCoursePlayer] 📁 Found ${scannedResourceFolders.length} resource folders`);
      } catch (err) {
        // console.warn('[LocalCoursePlayer] Could not scan resource folders:', err);
        setResourceFolders([]);
      }

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
          // console.log(`[LocalCoursePlayer] ✅ Synced ${syncedCount} progress items from file`);
          // Reload progress map
          const progressList = await getCourseProgress(courseId);
          const map: Record<string, number> = {};
          progressList.forEach((p) => {
            map[p.lectureId] = p.progressPercent;
          });
          setProgressMap(map);
        }
      } catch (fileError) {
        // console.warn('[LocalCoursePlayer] ⚠️ Could not sync from file:', fileError);
        // Continue, file sync is optional
      }

      // Auto-select video để tiếp tục xem:
      // 1. Tìm video xem lần cuối (lastWatchedAt mới nhất và chưa xem hết)
      // 2. Nếu không có, chọn video đầu tiên
      if (scannedVideos.length > 0 && !selectedVideo) {
        try {
          const progressList = await getCourseProgress(courseId);
          
          // Tìm video xem lần cuối (chưa hoàn thành)
          let lastWatchedVideo: VideoFile | undefined = undefined;
          let lastWatchedTime = 0;
          
          for (const p of progressList) {
            // Chỉ xét video chưa xem hết (< 95%)
            if (p.progressPercent < 95 && p.lastWatchedAt > lastWatchedTime) {
              const video = scannedVideos.find(v => v.path === p.lectureId);
              if (video) {
                lastWatchedVideo = video;
                lastWatchedTime = p.lastWatchedAt;
              }
            }
          }
          
          if (lastWatchedVideo) {
            // console.log(`[LocalCoursePlayer] 🎯 Auto-selecting last watched video: ${lastWatchedVideo.displayName}`);
            setSelectedVideo(lastWatchedVideo);
          } else {
            // Không có video đang xem → chọn video đầu tiên
            setSelectedVideo(scannedVideos[0]);
          }
        } catch (err) {
          // console.error('[LocalCoursePlayer] Error finding last watched video:', err);
          // Fallback: chọn video đầu tiên
          setSelectedVideo(scannedVideos[0]);
        }
      }
    } catch (err) {
      // console.error('[LocalCoursePlayer] Error scanning folder:', err);
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

  const handleVideoSelect = async (video: VideoFile) => {
    // Check if video is completed (progress >= 95%)
    const currentProgress = progressMap[video.path] || 0;
    
    if (currentProgress >= 95) {
      // Video đã xem hết 100% → Reset progress để xem lại từ đầu
      // console.log(`[LocalCoursePlayer] 🔄 Resetting completed video: ${video.displayName}`);
      
      try {
        // Reset progress trong IndexedDB
        const resetProgress = {
          courseId,
          lectureId: video.path,
          progressPercent: 0,
          currentTimeSeconds: 0,
          totalDurationSeconds: 0,
          completed: false,
          lastWatchedAt: Date.now(),
        };
        
        await saveProgressHybrid(resetProgress, directoryHandle || undefined);
        
        // Update progressMap
        setProgressMap((prev) => ({
          ...prev,
          [video.path]: 0,
        }));
      } catch (err) {
        // console.error('[LocalCoursePlayer] Error resetting progress:', err);
      }
    }
    
    setSelectedVideo(video);
  };

  const handleProgressUpdate = (videoPath: string, progress: number) => {
    setProgressMap((prev) => ({
      ...prev,
      [videoPath]: progress,
    }));
  };

  // Clear countdown timers
  const clearCountdownTimers = () => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (nextVideoTimeoutRef.current) {
      clearTimeout(nextVideoTimeoutRef.current);
      nextVideoTimeoutRef.current = null;
    }
    setNextVideoCountdown(0);
    setNextVideoScheduled(null);
  };

  // Cancel next video auto-play
  const handleCancelNextVideo = () => {
    console.log('[LocalCoursePlayer] ❌ User cancelled next video');
    clearCountdownTimers();
  };

  // Replay current video
  const handleReplayVideo = async () => {
    console.log('[LocalCoursePlayer] 🔄 Replaying current video');
    clearCountdownTimers();
    
    if (selectedVideo) {
      // Reset progress to restart from beginning
      try {
        const resetProgress = {
          courseId,
          lectureId: selectedVideo.path,
          progressPercent: 0,
          currentTimeSeconds: 0,
          totalDurationSeconds: 0,
          completed: false,
          lastWatchedAt: Date.now(),
        };
        
        await saveProgressHybrid(resetProgress, directoryHandle || undefined);
        
        // Update progressMap
        setProgressMap((prev) => ({
          ...prev,
          [selectedVideo.path]: 0,
        }));
        
        // Re-select video to trigger reload
        setSelectedVideo(null);
        setTimeout(() => setSelectedVideo(selectedVideo), 100);
      } catch (err) {
        console.error('[LocalCoursePlayer] Error resetting progress:', err);
      }
    }
  };

  // Tự động chuyển sang video tiếp theo khi video hiện tại kết thúc
  // Chờ 5 giây với countdown UI
  const handleVideoEnded = () => {
    if (!selectedVideo || videos.length === 0) return;

    const currentIndex = videos.findIndex((v) => v.path === selectedVideo.path);
    
    // Tìm video tiếp theo
    if (currentIndex >= 0 && currentIndex < videos.length - 1) {
      const nextVideo = videos[currentIndex + 1];
      console.log(`[LocalCoursePlayer] ⏳ Waiting 5 seconds before next video: ${nextVideo.displayName}`);
      
      // Set next video scheduled
      setNextVideoScheduled(nextVideo);
      setNextVideoCountdown(5);
      
      // Countdown interval (update every second)
      countdownIntervalRef.current = setInterval(() => {
        setNextVideoCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) {
              clearInterval(countdownIntervalRef.current);
              countdownIntervalRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Schedule next video
      nextVideoTimeoutRef.current = setTimeout(() => {
        console.log(`[LocalCoursePlayer] 🎬 Auto-playing next video: ${nextVideo.displayName}`);
        clearCountdownTimers();
        setSelectedVideo(nextVideo);
        
        // Scroll to top để user thấy video mới
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 5000); // 5 seconds delay
    } else {
      console.log('[LocalCoursePlayer] ✅ Đã xem hết tất cả videos');
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearCountdownTimers();
    };
  }, []);

  // Scroll to current lecture when selected video changes
  useEffect(() => {
    if (currentLectureRef.current && selectedVideo) {
      currentLectureRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedVideo]);

  if (!directoryHandle) {
    return (
      <div className={className}>
        <DirectorySelector
          onFolderSelected={handleFolderSelected}
          onVideosScanned={handleVideosScanned}
          onError={handleError}
        />
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    );
  }

  // Calculate course progress
  const totalVideos = videos.length;
  const completedVideos = videos.filter((v) => (progressMap[v.path] || 0) >= 95).length;
  const courseProgress = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  // Helper: Extract lesson number from filename (015 → 15)
  const extractLessonNumber = (displayName: string): string => {
    const match = displayName.match(/^0*(\d+)/);
    return match ? match[1] : '';
  };

  // Helper: Format seconds to MM:SS or HH:MM:SS
  const formatTime = (seconds: number): string => {
    if (!seconds || seconds === 0) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

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
    <div className={`flex h-screen gap-2 ${className} py-14`}>
      {/* Main - Video player (eLearning style) */}
      <div className="flex-1 min-w-0">
        {selectedVideo && directoryHandle ? (
          <div className="relative flex h-full flex-col rounded border border-gray-200 bg-white shadow-lg">
            {/* Video Title Bar */}
            <div className="relative border-b border-gray-200 bg-gray-50 px-4 py-2">
              <div className="flex items-center justify-between">
                <h3 className="truncate text-sm font-medium text-gray-900">
                  {selectedVideo.displayName}
                </h3>
                {!sidebarOpen && onToggleSidebar && (
                  <button
                    onClick={onToggleSidebar}
                    className="ml-2 flex-shrink-0 rounded-md p-1.5 text-gray-500 hover:bg-gray-200 transition-colors"
                    title="Mở danh sách bài học"
                  >
                    <Menu className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Video Player - Auto Fit */}
            <div className="relative flex-1 w-full overflow-hidden bg-black flex items-center justify-center">
              <VidstackVideoPlayer
                video={selectedVideo}
                courseId={courseId}
                directoryHandle={directoryHandle}
                onProgressUpdate={(progress) => handleProgressUpdate(selectedVideo.path, progress)}
                onVideoEnded={handleVideoEnded}
                autoPlay={true}
                className="h-full w-full max-h-full max-w-full"
              />
              
              {/* Countdown Overlay - Show when next video is scheduled */}
              {nextVideoCountdown > 0 && nextVideoScheduled && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center">
                    {/* Countdown Circle */}
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl font-bold text-blue-600">
                          {nextVideoCountdown}
                        </div>
                      </div>
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - nextVideoCountdown / 5)}`}
                          className="text-blue-600 transition-all duration-1000"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    
                    {/* Next Video Info */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Video tiếp theo
                    </h3>
                    <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                      {nextVideoScheduled.displayName}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="ghost"
                        onClick={handleReplayVideo}
                        className="flex items-center gap-2"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Xem lại
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleCancelNextVideo}
                        className="flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Hủy
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center px-8">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100">
                <PlayCircle className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Chọn video để bắt đầu học
              </h3>
              <p className="mb-6 text-sm text-gray-600">
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
          sidebarOpen ? 'w-96' : 'w-0'
        } flex-shrink-0 transition-all duration-300 overflow-hidden`}
      >
        <div className="h-full rounded border border-gray-200 bg-white shadow-lg">
          {/* Sidebar Header */}
          <div className="border-b border-gray-200 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="truncate font-semibold text-gray-900">
                  {courseName || 'Danh sách bài học'}
                </h2>
                {folderName && (
                  <p className="mt-1 truncate text-xs text-gray-600">
                    {folderName}
                  </p>
                )}
              </div>
              {onToggleSidebar && (
                <button
                  onClick={onToggleSidebar}
                  className="ml-2 flex-shrink-0 rounded-md p-1 text-gray-500 hover:bg-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Course Progress */}
            {totalVideos > 0 && (
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between text-xs text-gray-600">
                  <span>Tiến độ khóa học</span>
                  <span className="font-medium">
                    {completedVideos}/{totalVideos} bài
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                    style={{ width: `${courseProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs font-medium text-gray-700">
                  {courseProgress.toFixed(0)}% hoàn thành
                </p>
              </div>
            )}

            {isLoadingCache && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
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
          <div className="h-[calc(100%-120px)] overflow-y-auto bg-gradient-to-b from-white to-slate-50">
            {videos.length === 0 ? (
              <div className="flex h-full items-center justify-center p-2">
                <p className="text-center text-sm text-gray-500">
                  {isScanning ? 'Đang quét folder...' : 'Không tìm thấy video'}
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 p-2">
                {sections.map((section, sectionIndex) => {
                  const isExpanded = expandedSections.has(sectionIndex);
                  const videoItems = section.items.filter(i => i.type === 'video');
                  const folderItems = section.items.filter(i => i.type === 'folder');
                  const sectionCompleted = videoItems.filter(
                    (item) => (progressMap[item.video!.path] || 0) >= 95
                  ).length;
                  const sectionProgress =
                    videoItems.length > 0
                      ? (sectionCompleted / videoItems.length) * 100
                      : 0;

                  return (
                    <div
                      key={sectionIndex}
                      className="mb-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Section Header */}
                      <button
                        onClick={() => toggleSection(sectionIndex)}
                        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 via-white to-slate-50 hover:from-blue-50 hover:via-white hover:to-blue-50 transition-all text-left rounded-t-lg"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                              Phần {sectionIndex + 1}
                            </span>
                            <span className="font-semibold text-sm text-gray-900 line-clamp-2">
                              {section.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {videoItems.length} bài học
                              {folderItems.length > 0 && ` • ${folderItems.length} tài liệu`}
                            </span>
                            {sectionProgress > 0 && (
                              <span className="text-primary-600">
                                {sectionProgress.toFixed(0)}% hoàn thành
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                      </button>

                      {/* Section Lectures */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gradient-to-b from-white to-slate-50/50 rounded-b-lg">
                          <div className="p-2 space-y-1.5">
                            {section.items.map((item, itemIndex) => {
                              if (item.type === 'video') {
                                const video = item.video!;
                                const progress = progressMap[video.path] || 0;
                                const progressData = progressDataMap[video.path];
                                const isSelected = selectedVideo?.path === video.path;
                                const isCompleted = progress >= 95;

                                return (
                                  <button
                                    key={video.path}
                                    ref={isSelected ? currentLectureRef : null}
                                    onClick={() => handleVideoSelect(video)}
                                    className={`group w-full rounded-lg p-2.5 text-left transition-all ${
                                      isSelected
                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md ring-2 ring-blue-500'
                                        : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-slate-50'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2.5">
                                      <div className="flex-shrink-0 mt-0.5">
                                         {isCompleted ? (
                                           <CheckCircle2 className="h-4 w-4 text-green-600" />
                                         ) : isSelected ? (
                                           <PlayCircle className="h-4 w-4 text-blue-600" />
                                         ) : (
                                           <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100">
                                             <span className="text-xs font-medium text-gray-600">
                                               {extractLessonNumber(video.displayName) || (itemIndex + 1)}
                                             </span>
                                           </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p
                                          className={`text-xs font-medium leading-tight line-clamp-2 ${
                                            isSelected
                                              ? 'text-blue-900'
                                              : 'text-gray-900'
                                          }`}
                                        >
                                          {video.displayName}
                                        </p>
                                        {progressData && progressData.totalDurationSeconds > 0 && (
                                          <div className="mt-1.5">
                                            <div className="h-1 w-full rounded-full bg-gray-200">
                                              <div
                                                className={`h-full transition-all ${
                                                  isCompleted
                                                    ? 'bg-green-500'
                                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                                }`}
                                                style={{ width: `${progress}%` }}
                                              />
                                            </div>
                                            <div className="mt-0.5 flex items-center justify-between text-xs text-gray-500">
                                              {/* <span>{formatTime(progressData.currentTimeSeconds)}</span> */}
                                              <span>{formatTime(progressData.totalDurationSeconds)}</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </button>
                                );
                              } else {
                                // Resource folder
                                const folder = item.folder!;
                                
                                return (
                                  <div
                                    key={folder.path}
                                    className="rounded-lg border-2 border-dashed border-amber-200 bg-amber-50/50 p-3"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <div className="flex-shrink-0">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                                          <span className="text-sm">📁</span>
                                        </div>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-gray-900">
                                          {folder.displayName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {folder.resourceCount} tài liệu (.{folder.fileTypes.join(', .')})
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => alert(`Folder: ${folder.name}\nFiles: ${folder.resourceCount}\nTypes: ${folder.fileTypes.join(', ')}`)}
                                        className="text-xs px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-700 transition-colors"
                                      >
                                        Xem
                                      </button>
                                    </div>
                                  </div>
                                );
                              }
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
