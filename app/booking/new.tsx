import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Clock, DollarSign } from 'lucide-react-native';
import { theme, globalStyles } from '@/constants/Theme';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Dog = Database['public']['Tables']['dogs']['Row'];

export default function NewBookingScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { createBooking } = useBookings();
  
  const [dog, setDog] = useState<Dog | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState<string>('10:00');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('12:00');
  const [loading, setLoading] = useState(false);
  const [fetchingDog, setFetchingDog] = useState(true);

  const dogId = typeof params.dogId === 'string' ? params.dogId : null;

  useEffect(() => {
    if (dogId) {
      fetchDog();
    }
  }, [dogId]);

  const fetchDog = async () => {
    if (!dogId) return;

    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', dogId)
        .single();

      if (error) throw error;
      setDog(data);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load dog information');
      router.back();
    } finally {
      setFetchingDog(false);
    }
  };

  const calculateTotal = () => {
    if (!dog) return 0;
    
    const start = new Date(`2000-01-01T${selectedStartTime}:00`);
    const end = new Date(`2000-01-01T${selectedEndTime}:00`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    
    const subtotal = hours * dog.hourly_rate;
    const serviceFee = 5; // Fixed service fee
    
    return subtotal + serviceFee;
  };

  const handleBooking = async () => {
    if (!dog || !user) return;

    setLoading(true);

    try {
      const startDateTime = new Date(selectedDate);
      const [startHour, startMinute] = selectedStartTime.split(':');
      startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

      const endDateTime = new Date(selectedDate);
      const [endHour, endMinute] = selectedEndTime.split(':');
      endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

      await createBooking({
        dog_id: dog.id,
        renter_id: user.id,
        owner_id: dog.owner_id,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        total_amount: calculateTotal(),
        notes: `Booking for ${dog.name}`,
      });

      Alert.alert(
        'Booking Created',
        'Your booking request has been sent to the owner!',
        [
          {
            text: 'OK',
            onPress: () => router.push('/(tabs)/bookings'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingDog) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!dog) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Dog not found</Text>
          <Button title="Go Back" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book {dog.name}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity style={styles.dateSelector}>
            <Calendar size={20} color={theme.colors.primary[500]} />
            <Text style={styles.dateSelectorText}>
              {selectedDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          
          <View style={styles.timeRow}>
            <View style={styles.timeSelector}>
              <Text style={styles.timeLabel}>Start Time</Text>
              <TouchableOpacity style={styles.timeButton}>
                <Clock size={16} color={theme.colors.grey[600]} />
                <Text style={styles.timeButtonText}>{selectedStartTime}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.timeSelector}>
              <Text style={styles.timeLabel}>End Time</Text>
              <TouchableOpacity style={styles.timeButton}>
                <Clock size={16} color={theme.colors.grey[600]} />
                <Text style={styles.timeButtonText}>{selectedEndTime}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Dog</Text>
              <Text style={styles.summaryValue}>{dog.name}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>{selectedDate.toLocaleDateString()}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time</Text>
              <Text style={styles.summaryValue}>{selectedStartTime} - {selectedEndTime}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Hourly Rate</Text>
              <Text style={styles.summaryValue}>${dog.hourly_rate}/hour</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Text style={styles.summaryValue}>$5.00</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={`Book for $${calculateTotal().toFixed(2)}`}
          onPress={handleBooking}
          loading={loading}
          icon={<DollarSign size={20} color="white" />}
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[200],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...theme.typography.h4,
  },
  content: {
    flex: 1,
    padding: theme.spacing.l,
  },
  section: {
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    ...theme.typography.subtitle1,
    marginBottom: theme.spacing.m,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.m,
    ...theme.shadows.small,
  },
  dateSelectorText: {
    ...theme.typography.body1,
    marginLeft: theme.spacing.s,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeSelector: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  timeLabel: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
    marginBottom: theme.spacing.xs,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.m,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.m,
    ...theme.shadows.small,
  },
  timeButtonText: {
    ...theme.typography.body1,
    marginLeft: theme.spacing.s,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
    ...theme.shadows.small,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.s,
  },
  summaryLabel: {
    ...theme.typography.body1,
    color: theme.colors.grey[600],
  },
  summaryValue: {
    ...theme.typography.body1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.grey[200],
    marginVertical: theme.spacing.s,
  },
  totalLabel: {
    ...theme.typography.subtitle1,
  },
  totalValue: {
    ...theme.typography.subtitle1,
    color: theme.colors.primary[500],
  },
  footer: {
    padding: theme.spacing.m,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.l : theme.spacing.m,
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey[200],
  },
  bookButton: {
    width: '100%',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.l,
  },
  errorText: {
    ...theme.typography.h4,
    color: theme.colors.error[500],
    marginBottom: theme.spacing.m,
  },
});