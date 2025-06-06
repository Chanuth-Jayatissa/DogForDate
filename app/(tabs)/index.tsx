import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert
} from 'react-native';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import DogCard from '@/components/DogCard';
import { theme, globalStyles } from '@/constants/Theme';
import { useDogs } from '@/hooks/useDogs';
import { Database } from '@/types/supabase';

type Dog = Database['public']['Tables']['dogs']['Row'];

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
  
  const { dogs, loading, error } = useDogs();
  const { width } = Dimensions.get('window');
  const isTabletOrDesktop = width >= 768;
  
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);
  
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
  
  const filteredDogs = dogs.filter(dog => {
    // Search query filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !dog.name.toLowerCase().includes(query) &&
        !dog.breed.toLowerCase().includes(query) &&
        !dog.city.toLowerCase().includes(query)
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
    if (filters.activityLevel && filters.activityLevel.length > 0 && !filters.activityLevel.includes(dog.activity_level)) {
      return false;
    }
    
    // Price range filtering
    if (filters.minRate && dog.hourly_rate < filters.minRate) {
      return false;
    }
    if (filters.maxRate && dog.hourly_rate > filters.maxRate) {
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

  if (loading) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading dogs...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
  },
});