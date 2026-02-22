import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SHADOWS } from '../../constants/colors';
import { getAllBookings, cancelBooking } from '../../api/bookingApi';
import { BOOKING_STATUS } from '../../constants/config';

const BookingCard = ({ booking, onCancel }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case BOOKING_STATUS.PENDING:
        return COLORS.warning;
      case BOOKING_STATUS.CONFIRMED:
        return COLORS.info;
      case BOOKING_STATUS.IN_PROGRESS:
        return COLORS.primary;
      case BOOKING_STATUS.COMPLETED:
        return COLORS.success;
      case BOOKING_STATUS.CANCELLED:
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case BOOKING_STATUS.PENDING:
        return 'schedule';
      case BOOKING_STATUS.CONFIRMED:
        return 'check-circle';
      case BOOKING_STATUS.IN_PROGRESS:
        return 'autorenew';
      case BOOKING_STATUS.COMPLETED:
        return 'done-all';
      case BOOKING_STATUS.CANCELLED:
        return 'cancel';
      default:
        return 'info';
    }
  };

  return (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View>
          <Text style={styles.serviceTitle}>{booking.serviceType.replace('_', ' ')}</Text>
          <Text style={styles.bookingId}>ID: #{booking.id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) + '20' }]}>
          <Icon name={getStatusIcon(booking.status)} size={16} color={getStatusColor(booking.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
            {booking.status}
          </Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Icon name="attach-money" size={20} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>₹{booking.price}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="location-on" size={20} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>
            {booking.addressLine1}, {booking.city}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="access-time" size={20} color={COLORS.textSecondary} />
          <Text style={styles.detailText}>
            {new Date(booking.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {booking.status === BOOKING_STATUS.PENDING && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onCancel(booking.id)}
        >
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const BookingsScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch bookings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCancelBooking = (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking(bookingId);
              Alert.alert('Success', 'Booking cancelled successfully');
              fetchBookings();
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel booking');
            }
          },
        },
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading bookings...</Text>
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Icon name="event-busy" size={64} color={COLORS.textSecondary} />
        <Text style={styles.emptyTitle}>No Bookings Yet</Text>
        <Text style={styles.emptyText}>
          Book a service to see it here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <BookingCard booking={item} onCancel={handleCancelBooking} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 20,
  },
  listContent: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...SHADOWS.medium,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textTransform: 'capitalize',
  },
  bookingId: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  bookingDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: COLORS.error + '15',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.error,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default BookingsScreen;