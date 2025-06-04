export type UserRole = 'Renter' | 'Owner' | 'Admin';

export interface UserPreferences {
  preferredDogSizes: string[];
  preferredDogBreeds: string[];
  preferredActivities: string[];
  maxHourlyRate: number | null;
  datingEnabled: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  profilePicUrl: string | null;
  bio: string;
  preferences: UserPreferences;
  location: {
    city: string;
    state: string;
  };
  phone: string;
  isVerified: boolean;
  createdAt: string;
}

export interface DogOwner extends User {
  role: 'Owner';
  shelterName?: string;
  dogIds: string[];
  rating: number;
  reviewCount: number;
}

export interface DogRenter extends User {
  role: 'Renter';
  favoriteIds: string[];
  bookingIds: string[];
  rating: number;
  reviewCount: number;
}