import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
//import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SHADOWS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';

const ProfileOption = ({ icon, title, subtitle, onPress, color = COLORS.primary }) => (
  <TouchableOpacity style={styles.optionCard} onPress={onPress}>
    <View style={[styles.optionIcon, { backgroundColor: color + '15' }]}>
      <Icon name={icon} size={24} color={color} />
    </View>
    <View style={styles.optionContent}>
      <Text style={styles.optionTitle}>{title}</Text>
      {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
    </View>
    <Icon name="chevron-right" size={24} color={COLORS.textSecondary} />
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { phoneNumber, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout',
          style: 'destructive',
          onPress: logout 
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={COLORS.gradient.primary} style={styles.header}>
        <View style={styles.avatarContainer}>
          <Icon name="person" size={48} color={COLORS.surface} />
        </View>
        <Text style={styles.headerName}>User</Text>
        <Text style={styles.headerPhone}>{phoneNumber}</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <ProfileOption
            icon="person-outline"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          <ProfileOption
            icon="history"
            title="Booking History"
            subtitle="View your past bookings"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          <ProfileOption
            icon="payment"
            title="Payment Methods"
            subtitle="Manage your payment options"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <ProfileOption
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage notification preferences"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
          <ProfileOption
            icon="language"
            title="Language"
            subtitle="English"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <ProfileOption
            icon="help-outline"
            title="Help & Support"
            subtitle="Get help with your bookings"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
            color={COLORS.info}
          />
          <ProfileOption
            icon="description"
            title="Terms & Conditions"
            subtitle="Read our terms of service"
            onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon')}
            color={COLORS.info}
          />
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            icon={<Icon name="logout" size={20} color={COLORS.error} />}
            textStyle={{ color: COLORS.error }}
            style={{ borderColor: COLORS.error }}
          />
        </View>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingTop: 60,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: COLORS.surface,
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.surface,
    marginBottom: 4,
  },
  headerPhone: {
    fontSize: 16,
    color: COLORS.surface,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...SHADOWS.small,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  versionText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingBottom: 32,
  },
});

export default ProfileScreen;