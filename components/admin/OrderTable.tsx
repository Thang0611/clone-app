'use client';

import { useState, useEffect } from 'react';
import { Search, RefreshCw, Mail, Download, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminOrder } from '@/types';
import { StatusBadge } from './StatusBadge';
import { ConfirmDialog } from './ConfirmDialog';
import { formatCurrency } from '@/lib/utils';

interface OrderTableProps {
  orders: AdminOrder[];
  loading: boolean;
  onOrderSelect: (order: AdminOrder) => void;
  onRefresh: () => void;
  selectedOrderId?: number;
}

// Skeleton Loading Component
function TableSkeleton() {
  return (
    <div className="space-y-4 p-6">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg flex-1" />
          <div className="h-12 bg-gray-200 rounded-lg w-48" />
          <div className="h-12 bg-gray-200 rounded-lg w-32" />
          <div className="h-12 bg-gray-200 rounded-lg w-28" />
          <div className="h-12 bg-gray-200 rounded-lg w-32" />
          <div className="h-12 bg-gray-200 rounded-lg w-40" />
        </div>
      ))}
    </div>
  );
}

export function OrderTable({ 
  orders, 
  loading, 
  onOrderSelect, 
  onRefresh,
  selectedOrderId 
}: OrderTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingActions, setLoadingActions] = useState<Record<number, 'resend' | 'retry' | 'recover' | null>>({});
  
  // Confirmation dialogs state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'resend' | 'retry' | null;
    order: AdminOrder | null;
  }>({
    isOpen: false,
    action: null,
    order: null
  });

  // Reset loading actions for orders that are no longer in the list or when orders change
  useEffect(() => {
    if (orders.length === 0) {
      // Reset all loading actions when orders list is empty
      setLoadingActions({});
      return;
    }

    const currentOrderIds = new Set(orders.map(o => o.id));
    setLoadingActions(prev => {
      // If any order in prev is not in current orders, reset it
      const updated = { ...prev };
      let changed = false;
      Object.keys(updated).forEach(orderIdStr => {
        const orderId = parseInt(orderIdStr, 10);
        if (!currentOrderIds.has(orderId)) {
          delete updated[orderId];
          changed = true;
        }
      });
      
      // Also reset any loading state that might be stuck
      currentOrderIds.forEach(orderId => {
        // Only keep loading state if it's very recent (less than 30 seconds ago)
        // This prevents stuck states but allows normal loading states
        if (updated[orderId] && !document.hasFocus()) {
          // If window lost focus, might be stuck - reset after delay
          setTimeout(() => {
            setLoadingActions(curr => {
              const newCurr = { ...curr };
              if (newCurr[orderId] === updated[orderId]) {
                delete newCurr[orderId];
              }
              return newCurr;
            });
          }, 60000); // 60 seconds timeout
        }
      });
      
      return changed ? updated : prev;
    });
  }, [orders]);

  const handleResendEmailClick = (e: React.MouseEvent, order: AdminOrder) => {
    e.stopPropagation();
    // Reset any stuck loading state before opening dialog
    if (loadingActions[order.id]) {
      setLoadingActions(prev => {
        const newPrev = { ...prev };
        delete newPrev[order.id];
        return newPrev;
      });
    }
    setConfirmDialog({
      isOpen: true,
      action: 'resend',
      order
    });
  };

  const handleResendEmail = async (order: AdminOrder) => {
    if (loadingActions[order.id]) return; // Prevent double-click
    setConfirmDialog({ isOpen: false, action: null, order: null });
    setLoadingActions(prev => ({ ...prev, [order.id]: 'resend' }));

    const loadingToast = toast.loading('Đang gửi email...', {
      description: `Gửi email cho đơn hàng ${order.order_code}`
    });

    try {
      const response = await fetch(`/api/admin/orders/${order.id}/resend-email`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Đã gửi lại email!', {
          id: loadingToast,
          description: `Email đã được gửi đến ${order.user_email}`
        });
      } else {
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error) {
      toast.error('Gửi email thất bại', {
        id: loadingToast,
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau'
      });
    } finally {
      setLoadingActions(prev => {
        const newPrev = { ...prev };
        if (newPrev[order.id] === 'resend') {
          delete newPrev[order.id];
        }
        return newPrev;
      });
    }
  };

  const handleRetryDownloadClick = (e: React.MouseEvent, order: AdminOrder) => {
    e.stopPropagation();
    // Reset any stuck loading state before opening dialog
    if (loadingActions[order.id]) {
      setLoadingActions(prev => {
        const newPrev = { ...prev };
        delete newPrev[order.id];
        return newPrev;
      });
    }
    setConfirmDialog({
      isOpen: true,
      action: 'retry',
      order
    });
  };

  const handleRetryDownload = async (order: AdminOrder) => {
    if (loadingActions[order.id]) return; // Prevent double-click
    setConfirmDialog({ isOpen: false, action: null, order: null });
    setLoadingActions(prev => ({ ...prev, [order.id]: 'retry' }));

    const loadingToast = toast.loading('Đang xử lý...', {
      description: `Tải lại khóa học cho đơn hàng ${order.order_code}`
    });

    try {
      const response = await fetch(`/api/admin/orders/${order.id}/retry-download`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        const retriedCount = data.data?.retriedTasks || 0;
        const queuedCount = data.data?.queuedTasks || 0;
        const completedTasks = data.data?.completedTasks || 0;
        const totalTasks = data.data?.totalTasks || 0;
        
        if (retriedCount > 0 || queuedCount > 0) {
          toast.success('Đã khởi động tải lại!', {
            id: loadingToast,
            description: queuedCount > 0 
              ? `Đã queue ${queuedCount} khóa học. Email sẽ được gửi khi hoàn tất.`
              : `Đang tải lại ${retriedCount} khóa học. Email sẽ được gửi khi hoàn tất.`
          });
        } else {
          // All tasks completed - still show success but with info message
          toast.info('Tất cả khóa học đã hoàn thành', {
            id: loadingToast,
            description: `${completedTasks}/${totalTasks} khóa học đã hoàn thành. Không cần tải lại.`
          });
        }
        
        setTimeout(() => {
          onRefresh();
        }, 1500);
      } else {
        throw new Error(data.error || 'Failed to retry download');
      }
    } catch (error) {
      toast.error('Tải lại thất bại', {
        id: loadingToast,
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau'
      });
    } finally {
      setLoadingActions(prev => {
        const newPrev = { ...prev };
        if (newPrev[order.id] === 'retry') {
          delete newPrev[order.id];
        }
        return newPrev;
      });
    }
  };

  const handleRecoverOrder = async (e: React.MouseEvent, order: AdminOrder) => {
    e.stopPropagation();
    setLoadingActions(prev => ({ ...prev, [order.id]: 'recover' }));

    const loadingToast = toast.loading('Đang khôi phục...', {
      description: `Khôi phục tasks bị kẹt cho đơn hàng ${order.order_code}`
    });

    try {
      const response = await fetch(`/api/admin/orders/${order.id}/recover`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        const recoveredCount = data.data?.recovered || 0;
        
        if (recoveredCount > 0) {
          toast.success('Khôi phục thành công!', {
            id: loadingToast,
            description: `Đã khôi phục ${recoveredCount} task(s) cho đơn hàng ${order.order_code}`
          });
        } else {
          toast.info('Không có task nào cần khôi phục', {
            id: loadingToast,
            description: 'Tất cả tasks đã được xử lý hoặc đã trong queue'
          });
        }
        
        setTimeout(() => {
          onRefresh();
        }, 1500);
      } else {
        throw new Error(data.error || 'Failed to recover order');
      }
    } catch (error) {
      toast.error('Khôi phục thất bại', {
        id: loadingToast,
        description: error instanceof Error ? error.message : 'Vui lòng thử lại sau'
      });
    } finally {
      setLoadingActions(prev => {
        const newPrev = { ...prev };
        if (newPrev[order.id] === 'recover') {
          delete newPrev[order.id];
        }
        return newPrev;
      });
    }
  };

  const filteredOrders = orders.filter(order => 
    order.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.user_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Section - Modern Clean */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi và quản lý đơn hàng đã thanh toán
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Search Section */}
      <div className="px-8 py-5 bg-gray-50 border-b border-gray-100">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn hàng hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto">
        {loading && orders.length === 0 ? (
          <TableSkeleton />
        ) : filteredOrders.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                Không tìm thấy đơn hàng
              </p>
              <p className="text-sm text-gray-500">
                {searchQuery ? 'Thử tìm kiếm với từ khóa khác' : 'Chưa có đơn hàng nào'}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Sticky Header */}
              <thead className="bg-gray-50 sticky top-0 z-20 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => onOrderSelect(order)}
                    className={`group cursor-pointer transition-all duration-150 ${
                      selectedOrderId === order.id 
                        ? 'bg-indigo-50 hover:bg-indigo-50' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Order ID */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {order.order_code}
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5">
                          ID: {order.id}
                        </span>
                      </div>
                    </td>
                    
                    {/* Email User */}
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-900 break-all max-w-xs">
                        {order.user_email}
                      </div>
                    </td>
                    
                    {/* Tổng tiền */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </div>
                      {order.stats && (
                        <div className="text-xs text-gray-500 mt-1">
                          {order.stats.completedTasks}/{order.stats.totalTasks} khóa học
                        </div>
                      )}
                    </td>
                    
                    {/* Trạng thái */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <StatusBadge status={order.order_status} size="sm" />
                    </td>
                    
                    {/* Ngày tạo */}
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(order.created_at).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    
                    {/* Hành động - Icon Buttons với Tooltip */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {/* Resend Email Button - Always visible */}
                        <div className="relative group/btn">
                          <button
                            onClick={(e) => handleResendEmailClick(e, order)}
                            disabled={!!loadingActions[order.id]}
                            className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                            title="Gửi lại email thông báo"
                          >
                            {loadingActions[order.id] === 'resend' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Mail className="w-4 h-4" />
                            )}
                          </button>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            Gửi lại Email
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
                          </div>
                        </div>

                        {/* Retry Download Button - Always visible */}
                        <div className="relative group/btn">
                          <button
                            onClick={(e) => handleRetryDownloadClick(e, order)}
                            disabled={!!loadingActions[order.id]}
                            className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                            title="Tải lại khóa học"
                          >
                            {loadingActions[order.id] === 'retry' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                            Tải lại khóa học
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
                          </div>
                        </div>

                        {/* Recover Button - Show for processing orders */}
                        {order.order_status === 'processing' && (
                          <div className="relative group/btn">
                            <button
                              onClick={(e) => handleRecoverOrder(e, order)}
                              disabled={!!loadingActions[order.id]}
                              className="flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
                              title="Khôi phục tasks bị kẹt"
                            >
                              {loadingActions[order.id] === 'recover' ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <RotateCcw className="w-4 h-4" />
                              )}
                            </button>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30">
                              Khôi phục tasks bị kẹt
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 rotate-45" />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, action: null, order: null })}
        onConfirm={() => {
          if (confirmDialog.order && confirmDialog.action === 'resend') {
            handleResendEmail(confirmDialog.order);
          } else if (confirmDialog.order && confirmDialog.action === 'retry') {
            handleRetryDownload(confirmDialog.order);
          }
        }}
        title={
          confirmDialog.action === 'resend'
            ? 'Xác nhận gửi lại email'
            : confirmDialog.action === 'retry'
            ? 'Xác nhận tải lại'
            : 'Xác nhận'
        }
        message={
          confirmDialog.action === 'resend'
            ? `Bạn có chắc chắn muốn gửi lại email thông báo cho đơn hàng ${confirmDialog.order?.order_code}? Email sẽ được gửi đến ${confirmDialog.order?.user_email}.`
            : confirmDialog.action === 'retry'
            ? `Bạn có chắc chắn muốn tải lại các khóa học cho đơn hàng ${confirmDialog.order?.order_code}? Hệ thống sẽ kiểm tra và tải lại các khóa học chưa hoàn thành.`
            : ''
        }
        confirmText={confirmDialog.action === 'resend' ? 'Gửi email' : 'Tải lại'}
        cancelText="Hủy"
        type="warning"
        loading={confirmDialog.order ? !!loadingActions[confirmDialog.order.id] : false}
      />
    </div>
  );
}
