// ============================================
// UTILITY FUNCTIONS
// ============================================

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Vietnamese currency
 */
export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString('vi-VN')} VND`;
}

/**
 * Format date to Vietnamese format
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate order code format (DH + 6 digits)
 */
export function isValidOrderCode(orderCode: string): boolean {
  return /^DH\d{6}$/.test(orderCode);
}

/**
 * Parse URLs from text (one per line)
 */
export function parseUrls(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Format time remaining (seconds to MM:SS)
 */
export function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Sleep function for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}

/**
 * Transform Udemy URL to samsungu.udemy.com format
 * @param rawUrl - Original Udemy course URL
 * @returns Transformed URL or null if invalid
 */
export function transformUdemy(rawUrl: string | null | undefined): string | null {
  if (!rawUrl) return null;
  
  try {
    const url = new URL(
      /^https?:\/\//i.test(rawUrl) ? rawUrl.trim() : `https://${rawUrl.trim()}`
    );

    // Only process udemy.com URLs
    if (!/(^|\.)udemy\.com$/.test(url.hostname)) {
      return rawUrl; // Return original if not Udemy URL
    }

    // Transform to Samsung Udemy Business tenant
    url.hostname = 'samsungu.udemy.com';
    url.protocol = 'https:';

    // Validate and extract course slug from various formats:
    // - /course/<slug>/
    // - /course/<slug>/learn/lecture/...
    // - /course/<slug>/learn/quiz/...
    const match = url.pathname.match(/^\/course\/([a-zA-Z0-9-_]+)(?:\/.*)?$/);
    if (!match) return rawUrl; // Return original if can't extract slug

    const slug = match[1];

    // Normalize path to course URL (remove /learn/lecture/... parts)
    url.pathname = `/course/${slug}/`;
    url.search = '';
    url.hash = '';

    return url.toString();
  } catch {
    return rawUrl; // Return original on error
  }
}

/**
 * Sanitize and fix HTML content
 * Removes dangerous tags and fixes common HTML issues
 */
export function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // Allowed HTML tags
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'a', 'blockquote', 'code', 'pre',
    'img'
  ];
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Remove script tags and event handlers
  const scripts = tempDiv.querySelectorAll('script, style, iframe, object, embed, form, input, button');
  scripts.forEach(el => el.remove());
  
  // Remove all elements that are not in allowed tags
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    const tagName = el.tagName.toLowerCase();
    if (!allowedTags.includes(tagName)) {
      // Replace with its content
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
      }
    } else {
      // Remove dangerous attributes
      const attrs = Array.from(el.attributes);
      attrs.forEach(attr => {
        const attrName = attr.name.toLowerCase();
        // Allow safe attributes
        const safeAttrs = ['href', 'src', 'alt', 'title', 'class', 'id'];
        if (!safeAttrs.includes(attrName) || attrName.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
        // Sanitize href and src
        if (attrName === 'href' || attrName === 'src') {
          const value = attr.value.toLowerCase();
          if (value.startsWith('javascript:') || value.startsWith('data:')) {
            el.removeAttribute(attr.name);
          }
        }
      });
    }
  });
  
  // Fix common HTML issues
  let sanitized = tempDiv.innerHTML;
  
  // Fix unclosed tags
  sanitized = sanitized.replace(/<p([^>]*)>/gi, '<p$1>');
  sanitized = sanitized.replace(/<strong([^>]*)>/gi, '<strong$1>');
  sanitized = sanitized.replace(/<em([^>]*)>/gi, '<em$1>');
  
  // Fix &amp; entities
  sanitized = sanitized.replace(/&amp;([a-z]+;)/gi, '&$1');
  
  // Fix double br tags
  sanitized = sanitized.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br />');
  
  // Clean up empty paragraphs
  sanitized = sanitized.replace(/<p>\s*<\/p>/gi, '');
  sanitized = sanitized.replace(/<p><\/p>/gi, '');
  
  return sanitized;
}
