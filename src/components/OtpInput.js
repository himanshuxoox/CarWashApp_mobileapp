// src/components/OtpInput.js

import React, { useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS, SHADOWS } from '../constants/colors';
import { APP_CONFIG } from '../constants/config';

const OtpInput = ({ value, onChangeText, error }) => {
  const inputRefs = useRef([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) {
      // Shake animation on error
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [error]);

  const handleChangeText = (text, index) => {
    // Only allow digits
    const digit = text.replace(/[^0-9]/g, '');
    
    if (digit.length > 1) {
      // Handle paste
      const otpArray = digit.slice(0, APP_CONFIG.OTP_LENGTH).split('');
      const newOtp = value.split('');
      
      otpArray.forEach((char, idx) => {
        if (index + idx < APP_CONFIG.OTP_LENGTH) {
          newOtp[index + idx] = char;
        }
      });
      
      onChangeText(newOtp.join(''));
      
      // Focus on next empty input or last input
      const nextEmptyIndex = newOtp.findIndex(char => !char);
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : APP_CONFIG.OTP_LENGTH - 1;
      inputRefs.current[focusIndex]?.focus();
    } else {
      // Handle single digit
      const newOtp = value.split('');
      newOtp[index] = digit;
      onChangeText(newOtp.join(''));
      
      // Auto-focus next input
      if (digit && index < APP_CONFIG.OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Focus previous input on backspace if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current digit
        const newOtp = value.split('');
        newOtp[index] = '';
        onChangeText(newOtp.join(''));
      }
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateX: shakeAnimation }] },
      ]}
    >
      {Array.from({ length: APP_CONFIG.OTP_LENGTH }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.inputContainer,
            value[index] && styles.inputContainerFilled,
            error && styles.inputContainerError,
            SHADOWS.small,
          ]}
        >
          <TextInput
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.input,
              value[index] && styles.inputFilled,
              error && styles.inputError,
            ]}
            keyboardType="number-pad"
            maxLength={index === 0 ? APP_CONFIG.OTP_LENGTH : 1}
            value={value[index] || ''}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectTextOnFocus
          />
        </View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputContainer: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: 4,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainerFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
  },
  inputContainerError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.error + '10',
  },
  input: {
    width: '100%',
    height: '100%',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS.text,
  },
  inputFilled: {
    color: COLORS.primary,
  },
  inputError: {
    color: COLORS.error,
  },
});

export default OtpInput;
