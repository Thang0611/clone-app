"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    const heroSection = document.querySelector('section');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      'bg-gradient-to-r from-blue-100/95 via-indigo-100/95 to-violet-100/95 backdrop-blur-sm shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1">
              <Image
                src="/images/logo.png"
                alt="Khóa Học Giá Rẻ"
                width={240}
                height={90}
                className="h-14 md:h-16 w-auto object-contain drop-shadow-md"
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            <Link 
              href="/" 
              className={`transition-all duration-200 font-medium text-sm relative group ${
                scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
              }`}
            >
              Trang chủ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link 
              href="/track-order" 
              className={`transition-all duration-200 font-medium text-sm relative group ${
                scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
              }`}
            >
              Tra cứu đơn hàng
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* CTA Button - Desktop */}
          <button 
            onClick={scrollToForm}
            className="hidden md:block bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:from-blue-600 hover:via-indigo-600 hover:to-violet-600 transition-all duration-300 shadow-md hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            Tải khóa học
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'hover:bg-slate-100' : 'hover:bg-white/50'
            }`}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${scrolled ? 'text-slate-700' : 'text-slate-700'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${scrolled ? 'text-slate-700' : 'text-slate-700'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t py-4 animate-in slide-in-from-top-2 duration-200 ${
            scrolled ? 'border-slate-200' : 'border-white/30'
          }`}>
            <div className="flex flex-col space-y-3">
              <Link 
                href="/" 
                className="text-slate-600 hover:text-indigo-600 hover:bg-white/50 transition-all duration-200 font-medium text-sm px-4 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link 
                href="/track-order" 
                className="text-slate-600 hover:text-indigo-600 hover:bg-white/50 transition-all duration-200 font-medium text-sm px-4 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tra cứu đơn hàng
              </Link>
              <button 
                onClick={scrollToForm}
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:from-blue-600 hover:via-indigo-600 hover:to-violet-600 transition-all shadow-md mx-4 mt-2"
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
