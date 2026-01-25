/**
 * ProgressManager - Quản lý tiến độ học tập
 * Phase 1: IndexedDB Storage + Sync với server
 */

export interface VideoProgress {
  courseId: string;
  lectureId: string; // Video file path hoặc name
  progressPercent: number; // 0-100
  currentTimeSeconds: number;
  totalDurationSeconds: number;
  completed: boolean;
  lastWatchedAt: number; // Timestamp
}

import { openDB, STORES } from './indexeddb-utils';

const PROGRESS_STORE = STORES.VIDEO_PROGRESS;
const SYNC_QUEUE_STORE = STORES.SYNC_QUEUE;

/**
 * Lưu progress vào IndexedDB
 */
export async function saveProgress(progress: VideoProgress): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
    const store = transaction.objectStore(PROGRESS_STORE);

    // Update lastWatchedAt - sử dụng từ progress nếu có, nếu không thì dùng Date.now()
    const now = Date.now();
    const progressWithTimestamp: VideoProgress = {
      ...progress,
      lastWatchedAt: progress.lastWatchedAt || now, // Giữ nguyên nếu đã có, nếu không thì dùng now
    };

    // Nếu progress có lastWatchedAt từ input, dùng nó; nếu không thì update với now
    // Nhưng nếu progress đang được update (user đang xem), luôn update lastWatchedAt
    if (progress.lastWatchedAt) {
      // Nếu đã có lastWatchedAt, chỉ update nếu progress mới hơn (user đang xem)
      progressWithTimestamp.lastWatchedAt = Math.max(progress.lastWatchedAt, now);
    } else {
      // Nếu chưa có, set now
      progressWithTimestamp.lastWatchedAt = now;
    }

    await new Promise<void>((resolve, reject) => {
      const request = store.put(progressWithTimestamp);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // Thêm vào sync queue để sync với server sau
    await addToSyncQueue(progressWithTimestamp);

    console.log(`[ProgressManager] ✅ Saved progress: ${progress.lectureId} - ${progress.progressPercent.toFixed(1)}% (lastWatchedAt: ${new Date(progressWithTimestamp.lastWatchedAt).toISOString()})`);
  } catch (error) {
    console.error('[ProgressManager] ❌ Failed to save progress:', error);
    throw error;
  }
}

/**
 * Lấy progress của một bài học
 */
export async function getProgress(
  courseId: string,
  lectureId: string
): Promise<VideoProgress | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readonly');
    const store = transaction.objectStore(PROGRESS_STORE);

    const progress = await new Promise<VideoProgress | null>((resolve, reject) => {
      const request = store.get([courseId, lectureId]);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });

    return progress;
  } catch (error) {
    console.error('[ProgressManager] ❌ Failed to get progress:', error);
    return null;
  }
}

/**
 * Lấy tất cả progress của một khóa học
 */
export async function getCourseProgress(courseId: string): Promise<VideoProgress[]> {
  try {
    const db = await openDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readonly');
    const store = transaction.objectStore(PROGRESS_STORE);
    const index = store.index('courseId');

    const progressList = await new Promise<VideoProgress[]>((resolve, reject) => {
      const request = index.getAll(courseId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    return progressList;
  } catch (error) {
    console.error('[ProgressManager] ❌ Failed to get course progress:', error);
    return [];
  }
}

/**
 * Xóa progress của một bài học
 */
export async function deleteProgress(courseId: string, lectureId: string): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
    const store = transaction.objectStore(PROGRESS_STORE);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete([courseId, lectureId]);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    console.log(`[ProgressManager] ✅ Deleted progress: ${lectureId}`);
  } catch (error) {
    console.error('[ProgressManager] ❌ Failed to delete progress:', error);
    throw error;
  }
}

/**
 * Thêm progress vào sync queue
 */
async function addToSyncQueue(progress: VideoProgress): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([SYNC_QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);

    await new Promise<void>((resolve, reject) => {
      const request = store.add({
        ...progress,
        timestamp: Date.now(),
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[ProgressManager] ❌ Failed to add to sync queue:', error);
    // Không throw - sync queue là optional
  }
}

/**
 * Lấy tất cả items trong sync queue
 */
export async function getSyncQueue(): Promise<VideoProgress[]> {
  try {
    const db = await openDB();
    const transaction = db.transaction([SYNC_QUEUE_STORE], 'readonly');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);
    const index = store.index('timestamp');

    const queue = await new Promise<VideoProgress[]>((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });

    return queue;
  } catch (error) {
    console.error('[ProgressManager] ❌ Failed to get sync queue:', error);
    return [];
  }
}

/**
 * Xóa items đã sync khỏi queue
 */
export async function clearSyncQueue(ids: number[]): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([SYNC_QUEUE_STORE], 'readwrite');
    const store = transaction.objectStore(SYNC_QUEUE_STORE);

    await Promise.all(
      ids.map(
        (id) =>
          new Promise<void>((resolve, reject) => {
            const request = store.delete(id);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          })
      )
    );

    console.log(`[ProgressManager] ✅ Cleared ${ids.length} items from sync queue`);
  } catch (error) {
    console.error('[ProgressManager] ❌ Failed to clear sync queue:', error);
    throw error;
  }
}

/**
 * Sync progress với server
 * Gọi API để lưu progress lên server
 */
export async function syncProgressToServer(
  apiEndpoint: string,
  deviceId?: string
): Promise<{ success: boolean; synced: number; failed: number }> {
  const queue = await getSyncQueue();
  
  if (queue.length === 0) {
    return { success: true, synced: 0, failed: 0 };
  }

  let synced = 0;
  let failed = 0;

  try {
    // Batch sync - gửi tất cả cùng lúc
    const response = await fetch(`${apiEndpoint}/learning-progress/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(deviceId && { 'x-device-id': deviceId }),
      },
      body: JSON.stringify({
        progressList: queue.map((p) => ({
          courseId: p.courseId,
          lectureId: p.lectureId,
          progressPercent: p.progressPercent,
          currentTimeSeconds: p.currentTimeSeconds,
          totalDurationSeconds: p.totalDurationSeconds,
          completed: p.completed,
          sourceType: 'local_folder',
        })),
      }),
    });

    if (response.ok) {
      // Clear sync queue
      const ids = queue.map((_, index) => index + 1); // IndexedDB auto-increment starts at 1
      await clearSyncQueue(ids);
      synced = queue.length;
      console.log(`[ProgressManager] ✅ Synced ${synced} progress items to server`);
    } else {
      failed = queue.length;
      console.error(`[ProgressManager] ❌ Sync failed: ${response.status}`);
    }
  } catch (error) {
    failed = queue.length;
    console.error('[ProgressManager] ❌ Sync error:', error);
  }

  return { success: failed === 0, synced, failed };
}

/**
 * Auto-sync progress với server mỗi N giây
 */
let syncInterval: NodeJS.Timeout | null = null;

export function startAutoSync(
  apiEndpoint: string,
  deviceId?: string,
  intervalSeconds: number = 30
): void {
  stopAutoSync(); // Clear existing interval

  syncInterval = setInterval(async () => {
    try {
      await syncProgressToServer(apiEndpoint, deviceId);
    } catch (error) {
      console.error('[ProgressManager] ❌ Auto-sync error:', error);
    }
  }, intervalSeconds * 1000);

  console.log(`[ProgressManager] ✅ Auto-sync started (every ${intervalSeconds}s)`);
}

export function stopAutoSync(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log('[ProgressManager] ✅ Auto-sync stopped');
  }
}

/**
 * Phase 2: Save progress với hybrid storage (IndexedDB + File)
 * Nếu có write access, lưu vào file .progress.json
 */
export async function saveProgressHybrid(
  progress: VideoProgress,
  directoryHandle?: FileSystemDirectoryHandle
): Promise<void> {
  // Save to IndexedDB (always)
  await saveProgress(progress);

  // Save to file if write access available
  if (directoryHandle) {
    try {
      const { saveProgressToFile, hasWriteAccess } = await import('./progress-file-manager');
      const hasAccess = await hasWriteAccess(directoryHandle);
      if (hasAccess) {
        // Get all progress for this course
        const allProgress = await getCourseProgress(progress.courseId);
        await saveProgressToFile(directoryHandle, progress.courseId, allProgress);
      }
    } catch (error) {
      // File save is optional, don't throw
      console.warn('[ProgressManager] ⚠️ Could not save to file:', error);
    }
  }
}
