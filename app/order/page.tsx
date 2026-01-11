// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { useEffect, useState } from "react";

// interface OrderItem {
//   title: string;
//   url: string;
//   price: number;
//   courseId?: number | null;
// }

// interface OrderData {
//   orderId: string;
//   email: string;
//   total: number;
//   items: OrderItem[];
//   transferContent: string;
//   status: string;
//   date: string;
// }

// export default function OrderPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [orderData, setOrderData] = useState<OrderData | null>(null);

//   useEffect(() => {
//     // Get order data from URL params or localStorage
//     const orderDataParam = searchParams.get("data");
//     if (orderDataParam) {
//       try {
//         const decoded = JSON.parse(decodeURIComponent(orderDataParam));
//         setOrderData(decoded);
//       } catch (e) {
//         console.error("Error parsing order data:", e);
//       }
//     } else {
//       // Try to get from localStorage as fallback
//       const stored = localStorage.getItem("orderData");
//       if (stored) {
//         try {
//           setOrderData(JSON.parse(stored));
//         } catch (e) {
//           console.error("Error parsing stored order data:", e);
//         }
//       }
//     }
//   }, [searchParams]);

//   // Generate order data if not provided
//   const finalOrderData: OrderData = orderData || {
//     orderId: generateOrderId(),
//     email: "Nguyenhuuthanga3@gmail.com",
//     total: 100000,
//     items: [
//       {
//         title: "Prompt Engineering for Beginners - Learn ChatGPT Prompting",
//         url: "https://udemy.com/course/chatgpt-promptengineering",
//         price: 50000,
//       },
//       {
//         title: "Prompt Engineering for Beginners - Learn ChatGPT Prompting",
//         url: "https://udemy.com/course/chatgpt-promptengineering",
//         price: 50000,
//       },
//     ],
//     transferContent: generateTransferContent(),
//     status: "Chưa thanh toán",
//     date: new Date().toLocaleDateString("vi-VN"),
//   };

//   function generateOrderId(): string {
//     return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
//   }

//   function generateTransferContent(): string {
//     const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//     let result = "";
//     for (let i = 0; i < 6; i++) {
//       result += chars.charAt(Math.floor(Math.random() * chars.length));
//     }
//     return result;
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <Navbar />
      
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Order Confirmation Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
//             Bạn đã đặt đơn hàng thành công
//           </h1>
//           <p className="text-xl text-slate-600 mb-2">
//             Hello, {finalOrderData.email}
//           </p>
//           <p className="text-lg text-slate-700 mb-4">
//             Đơn hàng của bạn đã được xác nhận.
//           </p>
//           <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left max-w-4xl mx-auto">
//             <p className="text-slate-700 mb-2">
//               Sản phẩm, khóa học, link kích hoạt sẽ được gửi về email của bạn trong khoảng 2 giờ làm việc sau khi bạn thanh toán ! Hệ thống tự động gửi.
//             </p>
//             <p className="text-slate-700 mb-2 font-semibold">
//               Bạn chuyển khoản hãy ghi ĐÚNG NỘI DUNG CHUYỂN KHOẢN và không thoát trình duyệt đến khi đơn hàng được XÁC NHẬN.
//             </p>
//             <p className="text-slate-700">
//               Cảm ơn bạn đã sử dụng dịch vụ tại Full Bootcamp
//             </p>
//           </div>
//         </div>

//         {/* Payment Details Section */}
//         <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 mb-8 shadow-lg">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Left: Bank Details */}
//             <div>
//               <h2 className="text-2xl font-bold text-slate-900 mb-6">Thông tin chuyển khoản</h2>
              
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-slate-600 mb-1">Ngân hàng</p>
//                   <p className="text-lg font-semibold text-slate-900">VIETCOMBANK - TRAN DUY BAC</p>
//                 </div>
                
//                 <div>
//                   <p className="text-slate-600 mb-1">Số tài khoản</p>
//                   <p className="text-xl font-bold text-slate-900">0141000836982</p>
//                 </div>
                
//                 <div>
//                   <p className="text-slate-600 mb-1">Nội dung chuyển khoản</p>
//                   <p className="text-2xl font-bold text-primary-600 bg-primary-50 px-4 py-2 rounded-lg inline-block">
//                     {finalOrderData.transferContent}
//                   </p>
//                 </div>
                
//                 <div>
//                   <p className="text-slate-600 mb-1">Số tiền</p>
//                   <p className="text-3xl font-bold text-green-600">
//                     {finalOrderData.total.toLocaleString("vi-VN")} VND
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Right: QR Code Placeholder */}
//             <div className="flex items-center justify-center">
//               <div className="w-64 h-64 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center">
//                 <div className="text-center">
//                   <svg className="w-32 h-32 mx-auto text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
//                   </svg>
//                   <p className="text-sm text-slate-500">QR Code</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Order Summary Table */}
//           <div className="mt-8 pt-8 border-t border-slate-200">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div>
//                 <p className="text-sm text-slate-600 mb-1">ID Đơn Hàng</p>
//                 <p className="text-sm font-semibold text-slate-900 break-all">{finalOrderData.orderId}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-slate-600 mb-1">Cập nhật</p>
//                 <p className="text-sm font-semibold text-slate-900">{finalOrderData.date}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-slate-600 mb-1">Tổng</p>
//                 <p className="text-sm font-semibold text-slate-900">{finalOrderData.total}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-slate-600 mb-1">Trạng thái</p>
//                 <p className="text-sm font-semibold text-red-600">{finalOrderData.status}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Order Details Section */}
//         <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-lg">
//           <h2 className="text-2xl font-bold text-slate-900 mb-6">Chi tiết đơn hàng</h2>
          
//           <div className="mb-6">
//             <p className="text-slate-600 mb-1">Email</p>
//             <p className="text-lg font-semibold text-slate-900">{finalOrderData.email}</p>
//           </div>

//           <div>
//             <h3 className="text-xl font-bold text-slate-900 mb-4">Sản phẩm</h3>
//             <div className="space-y-4">
//               {finalOrderData.items.length > 0 ? (
//                 finalOrderData.items.map((item, index) => (
//                   <div key={index} className="border border-slate-200 rounded-lg p-4">
//                     <h4 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h4>
//                     <p className="text-sm text-slate-600 mb-2 break-all">{item.url}</p>
//                     <div className="flex justify-between items-center">
//                       <span className="text-red-600 font-semibold">{finalOrderData.status}</span>
//                       <span className="text-lg font-bold text-slate-900">
//                         {item.price.toLocaleString("vi-VN")} VND
//                       </span>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-slate-600">Không có sản phẩm trong đơn hàng</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }



"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState, Suspense } from "react";

// --- CẤU HÌNH TÀI KHOẢN NGÂN HÀNG CỦA BẠN ---
const MY_BANK = {
  BANK_ID: "VCB", // Vietcombank viết tắt là VCB (MBBank là MB, Techcom là TCB...)
  ACCOUNT_NO: "0141000836982",
  ACCOUNT_NAME: "TRAN DUY BAC",
  TEMPLATE: "compact" // Kiểu QR: compact, print, qr_only
};

interface OrderItem {
  title: string;
  url: string;
  price: number;
  courseId?: number | null;
}

interface BankInfo {
  bankName: string;
  accountNo: string;
  accountName: string;
}

interface OrderData {
  success: boolean;
  orderId?: number; // ID đơn hàng từ API
  orderCode: string; // Mã đơn hàng từ API (VD: DH953282)
  totalAmount: number; // Tổng tiền
  qrCodeUrl: string; // URL QR code từ API
  paymentStatus: string; // 'paid' | 'pending' | 'unpaid'
  bankInfo: BankInfo | null; // Thông tin ngân hàng (parse từ QR URL)
  email: string;
  items: OrderItem[];
  status: string; // 'Đã thanh toán' | 'Chưa thanh toán'
  date: string;
}

// Inner component that uses useSearchParams - must be wrapped in Suspense
function OrderPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isPaid, setIsPaid] = useState(false); // Trạng thái thanh toán local để hiển thị UI
  const [isChecking, setIsChecking] = useState(false); // Loading indicator khi đang check trạng thái

  /**
   * Step 1: Load order data from URL params and initialize state
   * - Parse data from searchParams
   * - Initialize isPaid based on data.paymentStatus === 'paid'
   * - If paymentStatus is 'pending', show QR Code & Bank Info
   */
  useEffect(() => {
    const orderDataParam = searchParams.get("data");
    
    if (orderDataParam) {
      try {
        const decoded = JSON.parse(decodeURIComponent(orderDataParam));
        
        // Initialize isPaid based on paymentStatus from data
        // Only set isPaid = true if paymentStatus is 'paid'
        const initialIsPaid = decoded.paymentStatus === 'paid';
        
        setOrderData(decoded);
        setIsPaid(initialIsPaid);
        
        // Fallback: Lưu vào localStorage để có thể recover nếu refresh
        localStorage.setItem("orderData", JSON.stringify(decoded));
      } catch (e) {
        console.error("Error parsing order data:", e);
        // Fallback: Thử load từ localStorage
        const stored = localStorage.getItem("orderData");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const initialIsPaid = parsed.paymentStatus === 'paid';
            setOrderData(parsed);
            setIsPaid(initialIsPaid);
          } catch (err) {
            console.error("Error parsing stored order data:", err);
          }
        }
      }
    } else {
      // Nếu không có data trong URL, thử load từ localStorage
      const stored = localStorage.getItem("orderData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const initialIsPaid = parsed.paymentStatus === 'paid';
          setOrderData(parsed);
          setIsPaid(initialIsPaid);
        } catch (err) {
          console.error("Error parsing stored order data:", err);
        }
      }
    }
  }, [searchParams]);

  /**
   * Step 2: Polling API để check payment status (Real-time Status Check)
   * - Use useEffect to poll the API every 3 seconds
   * - Condition: Only poll if isPaid is false
   * - Logic:
   *   - If API returns { status: 'paid' }: Update isPaid to true, stop polling
   *   - If API returns { status: 'pending' }: Do nothing, keep polling
   */
  useEffect(() => {
    // Condition: Only poll if isPaid is false and we have orderCode
    if (!orderData || !orderData.orderCode || isPaid) {
      return;
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.khoahocgiare.info';
    let intervalId: NodeJS.Timeout | null = null;
    let isMounted = true;

    /**
     * Function to check payment status from API
     * @returns true if payment is successful (status: 'paid'), false if still pending
     */
    const checkPaymentStatus = async (): Promise<boolean> => {
      if (!isMounted) return false;
      
      setIsChecking(true);
      
      // Create AbortController for timeout (10 seconds)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch(
          `${API_URL}/api/payment/check-status/${orderData.orderCode}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            signal: controller.signal,
          }
        );
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          // Only log client errors (4xx), don't log network errors
          if (response.status >= 400 && response.status < 500) {
            console.warn("Client error when checking payment status:", response.status);
          }
          setIsChecking(false);
          return false;
        }

        const data = await response.json();

        /**
         * Check if API returns { status: 'paid' }
         * Also support { success: true } for backward compatibility
         */
        const isPaymentSuccessful = 
          data.status === 'paid' || 
          (data.success === true && data.paymentStatus === 'paid') ||
          (data.success === true && !data.status); // If success: true but no status field

        if (isPaymentSuccessful) {
          if (!isMounted) return false;
          
          // Payment successful - update state
          setIsPaid(true);
          setIsChecking(false);
          setOrderData(prev => prev ? { 
            ...prev, 
            paymentStatus: 'paid',
            status: 'Đã thanh toán'
          } : null);
          
          // Update localStorage
          const updatedData = {
            ...orderData,
            paymentStatus: 'paid',
            status: 'Đã thanh toán'
          };
          localStorage.setItem("orderData", JSON.stringify(updatedData));
          
          // Stop polling
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          
          return true; // Signal success, stop polling
        }
        
        // If still pending, continue polling
        setIsChecking(false);
        return false;
      } catch (error: any) {
        clearTimeout(timeoutId);
        setIsChecking(false);
        
        // Handle network errors gracefully - don't log disconnected errors
        if (error.name === 'AbortError') {
          // Timeout - no need to log, continue polling
          return false;
        }
        
        // Only log other errors (not TypeError from network)
        if (error.name !== 'TypeError' || !error.message.includes('fetch')) {
          console.warn("Error checking payment status:", error.message);
        }
        
        // Continue polling on error (don't stop)
        return false;
      }
    };

    // Poll immediately on first load
    checkPaymentStatus().then((shouldStop) => {
      if (shouldStop || !isMounted) return;
      
      // Set interval to poll every 3 seconds
      intervalId = setInterval(async () => {
        if (!isMounted) {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
          return;
        }
        
        const shouldStop = await checkPaymentStatus();
        if (shouldStop && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }, 3000); // Poll every 3 seconds
    });

    // Cleanup: Clear interval when component unmounts
    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      setIsChecking(false);
    };
  }, [orderData, isPaid]);

  // Dữ liệu hiển thị (Fallback nếu null)
  const displayData = orderData || {
    success: false,
    orderId: undefined,
    orderCode: "LOADING...",
    totalAmount: 0,
    qrCodeUrl: "",
    paymentStatus: "unpaid",
    bankInfo: null,
    email: "...",
    items: [],
    status: "Chưa thanh toán",
    date: new Date().toLocaleDateString("vi-VN"),
  };

  // Parse bank info from QR URL if not provided
  useEffect(() => {
    if (orderData && orderData.qrCodeUrl && !orderData.bankInfo) {
      try {
        const urlMatch = orderData.qrCodeUrl.match(/image\/([^-]+)-(\d+)-/);
        const urlParams = new URLSearchParams(orderData.qrCodeUrl.split('?')[1]);
        if (urlMatch) {
          const parsedBankInfo = {
            bankName: urlMatch[1],
            accountNo: urlMatch[2],
            accountName: decodeURIComponent(urlParams.get('accountName') || ''),
          };
          setOrderData(prev => prev ? { ...prev, bankInfo: parsedBankInfo } : null);
        }
      } catch (e) {
        console.error("Error parsing bank info:", e);
      }
    }
  }, [orderData]);

  // Use QR URL from API response
  const qrUrl = displayData.qrCodeUrl || "";
  
  // Không tự động set isPaid từ paymentStatus ban đầu
  // Chỉ set khi polling/webhook xác nhận

  // Hàm copy tiện lợi
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Đã copy: " + text);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header: Chỉ show "thanh toán thành công" khi isPaid === true (API trả về success: true) */}
        <div className="text-center mb-8">
          {isPaid ? (
            // Step 3: Show success UI khi API trả về success: true
            <div className="animate-bounce">
              <span className="text-6xl">✅</span>
              <h1 className="text-4xl font-bold text-green-600 mt-4">Thanh toán thành công!</h1>
              <p className="text-xl text-slate-600 mt-2">Hệ thống đang gửi tài liệu cho bạn...</p>
            </div>
          ) : (
            // Step 2: Show thông tin đơn hàng và QR code để thanh toán
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                Xác nhận thanh toán
              </h1>
              <p className="text-slate-600">Vui lòng quét mã bên dưới để hoàn tất đơn hàng</p>
              <p className="text-sm text-slate-500 mt-2">
                Hệ thống sẽ tự động xác nhận sau khi bạn chuyển khoản
              </p>
              {isChecking && (
                <p className="text-xs text-blue-600 mt-2 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                  Đang kiểm tra trạng thái thanh toán...
                </p>
              )}
            </>
          )}
        </div>

        {/* Step 2: Show thông tin đơn hàng và QR code - Ẩn khi đã thanh toán */}
        {!isPaid && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-xl overflow-hidden relative">
            {/* Loading indicator khi đang check status */}
            {isChecking && (
              <div className="absolute top-4 right-4 flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg z-20">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-blue-600 font-medium">Đang kiểm tra...</span>
              </div>
            )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Cột trái: Thông tin chuyển khoản */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 border-b pb-2">Thông tin chuyển khoản</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                  <div>
                    <p className="text-sm text-slate-500">Ngân hàng</p>
                    <p className="font-bold text-slate-900">{displayData.bankInfo?.bankName || "..."}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded group cursor-pointer" onClick={() => copyToClipboard(displayData.bankInfo?.accountNo || "")}>
                  <div>
                    <p className="text-sm text-slate-500">Số tài khoản</p>
                    <p className="text-xl font-bold text-blue-600">{displayData.bankInfo?.accountNo || "..."}</p>
                  </div>
                  <button className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200">Copy</button>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
                   <div>
                    <p className="text-sm text-slate-500">Chủ tài khoản</p>
                    <p className="font-bold text-slate-900">{displayData.bankInfo?.accountName || "..."}</p>
                  </div>
                </div>
                
                {/* QUAN TRỌNG: Nội dung CK - Sử dụng orderCode từ API */}
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-sm text-slate-500 mb-1">Nội dung chuyển khoản (Bắt buộc)</p>
                  <div className="flex justify-between items-center cursor-pointer" onClick={() => copyToClipboard(displayData.orderCode)}>
                     <p className="text-2xl font-black text-red-600 tracking-wide">
                        {displayData.orderCode}
                     </p>
                     <button className="text-xs bg-yellow-200 text-yellow-800 px-3 py-1 rounded font-bold hover:bg-yellow-300">Copy</button>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1 italic">* Vui lòng nhập chính xác nội dung này</p>
                </div>
                
                <div className="flex justify-between items-center p-3">
                  <p className="text-slate-600">Số tiền</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {displayData.totalAmount.toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </div>
            </div>

            {/* Cột phải: QR CODE */}
            <div className="flex flex-col items-center justify-center bg-blue-50 rounded-xl p-6 border-2 border-dashed border-blue-200">
              <p className="text-slate-600 mb-4 font-medium">Quét mã để thanh toán tự động</p>
              
              <div className="bg-white p-2 rounded-lg shadow-sm">
                 {/* ẢNH QR THẬT từ API */}
                 {qrUrl ? (
                    <img 
                      src={qrUrl} 
                      alt="QR Payment" 
                      className="w-full max-w-[280px] h-auto object-contain"
                      onError={(e) => {
                        // Fallback nếu QR code không load được
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                 ) : (
                    <div className="w-full max-w-[280px] h-[280px] bg-slate-100 flex items-center justify-center rounded">
                      <p className="text-slate-400">Đang tải QR Code...</p>
                    </div>
                 )}
              </div>
              
              <p className="text-sm text-slate-500 mt-4 text-center px-4">
                Sử dụng App ngân hàng hoặc Ví điện tử để quét mã.
              </p>
              <div className="mt-4 flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-semibold">Đang chờ thanh toán...</span>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Step 3: Show "Payment Successful" UI khi API trả về success: true */}
        {isPaid && (
          <div className="bg-white border-2 border-green-200 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="text-center">
              {/* Green Checkmark Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              {/* Success Message */}
              <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-4">
                Payment Successful!
              </h2>
              <p className="text-xl md:text-2xl text-slate-700 mb-6">
                System is processing your course. Please check your email in 5 minutes.
              </p>
              
              {/* Order Info */}
              <div className="mt-8 bg-green-50 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-sm text-slate-600 mb-2">Order Code</p>
                <p className="text-2xl font-bold text-slate-900">{displayData.orderCode}</p>
                <p className="text-sm text-slate-600 mt-4 mb-2">Email</p>
                <p className="text-lg font-semibold text-slate-900">{displayData.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bảng chi tiết đơn hàng */}
        <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200">
             <h3 className="font-bold text-slate-700 mb-4">Chi tiết đơn hàng #{displayData.orderCode}</h3>
             {displayData.items.length > 0 ? (
               displayData.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-2 border-b last:border-0">
                    <span>{item.title}</span>
                    <span className="font-medium">{item.price.toLocaleString("vi-VN")} đ</span>
                </div>
               ))
             ) : (
               <p className="text-slate-600">Không có sản phẩm trong đơn hàng</p>
             )}
        </div>

      </div>
      <Footer />
    </div>
  );
}

// Default export with Suspense boundary for useSearchParams
export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
      }
    >
      <OrderPageContent />
    </Suspense>
  );
}