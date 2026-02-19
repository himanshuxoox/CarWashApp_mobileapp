import React, { createContext, useState, useEffect, useContext } from 'react';
import { getToken, saveToken, clearAllData, savePhone, getPhone } from '../utils/storage';
import { verifyOtp as verifyOtpApi } from '../api/authApi';
import { getUserProfile } from '../api/userApi';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [token, setToken] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [user, setUser] = useState(null);

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
        
        // Check if user has completed profile
        try {
          const userProfile = await getUserProfile();
          console.log('📋 User Profile:', userProfile);
          
          // Check if profile is complete
          // Profile is complete if it has name AND profileCompleted is true
          const isProfileComplete = userProfile && 
                                   userProfile.name && 
                                   userProfile.profileCompleted === true;
          
          console.log('✅ Is Profile Complete:', isProfileComplete);
          
          if (isProfileComplete) {
            setUser(userProfile);
            setHasProfile(true);
          } else {
            setUser(null);
            setHasProfile(false);
          }
        } catch (error) {
          console.log('⚠️  Profile not found:', error.message);
          setHasProfile(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone, otp) => {
    try {
      console.log('🔐 Attempting login...');
      const response = await verifyOtpApi(phone, otp);
      console.log('📥 Verify OTP Response:', response);
      
      if (response.token) {
        await saveToken(response.token);
        await savePhone(phone);
        
        setToken(response.token);
        setPhoneNumber(phone);
        setIsAuthenticated(true);
        
        console.log('✅ Token saved, checking profile...');
        
        // Check if profile exists
        let profileExists = false;
        try {
          const userProfile = await getUserProfile();
          console.log('📋 User Profile:', userProfile);
          
          // Check if profile is complete
          // Profile is complete if it has name AND profileCompleted is true
          const isProfileComplete = userProfile && 
                                   userProfile.name && 
                                   userProfile.profileCompleted === true;
          
          console.log('✅ Is Profile Complete:', isProfileComplete);
          
          if (isProfileComplete) {
            setUser(userProfile);
            setHasProfile(true);
            profileExists = true;
          } else {
            setUser(null);
            setHasProfile(false);
            profileExists = false;
          }
        } catch (error) {
          console.log('⚠️  Profile check error:', error.message);
          setHasProfile(false);
          setUser(null);
          profileExists = false;
        }
        
        console.log('🎯 Final hasProfile value:', profileExists);
        
        return { 
          success: true, 
          hasProfile: profileExists 
        };
      }
      
      return { success: false, message: 'Login failed' };
    } catch (error) {
      console.error('❌ Login error:', error);
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
      setUser(null);
      setIsAuthenticated(false);
      setHasProfile(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      console.log('🔄 Refreshed Profile:', userProfile);
      
      const isProfileComplete = userProfile && 
                               userProfile.name && 
                               userProfile.profileCompleted === true;
      
      if (isProfileComplete) {
        setUser(userProfile);
        setHasProfile(true);
      } else {
        setUser(null);
        setHasProfile(false);
      }
      
      return isProfileComplete;
    } catch (error) {
      console.error('❌ Error refreshing profile:', error);
      setHasProfile(false);
      setUser(null);
      return false;
    }
  };

  const value = {
    isLoading,
    isAuthenticated,
    hasProfile,
    token,
    phoneNumber,
    user,
    login,
    logout,
    checkAuthStatus,
    refreshProfile, // Add this for later use
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