"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToForm = () => {
    const heroSection = document.querySelector('section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              KhoaHocGiaRe
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 lg:space-x-10">
            <Link href="/" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium text-base">
              Trang chủ
            </Link>
            <Link href="/courses" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium text-base">
              Khóa học
            </Link>
            <Link href="/blog" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium text-base">
              Blog
            </Link>
            <Link href="/track-order" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium text-base">
              Tra cứu đơn hàng
            </Link>
          </div>

          {/* CTA Button - Desktop */}
          <button 
            onClick={scrollToForm}
            className="hidden md:block bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Tải khóa học
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors font-medium text-base px-4 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                href="/courses" 
                className="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors font-medium text-base px-4 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Khóa học
              </Link>
              <Link 
                href="/blog" 
                className="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors font-medium text-base px-4 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/track-order" 
                className="text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-colors font-medium text-base px-4 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tra cứu đơn hàng
              </Link>
              <button 
                onClick={scrollToForm}
                className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md mx-4"
              >
                Tải khóa học
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
