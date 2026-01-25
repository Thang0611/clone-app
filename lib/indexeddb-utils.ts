/**
 * IndexedDB Utilities - Quản lý schema chung cho tất cả stores
 * Đảm bảo tất cả object stores được tạo đúng cách
 */

const DB_NAME = 'LocalVideoPlayer';
const DB_VERSION = 2; // Tăng version để trigger upgrade và tạo lại tất cả stores

// Store names
export const STORES = {
  DIRECTORY_HANDLES: 'directoryHandles',
  VIDEO_PROGRESS: 'videoProgress',
  SYNC_QUEUE: 'syncQueue',
  VIDEO_METADATA: 'videoMetadata',
} as const;

/**
 * Mở IndexedDB database với tất cả stores được tạo
 */
export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Delete old stores if they exist (for clean migration)
      const oldStores = ['directoryHandles', 'videoProgress', 'syncQueue', 'videoMetadata'];
      oldStores.forEach((storeName) => {
        if (db.objectStoreNames.contains(storeName)) {
          try {
            db.deleteObjectStore(storeName);
          } catch (e) {
            // Ignore if store doesn't exist
          }
        }
      });

      // 1. Directory Handles store
      const directoryStore = db.createObjectStore(STORES.DIRECTORY_HANDLES);

      // 2. Video Progress store
      const progressStore = db.createObjectStore(STORES.VIDEO_PROGRESS, {
        keyPath: ['courseId', 'lectureId'],
      });
      progressStore.createIndex('courseId', 'courseId', { unique: false });
      progressStore.createIndex('lastWatchedAt', 'lastWatchedAt', { unique: false });

      // 3. Sync Queue store
      const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, {
        keyPath: 'id',
        autoIncrement: true,
      });
      syncStore.createIndex('timestamp', 'timestamp', { unique: false });

      // 4. Video Metadata store
      const metadataStore = db.createObjectStore(STORES.VIDEO_METADATA);
      metadataStore.createIndex('scannedAt', 'scannedAt', { unique: false });

      console.log('[IndexedDB] ✅ Database upgraded to version', DB_VERSION);
    };
  });
}

/**
 * Clear tất cả IndexedDB data (for testing/debugging)
 */
export async function clearAllIndexedDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME);
    request.onsuccess = () => {
      console.log('[IndexedDB] ✅ Cleared all data');
      resolve();
    };
    request.onerror = () => {
      console.error('[IndexedDB] ❌ Failed to clear:', request.error);
      reject(request.error);
    };
    request.onblocked = () => {
      console.warn('[IndexedDB] ⚠️ Delete blocked, close all tabs');
      // Still resolve, user can manually close tabs
      resolve();
    };
  });
}
