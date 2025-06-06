export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'Renter' | 'Owner' | 'Admin'
          profile_pic_url: string | null
          bio: string | null
          city: string | null
          state: string | null
          phone: string | null
          is_verified: boolean
          dating_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role?: 'Renter' | 'Owner' | 'Admin'
          profile_pic_url?: string | null
          bio?: string | null
          city?: string | null
          state?: string | null
          phone?: string | null
          is_verified?: boolean
          dating_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'Renter' | 'Owner' | 'Admin'
          profile_pic_url?: string | null
          bio?: string | null
          city?: string | null
          state?: string | null
          phone?: string | null
          is_verified?: boolean
          dating_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      dogs: {
        Row: {
          id: string
          name: string
          breed: string
          size: 'Small' | 'Medium' | 'Large'
          age: number
          personalities: string[]
          activity_level: 'Low' | 'Medium' | 'High'
          description: string
          image_urls: string[]
          owner_id: string
          owner_type: 'Individual' | 'Shelter'
          hourly_rate: number
          available_days: string[]
          available_time_start: string
          available_time_end: string
          city: string
          state: string
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          breed: string
          size: 'Small' | 'Medium' | 'Large'
          age: number
          personalities: string[]
          activity_level: 'Low' | 'Medium' | 'High'
          description: string
          image_urls: string[]
          owner_id: string
          owner_type?: 'Individual' | 'Shelter'
          hourly_rate: number
          available_days: string[]
          available_time_start: string
          available_time_end: string
          city: string
          state: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          breed?: string
          size?: 'Small' | 'Medium' | 'Large'
          age?: number
          personalities?: string[]
          activity_level?: 'Low' | 'Medium' | 'High'
          description?: string
          image_urls?: string[]
          owner_id?: string
          owner_type?: 'Individual' | 'Shelter'
          hourly_rate?: number
          available_days?: string[]
          available_time_start?: string
          available_time_end?: string
          city?: string
          state?: string
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          dog_id: string
          renter_id: string
          owner_id: string
          start_time: string
          end_time: string
          status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
          total_amount: number
          payment_status: 'Pending' | 'Paid' | 'Refunded'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          dog_id: string
          renter_id: string
          owner_id: string
          start_time: string
          end_time: string
          status?: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
          total_amount: number
          payment_status?: 'Pending' | 'Paid' | 'Refunded'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          dog_id?: string
          renter_id?: string
          owner_id?: string
          start_time?: string
          end_time?: string
          status?: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
          total_amount?: number
          payment_status?: 'Pending' | 'Paid' | 'Refunded'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          reviewer_id: string
          reviewed_id: string
          reviewed_type: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          reviewer_id: string
          reviewed_id: string
          reviewed_type: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          reviewer_id?: string
          reviewed_id?: string
          reviewed_type?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          is_read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'Renter' | 'Owner' | 'Admin'
      dog_size: 'Small' | 'Medium' | 'Large'
      activity_level: 'Low' | 'Medium' | 'High'
      booking_status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
      payment_status: 'Pending' | 'Paid' | 'Refunded'
      owner_type: 'Individual' | 'Shelter'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}