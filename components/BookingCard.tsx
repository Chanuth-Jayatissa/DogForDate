import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import { theme, globalStyles } from '@/constants/Theme';
import { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabase';

type Booking = Database['public']['Tables']['bookings']['Row'];
type Dog = Database['public']['Tables']['dogs']['Row'];

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter();
  const [dog, setDog] = useState<Dog | null>(null);
  
  useEffect(() => {
    fetchDog();
  }, [booking.dog_id]);

  const fetchDog = async () => {
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', booking.dog_id)
        .single();

      if (error) throw error;
      setDog(data);
    } catch (error) {
      console.error('Error fetching dog:', error);
    }
  };
  
  const handlePress = () => {
    router.push(`/booking/${booking.id}`);
  };
  
  const getStatusColor = () => {
    switch (booking.status) {
      case 'Confirmed':
        return theme.colors.success[500];
      case 'Pending':
        return theme.colors.warning[500];
      case 'Cancelled':
        return theme.colors.error[500];
      case 'Completed':
        return theme.colors.secondary[500];
      default:
        return theme.colors.grey[500];
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };
  
  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'h:mm a');
  };

  if (!dog) {
    return (
      <View style={[styles.card, styles.loadingCard]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.cardContent}>
        <Image source={{ uri: dog.image_urls[0] }} style={styles.dogImage} />
        
        <View style={styles.bookingInfo}>
          <View style={styles.header}>
            <Text style={styles.dogName}>{dog.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{booking.status}</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Calendar size={16} color={theme.colors.grey[600]} />
            <Text style={styles.infoText}>{formatDate(booking.start_time)}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Clock size={16} color={theme.colors.grey[600]} />
            <Text style={styles.infoText}>
              {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
            </Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.price}>${booking.total_amount.toFixed(2)}</Text>
            <Text style={styles.paymentStatus}>{booking.payment_status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    marginBottom: theme.spacing.m,
  },
  cardContent: {
    flexDirection: 'row',
  },
  dogImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.m,
    marginRight: theme.spacing.m,
  },
  bookingInfo: {
    flex: 1,
  },
  header: {
    ...globalStyles.rowSpaceBetween,
    marginBottom: theme.spacing.s,
  },
  dogName: {
    ...theme.typography.subtitle1,
  },
  statusBadge: {
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
  },
  statusText: {
    color: 'white',
    ...theme.typography.caption,
    fontFamily: 'Inter-SemiBold',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    ...theme.typography.body2,
    color: theme.colors.grey[700],
    marginLeft: theme.spacing.xs,
  },
  footer: {
    ...globalStyles.rowSpaceBetween,
    marginTop: theme.spacing.s,
    paddingTop: theme.spacing.s,
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey[200],
  },
  price: {
    ...theme.typography.subtitle2,
    color: theme.colors.primary[500],
  },
  paymentStatus: {
    ...theme.typography.caption,
    color: theme.colors.grey[600],
  },
  loadingCard: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  loadingText: {
    ...theme.typography.body2,
    color: theme.colors.grey[500],
  },
});