'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, RefreshCw, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskLogViewerProps {
  taskId: number;
  taskTitle?: string;
  autoRefresh?: boolean;
  maxLines?: number;
}

export function TaskLogViewer({ taskId, taskTitle, autoRefresh: initialAutoRefresh = false, maxLines = 200 }: TaskLogViewerProps) {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(initialAutoRefresh);
  const logEndRef = useRef<HTMLDivElement>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
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
      console.error('[TaskLogViewer] Error fetching logs:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (expanded) {
      fetchLogs();
    }
  }, [taskId, expanded]);

  // Auto-refresh when expanded and auto-refresh is enabled
  useEffect(() => {
    if (!expanded || !autoRefresh) return;

    const interval = setInterval(() => {
      fetchLogs();
    }, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, [expanded, autoRefresh, taskId]);

  // Scroll to bottom when new logs arrive
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (loading && !expanded) {
    return null;
  }

  return (
    <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Download Logs (Worker Python)
          </span>
          {taskTitle && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              - {taskTitle}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>

      {/* Logs Content */}
      {expanded && (
        <div className="bg-gray-900 text-gray-100 p-4">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {logs.length} lines (last 200)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="w-3 h-3"
                />
                Auto-refresh
              </label>
              <button
                onClick={fetchLogs}
                disabled={loading}
                className="p-1.5 hover:bg-gray-800 rounded transition-colors disabled:opacity-50"
                title="Refresh logs"
              >
                <RefreshCw className={cn('w-4 h-4 text-gray-400', loading && 'animate-spin')} />
              </button>
            </div>
          </div>

          {/* Logs Display */}
          {loading && logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm">Loading logs...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-900/20 border border-red-800 rounded text-sm text-red-300">
              Error: {error}
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No logs available yet
            </div>
          ) : (
            <div className="font-mono text-xs leading-relaxed max-h-96 overflow-y-auto">
              {logs.map((line, index) => {
                // Color code based on log level
                const isError = line.toLowerCase().includes('error') || 
                               line.toLowerCase().includes('failed') ||
                               line.toLowerCase().includes('exception');
                const isWarning = line.toLowerCase().includes('warning') || 
                                 line.toLowerCase().includes('warn');
                const isInfo = line.toLowerCase().includes('info') || 
                              line.toLowerCase().includes('downloading') ||
                              line.toLowerCase().includes('progress');
                
                return (
                  <div
                    key={index}
                    className={cn(
                      'px-2 py-0.5 hover:bg-gray-800/50',
                      isError && 'text-red-400',
                      isWarning && 'text-yellow-400',
                      isInfo && 'text-green-400',
                      !isError && !isWarning && !isInfo && 'text-gray-300'
                    )}
                  >
                    {line || '\u00A0'} {/* Non-breaking space for empty lines */}
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
