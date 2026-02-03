"use client";

import { useEffect, useRef, useState } from "react";
import { Link, CreditCard, MailCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Copy Link",
    description: "Sao chép URL khóa học từ Udemy, Coursera...",
    icon: Link,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    title: "Thanh toán",
    description: "Dán link vào form và thanh toán",
    icon: CreditCard,
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    number: "03",
    title: "Check Email",
    description: "Nhận link Google Drive qua email",
    icon: MailCheck,
    gradient: "from-green-500 to-emerald-500",
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
    <section ref={sectionRef} className="py-8 sm:py-12 px-3 sm:px-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-6 sm:mb-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-1">
            Cách thức hoạt động
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Quy trình đơn giản chỉ trong 3 bước
          </p>
        </div>

        {/* Steps - 3 columns always */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`flex flex-col items-center text-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                style={{
                  transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
                  transitionDuration: '400ms',
                  transitionProperty: 'opacity, transform'
                }}
              >
                {/* Step Number */}
                <div className="text-[10px] sm:text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full mb-2">
                  Bước {step.number}
                </div>

                {/* Icon */}
                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-2 shadow-md`}>
                  <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
                </div>

                {/* Text */}
                <div className="bg-white rounded-lg p-2 sm:p-3 border border-slate-100 w-full">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-0.5">
                    {step.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-tight">
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
