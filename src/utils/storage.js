// src/utils/storage.js

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TOKEN: '@carwash_token',
  USER: '@carwash_user',
  PHONE: '@carwash_phone',
};

/**
 * Save JWT token
 */
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

/**
 * Get JWT token
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Clear JWT token
 */
export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

/**
 * Save user data
 */
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

/**
 * Get user data
 */
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

/**
 * Save phone number
 */
export const savePhone = async (phone) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PHONE, phone);
  } catch (error) {
    console.error('Error saving phone:', error);
  }
};

/**
 * Get phone number
 */
export const getPhone = async () => {
  try {
    const phone = await AsyncStorage.getItem(STORAGE_KEYS.PHONE);
    return phone;
  } catch (error) {
    console.error('Error getting phone:', error);
    return null;
  }
};

/**
 * Clear all data
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.USER,
      STORAGE_KEYS.PHONE,
    ]);
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};
