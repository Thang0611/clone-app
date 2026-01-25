/**
 * ProgressFileManager - Quản lý progress file (.progress.json)
 * Phase 2: Hybrid Progress Storage (IndexedDB + File)
 */

import type { VideoProgress } from './progress-manager';

const PROGRESS_FILE_NAME = '.progress.json';

export interface ProgressFileData {
  version: string;
  courseId: string;
  updatedAt: number;
  progress: Array<{
    lectureId: string;
    progressPercent: number;
    currentTimeSeconds: number;
    totalDurationSeconds: number;
    completed: boolean;
    lastWatchedAt: number;
  }>;
}

/**
 * Kiểm tra có write access không
 */
export async function hasWriteAccess(
  directoryHandle: FileSystemDirectoryHandle
): Promise<boolean> {
  try {
    const permission = await directoryHandle.queryPermission({ mode: 'readwrite' });
    if (permission === 'granted') {
      return true;
    }

    // Request write permission
    const newPermission = await directoryHandle.requestPermission({ mode: 'readwrite' });
    return newPermission === 'granted';
  } catch (error) {
    console.warn('[ProgressFileManager] ⚠️ Could not check write access:', error);
    return false;
  }
}

/**
 * Lưu progress vào file .progress.json
 */
export async function saveProgressToFile(
  directoryHandle: FileSystemDirectoryHandle,
  courseId: string,
  progressList: VideoProgress[]
): Promise<boolean> {
  try {
    // Check write access
    const hasAccess = await hasWriteAccess(directoryHandle);
    if (!hasAccess) {
      console.log('[ProgressFileManager] ℹ️ No write access, skipping file save');
      return false;
    }

    // Prepare data
    const fileData: ProgressFileData = {
      version: '1.0',
      courseId,
      updatedAt: Date.now(),
      progress: progressList.map((p) => ({
        lectureId: p.lectureId,
        progressPercent: p.progressPercent,
        currentTimeSeconds: p.currentTimeSeconds,
        totalDurationSeconds: p.totalDurationSeconds,
        completed: p.completed,
        lastWatchedAt: p.lastWatchedAt,
      })),
    };

    // Convert to JSON
    const jsonContent = JSON.stringify(fileData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });

    // Get or create file handle
    let fileHandle: FileSystemFileHandle;
    try {
      fileHandle = await directoryHandle.getFileHandle(PROGRESS_FILE_NAME, { create: true });
    } catch (error) {
      console.error('[ProgressFileManager] ❌ Failed to get file handle:', error);
      return false;
    }

    // Write file
    const writable = await fileHandle.createWritable();
    await writable.write(blob);
    await writable.close();

    console.log(`[ProgressFileManager] ✅ Saved progress to file: ${progressList.length} items`);
    return true;
  } catch (error) {
    console.error('[ProgressFileManager] ❌ Failed to save progress to file:', error);
    return false;
  }
}

/**
 * Load progress từ file .progress.json
 */
export async function loadProgressFromFile(
  directoryHandle: FileSystemDirectoryHandle,
  courseId: string
): Promise<VideoProgress[] | null> {
  try {
    // Check if file exists
    let fileHandle: FileSystemFileHandle;
    try {
      fileHandle = await directoryHandle.getFileHandle(PROGRESS_FILE_NAME);
    } catch (error) {
      // File doesn't exist
      console.log('[ProgressFileManager] ℹ️ Progress file not found');
      return null;
    }

    // Read file
    const file = await fileHandle.getFile();
    const text = await file.text();

    // Parse JSON
    const fileData: ProgressFileData = JSON.parse(text);

    // Validate version and courseId
    if (fileData.version !== '1.0') {
      console.warn('[ProgressFileManager] ⚠️ Unsupported file version:', fileData.version);
      return null;
    }

    if (fileData.courseId !== courseId) {
      console.warn(
        '[ProgressFileManager] ⚠️ Course ID mismatch:',
        fileData.courseId,
        'vs',
        courseId
      );
      return null;
    }

    // Convert to VideoProgress[]
    const progressList: VideoProgress[] = fileData.progress.map((p) => ({
      courseId,
      lectureId: p.lectureId,
      progressPercent: p.progressPercent,
      currentTimeSeconds: p.currentTimeSeconds,
      totalDurationSeconds: p.totalDurationSeconds,
      completed: p.completed,
      lastWatchedAt: p.lastWatchedAt,
    }));

    console.log(`[ProgressFileManager] ✅ Loaded progress from file: ${progressList.length} items`);
    return progressList;
  } catch (error) {
    console.error('[ProgressFileManager] ❌ Failed to load progress from file:', error);
    return null;
  }
}

/**
 * Xóa file .progress.json
 */
export async function deleteProgressFile(
  directoryHandle: FileSystemDirectoryHandle
): Promise<boolean> {
  try {
    const hasAccess = await hasWriteAccess(directoryHandle);
    if (!hasAccess) {
      console.log('[ProgressFileManager] ℹ️ No write access, cannot delete file');
      return false;
    }

    await directoryHandle.removeEntry(PROGRESS_FILE_NAME);
    console.log('[ProgressFileManager] ✅ Deleted progress file');
    return true;
  } catch (error) {
    // File might not exist, that's okay
    console.log('[ProgressFileManager] ℹ️ Could not delete progress file:', error);
    return false;
  }
}

/**
 * Sync progress từ file vào IndexedDB
 * Dùng khi load folder lần đầu
 */
export async function syncProgressFromFileToIndexedDB(
  directoryHandle: FileSystemDirectoryHandle,
  courseId: string,
  saveProgress: (progress: VideoProgress) => Promise<void>
): Promise<number> {
  try {
    const progressList = await loadProgressFromFile(directoryHandle, courseId);
    if (!progressList || progressList.length === 0) {
      return 0;
    }

    // Save each progress to IndexedDB
    let synced = 0;
    for (const progress of progressList) {
      try {
        await saveProgress(progress);
        synced++;
      } catch (error) {
        console.error(
          `[ProgressFileManager] ⚠️ Failed to sync progress for ${progress.lectureId}:`,
          error
        );
      }
    }

    console.log(`[ProgressFileManager] ✅ Synced ${synced} progress items from file to IndexedDB`);
    return synced;
  } catch (error) {
    console.error('[ProgressFileManager] ❌ Failed to sync progress from file:', error);
    return 0;
  }
}

/**
 * Sync progress từ IndexedDB vào file
 * Dùng khi có write access và muốn lưu portable progress
 */
export async function syncProgressFromIndexedDBToFile(
  directoryHandle: FileSystemDirectoryHandle,
  courseId: string,
  getCourseProgress: (courseId: string) => Promise<VideoProgress[]>
): Promise<boolean> {
  try {
    const progressList = await getCourseProgress(courseId);
    if (progressList.length === 0) {
      console.log('[ProgressFileManager] ℹ️ No progress to sync');
      return false;
    }

    const success = await saveProgressToFile(directoryHandle, courseId, progressList);
    return success;
  } catch (error) {
    console.error('[ProgressFileManager] ❌ Failed to sync progress to file:', error);
    return false;
  }
}
