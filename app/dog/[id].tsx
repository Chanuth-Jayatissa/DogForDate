import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  Star,
  User,
  DollarSign,
  PawPrint
} from 'lucide-react-native';
import { theme, globalStyles } from '@/constants/Theme';
import Button from '@/components/Button';
import { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

type Dog = Database['public']['Tables']['dogs']['Row'];
type UserProfile = Database['public']['Tables']['users']['Row'];

export default function DogDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [dog, setDog] = useState<Dog | null>(null);
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  
  const dogId = typeof params.id === 'string' ? params.id : null;

  useEffect(() => {
    if (dogId) {
      fetchDogDetails();
    }
  }, [dogId]);

  const fetchDogDetails = async () => {
    if (!dogId) return;

    try {
      // Fetch dog details
      const { data: dogData, error: dogError } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', dogId)
        .single();

      if (dogError) throw dogError;
      setDog(dogData);

      // Fetch owner details
      const { data: ownerData, error: ownerError } = await supabase
        .from('users')
        .select('*')
        .eq('id', dogData.owner_id)
        .single();

      if (ownerError) throw ownerError;
      setOwner(ownerData);

      // Fetch reviews and calculate rating
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewed_id', dogId)
        .eq('reviewed_type', 'Dog');

      if (!reviewsError && reviewsData) {
        const avgRating = reviewsData.length > 0 
          ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / reviewsData.length
          : 0;
        setRating(avgRating);
        setReviewCount(reviewsData.length);
      }

    } catch (error: any) {
      Alert.alert('Error', 'Failed to load dog details');
      router.back();
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorites functionality with Supabase
  };
  
  const handleBook = () => {
    if (!dog) return;
    router.push(`/booking/new?dogId=${dog.id}`);
  };
  
  const handleContactOwner = async () => {
    if (!dog || !owner || !user) return;

    try {
      // Check if conversation already exists
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${owner.id}),and(user1_id.eq.${owner.id},user2_id.eq.${user.id})`)
        .single();

      let conversationId = existingConversation?.id;

      if (!conversationId) {
        // Create new conversation
        const { data: newConversation, error } = await supabase
          .from('conversations')
          .insert({
            user1_id: user.id,
            user2_id: owner.id,
          })
          .select('id')
          .single();

        if (error) throw error;
        conversationId = newConversation.id;
      }

      router.push(`/messages/${conversationId}`);
    } catch (error: any) {
      Alert.alert('Error', 'Failed to start conversation');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!dog || !owner) {
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
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Dog not found</Text>
          <Button 
            title="Go Back" 
            onPress={() => router.back()} 
            style={styles.notFoundButton}
          />
        </View>
      </SafeAreaView>
    );
  }

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
        
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={toggleFavorite}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Heart 
            size={24} 
            color={isFavorite ? theme.colors.error[500] : theme.colors.text} 
            fill={isFavorite ? theme.colors.error[500] : 'transparent'} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={globalStyles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageSection}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            style={styles.imageCarousel}
          >
            {dog.image_urls.map((url, index) => (
              <Image 
                key={index}
                source={{ uri: url }} 
                style={styles.dogImage} 
              />
            ))}
          </ScrollView>
          
          <View style={styles.imageDots}>
            {dog.image_urls.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  index === 0 && styles.activeDot
                ]} 
              />
            ))}
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <View style={globalStyles.rowSpaceBetween}>
            <Text style={styles.dogName}>{dog.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFB800" fill="#FFB800" />
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({reviewCount})</Text>
            </View>
          </View>
          
          <View style={styles.breedAgeRow}>
            <Text style={styles.breedAge}>
              {dog.breed} • {dog.age} years old • {dog.size}
            </Text>
          </View>
          
          <View style={styles.locationRow}>
            <MapPin size={16} color={theme.colors.grey[500]} />
            <Text style={styles.location}>
              {dog.city}, {dog.state}
            </Text>
          </View>
          
          <View style={styles.personalitySection}>
            {dog.personalities.map((personality, index) => (
              <View key={index} style={styles.personalityTag}>
                <Text style={styles.personalityText}>{personality}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <DollarSign size={20} color={theme.colors.primary[500]} />
              <Text style={styles.price}>
                ${dog.hourly_rate}<Text style={styles.priceUnit}>/hour</Text>
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>About {dog.name}</Text>
            <Text style={styles.description}>{dog.description}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.availabilitySection}>
            <Text style={styles.sectionTitle}>Availability</Text>
            
            <View style={styles.availabilityItem}>
              <Calendar size={20} color={theme.colors.grey[700]} />
              <Text style={styles.availabilityText}>
                Available on: {dog.available_days.join(', ')}
              </Text>
            </View>
            
            <View style={styles.availabilityItem}>
              <Clock size={20} color={theme.colors.grey[700]} />
              <Text style={styles.availabilityText}>
                {dog.available_time_start} - {dog.available_time_end}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.ownerSection}>
            <Text style={styles.sectionTitle}>Meet the Owner</Text>
            
            <View style={styles.ownerCard}>
              <Image 
                source={{ uri: owner.profile_pic_url || 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg' }} 
                style={styles.ownerImage} 
              />
              
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>{owner.name || 'Anonymous'}</Text>
                
                <View style={styles.ownerRatingRow}>
                  <Star size={14} color="#FFB800" fill="#FFB800" />
                  <Text style={styles.ownerRating}>
                    4.9 (42)
                  </Text>
                </View>
                
                {owner.is_verified && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>Verified Owner</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Contact Owner"
          variant="outline"
          onPress={handleContactOwner}
          style={styles.contactButton}
        />
        
        <Button
          title="Book Now"
          onPress={handleBook}
          icon={<PawPrint size={20} color="white" />}
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: Platform.OS === 'android' ? theme.spacing.l : 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: theme.spacing.m,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageSection: {
    position: 'relative',
  },
  imageCarousel: {
    width: '100%',
    height: 300,
  },
  dogImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  imageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: 4,
  },
  activeDot: {
    backgroundColor: 'white',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  infoSection: {
    padding: theme.spacing.l,
  },
  dogName: {
    ...theme.typography.h2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...theme.typography.subtitle2,
    marginLeft: 4,
    marginRight: 2,
  },
  reviewCount: {
    ...theme.typography.caption,
    color: theme.colors.grey[600],
  },
  breedAgeRow: {
    marginTop: 4,
    marginBottom: 8,
  },
  breedAge: {
    ...theme.typography.body1,
    color: theme.colors.grey[700],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  location: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
    marginLeft: 6,
  },
  personalitySection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.m,
  },
  personalityTag: {
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 6,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  personalityText: {
    ...theme.typography.caption,
    color: theme.colors.primary[700],
  },
  priceSection: {
    marginBottom: theme.spacing.m,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    ...theme.typography.h3,
    color: theme.colors.primary[500],
    marginLeft: 6,
  },
  priceUnit: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.grey[200],
    marginVertical: theme.spacing.m,
  },
  descriptionSection: {
    marginBottom: theme.spacing.m,
  },
  sectionTitle: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.s,
  },
  description: {
    ...theme.typography.body1,
    color: theme.colors.grey[700],
    lineHeight: 24,
  },
  availabilitySection: {
    marginBottom: theme.spacing.m,
  },
  availabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  availabilityText: {
    ...theme.typography.body1,
    color: theme.colors.grey[700],
    marginLeft: theme.spacing.s,
  },
  ownerSection: {
    marginBottom: theme.spacing.m,
  },
  ownerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.grey[50],
    borderRadius: theme.borderRadius.m,
    padding: theme.spacing.m,
  },
  ownerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.m,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    ...theme.typography.subtitle1,
    marginBottom: 4,
  },
  ownerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ownerRating: {
    ...theme.typography.body2,
    marginLeft: 4,
  },
  verifiedBadge: {
    backgroundColor: theme.colors.success[500],
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  verifiedText: {
    ...theme.typography.caption,
    color: 'white',
    fontFamily: 'Inter-SemiBold',
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
  contactButton: {
    flex: 1,
    marginRight: theme.spacing.s,
  },
  bookButton: {
    flex: 1,
    marginLeft: theme.spacing.s,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.l,
  },
  loadingText: {
    ...theme.typography.body1,
    color: theme.colors.grey[600],
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.l,
  },
  notFoundText: {
    ...theme.typography.h3,
    marginBottom: theme.spacing.m,
  },
  notFoundButton: {
    width: 200,
  },
});