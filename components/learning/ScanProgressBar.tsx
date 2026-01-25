'use client';

/**
 * ScanProgressBar - UI progress bar cho folder scanning
 * Phase 2: Progressive Folder Scanning với UI
 */

import type { ScanProgress } from '@/lib/video-scanner';

interface ScanProgressBarProps {
  progress: ScanProgress;
  className?: string;
}

export function ScanProgressBar({ progress, className = '' }: ScanProgressBarProps) {
  const { count, currentPath, totalFoldersScanned, totalFoldersRemaining } = progress;

  // Calculate percentage (rough estimate)
  const totalItems = totalFoldersScanned + totalFoldersRemaining;
  const percentage = totalItems > 0 ? (totalFoldersScanned / totalItems) * 100 : 0;

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-700 dark:text-gray-300">
          Đang quét folder...
        </span>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {count} video
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <span className="truncate flex-1" title={currentPath}>
          {currentPath || 'Đang quét...'}
        </span>
        <span className="ml-2 flex-shrink-0">
          {totalFoldersScanned} / {totalItems} folders
        </span>
      </div>
    </div>
  );
}
