import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  SafeAreaView,
  Alert
} from 'react-native';
import { theme, globalStyles } from '@/constants/Theme';
import { useBookings } from '@/hooks/useBookings';
import BookingCard from '@/components/BookingCard';
import { Database } from '@/types/supabase';

type BookingStatus = Database['public']['Tables']['bookings']['Row']['status'];
type FilterTab = 'all' | BookingStatus;

export default function BookingsScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const { bookings, loading, error } = useBookings();
  
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);
  
  const filteredBookings = bookings.filter(booking => {
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

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...theme.typography.body1,
    color: theme.colors.grey[600],
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