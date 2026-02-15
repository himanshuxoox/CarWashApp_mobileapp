// src/utils/validation.js

import { APP_CONFIG } from '../constants/config';

/**
 * Validate Indian phone number
 */
export const validatePhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's 10 digits and starts with 6-9
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Format phone number for display
 */
export const formatPhoneNumber = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    return `${APP_CONFIG.COUNTRY_CODE} ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  }
  
  return phone;
};

/**
 * Validate OTP
 */
export const validateOtp = (otp) => {
  const otpRegex = new RegExp(`^\\d{${APP_CONFIG.OTP_LENGTH}}$`);
  return otpRegex.test(otp);
};

/**
 * Clean phone number (remove spaces, dashes, etc.)
 */
export const cleanPhoneNumber = (phone) => {
  return phone.replace(/\D/g, '');
};

/**
 * Get error message from error object
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
