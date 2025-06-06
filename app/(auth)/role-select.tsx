import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Image,
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { theme, globalStyles } from '@/constants/Theme';
import Button from '@/components/Button';
import { UserRole } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';

interface RoleCardProps {
  title: string;
  description: string;
  icon: string;
  selected: boolean;
  onSelect: () => void;
}

function RoleCard({ title, description, icon, selected, onSelect }: RoleCardProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.roleCard, 
        selected && styles.roleCardSelected
      ]} 
      onPress={onSelect}
    >
      <Image source={{ uri: icon }} style={styles.roleIcon} />
      <Text style={styles.roleTitle}>{title}</Text>
      <Text style={styles.roleDescription}>{description}</Text>
    </TouchableOpacity>
  );
}

export default function RoleSelectScreen() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { updateProfile } = useAuth();
  const router = useRouter();
  
  const handleContinue = async () => {
    if (!selectedRole) return;
    
    setLoading(true);
    
    try {
      await updateProfile({ role: selectedRole });
      // Navigate to tabs - this will be handled by the auth state change
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Role</Text>
          <Text style={styles.subtitle}>
            Select how you'd like to use Dog for Date
          </Text>
        </View>

        <View style={styles.rolesContainer}>
          <RoleCard
            title="Dog Renter"
            description="Rent dogs for walks, park visits, or a companion for your day."
            icon="https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg"
            selected={selectedRole === 'Renter'}
            onSelect={() => setSelectedRole('Renter')}
          />
          
          <RoleCard
            title="Dog Owner"
            description="List your dogs for rent and share your furry friends with others."
            icon="https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg"
            selected={selectedRole === 'Owner'}
            onSelect={() => setSelectedRole('Owner')}
          />
        </View>
        
        <Button 
          title="Continue" 
          onPress={handleContinue} 
          disabled={!selectedRole}
          loading={loading}
          style={styles.continueButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.l,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.s,
  },
  subtitle: {
    ...theme.typography.body1,
    color: theme.colors.grey[600],
    textAlign: 'center',
  },
  rolesContainer: {
    marginBottom: theme.spacing.xl,
  },
  roleCard: {
    ...globalStyles.card,
    alignItems: 'center',
    padding: theme.spacing.l,
    marginBottom: theme.spacing.l,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardSelected: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  roleIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing.m,
  },
  roleTitle: {
    ...theme.typography.h4,
    marginBottom: theme.spacing.s,
  },
  roleDescription: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
    textAlign: 'center',
  },
  continueButton: {
    marginTop: 'auto',
  },
});