// src/constants/colors.js

export const COLORS = {
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  secondary: '#50C878',
  accent: '#FF6B6B',
  
  background: '#F5F7FA',
  surface: '#FFFFFF',
  
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#BDC3C7',
  
  success: '#27AE60',
  error: '#E74C3C',
  warning: '#F39C12',
  info: '#3498DB',
  
  border: '#E1E8ED',
  disabled: '#95A5A6',
  
  gradient: {
    primary: ['#4A90E2', '#357ABD'],
    secondary: ['#50C878', '#3FAF63'],
    background: ['#F5F7FA', '#E8EFF5'],
  }
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
