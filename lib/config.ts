// ============================================
// APPLICATION CONFIGURATION
// ============================================

/**
 * Get the Socket.io server URL based on environment
 */
export const getSocketUrl = (): string => {
  return process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
};

/**
 * Get the API base URL based on environment
 */
export const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

/**
 * Check if running in production
 */
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Application configuration
 */
export const APP_CONFIG = {
  socketUrl: getSocketUrl(),
  apiUrl: getApiUrl(),
  isProduction: isProduction(),
  
  // WebSocket configuration
  websocket: {
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
  },
  
  // API configuration
  api: {
    timeout: 30000,
    retries: 3,
  },
};
