# Local Folder Learning - Phase 1 Implementation

## 📋 Tổng Quan

Phase 1 đã triển khai các tính năng cốt lõi cho File System Access API:

1. ✅ **Persistent Handle** - Lưu DirectoryHandle vào IndexedDB
2. ✅ **Lazy Loading** - Chỉ load video khi cần, cleanup Blob URL
3. ✅ **Permission UX Flow** - Tối ưu trải nghiệm xin quyền
4. ✅ **Error Handling** - Xử lý lỗi toàn diện

## 📁 Cấu Trúc Files

```
lib/
├── directory-manager.ts      # Quản lý DirectoryHandle + IndexedDB
├── video-scanner.ts          # Scan folder + Natural sort
└── progress-manager.ts      # Quản lý progress + Sync

components/learning/
├── DirectorySelector.tsx     # Component chọn folder
├── LocalVideoPlayer.tsx      # Component phát video
└── LocalCoursePlayer.tsx     # Component tổng hợp

types/
└── file-system-access.d.ts   # Type definitions
```

## 🚀 Cách Sử Dụng

### 1. Sử dụng LocalCoursePlayer (Component tổng hợp)

```tsx
import { LocalCoursePlayer } from '@/components/learning/LocalCoursePlayer';

function MyPage() {
  return (
    <LocalCoursePlayer
      courseId="course-123"
      courseName="Tên Khóa Học"
      deviceId="device-123" // Optional, để sync progress
    />
  );
}
```

### 2. Sử dụng từng component riêng lẻ

```tsx
import { DirectorySelector } from '@/components/learning/DirectorySelector';
import { LocalVideoPlayer } from '@/components/learning/LocalVideoPlayer';
import { scanFolderRecursive } from '@/lib/video-scanner';

function MyCustomPlayer() {
  const [handle, setHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [videos, setVideos] = useState<VideoFile[]>([]);

  return (
    <>
      <DirectorySelector
        onFolderSelected={async (handle, name) => {
          setHandle(handle);
          const videos = await scanFolderRecursive(handle);
          setVideos(videos);
        }}
      />
      
      {videos.map(video => (
        <LocalVideoPlayer
          key={video.path}
          video={video}
          courseId="course-123"
          directoryHandle={handle!}
        />
      ))}
    </>
  );
}
```

### 3. Sử dụng utilities trực tiếp

```tsx
import { requestDirectoryAccess } from '@/lib/directory-manager';
import { scanFolderRecursive } from '@/lib/video-scanner';
import { saveProgress, getProgress } from '@/lib/progress-manager';

// Chọn folder
const result = await requestDirectoryAccess();
if (result) {
  const { handle, folderName } = result;
  
  // Scan videos
  const videos = await scanFolderRecursive(handle, (count, path) => {
    console.log(`Found ${count} videos, current: ${path}`);
  });
  
  // Lưu progress
  await saveProgress({
    courseId: 'course-123',
    lectureId: 'video-1.mp4',
    progressPercent: 50,
    currentTimeSeconds: 120,
    totalDurationSeconds: 240,
    completed: false,
    lastWatchedAt: Date.now(),
  });
  
  // Lấy progress
  const progress = await getProgress('course-123', 'video-1.mp4');
}
```

## ✨ Tính Năng

### DirectoryManager
- ✅ Lưu/load DirectoryHandle từ IndexedDB
- ✅ Verify handle vẫn valid
- ✅ Request permission với UX tối ưu
- ✅ Clear cache khi cần

### VideoScanner
- ✅ Recursive scan tất cả subfolders
- ✅ Natural sort (1, 2, 10 thay vì 1, 10, 2)
- ✅ Clean display names (xóa "Copy of", số thứ tự)
- ✅ Auto-detect subtitles (.vtt, .srt)
- ✅ Progressive scanning với progress callback

### ProgressManager
- ✅ Lưu progress vào IndexedDB
- ✅ Sync queue cho offline-first
- ✅ Auto-sync với server mỗi 30s
- ✅ Batch sync để tối ưu

### LocalVideoPlayer
- ✅ Lazy loading (chỉ load khi cần)
- ✅ Blob URL cleanup (tránh memory leak)
- ✅ Auto-resume từ progress đã lưu
- ✅ Auto-detect và load subtitles
- ✅ Auto-save progress mỗi 5s

### DirectorySelector
- ✅ Check cached folder khi mount
- ✅ Hiển thị option "Tiếp tục" nếu có cache
- ✅ Browser compatibility check
- ✅ Error handling với message thân thiện

## 🔧 API Endpoints Cần Thiết

Backend cần có endpoint để sync progress:

```
POST /api/v1/learning-progress/batch
Body: {
  progressList: [
    {
      courseId: string,
      lectureId: string,
      progressPercent: number,
      currentTimeSeconds: number,
      totalDurationSeconds: number,
      completed: boolean,
      sourceType: 'local_folder'
    }
  ]
}
```

## ⚠️ Lưu Ý

1. **Browser Support**: Chỉ Chrome/Edge hỗ trợ tốt File System Access API
2. **HTTPS Required**: Cần HTTPS hoặc localhost để API hoạt động
3. **Memory Management**: Blob URL được cleanup tự động, nhưng cần cẩn thận khi có nhiều video
4. **Progress Sync**: Cần deviceId để sync progress với server

## 🐛 Troubleshooting

### "Trình duyệt không hỗ trợ"
- Sử dụng Chrome hoặc Edge (phiên bản mới)
- Kiểm tra `'showDirectoryPicker' in window`

### "Permission denied"
- User đã deny permission → Hướng dẫn vào Settings → Site permissions
- Handle invalid → Clear cache và chọn lại folder

### "Video không phát được"
- Kiểm tra format video (MP4, WebM, MKV)
- Kiểm tra file có bị xóa/di chuyển không
- Xem console log để debug

### "Progress không lưu"
- Kiểm tra IndexedDB có hoạt động không
- Kiểm tra console log
- Verify API endpoint có đúng không

## 📚 Next Steps (Phase 2)

- Progressive folder scanning với UI progress bar
- Video metadata caching
- Write access để lưu .progress.json vào folder
- Advanced error recovery
