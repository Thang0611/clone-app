// ============================================
// SHARED TYPESCRIPT TYPES
// ============================================

export interface CourseInfo {
  success: boolean;
  url?: string;
  title?: string;
  image?: string;
  price?: number;
  courseId?: number | null;
  message?: string;
}

export interface CourseInfoResponse {
  success: boolean;
  results: CourseInfo[];
  totalAmount: number;
  validCourseCount: number;
}

export interface OrderItem {
  title: string;
  url: string;
  price: number;
  courseId?: number | null;
}

export interface BankInfo {
  bankName: string;
  accountNo: string;
  accountName: string;
}

export interface OrderData {
  success: boolean;
  orderId?: number;
  orderCode: string;
  totalAmount: number;
  qrCodeUrl: string;
  paymentStatus: 'pending' | 'paid' | 'unpaid';
  bankInfo: BankInfo | null;
  email: string;
  items: OrderItem[];
  status: string;
  date: string;
}

export interface CreateOrderRequest {
  email: string;
  courses: {
    url: string;
    title: string;
    courseId?: number | null;
    price: number;
  }[];
}

export interface CheckStatusResponse {
  success: boolean;
  status: 'pending' | 'paid';
  amount: number;
}

// API Error
export interface APIError {
  success: false;
  error?: string;
  message?: string;
}

// Form states
export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export interface FormState<T> {
  status: FormStatus;
  data: T | null;
  error: string | null;
}
