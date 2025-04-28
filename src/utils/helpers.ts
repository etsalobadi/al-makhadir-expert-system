
import { toast } from "sonner";

/**
 * Format a date according to Arabic locale
 */
export const formatDate = (date: Date | string | number): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'object' ? date : new Date(date);
  
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Format a number to Arabic locale with thousands separators
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ar-SA').format(num);
};

/**
 * Format currency with SAR symbol
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'YER',
  }).format(amount);
};

/**
 * Generate a unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Show a success toast message
 */
export const showSuccess = (message: string): void => {
  toast.success(message);
};

/**
 * Show an error toast message
 */
export const showError = (message: string): void => {
  toast.error(message);
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

/**
 * Check if user has permission based on role
 */
export const hasPermission = (userRole: string, allowedRoles: string[]): boolean => {
  return allowedRoles.includes(userRole);
};
