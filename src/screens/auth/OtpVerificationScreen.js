import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants/colors';
import { APP_CONFIG } from '../../constants/config';
import { validateOtp } from '../../utils/validation';
import { resendOtp } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import OtpInput from '../../components/OtpInput';

const OtpVerificationScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const { login } = useAuth();
  
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(APP_CONFIG.OTP_RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);

  const [navigationReady, setNavigationReady] = useState(false);
  const [navigationDestination, setNavigationDestination] = useState(null);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === APP_CONFIG.OTP_LENGTH) {
      handleVerifyOtp();
    }
  }, [otp]);

// Handle navigation after successful login
  useEffect(() => {
    if (navigationReady && navigationDestination) {
      console.log('🚀 Executing navigation to:', navigationDestination);
      
      if (navigationDestination === 'Main') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      } else if (navigationDestination === 'ProfileSetup') {
        navigation.navigate('ProfileSetup');
      }
      
      // Reset navigation state
      setNavigationReady(false);
      setNavigationDestination(null);
    }
  }, [navigationReady, navigationDestination, navigation]);

const handleVerifyOtp = async () => {
  if (!validateOtp(otp)) {
    setError('Please enter a valid 6-digit OTP');
    return;
  }

  setError('');
  setLoading(true);

  try {
    const result = await login(phoneNumber, otp);
    
    console.log('🎯 Login Result:', result);
    console.log('🎯 hasProfile:', result.hasProfile);
    
    if (result.success) {
      setLoading(false);
      
      // Navigate based on profile status
      if (result.hasProfile === true) {
        console.log('✅ Has profile - AppNavigator will show MainNavigator');
        // AppNavigator will automatically switch to MainNavigator
        // No manual navigation needed!
      } else {
        console.log('✅ No profile - Navigating to ProfileSetup');
        // Navigate to ProfileSetup (still in AuthNavigator)
        navigation.navigate('ProfileSetup');
      }
    } else {
      setError(result.message || 'Invalid OTP. Please try again.');
      setOtp('');
      setLoading(false);
    }
  } catch (err) {
    console.error('❌ Verify error:', err);
    setError(err.message || 'Verification failed. Please try again.');
    setOtp('');
    setLoading(false);
  }
};
  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      const response = await resendOtp(phoneNumber);
      
      if (response.success) {
        Alert.alert('OTP Resent', 'A new OTP has been sent to your phone.');
        setResendTimer(APP_CONFIG.OTP_RESEND_TIMEOUT);
        setCanResend(false);
        setOtp('');
        setError('');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  const formatPhoneNumber = (phone) => {
    return `${APP_CONFIG.COUNTRY_CODE} ${phone.slice(0, 5)} ${phone.slice(5)}`;
  };

  return (
    <LinearGradient colors={COLORS.gradient.background} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon name="lock" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{'\n'}
              <Text style={styles.phoneNumber}>{formatPhoneNumber(phoneNumber)}</Text>
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <OtpInput
              value={otp}
              onChangeText={setOtp}
              error={error}
            />
            
            {error ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </View>

          {/* Verify Button */}
          <Button
            title="Verify OTP"
            onPress={handleVerifyOtp}
            loading={loading}
            disabled={otp.length !== APP_CONFIG.OTP_LENGTH || loading}
            style={styles.button}
          />

          <Button
            title="TEST - Go to Profile"
            onPress={() => {
            console.log('🧪 Manual navigation test');
             navigation.navigate('ProfileSetup');
               }}
            />

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            {canResend ? (
              <TouchableOpacity onPress={handleResendOtp}>
                <Text style={styles.resendLink}>Resend OTP</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>
                Resend in {resendTimer}s
              </Text>
            )}
          </View>

          {/* Info */}
          <Text style={styles.infoText}>
            OTP is valid for 5 minutes. You have 3 attempts.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  phoneNumber: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  otpContainer: {
    marginBottom: 32,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginLeft: 6,
  },
  button: {
    marginBottom: 24,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginRight: 8,
  },
  resendLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default OtpVerificationScreen;