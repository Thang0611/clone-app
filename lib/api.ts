// ============================================
// API CLIENT
// ============================================

import { API_BASE_URL, API_ENDPOINTS, API_TIMEOUT, CHECK_STATUS_TIMEOUT } from './constants';
import type {
  CourseInfoResponse,
  CreateOrderRequest,
  OrderData,
  CheckStatusResponse,
  APIError,
} from '@/types';

class APIClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Make a fetch request with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeout: number = API_TIMEOUT
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please try again.');
      }
      throw error;
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData: APIError = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (data.success === false) {
      throw new Error(data.message || data.error || 'API request failed');
    }

    return data;
  }

  /**
   * Get course information
   */
  async getCourseInfo(urls: string[]): Promise<CourseInfoResponse> {
    const response = await this.fetchWithTimeout(
      `${this.baseURL}${API_ENDPOINTS.GET_COURSE_INFO}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls }),
      }
    );

    return this.handleResponse<CourseInfoResponse>(response);
  }

  /**
   * Create order
   */
  async createOrder(data: CreateOrderRequest): Promise<OrderData> {
    const response = await this.fetchWithTimeout(
      `${this.baseURL}${API_ENDPOINTS.CREATE_ORDER}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    return this.handleResponse<OrderData>(response);
  }

  /**
   * Check payment status
   */
  async checkPaymentStatus(orderCode: string): Promise<CheckStatusResponse> {
    const response = await this.fetchWithTimeout(
      `${this.baseURL}${API_ENDPOINTS.CHECK_STATUS}/${orderCode}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      CHECK_STATUS_TIMEOUT
    );

    return this.handleResponse<CheckStatusResponse>(response);
  }

  /**
   * Get full order details by order code (from Next.js API route)
   */
  async getOrderByCode(orderCode: string): Promise<{ success: boolean; order: OrderData }> {
    const response = await this.fetchWithTimeout(
      `/api/orders/${orderCode}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      API_TIMEOUT
    );

    return this.handleResponse<{ success: boolean; order: OrderData }>(response);
  }

  /**
   * Store order in Next.js API cache (called after order creation)
   */
  async storeOrder(orderCode: string, orderData: OrderData): Promise<void> {
    try {
      await fetch('/api/orders/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode, orderData }),
      });
    } catch (error) {
      console.error('Failed to store order:', error);
      // Non-critical error, don't throw
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export for testing with custom baseURL
export { APIClient };
