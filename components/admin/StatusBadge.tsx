'use client';

import { cn } from '@/lib/utils';
import type { TaskStatus, OrderStatus } from '@/types';

interface StatusBadgeProps {
  status: TaskStatus | OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

// Modern Clean Light Theme Status Colors
const statusConfig = {
  // Order statuses
  pending: {
    label: 'Chờ xử lý',
    color: 'bg-amber-50 text-amber-700 border border-amber-200',
    dotColor: 'bg-amber-500'
  },
  processing: {
    label: 'Đang xử lý',
    color: 'bg-blue-50 text-blue-700 border border-blue-200',
    dotColor: 'bg-blue-500'
  },
  completed: {
    label: 'Hoàn thành',
    color: 'bg-green-50 text-green-700 border border-green-200',
    dotColor: 'bg-green-500'
  },
  failed: {
    label: 'Thất bại',
    color: 'bg-red-50 text-red-700 border border-red-200',
    dotColor: 'bg-red-500'
  },
  // Task statuses
  enrolled: {
    label: 'Đã đăng ký',
    color: 'bg-purple-50 text-purple-700 border border-purple-200',
    dotColor: 'bg-purple-500'
  },
  downloading: {
    label: 'Đang tải',
    color: 'bg-orange-50 text-orange-700 border border-orange-200',
    dotColor: 'bg-orange-500'
  }
};

const sizeClasses = {
  sm: 'text-xs px-2.5 py-1',
  md: 'text-sm px-3 py-1.5',
  lg: 'text-base px-4 py-2'
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status as keyof typeof statusConfig];

  if (!config) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1.5 rounded-lg font-medium',
        'bg-gray-50 text-gray-700 border border-gray-200',
        sizeClasses[size]
      )}>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-lg font-medium',
      config.color,
      sizeClasses[size]
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
      <span>{config.label}</span>
    </span>
  );
}
