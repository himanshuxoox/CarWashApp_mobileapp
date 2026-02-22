// src/constants/config.js

// IMPORTANT: Replace with your actual backend URL
//export const API_BASE_URL = 'http://192.168.1.100:8081'; // For Android emulator use 10.0.2.2:8081
// export const API_BASE_URL = 'http://10.0.2.2:8081'; // For Android emulator
//export const API_BASE_URL = 'http://192.168.1.102:8080'; // For iOS simulator

 export const API_BASE_URL ='http://10.161.27.154:8080';//pnb wifi

export const API_ENDPOINTS = {
  SEND_OTP: '/auth/send-otp',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',
  BOOKINGS: '/bookings',
  USER_PROFILE: '/users/profile',
};


export const APP_CONFIG = {
  OTP_LENGTH: 6,
  OTP_RESEND_TIMEOUT: 60, // seconds
  PHONE_NUMBER_LENGTH: 10,
  COUNTRY_CODE: '+91',
};

export const SERVICE_TYPES = {
  BASIC_WASH: 'BASIC_WASH',
  PREMIUM_WASH: 'PREMIUM_WASH',
  INTERIOR_CLEAN: 'INTERIOR_CLEAN',
  FULL_SERVICE: 'FULL_SERVICE',
};

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};
// Add Google Maps API Key
export const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
