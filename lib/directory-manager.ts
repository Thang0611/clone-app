/**
 * DirectoryManager - Quản lý DirectoryHandle với Persistent Storage
 * Phase 1: Persistent Handle (IndexedDB) + Permission UX Flow + Error Handling
 */

import { openDB, STORES } from './indexeddb-utils';

const STORE_NAME = STORES.DIRECTORY_HANDLES;
const KEY_NAME = 'currentHandle';
const FOLDERS_LIST_KEY = 'foldersList';

export interface DirectoryHandleData {
  handle: FileSystemDirectoryHandle;
  folderName: string;
  savedAt: number;
}

/**
 * Lưu DirectoryHandle vào IndexedDB
 */
export async function saveDirectoryHandle(
  handle: FileSystemDirectoryHandle,
  folderName: string
): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const data: DirectoryHandleData = {
      handle,
      folderName,
      savedAt: Date.now(),
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(data, KEY_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // console.log('[DirectoryManager] ✅ Saved handle to IndexedDB:', folderName);
  } catch (error) {
    // console.error('[DirectoryManager] ❌ Failed to save handle:', error);
    throw error;
  }
}

/**
 * Load DirectoryHandle từ IndexedDB
 */
export async function loadDirectoryHandle(): Promise<DirectoryHandleData | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const data = await new Promise<DirectoryHandleData | null>((resolve, reject) => {
      const request = store.get(KEY_NAME);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result || null);
      };
      request.onerror = () => reject(request.error);
    });

    if (data) {
      // console.log('[DirectoryManager] ✅ Loaded handle from IndexedDB:', data.folderName);
    } else {
      // console.log('[DirectoryManager] ℹ️ No cached handle found');
    }

    return data;
  } catch (error) {
    // console.error('[DirectoryManager] ❌ Failed to load handle:', error);
    return null;
  }
}

/**
 * Xóa cached handle khỏi IndexedDB
 */
export async function clearDirectoryHandle(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(KEY_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // console.log('[DirectoryManager] ✅ Cleared cached handle');
  } catch (error) {
    // console.error('[DirectoryManager] ❌ Failed to clear handle:', error);
    throw error;
  }
}

/**
 * Verify DirectoryHandle vẫn còn valid
 * Kiểm tra permission và khả năng truy cập
 */
export async function verifyDirectoryHandle(
  handle: FileSystemDirectoryHandle
): Promise<boolean> {
  try {
    // Kiểm tra permission
    const permission = await handle.queryPermission({ mode: 'read' });
    
    if (permission === 'denied') {
      // console.log('[DirectoryManager] ⚠️ Permission denied');
      return false;
    }

    // Nếu permission là 'prompt', request lại
    if (permission === 'prompt') {
      const newPermission = await handle.requestPermission({ mode: 'read' });
      if (newPermission !== 'granted') {
        // console.log('[DirectoryManager] ⚠️ Permission not granted');
        return false;
      }
    }

    // Thử truy cập folder để verify handle vẫn valid
    // Không dùng '.' vì File System Access API không cho phép
    // Thay vào đó, thử list entries hoặc kiểm tra keys()
    try {
      // Thử iterate entries để verify handle vẫn valid
      // Nếu folder bị xóa/di chuyển, sẽ throw error
      const entries = handle.entries();
      // Chỉ cần check iterator có thể tạo được, không cần iterate hết
      await entries.next();
      // console.log('[DirectoryManager] ✅ Handle verified successfully');
      return true;
    } catch (error) {
      // console.log('[DirectoryManager] ⚠️ Handle invalid (folder may be deleted/moved):', error);
      return false;
    }
  } catch (error) {
    // console.error('[DirectoryManager] ❌ Error verifying handle:', error);
    return false;
  }
}

/**
 * Request directory access với UX tối ưu
 * - Nếu có cached handle → verify và dùng
 * - Nếu không → show picker
 */
export async function requestDirectoryAccess(): Promise<{
  handle: FileSystemDirectoryHandle;
  folderName: string;
  isCached: boolean;
} | null> {
  // Kiểm tra browser support
  if (!('showDirectoryPicker' in window)) {
    throw new Error(
      'Trình duyệt không hỗ trợ File System Access API. Vui lòng sử dụng Chrome hoặc Edge.'
    );
  }

  // Try 1: Load cached handle
  const cached = await loadDirectoryHandle();
  if (cached) {
    const isValid = await verifyDirectoryHandle(cached.handle);
    if (isValid) {
      // console.log('[DirectoryManager] ✅ Using cached handle');
      return {
        handle: cached.handle,
        folderName: cached.folderName,
        isCached: true,
      };
    } else {
      // Handle invalid → Clear cache
      // console.log('[DirectoryManager] ⚠️ Cached handle invalid, clearing...');
      await clearDirectoryHandle();
    }
  }

  // Try 2: User chọn folder mới
  try {
    const handle = await window.showDirectoryPicker({
      mode: 'read',
    });

    const folderName = handle.name;

    // Lưu vào IndexedDB (current handle)
    await saveDirectoryHandle(handle, folderName);
    
    // Thêm vào danh sách folders
    await addFolderToList(handle, folderName);

    // console.log('[DirectoryManager] ✅ New folder selected:', folderName);
    return {
      handle,
      folderName,
      isCached: false,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // User cancel → Không làm gì
      // console.log('[DirectoryManager] ℹ️ User cancelled folder selection');
      return null;
    }

    // Other error → Throw với message thân thiện
    // console.error('[DirectoryManager] ❌ Error selecting folder:', error);
    throw new Error(
      `Không thể truy cập folder: ${error.message || 'Lỗi không xác định'}. Vui lòng thử lại.`
    );
  }
}

/**
 * Force show directory picker (bypass cache)
 * Dùng khi user muốn chọn folder khác
 */
export async function requestNewDirectoryAccess(): Promise<{
  handle: FileSystemDirectoryHandle;
  folderName: string;
} | null> {
  // Kiểm tra browser support
  if (!('showDirectoryPicker' in window)) {
    throw new Error(
      'Trình duyệt không hỗ trợ File System Access API. Vui lòng sử dụng Chrome hoặc Edge.'
    );
  }

  try {
    const handle = await window.showDirectoryPicker({
      mode: 'read',
    });

    const folderName = handle.name;

    // Lưu vào IndexedDB (current handle)
    await saveDirectoryHandle(handle, folderName);
    
    // Thêm vào danh sách folders
    await addFolderToList(handle, folderName);

    // console.log('[DirectoryManager] ✅ New folder selected (forced):', folderName);
    return {
      handle,
      folderName,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // User cancel → Không làm gì
      // console.log('[DirectoryManager] ℹ️ User cancelled folder selection');
      return null;
    }

    // Other error → Throw với message thân thiện
    // console.error('[DirectoryManager] ❌ Error selecting folder:', error);
    throw new Error(
      `Không thể truy cập folder: ${error.message || 'Lỗi không xác định'}. Vui lòng thử lại.`
    );
  }
}

/**
 * Get cached folder name (không cần verify handle)
 * Dùng để hiển thị nhanh trong UI
 */
export async function getCachedFolderName(): Promise<string | null> {
  const cached = await loadDirectoryHandle();
  return cached?.folderName || null;
}

/**
 * Lưu folder vào danh sách (không ghi đè folder cũ)
 */
export async function addFolderToList(
  handle: FileSystemDirectoryHandle,
  folderName: string
): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Load danh sách folders hiện tại
    const foldersList = await new Promise<DirectoryHandleData[]>((resolve, reject) => {
      const request = store.get(FOLDERS_LIST_KEY);
      request.onsuccess = () => {
        const result = request.result || [];
        resolve(Array.isArray(result) ? result : []);
      };
      request.onerror = () => reject(request.error);
    });

    // Check xem folder đã tồn tại chưa (theo tên)
    const exists = foldersList.some(f => f.folderName === folderName);
    if (!exists) {
      // Thêm folder mới vào đầu danh sách
      const newFolder: DirectoryHandleData = {
        handle,
        folderName,
        savedAt: Date.now(),
      };
      foldersList.unshift(newFolder); // Thêm vào đầu

      // Lưu lại danh sách
      await new Promise<void>((resolve, reject) => {
        const request = store.put(foldersList, FOLDERS_LIST_KEY);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });

      // console.log('[DirectoryManager] ✅ Added folder to list:', folderName);
    } else {
      // console.log('[DirectoryManager] ℹ️ Folder already exists in list:', folderName);
    }
  } catch (error) {
    // console.error('[DirectoryManager] ❌ Failed to add folder to list:', error);
    throw error;
  }
}

/**
 * Load danh sách tất cả folders đã lưu
 */
export async function getAllFolders(): Promise<DirectoryHandleData[]> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const foldersList = await new Promise<DirectoryHandleData[]>((resolve, reject) => {
      const request = store.get(FOLDERS_LIST_KEY);
      request.onsuccess = () => {
        const result = request.result || [];
        resolve(Array.isArray(result) ? result : []);
      };
      request.onerror = () => reject(request.error);
    });

    // Verify và filter chỉ những folder còn valid
    const validFolders: DirectoryHandleData[] = [];
    for (const folder of foldersList) {
      try {
        const isValid = await verifyDirectoryHandle(folder.handle);
        if (isValid) {
          validFolders.push(folder);
        }
      } catch (error) {
        // console.log('[DirectoryManager] ⚠️ Folder invalid, skipping:', folder.folderName);
      }
    }

    // Update list nếu có folder invalid
    if (validFolders.length !== foldersList.length) {
      const db = await openDB();
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      await new Promise<void>((resolve, reject) => {
        const request = store.put(validFolders, FOLDERS_LIST_KEY);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    return validFolders;
  } catch (error) {
    // console.error('[DirectoryManager] ❌ Failed to load folders list:', error);
    return [];
  }
}

/**
 * Xóa folder khỏi danh sách
 */
export async function removeFolderFromList(folderName: string): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Load danh sách folders
    const foldersList = await new Promise<DirectoryHandleData[]>((resolve, reject) => {
      const request = store.get(FOLDERS_LIST_KEY);
      request.onsuccess = () => {
        const result = request.result || [];
        resolve(Array.isArray(result) ? result : []);
      };
      request.onerror = () => reject(request.error);
    });

    // Filter ra folder cần xóa
    const filtered = foldersList.filter(f => f.folderName !== folderName);

    // Lưu lại danh sách
    await new Promise<void>((resolve, reject) => {
      const request = store.put(filtered, FOLDERS_LIST_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    // console.log('[DirectoryManager] ✅ Removed folder from list:', folderName);
  } catch (error) {
    // console.error('[DirectoryManager] ❌ Failed to remove folder from list:', error);
    throw error;
  }
}
