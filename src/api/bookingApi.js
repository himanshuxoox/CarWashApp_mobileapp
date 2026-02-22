import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../constants/config';

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.BOOKINGS}?userName=${encodeURIComponent(bookingData.userName)}`,
      {
        serviceType: bookingData.serviceType,
        price: bookingData.price,
        scheduledDateTime: bookingData.scheduledDateTime,
        addressLine1: bookingData.addressLine1,
        addressLine2: bookingData.addressLine2,
        city: bookingData.city,
        state: bookingData.state,
        postalCode: bookingData.postalCode,
        latitude: bookingData.latitude,
        longitude: bookingData.longitude,
        vehicleType: bookingData.vehicleType,
        vehicleNumber: bookingData.vehicleNumber,
        specialInstructions: bookingData.specialInstructions,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all bookings for current user
 */
export const getAllBookings = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.BOOKINGS);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await axiosInstance.get(`${API_ENDPOINTS.BOOKINGS}/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get bookings by status
 */
export const getBookingsByStatus = async (status) => {
  try {
    const response = await axiosInstance.get(
      `${API_ENDPOINTS.BOOKINGS}/status/${status}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (bookingId) => {
  try {
    const response = await axiosInstance.delete(`${API_ENDPOINTS.BOOKINGS}/${bookingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (bookingId, status) => {
  try {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.BOOKINGS}/${bookingId}/status`,
      { status }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};