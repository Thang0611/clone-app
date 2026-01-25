"use client";

import Link from "next/link";
import { Star } from "lucide-react";
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
  url,
  onAddToCart,
}: CourseCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Use slug if available, fallback to id
  const coursePath = slug || id.toString();

  return (
    <Card className="group overflow-hidden hover:shadow-card-hover transition-all duration-300 border-slate-200">
      <Link href={`/courses/${coursePath}`} className="block">
        {/* Thumbnail - 16:9 aspect ratio */}
        <div className="relative w-full aspect-video overflow-hidden bg-slate-100">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {bestseller && (
            <Badge className="absolute top-3 left-3 bg-amber-500 text-white font-semibold shadow-md">
              Bestseller
            </Badge>
          )}
          <Badge className="absolute top-3 right-3 bg-white/95 text-slate-900 font-medium shadow-sm">
            {platform}
          </Badge>
        </div>

        <CardBody className="p-5">
          {/* Course Title - Truncate after 2 lines */}
          <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 min-h-[56px] group-hover:text-primary-600 transition-colors">
            {title}
          </h3>

          {/* Instructor */}
          <p className="text-sm text-slate-600 mb-3">
            {instructor}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-slate-900">{rating}</span>
            </div>
            <span className="text-sm text-slate-500">
              ({formatNumber(students)} đánh giá)
            </span>
          </div>

          {/* Price Section */}
          <div className="mb-4 pt-3 border-t border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-600">
                {formatCurrency(price)}
              </span>
              <span className="text-sm text-slate-500 line-through">
                {formatCurrency(originalPrice)}
              </span>
            </div>
          </div>
        </CardBody>
      </Link>
    </Card>
  );
}
