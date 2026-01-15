'use client';

import { useState } from 'react';
import { ExternalLink, Download } from 'lucide-react';
import type { DownloadTask } from '@/types';
import { StatusBadge } from './StatusBadge';
import { TaskLogViewer } from './TaskLogViewer';
import { cn } from '@/lib/utils';

interface TaskProgressProps {
  task: DownloadTask;
}

export function TaskProgress({ task }: TaskProgressProps) {
  const [showLogs, setShowLogs] = useState(false);
  const progress = task.currentProgress || 0;
  const speed = task.speed ? (task.speed / 1024 / 1024).toFixed(2) : null;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {task.title || 'Untitled Course'}
          </h4>
          <a
            href={task.course_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 inline-flex items-center gap-1 mt-1"
          >
            {task.course_url.length > 50 
              ? task.course_url.substring(0, 50) + '...' 
              : task.course_url}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <StatusBadge status={task.status} size="sm" />
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className={cn(
              'h-3 rounded-full transition-all duration-500',
              task.status === 'completed' && 'bg-green-600',
              task.status === 'downloading' && 'bg-yellow-500 animate-pulse',
              task.status === 'failed' && 'bg-red-600',
              ['pending', 'enrolled'].includes(task.status) && 'bg-gray-400'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current File & Speed */}
      {task.status === 'downloading' && (
        <div className="space-y-2 text-sm">
          {task.currentFile && (
            <div className="flex items-start gap-2">
              <Download className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300 break-all">
                {task.currentFile}
              </span>
            </div>
          )}
          {speed && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500">⚡</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {speed} MB/s
              </span>
            </div>
          )}
        </div>
      )}

      {/* Drive Link */}
      {task.drive_link && task.status === 'completed' && (
        <a
          href={task.drive_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm font-medium"
        >
          📂 Open in Google Drive
          <ExternalLink className="w-4 h-4" />
        </a>
      )}

      {/* Error Log */}
      {task.error_log && task.status === 'failed' && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-red-600 dark:text-red-400 text-sm">⚠️</span>
            <p className="text-sm text-red-700 dark:text-red-300 break-words">
              {task.error_log}
            </p>
          </div>
        </div>
      )}

      {/* Worker Logs - Show for all tasks */}
      <TaskLogViewer 
        taskId={task.id} 
        autoRefresh={task.status === 'downloading' || task.status === 'enrolled'}
        maxLines={200}
      />
    </div>
  );
}
