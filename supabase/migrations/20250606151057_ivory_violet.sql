/*
  # Add Sample Data

  1. Sample Data
    - Add sample users
    - Add sample dogs
    - Add sample bookings
    - Add sample reviews
    - Add sample conversations and messages

  2. Notes
    - This is for development/testing purposes
    - Uses realistic data for demonstration
*/

-- Insert sample users
INSERT INTO users (id, email, name, role, profile_pic_url, bio, city, state, is_verified, dating_enabled) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john.smith@example.com', 'John Smith', 'Owner', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg', 'Dog lover and experienced owner. I have been caring for dogs for over 10 years.', 'San Francisco', 'CA', true, false),
('550e8400-e29b-41d4-a716-446655440002', 'emily.johnson@example.com', 'Emily Johnson', 'Owner', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg', 'Professional dog trainer and shelter volunteer.', 'Los Angeles', 'CA', true, true),
('550e8400-e29b-41d4-a716-446655440003', 'mike.wilson@example.com', 'Mike Wilson', 'Renter', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg', 'Dog enthusiast who loves taking dogs on adventures!', 'San Francisco', 'CA', false, true),
('550e8400-e29b-41d4-a716-446655440004', 'sarah.davis@example.com', 'Sarah Davis', 'Owner', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg', 'Shelter manager with 15+ years of experience.', 'New York', 'NY', true, false),
('550e8400-e29b-41d4-a716-446655440005', 'alex.brown@example.com', 'Alex Brown', 'Renter', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg', 'Outdoor enthusiast who loves hiking with dogs.', 'Seattle', 'WA', true, true);

-- Insert sample dogs
INSERT INTO dogs (id, name, breed, size, age, personalities, activity_level, description, image_urls, owner_id, owner_type, hourly_rate, available_days, available_time_start, available_time_end, city, state, is_verified) VALUES
('dog-550e8400-e29b-41d4-a716-446655440001', 'Buddy', 'Labrador Retriever', 'Large', 3, ARRAY['Friendly', 'Energetic', 'Playful'], 'High', 'Buddy is a friendly Labrador who loves to play fetch and go for long walks. He is great with children and other dogs, and enjoys being around people. Buddy is well-trained and responds to basic commands.', ARRAY['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg', 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg'], '550e8400-e29b-41d4-a716-446655440001', 'Individual', 25, ARRAY['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'], '09:00', '17:00', 'San Francisco', 'CA', true),

('dog-550e8400-e29b-41d4-a716-446655440002', 'Luna', 'French Bulldog', 'Small', 2, ARRAY['Calm', 'Affectionate', 'Shy'], 'Low', 'Luna is a sweet French Bulldog who enjoys cuddles and short walks. She is perfect for someone looking for a calm companion for indoor activities or gentle strolls around the neighborhood.', ARRAY['https://images.pexels.com/photos/4587971/pexels-photo-4587971.jpeg'], '550e8400-e29b-41d4-a716-446655440002', 'Individual', 30, ARRAY['Tuesday', 'Thursday', 'Saturday', 'Sunday'], '10:00', '16:00', 'Los Angeles', 'CA', true),

('dog-550e8400-e29b-41d4-a716-446655440003', 'Max', 'German Shepherd', 'Large', 4, ARRAY['Protective', 'Energetic', 'Social'], 'High', 'Max is a well-trained German Shepherd who loves to run and play. He is protective but friendly, making him a great companion for active individuals. Max enjoys hiking and outdoor adventures.', ARRAY['https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg'], '550e8400-e29b-41d4-a716-446655440004', 'Shelter', 20, ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], '08:00', '18:00', 'New York', 'NY', true),

('dog-550e8400-e29b-41d4-a716-446655440004', 'Daisy', 'Beagle', 'Medium', 2, ARRAY['Playful', 'Energetic', 'Friendly'], 'Medium', 'Daisy is a curious Beagle who loves to explore and play with toys. She has a great nose for adventure and enjoys discovering new places. Daisy is friendly with everyone she meets.', ARRAY['https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg'], '550e8400-e29b-41d4-a716-446655440002', 'Individual', 22, ARRAY['Wednesday', 'Thursday', 'Friday', 'Saturday'], '10:00', '16:00', 'Los Angeles', 'CA', false),

('dog-550e8400-e29b-41d4-a716-446655440005', 'Charlie', 'Golden Retriever', 'Large', 5, ARRAY['Calm', 'Friendly', 'Affectionate'], 'Medium', 'Charlie is a gentle Golden Retriever who loves people and other dogs. He is perfect for families or individuals looking for a loving companion. Charlie enjoys both active play and relaxing cuddle sessions.', ARRAY['https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg'], '550e8400-e29b-41d4-a716-446655440001', 'Individual', 28, ARRAY['Monday', 'Tuesday', 'Saturday', 'Sunday'], '09:00', '17:00', 'San Francisco', 'CA', true),

('dog-550e8400-e29b-41d4-a716-446655440006', 'Bella', 'Poodle', 'Medium', 3, ARRAY['Social', 'Playful', 'Affectionate'], 'Medium', 'Bella is a smart Poodle who loves to learn tricks and play. She is very social and enjoys meeting new people and dogs. Bella is hypoallergenic and great for people with allergies.', ARRAY['https://images.pexels.com/photos/5731812/pexels-photo-5731812.jpeg'], '550e8400-e29b-41d4-a716-446655440004', 'Shelter', 24, ARRAY['Tuesday', 'Wednesday', 'Thursday', 'Friday'], '10:00', '15:00', 'New York', 'NY', false);

-- Insert sample bookings
INSERT INTO bookings (id, dog_id, renter_id, owner_id, start_time, end_time, status, total_amount, payment_status, notes) VALUES
('booking-550e8400-e29b-41d4-a716-446655440001', 'dog-550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '2025-01-20T10:00:00Z', '2025-01-20T12:00:00Z', 'Confirmed', 55, 'Paid', 'Looking forward to meeting Buddy!'),

('booking-550e8400-e29b-41d4-a716-446655440002', 'dog-550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004', '2025-01-22T14:00:00Z', '2025-01-22T16:00:00Z', 'Pending', 45, 'Pending', 'Would love to take Max to the park.'),

('booking-550e8400-e29b-41d4-a716-446655440003', 'dog-550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '2025-01-18T11:00:00Z', '2025-01-18T13:00:00Z', 'Completed', 65, 'Paid', 'Had a great time with Luna!');

-- Insert sample reviews
INSERT INTO reviews (id, booking_id, reviewer_id, reviewed_id, reviewed_type, rating, comment) VALUES
('review-550e8400-e29b-41d4-a716-446655440001', 'booking-550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'dog-550e8400-e29b-41d4-a716-446655440002', 'Dog', 5, 'Luna was absolutely wonderful! So calm and sweet, perfect for a relaxing afternoon.'),

('review-550e8400-e29b-41d4-a716-446655440002', 'booking-550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Owner', 5, 'Emily was very communicative and helpful. Great dog owner!'),

('review-550e8400-e29b-41d4-a716-446655440003', 'booking-550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Renter', 4, 'Mike took great care of Luna and followed all instructions perfectly.');

-- Insert sample conversations
INSERT INTO conversations (id, user1_id, user2_id) VALUES
('conv-550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001'),
('conv-550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440004'),
('conv-550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002');

-- Insert sample messages
INSERT INTO messages (id, conversation_id, sender_id, content, is_read) VALUES
('msg-550e8400-e29b-41d4-a716-446655440001', 'conv-550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Hi! I would love to book Buddy for this weekend.', true),
('msg-550e8400-e29b-41d4-a716-446655440002', 'conv-550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'That sounds great! Buddy would love to spend time with you.', true),
('msg-550e8400-e29b-41d4-a716-446655440003', 'conv-550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Buddy is excited to meet you tomorrow!', false),

('msg-550e8400-e29b-41d4-a716-446655440004', 'conv-550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'Is Max available for a hike this weekend?', true),
('msg-550e8400-e29b-41d4-a716-446655440005', 'conv-550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440004', 'Yes! Max loves hiking. What time works for you?', false),

('msg-550e8400-e29b-41d4-a716-446655440006', 'conv-550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Thank you for letting me spend time with Luna!', true),
('msg-550e8400-e29b-41d4-a716-446655440007', 'conv-550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'You are welcome! Luna had a wonderful time.', true);