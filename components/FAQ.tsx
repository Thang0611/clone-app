"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string | React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const FAQ_DATA = [
  {
    id: 1,
    question: "Giá khoá học là bao nhiêu?",
    answer: "Regular: 39k/khóa (5 khóa 99k, 10 khóa 199k). Premium: 199k + truy cập kho",
  },
  {
    id: 2,
    question: "Mình có được tải về không?",
    answer: "Có. Bạn hoàn toàn có quyền download mọi khóa học khi mua tại GetCourses",
  },
  {
    id: 3,
    question: "Có được Update khi khóa học cập nhật?",
    answer: "Có. Cập nhật MIỄN PHÍ cho các bạn",
  },
  {
    id: 4,
    question: "Thanh toán xong bao lâu nhận được?",
    answer: "Thời gian giao hàng khoảng 2-4 tiếng. Khoá nào nặng có thể lâu hơn",
  },
  {
    id: 5,
    question: "Cách dùng phụ đề rời?",
    answer: (
      <>
        Hướng dẫn: <a href="https://youtu.be/YA5jUsf4O2g?si=Yh6XkL46VKj0POFe" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Xem tại đây</a>
      </>
    ),
  },
];

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-3 sm:py-4 px-3 sm:px-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors duration-200 group"
        aria-expanded={isOpen}
      >
        <h3 className="text-sm sm:text-base font-medium text-slate-900 pr-2 flex-1">
          {question}
        </h3>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            } group-hover:text-indigo-600`}
          strokeWidth={2}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-3 sm:px-4 pb-3">
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-8 sm:py-12 px-3 sm:px-4 bg-slate-100">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 text-center">
          CÂU HỎI THƯỜNG GẶP
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 text-center">
          Các câu hỏi thường gặp khi mua khoá học
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {FAQ_DATA.map((item, index) => (
            <FAQItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
