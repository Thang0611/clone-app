'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import type { AdminOrder, DownloadTask, ProgressEvent, StatusEvent } from '@/types';
import { TaskProgress } from './TaskProgress';
import { LogViewer } from './LogViewer';
import { formatCurrency } from '@/lib/utils';
import { useSocket } from '@/hooks/useSocket';

interface OrderDetailsDrawerProps {
  order: AdminOrder | null;
  onClose: () => void;
}

export function OrderDetailsDrawer({ order, onClose }: OrderDetailsDrawerProps) {
  const [tasks, setTasks] = useState<DownloadTask[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const { isConnected, subscribe, unsubscribe, on, off } = useSocket();

  useEffect(() => {
    if (order?.tasks) {
      setTasks(order.tasks);
    }
  }, [order]);

  // Subscribe to task progress updates
  useEffect(() => {
    if (!order || tasks.length === 0) return;

    // Subscribe to all tasks (subscribe handles connection state)
    tasks.forEach(task => {
      subscribe('task', task.id);
    });

    // Handle progress updates
    const handleProgress = (event: ProgressEvent | any) => {
      console.log('[OrderDetails] 📊 Task progress received:', event);
      if (event.scope === 'task') {
        const data = event.data || {};
        setTasks(prev => prev.map(task =>
          task.id === event.id
            ? {
                ...task,
                currentProgress: data.percent || data.percent || 0,
                currentFile: data.currentFile || (data as any).current_file,
                speed: data.speed
              }
            : task
        ));
      }
    };

    // Handle status updates
    const handleStatus = (event: StatusEvent | any) => {
      console.log('[OrderDetails] 🔄 Task status received:', event);
      if (event.scope === 'task') {
        const data = event.data || {};
        setTasks(prev => prev.map(task =>
          task.id === event.id
            ? { ...task, status: (data.newStatus || (data as any).new_status) as any }
            : task
        ));
      }
    };

    // Register event handlers
    on('progress', handleProgress);
    on('status', handleStatus);

    // Cleanup
    return () => {
      tasks.forEach(task => {
        unsubscribe('task', task.id);
      });
      off('progress', handleProgress);
      off('status', handleStatus);
    };
  }, [order, tasks, subscribe, unsubscribe, on, off]); // Removed isConnected dependency

  if (!order) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-3xl bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-hidden flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Order Details
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {order.order_code}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Order Summary */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-400">Customer Email</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {order.user_email}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-400">Total Amount</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {formatCurrency(order.total_amount)}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-400">Order Status</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white mt-1 capitalize">
                  {order.order_status}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 dark:text-gray-400">Created At</dt>
                <dd className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {new Date(order.created_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          {/* Download Tasks */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Download Tasks
            </h3>
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No tasks found
                </div>
              ) : (
                tasks.map(task => (
                  <TaskProgress key={task.id} task={task} />
                ))
              )}
            </div>
          </div>

          {/* System Logs Section */}
          <div className="p-6">
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center justify-between w-full p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  System Audit Logs
                </span>
              </div>
              {showLogs ? (
                <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {showLogs && (
              <div className="mt-4">
                <LogViewer orderId={order.id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
