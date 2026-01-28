// ============================================
// CUSTOM HOOK: useCourseAPI
// ============================================

import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import type { CourseInfo, OrderData, CreateOrderRequest } from '@/types';

interface UseCourseAPIReturn {
  // Get Course Info
  getCourseInfo: (urls: string[]) => Promise<CourseInfo[]>;
  courseInfoLoading: boolean;
  courseInfoError: string | null;

  // Create Order (original)
  createOrder: (data: CreateOrderRequest) => Promise<OrderData>;
  createOrderLoading: boolean;
  createOrderError: string | null;

  // Create Order All Courses Offer (new)
  createOrderAllCourses: (data: CreateOrderRequest) => Promise<OrderData>;
  createOrderAllCoursesLoading: boolean;
  createOrderAllCoursesError: string | null;

  // Reset states
  resetErrors: () => void;
}

/**
 * Custom hook for course API operations
 */
export function useCourseAPI(): UseCourseAPIReturn {
  // Get Course Info states
  const [courseInfoLoading, setCourseInfoLoading] = useState(false);
  const [courseInfoError, setCourseInfoError] = useState<string | null>(null);

  // Create Order states (original)
  const [createOrderLoading, setCreateOrderLoading] = useState(false);
  const [createOrderError, setCreateOrderError] = useState<string | null>(null);

  // Create Order All Courses Offer states (new)
  const [createOrderAllCoursesLoading, setCreateOrderAllCoursesLoading] = useState(false);
  const [createOrderAllCoursesError, setCreateOrderAllCoursesError] = useState<string | null>(null);

  /**
   * Get course information
   */
  const getCourseInfo = useCallback(async (urls: string[]): Promise<CourseInfo[]> => {
    setCourseInfoLoading(true);
    setCourseInfoError(null);

    try {
      const response = await apiClient.getCourseInfo(urls);
      return response.results;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to get course info';
      setCourseInfoError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCourseInfoLoading(false);
    }
  }, []);

  /**
   * Create order (original pricing)
   */
  const createOrder = useCallback(async (data: CreateOrderRequest): Promise<OrderData> => {
    setCreateOrderLoading(true);
    setCreateOrderError(null);

    try {
      const response = await apiClient.createOrder(data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create order';
      setCreateOrderError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreateOrderLoading(false);
    }
  }, []);

  /**
   * Create order with All-Courses Offer pricing
   */
  const createOrderAllCourses = useCallback(async (data: CreateOrderRequest): Promise<OrderData> => {
    setCreateOrderAllCoursesLoading(true);
    setCreateOrderAllCoursesError(null);

    try {
      const response = await apiClient.createOrderAllCourses(data);
      return response;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to create All-Courses order';
      setCreateOrderAllCoursesError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setCreateOrderAllCoursesLoading(false);
    }
  }, []);

  /**
   * Reset all errors
   */
  const resetErrors = useCallback(() => {
    setCourseInfoError(null);
    setCreateOrderError(null);
    setCreateOrderAllCoursesError(null);
  }, []);

  return {
    getCourseInfo,
    courseInfoLoading,
    courseInfoError,
    createOrder,
    createOrderLoading,
    createOrderError,
    createOrderAllCourses,
    createOrderAllCoursesLoading,
    createOrderAllCoursesError,
    resetErrors,
  };
}
