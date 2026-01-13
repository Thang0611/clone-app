// ============================================
// APPLICATION CONSTANTS
// ============================================

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.khoahocgiare.info';
export const API_VERSION = 'v1';

// API Endpoints
export const API_ENDPOINTS = {
  GET_COURSE_INFO: `/api/${API_VERSION}/get-course-info`,
  CREATE_ORDER: `/api/${API_VERSION}/payment/create-order`,
  CHECK_STATUS: `/api/${API_VERSION}/payment/check-status`,
} as const;

// Pricing
export const DEFAULT_COURSE_PRICE = 2000; // VND

// Polling Configuration
export const POLLING_INTERVAL = 3000; // 3 seconds
export const POLLING_TIMEOUT = 300000; // 5 minutes

// Request Timeouts
export const API_TIMEOUT = 30000; // 30 seconds for general API calls
export const CHECK_STATUS_TIMEOUT = 10000; // 10 seconds for status checks

// Order Code Format
export const ORDER_CODE_PATTERN = /^DH\d{6}$/;

// Toast Configuration
export const TOAST_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 7000,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ORDER_DATA: 'orderData',
  USER_EMAIL: 'userEmail',
} as const;

// UI Configuration
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
