// src/api/authApi.js

import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../constants/config';

/**
 * Send OTP to phone number
 */
export const sendOtp = async (phoneNumber) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.SEND_OTP, {
      phoneNumber: phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify OTP and get JWT token
 */
export const verifyOtp = async (phoneNumber, otp) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.VERIFY_OTP, {
      phoneNumber: phoneNumber,
      otp: otp,
    });
    return response.data; // { token, phone }
  } catch (error) {
    throw error;
  }
};

/**
 * Resend OTP
 */
export const resendOtp = async (phoneNumber) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.RESEND_OTP, {
      phoneNumber: phoneNumber,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user bookings
 */
export const getBookings = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Create new booking
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.BOOKINGS, bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user profile
 */
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.USER_PROFILE);
    return response.data;
  } catch (error) {
    throw error;
  }
};
