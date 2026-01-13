// ============================================
// REUSABLE SPINNER COMPONENT
// ============================================

import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
}

const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export function Spinner({ size = 'md', text, className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3', className)}
      {...props}
    >
      <Loader2 className={cn('animate-spin text-indigo-600', spinnerSizes[size])} />
      {text && <p className="text-slate-600 text-sm font-medium">{text}</p>}
    </div>
  );
}

export function FullPageSpinner({ text = 'Đang tải...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Spinner size="lg" text={text} />
    </div>
  );
}
