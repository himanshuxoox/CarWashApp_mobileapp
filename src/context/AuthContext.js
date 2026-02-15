// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import { getToken, saveToken, clearAllData, savePhone, getPhone } from '../utils/storage';
import { verifyOtp as verifyOtpApi } from '../api/authApi';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await getToken();
      const storedPhone = await getPhone();
      
      if (storedToken) {
        setToken(storedToken);
        setPhoneNumber(storedPhone);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone, otp) => {
    try {
      const response = await verifyOtpApi(phone, otp);
      
      if (response.token) {
        await saveToken(response.token);
        await savePhone(phone);
        
        setToken(response.token);
        setPhoneNumber(phone);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Login failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await clearAllData();
      setToken(null);
      setPhoneNumber(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    isLoading,
    isAuthenticated,
    token,
    phoneNumber,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
