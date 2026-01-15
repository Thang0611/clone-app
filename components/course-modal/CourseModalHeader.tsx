import { X } from "lucide-react";

interface CourseModalHeaderProps {
  successfulCount: number;
  totalCount: number;
  onClose: () => void;
  disabled?: boolean;
}

export function CourseModalHeader({ 
  successfulCount, 
  totalCount, 
  onClose, 
  disabled 
}: CourseModalHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center flex-shrink-0">
      <div className="flex-1 min-w-0 mr-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
          Thông Tin Khóa Học
        </h2>
        {successfulCount > 0 && (
          <p className="text-xs sm:text-sm text-slate-600">
            {successfulCount}/{totalCount} khóa học hợp lệ
          </p>
        )}
      </div>

      <button
        onClick={onClose}
        disabled={disabled}
        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors disabled:opacity-50 flex-shrink-0"
        aria-label="Close"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
      </button>
    </div>
  );
}
