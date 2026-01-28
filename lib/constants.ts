// ============================================
// APPLICATION CONSTANTS
// ============================================

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.getcourses.net';
export const API_VERSION = 'v1';

// API Endpoints
export const API_ENDPOINTS = {
  GET_COURSE_INFO: `/api/${API_VERSION}/get-course-info`,
  CREATE_ORDER: `/api/${API_VERSION}/payment/create-order`,
  CREATE_ORDER_ALL_COURSES: `/api/${API_VERSION}/payment/create-order-all-courses`,
  CHECK_STATUS: `/api/${API_VERSION}/payment/check-status`,
} as const;

// Pricing - Regular download
export const REGULAR_PRICE_PER_COURSE = 39000; // VND per course
export const REGULAR_PRICE_COMBO_5 = 99000; // VND for 5 courses
export const REGULAR_PRICE_COMBO_10 = 199000; // VND for 10 courses

// Pricing - Premium (all courses access)
export const PREMIUM_PRICE = 199000; // VND - Fixed price for all courses access

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
