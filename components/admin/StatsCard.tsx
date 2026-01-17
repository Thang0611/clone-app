'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// Modern Clean Light Theme Colors
const colorClasses = {
  blue: {
    icon: 'bg-blue-50 text-blue-600',
    value: 'text-blue-600'
  },
  green: {
    icon: 'bg-green-50 text-green-600',
    value: 'text-green-600'
  },
  yellow: {
    icon: 'bg-amber-50 text-amber-600',
    value: 'text-amber-600'
  },
  red: {
    icon: 'bg-red-50 text-red-600',
    value: 'text-red-600'
  },
  purple: {
    icon: 'bg-purple-50 text-purple-600',
    value: 'text-purple-600'
  }
};

export function StatsCard({ title, value, icon: Icon, color = 'blue', trend }: StatsCardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className={cn('text-3xl font-bold', colors.value)}>
            {value}
          </p>
          
          {trend && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className={cn(
                'text-sm font-semibold',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">so với kỳ trước</span>
            </div>
          )}
        </div>

        <div className={cn('p-3 rounded-lg', colors.icon)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
