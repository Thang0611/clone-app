'use client';

import { LayoutDashboard, Package, Settings, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  activeView?: 'dashboard' | 'orders' | 'settings';
  onViewChange?: (view: 'dashboard' | 'orders' | 'settings') => void;
}

export function AdminSidebar({ activeView = 'orders', onViewChange }: AdminSidebarProps) {
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
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      href: '/admin/settings'
    }
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <p className="text-xs text-gray-400">Download Monitor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange?.(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                    'hover:bg-gray-800',
                    isActive && 'bg-blue-600 hover:bg-blue-700'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">A</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-400">admin@system.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
