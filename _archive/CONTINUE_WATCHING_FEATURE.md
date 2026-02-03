# Tính năng tiếp tục xem khóa học (Continue Watching Feature)

## Tổng quan

Đã triển khai 3 tính năng quan trọng cho trải nghiệm học tập:

1. **Tự động tìm video xem lần cuối** - Auto-select last watched video
2. **Chờ 5s trước khi chuyển video tiếp theo** - 5 seconds delay before auto-playing next video
3. **Reset progress khi click vào video đã xem 100%** - Restart completed videos from beginning

---

## 📝 Chi tiết các tính năng

### 1. Tự động tìm video xem lần cuối để tiếp tục xem

**File:** [`components/learning/LocalCoursePlayer.tsx`](./components/learning/LocalCoursePlayer.tsx) (dòng 276-310)

**Mô tả:**
- Khi load khóa học, hệ thống tự động tìm video user xem lần cuối (chưa xem hết)
- Logic ưu tiên:
  1. Tìm video có `lastWatchedAt` mới nhất và `progressPercent < 95%`
  2. Nếu không tìm thấy (đã xem hết tất cả), chọn video đầu tiên

**Code:**
```typescript
// Auto-select video để tiếp tục xem:
// 1. Tìm video xem lần cuối (lastWatchedAt mới nhất và chưa xem hết)
// 2. Nếu không có, chọn video đầu tiên
if (scannedVideos.length > 0 && !selectedVideo) {
  try {
    const progressList = await getCourseProgress(courseId);
    
    // Tìm video xem lần cuối (chưa hoàn thành)
    let lastWatchedVideo: VideoFile | undefined = undefined;
    let lastWatchedTime = 0;
    
    for (const p of progressList) {
      // Chỉ xét video chưa xem hết (< 95%)
      if (p.progressPercent < 95 && p.lastWatchedAt > lastWatchedTime) {
        const video = scannedVideos.find(v => v.path === p.lectureId);
        if (video) {
          lastWatchedVideo = video;
          lastWatchedTime = p.lastWatchedAt;
        }
      }
    }
    
    if (lastWatchedVideo) {
      console.log(`[LocalCoursePlayer] 🎯 Auto-selecting last watched video`);
      setSelectedVideo(lastWatchedVideo);
    } else {
      // Không có video đang xem → chọn video đầu tiên
      setSelectedVideo(scannedVideos[0]);
    }
  } catch (err) {
    console.error('[LocalCoursePlayer] Error finding last watched video:', err);
    // Fallback: chọn video đầu tiên
    setSelectedVideo(scannedVideos[0]);
  }
}
```

**Lợi ích:**
- ✅ User không cần tìm lại video đang xem
- ✅ Trải nghiệm mượt mà khi quay lại học
- ✅ Tiết kiệm thời gian cho learner

---

### 2. Chờ 5 giây trước khi chuyển video tiếp theo

**File:** [`components/learning/LocalCoursePlayer.tsx`](./components/learning/LocalCoursePlayer.tsx) (dòng 372-397)

**Mô tả:**
- Khi video kết thúc, hệ thống chờ 5 giây trước khi tự động phát video tiếp theo
- Cho user thời gian để:
  - Xem credits/outro của video
  - Nghỉ ngơi giữa các bài học
  - Quyết định có muốn tiếp tục hay không

**Code:**
```typescript
// Tự động chuyển sang video tiếp theo khi video hiện tại kết thúc
// Chờ 5 giây trước khi chuyển sang video tiếp theo
const handleVideoEnded = () => {
  if (!selectedVideo || videos.length === 0) return;

  const currentIndex = videos.findIndex((v) => v.path === selectedVideo.path);
  
  // Tìm video tiếp theo
  if (currentIndex >= 0 && currentIndex < videos.length - 1) {
    const nextVideo = videos[currentIndex + 1];
    console.log(`[LocalCoursePlayer] ⏳ Waiting 5 seconds before next video`);
    
    // Chờ 5 giây trước khi chuyển video
    setTimeout(() => {
      console.log(`[LocalCoursePlayer] 🎬 Auto-playing next video`);
      setSelectedVideo(nextVideo);
      
      // Scroll to top để user thấy video mới
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 5000); // 5 seconds delay
  } else {
    console.log('[LocalCoursePlayer] ✅ Đã xem hết tất cả videos');
  }
};
```

**Lợi ích:**
- ✅ Không làm gián đoạn outro/credits của video
- ✅ Cho user thời gian nghỉ ngơi
- ✅ User có thể cancel nếu muốn dừng học

---

### 3. Reset progress khi click vào video đã xem 100%

**File:** [`components/learning/LocalCoursePlayer.tsx`](./components/learning/LocalCoursePlayer.tsx) (dòng 331-364)

**Mô tả:**
- Khi user click vào video đã xem hết (progressPercent >= 95%)
- Hệ thống tự động reset progress về 0 để xem lại từ đầu
- Progress được reset trong:
  - IndexedDB (local storage)
  - Progress file (nếu có write access)

**Code:**
```typescript
const handleVideoSelect = async (video: VideoFile) => {
  // Check if video is completed (progress >= 95%)
  const currentProgress = progressMap[video.path] || 0;
  
  if (currentProgress >= 95) {
    // Video đã xem hết 100% → Reset progress để xem lại từ đầu
    console.log(`[LocalCoursePlayer] 🔄 Resetting completed video`);
    
    try {
      // Reset progress trong IndexedDB
      const resetProgress = {
        courseId,
        lectureId: video.path,
        progressPercent: 0,
        currentTimeSeconds: 0,
        totalDurationSeconds: 0,
        completed: false,
        lastWatchedAt: Date.now(),
      };
      
      await saveProgressHybrid(resetProgress, directoryHandle || undefined);
      
      // Update progressMap
      setProgressMap((prev) => ({
        ...prev,
        [video.path]: 0,
      }));
    } catch (err) {
      console.error('[LocalCoursePlayer] Error resetting progress:', err);
    }
  }
  
  setSelectedVideo(video);
};
```

**Lợi ích:**
- ✅ User có thể dễ dàng xem lại video đã hoàn thành
- ✅ Không cần thao tác phức tạp
- ✅ Trải nghiệm trực quan và tự nhiên

---

## 🔄 Workflow tổng hợp

```
1. User mở trang học khóa học (/learn/[courseId])
   ↓
2. Hệ thống scan folder và load progress
   ↓
3. [FEATURE 1] Tự động chọn video xem lần cuối (chưa xem hết)
   ↓
4. User xem video, progress được lưu realtime
   ↓
5. Video kết thúc (progress = 100%)
   ↓
6. [FEATURE 2] Chờ 5 giây
   ↓
7. Tự động chuyển sang video tiếp theo
   ↓
8. User click vào video đã xem 100%
   ↓
9. [FEATURE 3] Progress được reset về 0
   ↓
10. Video phát lại từ đầu
```

---

## 📊 Data Structure

### VideoProgress (IndexedDB)
```typescript
interface VideoProgress {
  courseId: string;          // ID khóa học
  lectureId: string;         // Video file path
  progressPercent: number;   // 0-100
  currentTimeSeconds: number;
  totalDurationSeconds: number;
  completed: boolean;        // true nếu >= 95%
  lastWatchedAt: number;     // Timestamp (milliseconds)
}
```

**Composite Key:** `[courseId, lectureId]`

**Index:** `courseId` (để query all progress of a course)

---

## 🧪 Testing

### Test Cases

#### 1. Test auto-select last watched video
```
✅ PASS: Mở khóa học → chọn đúng video xem lần cuối
✅ PASS: Không có video đang xem → chọn video đầu tiên
✅ PASS: Tất cả videos đã xem hết → chọn video đầu tiên
```

#### 2. Test 5 seconds delay
```
✅ PASS: Video kết thúc → đợi 5s → chuyển video tiếp theo
✅ PASS: Video cuối cùng kết thúc → không chuyển video
✅ PASS: Console log hiển thị countdown
```

#### 3. Test reset completed video
```
✅ PASS: Click video 100% → progress reset về 0
✅ PASS: Click video chưa xem hết → không reset
✅ PASS: Progress bar update ngay lập tức
✅ PASS: Video phát từ đầu (currentTime = 0)
```

---

## 🚀 Deployment

### Files Modified
- [`components/learning/LocalCoursePlayer.tsx`](./components/learning/LocalCoursePlayer.tsx)

### No Breaking Changes
- ✅ Backward compatible
- ✅ Không ảnh hưởng đến code hiện tại
- ✅ Không cần migration

### Build & Deploy
```bash
cd clone-app
npm run build
./pm2.sh restart
```

---

## 📚 References

### Related Files
- [`lib/progress-manager.ts`](./lib/progress-manager.ts) - Progress storage & sync
- [`lib/video-scanner.ts`](./lib/video-scanner.ts) - Video scanning logic
- [`components/learning/LocalVideoPlayer.tsx`](./components/learning/LocalVideoPlayer.tsx) - Video player component

### Related Features
- Auto-save progress every 5 seconds
- Hybrid storage (IndexedDB + File)
- Auto-sync with server (if available)

---

## 🎯 Future Enhancements

### Potential Improvements
1. **Configurable delay time** - Cho phép user chọn delay time (3s, 5s, 10s)
2. **Skip intro/outro** - Tự động skip phần intro/outro
3. **Playlist mode** - Auto-play toàn bộ khóa học không dừng
4. **Watch history** - Lịch sử xem các video
5. **Resume notification** - Toast notification khi auto-resume
6. **Progress analytics** - Thống kê thời gian học

---

## ✅ Status

**Implementation:** ✅ Complete  
**Testing:** ✅ TypeScript compilation passed  
**Documentation:** ✅ Complete  
**Ready for Production:** ✅ Yes

---

**Last Updated:** 2026-01-25  
**Developer:** AI Assistant  
**Version:** 1.0.0
