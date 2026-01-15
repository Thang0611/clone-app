'use client';

import { useState, useEffect, useRef } from 'react';
import { Terminal, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskLogViewerProps {
  taskId: number;
  autoRefresh?: boolean;
  maxLines?: number;
}

export function TaskLogViewer({ taskId, autoRefresh = false, maxLines = 200 }: TaskLogViewerProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(autoRefresh);
  const logEndRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      setError(null);
      const response = await fetch(`/api/admin/tasks/${taskId}/logs/raw?lines=${maxLines}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setLogs(data.data?.logs || []);
      } else {
        setError(data.error || 'Failed to fetch logs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('[TaskLogViewer] Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    
    let interval: NodeJS.Timeout | null = null;
    if (autoRefreshEnabled && isExpanded) {
      // Auto-refresh every 3 seconds when expanded
      interval = setInterval(fetchLogs, 3000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [taskId, autoRefreshEnabled, isExpanded, maxLines]);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isExpanded && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isExpanded]);

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="mt-3 w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">
            Xem Worker Logs ({logs.length} dòng)
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      </button>
    );
  }

  return (
    <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            Worker Download Logs
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({logs.length} dòng gần nhất)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
            className={cn(
              'px-2 py-1 text-xs rounded transition-colors',
              autoRefreshEnabled
                ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            )}
          >
            {autoRefreshEnabled ? '🔄 Auto' : '⏸️ Manual'}
          </button>
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
            title="Refresh logs"
          >
            <RefreshCw className={cn('w-4 h-4 text-gray-600 dark:text-gray-400', loading && 'animate-spin')} />
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Log Content */}
      <div className="relative">
        {loading && logs.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Đang tải logs...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded m-3">
            <p className="text-sm text-red-700 dark:text-red-300">
              Lỗi: {error}
            </p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            Chưa có logs
          </div>
        ) : (
          <div className="bg-gray-900 text-gray-100 font-mono text-xs p-4 max-h-96 overflow-y-auto">
            {logs.map((line, index) => {
              // Color code based on log level
              let lineColor = 'text-gray-300';
              if (line.includes('[ERROR]') || line.includes('ERROR') || line.includes('Failed')) {
                lineColor = 'text-red-400';
              } else if (line.includes('[WARN]') || line.includes('WARNING')) {
                lineColor = 'text-yellow-400';
              } else if (line.includes('[INFO]') || line.includes('INFO')) {
                lineColor = 'text-blue-400';
              } else if (line.includes('[SUCCESS]') || line.includes('completed')) {
                lineColor = 'text-green-400';
              }

              return (
                <div
                  key={index}
                  className={cn('py-0.5 break-words', lineColor)}
                >
                  {line || '\u00A0'} {/* Non-breaking space for empty lines */}
                </div>
              );
            })}
            <div ref={logEndRef} />
          </div>
        )}
      </div>
    </div>
  );
}
