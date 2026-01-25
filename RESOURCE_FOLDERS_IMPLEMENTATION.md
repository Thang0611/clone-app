# Resource Folders Implementation Guide

## Objective
Show folders containing resource files (.zip, .pdf, .html, .md, .docs) even when they don't have video files.

## Current Implementation Status

### ✅ What's Done:
1. Video scanning works
2. Videos are displayed in sections
3. DisplayName cleanup implemented

### ❌ What's Missing:
Folders like "03 - Quiz" containing only resource files (test.zip, readme.md, test.pdf) are not shown.

---

## Implementation Steps

### Step 1: Extend VideoFile Interface

**File**: `lib/video-scanner.ts`

```typescript
// Add new type for resource items
export interface ResourceItem {
  name: string;
  displayName: string;
  handle: FileSystemFileHandle;
  path: string;
  size: number;
  lastModified: number;
  fileType: string; // 'zip' | 'pdf' | 'html' | 'md' | 'docs'
}

export interface FolderWithResources {
  name: string;
  path: string;
  displayName: string;
  resources: ResourceItem[];
  handle: FileSystemDirectoryHandle;
}

// Update scan result
export interface ScanResult {
  videos: VideoFile[];
  resourceFolders: FolderWithResources[];
}
```

### Step 2: Add Resource File Detection

**File**: `lib/video-scanner.ts`

```typescript
const RESOURCE_EXTENSIONS = ['.zip', '.pdf', '.html', '.md', '.doc', '.docx', '.ppt', '.pptx'];

function isResourceFile(name: string): boolean {
  const ext = name.toLowerCase().substring(name.lastIndexOf('.'));
  return RESOURCE_EXTENSIONS.includes(ext);
}

function getFileType(name: string): string {
  const ext = name.toLowerCase().substring(name.lastIndexOf('.'));
  return ext.substring(1); // Remove dot
}
```

### Step 3: Modify scanFolderRecursive

**File**: `lib/video-scanner.ts`

```typescript
export async function scanFolderRecursive(
  handle: FileSystemDirectoryHandle,
  onProgress?: (progress: ScanProgress) => void
): Promise<ScanResult> {
  const videos: VideoFile[] = [];
  const resourceFolders: FolderWithResources[] = [];
  const folderResourceMap = new Map<string, ResourceItem[]>();
  
  // ... existing scan logic ...
  
  // In the file scanning loop:
  for await (const entry of currentHandle.values()) {
    if (entry.kind === 'file') {
      const fileHandle = entry as FileSystemFileHandle;
      
      if (isVideoFile(fileHandle.name)) {
        // ... existing video logic ...
      } else if (isResourceFile(fileHandle.name)) {
        // Track resource files
        const file = await fileHandle.getFile();
        const resource: ResourceItem = {
          name: fileHandle.name,
          displayName: cleanFileName(fileHandle.name),
          handle: fileHandle,
          path: fullPath,
          size: file.size,
          lastModified: file.lastModified,
          fileType: getFileType(fileHandle.name)
        };
        
        // Group by folder
        if (!folderResourceMap.has(currentPath)) {
          folderResourceMap.set(currentPath, []);
        }
        folderResourceMap.get(currentPath)!.push(resource);
      }
    }
  }
  
  // After scanning, create resourceFolders for folders with no videos
  for (const [path, resources] of folderResourceMap) {
    const hasVideos = videos.some(v => v.path.startsWith(path));
    if (!hasVideos && resources.length > 0) {
      resourceFolders.push({
        name: path.split('/').pop() || path,
        path,
        displayName: cleanFileName(path.split('/').pop() || path),
        resources,
        handle: /* need to track handle */
      });
    }
  }
  
  return { videos, resourceFolders };
}
```

### Step 4: Update LocalCoursePlayer State

**File**: `components/learning/LocalCoursePlayer.tsx`

```typescript
const [videos, setVideos] = useState<VideoFile[]>([]);
const [resourceFolders, setResourceFolders] = useState<FolderWithResources[]>([]);

// In handleFolderSelected:
const { videos: scannedVideos, resourceFolders: scannedFolders } = await scanFolderRecursive(handle, onProgress);
setVideos(scannedVideos);
setResourceFolders(scannedFolders);
```

### Step 5: Merge into Sections

**File**: `components/learning/LocalCoursePlayer.tsx`

```typescript
// Modify sections to include both videos and resource folders
interface SectionItem {
  type: 'video' | 'resource-folder';
  data: VideoFile | FolderWithResources;
}

interface Section {
  title: string;
  items: SectionItem[];
  index: number;
}

// In section grouping logic:
const sectionMap = new Map<string, SectionItem[]>();

// Add videos
videos.forEach(video => {
  const sectionTitle = extractSectionTitle(video.path);
  if (!sectionMap.has(sectionTitle)) {
    sectionMap.set(sectionTitle, []);
  }
  sectionMap.get(sectionTitle)!.push({ type: 'video', data: video });
});

// Add resource folders
resourceFolders.forEach(folder => {
  const sectionTitle = extractSectionTitle(folder.path);
  if (!sectionMap.has(sectionTitle)) {
    sectionMap.set(sectionTitle, []);
  }
  sectionMap.get(sectionTitle)!.push({ type: 'resource-folder', data: folder });
});
```

### Step 6: Render Resource Folders in UI

**File**: `components/learning/LocalCoursePlayer.tsx`

```tsx
{section.items.map((item, idx) => {
  if (item.type === 'video') {
    const video = item.data as VideoFile;
    return (
      <button /* existing video button */ />
    );
  } else {
    const folder = item.data as FolderWithResources;
    return (
      <div
        key={folder.path}
        className="group w-full rounded-lg p-3 border-2 border-dashed border-gray-300 dark:border-gray-600"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                📁
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
              {folder.displayName}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {folder.resources.length} tài liệu
              {folder.resources.map(r => `.${r.fileType}`).join(', ')}
            </div>
          </div>
          <button
            onClick={() => handleOpenResourceFolder(folder)}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Xem
          </button>
        </div>
      </div>
    );
  }
})}
```

### Step 7: Handle Resource Folder Click

**File**: `components/learning/LocalCoursePlayer.tsx`

```typescript
const handleOpenResourceFolder = async (folder: FolderWithResources) => {
  // Show modal with list of resources
  // User can download individual files
  
  // For now, just log:
  console.log('Resource folder:', folder.displayName);
  console.log('Files:', folder.resources.map(r => r.name));
  
  // Future: Show modal dialog with download buttons
};
```

---

## Testing Checklist

- [ ] Scan folder with mixed videos + resources
- [ ] Scan folder with only resources (no videos)
- [ ] Verify "03 - Quiz" folder appears
- [ ] Verify resource count shows correctly
- [ ] Click resource folder opens list
- [ ] Download individual resource files
- [ ] Verify sorting (folders should appear in order)

---

## Expected UI Result

```
Phần 2 - Understanding Generative AI
☐ 4 bài học

3   Generative AI Introduction
4   Artificial Intelligence (AI), Machine Learning (ML) & Deep Learning
5   Generative AI Recap

Phần 3 - Quiz
📁 Quiz
   3 tài liệu (.zip, .md, .pdf)
   [Xem]

Phần 4 - Understanding Key Concepts
☐ 6 bài học

8   Introduction
9   LLM (Large Language Model)
```

---

## Implementation Complexity

**Estimated Time**: 3-4 hours
**Complexity**: Medium-High
**Priority**: Medium (nice-to-have for resource access)

**Why Complex**:
1. Scanner refactor needed
2. New data structures
3. UI merge logic
4. File download handling
5. Modal dialog for file list

---

## Quick Alternative (Simpler)

If full implementation is too complex, consider:

**Option**: Show resource count in section header

```tsx
<span className="text-xs text-gray-500">
  {section.videoCount} bài học
  {section.resourceCount > 0 && ` • ${section.resourceCount} tài liệu`}
</span>
```

This shows users that resources exist without complex UI changes.
