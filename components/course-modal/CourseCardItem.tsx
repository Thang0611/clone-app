import Image from "next/image";
import { BookOpen } from "lucide-react";
import { Badge } from "../ui/Badge";
import { formatCurrency } from "@/lib/utils";
import type { CourseInfo } from "@/types";

interface CourseCardItemProps {
  course: CourseInfo;
  index: number;
  imageErrors: Set<number>;
  onImageError: (index: number) => void;
}

export function CourseCardItem({ 
  course, 
  index, 
  imageErrors, 
  onImageError 
}: CourseCardItemProps) {
  const hasImageError = imageErrors.has(index);

  return (
    <div
      className={`
        flex-shrink-0 w-72 sm:w-80 p-4 border-2 rounded-xl transition-all
        ${course.success
          ? "border-slate-200 hover:border-indigo-300 hover:shadow-md bg-white"
          : "border-red-200 bg-red-50"
        }
      `}
    >
      {/* Compact Image */}
      <div className="w-full h-32 mb-3 relative rounded-lg overflow-hidden bg-gradient-to-br from-indigo-100 to-indigo-200">
        {course.image && !hasImageError ? (
          <Image
            src={course.image}
            alt={course.title || "Course"}
            fill
            className="object-cover"
            onError={() => onImageError(index)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-indigo-600" />
          </div>
        )}
      </div>

      {/* Compact Info */}
      <div className="space-y-2">
        {course.success ? (
          <>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 line-clamp-2 flex-1">
                {course.title || "Khóa học"}
              </h3>
              <Badge variant="success" className="flex-shrink-0">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </Badge>
            </div>

            {course.url && (
              <a
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-600 hover:underline block truncate"
                title={course.url}
              >
                {course.url}
              </a>
            )}

            <div className="pt-2 border-t border-slate-100">
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(course.price || 2000)}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-bold text-red-600 line-clamp-2 flex-1">
                Không thể lấy thông tin
              </h3>
              <Badge variant="error" className="flex-shrink-0">Lỗi</Badge>
            </div>

            {course.url && (
              <p className="text-xs text-slate-600 truncate">
                {course.url}
              </p>
            )}

            <p className="text-xs text-red-600">
              {course.message || "Link bị lỗi"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
