import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SHADOWS } from '../../constants/colors';
import locationService from '../../services/locationService';
import { createUserProfile } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';


const ProfileSetupScreen = ({ navigation }) => {
  const { phoneNumber,refreshProfile } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  
  // Location state
  const [location, setLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 28.6139, // Default: New Delhi
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check location permission on mount
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const hasPermission = await locationService.hasLocationPermission();
    
    if (!hasPermission) {
      Alert.alert(
        'Location Access',
        'This app needs access to your location to provide better service.',
        [
          {
            text: 'Enable',
            onPress: () => locationService.requestLocationPermission(),
          },
          {
            text: 'Skip',
            style: 'cancel',
          },
        ]
      );
    }
  };

  const getCurrentLocation = async () => {
    setFetchingLocation(true);
    
    try {
      const coords = await locationService.getCurrentLocation();
      
      setLocation(coords);
      setMapRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Reverse geocode to get address
      const addressData = await locationService.reverseGeocode(
        coords.latitude,
        coords.longitude
      );

      if (addressData) {
        setAddress(addressData.formattedAddress);
        
        const { addressComponents } = addressData;
        setCity(addressComponents.city);
        setState(addressComponents.state);
        setPostalCode(addressComponents.postalCode);
      }
      
      Alert.alert('Success', 'Location detected successfully! 📍');
      
    } catch (error) {
      Alert.alert(
        'Location Error',
        error.message || 'Unable to get your location. Please enter your address manually.',
        [{ text: 'OK' }]
      );
    } finally {
      setFetchingLocation(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!location) {
      Alert.alert(
        'Location Required',
        'Please use current location or tap on the map to set your location.',
        [{ text: 'OK' }]
      );
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       const profileData = {
//         name: name.trim(),
//         phoneNumber,
//         address: {
//           line1: address.trim(),
//           line2: addressLine2.trim(),
//           city: city.trim(),
//           state: state.trim(),
//           postalCode: postalCode.trim(),
//           latitude: location.latitude,
//           longitude: location.longitude,
//         },
//       };

//       await createUserProfile(profileData);

//       Alert.alert(
//         'Profile Created! 🎉',
//         'Your profile has been set up successfully.',
//         [
//           {
//             text: 'Continue',
//             onPress: () => {
//               // Navigation will be handled by AuthContext
//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Main' }],
//               });
//             },
//           },
//         ]
//       );
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to create profile. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

  // ... rest of your code

   const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const profileData = {
        name: name.trim(),
        phoneNumber,
        address: {
          line1: address.trim(),
          line2: addressLine2.trim(),
          city: city.trim(),
          state: state.trim(),
          postalCode: postalCode.trim(),
          latitude: location?.latitude,
          longitude: location?.longitude,
        },
      };

      await createUserProfile(profileData);
      
      // Refresh profile state - AppNavigator will automatically switch!
      await refreshProfile();
      
      Alert.alert(
        'Profile Created! 🎉',
        'Your profile has been set up successfully.',
        [
          {
            text: 'Continue',
            onPress: () => {
              // AppNavigator will handle the switch to MainNavigator
              console.log('✅ Profile created - AppNavigator will switch');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of code

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    
    // Update address based on new location
    try {
      const addressData = await locationService.reverseGeocode(latitude, longitude);
      if (addressData) {
        setAddress(addressData.formattedAddress);
        const { addressComponents } = addressData;
        setCity(addressComponents.city);
        setState(addressComponents.state);
        setPostalCode(addressComponents.postalCode);
      }
    } catch (error) {
      console.error('Reverse geocode error:', error);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Profile Setup?',
      'You can complete your profile later from settings. However, you will need to provide your location to book services.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Main' }],
            });
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name="person-pin-circle" size={60} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>
            Help us serve you better by providing your details
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name Input */}
          <Input
            label="Full Name *"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrors({ ...errors, name: '' });
            }}
            placeholder="Enter your full name"
            leftIcon="person"
            error={errors.name}
            autoCapitalize="words"
          />

          {/* Location Section */}
          <View style={styles.sectionHeader}>
            <Icon name="location-on" size={24} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Your Location</Text>
          </View>

          {/* Current Location Button */}
          <TouchableOpacity
            style={[
              styles.locationButton,
              fetchingLocation && styles.locationButtonDisabled,
            ]}
            onPress={getCurrentLocation}
            disabled={fetchingLocation}
          >
            {fetchingLocation ? (
              <>
                <ActivityIndicator color={COLORS.primary} size="small" />
                <Text style={styles.locationButtonText}>Getting location...</Text>
              </>
            ) : (
              <>
                <Icon name="my-location" size={20} color={COLORS.primary} />
                <Text style={styles.locationButtonText}>Use Current Location</Text>
                <Icon name="chevron-right" size={20} color={COLORS.primary} />
              </>
            )}
          </TouchableOpacity>

          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              region={mapRegion}
              onPress={handleMapPress}
              showsUserLocation
              showsMyLocationButton={false}
            >
              {location && (
                <Marker
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title="Your Location"
                  description={address || 'Tap to adjust'}
                  pinColor={COLORS.primary}
                />
              )}
            </MapView>
            
            <View style={styles.mapOverlay}>
              <View style={styles.mapHintContainer}>
                <Icon name="info" size={16} color={COLORS.info} />
                <Text style={styles.mapHint}>
                  Tap anywhere on the map to set your location
                </Text>
              </View>
            </View>
          </View>

          {/* Address Inputs */}
          <Input
            label="Address Line 1 *"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              setErrors({ ...errors, address: '' });
            }}
            placeholder="House no, Building name, Street"
            leftIcon="home"
            error={errors.address}
            multiline
            numberOfLines={2}
          />

          <Input
            label="Address Line 2 (Optional)"
            value={addressLine2}
            onChangeText={setAddressLine2}
            placeholder="Landmark, Area"
            leftIcon="location-city"
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Input
                label="City *"
                value={city}
                onChangeText={(text) => {
                  setCity(text);
                  setErrors({ ...errors, city: '' });
                }}
                placeholder="City"
                error={errors.city}
                autoCapitalize="words"
              />
            </View>
            
            <View style={styles.halfInput}>
              <Input
                label="State"
                value={state}
                onChangeText={setState}
                placeholder="State"
                autoCapitalize="words"
              />
            </View>
          </View>

          <Input
            label="Postal Code"
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            leftIcon="local-post-office"
          />

          {/* Location Info Card */}
          {location && (
            <View style={styles.infoCard}>
              <Icon name="check-circle" size={20} color={COLORS.success} />
              <Text style={styles.infoText}>
                Location set! Latitude: {location.latitude.toFixed(6)}, 
                Longitude: {location.longitude.toFixed(6)}
              </Text>
            </View>
          )}

          {/* Submit Button */}
          <Button
            title="Complete Profile"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || fetchingLocation}
            style={styles.submitButton}
            icon={<Icon name="check" size={20} color={COLORS.surface} />}
          />

          {/* Skip Button */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            disabled={loading}
          >
            <Text style={styles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: COLORS.surface,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  form: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    ...SHADOWS.small,
  },
  locationButtonDisabled: {
    opacity: 0.6,
  },
  locationButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 8,
    marginRight: 8,
  },
  mapContainer: {
    height: 280,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  mapHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapHint: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -8,
  },
  halfInput: {
    flex: 1,
    paddingHorizontal: 8,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success + '15',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.success,
    marginLeft: 8,
  },
  submitButton: {
    marginTop: 8,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
});

export default ProfileSetupScreen;