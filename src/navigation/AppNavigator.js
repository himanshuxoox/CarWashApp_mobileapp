import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  const { isLoading, isAuthenticated, hasProfile } = useAuth();  // Add hasProfile

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Show appropriate navigator based on auth state
  const getNavigator = () => {
    if (!isAuthenticated) {
      // Not logged in -> Show AuthNavigator (Login, OTP)
      console.log('📱 Showing AuthNavigator - Not authenticated');
      return <AuthNavigator />;
    }
    
    if (isAuthenticated && !hasProfile) {
      // Logged in but no profile -> Stay in AuthNavigator (ProfileSetup)
      console.log('📱 Showing AuthNavigator - Need profile setup');
      return <AuthNavigator />;
    }
    
    // Logged in with profile -> Show MainNavigator (Home, Profile)
    console.log('📱 Showing MainNavigator - Authenticated with profile');
    return <MainNavigator />;
  };

  return (
    <NavigationContainer>
      {getNavigator()}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default AppNavigator;