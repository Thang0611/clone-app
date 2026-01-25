'use client';

/**
 * LocalVideoPlayer - Component phát video từ local file
 * Phase 1: Lazy Loading + Blob URL Cleanup + Auto-resume progress
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { VideoFile, SubtitleTrack } from '@/lib/video-scanner';
import { getProgress, saveProgressHybrid } from '@/lib/progress-manager';
import { findAllSubtitleFiles } from '@/lib/video-scanner';

interface LocalVideoPlayerProps {
  video: VideoFile;
  courseId: string;
  directoryHandle: FileSystemDirectoryHandle;
  onProgressUpdate?: (progress: number) => void;
  onVideoEnded?: () => void; // Callback khi video kết thúc
  autoPlay?: boolean; // Tự động phát video khi load
  className?: string;
  useHybridStorage?: boolean; // Phase 2: Enable file storage if write access available
}

export function LocalVideoPlayer({
  video,
  courseId,
  directoryHandle,
  onProgressUpdate,
  onVideoEnded,
  autoPlay = false,
  className = '',
  useHybridStorage = true,
}: LocalVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subtitleTracks, setSubtitleTracks] = useState<SubtitleTrack[]>([]);
  const progressSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousVideoPathRef = useRef<string | null>(null);

  // Load video file và tạo Blob URL
  const loadVideo = useCallback(async () => {
    if (!videoRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get file từ handle
      const file = await video.handle.getFile();

      // Revoke old Blob URL nếu có
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }

      // Tạo Blob URL mới
      const newBlobUrl = URL.createObjectURL(file);
      setBlobUrl(newBlobUrl);
      videoRef.current.src = newBlobUrl;

      // Load all subtitle tracks
      try {
        const foundSubtitles = await findAllSubtitleFiles(video, directoryHandle);
        
        // Create Blob URLs for each subtitle
        const tracksWithUrls = await Promise.all(
          foundSubtitles.map(async (track) => {
            const file = await track.handle.getFile();
            const blobUrl = URL.createObjectURL(file);
            return {
              ...track,
              src: blobUrl,
            };
          })
        );
        
        setSubtitleTracks(tracksWithUrls);
        console.log(`[LocalVideoPlayer] ✅ Loaded ${tracksWithUrls.length} subtitle tracks`);
      } catch (subtitleError) {
        console.warn('[LocalVideoPlayer] Could not load subtitles:', subtitleError);
        setSubtitleTracks([]);
      }

      // Load saved progress
      const savedProgress = await getProgress(courseId, video.path);
      if (savedProgress && videoRef.current) {
        videoRef.current.currentTime = savedProgress.currentTimeSeconds;
      }

      // Check xem video có thay đổi không (không phải lần đầu load)
      const isVideoChanged = previousVideoPathRef.current !== null && previousVideoPathRef.current !== video.path;
      
      // Update previous video path TRƯỚC khi check auto-play
      previousVideoPathRef.current = video.path;

      setIsLoading(false);

      // Auto-play nếu được bật và video đã thay đổi (không phải lần đầu load)
      // Delay một chút để đảm bảo video đã load metadata và state đã update
      if (autoPlay && isVideoChanged) {
        // Wait for video to be ready
        const tryAutoPlay = async () => {
          if (videoRef.current && videoRef.current.readyState >= 2) {
            try {
              await videoRef.current.play();
              console.log('[LocalVideoPlayer] ✅ Auto-playing next video');
            } catch (playError) {
              // Browser có thể block autoplay, không cần xử lý
              console.log('[LocalVideoPlayer] Auto-play blocked by browser (user interaction required)');
            }
          } else {
            // Video chưa ready, wait a bit more
            setTimeout(tryAutoPlay, 200);
          }
        };
        
        setTimeout(tryAutoPlay, 300);
      }
    } catch (err) {
      console.error('[LocalVideoPlayer] Error loading video:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải video');
      setIsLoading(false);
    }
  }, [video, directoryHandle, courseId, blobUrl]);

  // Load video khi component mount hoặc video thay đổi
  useEffect(() => {
    loadVideo();

    // Cleanup khi unmount hoặc video thay đổi
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      // Cleanup all subtitle blob URLs
      subtitleTracks.forEach(track => {
        if (track.src) {
          URL.revokeObjectURL(track.src);
        }
      });
      if (progressSaveTimeoutRef.current) {
        clearTimeout(progressSaveTimeoutRef.current);
      }
    };
  }, [video.path]); // Chỉ reload khi video path thay đổi

  // Helper function để lưu progress
  const saveProgressNow = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement || !videoElement.duration || videoElement.duration === 0) return;

    const currentTime = videoElement.currentTime;
    const duration = videoElement.duration;
    const progressPercent = (currentTime / duration) * 100;
    const completed = progressPercent >= 95; // Coi như hoàn thành nếu >= 95%

    try {
      const progress = {
        courseId,
        lectureId: video.path,
        progressPercent,
        currentTimeSeconds: Math.floor(currentTime),
        totalDurationSeconds: Math.floor(duration),
        completed,
        lastWatchedAt: Date.now(),
      };

      // Phase 2: Use hybrid storage if enabled
      if (useHybridStorage) {
        await saveProgressHybrid(progress, directoryHandle);
      } else {
        const { saveProgress } = await import('@/lib/progress-manager');
        await saveProgress(progress);
      }

      console.log(`[LocalVideoPlayer] ✅ Saved progress: ${video.path} - ${progressPercent.toFixed(1)}% (lastWatchedAt: ${new Date(progress.lastWatchedAt).toISOString()})`);
    } catch (err) {
      console.error('[LocalVideoPlayer] Error saving progress:', err);
    }
  }, [video.path, courseId, directoryHandle, useHybridStorage]);

  // Track progress và lưu vào IndexedDB
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || isLoading) return;

    const handleTimeUpdate = async () => {
      if (!videoElement.duration || videoElement.duration === 0) return;

      const currentTime = videoElement.currentTime;
      const duration = videoElement.duration;
      const progressPercent = (currentTime / duration) * 100;
      const completed = progressPercent >= 95; // Coi như hoàn thành nếu >= 95%

      // Update callback
      onProgressUpdate?.(progressPercent);

      // Lưu progress (debounce - chỉ lưu mỗi 5 giây)
      if (progressSaveTimeoutRef.current) {
        clearTimeout(progressSaveTimeoutRef.current);
      }

      progressSaveTimeoutRef.current = setTimeout(() => {
        saveProgressNow();
      }, 5000); // Debounce 5 giây
    };

    // Lưu progress khi video kết thúc và trigger callback
    const handleEnded = () => {
      console.log('[LocalVideoPlayer] Video ended, saving progress immediately...');
      if (progressSaveTimeoutRef.current) {
        clearTimeout(progressSaveTimeoutRef.current);
      }
      saveProgressNow();
      
      // Trigger callback để chuyển video tiếp theo
      onVideoEnded?.();
    };

    // Lưu progress khi video pause (user có thể đang chuyển video)
    const handlePause = () => {
      // Clear debounce và lưu ngay (debounce nhỏ để tránh lưu quá nhiều)
      if (progressSaveTimeoutRef.current) {
        clearTimeout(progressSaveTimeoutRef.current);
      }
      // Debounce nhỏ (500ms) để tránh lưu quá nhiều khi user pause/play liên tục
      progressSaveTimeoutRef.current = setTimeout(() => {
        saveProgressNow();
      }, 500);
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('pause', handlePause);
      
      // Lưu progress cuối cùng trước khi unmount
      if (progressSaveTimeoutRef.current) {
        clearTimeout(progressSaveTimeoutRef.current);
      }
      saveProgressNow();
    };
  }, [video.path, courseId, isLoading, onProgressUpdate, saveProgressNow]);

  // Handle video loaded
  const handleLoadedMetadata = () => {
    setIsLoading(false);
  };

  // Handle video error
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.currentTarget;
    const error = videoElement.error;

    if (error) {
      let errorMessage = 'Lỗi phát video';
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMessage = 'Video bị dừng';
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMessage = 'Lỗi kết nối';
          break;
        case error.MEDIA_ERR_DECODE:
          errorMessage = 'Lỗi giải mã video';
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Định dạng video không được hỗ trợ';
          break;
      }
      setError(errorMessage);
    }
  };

  if (error) {
    return (
      <div className={`rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20 ${className}`}>
        <div className="flex items-center gap-3">
          <span className="text-red-600 dark:text-red-400 text-xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-red-800 dark:text-red-300">Lỗi phát video</h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-400">Đang tải video...</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        controls
        className="h-full w-full max-h-full max-w-full object-contain bg-black"
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        playsInline
        autoPlay={autoPlay}
      >
        {subtitleTracks.map((track, index) => (
          <track
            key={track.language}
            kind="subtitles"
            src={track.src}
            srcLang={track.language}
            label={track.label}
            default={index === 0} // First track is default
          />
        ))}
        Trình duyệt của bạn không hỗ trợ video.
      </video>
    </div>
  );
}
