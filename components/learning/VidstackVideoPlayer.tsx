'use client';

/**
 * VidstackVideoPlayer - Video player using Vidstack for better subtitle support
 * Replaces LocalVideoPlayer with full subtitle track selection
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { VideoFile, SubtitleTrack } from '@/lib/video-scanner';
import { getProgress, saveProgressHybrid } from '@/lib/progress-manager';
import { findAllSubtitleFiles } from '@/lib/video-scanner';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import {
  MediaPlayer,
  MediaProvider,
  Track,
  type MediaPlayerInstance
} from '@vidstack/react';
import {
  defaultLayoutIcons,
  DefaultVideoLayout
} from '@vidstack/react/player/layouts/default';

interface VidstackVideoPlayerProps {
  video: VideoFile;
  courseId: string;
  directoryHandle: FileSystemDirectoryHandle;
  onProgressUpdate?: (progress: number) => void;
  onVideoEnded?: () => void;
  autoPlay?: boolean;
  className?: string;
  useHybridStorage?: boolean;
}

export function VidstackVideoPlayer({
  video,
  courseId,
  directoryHandle,
  onProgressUpdate,
  onVideoEnded,
  autoPlay = false,
  className = '',
  useHybridStorage = true,
}: VidstackVideoPlayerProps) {
  const playerRef = useRef<MediaPlayerInstance>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subtitleTracks, setSubtitleTracks] = useState<SubtitleTrack[]>([]);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);
  const [savedTime, setSavedTime] = useState<number>(0);
  const progressSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousVideoPathRef = useRef<string | null>(null);

  // Load video file và tạo Blob URL
  const loadVideo = useCallback(async () => {
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

      // Load all subtitle tracks
      try {
        // console.log('[VidstackVideoPlayer] 🔍 Looking for subtitle files...');
        const foundSubtitles = await findAllSubtitleFiles(video, directoryHandle);
        // console.log('[VidstackVideoPlayer] 📝 Found subtitle files:', foundSubtitles.length);
        
        // Create Blob URLs for each subtitle
        const tracksWithUrls = await Promise.all(
          foundSubtitles.map(async (track) => {
            const file = await track.handle.getFile();
            const blobUrl = URL.createObjectURL(file);
            // console.log(`[VidstackVideoPlayer] 📄 Created blob URL for: ${track.label} (${track.language})`);
            return {
              ...track,
              src: blobUrl,
            };
          })
        );
        
        // Sort tracks: Vietnamese first, then others
        const sortedTracks = tracksWithUrls.sort((a, b) => {
          // Vietnamese tracks come first
          if (a.language === 'vi' && b.language !== 'vi') return -1;
          if (a.language !== 'vi' && b.language === 'vi') return 1;
          // Then sort alphabetically
          return a.language.localeCompare(b.language);
        });
        
        setSubtitleTracks(sortedTracks);
        // console.log(`[VidstackVideoPlayer] ✅ Loaded ${sortedTracks.length} subtitle tracks:`,
        //   sortedTracks.map(t => `${t.label} (${t.language})`).join(', ')
        // );
      } catch (subtitleError) {
        // console.warn('[VidstackVideoPlayer] Could not load subtitles:', subtitleError);
        setSubtitleTracks([]);
      }

      // Load saved progress
      const savedProgress = await getProgress(courseId, video.path);
      
      // Check xem video có thay đổi không
      const isVideoChanged = previousVideoPathRef.current !== null && previousVideoPathRef.current !== video.path;
      previousVideoPathRef.current = video.path;

      setIsLoading(false);

      // Save progress time to restore when player is ready
      if (savedProgress) {
        setSavedTime(savedProgress.currentTimeSeconds);
      }

      // Set auto-play flag if video changed
      if (autoPlay && isVideoChanged) {
        setShouldAutoPlay(true);
      }
    } catch (err) {
      // console.error('[VidstackVideoPlayer] Error loading video:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải video');
      setIsLoading(false);
    }
  }, [video, directoryHandle, courseId, blobUrl, autoPlay]);

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
  }, [video.path]);

  // Helper function để lưu progress
  // forceFileSave: true for pause/end/beforeunload, false for auto-save
  const saveProgressNow = useCallback(async (forceFileSave: boolean = false) => {
    const player = playerRef.current;
    if (!player || !player.duration || player.duration === 0) return;

    const currentTime = player.currentTime;
    const duration = player.duration;
    const progressPercent = (currentTime / duration) * 100;
    const completed = progressPercent >= 95;

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

      if (useHybridStorage) {
        await saveProgressHybrid(progress, directoryHandle, forceFileSave);
      } else {
        const { saveProgress } = await import('@/lib/progress-manager');
        await saveProgress(progress);
      }

      const saveType = forceFileSave ? '🔒 FORCE' : '💾';
      // console.log(`[VidstackVideoPlayer] ${saveType} Saved progress: ${video.path} - ${progressPercent.toFixed(1)}%`);
    } catch (err) {
      // console.error('[VidstackVideoPlayer] Error saving progress:', err);
    }
  }, [video.path, courseId, directoryHandle, useHybridStorage]);

  // Handle progress tracking
  const handleTimeUpdate = useCallback(() => {
    const player = playerRef.current;
    if (!player || !player.duration || player.duration === 0) return;

    const currentTime = player.currentTime;
    const duration = player.duration;
    const progressPercent = (currentTime / duration) * 100;

    // Update callback
    onProgressUpdate?.(progressPercent);

    // Debounce save
    if (progressSaveTimeoutRef.current) {
      clearTimeout(progressSaveTimeoutRef.current);
    }

    progressSaveTimeoutRef.current = setTimeout(() => {
      saveProgressNow();
    }, 5000);
  }, [onProgressUpdate, saveProgressNow]);

  // Handle video ended - FORCE SAVE immediately
  const handleEnded = useCallback(() => {
    // console.log('[VidstackVideoPlayer] 🏁 Video ended, force saving progress...');
    if (progressSaveTimeoutRef.current) {
      clearTimeout(progressSaveTimeoutRef.current);
    }
    saveProgressNow(true); // Force file save
    onVideoEnded?.();
  }, [saveProgressNow, onVideoEnded]);

  // Handle pause - FORCE SAVE immediately
  const handlePause = useCallback(() => {
    // console.log('[VidstackVideoPlayer] ⏸️ Video paused, force saving progress...');
    if (progressSaveTimeoutRef.current) {
      clearTimeout(progressSaveTimeoutRef.current);
    }
    // Small delay to ensure currentTime is updated
    progressSaveTimeoutRef.current = setTimeout(() => {
      saveProgressNow(true); // Force file save
    }, 500);
  }, [saveProgressNow]);

  // Handle when player can play - restore saved time and auto-play if needed
  const handleCanPlay = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    // Restore saved time
    if (savedTime > 0) {
      player.currentTime = savedTime;
      setSavedTime(0); // Reset
    }

    // Auto-play if needed
    if (shouldAutoPlay) {
      try {
        player.play();
        setShouldAutoPlay(false); // Reset
      } catch (err: any) {
        // console.log('[VidstackVideoPlayer] Auto-play blocked:', err?.message || err);
      }
    }
  }, [savedTime, shouldAutoPlay]);

  // Force save on window.beforeunload (user closing tab/browser)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // console.log('[VidstackVideoPlayer] 🚪 beforeunload - force saving progress...');
      // Force save synchronously (beforeunload must be sync)
      saveProgressNow(true);
      // No need to prevent default - just save
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveProgressNow]);

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

  if (isLoading || !blobUrl) {
    return (
      <div className={`flex items-center justify-center bg-black ${className}`}>
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mx-auto"></div>
          <p className="text-sm text-gray-400">Đang tải video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <MediaPlayer
        ref={playerRef}
        src={blobUrl || ''}
        autoPlay={false}
        playsInline
        onCanPlay={handleCanPlay}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPause={handlePause}
        className="w-full h-full"
        style={{ objectFit: 'contain' }}
      >
        <MediaProvider>
          {blobUrl && (
            <source
              src={blobUrl}
              type={
                video.handle.name.endsWith('.mp4') ? 'video/mp4' :
                video.handle.name.endsWith('.webm') ? 'video/webm' :
                video.handle.name.endsWith('.mkv') ? 'video/x-matroska' : 'video/mp4'
              }
            />
          )}
        </MediaProvider>
        
        {/* Subtitle Tracks */}
        {subtitleTracks.map((track, index) => {
          const isDefault = index === 0;
          // Detect subtitle file type from handle name
          const isSRT = track.handle.name.endsWith('.srt');
          const type = isSRT ? 'srt' : 'vtt';
          
          return (
            <Track
              key={`${track.language}-${index}`}
              kind="subtitles"
              src={track.src}
              type={type}
              label={track.label}
              lang={track.language}
              default={isDefault}
            />
          );
        })}
        
        {/* Default Video Layout with controls */}
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
        />
      </MediaPlayer>
    </div>
  );
}
