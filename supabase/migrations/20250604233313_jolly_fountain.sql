/*
  # Initial Schema Setup

  1. New Tables
    - users
      - Core user information and profile data
      - Extends Supabase auth.users
    - dogs
      - Dog listings with details and availability
    - bookings
      - Booking records between renters and dogs
    - reviews
      - Reviews for dogs, owners, and renters
    - messages
      - Individual messages in conversations
    - conversations
      - Conversation metadata between users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Ensure proper data access control
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('Renter', 'Owner', 'Admin');
CREATE TYPE dog_size AS ENUM ('Small', 'Medium', 'Large');
CREATE TYPE activity_level AS ENUM ('Low', 'Medium', 'High');
CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'Cancelled', 'Completed');
CREATE TYPE payment_status AS ENUM ('Pending', 'Paid', 'Refunded');
CREATE TYPE owner_type AS ENUM ('Individual', 'Shelter');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  role user_role NOT NULL DEFAULT 'Renter',
  profile_pic_url TEXT,
  bio TEXT,
  city TEXT,
  state TEXT,
  phone TEXT,
  is_verified BOOLEAN DEFAULT false,
  dating_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create dogs table
CREATE TABLE IF NOT EXISTS dogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  size dog_size NOT NULL,
  age INTEGER NOT NULL,
  personalities TEXT[] NOT NULL,
  activity_level activity_level NOT NULL,
  description TEXT NOT NULL,
  image_urls TEXT[] NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id),
  owner_type owner_type NOT NULL DEFAULT 'Individual',
  hourly_rate DECIMAL NOT NULL,
  available_days TEXT[] NOT NULL,
  available_time_start TIME NOT NULL,
  available_time_end TIME NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id UUID NOT NULL REFERENCES dogs(id),
  renter_id UUID NOT NULL REFERENCES users(id),
  owner_id UUID NOT NULL REFERENCES users(id),
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  status booking_status NOT NULL DEFAULT 'Pending',
  total_amount DECIMAL NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  reviewer_id UUID NOT NULL REFERENCES users(id),
  reviewed_id UUID NOT NULL,
  reviewed_type TEXT NOT NULL CHECK (reviewed_type IN ('Dog', 'Owner', 'Renter')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES users(id),
  user2_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Dogs policies
CREATE POLICY "Anyone can read dogs"
  ON dogs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can create dogs"
  ON dogs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id AND EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Owner'
  ));

CREATE POLICY "Owners can update their own dogs"
  ON dogs FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Bookings policies
CREATE POLICY "Users can read their own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "Renters can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = renter_id AND EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'Renter'
  ));

-- Reviews policies
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create reviews for completed bookings"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM bookings
      WHERE id = booking_id
      AND status = 'Completed'
      AND (renter_id = auth.uid() OR owner_id = auth.uid())
    )
  );

-- Conversations policies
CREATE POLICY "Users can read their own conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Messages policies
CREATE POLICY "Users can read messages in their conversations"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM conversations
      WHERE id = conversation_id
      AND (user1_id = auth.uid() OR user2_id = auth.uid())
    )
  );

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_dogs_updated_at
  BEFORE UPDATE ON dogs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();