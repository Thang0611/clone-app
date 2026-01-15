'use client';

import { cn } from '@/lib/utils';
import type { TaskStatus, OrderStatus } from '@/types';

interface StatusBadgeProps {
  status: TaskStatus | OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  // Order statuses
  pending: {
    label: 'Pending',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    icon: '⏳'
  },
  processing: {
    label: 'Processing',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: '🔄'
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: '✅'
  },
  failed: {
    label: 'Failed',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: '❌'
  },
  // Task statuses
  enrolled: {
    label: 'Enrolled',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    icon: '📝'
  },
  downloading: {
    label: 'Downloading',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: '⬇️'
  }
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5'
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        'bg-gray-100 text-gray-700',
        sizeClasses[size]
      )}>
        {status}
      </span>
    );
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full font-medium',
      config.color,
      sizeClasses[size]
    )}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
