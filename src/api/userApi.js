import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../constants/config';

/**
 * Create user profile
 */
export const createUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.USER_PROFILE, profileData);
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

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put(API_ENDPOINTS.USER_PROFILE, profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user location
 */
export const updateUserLocation = async (latitude, longitude) => {
  try {
    const response = await axiosInstance.patch(
      `${API_ENDPOINTS.USER_PROFILE}/location`,
      { latitude, longitude }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};