# UI/UX Fixes Required

## Issue 1: Video Aspect Ratio (Bị Khuyết Top/Bottom)

### Current Problem:
Video player bị crop/khuyết phần trên và dưới khi có title bar.

### Root Cause:
```tsx
// VidstackVideoPlayer.tsx line 288
<div style={{ aspectRatio: '16/16', maxHeight: '100%' }}>  // ← WRONG
  <MediaPlayer style={{ objectFit: 'contain' }}>
```

The `aspect-ratio: 16/9` forces a specific ratio, but the container (`flex-1`) has variable height due to title bar.

### Solution:
Remove `aspectRatio` constraint, let video fill available space naturally:

```tsx
// VidstackVideoPlayer.tsx
<div className={`relative w-full h-full ${className}`}>  // ← Use full height
  <MediaPlayer 
    className="w-full h-full"
    style={{ objectFit: 'contain' }}  // ← Maintain aspect, no crop
  >
```

---

## Issue 2: Lesson Numbering

### Current Problem:
Sidebar shows "1, 2, 3, 4" but lesson names have "015, 016, 017, 018".
Need to transform "015" → "15" and match numbering.

### Example Screenshot:
```
Phần 4 - 06 - GenAI Use Cases
☐ 4 bài học

1   015 Introduction        ← Should be "15"
2   016 Software Development ← Should be "16"
3   017 Retail               ← Should be "17"
4   018 Marketing            ← Should be "18"
```

### Root Cause:
LocalCoursePlayer is displaying index (1,2,3,4) instead of extracting number from filename.

### Solution:

**Step 1**: Extract number from video filename
```typescript
// In LocalCoursePlayer.tsx
function extractLessonNumber(displayName: string): string {
  // Extract leading number: "015 Introduction" → "15"
  const match = displayName.match(/^0*(\d+)/);
  return match ? match[1] : '';
}
```

**Step 2**: Update rendering
```tsx
{/* Current */}
<div className="mr-3 flex h-8 w-8 items-center justify-center">
  {index + 1}  {/* ← WRONG: Shows 1,2,3,4 */}
</div>

{/* Fixed */}
<div className="mr-3 flex h-8 w-8 items-center justify-center">
  {extractLessonNumber(video.displayName) || (index + 1)}
</div>
```

---

## Issue 3: Show Folders Without Videos

### Current Problem:
Folders containing only `.html`, `.docs`, `.zip` files are not displayed in sidebar.

### Example Folder Structure:
```
Section 01/
├── resources.html
├── slides.pdf
└── exercise.zip   ← No video files, folder hidden!
```

### Root Cause:
`scanFolderRecursive()` only tracks folders that contain video files.

### Solution Options:

#### Option A: Scan ALL folders, mark as "resource-only"
```typescript
export interface FolderItem {
  name: string;
  path: string;
  type: 'folder' | 'video';
  hasVideo: boolean;
  resourceCount?: number;
  handle?: FileSystemDirectoryHandle;
}

async function scanFolderRecursive(): Promise<FolderItem[]> {
  const items: FolderItem[] = [];
  
  for (const entry of directory) {
    if (entry.kind === 'directory') {
      // Always add folder
      items.push({
        name: entry.name,
        path: currentPath + '/' + entry.name,
        type: 'folder',
        hasVideo: false,
        handle: entry
      });
      
      // Scan recursively
      const children = await scanFolder(entry);
      items.push(...children);
    }
  }
}
```

#### Option B: Show resource files as clickable items
```tsx
// In sidebar
{section.items.map((item) => (
  item.type === 'video' ? (
    <VideoItem video={item} />
  ) : (
    <FolderItem 
      folder={item} 
      resourceCount={item.resourceCount}
      onClick={() => handleOpenFolder(item)}
    />
  )
))}
```

### Recommended: Option B
- Show folders with resource count badge
- Click → open file browser or download resources
- Better UX for supplementary materials

---

## Implementation Priority:

1. **Fix Video Aspect Ratio** (CRITICAL)
   - File: `VidstackVideoPlayer.tsx`
   - Change: Remove `aspectRatio: '16/9'`
   - Impact: Immediate visual fix

2. **Fix Lesson Numbering** (HIGH)
   - File: `LocalCoursePlayer.tsx`  
   - Change: Extract number from filename
   - Impact: Better navigation clarity

3. **Show Resource Folders** (MEDIUM)
   - File: `video-scanner.ts` + `LocalCoursePlayer.tsx`
   - Change: Scan all folders, show with badge
   - Impact: Access to supplementary materials

---

## Testing Checklist:

- [ ] Video fills container without crop/black bars
- [ ] Title bar doesn't overlap video
- [ ] Lesson numbers match folder structure (15, 16, 17)
- [ ] Leading zeros removed (015 → 15)
- [ ] Folders without videos appear in sidebar
- [ ] Resource count badge shows correctly
- [ ] Clicking resource folder opens file browser

---

## Quick Fix Code:

### Fix 1: Video Aspect Ratio

```typescript
// VidstackVideoPlayer.tsx line 288
return (
  <div className={`relative w-full h-full ${className}`}>  {/* Remove aspectRatio */}
    <MediaPlayer
      className="w-full h-full"
      style={{ objectFit: 'contain' }}  {/* Keep this */}
    >
```

### Fix 2: Lesson Numbering

```typescript
// LocalCoursePlayer.tsx - Add helper
const extractLessonNumber = (displayName: string): string => {
  const match = displayName.match(/^0*(\d+)/);
  return match ? match[1] : '';
};

// In render (find current index display)
<div className="...">
  {extractLessonNumber(video.displayName) || (sectionVideoIndex + 1)}
</div>
```

### Fix 3: Resource Folders (Minimal)

```typescript
// video-scanner.ts - Add to VideoFile interface
export interface ResourceFolder {
  name: string;
  path: string;
  handle: FileSystemDirectoryHandle;
  fileCount: number;
  fileTypes: string[]; // ['.html', '.pdf', '.zip']
}

// Export alongside videos
export async function scanFolderRecursive(): Promise<{
  videos: VideoFile[];
  resourceFolders: ResourceFolder[];
}> {
  // Track both videos and empty folders with resources
}
```
