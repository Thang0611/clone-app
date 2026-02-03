"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, LogOut, User, BookOpen } from "lucide-react";
import { scrollToFormAndFocus } from "@/lib/scrollToForm";
import { useSession, signIn, signOut } from "next-auth/react";

// Extended user type for Google OAuth
interface ExtendedUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string;
  image?: string | null;
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToForm = () => {
    scrollToFormAndFocus();
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: window.location.href });
  };

  const isLoggedIn = status === "authenticated" && session?.user;
  const user = session?.user as ExtendedUser | undefined;
  const userRole = user?.role;
  const isAdmin = userRole === "admin";

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-100/95 via-indigo-100/95 to-violet-100/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-11 sm:h-12">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="GetCourses"
              width={2816}
              height={428}
              className="h-6 sm:h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link href="/" className="text-xs font-medium text-slate-700 hover:text-indigo-600 transition-colors">
              Trang chủ
            </Link>
            <Link href="/courses" className="text-xs font-medium text-slate-700 hover:text-indigo-600 transition-colors">
              Khóa học
            </Link>
            <Link href="/learn" className="text-xs font-medium text-slate-700 hover:text-indigo-600 transition-colors">
              Học ngay
            </Link>
            <Link href="/track-order" className="text-xs font-medium text-slate-700 hover:text-indigo-600 transition-colors">
              Tra cứu
            </Link>
            {isLoggedIn && (
              <Link href="/my-courses" className="text-xs font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                Khóa học của tôi
              </Link>
            )}
          </div>

          {/* Right side: Auth + CTA */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              /* User Menu */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/50 transition-colors"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                      {session?.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-700 max-w-[100px] truncate">
                    {session?.user?.name?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-900 truncate">{session?.user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                    </div>

                    <Link
                      href="/my-courses"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <BookOpen className="w-4 h-4" />
                      Khóa học của tôi
                    </Link>

                    <Link
                      href="/track-order"
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Đơn hàng
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-3 py-2 text-xs text-indigo-600 hover:bg-slate-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login Button */
              <button
                onClick={handleGoogleLogin}
                className="text-xs font-medium text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Đăng nhập
              </button>
            )}

            {/* CTA Button */}
            <Link
              href="/"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium text-xs hover:from-blue-600 hover:to-indigo-600 transition-all shadow-sm"
            >
              Tải khóa học
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/50"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-slate-700" />
            ) : (
              <Menu className="w-5 h-5 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-2 animate-in slide-in-from-top-2 duration-200 border-white/30">
            <div className="flex flex-col gap-1">
              {/* User Info (Mobile) */}
              {isLoggedIn && (
                <div className="px-3 py-2 border-b border-white/30 mb-2 flex items-center gap-2">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                      {session?.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-slate-900">{session?.user?.name}</p>
                    <p className="text-xs text-slate-500">{session?.user?.email}</p>
                  </div>
                </div>
              )}

              <Link
                href="/"
                className="text-slate-600 hover:text-indigo-600 hover:bg-white/50 transition-all text-xs font-medium px-3 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href="/courses"
                className="text-slate-600 hover:text-indigo-600 hover:bg-white/50 transition-all text-xs font-medium px-3 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Khóa học
              </Link>
              <Link
                href="/learn"
                className="text-slate-600 hover:text-indigo-600 hover:bg-white/50 transition-all text-xs font-medium px-3 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Học ngay
              </Link>
              <Link
                href="/track-order"
                className="text-slate-600 hover:text-indigo-600 hover:bg-white/50 transition-all text-xs font-medium px-3 py-2 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tra cứu đơn hàng
              </Link>
              {isLoggedIn && (
                <Link
                  href="/my-courses"
                  className="text-slate-600 hover:text-indigo-600 hover:bg-white/50 transition-all text-xs font-medium px-3 py-2 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Khóa học của tôi
                </Link>
              )}

              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:bg-red-50 transition-all text-xs font-medium px-3 py-2 rounded-lg text-left"
                >
                  Đăng xuất
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleGoogleLogin();
                  }}
                  className="text-indigo-600 hover:bg-indigo-50 transition-all text-xs font-medium px-3 py-2 rounded-lg text-left w-full"
                >
                  Đăng nhập
                </button>
              )}

              <button
                onClick={scrollToForm}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium text-xs mx-3 mt-1"
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
