export type DogBreed = 
  | 'Labrador Retriever'
  | 'German Shepherd'
  | 'Golden Retriever'
  | 'French Bulldog'
  | 'Beagle'
  | 'Poodle'
  | 'Siberian Husky'
  | 'Dachshund'
  | 'Corgi'
  | 'Australian Shepherd'
  | 'Border Collie'
  | 'Shih Tzu'
  | 'Boxer'
  | 'Great Dane'
  | 'Chihuahua'
  | 'Pomeranian'
  | 'Mixed Breed'
  | 'Other';

export type DogSize = 'Small' | 'Medium' | 'Large';

export type DogPersonality = 
  | 'Playful' 
  | 'Calm' 
  | 'Energetic' 
  | 'Friendly' 
  | 'Shy' 
  | 'Independent'
  | 'Affectionate'
  | 'Protective'
  | 'Social';

export type DogActivityLevel = 'Low' | 'Medium' | 'High';

export interface Dog {
  id: string;
  name: string;
  breed: DogBreed;
  size: DogSize;
  age: number; // in years
  personalities: DogPersonality[];
  activityLevel: DogActivityLevel;
  description: string;
  imageUrls: string[];
  ownerId: string;
  ownerType: 'Individual' | 'Shelter';
  hourlyRate: number;
  availableDays: string[]; // ['Monday', 'Tuesday', etc.]
  availableTimeStart: string; // '09:00'
  availableTimeEnd: string; // '17:00'
  location: {
    city: string;
    state: string;
  };
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}