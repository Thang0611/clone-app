import { ChevronLeft, ChevronRight } from "lucide-react";
import { CourseCardItem } from "./CourseCardItem";
import type { CourseInfo } from "@/types";

interface CourseScrollListProps {
  courses: CourseInfo[];
  imageErrors: Set<number>;
  onImageError: (index: number) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScroll: () => void;
  onScrollLeft: () => void;
  onScrollRight: () => void;
}

export function CourseScrollList({
  courses,
  imageErrors,
  onImageError,
  scrollContainerRef,
  canScrollLeft,
  canScrollRight,
  onScroll,
  onScrollLeft,
  onScrollRight,
}: CourseScrollListProps) {
  return (
    <div className="relative group">
      {/* Left Scroll Button */}
      {canScrollLeft && (
        <button
          onClick={onScrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>
      )}

      {/* Horizontal Scroll Container */}
      <div
        ref={scrollContainerRef}
        onScroll={onScroll}
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 #f1f5f9',
        }}
      >
        {courses.map((course, index) => (
          <CourseCardItem
            key={index}
            course={course}
            index={index}
            imageErrors={imageErrors}
            onImageError={onImageError}
          />
        ))}
      </div>

      {/* Right Scroll Button */}
      {canScrollRight && (
        <button
          onClick={onScrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-slate-700" />
        </button>
      )}

      {/* Scroll Hint for Mobile */}
      {courses.length > 1 && (
        <p className="text-xs text-center text-slate-500 mt-3">
          ← Vuốt để xem thêm khóa học →
        </p>
      )}
    </div>
  );
}
