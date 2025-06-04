import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Image,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Calendar, Clock, MapPin, CreditCard, MessageSquare, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import { theme, globalStyles } from '@/constants/Theme';
import Button from '@/components/Button';
import { Booking } from '@/types/booking';

// Mock data - in a real app this would come from an API
const mockBookings: Record<string, Booking> = {
  '1': {
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
};

// Mock dog data
const mockDogs: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Buddy',
    breed: 'Labrador Retriever',
    age: 3,
    imageUrl: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    ownerId: 'owner1',
    hourlyRate: 25,
  }
};

// Mock owner data
const mockOwners: Record<string, any> = {
  'owner1': {
    id: 'owner1',
    name: 'John Smith',
    location: {
      address: '123 Park Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107'
    },
    profilePicUrl: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
  }
};

export default function BookingDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  const bookingId = typeof params.id === 'string' ? params.id : '1';
  const booking = mockBookings[bookingId];
  const dog = mockDogs[booking.dogId];
  const owner = mockOwners[booking.ownerId];
  
  const handleGoBack = () => {
    router.back();
  };
  
  const handleContactOwner = () => {
    router.push('/messages');
  };
  
  const handleCancelBooking = () => {
    // In a real app, this would call an API to cancel the booking
    // For now, just go back
    router.back();
  };
  
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
  };
  
  const formatTime = (dateString: string) => {
    return format(parseISO(dateString), 'h:mm a');
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

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <ChevronLeft size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <ScrollView 
        style={globalStyles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusBanner} backgroundColor={getStatusColor()}>
          <Text style={styles.statusText}>
            {booking.status === 'Confirmed' && 'Booking Confirmed'}
            {booking.status === 'Pending' && 'Booking Pending Approval'}
            {booking.status === 'Cancelled' && 'Booking Cancelled'}
            {booking.status === 'Completed' && 'Booking Completed'}
          </Text>
        </View>
        
        <View style={styles.bookingSection}>
          <View style={styles.dogInfo}>
            <Image source={{ uri: dog.imageUrl }} style={styles.dogImage} />
            <View style={styles.dogDetails}>
              <Text style={styles.dogName}>{dog.name}</Text>
              <Text style={styles.dogBreed}>{dog.breed}, {dog.age} years</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.bookingDetailsSection}>
            <Text style={styles.sectionTitle}>Booking Details</Text>
            
            <View style={styles.detailItem}>
              <Calendar size={20} color={theme.colors.grey[700]} />
              <Text style={styles.detailText}>
                {formatDate(booking.startTime)}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Clock size={20} color={theme.colors.grey[700]} />
              <Text style={styles.detailText}>
                {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <MapPin size={20} color={theme.colors.grey[700]} />
              <Text style={styles.detailText}>
                {owner.location.address}, {owner.location.city}, {owner.location.state}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.paymentSection}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Hourly Rate</Text>
              <Text style={styles.paymentValue}>${dog.hourlyRate.toFixed(2)}/hr</Text>
            </View>
            
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Duration</Text>
              <Text style={styles.paymentValue}>2 hours</Text>
            </View>
            
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Service Fee</Text>
              <Text style={styles.paymentValue}>$5.00</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.paymentRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${booking.totalAmount.toFixed(2)}</Text>
            </View>
            
            <View style={styles.paymentStatusRow}>
              <CreditCard size={16} color={theme.colors.success[500]} />
              <Text style={styles.paymentStatusText}>
                {booking.paymentStatus === 'Paid' && 'Payment completed'}
                {booking.paymentStatus === 'Pending' && 'Payment pending'}
                {booking.paymentStatus === 'Refunded' && 'Payment refunded'}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.ownerSection}>
            <Text style={styles.sectionTitle}>Owner Information</Text>
            
            <View style={styles.ownerInfo}>
              <Image source={{ uri: owner.profilePicUrl }} style={styles.ownerImage} />
              <View style={styles.ownerDetails}>
                <Text style={styles.ownerName}>{owner.name}</Text>
                <Text style={styles.ownerLocation}>
                  {owner.location.city}, {owner.location.state}
                </Text>
              </View>
            </View>
          </View>
          
          {booking.notes && (
            <>
              <View style={styles.divider} />
              
              <View style={styles.notesSection}>
                <Text style={styles.sectionTitle}>Your Notes</Text>
                <Text style={styles.notes}>{booking.notes}</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        {booking.status === 'Confirmed' && (
          <>
            <Button
              title="Message Owner"
              variant="outline"
              onPress={handleContactOwner}
              icon={<MessageSquare size={18} color={theme.colors.primary[500]} />}
              style={styles.messageButton}
            />
            
            <Button
              title="Cancel Booking"
              variant="outline"
              onPress={handleCancelBooking}
              icon={<XCircle size={18} color={theme.colors.error[500]} />}
              style={styles.cancelButton}
              textStyle={{ color: theme.colors.error[500] }}
            />
          </>
        )}
        
        {booking.status === 'Pending' && (
          <Button
            title="Cancel Request"
            variant="outline"
            onPress={handleCancelBooking}
            icon={<XCircle size={18} color={theme.colors.error[500]} />}
            style={styles.fullWidthButton}
            textStyle={{ color: theme.colors.error[500] }}
          />
        )}
        
        {booking.status === 'Completed' && (
          <Button
            title="Book Again"
            onPress={() => router.push(`/dog/${dog.id}`)}
            icon={<CheckCircle size={18} color="white" />}
            style={styles.fullWidthButton}
          />
        )}
        
        {booking.status === 'Cancelled' && (
          <Button
            title="Make New Booking"
            onPress={() => router.push(`/dog/${dog.id}`)}
            style={styles.fullWidthButton}
          />
        )}
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
  scrollContent: {
    paddingBottom: 100, // Extra space for the footer
  },
  statusBanner: {
    padding: theme.spacing.m,
    alignItems: 'center',
  },
  statusText: {
    ...theme.typography.subtitle1,
    color: 'white',
  },
  bookingSection: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.m,
    margin: theme.spacing.m,
    ...theme.shadows.medium,
    overflow: 'hidden',
  },
  dogInfo: {
    flexDirection: 'row',
    padding: theme.spacing.m,
  },
  dogImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.m,
    marginRight: theme.spacing.m,
  },
  dogDetails: {
    justifyContent: 'center',
  },
  dogName: {
    ...theme.typography.h4,
    marginBottom: 4,
  },
  dogBreed: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.grey[200],
  },
  bookingDetailsSection: {
    padding: theme.spacing.m,
  },
  sectionTitle: {
    ...theme.typography.subtitle1,
    marginBottom: theme.spacing.s,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  detailText: {
    ...theme.typography.body1,
    marginLeft: theme.spacing.s,
  },
  paymentSection: {
    padding: theme.spacing.m,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  paymentLabel: {
    ...theme.typography.body1,
    color: theme.colors.grey[700],
  },
  paymentValue: {
    ...theme.typography.body1,
  },
  totalLabel: {
    ...theme.typography.subtitle1,
  },
  totalValue: {
    ...theme.typography.subtitle1,
    color: theme.colors.primary[500],
  },
  paymentStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.s,
  },
  paymentStatusText: {
    ...theme.typography.body2,
    color: theme.colors.success[500],
    marginLeft: theme.spacing.xs,
  },
  ownerSection: {
    padding: theme.spacing.m,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.m,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    ...theme.typography.subtitle2,
    marginBottom: 2,
  },
  ownerLocation: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
  },
  notesSection: {
    padding: theme.spacing.m,
  },
  notes: {
    ...theme.typography.body1,
    color: theme.colors.grey[700],
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: theme.colors.grey[200],
    flexDirection: 'row',
    padding: theme.spacing.m,
    paddingBottom: Platform.OS === 'ios' ? theme.spacing.l : theme.spacing.m,
  },
  messageButton: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  cancelButton: {
    flex: 1,
    marginLeft: theme.spacing.xs,
    borderColor: theme.colors.error[500],
  },
  fullWidthButton: {
    flex: 1,
  },
});