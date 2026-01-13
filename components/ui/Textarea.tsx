// ============================================
// REUSABLE TEXTAREA COMPONENT
// ============================================

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-slate-900 font-semibold mb-2 text-base">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl border-2',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400',
            'text-slate-900 placeholder:text-slate-400 bg-white resize-none',
            error
              ? 'border-red-300 focus:border-red-400 focus:ring-red-200'
              : 'border-slate-200',
            props.disabled && 'opacity-50 cursor-not-allowed bg-slate-50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
