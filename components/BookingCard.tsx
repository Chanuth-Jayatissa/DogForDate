import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Clock } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import { theme, globalStyles } from '@/constants/Theme';
import { Booking } from '@/types/booking';

// Mock data for now - in a real app, would fetch dog info via dogId
const mockDogInfo = {
  name: 'Max',
  imageUrl: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
};

interface BookingCardProps {
  booking: Booking;
}

export default function BookingCard({ booking }: BookingCardProps) {
  const router = useRouter();
  
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

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.8}>
      <View style={styles.header}>
        <Text style={styles.dogName}>{mockDogInfo.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{booking.status}</Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <Calendar size={16} color={theme.colors.grey[600]} />
        <Text style={styles.infoText}>{formatDate(booking.startTime)}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Clock size={16} color={theme.colors.grey[600]} />
        <Text style={styles.infoText}>
          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.price}>${booking.totalAmount.toFixed(2)}</Text>
        <Text style={styles.paymentStatus}>{booking.paymentStatus}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    ...globalStyles.card,
    marginBottom: theme.spacing.m,
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
});