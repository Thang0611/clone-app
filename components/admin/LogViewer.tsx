'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, Download, Upload, Filter } from 'lucide-react';
import type { UnifiedLog, LogSeverity, EventCategory } from '@/types';
import { cn } from '@/lib/utils';

interface LogViewerProps {
  orderId: number;
}

const severityConfig = {
  debug: {
    icon: Info,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    borderColor: 'border-gray-200 dark:border-gray-800'
  },
  info: {
    icon: Info,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800'
  },
  warn: {
    icon: AlertCircle,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  warning: {
    icon: AlertCircle,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  error: {
    icon: XCircle,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800'
  },
  critical: {
    icon: AlertCircle,
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-100 dark:bg-red-900/40',
    borderColor: 'border-red-300 dark:border-red-700'
  }
};

const categoryIcons: Record<string, string> = {
  payment: '💳',
  enrollment: '📝',
  download: '⬇️',
  upload: '⬆️',
  system: '⚙️',
  notification: '📧',
  order: '📦'
};

export function LogViewer({ orderId }: LogViewerProps) {
  const [logs, setLogs] = useState<UnifiedLog[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'error' | 'critical'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  useEffect(() => {
    fetchLogs();
  }, [orderId, severityFilter, categoryFilter, sourceFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (severityFilter !== 'all') {
        // Map 'warning' to 'warn' for backend API (backend uses 'warn')
        const backendSeverity = severityFilter === 'warning' ? 'warn' : severityFilter;
        params.append('severity', backendSeverity);
      }
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter);
      }
      if (sourceFilter !== 'all') {
        params.append('source', sourceFilter);
      }

      const url = `/api/admin/orders/${orderId}/logs${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 200)}`);
      }

      const data = await response.json();

      if (data.success) {
        setLogs(data.data?.logs || []);
        setSummary(data.data?.summary || null);
      } else {
        setError(data.error || 'Failed to fetch logs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      console.error('[LogViewer] Error fetching logs:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories and sources for filters
  const categories = Array.from(new Set(logs.map(log => log.category))).sort();
  const sources = Array.from(new Set(logs.map(log => log.source))).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading logs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-sm text-red-700 dark:text-red-300">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Logs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{summary.errors}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Errors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{summary.warnings}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{summary.info}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Info</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
          
          {/* Severity Filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600 dark:text-gray-400">Severity:</span>
            {(['all', 'info', 'warning', 'error', 'critical'] as const).map((severity) => (
              <button
                key={severity}
                onClick={() => setSeverityFilter(severity)}
                className={cn(
                  'px-2 py-1 text-xs rounded transition-colors',
                  severityFilter === severity
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                )}
              >
                {severity.charAt(0).toUpperCase() + severity.slice(1)}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
              >
                <option value="all">All</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          )}

          {/* Source Filter */}
          {sources.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600 dark:text-gray-400">Source:</span>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700"
              >
                <option value="all">All</option>
                {sources.map(src => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        {/* Logs */}
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No logs found
            </div>
          ) : (
            logs.map((log, index) => {
              // UnifiedLog.level is already 'warn' (not 'warning'), so use it directly
              const config = severityConfig[log.level] || severityConfig.info;
              const Icon = config.icon;
              const categoryIcon = categoryIcons[log.category] || '📋';

              return (
                <div key={log.id} className="relative pl-14">
                  {/* Timeline Dot */}
                  <div className={cn(
                    'absolute left-4 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900',
                    log.level === 'error' || log.level === 'critical' ? 'bg-red-600' :
                    log.level === 'warn' ? 'bg-yellow-600' :
                    'bg-blue-600'
                  )} />

                  {/* Log Card */}
                  <div className={cn(
                    'border rounded-lg p-4',
                    config.bgColor,
                    config.borderColor
                  )}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xl">{categoryIcon}</span>
                        <Icon className={cn('w-4 h-4', config.color)} />
                        <span className={cn('text-sm font-semibold uppercase', config.color)}>
                          {log.level}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
                          {log.type}
                        </span>
                        {log.eventType && (
                          <>
                            <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {log.eventType.replace(/_/g, ' ')}
                            </span>
                          </>
                        )}
                        {log.taskId && (
                          <>
                            <span className="text-sm text-gray-600 dark:text-gray-400">•</span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Task #{log.taskId}
                            </span>
                          </>
                        )}
                      </div>
                      <time className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {(() => {
                          try {
                            const date = new Date(log.timestamp);
                            if (isNaN(date.getTime())) {
                              // Invalid date, try to parse as string
                              const parsed = Date.parse(log.timestamp);
                              if (isNaN(parsed)) {
                                return 'Invalid Date';
                              }
                              return new Date(parsed).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              });
                            }
                            return date.toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            });
                          } catch (error) {
                            return log.timestamp || 'N/A';
                          }
                        })()}
                      </time>
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-900 dark:text-white mb-2">
                      {log.message}
                    </p>

                    {/* Progress Bar (for task logs with progress) */}
                    {log.progress !== null && log.progress !== undefined && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span className="font-semibold">{log.progress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, log.progress))}%` }}
                          />
                        </div>
                        {log.currentFile && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                            📄 {log.currentFile}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Status Change (for audit logs) */}
                    {log.previousStatus && log.newStatus && (
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                          {log.previousStatus}
                        </span>
                        <span>→</span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                          {log.newStatus}
                        </span>
                      </div>
                    )}

                    {/* Details */}
                    {log.details && Object.keys(log.details).length > 0 && (
                      <details className="mt-2">
                        <summary className="text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white">
                          Show details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}

                    {/* Source */}
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Source: <span className="font-mono">{log.source}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
