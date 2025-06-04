import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Bell, Shield, CreditCard, CircleHelp as HelpCircle, LogOut, ChevronRight, Star } from 'lucide-react-native';
import { theme, globalStyles } from '@/constants/Theme';
import Button from '@/components/Button';

// Mock user data
const mockUser = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  role: 'Renter',
  profilePicUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
  bio: 'Dog lover and outdoor enthusiast. I enjoy taking dogs on hikes and to the park!',
  location: {
    city: 'San Francisco',
    state: 'CA'
  },
  rating: 4.8,
  reviewCount: 12,
  isVerified: true
};

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress: () => void;
}

function SettingItem({ 
  icon, 
  title, 
  subtitle, 
  rightElement, 
  onPress 
}: SettingItemProps) {
  return (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingIconContainer}>{icon}</View>
      
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      
      {rightElement || <ChevronRight size={20} color={theme.colors.grey[400]} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const [datingEnabled, setDatingEnabled] = useState(false);
  const router = useRouter();
  
  const handleLogout = () => {
    // Navigate to login screen
    router.replace('/login');
  };
  
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ScrollView 
        style={globalStyles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Image 
              source={{ uri: mockUser.profilePicUrl }} 
              style={styles.profileImage} 
            />
            <View style={styles.profileText}>
              <Text style={styles.name}>{mockUser.name}</Text>
              <Text style={styles.location}>
                {mockUser.location.city}, {mockUser.location.state}
              </Text>
              
              <View style={styles.ratingContainer}>
                <Star size={16} color="#FFB800" fill="#FFB800" />
                <Text style={styles.rating}>{mockUser.rating.toFixed(1)}</Text>
                <Text style={styles.reviewCount}>({mockUser.reviewCount} reviews)</Text>
              </View>
            </View>
          </View>
          
          <Button 
            title="Edit Profile" 
            variant="outline" 
            size="small"
            onPress={() => {}}
            style={styles.editButton}
          />
        </View>
        
        <View style={styles.bioSection}>
          <Text style={styles.bioText}>{mockUser.bio}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          
          <View style={styles.settingsList}>
            <SettingItem 
              icon={<Heart size={24} color={theme.colors.primary[500]} />} 
              title="Favorites" 
              subtitle="View your favorite dogs"
              onPress={() => {}}
            />
            
            <SettingItem 
              icon={<Bell size={24} color={theme.colors.secondary[500]} />} 
              title="Notifications" 
              subtitle="Manage your notification preferences"
              onPress={() => {}}
            />
            
            <SettingItem 
              icon={<Shield size={24} color={theme.colors.success[500]} />} 
              title="Privacy & Security" 
              subtitle="Update your privacy settings"
              onPress={() => {}}
            />
            
            <SettingItem 
              icon={<CreditCard size={24} color={theme.colors.accent[500]} />} 
              title="Payment Methods" 
              subtitle="Manage your payment options"
              onPress={() => {}}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          
          <View style={styles.settingsList}>
            <SettingItem 
              icon={<HelpCircle size={24} color={theme.colors.warning[500]} />} 
              title="Dating Mode" 
              subtitle="Match with other dog lovers"
              rightElement={
                <Switch 
                  value={datingEnabled}
                  onValueChange={setDatingEnabled}
                  trackColor={{ 
                    false: theme.colors.grey[300], 
                    true: theme.colors.primary[500] 
                  }}
                  thumbColor="white"
                  ios_backgroundColor={theme.colors.grey[300]}
                />
              }
              onPress={() => setDatingEnabled(!datingEnabled)}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color={theme.colors.error[500]} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  header: {
    padding: theme.spacing.l,
    paddingBottom: theme.spacing.m,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: theme.spacing.m,
  },
  profileText: {
    flex: 1,
  },
  name: {
    ...theme.typography.h3,
    marginBottom: 2,
  },
  location: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...theme.typography.body2,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
    marginRight: 2,
  },
  reviewCount: {
    ...theme.typography.caption,
    color: theme.colors.grey[600],
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  bioSection: {
    paddingHorizontal: theme.spacing.l,
    paddingBottom: theme.spacing.l,
  },
  bioText: {
    ...theme.typography.body1,
    color: theme.colors.grey[700],
  },
  section: {
    marginBottom: theme.spacing.l,
  },
  sectionTitle: {
    ...theme.typography.subtitle1,
    paddingHorizontal: theme.spacing.l,
    marginBottom: theme.spacing.s,
  },
  settingsList: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.grey[200],
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.m,
    paddingHorizontal: theme.spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey[200],
  },
  settingIconContainer: {
    marginRight: theme.spacing.m,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...theme.typography.subtitle2,
  },
  settingSubtitle: {
    ...theme.typography.body2,
    color: theme.colors.grey[600],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.m,
    margin: theme.spacing.l,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.error[500],
  },
  logoutText: {
    ...theme.typography.button,
    color: theme.colors.error[500],
    marginLeft: theme.spacing.s,
  },
});