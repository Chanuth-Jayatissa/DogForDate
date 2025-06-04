export type BookingStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Cancelled' 
  | 'Completed';

export interface Booking {
  id: string;
  dogId: string;
  renterId: string;
  ownerId: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  notes: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}