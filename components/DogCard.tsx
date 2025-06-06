import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, MapPin, Star } from 'lucide-react-native';
import { theme, globalStyles } from '@/constants/Theme';
import { Database } from '@/types/supabase';

type Dog = Database['public']['Tables']['dogs']['Row'];

interface DogCardProps {
  dog: Dog;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}

const { width } = Dimensions.get('window');
const cardWidth = width > 700 ? (width / 3) - 20 : width > 500 ? (width / 2) - 16 : width - 32;

export default function DogCard({ dog, onFavoriteToggle, isFavorite = false }: DogCardProps) {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/dog/${dog.id}`);
  };
  
  const handleFavoritePress = () => {
    if (onFavoriteToggle) {
      onFavoriteToggle(dog.id);
    }
  };

  // Calculate rating from reviews (placeholder for now)
  const rating = 4.5;

  return (
    <TouchableOpacity 
      style={[styles.card, { width: cardWidth }]} 
      onPress={handlePress}
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: dog.image_urls[0] }} style={styles.image} />
        {dog.is_verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        )}
        <TouchableOpacity 
          style={styles.favoriteButton} 
          onPress={handleFavoritePress}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Heart 
            size={20} 
            color={isFavorite ? theme.colors.error[500] : 'white'} 
            fill={isFavorite ? theme.colors.error[500] : 'transparent'} 
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={globalStyles.rowSpaceBetween}>
          <Text style={styles.name}>{dog.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFB800" fill="#FFB800" />
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          </View>
        </View>
        
        <Text style={styles.breed}>{dog.breed} · {dog.size}</Text>
        
        <View style={styles.locationContainer}>
          <MapPin size={14} color={theme.colors.grey[500]} />
          <Text style={styles.location}>
            {dog.city}, {dog.state}
          </Text>
        </View>
        
        <View style={styles.personalityContainer}>
          {dog.personalities.slice(0, 2).map((personality, index) => (
            <View key={index} style={styles.personality}>
              <Text style={styles.personalityText}>{personality}</Text>
            </View>
          ))}
          {dog.personalities.length > 2 && (
            <View style={styles.personality}>
              <Text style={styles.personalityText}>+{dog.personalities.length - 2}</Text>
            </View>
          )}
        </View>
        
        <View style={globalStyles.rowSpaceBetween}>
          <Text style={styles.price}>${dog.hourly_rate}<Text style={styles.priceUnit}>/hour</Text></Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.m,
    overflow: 'hidden',
    ...theme.shadows.medium,
    margin: 8,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    top: theme.spacing.s,
    left: theme.spacing.s,
    backgroundColor: theme.colors.success[500],
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
  },
  verifiedText: {
    color: 'white',
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing.s,
    right: theme.spacing.s,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: theme.borderRadius.round,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: theme.spacing.m,
  },
  name: {
    ...theme.typography.subtitle1,
    marginBottom: 2,
  },
  breed: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
    marginBottom: theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  location: {
    ...theme.typography.caption,
    color: theme.colors.grey[500],
    marginLeft: 4,
  },
  personalityContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.s,
  },
  personality: {
    backgroundColor: theme.colors.primary[50],
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 4,
    marginRight: theme.spacing.xs,
  },
  personalityText: {
    ...theme.typography.caption,
    color: theme.colors.primary[700],
  },
  price: {
    ...theme.typography.subtitle1,
    color: theme.colors.primary[500],
  },
  priceUnit: {
    ...theme.typography.caption,
    color: theme.colors.grey[500],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...theme.typography.caption,
    marginLeft: 2,
    fontFamily: 'Inter-SemiBold',
  },
});