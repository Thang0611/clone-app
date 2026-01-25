'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Settings, Activity, BookOpen, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
  activeView?: 'dashboard' | 'orders' | 'courses' | 'settings';
  onViewChange?: (view: 'dashboard' | 'orders' | 'courses' | 'settings') => void;
}

export function AdminSidebar({ activeView, onViewChange }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const menuItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/admin'
    },
    {
      id: 'orders' as const,
      label: 'Paid Orders',
      icon: Package,
      href: '/admin/orders'
    },
    {
      id: 'courses' as const,
      label: 'Courses',
      icon: BookOpen,
      href: '/admin/courses'
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      href: '/admin/settings'
    }
  ];
  
  // Determine active view from pathname if not provided
  const currentActiveView = activeView || (pathname?.startsWith('/admin/courses') ? 'courses' : 
    pathname?.startsWith('/admin/orders') ? 'orders' :
    pathname?.startsWith('/admin/settings') ? 'settings' : 'dashboard');

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const handleLinkClick = () => {
    setIsMobileOpen(false);
    onViewChange?.(currentActiveView);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 md:p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg md:text-xl font-bold truncate">Admin Panel</h1>
            <p className="text-xs text-gray-400 hidden md:block">Download Monitor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentActiveView === item.id;

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                    'hover:bg-gray-800',
                    isActive && 'bg-blue-600 hover:bg-blue-700'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-gray-400 truncate hidden md:block">admin@system.com</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-gray-900 text-white min-h-screen flex-col fixed left-0 top-0">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          'lg:hidden fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-50 flex flex-col transform transition-transform duration-300 ease-in-out',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
