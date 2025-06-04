import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions
} from 'react-native';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import DogCard from '@/components/DogCard';
import { theme, globalStyles } from '@/constants/Theme';
import { Dog } from '@/types/dog';

// Mock data for dogs
const mockDogs: Dog[] = [
  {
    id: '1',
    name: 'Buddy',
    breed: 'Labrador Retriever',
    size: 'Large',
    age: 3,
    personalities: ['Friendly', 'Energetic', 'Playful'],
    activityLevel: 'High',
    description: 'Buddy is a friendly Labrador who loves to play fetch and go for long walks.',
    imageUrls: ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'],
    ownerId: 'owner1',
    ownerType: 'Individual',
    hourlyRate: 25,
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'],
    availableTimeStart: '09:00',
    availableTimeEnd: '17:00',
    location: {
      city: 'San Francisco',
      state: 'CA'
    },
    rating: 4.8,
    reviewCount: 24,
    isVerified: true
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'French Bulldog',
    size: 'Small',
    age: 2,
    personalities: ['Calm', 'Affectionate', 'Shy'],
    activityLevel: 'Low',
    description: 'Luna is a sweet French Bulldog who enjoys cuddles and short walks.',
    imageUrls: ['https://images.pexels.com/photos/4587971/pexels-photo-4587971.jpeg'],
    ownerId: 'owner2',
    ownerType: 'Individual',
    hourlyRate: 30,
    availableDays: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
    availableTimeStart: '10:00',
    availableTimeEnd: '16:00',
    location: {
      city: 'Los Angeles',
      state: 'CA'
    },
    rating: 4.6,
    reviewCount: 15,
    isVerified: true
  },
  {
    id: '3',
    name: 'Max',
    breed: 'German Shepherd',
    size: 'Large',
    age: 4,
    personalities: ['Protective', 'Energetic', 'Social'],
    activityLevel: 'High',
    description: 'Max is a well-trained German Shepherd who loves to run and play.',
    imageUrls: ['https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg'],
    ownerId: 'owner3',
    ownerType: 'Shelter',
    hourlyRate: 20,
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimeStart: '08:00',
    availableTimeEnd: '18:00',
    location: {
      city: 'New York',
      state: 'NY'
    },
    rating: 4.9,
    reviewCount: 32,
    isVerified: true
  },
  {
    id: '4',
    name: 'Daisy',
    breed: 'Beagle',
    size: 'Medium',
    age: 2,
    personalities: ['Playful', 'Energetic', 'Friendly'],
    activityLevel: 'Medium',
    description: 'Daisy is a curious Beagle who loves to explore and play with toys.',
    imageUrls: ['https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg'],
    ownerId: 'owner4',
    ownerType: 'Individual',
    hourlyRate: 22,
    availableDays: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
    availableTimeStart: '10:00',
    availableTimeEnd: '16:00',
    location: {
      city: 'Chicago',
      state: 'IL'
    },
    rating: 4.5,
    reviewCount: 18,
    isVerified: false
  },
  {
    id: '5',
    name: 'Charlie',
    breed: 'Golden Retriever',
    size: 'Large',
    age: 5,
    personalities: ['Calm', 'Friendly', 'Affectionate'],
    activityLevel: 'Medium',
    description: 'Charlie is a gentle Golden Retriever who loves people and other dogs.',
    imageUrls: ['https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg'],
    ownerId: 'owner5',
    ownerType: 'Individual',
    hourlyRate: 28,
    availableDays: ['Monday', 'Tuesday', 'Saturday', 'Sunday'],
    availableTimeStart: '09:00',
    availableTimeEnd: '17:00',
    location: {
      city: 'Seattle',
      state: 'WA'
    },
    rating: 4.7,
    reviewCount: 29,
    isVerified: true
  },
  {
    id: '6',
    name: 'Bella',
    breed: 'Poodle',
    size: 'Medium',
    age: 3,
    personalities: ['Social', 'Playful', 'Affectionate'],
    activityLevel: 'Medium',
    description: 'Bella is a smart Poodle who loves to learn tricks and play.',
    imageUrls: ['https://images.pexels.com/photos/5731812/pexels-photo-5731812.jpeg'],
    ownerId: 'owner6',
    ownerType: 'Shelter',
    hourlyRate: 24,
    availableDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableTimeStart: '10:00',
    availableTimeEnd: '15:00',
    location: {
      city: 'Boston',
      state: 'MA'
    },
    rating: 4.4,
    reviewCount: 12,
    isVerified: false
  }
];

// Filter options
type FilterOptions = {
  size?: string[];
  personality?: string[];
  activityLevel?: string[];
  minRate?: number;
  maxRate?: number;
};

export default function DiscoverScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const { width } = Dimensions.get('window');
  const isTabletOrDesktop = width >= 768;
  
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };
  
  const toggleFilter = (type: keyof FilterOptions, value: string) => {
    setFilters(prev => {
      const currentTypeFilters = prev[type] as string[] || [];
      if (currentTypeFilters.includes(value)) {
        return {
          ...prev,
          [type]: currentTypeFilters.filter(v => v !== value)
        };
      } else {
        return {
          ...prev,
          [type]: [...currentTypeFilters, value]
        };
      }
    });
  };
  
  const clearFilters = () => {
    setFilters({});
  };
  
  const filteredDogs = mockDogs.filter(dog => {
    // Search query filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !dog.name.toLowerCase().includes(query) &&
        !dog.breed.toLowerCase().includes(query) &&
        !dog.location.city.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    
    // Size filtering
    if (filters.size && filters.size.length > 0 && !filters.size.includes(dog.size)) {
      return false;
    }
    
    // Personality filtering
    if (filters.personality && filters.personality.length > 0) {
      if (!dog.personalities.some(p => filters.personality?.includes(p))) {
        return false;
      }
    }
    
    // Activity level filtering
    if (filters.activityLevel && filters.activityLevel.length > 0 && !filters.activityLevel.includes(dog.activityLevel)) {
      return false;
    }
    
    // Price range filtering
    if (filters.minRate && dog.hourlyRate < filters.minRate) {
      return false;
    }
    if (filters.maxRate && dog.hourlyRate > filters.maxRate) {
      return false;
    }
    
    return true;
  });

  const renderFilterChip = (type: string, value: string, active: boolean) => (
    <TouchableOpacity 
      style={[styles.filterChip, active && styles.filterChipActive]}
      onPress={() => toggleFilter(type as keyof FilterOptions, value)}
    >
      <Text 
        style={[styles.filterChipText, active && styles.filterChipTextActive]}
      >
        {value}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Dogs</Text>
        <Text style={styles.subtitle}>Find the perfect companion for your day</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color={theme.colors.grey[500]} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, breed, or location"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={theme.colors.grey[500]} />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal 
            size={20} 
            color={showFilters ? theme.colors.primary[500] : theme.colors.grey[700]} 
          />
        </TouchableOpacity>
      </View>
      
      {showFilters && (
        <View style={styles.filtersSection}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContent}
          >
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Size</Text>
              <View style={styles.filterChips}>
                {renderFilterChip('size', 'Small', (filters.size || []).includes('Small'))}
                {renderFilterChip('size', 'Medium', (filters.size || []).includes('Medium'))}
                {renderFilterChip('size', 'Large', (filters.size || []).includes('Large'))}
              </View>
            </View>
            
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Personality</Text>
              <View style={styles.filterChips}>
                {renderFilterChip('personality', 'Friendly', (filters.personality || []).includes('Friendly'))}
                {renderFilterChip('personality', 'Calm', (filters.personality || []).includes('Calm'))}
                {renderFilterChip('personality', 'Energetic', (filters.personality || []).includes('Energetic'))}
                {renderFilterChip('personality', 'Playful', (filters.personality || []).includes('Playful'))}
              </View>
            </View>
            
            <View style={styles.filterGroup}>
              <Text style={styles.filterGroupTitle}>Activity Level</Text>
              <View style={styles.filterChips}>
                {renderFilterChip('activityLevel', 'Low', (filters.activityLevel || []).includes('Low'))}
                {renderFilterChip('activityLevel', 'Medium', (filters.activityLevel || []).includes('Medium'))}
                {renderFilterChip('activityLevel', 'High', (filters.activityLevel || []).includes('High'))}
              </View>
            </View>
          </ScrollView>
        </View>
      )}
      
      <FlatList
        data={filteredDogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DogCard 
            dog={item} 
            onFavoriteToggle={toggleFavorite}
            isFavorite={favorites.includes(item.id)}
          />
        )}
        numColumns={isTabletOrDesktop ? (width >= 1024 ? 3 : 2) : 1}
        contentContainerStyle={styles.dogsGrid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No dogs found</Text>
            <Text style={styles.emptyStateSubtitle}>Try adjusting your filters</Text>
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
  subtitle: {
    ...theme.typography.body1,
    color: theme.colors.grey[600],
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.m,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.grey[100],
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    marginRight: theme.spacing.s,
  },
  searchInput: {
    flex: 1,
    height: 46,
    paddingHorizontal: theme.spacing.s,
    ...theme.typography.body1,
  },
  filterButton: {
    width: 46,
    height: 46,
    backgroundColor: theme.colors.grey[100],
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersSection: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.m,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  filterTitle: {
    ...theme.typography.subtitle1,
  },
  clearText: {
    ...theme.typography.body2,
    color: theme.colors.primary[500],
  },
  filtersScrollContent: {
    paddingRight: theme.spacing.l,
  },
  filterGroup: {
    marginRight: theme.spacing.l,
  },
  filterGroupTitle: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
    marginBottom: theme.spacing.xs,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    backgroundColor: theme.colors.grey[100],
    borderRadius: theme.borderRadius.round,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 6,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary[500],
  },
  filterChipText: {
    ...theme.typography.caption,
    color: theme.colors.grey[700],
  },
  filterChipTextActive: {
    color: 'white',
  },
  dogsGrid: {
    padding: theme.spacing.s,
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
  },
});