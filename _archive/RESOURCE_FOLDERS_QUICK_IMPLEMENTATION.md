# Resource Folders - Quick Implementation Plan

## Goal
Show folder "03 - Quiz" (contains readme.md, test.pdf, test.zip) in Section Lectures sidebar.

## Simple Approach (No Scanner Refactor)

### Strategy:
After scanning videos, scan folders in same directory to find resource-only folders.

---

## Implementation Steps

### Step 1: Add Folder Scanning Logic

**Location**: After video scanning in `handleFolderSelected()` in `LocalCoursePlayer.tsx`

```typescript
// After line 252: setVideos(scannedVideos)

// Scan for resource folders
const resourceFolders = await scanResourceFolders(handle, scannedVideos);
console.log('[LocalCoursePlayer] 📁 Found resource folders:', resourceFolders.length);

// Store in state
setResourceFolders(resourceFolders);
```

### Step 2: Create scanResourceFolders Function

**Add to `LocalCoursePlayer.tsx`** (before handleFolderSelected):

```typescript
interface ResourceFolder {
  name: string;
  path: string;
  displayName: string;
  resourceCount: number;
  fileTypes: string[]; // ['zip', 'pdf', 'md']
  handle: FileSystemDirectoryHandle;
}

async function scanResourceFolders(
  rootHandle: FileSystemDirectoryHandle,
  videos: VideoFile[]
): Promise<ResourceFolder[]> {
  const folders: ResourceFolder[] = [];
  const videoFolders = new Set(videos.map(v => {
    const parts = v.path.split('/');
    return parts.length > 1 ? parts.slice(0, -1).join('/') : '';
  }));

  // Scan all directories
  for await (const entry of rootHandle.values()) {
    if (entry.kind === 'directory') {
      const dirHandle = entry as FileSystemDirectoryHandle;
      const folderPath = entry.name;
      
      // Skip if this folder has videos
      if (videoFolders.has(folderPath)) continue;
      
      // Count resource files
      let resourceCount = 0;
      const fileTypes = new Set<string>();
      
      try {
        for await (const fileEntry of dirHandle.values()) {
          if (fileEntry.kind === 'file') {
            const fileName = fileEntry.name;
            const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.')).substring(1);
            
            // Check if resource file
            if (['zip', 'pdf', 'html', 'md', 'doc', 'docx', 'ppt', 'pptx'].includes(ext)) {
              resourceCount++;
              fileTypes.add(ext);
            }
          }
        }
      } catch (err) {
        console.warn('[scanResourceFolders] Could not scan:', folderPath, err);
      }
      
      // Only add if has resources
      if (resourceCount > 0) {
        folders.push({
          name: entry.name,
          path: folderPath,
          displayName: cleanFileName(entry.name),
          resourceCount,
          fileTypes: Array.from(fileTypes),
          handle: dirHandle
        });
      }
    }
  }
  
  return folders;
}
```

### Step 3: Update State

**Add state variable** in `LocalCoursePlayer.tsx` (after line 40):

```typescript
const [resourceFolders, setResourceFolders] = useState<ResourceFolder[]>([]);
```

### Step 4: Merge into Sections

**Update Section interface** (around line 53):

```typescript
interface SectionItem {
  type: 'video' | 'folder';
  video?: VideoFile;
  folder?: ResourceFolder;
}

interface Section {
  title: string;
  items: SectionItem[]; // Changed from videos: VideoFile[]
  index: number;
}
```

**Update section grouping logic** (around line 146):

```typescript
// Group both videos and folders
const sectionMap = new Map<string, SectionItem[]>();

// Add videos
videos.forEach((video) => {
  const pathParts = video.path.split('/').filter(p => p);
  let sectionTitle = 'Tất cả bài học';
  
  if (pathParts.length > 1) {
    sectionTitle = pathParts[pathParts.length - 2];
  }
  
  if (!sectionMap.has(sectionTitle)) {
    sectionMap.set(sectionTitle, []);
  }
  sectionMap.get(sectionTitle)!.push({ type: 'video', video });
});

// Add resource folders
resourceFolders.forEach((folder) => {
  const sectionTitle = folder.name; // Folder name is the section
  
  if (!sectionMap.has(sectionTitle)) {
    sectionMap.set(sectionTitle, []);
  }
  sectionMap.get(sectionTitle)!.push({ type: 'folder', folder });
});

// Convert to array
const newSections: Section[] = Array.from(sectionMap.entries()).map(([title, items], index) => ({
  title,
  items: items.sort((a, b) => {
    // Videos first, then folders
    if (a.type === 'video' && b.type === 'folder') return -1;
    if (a.type === 'folder' && b.type === 'video') return 1;
    
    // Sort by path/name
    const aPath = a.video?.path || a.folder?.path || '';
    const bPath = b.video?.path || b.folder?.path || '';
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    return collator.compare(aPath, bPath);
  }),
  index,
}));
```

### Step 5: Update Section Header

**Update video count** (around line 752):

```typescript
<span className="flex items-center gap-1">
  <BookOpen className="w-3 h-3" />
  {section.items.filter(i => i.type === 'video').length} bài học
  {section.items.filter(i => i.type === 'folder').length > 0 && 
    ` • ${section.items.filter(i => i.type === 'folder').length} tài liệu`
  }
</span>
```

### Step 6: Render Items

**Update rendering** (around line 774):

```typescript
{section.items.map((item, itemIndex) => {
  if (item.type === 'video') {
    const video = item.video!;
    const progress = progressMap[video.path] || 0;
    const isSelected = selectedVideo?.path === video.path;
    const isCompleted = progress >= 95;
    
    return (
      <button /* existing video button */ >
        {/* existing video content */}
      </button>
    );
  } else {
    // Resource folder
    const folder = item.folder!;
    
    return (
      <div
        key={folder.path}
        className="rounded-lg border-2 border-dashed border-amber-200 bg-amber-50/50 p-3 dark:border-amber-800 dark:bg-amber-900/10"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <span className="text-sm">📁</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {folder.displayName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {folder.resourceCount} tài liệu (.{folder.fileTypes.join(', .')})
            </div>
          </div>
          <button
            onClick={() => alert(`Folder: ${folder.name}\nFiles: ${folder.resourceCount}`)}
            className="text-xs px-2 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          >
            Xem
          </button>
        </div>
      </div>
    );
  }
})}
```

---

## Complete Modified Functions

### handleFolderSelected (add after line 252):

```typescript
// After: setVideos(scannedVideos);

// Scan for resource folders
try {
  const resourceFolders = await scanResourceFolders(handle, scannedVideos);
  setResourceFolders(resourceFolders);
  console.log(`[LocalCoursePlayer] 📁 Found ${resourceFolders.length} resource folders`);
} catch (err) {
  console.warn('[LocalCoursePlayer] Could not scan resource folders:', err);
  setResourceFolders([]);
}
```

---

## Testing

1. Open folder with "03 - Quiz" containing .zip, .pdf, .md
2. Verify "03 - Quiz" appears in section "Phần 3"
3. Shows "3 tài liệu (.zip, .pdf, .md)"
4. Click "Xem" shows alert with info

---

## Estimated Time: 1-2 hours

This is the MINIMAL implementation to show resource folders in sidebar.
Future: Add modal dialog to list and download individual files.
