"use client";

import { useState, FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search, Package, CheckCircle2, Clock, XCircle, Mail, Calendar, DollarSign, ExternalLink, Copy, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { toast } from "sonner";
import { formatCurrency, copyToClipboard } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";

interface OrderItem {
  id: number;
  course_url: string;
  title: string;
  status: string;
  drive_link: string | null;
  price: string;
  created_at?: string;
  updated_at?: string;
}

interface OrderResult {
  order_code: string;
  status: string;
  payment_status: string;
  total_amount: string;
  created_at?: string;
  updated_at?: string;
  items: OrderItem[];
}

export default function TrackOrderPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState<OrderResult[]>([]);
  const [error, setError] = useState<string>("");
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Vui lòng nhập địa chỉ email");
      toast.error("Vui lòng nhập email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Email không hợp lệ");
      toast.error("Email không hợp lệ");
      return;
    }

    setIsLoading(true);
    setError("");
    setOrders([]);
    setHasSearched(true);

    try {
      // Call the new lookup API
      console.log('Calling API:', `${API_BASE_URL}/api/v1/payment/lookup?email=${email.trim()}`);
      
      const response = await fetch(
        `${API_BASE_URL}/api/v1/payment/lookup?email=${encodeURIComponent(email.trim())}`,
        {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
          },
          mode: 'cors', // Explicitly set CORS mode
        }
      );

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText || 'Không thể tra cứu đơn hàng'}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.success && data.data && data.data.length > 0) {
        setOrders(data.data);
        toast.success(`Tìm thấy ${data.count} đơn hàng!`);
      } else if (data.success && data.count === 0) {
        setError("Không tìm thấy đơn hàng nào với email này");
        toast.info("Không tìm thấy đơn hàng");
      } else {
        setError(data.error || "Không thể tra cứu đơn hàng");
        toast.error(data.error || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error('Lookup error:', err);
      
      let errorMessage = "Có lỗi xảy ra khi tra cứu đơn hàng";
      
      if (err instanceof Error) {
        if (err.message.includes('CORS')) {
          errorMessage = "Lỗi kết nối: CORS policy. Vui lòng liên hệ admin để cấu hình backend.";
        } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
          errorMessage = "Lỗi kết nối: Không thể kết nối đến server. Vui lòng kiểm tra lại sau.";
        } else if (err.message.includes('API Error')) {
          errorMessage = err.message;
        } else {
          errorMessage = `Lỗi: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentStatusInfo = (paymentStatus: string) => {
    const statusMap: Record<string, { 
      label: string; 
      color: string; 
      icon: any; 
      bgColor: string;
      description: string;
    }> = {
      pending: {
        label: "Chưa thanh toán",
        color: "text-amber-700",
        bgColor: "bg-amber-100 border-amber-300",
        icon: Clock,
        description: "Vui lòng hoàn tất thanh toán để xử lý đơn hàng"
      },
      paid: {
        label: "Đã thanh toán",
        color: "text-green-700",
        bgColor: "bg-green-100 border-green-300",
        icon: CheckCircle2,
        description: "Thanh toán thành công. Đang xử lý khóa học..."
      },
      cancelled: {
        label: "Đã hủy",
        color: "text-red-700",
        bgColor: "bg-red-100 border-red-300",
        icon: XCircle,
        description: "Đơn hàng đã bị hủy"
      },
      refunded: {
        label: "Đã hoàn tiền",
        color: "text-blue-700",
        bgColor: "bg-blue-100 border-blue-300",
        icon: Package,
        description: "Đơn hàng đã được hoàn tiền"
      }
    };

    return statusMap[paymentStatus] || statusMap.pending;
  };

  const getOrderStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: "Chờ xử lý", color: "bg-amber-100 text-amber-700" },
      processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-700" },
      completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700" },
      failed: { label: "Thất bại", color: "bg-red-100 text-red-700" },
    };
    return statusMap[status] || { label: status, color: "bg-gray-100 text-gray-700" };
  };

  const handleCopy = async (text: string, label: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast.success(`Đã copy ${label}!`);
    }
  };

  const toggleOrder = (orderCode: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderCode)) {
        newSet.delete(orderCode);
      } else {
        newSet.add(orderCode);
      }
      return newSet;
    });
  };

  const isOrderExpanded = (orderCode: string) => expandedOrders.has(orderCode);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return "N/A";
      }
      
      return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);
    } catch (err) {
      console.error('Date format error:', err, dateString);
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section - Minimalist Modern Design */}
      <section className="relative bg-white pt-24 pb-32 px-4 overflow-hidden">
        {/* Dot Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
        
        {/* Soft Glow Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-3xl rounded-full -z-0" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center bg-indigo-50 border border-indigo-100 rounded-full mb-6">
            <span className="text-xs font-semibold text-indigo-700 tracking-wide">
              Hệ thống tra cứu tự động
            </span>
          </div>

        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        
        {/* Search Form - Overlapping Card */}
        <Card className="mb-8 shadow-2xl border border-slate-200/50 backdrop-blur-sm bg-white/95">
          <CardBody className="p-6 sm:p-8">
            <form onSubmit={handleSearch}>
              {/* Search Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nhập email đã sử dụng khi đặt hàng
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="VD: example@email.com"
                    disabled={isLoading}
                    className="w-full px-4 py-3.5 pl-12 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Hệ thống sẽ hiển thị tất cả đơn hàng liên kết với email này
                </p>
              </div>

              {/* Search Button */}
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    Đang tìm kiếm...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Search className="w-5 h-5" />
                    Tra cứu đơn hàng
                  </span>
                )}
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Error State */}
        {error && orders.length === 0 && hasSearched && (
          <Card className="border-2 border-red-200 bg-red-50">
            <CardBody className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-red-900 mb-2">
                    Không tìm thấy đơn hàng
                  </h3>
                  <p className="text-red-700 mb-4">
                    {error}
                  </p>
                  <div className="space-y-2 text-sm text-red-600">
                    <p>💡 <strong>Gợi ý:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Kiểm tra lại địa chỉ email</li>
                      <li>Đảm bảo đã nhận email xác nhận đơn hàng</li>
                      <li>Đơn hàng mới tạo có thể mất vài phút để xuất hiện</li>
                      <li>Liên hệ support nếu vẫn không tìm thấy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Orders List - Accordion Style */}
        {orders.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-slate-900">
                Tìm thấy {orders.length} đơn hàng
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOrders([]);
                  setEmail("");
                  setError("");
                  setHasSearched(false);
                  setExpandedOrders(new Set());
                }}
              >
                Tra cứu lại
              </Button>
            </div>

            {orders.map((order) => {
              const isExpanded = isOrderExpanded(order.order_code);
              const paymentInfo = getPaymentStatusInfo(order.payment_status);
              const orderInfo = getOrderStatusInfo(order.status);
              
              return (
                <Card key={order.order_code} className="border-2 overflow-hidden transition-all hover:shadow-md">
                  {/* Collapsed Header - Always Visible */}
                  <div 
                    className="p-4 sm:p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleOrder(order.order_code)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-900">
                            #{order.order_code}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentInfo.bgColor}`}>
                            {paymentInfo.label}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${orderInfo.color}`}>
                            {orderInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {(() => {
                              const dateToFormat = order.created_at || (order.items && order.items[0]?.created_at);
                              return dateToFormat ? formatDate(dateToFormat) : 'N/A';
                            })()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {order.items?.length || 0} khóa học
                          </span>
                        </div>
                      </div>

                      {/* Right: Amount & Toggle */}
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            {formatCurrency(typeof order.total_amount === 'string' ? parseInt(order.total_amount) : order.total_amount)}
                          </p>
                        </div>
                        <div className="text-slate-400">
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6" />
                          ) : (
                            <ChevronDown className="w-6 h-6" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details - Collapsible */}
                  {isExpanded && (
                    <CardBody className="pt-0 pb-6 px-4 sm:px-5 border-t border-slate-200">
                    {/* Expanded Content */}
                    <div className="mt-4 space-y-4">
                      {/* Status Description */}
                      <div className={`p-4 rounded-lg ${paymentInfo.bgColor} flex items-start gap-3`}>
                        {(() => {
                          const StatusIcon = paymentInfo.icon;
                          return <StatusIcon className={`w-6 h-6 ${paymentInfo.color} flex-shrink-0 mt-0.5`} />;
                        })()}
                        <div>
                          <p className={`font-semibold ${paymentInfo.color} mb-1`}>
                            {paymentInfo.description}
                          </p>
                          {order.payment_status === 'pending' && (
                            <p className="text-sm text-slate-600">
                              Vui lòng liên hệ support để nhận thông tin thanh toán
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Copy Order Code */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(order.order_code, "mã đơn hàng");
                        }}
                        className="flex items-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors w-full text-left"
                      >
                        <Copy className="w-4 h-4 text-slate-600" />
                        <span className="text-sm text-slate-600">Copy mã đơn hàng:</span>
                        <span className="font-mono font-bold text-slate-900">{order.order_code}</span>
                      </button>

                      {/* Course Items List */}
                      {order.items && order.items.length > 0 && (
                        <div>
                          <h4 className="text-base font-bold text-slate-900 mb-3">
                            Danh sách khóa học ({order.items.length})
                          </h4>
                          <div className="space-y-2">
                            {order.items.map((item) => (
                              <div 
                                key={item.id}
                                className="flex flex-col gap-2 p-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-2">
                                      {item.title}
                                    </h5>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getOrderStatusInfo(item.status).color}`}>
                                        {getOrderStatusInfo(item.status).label}
                                      </span>
                                      <span className="text-sm font-bold text-slate-900">
                                        {formatCurrency(typeof item.price === 'string' ? parseInt(item.price) : item.price)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Action Links */}
                                <div className="flex gap-2 text-xs">
                                  {item.course_url && (
                                    <a 
                                      href={item.course_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                                    >
                                      Xem khóa học <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                  {item.drive_link && (
                                    <a 
                                      href={item.drive_link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="text-green-600 hover:text-green-700 flex items-center gap-1"
                                    >
                                      📥 Tải về <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Button - Only for Completed Orders */}
                      {order.payment_status === 'paid' && order.status === 'completed' && order.items.some(item => item.drive_link) && (
                        <div className="pt-4 border-t border-slate-200">
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              const firstItemWithLink = order.items.find(item => item.drive_link);
                              if (firstItemWithLink?.drive_link) {
                                window.open(firstItemWithLink.drive_link, '_blank');
                              }
                            }}
                          >
                            📥 Tải khóa học
                          </Button>
                        </div>
                      )}
                    </div>
                    </CardBody>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* Help Section */}
        {orders.length === 0 && !error && !hasSearched && (
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100">
            <CardBody className="p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                💡 Cần hỗ trợ?
              </h3>
              <div className="space-y-3 text-slate-700">
                <p>
                  <strong>Không tìm thấy đơn hàng?</strong>
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kiểm tra email đã dùng khi đặt hàng</li>
                  <li>Tìm email xác nhận đơn hàng</li>
                  <li>Đơn hàng mới tạo có thể mất vài phút để xuất hiện</li>
                </ul>
                <div className="mt-6 pt-6 border-t border-indigo-200">
                  <p className="font-semibold mb-2">Liên hệ hỗ trợ:</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="mailto:support@khoahocgiare.info" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      📧 support@khoahocgiare.info
                    </a>
                    <span className="text-slate-600">
                      📞 Hotline: 0123 456 789
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

      </div>

      <Footer />
    </div>
  );
}
