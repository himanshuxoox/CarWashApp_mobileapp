import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SHADOWS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';

const ServiceCard = ({ icon, title, price, onPress }) => (
  <TouchableOpacity style={styles.serviceCard} onPress={onPress}>
    <LinearGradient
      colors={COLORS.gradient.primary}
      style={styles.serviceIcon}
    >
      <Icon name={icon} size={32} color={COLORS.surface} />
    </LinearGradient>
    <Text style={styles.serviceTitle}>{title}</Text>
    <Text style={styles.servicePrice}>₹{price}</Text>
    <View style={styles.serviceButton}>
      <Text style={styles.serviceButtonText}>Book Now</Text>
      <Icon name="arrow-forward" size={16} color={COLORS.primary} />
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  // Get user object along with phoneNumber
  const { user, phoneNumber, logout } = useAuth();
  const [selectedService, setSelectedService] = useState(null);

  // Extract user name with fallback
  const displayName = user?.name || phoneNumber || 'Guest';

  const services = [
    { id: 1, icon: 'local-car-wash', title: 'Basic Wash', price: 299 },
    { id: 2, icon: 'brush', title: 'Premium Wash', price: 499 },
    { id: 3, icon: 'build', title: 'Interior Clean', price: 399 },
    { id: 4, icon: 'settings', title: 'Full Service', price: 799 },
  ];

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    Alert.alert(
      'Book Service',
      `Do you want to book ${service.title} for ₹${service.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book',
          onPress: () => {
            Alert.alert('Success', 'Booking confirmed!');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={COLORS.gradient.primary} style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerGreeting}>Hello! 👋</Text>
            {/* Display user name instead of phone number */}
            <Text style={styles.headerName}>{displayName}</Text>
            {/* Optional: Show phone number in smaller text */}
            {user?.name && (
              <Text style={styles.headerPhone}>{phoneNumber}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert('Logout', 'Are you sure you want to logout?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: logout },
              ]);
            }}
          >
            <Icon name="logout" size={24} color={COLORS.surface} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Services Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                {...service}
                onPress={() => handleServiceSelect(service)}
              />
            ))}
          </View>
        </View>

        {/* Info Section */}
        <View style={[styles.section, styles.infoCard]}>
          <Icon name="info-outline" size={24} color={COLORS.info} />
          <Text style={styles.infoText}>
            Book your car wash service in just a few taps. We'll come to your
            location!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerGreeting: {
    fontSize: 16,
    color: COLORS.surface,
    marginBottom: 4,
    opacity: 0.9,
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 2,
  },
  headerPhone: {
    fontSize: 12,
    color: COLORS.surface,
    opacity: 0.7,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  serviceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  serviceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.info + '15',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    lineHeight: 20,
  },
});

export default HomeScreen;