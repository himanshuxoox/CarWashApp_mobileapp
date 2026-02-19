import * as Location from 'expo-location';
import { Alert } from 'react-native';

class LocationService {
  
  /**
   * Request location permissions (Expo)
   */
  async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use this feature. Please enable it in your device settings.',
          [{ text: 'OK' }]
        );
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  }

  /**
   * Check if location permission is granted
   */
  async hasLocationPermission() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Check permission error:', error);
      return false;
    }
  }

  /**
   * Get current location (Expo)
   */
  async getCurrentLocation() {
    try {
      const hasPermission = await this.hasLocationPermission();
      
      if (!hasPermission) {
        const granted = await this.requestLocationPermission();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };
    } catch (error) {
      console.error('Get location error:', error);
      throw error;
    }
  }

  /**
   * Reverse geocode - Get address from coordinates (Expo)
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const address = addresses[0];
        
        return {
          formattedAddress: this._formatAddress(address),
          addressComponents: {
            street: address.street || '',
            city: address.city || address.subregion || '',
            state: address.region || '',
            country: address.country || '',
            postalCode: address.postalCode || '',
          },
        };
      }

      return null;
    } catch (error) {
      console.error('Reverse geocode error:', error);
      return null;
    }
  }

  /**
   * Forward geocode - Get coordinates from address
   */
  async geocode(address) {
    try {
      const locations = await Location.geocodeAsync(address);

      if (locations && locations.length > 0) {
        return {
          latitude: locations[0].latitude,
          longitude: locations[0].longitude,
        };
      }

      return null;
    } catch (error) {
      console.error('Geocode error:', error);
      return null;
    }
  }

  /**
   * Format address components into readable string
   */
  _formatAddress(address) {
    const parts = [];
    
    if (address.street) parts.push(address.street);
    if (address.streetNumber) parts.push(address.streetNumber);
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    if (address.postalCode) parts.push(address.postalCode);
    if (address.country) parts.push(address.country);
    
    return parts.filter(Boolean).join(', ');
  }

  /**
   * Watch location changes (real-time tracking)
   */
  async watchLocation(callback) {
    try {
      const hasPermission = await this.hasLocationPermission();
      
      if (!hasPermission) {
        const granted = await this.requestLocationPermission();
        if (!granted) {
          throw new Error('Location permission denied');
        }
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Update every 10 seconds
          distanceInterval: 50, // Update every 50 meters
        },
        (location) => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          });
        }
      );

      return subscription; // Call subscription.remove() to stop watching
    } catch (error) {
      console.error('Watch location error:', error);
      throw error;
    }
  }
}

export default new LocationService();