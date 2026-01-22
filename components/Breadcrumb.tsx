/**
 * Breadcrumb Navigation Component
 * SEO-friendly breadcrumb with structured data
 */

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import StructuredData from "./StructuredData";
import { generateBreadcrumbSchema } from "@/lib/seo";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  // Add home to breadcrumb
  const breadcrumbItems = [
    { name: "Trang chủ", url: "/" },
    ...items,
  ];

  return (
    <>
      {/* Structured Data */}
      <StructuredData data={generateBreadcrumbSchema(breadcrumbItems)} />

      {/* Visual Breadcrumb */}
      <nav aria-label="Breadcrumb" className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ol className="flex items-center space-x-2 text-sm">
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              
              return (
                <li key={item.url} className="flex items-center">
                  {index === 0 ? (
                    <Link
                      href={item.url}
                      className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center"
                      aria-label="Trang chủ"
                    >
                      <Home className="w-4 h-4" />
                    </Link>
                  ) : (
                    <>
                      <ChevronRight className="w-4 h-4 text-slate-400 mx-2" />
                      {isLast ? (
                        <span className="text-slate-900 font-medium" aria-current="page">
                          {item.name}
                        </span>
                      ) : (
                        <Link
                          href={item.url}
                          className="text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                          {item.name}
                        </Link>
                      )}
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </>
  );
}
