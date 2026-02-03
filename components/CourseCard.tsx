"use client";

import Link from "next/link";
import { Star, CheckCircle2 } from "lucide-react";
import { Card, CardBody } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { formatCurrency } from "@/lib/utils";

interface CourseCardProps {
  id: number;
  slug?: string | null;
  title: string;
  platform: string;
  category: string;
  instructor: string;
  rating: number;
  students: number;
  duration: string;
  lectures: number;
  price: number;
  originalPrice: number;
  thumbnail: string;
  bestseller?: boolean;
  isPurchased?: boolean; // Show "Đã mua" badge for owned courses
  url?: string;
  onAddToCart?: (course?: { url: string; title: string; courseType: 'permanent'; category: string }) => void;
}

export default function CourseCard({
  id,
  slug,
  title,
  platform,
  category,
  instructor,
  rating,
  students,
  duration,
  lectures,
  price,
  originalPrice,
  thumbnail,
  bestseller = false,
  isPurchased = false,
  url,
  onAddToCart,
}: CourseCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const coursePath = slug || id.toString();

  return (
    <Card className="group overflow-hidden hover:shadow-md transition-all duration-200 border-slate-200">
      <Link href={`/courses/${coursePath}`} className="block">
        {/* Thumbnail - Compact */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {bestseller && !isPurchased && (
            <Badge className="absolute top-1.5 left-1.5 bg-amber-500 text-white text-[10px] px-1.5 py-0.5">
              Hot
            </Badge>
          )}
          {isPurchased && (
            <Badge className="absolute top-1.5 left-1.5 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 flex items-center gap-0.5">
              <CheckCircle2 className="w-2.5 h-2.5" />
              Đã mua
            </Badge>
          )}
          <Badge className="absolute top-1.5 right-1.5 bg-white/90 text-slate-700 text-[10px] px-1.5 py-0.5">
            {platform}
          </Badge>
        </div>

        <CardBody className="p-2 sm:p-3">
          {/* Title - Compact */}
          <h3 className="font-semibold text-xs sm:text-sm text-slate-900 mb-1 line-clamp-2 min-h-[32px] sm:min-h-[40px] group-hover:text-primary-600 transition-colors leading-tight">
            {title}
          </h3>

          {/* Instructor - Small */}
          <p className="text-[10px] sm:text-xs text-slate-500 mb-1.5 truncate">
            {instructor}
          </p>

          {/* Rating - Compact */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-[10px] sm:text-xs font-medium text-slate-700">{rating}</span>
            <span className="text-[10px] text-slate-400">({formatNumber(students)})</span>
          </div>

          {/* Price - Compact */}
          <div className="flex items-baseline gap-1 pt-1.5 border-t border-slate-100">
            <span className="text-sm sm:text-base font-bold text-emerald-600">
              {formatCurrency(price)}
            </span>
            <span className="text-[10px] text-slate-400 line-through hidden sm:inline">
              {formatCurrency(originalPrice)}
            </span>
          </div>
        </CardBody>
      </Link>
    </Card>
  );
}
