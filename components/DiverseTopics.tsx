"use client";

import { useEffect, useRef, useState } from "react";
import { Code, Palette, Users, Globe, TrendingUp, Briefcase, Sparkles } from "lucide-react";

const categories = [
  { name: "Lập trình", icon: Code, color: "from-blue-500 to-cyan-500" },
  { name: "Thiết kế đồ họa", icon: Palette, color: "from-pink-500 to-rose-500" },
  { name: "Kỹ năng mềm", icon: Users, color: "from-purple-500 to-indigo-500" },
  { name: "Tiếng Anh", icon: Globe, color: "from-green-500 to-emerald-500" },
  { name: "Marketing", icon: TrendingUp, color: "from-orange-500 to-amber-500" },
  { name: "Quản lý dự án", icon: Briefcase, color: "from-violet-500 to-purple-500" },
];

const platforms = [
  { name: "Udemy", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { name: "Coursera", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { name: "LinkedIn Learning", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
];

export default function DiverseTopics() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 px-4 sm:px-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Đa Dạng Chủ Đề, Nhiều Lĩnh Vực
            </h2>
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Chúng tôi tự hào cung cấp bộ sưu tập đa dạng các khóa học trên nhiều lĩnh vực khác nhau
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                className={`group relative bg-white rounded-2xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-transparent hover:-translate-y-1 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {category.name}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Platforms */}
        <div className={`text-center transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: isVisible ? '600ms' : '0ms' }}>
          <p className="text-sm sm:text-base text-slate-600 mb-4">
            Tất cả đều có sẵn trên
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {platforms.map((platform, index) => (
              <div
                key={platform.name}
                className={`px-4 py-2 rounded-full border-2 font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-110 hover:shadow-md ${
                  platform.color
                }`}
                style={{ animationDelay: `${700 + index * 100}ms` }}
              >
                {platform.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
