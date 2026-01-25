/**
 * VideoMetadataCache - Cache video metadata để tăng tốc
 * Phase 2: Video Metadata Caching
 */

import type { VideoFile } from './video-scanner';

export interface CachedVideoMetadata {
  name: string;
  displayName: string;
  path: string;
  size: number;
  lastModified: number;
}

export interface CachedMetadata {
  folderName: string;
  folderPath: string; // Relative path từ root (nếu có)
  videos: CachedVideoMetadata[];
  scannedAt: number;
  folderLastModified?: number; // Timestamp của folder (nếu có thể lấy được)
}

import { openDB, STORES } from './indexeddb-utils';

const METADATA_STORE = STORES.VIDEO_METADATA;
const METADATA_KEY_PREFIX = 'metadata_';

/**
 * Generate cache key từ folder handle
 */
function getCacheKey(folderName: string, folderPath?: string): string {
  return `${METADATA_KEY_PREFIX}${folderPath || folderName}`;
}

/**
 * Lưu metadata vào cache
 */
export async function saveMetadataCache(
  folderName: string,
  videos: VideoFile[],
  folderPath?: string
): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([METADATA_STORE], 'readwrite');
    const store = transaction.objectStore(METADATA_STORE);

    const metadata: CachedMetadata = {
      folderName,
      folderPath: folderPath || '',
      videos: videos.map((v) => ({
        name: v.name,
        displayName: v.displayName,
        path: v.path,
        size: v.size,
        lastModified: v.lastModified,
      })),
      scannedAt: Date.now(),
    };

    const cacheKey = getCacheKey(folderName, folderPath);

    await new Promise<void>((resolve, reject) => {
      const request = store.put(metadata, cacheKey);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    console.log(`[VideoMetadataCache] ✅ Cached metadata for ${folderName}: ${videos.length} videos`);
  } catch (error) {
    console.error('[VideoMetadataCache] ❌ Failed to save metadata cache:', error);
    throw error;
  }
}

/**
 * Load metadata từ cache
 */
export async function loadMetadataCache(
  folderName: string,
  folderPath?: string
): Promise<CachedMetadata | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction([METADATA_STORE], 'readonly');
    const store = transaction.objectStore(METADATA_STORE);

    const cacheKey = getCacheKey(folderName, folderPath);

    const metadata = await new Promise<CachedMetadata | null>((resolve, reject) => {
      const request = store.get(cacheKey);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });

    if (metadata) {
      console.log(`[VideoMetadataCache] ✅ Loaded cached metadata: ${metadata.videos.length} videos`);
    } else {
      console.log('[VideoMetadataCache] ℹ️ No cached metadata found');
    }

    return metadata;
  } catch (error) {
    console.error('[VideoMetadataCache] ❌ Failed to load metadata cache:', error);
    return null;
  }
}

/**
 * Kiểm tra metadata cache có còn valid không
 * So sánh lastModified của files với cache
 */
export async function isMetadataCacheValid(
  cachedMetadata: CachedMetadata,
  currentVideos: VideoFile[]
): Promise<boolean> {
  // Nếu số lượng video khác nhau → Cache invalid
  if (cachedMetadata.videos.length !== currentVideos.length) {
    console.log('[VideoMetadataCache] ⚠️ Cache invalid: Video count changed');
    return false;
  }

  // Tạo map để so sánh nhanh
  const cachedMap = new Map(
    cachedMetadata.videos.map((v) => [v.path, { size: v.size, lastModified: v.lastModified }])
  );

  // So sánh từng video
  for (const video of currentVideos) {
    const cached = cachedMap.get(video.path);
    if (!cached) {
      console.log(`[VideoMetadataCache] ⚠️ Cache invalid: New video found: ${video.path}`);
      return false;
    }

    // So sánh size và lastModified
    if (cached.size !== video.size || cached.lastModified !== video.lastModified) {
      console.log(`[VideoMetadataCache] ⚠️ Cache invalid: Video changed: ${video.path}`);
      return false;
    }
  }

  console.log('[VideoMetadataCache] ✅ Cache is valid');
  return true;
}

/**
 * Xóa metadata cache
 */
export async function clearMetadataCache(
  folderName: string,
  folderPath?: string
): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([METADATA_STORE], 'readwrite');
    const store = transaction.objectStore(METADATA_STORE);

    const cacheKey = getCacheKey(folderName, folderPath);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(cacheKey);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    console.log('[VideoMetadataCache] ✅ Cleared metadata cache');
  } catch (error) {
    console.error('[VideoMetadataCache] ❌ Failed to clear metadata cache:', error);
    throw error;
  }
}

/**
 * Convert cached metadata thành VideoFile[] (cần directoryHandle để tạo handles)
 * Note: Cached metadata không có handles, cần scan lại để lấy handles
 * Nhưng có thể dùng để hiển thị danh sách nhanh trước khi scan xong
 */
export function cachedMetadataToVideoFiles(
  cachedMetadata: CachedMetadata,
  getHandleForPath: (path: string) => Promise<FileSystemFileHandle>
): Promise<VideoFile[]> {
  return Promise.all(
    cachedMetadata.videos.map(async (v) => ({
      name: v.name,
      displayName: v.displayName,
      handle: await getHandleForPath(v.path),
      path: v.path,
      size: v.size,
      lastModified: v.lastModified,
    }))
  );
}

/**
 * Xóa tất cả metadata cache cũ hơn N ngày
 */
export async function clearOldMetadataCache(daysOld: number = 30): Promise<number> {
  try {
    const db = await openDB();
    const transaction = db.transaction([METADATA_STORE], 'readwrite');
    const store = transaction.objectStore(METADATA_STORE);
    const index = store.index('scannedAt');

    const cutoffTime = Date.now() - daysOld * 24 * 60 * 60 * 1000;

    const allKeys = await new Promise<IDBValidKey[]>((resolve, reject) => {
      const request = index.getAll();
      request.onsuccess = () => {
        const results = request.result as CachedMetadata[];
        const oldKeys = results
          .filter((meta) => meta.scannedAt < cutoffTime)
          .map((_, index) => index); // This is wrong, need to get actual keys
        resolve(oldKeys);
      };
      request.onerror = () => reject(request.error);
    });

    // Better approach: iterate through all keys
    const keysToDelete: IDBValidKey[] = [];
    const request = store.openCursor();

    await new Promise<void>((resolve, reject) => {
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const metadata = cursor.value as CachedMetadata;
          if (metadata.scannedAt < cutoffTime) {
            keysToDelete.push(cursor.key);
          }
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });

    // Delete old entries
    await Promise.all(
      keysToDelete.map(
        (key) =>
          new Promise<void>((resolve, reject) => {
            const deleteRequest = store.delete(key);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
          })
      )
    );

    console.log(`[VideoMetadataCache] ✅ Cleared ${keysToDelete.length} old metadata caches`);
    return keysToDelete.length;
  } catch (error) {
    console.error('[VideoMetadataCache] ❌ Failed to clear old metadata cache:', error);
    return 0;
  }
}
