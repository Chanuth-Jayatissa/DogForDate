import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView
} from 'react-native';
import { theme, globalStyles } from '@/constants/Theme';
import { Booking, BookingStatus } from '@/types/booking';
import BookingCard from '@/components/BookingCard';

// Mock bookings data
const mockBookings: Booking[] = [
  {
    id: '1',
    dogId: '1',
    renterId: 'renter1',
    ownerId: 'owner1',
    startTime: '2025-05-20T10:00:00Z',
    endTime: '2025-05-20T12:00:00Z',
    status: 'Confirmed',
    totalAmount: 50,
    paymentStatus: 'Paid',
    notes: 'Looking forward to meeting Buddy!',
    createdAt: '2025-05-15T14:30:00Z',
    updatedAt: '2025-05-15T14:30:00Z'
  },
  {
    id: '2',
    dogId: '3',
    renterId: 'renter1',
    ownerId: 'owner3',
    startTime: '2025-05-22T14:00:00Z',
    endTime: '2025-05-22T16:00:00Z',
    status: 'Pending',
    totalAmount: 40,
    paymentStatus: 'Pending',
    notes: 'Would love to take Max to the park.',
    createdAt: '2025-05-16T09:15:00Z',
    updatedAt: '2025-05-16T09:15:00Z'
  },
  {
    id: '3',
    dogId: '2',
    renterId: 'renter1',
    ownerId: 'owner2',
    startTime: '2025-05-18T11:00:00Z',
    endTime: '2025-05-18T13:00:00Z',
    status: 'Completed',
    totalAmount: 60,
    paymentStatus: 'Paid',
    notes: 'Had a great time with Luna!',
    createdAt: '2025-05-12T10:30:00Z',
    updatedAt: '2025-05-18T14:00:00Z'
  },
  {
    id: '4',
    dogId: '5',
    renterId: 'renter1',
    ownerId: 'owner5',
    startTime: '2025-05-25T09:00:00Z',
    endTime: '2025-05-25T11:00:00Z',
    status: 'Cancelled',
    totalAmount: 56,
    paymentStatus: 'Refunded',
    notes: 'Need to reschedule.',
    createdAt: '2025-05-17T16:45:00Z',
    updatedAt: '2025-05-19T08:30:00Z'
  }
];

type FilterTab = 'all' | BookingStatus;

export default function BookingsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  
  const filteredBookings = mockBookings.filter(booking => {
    if (activeFilter === 'all') return true;
    return booking.status === activeFilter;
  });
  
  const renderFilterTab = (title: string, filter: FilterTab) => (
    <TouchableOpacity
      style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text
        style={[
          styles.filterTabText,
          activeFilter === filter && styles.filterTabTextActive
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Bookings</Text>
      </View>
      
      <View style={styles.filterTabs}>
        {renderFilterTab('All', 'all')}
        {renderFilterTab('Pending', 'Pending')}
        {renderFilterTab('Confirmed', 'Confirmed')}
        {renderFilterTab('Completed', 'Completed')}
        {renderFilterTab('Cancelled', 'Cancelled')}
      </View>
      
      <FlatList
        data={filteredBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard booking={item} />}
        contentContainerStyle={styles.bookingsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No bookings found</Text>
            <Text style={styles.emptyStateSubtitle}>
              {activeFilter === 'all'
                ? 'You haven\'t booked any dogs yet'
                : `You don't have any ${activeFilter.toLowerCase()} bookings`}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.l,
    paddingBottom: theme.spacing.m,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.m,
    flexWrap: 'wrap',
  },
  filterTab: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    marginRight: theme.spacing.s,
    marginBottom: theme.spacing.s,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.grey[100],
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary[500],
  },
  filterTabText: {
    ...theme.typography.body2,
    color: theme.colors.grey[700],
  },
  filterTabTextActive: {
    color: 'white',
    fontFamily: 'Inter-SemiBold',
  },
  bookingsList: {
    padding: theme.spacing.l,
    paddingTop: 0,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyStateTitle: {
    ...theme.typography.h4,
    color: theme.colors.grey[700],
    marginBottom: theme.spacing.s,
  },
  emptyStateSubtitle: {
    ...theme.typography.body1,
    color: theme.colors.grey[500],
    textAlign: 'center',
  },
});