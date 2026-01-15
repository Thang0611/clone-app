'use client';

import { useState, useEffect, useCallback } from 'react';
import type { AdminOrder, ProgressEvent, StatusEvent } from '@/types';
import { useSocket } from './useSocket';

interface UseAdminOrdersOptions {
  status?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function useAdminOrders(options: UseAdminOrdersOptions = {}) {
  const { status = 'paid', autoRefresh = false, refreshInterval = 30000 } = options;
  
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isConnected, subscribe, unsubscribe, on, off } = useSocket();

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/orders?status=${status}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        setError(data.error || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [status]);

  // Initial fetch
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchOrders, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, fetchOrders]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (orders.length === 0) return;

    // Subscribe to all orders (even if not connected yet - will retry)
    orders.forEach(order => {
      subscribe('order', order.id);
    });

    // Handle progress updates
    const handleProgress = (event: ProgressEvent | any) => {
      console.log('[AdminOrders] 📊 Progress event received:', event);
      if (event.scope === 'order') {
        const data = event.data || {};
        setOrders(prev => prev.map(order => 
          order.id === event.id
            ? {
                ...order,
                currentProgress: data.percent || 0,
                currentFile: data.currentFile || (data as any).current_file,
                stats: {
                  ...order.stats,
                  progressPercentage: Math.round(data.percent || 0)
                }
              }
            : order
        ));
      }
    };

    // Handle status updates
    const handleStatus = (event: StatusEvent | any) => {
      console.log('[AdminOrders] 🔄 Status event received:', event);
      if (event.scope === 'order') {
        const data = event.data || {};
        setOrders(prev => prev.map(order =>
          order.id === event.id
            ? { ...order, order_status: (data.newStatus || (data as any).new_status) as any }
            : order
        ));
      }
    };

    // Handle completion events
    const handleComplete = (event: any) => {
      console.log('[AdminOrders] ✅ Complete event received:', event);
      if (event.scope === 'order') {
        setOrders(prev => prev.map(order =>
          order.id === event.id
            ? { ...order, order_status: 'completed' as any }
            : order
        ));
      }
    };

    // Register event handlers
    on('progress', handleProgress);
    on('status', handleStatus);
    on('complete', handleComplete);

    // Cleanup
    return () => {
      orders.forEach(order => {
        unsubscribe('order', order.id);
      });
      off('progress', handleProgress);
      off('status', handleStatus);
      off('complete', handleComplete);
    };
  }, [orders, subscribe, unsubscribe, on, off]); // Removed isConnected dependency - subscribe handles it

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    isConnected
  };
}
