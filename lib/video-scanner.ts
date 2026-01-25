/**
 * VideoScanner - Scan folder và tìm video files
 * Phase 1: Recursive Scan + Natural Sort + Clean Display Names
 */

export interface VideoFile {
  name: string;
  displayName: string;
  handle: FileSystemFileHandle;
  path: string; // Relative path from root
  size: number;
  lastModified: number;
}

const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mkv', '.avi', '.mov', '.m4v', '.flv', '.wmv'];
const AUDIO_EXTENSIONS = ['.mp3', '.m4a', '.wav', '.ogg', '.aac', '.flac'];

/**
 * Kiểm tra file có phải video không
 */
function isVideoFile(name: string): boolean {
  const ext = name.toLowerCase().substring(name.lastIndexOf('.'));
  
  // Loại bỏ audio files
  if (AUDIO_EXTENSIONS.includes(ext)) {
    return false;
  }
  
  // Kiểm tra video extensions
  return VIDEO_EXTENSIONS.includes(ext);
}

/**
 * Làm sạch tên file để hiển thị
 * - Xóa extension
 * - Xóa prefix "Copy of", "Copy (1) of"
 * - Xóa số thứ tự ở đầu (01, 02, ...)
 * - Trim whitespace
 */
export function cleanFileName(name: string): string {
  let cleaned = name;

  // Xóa extension
  const extIndex = cleaned.lastIndexOf('.');
  if (extIndex > 0) {
    cleaned = cleaned.substring(0, extIndex);
  }

  // Xóa "Copy of", "Copy (1) of", etc.
  cleaned = cleaned.replace(/^Copy\s*(\(\d+\))?\s*of\s+/i, '');

  // Xóa số thứ tự ở đầu (01, 02, 03, ...)
  cleaned = cleaned.replace(/^\d+\s*[-.]\s*/, '');

  // Xóa các ký tự đặc biệt thừa
  cleaned = cleaned.replace(/[_-]+/g, ' ');

  // Trim
  cleaned = cleaned.trim();

  return cleaned || name; // Fallback về tên gốc nếu rỗng
}

/**
 * Natural Sort - Sắp xếp như con người (1, 2, 10 thay vì 1, 10, 2)
 */
export function naturalSort(videos: VideoFile[]): VideoFile[] {
  const collator = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: 'base',
  });

  return [...videos].sort((a, b) => {
    // Ưu tiên sắp xếp theo path (để giữ cấu trúc folder)
    if (a.path !== b.path) {
      return collator.compare(a.path, b.path);
    }
    
    // Sau đó sắp xếp theo tên
    return collator.compare(a.name, b.name);
  });
}

/**
 * Scan folder đệ quy để tìm tất cả video files
 * Progressive scanning với progress callback
 * Phase 2: Improved progressive scanning với better progress reporting
 */
export interface ScanProgress {
  count: number;
  currentPath: string;
  totalFoldersScanned: number;
  totalFoldersRemaining: number;
  estimatedTotal?: number;
}

export async function scanFolderRecursive(
  handle: FileSystemDirectoryHandle,
  onProgress?: (progress: ScanProgress) => void
): Promise<VideoFile[]> {
  const videos: VideoFile[] = [];
  const queue: Array<{ handle: FileSystemDirectoryHandle; path: string }> = [
    { handle, path: '' },
  ];
  let foldersScanned = 0;
  const scannedFolders = new Set<string>(); // Track scanned folders để tránh duplicate

  // First pass: Count total folders (optional, để có estimatedTotal)
  // Skip for now để không làm chậm, có thể optimize sau

  while (queue.length > 0) {
    const { handle: currentHandle, path: currentPath } = queue.shift()!;
    const folderKey = currentPath || '/';

    // Skip nếu đã scan
    if (scannedFolders.has(folderKey)) {
      continue;
    }
    scannedFolders.add(folderKey);

    try {
      // Đọc entries trong folder hiện tại
      for await (const entry of currentHandle.values()) {
        if (entry.kind === 'directory') {
          // Thêm vào queue để scan sau
          const newPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
          queue.push({
            handle: entry as FileSystemDirectoryHandle,
            path: newPath,
          });
        } else if (entry.kind === 'file') {
          const fileHandle = entry as FileSystemFileHandle;
          
          // Kiểm tra có phải video không
          if (isVideoFile(fileHandle.name)) {
            try {
              const file = await fileHandle.getFile();
              const fullPath = currentPath
                ? `${currentPath}/${fileHandle.name}`
                : fileHandle.name;

              videos.push({
                name: fileHandle.name,
                displayName: cleanFileName(fileHandle.name),
                handle: fileHandle,
                path: fullPath,
                size: file.size,
                lastModified: file.lastModified,
              });

              // Call progress callback với thông tin chi tiết hơn
              if (onProgress) {
                onProgress({
                  count: videos.length,
                  currentPath: fullPath,
                  totalFoldersScanned: foldersScanned + 1,
                  totalFoldersRemaining: queue.length,
                });
              }

              // Yield để UI không freeze (mỗi 20 files để responsive hơn)
              if (videos.length % 20 === 0) {
                await new Promise((resolve) => setTimeout(resolve, 0));
              }
            } catch (error) {
              console.warn(`[VideoScanner] ⚠️ Failed to read file ${fileHandle.name}:`, error);
              // Continue với file tiếp theo
            }
          }
        }
      }

      foldersScanned++;

      // Yield sau mỗi folder để UI responsive
      if (foldersScanned % 10 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    } catch (error) {
      console.error(`[VideoScanner] ❌ Error scanning folder ${currentPath}:`, error);
      // Continue với folder tiếp theo
    }
  }

  // Natural sort
  const sorted = naturalSort(videos);

  console.log(`[VideoScanner] ✅ Found ${sorted.length} video files in ${foldersScanned} folders`);
  return sorted;
}

/**
 * Tìm subtitle file (.vtt, .srt) cho video
 */
export async function findSubtitleFile(
  videoFile: VideoFile,
  directoryHandle: FileSystemDirectoryHandle
): Promise<FileSystemFileHandle | null> {
  const videoName = videoFile.name.substring(0, videoFile.name.lastIndexOf('.'));
  const subtitleExtensions = ['.vtt', '.srt'];

  // Tìm trong cùng folder với video
  const videoPath = videoFile.path.split('/');
  const videoDir = videoPath.slice(0, -1); // Bỏ tên file, chỉ lấy path folder

  try {
    // Navigate đến folder chứa video
    let currentHandle = directoryHandle;
    for (const segment of videoDir) {
      if (segment) {
        currentHandle = await currentHandle.getDirectoryHandle(segment);
      }
    }

    // Tìm subtitle file
    for (const ext of subtitleExtensions) {
      const subtitleName = `${videoName}${ext}`;
      try {
        const subtitleHandle = await currentHandle.getFileHandle(subtitleName);
        return subtitleHandle;
      } catch {
        // File không tồn tại, thử extension tiếp theo
        continue;
      }
    }
  } catch (error) {
    // Folder không tồn tại hoặc không truy cập được
    console.warn(`[VideoScanner] ⚠️ Could not find subtitle for ${videoFile.name}:`, error);
  }

  return null;
}
