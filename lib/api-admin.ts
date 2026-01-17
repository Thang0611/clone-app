/**
 * Authenticated API Client for Admin
 * Automatically attaches JWT token to requests
 */

import { getAccessToken } from './auth';
import { headers } from 'next/headers';

interface RequestOptions extends RequestInit {
  timeout?: number;
}

class AuthenticatedAPIClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  }

  /**
   * Get JWT token from session
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      // This works in Server Components and Server Actions
      // For client components, we'll need to use a different approach
      const token = await getAccessToken();
      return token;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  /**
   * Make authenticated fetch request
   */
  async fetch(path: string, options: RequestOptions = {}) {
    const token = await this.getAuthToken();
    
    if (!token) {
      throw new Error('Not authenticated. Please login.');
    }

    const { timeout = 30000, ...fetchOptions } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const headers = new Headers(fetchOptions.headers);
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');

    try {
      const response = await fetch(`${this.baseURL}${path}`, {
        ...fetchOptions,
        headers,
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
   * GET request
   */
  async get(path: string, options?: RequestOptions) {
    const response = await this.fetch(path, {
      ...options,
      method: 'GET',
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
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
   * POST request
   */
  async post(path: string, body?: any, options?: RequestOptions) {
    const response = await this.fetch(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
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
   * PUT request
   */
  async put(path: string, body?: any, options?: RequestOptions) {
    const response = await this.fetch(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
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
   * DELETE request
   */
  async delete(path: string, options?: RequestOptions) {
    const response = await this.fetch(path, {
      ...options,
      method: 'DELETE',
    });

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
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
}

// Export singleton instance for server-side use
export const adminAPIClient = new AuthenticatedAPIClient();

// Export class for custom instances
export { AuthenticatedAPIClient };
