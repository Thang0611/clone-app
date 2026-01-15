"use client";

import { useEffect, useRef, useState } from "react";
import { Link, CreditCard, MailCheck, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Copy Link",
    description: "Sao chép URL khóa học từ Udemy, Coursera hoặc LinkedIn Learning",
    icon: Link,
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
  },
  {
    number: "02",
    title: "Dán & Thanh toán",
    description: "Dán link vào form và thanh toán để bắt đầu xử lý",
    icon: CreditCard,
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50",
  },
  {
    number: "03",
    title: "Check Email",
    description: "Nhận link Google Drive tốc độ cao qua email của bạn",
    icon: MailCheck,
    gradient: "from-green-500 to-emerald-500",
    bgGradient: "from-green-50 to-emerald-50",
  },
];

export default function Features() {
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
    <section ref={sectionRef} className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Cách thức hoạt động
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Quy trình đơn giản, nhanh chóng chỉ trong 3 bước
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-8 sm:gap-10 md:grid md:grid-cols-3 md:gap-8 relative">
          
          {/* Connecting line - Desktop only */}
          <div className="hidden md:block absolute top-16 left-[12%] right-[12%] border-t-2 border-dashed border-gradient-to-r from-blue-200 via-indigo-200 to-green-200 -z-10">
            <div className="absolute left-0 top-0 w-full h-0.5 bg-gradient-to-r from-blue-300 via-indigo-300 to-green-300"></div>
          </div>
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`flex flex-col items-center text-center group relative ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: isVisible ? `${index * 200}ms` : '0ms' }}
              >
                {/* Step Number Badge */}
                <div className="text-xs font-bold px-4 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full mb-4 shadow-sm group-hover:shadow-md transition-all duration-300">
                  Bước {step.number}
                </div>

                {/* Icon Container with Gradient */}
                <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-xl group-hover:shadow-2xl`}>
                  <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2.5} />
                  
                  {/* Animated Ring */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}></div>
                </div>

                {/* Arrow between steps - Desktop only */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 -right-4 z-10">
                    <ArrowRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-400 transition-colors duration-300" />
                  </div>
                )}

                {/* Text Content */}
                <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 group-hover:border-indigo-200 w-full">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
