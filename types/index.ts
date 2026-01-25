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
  courseType?: 'temporary' | 'permanent'; // Thêm field mới
  category?: string | null; // Thêm category
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
    courseType?: 'temporary' | 'permanent'; // Loại khóa học: temporary (trang chủ) hoặc permanent (trang courses)
    category?: string | null; // Category của khóa học
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

// ============================================
// ADMIN DASHBOARD TYPES
// ============================================

export type TaskStatus = 'pending' | 'enrolled' | 'downloading' | 'completed' | 'failed';
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type PaymentStatus = 'pending' | 'paid' | 'unpaid';
export type LogSeverity = 'info' | 'warning' | 'error' | 'critical';
export type EventCategory = 'payment' | 'enrollment' | 'download' | 'system' | 'notification';

export interface DownloadTask {
  id: number;
  order_id: number;
  course_url: string;
  title: string | null;
  course_id: number | null;
  status: TaskStatus;
  drive_link: string | null;
  error_log: string | null;
  created_at: string;
  updated_at: string;
  // Real-time fields
  currentProgress?: number;
  currentFile?: string;
  speed?: number;
}

export interface OrderStats {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  progressPercentage: number;
}

export interface AdminOrder {
  id: number;
  order_code: string;
  user_email: string;
  total_amount: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
  stats: OrderStats;
  tasks?: DownloadTask[];
  // Real-time fields
  currentProgress?: number;
  currentFile?: string;
}

export interface OrderAuditLog {
  id: number;
  order_id: number;
  task_id: number | null;
  event_type: string;
  event_category: EventCategory;
  severity: LogSeverity;
  message: string;
  details: Record<string, any> | null;
  previous_status: string | null;
  new_status: string | null;
  source: string;
  created_at: string;
  // Joined fields
  course_url?: string;
  task_title?: string;
}

/**
 * Unified Log Format (audit logs + task logs)
 * Used by the enhanced Admin API
 */
export interface UnifiedLog {
  id: number;
  type: 'audit' | 'task';
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'critical';
  category: EventCategory | 'upload' | 'system';
  source: string;
  taskId: number | null;
  orderId: number;
  message: string;
  details: Record<string, any> | null;
  progress: number | null; // 0-100 for task logs
  currentFile: string | null; // For task logs
  eventType: string | null; // Only for audit logs
  previousStatus: string | null; // Only for audit logs
  newStatus: string | null; // Only for audit logs
}

export interface DashboardStats {
  orders: {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  };
  tasks: {
    total: number;
    pending: number;
    enrolled: number;
    downloading: number;
    completed: number;
    failed: number;
  };
  revenue: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

// WebSocket Events
export interface ProgressEvent {
  scope: 'order' | 'task';
  id: number;
  type: 'progress';
  data: {
    taskId?: number;
    orderId?: number;
    percent: number;
    currentFile?: string;
    speed?: number;
    timestamp: number;
  };
}

export interface StatusEvent {
  scope: 'order' | 'task';
  id: number;
  type: 'status';
  data: {
    taskId?: number;
    orderId?: number;
    newStatus: string;
    previousStatus: string;
    timestamp: number;
  };
}

export interface CompleteEvent {
  scope: 'order';
  id: number;
  type: 'complete';
  data: {
    orderId: number;
    totalTasks: number;
    completedTasks: number;
    failedTasks: number;
    timestamp: number;
  };
}

export type SocketEvent = ProgressEvent | StatusEvent | CompleteEvent;
