/**
 * Test Utilities cho Local Folder Learning
 * Helper functions để test các tính năng
 */

/**
 * Clear tất cả IndexedDB data
 */
export async function clearAllIndexedDB(): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase('LocalVideoPlayer');
    request.onsuccess = () => {
      console.log('[TestUtils] ✅ Cleared all IndexedDB data');
      resolve();
    };
    request.onerror = () => {
      console.error('[TestUtils] ❌ Failed to clear IndexedDB:', request.error);
      reject(request.error);
    };
    request.onblocked = () => {
      console.warn('[TestUtils] ⚠️ IndexedDB delete blocked, close all tabs');
      // Still resolve, user can manually close tabs
      resolve();
    };
  });
}

/**
 * Get IndexedDB stats
 */
export async function getIndexedDBStats(): Promise<{
  directoryHandles: number;
  videoProgress: number;
  syncQueue: number;
  videoMetadata: number;
}> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LocalVideoPlayer', 1);

    request.onsuccess = () => {
      const db = request.result;
      const stats = {
        directoryHandles: 0,
        videoProgress: 0,
        syncQueue: 0,
        videoMetadata: 0,
      };

      // Count directoryHandles
      if (db.objectStoreNames.contains('directoryHandles')) {
        const tx = db.transaction(['directoryHandles'], 'readonly');
        const store = tx.objectStore('directoryHandles');
        const countRequest = store.count();
        countRequest.onsuccess = () => {
          stats.directoryHandles = countRequest.result;
        };
      }

      // Count videoProgress
      if (db.objectStoreNames.contains('videoProgress')) {
        const tx = db.transaction(['videoProgress'], 'readonly');
        const store = tx.objectStore('videoProgress');
        const countRequest = store.count();
        countRequest.onsuccess = () => {
          stats.videoProgress = countRequest.result;
        };
      }

      // Count syncQueue
      if (db.objectStoreNames.contains('syncQueue')) {
        const tx = db.transaction(['syncQueue'], 'readonly');
        const store = tx.objectStore('syncQueue');
        const countRequest = store.count();
        countRequest.onsuccess = () => {
          stats.syncQueue = countRequest.result;
        };
      }

      // Count videoMetadata
      if (db.objectStoreNames.contains('videoMetadata')) {
        const tx = db.transaction(['videoMetadata'], 'readonly');
        const store = tx.objectStore('videoMetadata');
        const countRequest = store.count();
        countRequest.onsuccess = () => {
          stats.videoMetadata = countRequest.result;
        };
      }

      // Wait a bit for all counts to complete
      setTimeout(() => {
        resolve(stats);
      }, 100);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Check browser support
 */
export function checkBrowserSupport(): {
  fileSystemAccess: boolean;
  indexedDB: boolean;
  showDirectoryPicker: boolean;
} {
  return {
    fileSystemAccess: 'FileSystemHandle' in window,
    indexedDB: 'indexedDB' in window,
    showDirectoryPicker: 'showDirectoryPicker' in window,
  };
}

/**
 * Generate test video list (mock data)
 */
export function generateTestVideoList(count: number = 10): Array<{
  name: string;
  path: string;
  size: number;
  lastModified: number;
}> {
  return Array.from({ length: count }, (_, i) => ({
    name: `Video ${i + 1}.mp4`,
    path: `Video ${i + 1}.mp4`,
    size: 100 * 1024 * 1024 + Math.random() * 50 * 1024 * 1024, // 100-150 MB
    lastModified: Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000, // Last 7 days
  }));
}
