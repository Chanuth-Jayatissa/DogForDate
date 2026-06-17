# DogForDate

DogForDate is an Expo mobile app for discovering dogs, filtering by traits, favoriting profiles, and supporting booking-style dog meetup flows. It is an earlier dog-discovery/mobile marketplace prototype with Supabase-backed data hooks.

## Features

- Dog discovery screen with search by name, breed, or location.
- Filters for size, personality, activity level, and price range.
- Favorite toggles for dog profiles.
- Booking, messages, and profile tab structure.
- Supabase integration through public Expo environment variables.
- Responsive list/grid layout for mobile and wider screens.

## Tech Stack

- Expo 53 and React Native 0.79
- Expo Router
- TypeScript
- Supabase JS
- React Navigation
- date-fns
- Lucide React Native

## Project Structure

- app/(tabs) - discover, bookings, messages, and profile flows
- app/(auth) - login/signup and role selection screens
- app/booking - booking creation/detail screens
- hooks/useDogs.ts - dog data loading hook
- lib/supabase.ts - Supabase client setup
- types/env.d.ts - expected Expo public env values

## Getting Started

Install dependencies and start Expo:

~~~bash
npm install
npm run dev
~~~

Create environment variables for Supabase-backed features:

~~~bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_API_URL=your_api_url
EXPO_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
~~~

## Useful Commands

~~~bash
npm run dev
npm run start
npm run build:web
npm run lint
~~~

## Status

Mobile prototype. PuppyLove appears to be the newer, more polished dog-centered concept; this repo is still useful as an earlier Supabase/Expo discovery and booking implementation.
