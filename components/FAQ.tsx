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
    answer: "1 khoá Udemy = 50k, Coursera = 50k, LinkedIn Learning = 50k nhé bạn",
  },
  {
    id: 2,
    question: "Mình có được tải về không?",
    answer: "Có. Bạn hoàn toàn có quyền download mọi khóa học khi mua tại GetCourses",
  },
  {
    id: 3,
    question: "Có được Update khi khóa học cập nhật thêm không?",
    answer: "Có. Mình có cập nhật MIỄN PHÍ cho các bạn",
  },
  {
    id: 4,
    question: "Thanh toán xong bao lâu nhận được khoá học?",
    answer: "Thời gian giao hàng khoảng 2-4 tiếng. Khoá nào nặng có thể lâu hơn",
  },
  {
    id: 5,
    question: "Cách dùng phụ đề rời như thể nào? Cách dịch phụ đề sang tiếng việt?",
    answer: (
      <>
        Hướng dẫn dùng phụ đề rời: <a href="https://youtu.be/YA5jUsf4O2g?si=Yh6XkL46VKj0POFe" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Tại đây</a>
        <br />
        Cách dịch sang tiếng việt: <a href="https://youtu.be/YA5jUsf4O2g?si=Yh6XkL46VKj0POFe" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Tại đây</a>
      </>
    ),
  },
];

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={onClick}
        className="w-full py-6 px-4 sm:px-6 flex items-center justify-between text-left hover:bg-slate-50 transition-colors duration-200 group"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 pr-4 flex-1">
          {question}
        </h3>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          } group-hover:text-indigo-600`}
          strokeWidth={2}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 sm:px-6 pb-6">
          <div className="text-base text-slate-600 leading-relaxed">
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 text-center">
          CÂU HỎI THƯỜNG GẶP
        </h2>
        <p className="text-xl text-slate-600 mb-16 text-center">
          Các câu hỏi thường gặp khi mua khoá học tại GetCourses
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
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
