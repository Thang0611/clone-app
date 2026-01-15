'use client';

import { useState, useEffect } from 'react';
import { Package, TrendingUp, Clock, XCircle } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { StatsCard } from '@/components/admin/StatsCard';
import { OrderTable } from '@/components/admin/OrderTable';
import { OrderDetailsDrawer } from '@/components/admin/OrderDetailsDrawer';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import type { AdminOrder, DashboardStats } from '@/types';

export default function AdminDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const { orders, loading, error, refetch, isConnected } = useAdminOrders({
    status: 'paid',
    autoRefresh: false
  });

  // Fetch dashboard stats
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('/api/admin/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleOrderSelect = (order: AdminOrder) => {
    setSelectedOrder(order);
  };

  const handleDrawerClose = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <AdminSidebar activeView="orders" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Header with Connection Status */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Real-time Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Monitor download progress for paid orders
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isConnected ? 'Live Updates Active' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Orders"
              value={statsLoading ? '...' : stats?.orders.total || 0}
              icon={Package}
              color="blue"
            />
            <StatsCard
              title="Processing"
              value={statsLoading ? '...' : stats?.orders.processing || 0}
              icon={Clock}
              color="yellow"
            />
            <StatsCard
              title="Completed"
              value={statsLoading ? '...' : stats?.orders.completed || 0}
              icon={TrendingUp}
              color="green"
            />
            <StatsCard
              title="Failed"
              value={statsLoading ? '...' : stats?.orders.failed || 0}
              icon={XCircle}
              color="red"
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-700 dark:text-red-300">
                <span className="font-semibold">Error:</span> {error}
              </p>
            </div>
          )}

          {/* Orders Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <OrderTable
              orders={orders}
              loading={loading}
              onOrderSelect={handleOrderSelect}
              onRefresh={refetch}
              selectedOrderId={selectedOrder?.id}
            />
          </div>
        </div>
      </main>

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        onClose={handleDrawerClose}
      />
    </div>
  );
}
